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
    private readonly CdpObserver cdp = new();
    private readonly List<CdpDiagnosticEvent> cdpHistory = new();
    private string cdpStatus = "No activado";
    private int? cdpPort;
    private int? apiDebugPort;
    private string apiStatus = "Sin consultar";
    private readonly List<ApiV2Finding> apiFindings = new();
    private bool apiBusy;
    private bool autoBusy;
    private string? authorizedApiKey;
    private int? authorizedApiPort;
    private string autoStatus = "Sin autorización";
    private readonly List<string> autoCandidates = new();
    private string? archiveProfileId;
    private string archiveStatus = "Sin guardar";
    private readonly List<ArchiveOperation> operationHistory = new();
    private DateTime nextAutoSaveUtc = DateTime.MaxValue;
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
            if (recording && history.Count > 0 && DateTime.UtcNow >= nextAutoSaveUtc)
            {
                nextAutoSaveUtc = DateTime.UtcNow.AddMinutes(1);
                SaveToArchive(false);
            }
        };
        timer.Start();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        timer.Stop();
        if (history.Count > 0 || cdpHistory.Count > 0 || apiFindings.Count > 0)
            SaveToArchive(false);
        authorizedApiKey = null;
        authorizedApiPort = null;
        cdp.Dispose();
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
        nextAutoSaveUtc = DateTime.UtcNow.AddMinutes(1);
        LogAction("INICIAR_GRABACION", "OK");
        nextSampleUtc = DateTime.MinValue;
        UpdatePanel();
    }

    internal void StopRecording()
    {
        recording = false;
        LogAction("DETENER_GRABACION", "OK");
        SaveToArchive(false);
        UpdatePanel();
    }

    internal void OpenMotor() => LaunchEngineIfNeeded();

    internal void ConnectCdp(string portText)
    {
        if (!int.TryParse(portText, out var port) || port < 1024 || port > 65535)
        {
            cdpStatus = "Puerto inválido (1024-65535)";
            UpdatePanel();
            return;
        }
        if (cdp.IsRunning)
        {
            cdpStatus = "Ya hay un monitor CDP en ejecución";
            UpdatePanel();
            return;
        }
        cdpHistory.Clear();
        cdpPort = port;
        cdpStatus = "Conectando a 127.0.0.1:" + port;
        LogAction("SOLICITAR_CONEXION_CDP", "LOCAL");
        cdp.Start(port, entry =>
        {
            if (IsDisposed || !IsHandleCreated) return;
            try
            {
                BeginInvoke(new Action(() =>
                {
                    if (IsDisposed) return;
                    cdpHistory.Add(entry);
                    if (cdpHistory.Count > 600) cdpHistory.RemoveAt(0);
                    if (entry.Type is "CDP_ATTACHED" or "CDP_NETWORK_ENABLED" or
                        "CDP_ENABLE_FAILED" or "CDP_STOPPED" or "CDP_ERROR" or
                        "CDP_NO_TARGET" or "CDP_UNAVAILABLE")
                        cdpStatus = entry.Type;
                    UpdatePanel();
                }));
            }
            catch (InvalidOperationException) { }
        });
        UpdatePanel();
    }

    internal void DisconnectCdp()
    {
        cdp.Stop();
        LogAction("DESCONECTAR_CDP", "SOLICITADO");
        cdpStatus = "Desconectando";
        SaveToArchive(false);
        UpdatePanel();
    }

    internal async Task CheckApiV2Async(string portText, string apiKey, string profileId)
    {
        if (apiBusy) return;
        if (!int.TryParse(portText, out var port) || port < 1024 || port > 65535 ||
            string.IsNullOrWhiteSpace(apiKey) || !System.Text.RegularExpressions.Regex.IsMatch(
                profileId, @"^\d{1,32}$"))
        {
            apiStatus = "Rellena puerto API, clave local e ID numérico";
            UpdatePanel();
            return;
        }
        apiBusy = true;
        archiveProfileId = profileId;
        LogAction("CONSULTAR_API_V2", "SOLICITADO");
        apiStatus = "Consultando API V2 de solo lectura";
        apiDebugPort = null;
        apiFindings.Clear();
        UpdatePanel();
        try
        {
            var result = await ApiV2Probe.CheckAsync(port, apiKey, profileId);
            if (IsDisposed) return;
            apiFindings.AddRange(result.Findings);
            apiDebugPort = result.ProfileDebugPort;
            apiStatus = apiDebugPort.HasValue ?
                "API consultada; CDP del perfil disponible" : "API consultada; CDP no confirmado";
            LogAction("CONSULTAR_API_V2", "COMPLETADO");
            SaveToArchive(false);
        }
        catch (Exception ex)
        {
            apiStatus = "Consulta fallida (" + ex.GetType().Name + ")";
        }
        finally
        {
            apiBusy = false;
            if (!IsDisposed) UpdatePanel();
        }
    }

    // Called only after clicking the consent button. The key is held in
    // memory for this app session, never persisted in JSON/TXT or profile files.
    internal async Task<IReadOnlyList<string>> AutomaticDiagnosticAsync(
        string manualPort, string suppliedKey, string preferredProfileId)
    {
        if (autoBusy || apiBusy)
            return autoCandidates.ToArray();

        if (!string.IsNullOrWhiteSpace(suppliedKey))
            authorizedApiKey = suppliedKey;
        if (string.IsNullOrWhiteSpace(authorizedApiKey))
        {
            autoStatus = "Copia una vez la clave de Open API; sin ella no hay permiso";
            UpdatePanel();
            return Array.Empty<string>();
        }

        int? port = null;
        if (!string.IsNullOrWhiteSpace(manualPort))
        {
            if (!int.TryParse(manualPort, out var parsed) || parsed < 1024 || parsed > 65535)
            {
                autoStatus = "Puerto API inválido; déjalo vacío para probar el habitual";
                UpdatePanel();
                return Array.Empty<string>();
            }
            port = parsed;
        }
        else if (authorizedApiPort.HasValue)
        {
            port = authorizedApiPort;
        }

        autoBusy = true;
        autoStatus = "Buscando API y perfiles abiertos mediante consulta autorizada";
        LogAction("AUTODIAGNOSTICO", "SOLICITADO");
        UpdatePanel();
        try
        {
            var discovery = await AutoDiagnosticDiscovery.DiscoverAsync(
                authorizedApiKey, port);
            if (IsDisposed) return Array.Empty<string>();
            autoCandidates.Clear();
            autoCandidates.AddRange(discovery.RunningProfileIds);
            if (!discovery.ApiPort.HasValue)
            {
                autoStatus = discovery.Status switch
                {
                    "API_NO_CONFIRMADA_EN_PUERTO_HABITUAL_52100" =>
                        "No se encontró API en 52100. Escribe el puerto oficial una sola vez",
                    "API_NO_CONFIRMADA_EN_PUERTO_INDICADO" =>
                        "API no disponible o clave incorrecta: revisa Open API",
                    _ => "API no confirmada: " + discovery.Status
                };
                LogAction("AUTODIAGNOSTICO", "API_NO_VERIFICADA");
                UpdatePanel();
                return autoCandidates.ToArray();
            }
            authorizedApiPort = discovery.ApiPort.Value;
            var selected = "";
            if (!string.IsNullOrWhiteSpace(preferredProfileId) &&
                autoCandidates.Contains(preferredProfileId))
                selected = preferredProfileId;
            else if (autoCandidates.Count == 1)
                selected = autoCandidates[0];

            if (string.IsNullOrEmpty(selected))
            {
                autoStatus = autoCandidates.Count switch
                {
                    0 => "API conectada, pero no hay perfiles abiertos",
                    _ => "Hay varios perfiles abiertos: elige uno para evitar mezclar datos"
                };
                LogAction("AUTODIAGNOSTICO", "SELECCION_REQUERIDA");
                UpdatePanel();
                return autoCandidates.ToArray();
            }
            if (cdp.IsRunning && archiveProfileId != selected)
            {
                autoStatus = "Desconecta primero el CDP del perfil anterior";
                UpdatePanel();
                return autoCandidates.ToArray();
            }
            if (!recording)
                StartRecording();
            if (archiveProfileId != selected)
                cdpHistory.Clear();
            await CheckApiV2Async(discovery.ApiPort.Value.ToString(),
                authorizedApiKey, selected);
            if (IsDisposed) return autoCandidates.ToArray();
            if (apiDebugPort.HasValue)
            {
                ConnectProfileCdp();
                autoStatus = "Perfil detectado; captura CDP solicitada. Revisa estado";
            }
            else
            {
                autoStatus = "Perfil detectado; sin CDP oficial disponible";
            }
            LogAction("AUTODIAGNOSTICO", "CONSULTA_COMPLETADA");
            SaveToArchive(false);
            return autoCandidates.ToArray();
        }
        catch (Exception ex)
        {
            autoStatus = "Automatización no disponible (" + ex.GetType().Name + ")";
            LogAction("AUTODIAGNOSTICO", "ERROR");
            UpdatePanel();
            return Array.Empty<string>();
        }
        finally
        {
            autoBusy = false;
            if (!IsDisposed) UpdatePanel();
        }
    }

    internal void RevokeAutomaticAuthorization()
    {
        authorizedApiKey = null;
        authorizedApiPort = null;
        autoCandidates.Clear();
        autoStatus = "Autorización revocada; clave liberada de la sesión";
        if (cdp.IsRunning)
            DisconnectCdp();
        LogAction("AUTODIAGNOSTICO", "REVOCADO");
        UpdatePanel();
    }

    internal string AutoStatus => autoStatus;

    internal void ConnectProfileCdp()
    {
        if (apiDebugPort.HasValue)
            ConnectCdp(apiDebugPort.Value.ToString());
        else
        {
            cdpStatus = "Sin debug_port: abre perfil y consulta API V2";
            UpdatePanel();
        }
    }

    private void LogAction(string action, string result)
    {
        operationHistory.Add(new ArchiveOperation(DateTime.UtcNow.ToString("O"),
            action, result));
        if (operationHistory.Count > 300) operationHistory.RemoveAt(0);
    }

    internal void SaveToArchive(bool showMessage = true)
    {
        try
        {
            var saved = ProfileArchive.SaveReport(archiveProfileId, history, cdpHistory,
                apiFindings, operationHistory);
            archiveStatus = "Guardado: " + Path.GetFileName(saved.JsonPath);
            if (showMessage)
                MessageBox.Show("Archivos TXT, JSON y SHA-256 guardados en:\n" +
                    saved.Directory, "Almacén", MessageBoxButtons.OK,
                    MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            archiveStatus = "Error al guardar (" + ex.GetType().Name + ")";
            if (showMessage)
                MessageBox.Show(archiveStatus, "Almacén", MessageBoxButtons.OK,
                    MessageBoxIcon.Warning);
        }
        if (!IsDisposed) UpdatePanel();
    }

    internal void OpenArchive()
    {
        try
        {
            var folder = ProfileArchive.GetProfileDirectory(archiveProfileId);
            Directory.CreateDirectory(folder);
            var start = new ProcessStartInfo
            {
                FileName = "explorer.exe",
                UseShellExecute = true
            };
            start.ArgumentList.Add(folder);
            Process.Start(start);
        }
        catch (Exception ex)
        {
            MessageBox.Show("No se pudo abrir Almacén (" + ex.GetType().Name + ").",
                "Almacén", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    // Only user-picked existing exports are eligible for encrypted storage.
    // Files in live browser-profile directories are never searched or copied.
    internal void BackupSelectedFile()
    {
        using var dialog = new OpenFileDialog
        {
            Title = "Seleccionar un archivo exportado propio para cifrar",
            Filter = "Archivos (*.*)|*.*",
            Multiselect = false,
            CheckFileExists = true
        };
        if (dialog.ShowDialog() != DialogResult.OK) return;
        if (MessageBox.Show(
            "Se cifrará SOLO el archivo seleccionado, sin subirlo a Internet.\n" +
            "No se extraerán cookies o credenciales desde Chromium. " +
            "Utiliza exportaciones autorizadas y guarda tu contraseña aparte.\n" +
            "¿Continuar?", "Respaldo local cifrado",
            MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes)
            return;

        var password = AskArchivePassword("Contraseña del respaldo", true);
        if (password is null) return;
        try
        {
            var destination = SecureArchive.EncryptSelectedFile(archiveProfileId,
                dialog.FileName, password);
            LogAction("RESPALDO_MANUAL_CIFRADO", "OK");
            SaveToArchive(false);
            MessageBox.Show("Respaldo cifrado creado:\n" + destination +
                "\nEl archivo original permanece sin cambios. " +
                "Sin la contraseña, el respaldo no puede restaurarse.",
                "Almacén", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            LogAction("RESPALDO_MANUAL_CIFRADO", "ERROR");
            MessageBox.Show("No se pudo cifrar (" + ex.GetType().Name + ").",
                "Almacén", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        finally
        {
            password = null;
            if (!IsDisposed) UpdatePanel();
        }
    }

    internal void RestoreSelectedFile()
    {
        using var input = new OpenFileDialog
        {
            Title = "Seleccionar respaldo .dlvault",
            Filter = "Respaldo cifrado (*.dlvault)|*.dlvault",
            CheckFileExists = true
        };
        if (input.ShowDialog() != DialogResult.OK) return;
        using var output = new SaveFileDialog
        {
            Title = "Seleccionar destino para archivo restaurado (fuera del perfil)",
            FileName = "respaldo-restaurado.dat",
            Filter = "Todos los archivos (*.*)|*.*",
            OverwritePrompt = true
        };
        if (output.ShowDialog() != DialogResult.OK) return;
        if (MessageBox.Show(
            "La restauración crea un archivo SIN CIFRAR en la ruta elegida. " +
            "Puede contener información privada. No elijas carpetas internas de Chromium.\n" +
            "¿Confirmar?", "Restaurar respaldo",
            MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes)
            return;
        var password = AskArchivePassword("Contraseña del respaldo", false);
        if (password is null) return;
        try
        {
            SecureArchive.RestoreToSelectedFile(input.FileName, output.FileName, password);
            LogAction("RESTAURAR_ARCHIVO_MANUAL", "OK");
            SaveToArchive(false);
            MessageBox.Show("Archivo restaurado en la ubicación elegida.",
                "Almacén", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            LogAction("RESTAURAR_ARCHIVO_MANUAL", "ERROR");
            MessageBox.Show("No se pudo restaurar (" + ex.GetType().Name + ").",
                "Almacén", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        finally
        {
            password = null;
        }
    }

    private static string? AskArchivePassword(string title, bool confirm)
    {
        using var form = new Form
        {
            Text = title, Width = 440, Height = confirm ? 230 : 190,
            StartPosition = FormStartPosition.CenterScreen,
            FormBorderStyle = FormBorderStyle.FixedDialog,
            MinimizeBox = false, MaximizeBox = false
        };
        var label = new Label
        {
            Left = 15, Top = 14, Width = 400, Height = 35,
            Text = confirm ? "Elige una contraseña robusta (mínimo 12 caracteres)." :
                "Introduce la contraseña del respaldo."
        };
        var first = new TextBox
        {
            Left = 15, Top = 53, Width = 393, UseSystemPasswordChar = true
        };
        form.Controls.Add(label);
        form.Controls.Add(first);
        TextBox? second = null;
        if (confirm)
        {
            second = new TextBox
            {
                Left = 15, Top = 90, Width = 393, UseSystemPasswordChar = true,
                PlaceholderText = "Repite la contraseña"
            };
            form.Controls.Add(second);
        }
        var button = new Button
        {
            Text = "Aceptar", Left = 290, Top = confirm ? 137 : 96,
            Width = 118, DialogResult = DialogResult.OK
        };
        form.Controls.Add(button);
        form.AcceptButton = button;
        var result = form.ShowDialog();
        if (result != DialogResult.OK) return null;
        var password = first.Text;
        if (password.Length < 12 || (confirm && password != second?.Text))
        {
            MessageBox.Show("Contraseña demasiado corta o no coincide.",
                "Almacén", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            first.Clear();
            second?.Clear();
            return null;
        }
        first.Clear();
        second?.Clear();
        return password;
    }

    internal string ArchiveStatus => archiveStatus;
    internal string ApiStatus => apiStatus;
    internal IReadOnlyList<ApiV2Finding> ApiFindings => apiFindings;
    internal string CdpStatus => cdpStatus;
    internal IReadOnlyList<CdpDiagnosticEvent> CdpHistory => cdpHistory;


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
                diagnosticVersion = "30.0.28-rc2-lab",
                schema = 2,
                source = "Windows OS metadata companion; not DICloak internal diagnostics",
                originalEngineModified = false,
                exactHttpBodyCaptured = false,
                cookiesVerified = false,
                proxyVerified = false,
                fingerprintVerified = false,
                extensionsVerified = false,
                sessionAuthenticationVerified = false,
                verification = new
                {
                    windowsProcesses = history.Count > 0 ? "OBSERVADOS" : "NO_VERIFICADO",
                    tcpConnections = history.Any(x => x.TcpConnections > 0) ?
                        "OBSERVADAS" : "NO_VERIFICADO",
                    httpResponseMetadata = cdpHistory.Any(x => x.Type == "HTTP_RESPONSE") ?
                        "OBSERVADOS_POR_CDP" : "NO_VERIFICADO",
                    exactHttpBody = "NO_VERIFICADO",
                    cookiesApplied = "NO_VERIFICADO",
                    proxyApplied = "NO_VERIFICADO",
                    fingerprintApplied = "NO_VERIFICADO",
                    extensionsLoaded = "NO_VERIFICADO",
                    authenticatedSession = "NO_VERIFICADO"
                },
                localApiV2 = new
                {
                    status = apiStatus,
                    findings = apiFindings.ToArray(),
                    debugPortAvailable = apiDebugPort.HasValue
                },
                cdp = new
                {
                    userOptIn = cdpPort.HasValue,
                    localPort = cdpPort,
                    status = cdpStatus,
                    coverage = "Primer target page; sin URLs, cabeceras, cuerpos, cookies ni credenciales",
                    events = cdpHistory.ToArray()
                },
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

    internal void ExportTxt()
    {
        try
        {
            var downloads = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
            if (!Directory.Exists(downloads))
                downloads = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var target = Path.Combine(downloads, "diloakPRO-Diagnostico-RC2-" +
                DateTime.Now.ToString("yyyyMMdd-HHmmss") + ".txt");
            var lines = new List<string>
            {
                "diloakPRO 30.0.28 RC2 - Diagnostico externo",
                "Motor DICloak 3.0.9 sin alterar",
                "CDP: " + cdpStatus,
                "No verificado: sesion, cookies, proxy, fingerprint, extensiones",
                "=== Windows ==="
            };
            lines.AddRange(history.Select(x => x.Utc + " Motor=" + x.MotorProcesses +
                " Chromium=" + x.ChromiumProcesses + " TCP=" + x.TcpConnections));
            lines.Add("=== API V2 (solo lectura, sin datos sensibles) ===");
            lines.Add("API: " + apiStatus);
            lines.AddRange(apiFindings.Select(x => x.Utc + " " + x.Category + " " +
                x.Status + " " + x.Detail));
            lines.Add("=== CDP primer target page ===");
            lines.AddRange(cdpHistory.Select(x => x.Utc + " " + x.Type +
                (x.HttpStatus.HasValue ? " HTTP=" + x.HttpStatus : "")));
            File.WriteAllLines(target, lines, Encoding.UTF8);
            MessageBox.Show("Informe TXT exportado:\n" + target,
                "Diagnóstico", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            MessageBox.Show("No se pudo exportar TXT: " + ex.GetType().Name,
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
        Dock = DockStyle.Top, Height = 88, ForeColor = Color.White,
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
        Text = "CDP opcional: puerto local de depuración que hayas habilitado.\n" +
               "Solo primer target page; sin URL, cabeceras, cuerpos ni secretos.\n" +
               "API V2: solo consultas GET; clave nunca exportada. Estado de perfil no es login.\n" +
               "Cookies, proxy aplicado, fingerprint aplicado, extensiones reales y R4: no verificados.",
        ForeColor = Color.FromArgb(210, 220, 234),
        Padding = new Padding(12), Font = new Font("Segoe UI", 9)
    };
    private readonly DiagnosticBubble bubble;
    private readonly TextBox apiPort = new()
    {
        Width = 85,
        PlaceholderText = "Puerto API"
    };
    private readonly TextBox apiKey = new()
    {
        Width = 140,
        UseSystemPasswordChar = true,
        PlaceholderText = "Clave API local"
    };
    private readonly TextBox profileId = new()
    {
        Width = 135,
        PlaceholderText = "ID de perfil"
    };
    private readonly ComboBox autoProfileSelector = new()
    {
        Width = 185,
        DropDownStyle = ComboBoxStyle.DropDownList,
        Visible = false
    };
    private readonly TextBox cdpPort = new()
    {
        Width = 86,
        Text = "",
        PlaceholderText = "Puerto CDP"
    };

    public DiagnosticWindow(DiagnosticBubble owner)
    {
        bubble = owner;
        Text = "diloakPRO 30.0.28 RC2 LAB - Diagnóstico";
        Width = 1010; Height = 660;
        MinimumSize = new Size(900, 550);
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
        add("Exportar TXT", owner.ExportTxt);
        add("Abrir DICloak", owner.OpenMotor);
        add("Cerrar panel", Close);
        add("Salir", owner.Exit);

        var cdpbar = new FlowLayoutPanel
        {
            Dock = DockStyle.Top, Height = 44, Padding = new Padding(9),
            BackColor = Color.FromArgb(29, 45, 67)
        };
        cdpbar.Controls.Add(new Label
        {
            Text = "CDP local (opt-in):", AutoSize = true, ForeColor = Color.White,
            Padding = new Padding(0, 4, 0, 0)
        });
        cdpbar.Controls.Add(cdpPort);
        var connect = new Button { Text = "Conectar CDP", AutoSize = true };
        connect.Click += (_, _) => owner.ConnectCdp(cdpPort.Text);
        var disconnect = new Button { Text = "Desconectar", AutoSize = true };
        disconnect.Click += (_, _) => owner.DisconnectCdp();
        cdpbar.Controls.Add(connect);
        cdpbar.Controls.Add(disconnect);
        var apiBar = new FlowLayoutPanel
        {
            Dock = DockStyle.Top, Height = 44, Padding = new Padding(9),
            BackColor = Color.FromArgb(29, 45, 67)
        };
        apiBar.Controls.Add(new Label
        {
            Text = "API V2 local:", AutoSize = true, ForeColor = Color.White,
            Padding = new Padding(0, 4, 0, 0)
        });
        apiBar.Controls.Add(apiPort);
        apiBar.Controls.Add(apiKey);
        apiBar.Controls.Add(profileId);
        var apiCheck = new Button { Text = "Comprobar perfil", AutoSize = true };
        apiCheck.Click += async (_, _) =>
        {
            var key = apiKey.Text;
            apiKey.Clear();
            await owner.CheckApiV2Async(apiPort.Text, key, profileId.Text);
        };
        apiBar.Controls.Add(apiCheck);
        var profileCdp = new Button { Text = "Conectar CDP del perfil", AutoSize = true };
        profileCdp.Click += (_, _) => owner.ConnectProfileCdp();
        apiBar.Controls.Add(profileCdp);
        var archiveBar = new FlowLayoutPanel
        {
            Dock = DockStyle.Top, Height = 40, Padding = new Padding(7),
            BackColor = Color.FromArgb(29, 45, 67)
        };
        var saveArchive = new Button { Text = "Guardar Almacén", AutoSize = true };
        saveArchive.Click += (_, _) => owner.SaveToArchive();
        archiveBar.Controls.Add(saveArchive);
        var openArchive = new Button { Text = "Abrir Almacén", AutoSize = true };
        openArchive.Click += (_, _) => owner.OpenArchive();
        archiveBar.Controls.Add(openArchive);
        archiveBar.Controls.Add(new Label
        {
            Text = "Respaldo seguro:", AutoSize = true, ForeColor = Color.White,
            Padding = new Padding(2, 4, 0, 0)
        });
        var encryptButton = new Button { Text = "Cifrar archivo seleccionado", AutoSize = true };
        encryptButton.Click += (_, _) => owner.BackupSelectedFile();
        archiveBar.Controls.Add(encryptButton);
        var restoreButton = new Button { Text = "Restaurar respaldo", AutoSize = true };
        restoreButton.Click += (_, _) => owner.RestoreSelectedFile();
        archiveBar.Controls.Add(restoreButton);
        var autoBar = new FlowLayoutPanel
        {
            Dock = DockStyle.Top, Height = 44, Padding = new Padding(8),
            BackColor = Color.FromArgb(34, 58, 83)
        };
        var automatic = new Button
        {
            Text = "Autorizar diagnóstico automático", AutoSize = true,
            BackColor = Color.FromArgb(34, 91, 155),
            ForeColor = Color.White
        };
        async Task RunAutomatic(string requestedId)
        {
            var key = apiKey.Text;
            apiKey.Clear();
            var candidates = await owner.AutomaticDiagnosticAsync(
                apiPort.Text, key, requestedId);
            autoProfileSelector.Items.Clear();
            if (candidates.Count > 1)
            {
                foreach (var candidate in candidates)
                    autoProfileSelector.Items.Add(candidate);
                autoProfileSelector.Visible = true;
            }
            else autoProfileSelector.Visible = false;
        }
        automatic.Click += async (_, _) =>
        {
            var approval = MessageBox.Show(
                "El diagnóstico consultará la API LOCAL de solo lectura, " +
                "buscará perfiles abiertos y conectará CDP si ese perfil ya lo permite.\n\n" +
                "No abre/cierra perfiles ni cambia permisos. La clave se mantiene solo en memoria de esta sesión, nunca en los informes. " +
                "No recoge contraseñas, cookies, tokens ni cuerpos HTTP.\n\n" +
                "¿Autorizas iniciar estas consultas en tu propio DICloak?",
                "Autorizar diagnóstico automático",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            if (approval != DialogResult.Yes) return;
            await RunAutomatic(profileId.Text);
        };
        autoBar.Controls.Add(automatic);
        autoBar.Controls.Add(autoProfileSelector);
        var chooseProfile = new Button { Text = "Usar perfil elegido", AutoSize = true };
        chooseProfile.Click += async (_, _) =>
        {
            if (autoProfileSelector.SelectedItem is string selected)
                await RunAutomatic(selected);
        };
        autoBar.Controls.Add(chooseProfile);
        var revoke = new Button { Text = "Revocar acceso", AutoSize = true };
        revoke.Click += (_, _) =>
        {
            owner.RevokeAutomaticAuthorization();
            apiKey.Clear();
            autoProfileSelector.Items.Clear();
            autoProfileSelector.Visible = false;
        };
        autoBar.Controls.Add(revoke);
        Controls.Add(events);
        Controls.Add(autoBar);
        Controls.Add(archiveBar);
        Controls.Add(warning);
        Controls.Add(apiBar);
        Controls.Add(cdpbar);
        Controls.Add(toolbar);
        Controls.Add(status);
    }

    public void RefreshFrom(DiagnosticBubble bubble)
    {
        if (IsDisposed) return;
        status.Text = "Windows: " + bubble.State + " (" + bubble.Count + " muestras)" +
                      " | CDP: " + bubble.CdpStatus + " | API: " + bubble.ApiStatus +
                      "\nAuto: " + bubble.AutoStatus +
                      "\nArchivo: " + bubble.ArchiveStatus +
                      (bubble.Error is null ? "" : "\n" + bubble.Error);
        var windowsLines = bubble.History.TakeLast(12).Select(x =>
            x.Utc[11..19] + " UTC | Motor: " + x.MotorProcesses +
            " | Chromium: " + x.ChromiumProcesses +
            " | TCP: " + x.TcpConnections);
        var cdpLines = bubble.CdpHistory.TakeLast(20).Select(x =>
            x.Utc[11..19] + " UTC | " + x.Type +
            (x.HttpStatus.HasValue ? " | HTTP " + x.HttpStatus : ""));
        var apiLines = bubble.ApiFindings.TakeLast(10).Select(x =>
            x.Utc[11..19] + " UTC | API " + x.Category +
            " " + x.Status);
        events.Text = string.Join(Environment.NewLine,
            windowsLines.Concat(cdpLines).Concat(apiLines));
    }
}
