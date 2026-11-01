using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Windows.Forms;

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

    private readonly TabControl accountTabs = new() { Dock = DockStyle.Fill };
    private readonly Dictionary<string, AccountPage> pages = new(StringComparer.Ordinal);
    private readonly System.Windows.Forms.Timer poll = new() { Interval = 600 };
    private SessionDiagnosticsWindow? diagnostic;
    private readonly Process initial;
    private bool closing;
    private int firstTick;
    private readonly Label overall = new() {
        Dock = DockStyle.Bottom, Height = 30, ForeColor = Color.Khaki,
        Text = "Motor oficial 3.0.7 intacto · cuentas aisladas · interfaz integrada",
        Padding = new Padding(12, 6, 3, 3)
    };

    internal IntegratedAccountsWindow(Process initial)
    {
        this.initial = initial;
        Text = "DyclokPRO v6.38 | DICloak 3.0.7";
        Width = 1280; Height = 820; MinimumSize = new Size(800, 560);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(18, 29, 37);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10);

        var bar = new FlowLayoutPanel {
            Dock = DockStyle.Top, Height = 51, WrapContents = false,
            Padding = new Padding(10, 7, 10, 4),
            BackColor = Color.FromArgb(23, 55, 65)
        };
        AddButton(bar, "+ Cuenta", () => AddUser());
        AddButton(bar, "Archivos", () => ShowFiles());
        AddButton(bar, "Perfiles", () => ShowProfiles());
        AddButton(bar, "Diagnóstico", () => ToggleDiagnostics());
        AddButton(bar, "Abrir ventana externa", () => OpenExternal());
        AddButton(bar, "Renombrar", () => RenameActive());
        AddButton(bar, "Actualizar", () => RefreshAccounts());

        accountTabs.DrawMode = TabDrawMode.Normal;
        accountTabs.SelectedIndexChanged += (_, _) => OnAccountSelected();
        accountTabs.MouseUp += (_, args) => {
            if (args.Button == MouseButtons.Right) RenameActive();
        };

        Controls.Add(accountTabs);
        Controls.Add(overall);
        Controls.Add(bar);
        Shown += (_, _) => Start();
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

    private static void AddButton(FlowLayoutPanel panel,string label,Action action)
    {
        var b = new Button {
            Text = label, AutoSize = true, Height = 33,
            FlatStyle = FlatStyle.Flat, Margin = new Padding(3, 0, 3, 0),
            ForeColor = Color.White, BackColor = Color.FromArgb(30, 94, 90)
        };
        b.Click += (_, _) => action();
        panel.Controls.Add(b);
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
        SessionDiagnostics.Observe(initial,"legacy");
        RefreshAccounts();
        pages["legacy"].Process = initial;
        pages["legacy"].StartedUtc = DateTime.UtcNow;
        pages["legacy"].Status.Text = "Iniciando cliente oficial de la cuenta principal…";
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
                BackColor = Color.FromArgb(17, 24, 31),
                ForeColor = Color.Black,
                Padding = new Padding(0)
            };
            var host = new EngineWindowHost();
            var status = new Label {
                Dock = DockStyle.Bottom, Height = 29, TextAlign = ContentAlignment.MiddleLeft,
                ForeColor = Color.White, BackColor = Color.FromArgb(29, 49, 59),
                Padding = new Padding(12, 0, 0, 0),
                Text = "Pulsa esta pestaña para iniciar la sesión independiente."
            };
            tab.Controls.Add(host);tab.Controls.Add(status);
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
        if(closing || !IsHandleCreated || pages.Count==0) return;
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
            entry.Status.Text = "Iniciando sesión "+(id=="legacy"?"principal":"auxiliar")+"…";
            overall.Text = "Motor 3.0.7 — "+pages.Count+" cuentas locales, datos aislados.";
        }
        catch(Exception ex)
        {
            entry.Status.Text = "No se pudo iniciar el motor: "+ex.Message;
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
        if(entry.Process is not null && HasExited(entry.Process) && !entry.AttemptedExternalFallback)
        {
            entry.AttemptedExternalFallback=true;
            entry.Status.Text = "El motor finalizó sin abrir una ventana. Puede existir un bloqueo de instancia única.";
            overall.Text = "No se ha creado otra sesión. Consulta Diagnóstico; no se reutiliza la primera cuenta.";
        }
    }

    private void UpdateHost(AccountPage entry)
    {
        if(entry.Process is null || entry.Host.IsEmbedded)return;
        if(HasExited(entry.Process))return;
        if(entry.Host.TryAttach(entry.Process))
        {
            entry.Status.Text = "Motor 3.0.7 integrado · PID "+entry.Process.Id+
                " · Sesión "+(entry.Id=="legacy"?"principal":"auxiliar");
            overall.Text = "Vista de cuenta integrada. La autenticación sigue a cargo del motor oficial.";
            return;
        }
        if(!entry.AttemptedExternalFallback &&
            DateTime.UtcNow - entry.StartedUtc > TimeSpan.FromSeconds(18))
        {
            entry.AttemptedExternalFallback=true;
            entry.Status.Text = "No fue posible integrar la ventana. Puedes abrirla externamente sin perder la sesión.";
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
            diagnostic.Close();diagnostic=null;return;
        }
        diagnostic=new SessionDiagnosticsWindow(DiagnosticSnapshot);
        diagnostic.FormClosed+=(_,_)=>diagnostic=null;
        diagnostic.Show(this);
    }

    private void OpenExternal()
    {
        if(!pages.TryGetValue(ActiveId,out var entry) || entry.Process is null)return;
        entry.Host.Detach();
        entry.Status.Text="Ventana externa restaurada. Pulsa otra pestaña para intentar integrarla de nuevo.";
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
