using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Windows.Forms;

namespace DyclokPRO;

// Diagnostic-only events. No keys, login responses, cookies, account names,
// API payloads, browser profile contents or session identifiers are logged.
internal static class SessionDiagnostics
{
    private static readonly object Sync = new();
    private static readonly List<DiagnosticEntry> Events = new();
    private static readonly HashSet<int> Observed = new();
    private const int MaxInMemory = 150;

    internal sealed record DiagnosticEntry(DateTime TimeUtc, string Kind, string AccountType, int Pid, int? ExitCode);

    private static string KindOf(string id) => id == "legacy" ? "principal" : "auxiliar";

    internal static void Record(string kind, string id, int pid = 0, int? exitCode = null)
    {
        // Strongly bounded set of event names and data types.
        if (kind is not ("START" or "EXIT" or "ALREADY_OPEN" or "START_FAILED" or "WINDOW_MISSING" or "CAPTURE_FAILED"))
            return;
        var entry = new DiagnosticEntry(DateTime.UtcNow, kind, KindOf(id), pid, exitCode);
        lock (Sync)
        {
            Events.Add(entry);
            if (Events.Count > MaxInMemory)
                Events.RemoveRange(0, Events.Count - MaxInMemory);
        }
        // A small forensic journal is kept locally to diagnose a process exit.
        // Logging failure must never interrupt the official DICloak process.
        try
        {
            string folder = Path.Combine(AccountStore.Root, "Diagnostico");
            Directory.CreateDirectory(folder);
            string file = Path.Combine(folder, "eventos-sesion.jsonl");
            lock (Sync)
            {
                if (File.Exists(file) && new FileInfo(file).Length > 512 * 1024)
                {
                    string backup = Path.Combine(folder, "eventos-sesion-anterior.jsonl");
                    File.Move(file, backup, true);
                }
                File.AppendAllText(file, JsonSerializer.Serialize(entry) + Environment.NewLine);
                // KAIZEN-inspired account isolation: a separate append-only
                // journal beside each native NetLog, not a rewrite of traffic.
                string alias=AccountStore.Get().FirstOrDefault(a=>a.Id==id)?.Name??"Cuenta";
                string own=NativeNetLogCapture.DirectoryFor(id,alias);
                Directory.CreateDirectory(own);
                File.AppendAllText(Path.Combine(own,"eventos-proceso.jsonl"),
                    JsonSerializer.Serialize(entry)+Environment.NewLine);
            }
        }
        catch (IOException) { }
        catch (UnauthorizedAccessException) { }
        catch (JsonException) { }
        catch (InvalidDataException) { }
    }

    internal static void Observe(Process process, string id)
    {
        lock (Sync)
        {
            if (!Observed.Add(process.Id)) return;
        }
        Record("START", id, process.Id);
        try
        {
            process.EnableRaisingEvents = true;
            process.Exited += (_, _) =>
            {
                int? code = null;
                try { code = process.ExitCode; }
                catch (InvalidOperationException) { }
                Record("EXIT", id, process.Id, code);
            };
        }
        catch (InvalidOperationException) { }
    }

    internal static DiagnosticEntry[] Snapshot()
    {
        lock (Sync) return Events.OrderByDescending(e => e.TimeUtc).ToArray();
    }

    internal static string JournalFolder => Path.Combine(AccountStore.Root, "Diagnostico");
}

internal sealed class SessionDiagnosticsWindow : Form
{
    private readonly Func<IReadOnlyList<(string Account, int Pid, string State)>> snapshot;
    private readonly Func<(string Id,string Alias)>? selectedAccount;
    private readonly DataGridView processes = new();
    private readonly DataGridView events = new();
    private readonly Label note = new();
    private readonly System.Windows.Forms.Timer timer = new() { Interval = 1700 };

    internal SessionDiagnosticsWindow(Func<IReadOnlyList<(string Account, int Pid, string State)>> snapshot,
        Func<(string Id,string Alias)>? selectedAccount=null)
    {
        this.snapshot = snapshot;
        this.selectedAccount = selectedAccount;
        Text = "DyclokPRO · Diagnóstico de sesión 3.0.7";
        Width = 635; Height = 580; MinimumSize = new Size(480, 420);
        StartPosition = FormStartPosition.Manual;
        BackColor = Color.FromArgb(15, 32, 41);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 9.4f);

        var title = new Label {
            Dock = DockStyle.Top, Height = 44,
            Text = "Diagnóstico · estado y carpeta",
            Font = new Font("Segoe UI", 12, FontStyle.Bold)
        };
        note.Dock = DockStyle.Bottom; note.Height = 85;
        note.ForeColor = Color.Khaki;
        note.Text = "Carpeta: registros originales disponibles de esta cuenta. " +
                    "NetLog es opcional y empieza al reiniciar; NO descarga automáticamente " +
                    "todos los perfiles, solicitudes ni respuestas. " +
                    "En modo completo puede contener cookies o claves sin cifrar.";
        var actions = new FlowLayoutPanel {
            Dock=DockStyle.Bottom,Height=83,Padding=new Padding(4),
            WrapContents=true,AutoScroll=true
        };
        var openLogs = new Button { Text = "Carpeta de esta cuenta", AutoSize = true };
        openLogs.Click += (_, _) => {
            try {
                if(selectedAccount is null)return;
                var (id,alias)=selectedAccount();
                AccountDiagnosticFolder.Open(id,alias);
            }catch(Exception ex) when(ex is IOException or UnauthorizedAccessException or
                System.ComponentModel.Win32Exception or ArgumentException){
                MessageBox.Show(this,ex.Message,"Carpeta de diagnóstico");
            }
        };
        var globalLogs = new Button { Text = "Eventos generales", AutoSize=true };
        globalLogs.Click+=(_,_)=>{
            string folder=SessionDiagnostics.JournalFolder;
            Directory.CreateDirectory(folder);
            Process.Start(new ProcessStartInfo("explorer.exe"){
                ArgumentList={folder},UseShellExecute=true
            });
        };
        var capture = new Button { Text = "Capturar red", AutoSize = true };
        capture.Click += (_,_) => {
            if(selectedAccount is not null) {
                var (id,alias)=selectedAccount();
                using var window=new NativeNetLogCaptureWindow(id,alias);
                window.ShowDialog(this);
            }
        };
        var refresh = new Button { Text = "Actualizar", AutoSize = true };
        refresh.Click += (_, _) => Reload();
        actions.Controls.Add(openLogs);
        if(selectedAccount is not null)actions.Controls.Add(capture);
        actions.Controls.Add(refresh);
        actions.Controls.Add(globalLogs);

        processes.Dock = DockStyle.Fill;
        processes.ReadOnly = true; processes.RowHeadersVisible = false;
        processes.AllowUserToAddRows = false; processes.AllowUserToDeleteRows = false;
        processes.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        processes.Columns.Add("account", "Cuenta");
        processes.Columns.Add("pid", "PID");
        processes.Columns.Add("state", "Estado");

        events.Dock = DockStyle.Fill;
        events.ReadOnly = true; events.RowHeadersVisible = false;
        events.AllowUserToAddRows = false; events.AllowUserToDeleteRows = false;
        events.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        events.Columns.Add("time", "Hora UTC");
        events.Columns.Add("kind", "Evento");
        events.Columns.Add("account", "Cuenta");
        events.Columns.Add("pid", "PID");
        events.Columns.Add("exit", "Código");

        var split = new SplitContainer {
            Dock = DockStyle.Fill, Orientation = Orientation.Horizontal, SplitterDistance = 165
        };
        split.Panel1.Controls.Add(processes);
        split.Panel2.Controls.Add(events);
        Controls.Add(split); Controls.Add(actions); Controls.Add(note); Controls.Add(title);
        Shown += (_, _) => { Reload(); timer.Start(); };
        FormClosed += (_, _) => timer.Dispose();
        timer.Tick += (_, _) => Reload();
    }

    private void Reload()
    {
        if (IsDisposed) return;
        processes.Rows.Clear();
        foreach (var item in snapshot())
            processes.Rows.Add(item.Account, item.Pid, item.State);
        events.Rows.Clear();
        foreach (var entry in SessionDiagnostics.Snapshot().Take(65))
            events.Rows.Add(entry.TimeUtc.ToString("yyyy-MM-dd HH:mm:ss"),
                entry.Kind, entry.AccountType, entry.Pid, entry.ExitCode?.ToString() ?? "—");
    }
}
