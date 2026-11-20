using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DiloakPRO.Diagnostico;

internal sealed record Snapshot(
    string Utc, int MotorProcesses, int DescendantProcesses,
    int ChromiumProcesses, int TcpConnections,
    string Coverage, string Verification);

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new DiagnosticBubble());
    }
}

internal sealed class DiagnosticBubble : Form
{
    private readonly System.Windows.Forms.Timer timer = new() { Interval = 1100 };
    private readonly List<Snapshot> history = new();
    private readonly Button bubble = new()
    {
        Text = "Diagnóstico", Dock = DockStyle.Fill,
        FlatStyle = FlatStyle.Flat, BackColor = Color.FromArgb(21, 84, 167),
        ForeColor = Color.White, Font = new Font("Segoe UI", 11, FontStyle.Bold),
        Cursor = Cursors.Hand
    };
    private DiagnosticWindow? window;
    private bool recording;
    private bool sampling;
    private DateTime nextSampleUtc = DateTime.MinValue;
    private string? error;
    private static readonly string Engine = Path.Combine(AppContext.BaseDirectory, "DICloak.exe");

    public DiagnosticBubble()
    {
        Text = "diloakPRO Diagnóstico";
        Width = 154;
        Height = 50;
        StartPosition = FormStartPosition.Manual;
        ShowInTaskbar = false;
        TopMost = true;
        FormBorderStyle = FormBorderStyle.None;
        BackColor = Color.FromArgb(21, 84, 167);
        bubble.FlatAppearance.BorderSize = 1;
        bubble.FlatAppearance.BorderColor = Color.FromArgb(155, 185, 229);
        bubble.Click += (_, _) => OpenPanel();
        Controls.Add(bubble);
        Shown += (_, _) => { LaunchEngineIfNeeded(); MoveNearEngine(); };
        timer.Tick += (_, _) =>
        {
            MoveNearEngine();
            if (recording && !sampling && DateTime.UtcNow >= nextSampleUtc)
                _ = SampleAsync();
        };
        timer.Start();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        timer.Stop();
        window?.Close();
        base.OnFormClosing(e);
    }

    private static Process? VisibleEngine()
    {
        foreach (var proc in Process.GetProcessesByName("DICloak"))
        {
            try
            {
                if (proc.MainWindowHandle != IntPtr.Zero && !proc.HasExited &&
                    IsWindowVisible(proc.MainWindowHandle) && !IsIconic(proc.MainWindowHandle))
                    return proc;
            }
            catch { }
            proc.Dispose();
        }
        return null;
    }

    private void LaunchEngineIfNeeded()
    {
        if (Process.GetProcessesByName("DICloak").Length != 0) return;
        if (!File.Exists(Engine))
        {
            MessageBox.Show("No se encuentra DICloak.exe junto a diloakPRO.exe.",
                "diloakPRO", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return;
        }
        try
        {
            Process.Start(new ProcessStartInfo { FileName = Engine,
                WorkingDirectory = AppContext.BaseDirectory,
                UseShellExecute = true });
        }
        catch (Exception ex)
        {
            MessageBox.Show("No se pudo abrir el motor original: " +
                ex.GetType().Name, "diloakPRO", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void MoveNearEngine()
    {
        Rectangle rect;
        using (var engine = VisibleEngine())
        {
            if (engine != null &&
                GetWindowRect(engine.MainWindowHandle, out RECT outer) &&
                outer.Right > outer.Left && outer.Bottom > outer.Top)
            {
                rect = Rectangle.FromLTRB(outer.Left, outer.Top, outer.Right, outer.Bottom);
            }
            else
            {
                rect = Screen.PrimaryScreen?.WorkingArea ?? new Rectangle(0, 0, 1280, 720);
            }
        }
        var area = Screen.FromRectangle(rect).WorkingArea;
        var x = Math.Clamp(rect.Right - Width - 22, area.Left, area.Right - Width);
        var y = Math.Clamp(rect.Bottom - Height - 22, area.Top, area.Bottom - Height);
        if (Location != new Point(x, y)) Location = new Point(x, y);
    }

    private void OpenPanel()
    {
        if (window == null || window.IsDisposed)
        {
            window = new DiagnosticWindow(this);
            window.FormClosed += (_, _) => window = null;
        }
        window.Show();
        window.Activate();
        UpdatePanel();
    }

    internal void StartRecording()
    {
        history.Clear();
        error = null;
        recording = true;
        nextSampleUtc = DateTime.MinValue;
        UpdatePanel();
    }

    internal void StopRecording()
    {
        recording = false;
        UpdatePanel();
    }

    internal void OpenMotor() => LaunchEngineIfNeeded();

    internal string State => recording ? "Grabando (metadatos de Windows)" : "Detenido";
    internal int Count => history.Count;
    internal string? Error => error;
    internal IReadOnlyList<Snapshot> History => history;

    private async Task SampleAsync()
    {
        sampling = true;
        nextSampleUtc = DateTime.UtcNow.AddSeconds(5);
        try
        {
            var snapshot = await Task.Run(WindowsSample);
            if (!recording || IsDisposed) return;
            history.Add(snapshot);
            if (history.Count > 600) history.RemoveAt(0);
            error = null;
        }
        catch (Exception ex)
        {
            error = "El muestreo falló (" + ex.GetType().Name + ").";
        }
        finally
        {
            sampling = false;
            if (!IsDisposed) UpdatePanel();
        }
    }

    private static Snapshot WindowsSample()
    {
        // Windows OS process metadata only. No passwords, URLs, headers or bodies.
        const string script = @"$ErrorActionPreference='Stop'
$items=@(Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name)
$ids=New-Object 'System.Collections.Generic.HashSet[int]'
foreach($p in $items) {
  if($p.Name -ieq 'DICloak.exe'){[void]$ids.Add([int]$p.ProcessId)}
}
$roots=$ids.Count
for($i=0;$i -lt 5;$i++){
  foreach($p in $items){
    if($ids.Contains([int]$p.ParentProcessId)){[void]$ids.Add([int]$p.ProcessId)}
  }
}
$desc=@($items | Where-Object {$ids.Contains([int]$_.ProcessId)})
$chrom=@($desc | Where-Object {$_.Name -match '^(chrome|chromium|ginsbrowser)\.exe$'})
$tcp=@(Get-NetTCPConnection -ErrorAction SilentlyContinue |
  Where-Object {$ids.Contains([int]$_.OwningProcess) -and $_.RemotePort -gt 0})
ConvertTo-Json -InputObject @{roots=$roots;desc=$desc.Count;chrom=$chrom.Count;tcp=$tcp.Count} -Compress
";
        var encoded = Convert.ToBase64String(Encoding.Unicode.GetBytes(script));
        var p = new ProcessStartInfo("powershell.exe")
        {
            CreateNoWindow = true,
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = false
        };
        p.ArgumentList.Add("-NoProfile");
        p.ArgumentList.Add("-NonInteractive");
        p.ArgumentList.Add("-EncodedCommand");
        p.ArgumentList.Add(encoded);
        using var command = Process.Start(p) ?? throw new InvalidOperationException("No PowerShell");
        if (!command.WaitForExit(14000))
        {
            try { command.Kill(true); } catch { }
            throw new TimeoutException("Windows telemetry timeout");
        }
        var stdout = command.StandardOutput.ReadToEnd();
        if (command.ExitCode != 0) throw new IOException("Windows sampler did not finish");
        using var json = JsonDocument.Parse(stdout);
        var root = json.RootElement;
        int count(string name) => root.GetProperty(name).GetInt32();
        return new Snapshot(DateTime.UtcNow.ToString("O"),
            count("roots"), count("desc"), count("chrom"), count("tcp"),
            "Windows process tree and TCP metadata; browser visibility partial",
            "No se verifican cookies, proxy, fingerprint, JSON interno ni sesiones");
    }

    internal void Export()
    {
        try
        {
            var downloads = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
            if (!Directory.Exists(downloads))
                downloads = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var name = "diloakPRO-Diagnostico-Windows309-" +
                DateTime.Now.ToString("yyyyMMdd-HHmmss") + ".json";
            var target = Path.Combine(downloads, name);
            var data = new
            {
                title = "diloakPRO - diagnóstico externo del motor 3.0.9",
                schema = 1,
                source = "Windows OS metadata companion; not DICloak internal diagnostics",
                originalEngineModified = false,
                exactHttpBodyCaptured = false,
                cookiesVerified = false,
                proxyVerified = false,
                fingerprintVerified = false,
                extensionsVerified = false,
                events = history.ToArray()
            };
            File.WriteAllText(target, JsonSerializer.Serialize(data,
                new JsonSerializerOptions { WriteIndented = true }), Encoding.UTF8);
            MessageBox.Show("Informe exportado:\n" + target,
                "Diagnóstico", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            MessageBox.Show("No se pudo exportar: " + ex.GetType().Name,
                "Diagnóstico", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    internal void Exit() => Close();

    private void UpdatePanel() => window?.RefreshFrom(this);

    [StructLayout(LayoutKind.Sequential)]
    private struct RECT
    {
        public int Left, Top, Right, Bottom;
    }

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool IsIconic(IntPtr hWnd);
}

internal sealed class DiagnosticWindow : Form
{
    private readonly Label status = new()
    {
        Dock = DockStyle.Top, Height = 65, ForeColor = Color.White,
        Font = new Font("Segoe UI", 10, FontStyle.Bold), Padding = new Padding(12)
    };
    private readonly TextBox events = new()
    {
        Dock = DockStyle.Fill, Multiline = true, ReadOnly = true,
        BackColor = Color.FromArgb(16, 24, 38), ForeColor = Color.White,
        Font = new Font("Consolas", 9), ScrollBars = ScrollBars.Vertical
    };
    private readonly Label warning = new()
    {
        Dock = DockStyle.Bottom, Height = 80,
        Text = "Cobertura PARCIAL: procesos y conexiones TCP del sistema.\n" +
               "No intercepta tráfico cifrado, cookies ni credenciales del navegador.\n" +
               "La captura íntegra R4 aún no está conectada al motor 3.0.9.",
        ForeColor = Color.FromArgb(210, 220, 234),
        Padding = new Padding(12), Font = new Font("Segoe UI", 9)
    };
    private readonly DiagnosticBubble bubble;

    public DiagnosticWindow(DiagnosticBubble owner)
    {
        bubble = owner;
        Text = "diloakPRO 3.0.9 - Diagnóstico";
        Width = 630; Height = 440;
        MinimumSize = new Size(560, 380);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(20, 32, 48);
        ForeColor = Color.White;

        var toolbar = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 48,
            Padding = new Padding(9), BackColor = Color.FromArgb(29, 45, 67) };
        void add(string label, Action action)
        {
            var b = new Button { Text = label, Height = 29, AutoSize = true,
                BackColor = Color.FromArgb(37, 67, 105),
                ForeColor = Color.White, FlatStyle = FlatStyle.Flat };
            b.Click += (_, _) => action();
            toolbar.Controls.Add(b);
        }
        add("Iniciar", owner.StartRecording);
        add("Detener", owner.StopRecording);
        add("Exportar JSON", owner.Export);
        add("Abrir DICloak", owner.OpenMotor);
        add("Cerrar panel", Close);

        Controls.Add(events);
        Controls.Add(warning);
        Controls.Add(toolbar);
        Controls.Add(status);
    }

    public void RefreshFrom(DiagnosticBubble bubble)
    {
        if (IsDisposed) return;
        status.Text = "Estado: " + bubble.State + "   |   Mediciones: " + bubble.Count +
                      (bubble.Error is null ? "" : "\n" + bubble.Error);
        events.Text = string.Join(Environment.NewLine,
            bubble.History.TakeLast(32).Select(x =>
                x.Utc[11..19] + " UTC | Motor: " + x.MotorProcesses +
                " | Descendientes: " + x.DescendantProcesses +
                " | Chromium: " + x.ChromiumProcesses +
                " | TCP: " + x.TcpConnections));
    }
}
