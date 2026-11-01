using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Windows.Forms;
using System.Threading.Tasks;
using System.Runtime.InteropServices;

namespace DyclokPRO;

/// <summary>
/// One DyclokPRO window, with internal account tabs and each untouched 3.0.7
/// process displayed inside a native HWND host. No changes to vendor ASAR.
/// The principal retains its own Windows profile; auxiliaries use distinct
/// user-data-dir and APPDATA/LOCALAPPDATA paths.
/// </summary>
internal sealed class IntegratedAccountsWindow : Form
{
    private sealed class AccountPage
    {
        internal required string Id;
        internal required TabPage Page;
        internal required EngineWindowHost Host;
        internal required Label Status;
        internal Process? Process;
        internal DateTime StartedUtc;
        internal bool AttemptedExternalFallback;
        internal bool Starting;
        internal bool Closing;
        internal DateTime CloseRequestedUtc;
    }

    private static readonly Color Ink = Color.FromArgb(13, 16, 19);
    private static readonly Color Surface = Color.FromArgb(19, 23, 26);
    private static readonly Color TabIdle = Color.FromArgb(25, 31, 35);
    private static readonly Color Accent = Color.FromArgb(2, 199, 162);
    private readonly TabControl accountTabs = new() {
        Dock = DockStyle.Fill, DrawMode = TabDrawMode.OwnerDrawFixed,
        SizeMode = TabSizeMode.Fixed, ItemSize = new Size(168, 36),
        Appearance = TabAppearance.Normal,
        Padding = new Point(14, 6)
    };
    private readonly FlowLayoutPanel topActions = new() {
        Dock=DockStyle.Right,Width=194,FlowDirection=FlowDirection.RightToLeft,
        WrapContents=false,Padding=new Padding(4,4,0,0),
        BackColor=Ink
    };
    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(IntPtr hwnd,int attribute,
        ref int value,int size);
    private static void DarkTitleBar(IntPtr hwnd){
        try{int dark=1;DwmSetWindowAttribute(hwnd,20,ref dark,sizeof(int));}
        catch(DllNotFoundException){}
        catch(EntryPointNotFoundException){}
    }
    private readonly Dictionary<string, AccountPage> pages = new(StringComparer.Ordinal);
    private readonly System.Windows.Forms.Timer poll = new() { Interval = 600 };
    private SessionDiagnosticsWindow? diagnostic;
    private readonly Panel sidePanel=new(){
        Dock=DockStyle.Right,Width=335,Visible=false,
        BackColor=Color.FromArgb(20,27,31)
    };
    private readonly Process? initial;
    private readonly bool embedSmoke;
    private readonly bool twoTabSmoke;
    private int smokePhase;
    private string? smokeSecondaryId;
    private int smokePrincipalPid;
    private int smokeSecondaryPid;
    internal bool SmokeSucceeded { get; private set; }
    private bool closing;
    private bool starting;
    private bool rebuildingTabs;
    private int initialTabCount;
    private int firstTick;
    private readonly Label overall = new() {
        Dock = DockStyle.Bottom, Height = 30, ForeColor = Color.Khaki,
        Text = "Motor oficial 3.0.7 intacto · cuentas aisladas · interfaz integrada",
        Padding = new Padding(12, 6, 3, 3)
    };

    internal IntegratedAccountsWindow(Process? initial, bool embedSmoke=false,bool twoTabSmoke=false)
    {
        this.initial = initial;
        this.embedSmoke=embedSmoke;
        this.twoTabSmoke=twoTabSmoke;
        Text = "DyclokPRO  ·  DICloak 3.0.7";
        Width = 1280; Height = 820; MinimumSize = new Size(800, 560);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Ink;
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10);
        SetStyle(ControlStyles.OptimizedDoubleBuffer,true);
        // One slim primary command strip; no second application toolbar,
        // no process PID footer, no separately styled Windows account tabs.
        var bar = new Panel{
            Dock=DockStyle.Top,Height=43,BackColor=Ink,Padding=Padding.Empty
        };
        var brand=new Label {
            Text="DyclokPRO", Dock=DockStyle.Left,Width=158,
            TextAlign=ContentAlignment.MiddleLeft,
            Padding=new Padding(16,0,0,0),
            ForeColor=Color.White,
            Font=new Font("Segoe UI Semibold",11.5f,FontStyle.Bold)
        };
        bar.Controls.Add(topActions);
        bar.Controls.Add(brand);
        var more=TopButton("⋯",38,()=>OpenMenu());
        var add=TopButton("+",42,()=>OpenAccountPicker());
        topActions.Controls.Add(more);
        topActions.Controls.Add(add);
        topActions.Width=94;

        accountTabs.BackColor=Ink;
        accountTabs.ForeColor=Color.White;
        accountTabs.DrawItem+=DrawTab;
        accountTabs.Deselecting+=(_, e)=>{
            if(e.TabPage is null)return;
            foreach(var page in pages.Values)
                if(ReferenceEquals(page.Page,e.TabPage)){
                    page.Host.RememberKeyboardFocus();
                    break;
                }
        };
        // The tab itself receives focus on mouse selection. Restore the
        // provider's HWND after WinForms finishes its tab-change message.
        Activated+=(_,_)=>ScheduleAccountFocus();
        accountTabs.SelectedIndexChanged += (_, _) => {
            OnAccountSelected();
            accountTabs.Invalidate();
        };
        accountTabs.MouseDown += (_, args) => {
            if(args.Button != MouseButtons.Left) return;
            for(int i=0;i<accountTabs.TabCount;i++){
                var rect=accountTabs.GetTabRect(i);
                if(CloseButtonRect(rect).Contains(args.Location)){
                    var tab=accountTabs.TabPages[i];
                    var page=pages.Values.FirstOrDefault(p=>ReferenceEquals(p.Page,tab));
                    if(page is not null)CloseAccount(page.Id);
                    return;
                }
            }
        };
        accountTabs.MouseUp += (_, args) => {
            if(args.Button==MouseButtons.Right){
                for(int i=0;i<accountTabs.TabCount;i++)
                    if(accountTabs.GetTabRect(i).Contains(args.Location)){
                        accountTabs.SelectedIndex=i;
                        OpenMenu();
                        break;
                    }
            }
        };
        Controls.Add(accountTabs);
        Controls.Add(sidePanel);
        Controls.Add(bar);
        Shown += (_, _) => {
            DarkTitleBar(Handle);
            Start();
        };
        poll.Tick += (_, _) => Tick();
        FormClosing += (_, _) => {
            closing = true;
            poll.Stop();
            foreach(var p in pages.Values) p.Host.Detach();
            if(diagnostic is not null && !diagnostic.IsDisposed) diagnostic.Close();
            // Smoke-only teardown: CI must not leave a DICloak singleton
            // running that contaminates the next multi-account check.
            if(embedSmoke){
                foreach(var page in pages.Values){
                    if(page.Process is null)continue;
                    try{if(!page.Process.HasExited)page.Process.Kill(entireProcessTree:true);}
                    catch(InvalidOperationException){}
                    catch(System.ComponentModel.Win32Exception){}
                }
            }
            // Production: official account sessions remain running.
        };
        FormClosed += (_, _) => poll.Dispose();
    }

    private static Button TopButton(string label,int width,Action action){
        var button=new Button {
            Text=label,Width=width,Height=31,FlatStyle=FlatStyle.Flat,
            Margin=new Padding(4,1,0,0),
            ForeColor=Color.FromArgb(225,232,232),
            BackColor=Color.FromArgb(31,42,45),
            Font=new Font("Segoe UI",9f),TabStop=false
        };
        button.FlatAppearance.BorderSize=0;
        button.FlatAppearance.MouseOverBackColor=Color.FromArgb(40,70,70);
        button.Click+=(_,_)=>action();
        return button;
    }
    private void DrawTab(object? sender,DrawItemEventArgs e){
        if(e.Index<0||e.Index>=accountTabs.TabCount)return;
        var rect=accountTabs.GetTabRect(e.Index);
        bool active=e.Index==accountTabs.SelectedIndex;
        using var bg=new SolidBrush(active?Surface:TabIdle);
        e.Graphics.FillRectangle(bg,rect);
        var border=new Rectangle(rect.Left,rect.Bottom-3,rect.Width,3);
        if(active){
            using var brush=new SolidBrush(Accent);
            e.Graphics.FillRectangle(brush,border);
        }
        string label=accountTabs.TabPages[e.Index].Text;
        var textRect=new Rectangle(rect.Left+13,rect.Top+1,rect.Width-46,rect.Height-6);
        using var labelFont=new Font("Segoe UI",9.3f,
            active?FontStyle.Bold:FontStyle.Regular);
        TextRenderer.DrawText(e.Graphics,label,labelFont,textRect,
            active?Color.White:Color.FromArgb(174,190,193),
            TextFormatFlags.EndEllipsis|TextFormatFlags.VerticalCenter|
            TextFormatFlags.SingleLine|TextFormatFlags.NoPrefix);
        TextRenderer.DrawText(e.Graphics,"×",Font,CloseButtonRect(rect),
            active?Color.FromArgb(219,234,234):Color.FromArgb(137,159,159),
            TextFormatFlags.HorizontalCenter|TextFormatFlags.VerticalCenter|
            TextFormatFlags.NoPrefix);
    }
    private static Rectangle CloseButtonRect(Rectangle tab) =>
        new(tab.Right-29,tab.Top+5,25,Math.Max(18,tab.Height-11));
    private void OpenMenu(){
        var menu=new ContextMenuStrip {
            BackColor=Color.FromArgb(24,30,35),ForeColor=Color.White,
            Renderer=new ToolStripProfessionalRenderer()
        };
        menu.Items.Add("Cambiar nombre de cuenta",null,(_,_)=>RenameActive());
        menu.Items.Add("Abrir otra cuenta",null,(_,_)=>OpenAccountPicker());
        menu.Items.Add("Cerrar cuenta seleccionada",null,(_,_)=>CloseAccount(ActiveId));
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Perfiles (API oficial)",null,(_,_)=>ShowProfiles());
        menu.Items.Add("Panel de diagnóstico",null,(_,_)=>ToggleDiagnostics());
        menu.Items.Add("Capturar conexiones originales (KAIZEN)",null,
            (_,_)=>OpenConnectionDiagnostics());
        menu.Items.Add("Archivos y exportaciones",null,(_,_)=>ShowFiles());
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Mostrar título original de DICloak",null,(_,_)=>ToggleOriginalHeader());
        menu.Items.Add("Activar escritura en esta cuenta",null,(_,_)=>ScheduleAccountFocus());
        menu.Items.Add("Abrir cuenta en ventana externa",null,(_,_)=>OpenExternal());
        menu.Show(topActions,new Point(4,topActions.Height));
    }
    private void OpenAccountPicker(){
        var menu=new ContextMenuStrip{
            BackColor=Color.FromArgb(24,30,35),ForeColor=Color.White,
            ShowImageMargin=false
        };
        var unopened=AccountStore.Get().Where(a=>!pages.ContainsKey(a.Id)).ToArray();
        if(unopened.Length==0){
            menu.Items.Add(new ToolStripMenuItem("Todas las cuentas guardadas están abiertas"){Enabled=false});
        }else{
            foreach(var account in unopened){
                string id=account.Id;
                menu.Items.Add(account.Name,null,(_,_)=>ShowSavedAccount(id));
            }
        }
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Nueva cuenta…",null,(_,_)=>AddUser());
        menu.Show(topActions,new Point(0,topActions.Height));
    }
    private void ShowSavedAccount(string id){
        // The saved account is not an open session until the user chooses it.
        EnsureOpenAccount(id);
        Select(id);
    }
    private void ToggleOriginalHeader(){
        if(!pages.TryGetValue(ActiveId,out var entry))return;
        entry.Host.HideInnerTitle=!entry.Host.HideInnerTitle;
        entry.Host.ResizeEmbedded();
    }
    private string ActiveId
    {
        get
        {
            foreach(var page in pages.Values)
                if(ReferenceEquals(page.Page,accountTabs.SelectedTab))
                    return page.Id;
            return "legacy";
        }
    }

    private void Start()
    {
        starting=true;
        try{
            // Show our OWN interface first. The principal engine starts only
            // after the account's host panel is already visible.
            var principal=EnsureOpenAccount("legacy",select:false);
            if(initial is not null){
                SessionDiagnostics.Observe(initial,"legacy");
                principal.Process=initial;
                principal.StartedUtc=DateTime.UtcNow;
            }
            principal.Status.Text="Conectando al motor oficial 3.0.7…";
            initialTabCount=accountTabs.TabCount;
            if(twoTabSmoke)
                smokeSecondaryId=AccountStore.Get().FirstOrDefault(a=>a.Id!="legacy")?.Id;
        }catch(Exception ex){
            ShowFatalStartError(ex);
            return;
        }finally{starting=false;}
        Select("legacy"); // Launch/reuse only when UI exists.
        poll.Start();
    }
    private void ShowFatalStartError(Exception ex){
        // A broken account registry or a failed engine guard must never yield
        // an empty, apparently healthy white DyclokPRO window.
        var failure=new Label{
            Dock=DockStyle.Fill,BackColor=Surface,ForeColor=Color.FromArgb(235,171,124),
            TextAlign=ContentAlignment.MiddleCenter,Padding=new Padding(36),
            Text="DyclokPRO no pudo recuperar la sesión principal.\n\n"+
                ex.Message+"\n\nNo se borraron las cuentas. "+
                "Comprueba el diagnóstico antes de volver a iniciar."
        };
        Controls.Add(failure);
        failure.BringToFront();
        SessionDiagnostics.Record("START_FAILED","legacy");
    }

    private AccountPage EnsureOpenAccount(string id,bool select=true)
    {
        if(pages.TryGetValue(id,out var existing)){
            if(select)accountTabs.SelectedTab=existing.Page;
            return existing;
        }
        var account=AccountStore.Get().FirstOrDefault(x=>x.Id==id)
            ??throw new InvalidOperationException("Cuenta local no encontrada.");
        var tab=new TabPage(account.Name){
            BackColor=Surface,ForeColor=Color.White,Padding=Padding.Empty,
            UseVisualStyleBackColor=false
        };
        var host=new EngineWindowHost();
        var status=new Label{
            Dock=DockStyle.Fill,TextAlign=ContentAlignment.MiddleCenter,
            ForeColor=Color.FromArgb(177,190,194),BackColor=Surface,
            Font=new Font("Segoe UI",11f),
            Text="Preparando cuenta…"
        };
        tab.Controls.Add(host);
        tab.Controls.Add(status);
        status.BringToFront();
        var entry=new AccountPage{Id=id,Page=tab,Host=host,Status=status};
        pages.Add(id,entry);
        bool old=rebuildingTabs;
        rebuildingTabs=true;
        try{
            accountTabs.TabPages.Add(tab);
            if(select)accountTabs.SelectedTab=tab;
        }finally{rebuildingTabs=old;}
        accountTabs.Invalidate();
        return entry;
    }
    private void RefreshAccounts()
    {
        // Refresh ONLY labels of visible sessions. No new TabPage here.
        var names=AccountStore.Get().ToDictionary(x=>x.Id,x=>x.Name,StringComparer.Ordinal);
        foreach(var p in pages.Values)
            if(names.TryGetValue(p.Id,out var name))p.Page.Text=name;
        accountTabs.Invalidate();
    }

    private void Select(string id)
    {
        if(pages.TryGetValue(id,out var page))
            accountTabs.SelectedTab = page.Page;
        OnAccountSelected();
    }

    private void OnAccountSelected()
    {
        if(closing || starting || rebuildingTabs || !IsHandleCreated || pages.Count==0) return;
        string id=ActiveId;
        if(!pages.TryGetValue(id,out var entry)||entry.Closing)return;
        if(entry.Process is null || HasExited(entry.Process))
        {
            if(id=="legacy" && entry.Process is not null){
                entry.Status.Text="La aplicación oficial principal ha terminado; vuelve a abrir la pestaña para reiniciar.";
            }
            OpenAccount(id);
            return;
        }
        UpdateHost(entry);
        ScheduleAccountFocus();
    }

    private void ScheduleAccountFocus(){
        if(closing||starting||!IsHandleCreated||sidePanel.Visible||!Visible)return;
        if(!pages.TryGetValue(ActiveId,out var entry)||!entry.Host.IsEmbedded)return;
        string selectedId=entry.Id;
        BeginInvoke(new Action(()=>{
            if(closing||IsDisposed||!Visible||sidePanel.Visible)return;
            if(ActiveId!=selectedId||!entry.Host.IsEmbedded)return;
            // Only run on deliberate UI activation, never on the 600ms poll.
            // Avoid capturing keyboard content; only transfer Win32 focus.
            entry.Host.RestoreKeyboardFocus();
        }));
    }

    protected override bool ProcessCmdKey(ref Message msg,Keys keyData){
        if(keyData==(Keys.Control|Keys.Alt|Keys.F)){
            ScheduleAccountFocus();
            return true;
        }
        return base.ProcessCmdKey(ref msg,keyData);
    }

    private static bool HasExited(Process p)
    {
        try { p.Refresh();return p.HasExited; }
        catch(InvalidOperationException) {return true;}
    }

    private async void OpenAccount(string id)
    {
        if(!pages.TryGetValue(id,out var entry)||closing||entry.Starting)return;
        if(entry.Process is not null && !HasExited(entry.Process)){
            UpdateHost(entry);
            ScheduleAccountFocus();
            return;
        }
        entry.Starting=true;
        entry.Status.Visible=true;
        entry.Status.Text="Abriendo "+(id=="legacy"?"cuenta principal":"sesión independiente")+"…";
        // SHA256 verification and Windows process launch were synchronous in
        // v6.39. They blocked the entire tab UI, so run them off the UI thread.
        Process? launched=null;
        try
        {
            launched=await Task.Run(()=>BrowserRibbon.StartNative(id));
            if(closing||IsDisposed){
                // A native process that already launched must retain its
                // independent user data, not be abruptly logged out.
                launched.Dispose();
                return;
            }
            entry.Process?.Dispose();
            entry.Process=launched;
            SessionDiagnostics.Observe(launched,id);
            entry.StartedUtc=DateTime.UtcNow;
            entry.AttemptedExternalFallback=false;
            entry.Status.Text="Integrando ventana oficial 3.0.7…";
            if(ActiveId==id)UpdateHost(entry);
        }
        catch(Exception ex){
            if(!closing&&!IsDisposed){
                entry.Status.Visible=true;
                entry.Status.Text="No se pudo iniciar la cuenta: "+ex.Message;
                SessionDiagnostics.Record("START_FAILED",id);
            }
        }
        finally {
            entry.Starting=false;
        }
    }

    private void AddUser()
    {
        string? alias=Microsoft.VisualBasic.Interaction.InputBox(
            "Nombre para identificar la cuenta (2–80 caracteres)",
            "Nueva cuenta de DyclokPRO","Cuenta nueva");
        if(string.IsNullOrWhiteSpace(alias))return;
        try{
            if(alias.Trim().Length is <2 or >80 || alias.Any(char.IsControl))
                throw new ArgumentException("Nombre: entre 2 y 80 caracteres.");
            var account=AccountStore.Create();
            AccountStore.SaveName(account.Id,alias.Trim());
            EnsureOpenAccount(account.Id);
            Select(account.Id);
        }catch(Exception ex){
            MessageBox.Show(this,ex.Message,"No se pudo agregar la cuenta");
        }
    }

    // Tabs represent RUNNING processes, not saved accounts. The provider
    // receives a normal WM_CLOSE and controls its own shutdown/session state.
    // Never delete account data or forcibly terminate without consent.
    [DllImport("user32.dll",SetLastError=true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool PostMessage(IntPtr hwnd,uint msg,IntPtr wp,IntPtr lp);
    private const uint WM_CLOSE=0x0010;

    private void CloseAccount(string id){
        if(!pages.TryGetValue(id,out var entry))return;
        if(entry.Starting){
            MessageBox.Show(this,"La cuenta sigue iniciándose. Intenta cerrarla cuando aparezca su ventana.",
                "Cuenta iniciándose",MessageBoxButtons.OK,MessageBoxIcon.Information);
            return;
        }
        if(entry.Process is null || HasExited(entry.Process)){
            RemoveOpenTab(id);
            return;
        }
        if(entry.Closing){
            var force=MessageBox.Show(this,
                "La cuenta aún no finalizó. ¿Forzar el cierre del proceso?\n\n"+
                "Esto puede perder datos de navegación no guardados. No borra la cuenta.",
                "La cuenta sigue abierta",MessageBoxButtons.YesNo,MessageBoxIcon.Warning);
            if(force==DialogResult.Yes){
                try{entry.Process.Kill(entireProcessTree:true);}
                catch(InvalidOperationException){}
                catch(System.ComponentModel.Win32Exception){
                    MessageBox.Show(this,"Windows no permitió finalizar esa cuenta.");
                }
            }
            return;
        }
        if(MessageBox.Show(this,
            "¿Cerrar esta cuenta? Su pestaña desaparecerá cuando DICloak termine.\n"+
            "La cuenta y sus archivos seguirán disponibles desde el botón +.",
            "Cerrar "+Name(id),MessageBoxButtons.YesNo,MessageBoxIcon.Question)!=DialogResult.Yes)
            return;
        // A reparented HWND can be missing from Process.MainWindowHandle.
        // Prefer posting to the verified provider window actually embedded.
        bool posted=false;
        if(entry.Host.ProviderHwnd!=IntPtr.Zero){
            posted=PostMessage(entry.Host.ProviderHwnd,WM_CLOSE,IntPtr.Zero,IntPtr.Zero);
        }
        if(!posted){
            try{posted=entry.Process.CloseMainWindow();}
            catch(InvalidOperationException){}
        }
        if(!posted){
            MessageBox.Show(this,
                "No se pudo solicitar el cierre a DICloak. Abre la ventana externa y ciérrala desde allí.",
                "Ventana no disponible",MessageBoxButtons.OK,MessageBoxIcon.Warning);
            return;
        }
        entry.Closing=true;
        entry.CloseRequestedUtc=DateTime.UtcNow;
        entry.Status.Visible=true;
        entry.Status.Text="Cerrando cuenta…";
    }

    private void RemoveOpenTab(string id){
        if(!pages.TryGetValue(id,out var entry))return;
        bool old=rebuildingTabs;
        rebuildingTabs=true;
        try{
            // Unparent first so disposing the host cannot destroy the native
            // DICloak HWND; it should already have exited for normal closure.
            entry.Host.Detach();
            pages.Remove(id);
            accountTabs.TabPages.Remove(entry.Page);
            entry.Page.Dispose();
            entry.Process?.Dispose();
        }finally{rebuildingTabs=old;}
        accountTabs.Invalidate();
        if(pages.Count>0 && accountTabs.SelectedTab is not null)
            OnAccountSelected();
    }

    private void RenameActive()
    {
        string id=ActiveId;
        var account=AccountStore.Get().FirstOrDefault(x=>x.Id==id);
        string? text=Microsoft.VisualBasic.Interaction.InputBox(
            "Nombre de la cuenta (2 a 80 caracteres)","Renombrar cuenta",
            account?.Name ?? "Cuenta");
        if(string.IsNullOrWhiteSpace(text))return;
        try
        {
            AccountStore.SaveName(id,text);
            if(pages.TryGetValue(id,out var page))page.Page.Text=text.Trim();
        }
        catch(Exception ex){MessageBox.Show(this,ex.Message,"No se guardó el nombre");}
    }

    private void Tick()
    {
        if(closing)return;
        firstTick++;
        // A native DICloak window can close itself, including from its own X.
        // Keep open tabs synchronized with actual Windows process lifetime.
        if(!embedSmoke){
            foreach(var stale in pages.Values.ToArray()){
                if(stale.Process is null || stale.Starting)continue;
                if(HasExited(stale.Process)){
                    RemoveOpenTab(stale.Id);
                    continue;
                }
                if(stale.Closing && DateTime.UtcNow-stale.CloseRequestedUtc>TimeSpan.FromSeconds(8)){
                    stale.Status.Visible=true;
                    stale.Status.Text="DICloak sigue abierto. Pulsa × para confirmar un cierre forzado.";
                }
            }
        }
        if(!pages.TryGetValue(ActiveId,out var entry))return;
        if(!entry.Closing)UpdateHost(entry);
        if(twoTabSmoke){
            // Proves actual visual tab switching, not merely two Process.Start
            // PIDs. The CI creates a disposable auxiliary account beforehand.
            if(smokePhase==0 && entry.Id=="legacy" && entry.Host.IsEmbedded){
                smokePrincipalPid=entry.Process?.Id??0;
                if(smokeSecondaryId is not null){
                    EnsureOpenAccount(smokeSecondaryId);
                    smokePhase=1;
                    Select(smokeSecondaryId);
                    return;
                }
            }
            if(smokePhase==1 && entry.Id==smokeSecondaryId && entry.Host.IsEmbedded){
                smokeSecondaryPid=entry.Process?.Id??0;
                smokePhase=2;
                Select("legacy");
                return;
            }
            if(smokePhase==2 && entry.Id=="legacy" && entry.Host.IsEmbedded){
                var aux=pages.Values.FirstOrDefault(p=>p.Id==smokeSecondaryId);
                SmokeSucceeded=aux is not null && aux.Host.IsEmbedded
                    && smokePrincipalPid>0 && smokeSecondaryPid>0
                    && smokePrincipalPid!=smokeSecondaryPid
                    && initialTabCount==1 && accountTabs.TabCount==2;
                if(SmokeSucceeded && aux?.Process is not null){
                    // CI only: simulate closing a disposable account; assert
                    // the opened tab disappears while its saved registry remains.
                    try{
                        if(!aux.Process.HasExited)aux.Process.Kill(entireProcessTree:true);
                        aux.Process.WaitForExit(3000);
                    }catch(InvalidOperationException){}
                    catch(System.ComponentModel.Win32Exception){}
                    RemoveOpenTab(aux.Id);
                }
                RecordSmokeResult(true);
                Close();
                return;
            }
            if(firstTick>=90){
                SmokeSucceeded=false;
                RecordSmokeResult(true);
                Close();
            }
            return;
        }
        if(embedSmoke && (entry.Host.IsEmbedded || firstTick>=32)){
            SmokeSucceeded=entry.Host.IsEmbedded;
            RecordSmokeResult(false);
            Close();
            return;
        }
        if(entry.Process is not null && HasExited(entry.Process) && !entry.AttemptedExternalFallback)
        {
            entry.AttemptedExternalFallback=true;
            entry.Status.Text = "El motor finalizó sin abrir una ventana. Puede existir un bloqueo de instancia única.";
            overall.Text = "No se ha creado otra sesión. Consulta Diagnóstico; no se reutiliza la primera cuenta.";
        }
    }

    private void RecordSmokeResult(bool switched){
        try {
            File.WriteAllText(Path.Combine(Path.GetTempPath(),
                switched?"dyclokpro-v643-two-tabs.json":"dyclokpro-v643-embedded-window.json"),
                JsonSerializer.Serialize(new {
                    integratedHostShown=true,
                    originalMotorChildWindowAttached=SmokeSucceeded,
                    verifiedTwoTabs=switched && SmokeSucceeded,
                    principalPid=smokePrincipalPid,
                    secondaryPid=smokeSecondaryPid,
                    activeAccountId=switched?ActiveId:"legacy",
                    internalTabCount=accountTabs.TabCount,
                    initialTabCount,
                    savedAccountsCount=AccountStore.Get().Count,
                    closedAccountTabRemoved=switched && SmokeSucceeded &&
                        pages.Count==1 && accountTabs.TabCount==1,
                    accountSessionDataCopied=false
                }));
        }catch(IOException){}
    }
    private void UpdateHost(AccountPage entry)
    {
        if(entry.Process is null || entry.Host.IsEmbedded)return;
        if(HasExited(entry.Process))return;
        if(entry.Host.TryAttach(entry.Process))
        {
            // Once the provider renderer is attached, there is no second
            // footer/status bar; show the original content at full height.
            entry.Status.Visible=false;
            accountTabs.Invalidate();
            ScheduleAccountFocus();
            return;
        }
        if(!entry.AttemptedExternalFallback &&
            DateTime.UtcNow-entry.StartedUtc > TimeSpan.FromSeconds(12))
        {
            entry.AttemptedExternalFallback=true;
            entry.Status.Visible=true;
            entry.Status.Text = "No se pudo integrar el motor 3.0.7 en esta ventana.\n"+
                (entry.Host.LastError??"No se encontró una ventana del proceso.")+
                "\nAbre ⋯ → Ventana externa o consulta Diagnóstico.";
            SessionDiagnostics.Record("WINDOW_MISSING",entry.Id,entry.Process.Id);
        }
    }

    private void OpenConnectionDiagnostics(){
        string id=ActiveId;
        using var capture=new NativeNetLogCaptureWindow(id,Name(id));
        capture.ShowDialog(this);
    }

    private void ShowFiles()
    {
        string id=ActiveId;
        var menu=new ContextMenuStrip();
        menu.Items.Add("Archivos anteriores y diagnóstico",null,(_,_) =>
            new ArchiveAuditWindow(id,Name(id)).Show(this));
        menu.Items.Add("Perfiles locales (solo lectura)",null,(_,_) =>
            new LocalProfilesWindow(id,Name(id)).Show(this));
        menu.Items.Add("Abrir carpeta de cuenta",null,(_,_) =>
        {
            string path=AccountStore.DirectoryFor(id);
            Directory.CreateDirectory(path);
            Process.Start(new ProcessStartInfo("explorer.exe"){
                ArgumentList={path},UseShellExecute=true
            });
        });
        menu.Items.Add("Archivo API oficial (opcional)",null,(_,_) =>
            new OfficialApiArchiveWindow(id,Name(id)).Show(this));
        menu.Show(this,new Point(100,48));
    }

    private void ShowProfiles() =>
        new OfficialProfilesV1Window(Name(ActiveId)).Show(this);

    private string Name(string id) =>
        AccountStore.Get().FirstOrDefault(x=>x.Id==id)?.Name ?? "Cuenta";

    private IReadOnlyList<(string Account,int Pid,string State)> DiagnosticSnapshot()
    {
        var records=new List<(string Account,int Pid,string State)>();
        foreach(var item in pages.Values)
        {
            if(item.Process is null){records.Add((item.Id=="legacy"?"Principal":"Auxiliar",0,"No iniciada"));continue;}
            try
            {
                item.Process.Refresh();
                records.Add((item.Id=="legacy"?"Principal":"Auxiliar",item.Process.Id,
                    item.Process.HasExited?"Terminada ("+item.Process.ExitCode+")":
                    item.Host.IsEmbedded?"Ventana integrada":"Ejecutándose/sin integrar"));
            }
            catch(InvalidOperationException)
            { records.Add((item.Id=="legacy"?"Principal":"Auxiliar",0,"Terminada")); }
        }
        return records;
    }

    private void ToggleDiagnostics()
    {
        if(diagnostic is not null && !diagnostic.IsDisposed){
            diagnostic.Close();diagnostic=null;
            sidePanel.Visible=false;
            return;
        }
        diagnostic=new SessionDiagnosticsWindow(DiagnosticSnapshot,()=> (ActiveId,Name(ActiveId))){
            TopLevel=false,FormBorderStyle=FormBorderStyle.None,
            ShowInTaskbar=false,Dock=DockStyle.Fill
        };
        diagnostic.FormClosed+=(_,_)=>{
            diagnostic=null;sidePanel.Visible=false;
        };
        sidePanel.Controls.Add(diagnostic);
        sidePanel.Visible=true;
        diagnostic.Show();
        diagnostic.BringToFront();
    }

    private void OpenExternal()
    {
        if(!pages.TryGetValue(ActiveId,out var entry) || entry.Process is null)return;
        entry.Host.Detach();
        entry.Status.Visible=true;
        entry.Status.Text="Ventana externa disponible. Cambia de pestaña para volver a integrarla.";
        try
        {
            entry.Process.Refresh();
            if(entry.Process.MainWindowHandle!=IntPtr.Zero){
                // Visualizing outside does not change the process session.
                NativeFocus.Restore(entry.Process.MainWindowHandle);
            }
        }
        catch(InvalidOperationException){}
    }

    private static class NativeFocus
    {
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hwnd);
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hwnd,int command);
        internal static void Restore(IntPtr hwnd) {
            ShowWindow(hwnd,5);SetForegroundWindow(hwnd);
        }
    }
}
