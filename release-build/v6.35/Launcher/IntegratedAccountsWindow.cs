using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Windows.Forms;
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
    private readonly Process initial;
    private readonly bool embedSmoke;
    private readonly bool twoTabSmoke;
    private int smokePhase;
    private string? smokeSecondaryId;
    private int smokePrincipalPid;
    private int smokeSecondaryPid;
    internal bool SmokeSucceeded { get; private set; }
    private bool closing;
    private bool starting;
    private int firstTick;
    private readonly Label overall = new() {
        Dock = DockStyle.Bottom, Height = 30, ForeColor = Color.Khaki,
        Text = "Motor oficial 3.0.7 intacto · cuentas aisladas · interfaz integrada",
        Padding = new Padding(12, 6, 3, 3)
    };

    internal IntegratedAccountsWindow(Process initial, bool embedSmoke=false,bool twoTabSmoke=false)
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
        var engineVersion=new Label {
            Text="MOTOR 3.0.7", Dock=DockStyle.Left, Width=114,
            TextAlign=ContentAlignment.MiddleLeft,
            ForeColor=Color.FromArgb(131,151,153),
            Font=new Font("Segoe UI",8f)
        };
        bar.Controls.Add(topActions);
        bar.Controls.Add(engineVersion);
        bar.Controls.Add(brand);
        var more=TopButton("⋯",36,()=>OpenMenu());
        var add=TopButton("+ Cuenta",91,()=>AddUser());
        var file=TopButton("Archivos",75,()=>ShowFiles());
        topActions.Controls.Add(more);
        topActions.Controls.Add(add);
        topActions.Controls.Add(file);
        topActions.Width=226;

        accountTabs.BackColor=Ink;
        accountTabs.ForeColor=Color.White;
        accountTabs.DrawItem+=DrawTab;
        accountTabs.SelectedIndexChanged += (_, _) => {
            OnAccountSelected();
            accountTabs.Invalidate();
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
            // Intentional: official account processes remain alive.
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
        var textRect=new Rectangle(rect.Left+13,rect.Top+1,rect.Width-22,rect.Height-6);
        TextRenderer.DrawText(e.Graphics,label,new Font("Segoe UI",9.3f,
            active?FontStyle.Bold:FontStyle.Regular),textRect,
            active?Color.White:Color.FromArgb(174,190,193),
            TextFormatFlags.EndEllipsis|TextFormatFlags.VerticalCenter|
            TextFormatFlags.SingleLine|TextFormatFlags.NoPrefix);
    }
    private void OpenMenu(){
        var menu=new ContextMenuStrip {
            BackColor=Color.FromArgb(24,30,35),ForeColor=Color.White,
            Renderer=new ToolStripProfessionalRenderer()
        };
        menu.Items.Add("Cambiar nombre de cuenta",null,(_,_)=>RenameActive());
        menu.Items.Add("Mostrar todas las cuentas",null,(_,_)=>ChooseAccount());
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Perfiles (API oficial)",null,(_,_)=>ShowProfiles());
        menu.Items.Add("Panel de diagnóstico",null,(_,_)=>ToggleDiagnostics());
        menu.Items.Add("Archivos y exportaciones",null,(_,_)=>ShowFiles());
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Mostrar título original de DICloak",null,(_,_)=>ToggleOriginalHeader());
        menu.Items.Add("Abrir cuenta en ventana externa",null,(_,_)=>OpenExternal());
        menu.Show(topActions,new Point(4,topActions.Height));
    }
    private void ChooseAccount(){
        var menu=new ContextMenuStrip{
            BackColor=Color.FromArgb(24,30,35),ForeColor=Color.White
        };
        foreach(var account in AccountStore.Get()){
            string id=account.Id;
            menu.Items.Add(account.Name,null,(_,_)=>Select(id));
        }
        menu.Show(this,new Point(Math.Min(280,Math.Max(40,Width-260)),43));
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
        SessionDiagnostics.Observe(initial,"legacy");
        try{
            RefreshAccounts();
            pages["legacy"].Process = initial;
            pages["legacy"].StartedUtc = DateTime.UtcNow;
            pages["legacy"].Status.Text = "Iniciando cliente oficial de la cuenta principal…";
        }finally{starting=false;}
        Select("legacy");
        poll.Start();
    }

    private void RefreshAccounts()
    {
        var all = AccountStore.Get();
        accountTabs.SuspendLayout();
        foreach(var account in all)
        {
            if(pages.TryGetValue(account.Id,out var existing)){
                existing.Page.Text = account.Name;
                continue;
            }
            var tab = new TabPage(account.Name) {
                BackColor = Surface, ForeColor = Color.White,
                Padding=Padding.Empty, UseVisualStyleBackColor=false
            };
            var host = new EngineWindowHost();
            var status = new Label {
                Dock = DockStyle.Fill,TextAlign = ContentAlignment.MiddleCenter,
                ForeColor = Color.FromArgb(177,190,194), BackColor = Surface,
                Font = new Font("Segoe UI",11f),
                Text = "Selecciona esta cuenta para iniciar su sesión."
            };
            tab.Controls.Add(host);tab.Controls.Add(status);
            status.BringToFront();
            var entry = new AccountPage {
                Id = account.Id, Page = tab, Host = host, Status = status
            };
            pages[account.Id] = entry;
            accountTabs.TabPages.Add(tab);
        }
        accountTabs.ResumeLayout();
    }

    private void Select(string id)
    {
        if(pages.TryGetValue(id,out var page))
            accountTabs.SelectedTab = page.Page;
        OnAccountSelected();
    }

    private void OnAccountSelected()
    {
        if(closing || starting || !IsHandleCreated || pages.Count==0) return;
        string id=ActiveId;
        if(!pages.TryGetValue(id,out var entry))return;
        if(entry.Process is null || HasExited(entry.Process))
        {
            if(id=="legacy" && entry.Process is not null){
                entry.Status.Text="La aplicación oficial principal ha terminado; vuelve a abrir la pestaña para reiniciar.";
            }
            OpenAccount(id);
            return;
        }
        UpdateHost(entry);
    }

    private static bool HasExited(Process p)
    {
        try { p.Refresh();return p.HasExited; }
        catch(InvalidOperationException) {return true;}
    }

    private void OpenAccount(string id)
    {
        if(!pages.TryGetValue(id,out var entry))return;
        if(entry.Process is not null && !HasExited(entry.Process)){
            UpdateHost(entry);return;
        }
        try
        {
            entry.Process?.Dispose();
            entry.Process = BrowserRibbon.StartNative(id);
            SessionDiagnostics.Observe(entry.Process,id);
            entry.StartedUtc=DateTime.UtcNow;
            entry.AttemptedExternalFallback=false;
            entry.Status.Visible=true;
            entry.Status.Text = "Abriendo "+(id=="legacy"?"la cuenta principal":"una sesión independiente")+"…";
            overall.Text = "Motor 3.0.7 — "+pages.Count+" cuentas locales, datos aislados.";
        }
        catch(Exception ex)
        {
            entry.Status.Visible=true;
            entry.Status.Text = "No se pudo iniciar la cuenta: "+ex.Message;
            SessionDiagnostics.Record("START_FAILED",id);
        }
    }

    private void AddUser()
    {
        try
        {
            var account=AccountStore.Create();
            RefreshAccounts();
            Select(account.Id);
        }
        catch(Exception ex) { MessageBox.Show(this,ex.Message,"No se pudo agregar la cuenta"); }
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
        if(!pages.TryGetValue(ActiveId,out var entry))return;
        UpdateHost(entry);
        if(twoTabSmoke){
            // Proves actual visual tab switching, not merely two Process.Start
            // PIDs. The CI creates a disposable auxiliary account beforehand.
            if(smokePhase==0 && entry.Id=="legacy" && entry.Host.IsEmbedded){
                smokePrincipalPid=entry.Process?.Id??0;
                var auxiliary=pages.Values.FirstOrDefault(p=>p.Id!="legacy");
                if(auxiliary is not null){
                    smokeSecondaryId=auxiliary.Id;
                    smokePhase=1;
                    Select(auxiliary.Id);
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
                    && accountTabs.TabCount>=2;
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
                switched?"dyclokpro-v639-two-tabs.json":"dyclokpro-v639-embedded-window.json"),
                JsonSerializer.Serialize(new {
                    integratedHostShown=true,
                    originalMotorChildWindowAttached=SmokeSucceeded,
                    verifiedTwoTabs=switched && SmokeSucceeded,
                    principalPid=smokePrincipalPid,
                    secondaryPid=smokeSecondaryPid,
                    activeAccountId=switched?ActiveId:"legacy",
                    internalTabCount=accountTabs.TabCount,
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
            return;
        }
        if(!entry.AttemptedExternalFallback &&
            DateTime.UtcNow - entry.StartedUtc > TimeSpan.FromSeconds(18))
        {
            entry.AttemptedExternalFallback=true;
            entry.Status.Visible=true;
            entry.Status.Text = "No se pudo integrar la ventana de esta cuenta. Usa ⋯ → Ventana externa.";
            overall.Text = "El motor continúa intacto. El alojamiento HWND depende de compatibilidad de Windows/DPI.";
        }
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
        diagnostic=new SessionDiagnosticsWindow(DiagnosticSnapshot){
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
