using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
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
    private readonly List<LabComparisonEvent> labComparisons = new();
    private readonly List<LabServerProof> importedServerProofs = new();
    private readonly List<LabProofAudit> labProofAudits = new();
    private readonly List<SavedFileEvidence> savedFileEvidence = new();
    private string labComparisonStatus = "No configurada";
    private char[]? labCapturePassword; // only while explicitly enabled
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
        ClearLabCapturePassword();
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
        if (recording) return;
        history.Clear();
        labComparisons.Clear();
        importedServerProofs.Clear();
        labProofAudits.Clear();
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
        if (cdp.IsRunning) cdp.Stop();
        cdp.StopLab();
        ClearLabCapturePassword();
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

    private void ClearLabCapturePassword()
    {
        if (labCapturePassword is null) return;
        Array.Clear(labCapturePassword);
        labCapturePassword = null;
    }

    internal void EnableLabComparison(string origin)
    {
        if (!LabResponseComparison.TryCreate(origin, out _))
        {
            labComparisonStatus = "Origen inválido: usa HTTPS propio o HTTP localhost (sin ruta)";
            UpdatePanel();
            return;
        }
        if (MessageBox.Show(
            "Solo captura respuestas JSON de rutas /__diloakpro_lab__/ del origen elegido. " +
            "Usa exclusivamente datos desechables de tu servidor. " +
            "El contenido se cifrará localmente y no se comparará automáticamente. " +
            "¿Activar esta captura?", "Captura de laboratorio",
            MessageBoxButtons.YesNo, MessageBoxIcon.Warning) != DialogResult.Yes)
            return;
        var password = AskArchivePassword("Contraseña para las capturas de prueba", true);
        if (password is null) return;
        cdp.StopLab();
        ClearLabCapturePassword();
        labCapturePassword = password.ToCharArray();
        password = null;
        bool ready = cdp.ConfigureLab(origin, entry =>
        {
            if (IsDisposed || !IsHandleCreated) return;
            try
            {
                BeginInvoke(new Action(() =>
                {
                    if (IsDisposed) return;
                    labComparisons.Add(entry);
                    if (labComparisons.Count > 120) labComparisons.RemoveAt(0);
                    RefreshLabProofAudits();
                    labComparisonStatus = entry.Result + " (prueba " + entry.TestId + ")";
                    UpdatePanel();
                    SaveToArchive(false);
                }));
            }
            catch (InvalidOperationException) { }
        }, (_, body) =>
            SecureArchive.EncryptLabResponse(archiveProfileId, body,
                labCapturePassword ?? Array.Empty<char>()));
        if (!ready) ClearLabCapturePassword();
        labComparisonStatus = ready ?
            "Activa: JSON de prueba guardado cifrado al recibirse" : "No disponible";
        LogAction("CAPTURA_LAB", ready ? "ACTIVADA" : "ERROR");
        UpdatePanel();
    }

    internal void DisableLabComparison()
    {
        cdp.StopLab();
        ClearLabCapturePassword();
        labComparisonStatus = "Desactivada";
        LogAction("CAPTURA_LAB", "DESACTIVADA");
        SaveToArchive(false);
        UpdatePanel();
    }

    private void RefreshLabProofAudits()
    {
        // Independent server evidence is imported for the user's own review.
        // This application does not issue a verdict about matching bytes.
        labProofAudits.Clear();
        foreach (var proof in importedServerProofs)
            labProofAudits.Add(new LabProofAudit(
                DateTime.UtcNow.ToString("O"), proof.TestId, "IMPORTADO",
                proof.ResponseSha256, null,
                "SHA del servidor disponible; el usuario realiza la comparación",
                proof.FieldSummary));
    }

    internal void ImportLabServerProof()
    {
        using var dialog = new OpenFileDialog
        {
            Title = "Importar prueba JSON de nuestro servidor de laboratorio",
            Filter = "Pruebas del servidor (*.proof.json)|*.proof.json",
            CheckFileExists = true
        };
        if (dialog.ShowDialog() != DialogResult.OK) return;
        try
        {
            var proof = LabServerProofAudit.Read(dialog.FileName);
            importedServerProofs.RemoveAll(x => x.TestId == proof.TestId);
            importedServerProofs.Add(proof);
            if (importedServerProofs.Count > 100)
                importedServerProofs.RemoveAt(0);
            RefreshLabProofAudits();
            var audit = labProofAudits.LastOrDefault(x => x.TestId == proof.TestId);
            labComparisonStatus = audit is null ? "Sin informe" :
                "Informe del servidor importado para revisión manual";
            LogAction("IMPORTAR_PRUEBA_LAB", "OK");
            SaveToArchive(false);
            MessageBox.Show("Evidencia del servidor importada." +
                "\nID de prueba: " + proof.TestId +
                "\nSHA-256 del servidor: " + proof.ResponseSha256 +
                "\nTú decides cómo comparar estos datos." +
                "\nNo se importan cuerpos JSON, contraseñas ni cookies.",
                "Comparación de laboratorio", MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }
        catch (Exception ex)
        {
            LogAction("IMPORTAR_PRUEBA_LAB", "ERROR");
            MessageBox.Show("Archivo de prueba no válido (" + ex.GetType().Name + ").",
                "Comparación de laboratorio", MessageBoxButtons.OK,
                MessageBoxIcon.Warning);
        }
        UpdatePanel();
    }

    internal string LabComparisonStatus => labComparisonStatus;
    internal IReadOnlyList<LabProofAudit> LabProofAudits => labProofAudits;
    internal IReadOnlyList<LabComparisonEvent> LabComparisons => labComparisons;

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

        // Windows observations do not require vendor API authorization.
        if (!recording)
            StartRecording();

        if (!string.IsNullOrWhiteSpace(suppliedKey))
            authorizedApiKey = suppliedKey;
        if (string.IsNullOrWhiteSpace(authorizedApiKey))
        {
            autoStatus = "Windows en marcha; pega una vez la clave Open API para ampliar";
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
                apiFindings, operationHistory, labComparisons, labProofAudits,
                savedFileEvidence);
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
            var ext = Path.GetExtension(dialog.FileName).ToLowerInvariant();
            var category = ext switch
            {
                ".crx" or ".xpi" => "PAQUETE_DE_EXTENSION_EXPORTADO",
                ".zip" => "PAQUETE_ZIP_EXPORTADO",
                ".json" => "JSON_EXPORTADO",
                ".har" => "TRAFICO_HAR_EXPORTADO",
                ".txt" => "TEXTO_EXPORTADO",
                _ => "ARCHIVO_PROPIO_SELECCIONADO"
            };
            savedFileEvidence.Add(new SavedFileEvidence(
                DateTime.UtcNow.ToString("O"), category,
                Path.GetFileName(destination), new FileInfo(destination).Length,
                "Seleccionado manualmente",
                "ARCHIVO_CIFRADO; NO PRUEBA USO EN CHROMIUM"));
            if (savedFileEvidence.Count > 120) savedFileEvidence.RemoveAt(0);
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

    internal int SavedFileCount => savedFileEvidence.Count;
    internal IReadOnlyList<SavedFileEvidence> SavedFiles => savedFileEvidence;

    internal void ShowEvidence()
    {
        var lines = new List<string>
        {
            "diloakPRO RC2 | EVIDENCIAS REGISTRADAS",
            "Solo se muestran observaciones, no hay comparacion automatica.",
            "",
            "WINDOWS: muestras=" + history.Count +
                ", procesos/Cromium/TCP observados; no contienen JSON.",
            "CDP: " + cdpStatus + ", eventos=" + cdpHistory.Count,
            "API V2: " + apiStatus,
            "",
            "=== JSON de Chromium (referencia de cuerpo cifrado, si se obtuvo) ==="
        };
        lines.AddRange(labComparisons.Select(e =>
            e.Utc + " " + e.Result + " TEST=" + e.TestId +
            " HTTP=" + e.HttpStatus +
            " SHA_CABECERA=" + e.ServerSha256 +
            " SHA_CHROMIUM=" + e.ClientSha256 +
            " ARCHIVO_CIFRADO=" + (e.EncryptedFileName ?? "NINGUNO") +
            " BYTES=" + (e.CapturedBytes?.ToString() ?? "N/D")));
        lines.Add("");
        lines.Add("=== Informes importados del servidor (sin valores privados) ===");
        lines.AddRange(labProofAudits.Select(e =>
            e.Utc + " TEST=" + e.TestId +
            " SHA_SERVIDOR=" + e.ServerSha256 +
            " CAMPOS=" + e.FieldSummary));
        lines.Add("");
        lines.Add("=== Archivos propios guardados bajo cifrado ===");
        lines.AddRange(savedFileEvidence.Select(e =>
            e.Utc + " " + e.Category +
            " " + e.EncryptedFileName + " " + e.EncryptedBytes + " bytes"));
        lines.Add("");
        lines.Add("No se capturan credenciales, tokens ni cookies reales del navegador.");
        if (labComparisons.Count == 0 && labProofAudits.Count == 0 &&
            savedFileEvidence.Count == 0)
            lines.Add("AUN SIN EVIDENCIAS HTTP O ARCHIVOS EXPORTADOS. Las muestras Windows no son JSON.");
        using var popup = new Form
        {
            Text = "diloakPRO - Ver evidencias",
            Width = 860, Height = 590,
            StartPosition = FormStartPosition.CenterParent,
            BackColor = Color.FromArgb(20, 32, 48)
        };
        var content = new TextBox
        {
            Multiline = true, ReadOnly = true, Dock = DockStyle.Fill,
            Font = new Font("Consolas", 10),
            ForeColor = Color.White, BackColor = Color.FromArgb(16, 24, 38),
            ScrollBars = ScrollBars.Both, WordWrap = false,
            Text = string.Join(Environment.NewLine, lines)
        };
        var copy = new Button
        {
            Dock = DockStyle.Bottom, Height = 38,
            Text = "Copiar inventario de evidencias (sin secretos)"
        };
        copy.Click += (_, _) =>
        {
            try { Clipboard.SetText(content.Text); }
            catch { MessageBox.Show("No se pudo copiar.", "Evidencias"); }
        };
        var view = new Button
        {
            Dock = DockStyle.Bottom, Height = 38,
            Text = "Ver JSON cifrado (con contraseña)"
        };
        view.Click += (_, _) => ShowEncryptedLabBody(popup);
        popup.Controls.Add(content);
        popup.Controls.Add(copy);
        popup.Controls.Add(view);
        popup.ShowDialog((IWin32Window?)window ?? this);
    }

    private void ShowEncryptedLabBody(IWin32Window owner)
    {
        var folder = Path.Combine(ProfileArchive.GetProfileDirectory(archiveProfileId),
            "RespaldosCifrados");
        Directory.CreateDirectory(folder);
        using var dialog = new OpenFileDialog
        {
            Title = "Elige un JSON de laboratorio capturado",
            Filter = "Captura cifrada (respuesta-lab-*.dlvault)|respuesta-lab-*.dlvault",
            InitialDirectory = folder,
            CheckFileExists = true
        };
        if (dialog.ShowDialog(owner) != DialogResult.OK) return;
        var password = AskArchivePassword("Contraseña de captura de laboratorio", false);
        if (password is null) return;
        try
        {
            var plaintext = SecureArchive.ReadLabResponse(dialog.FileName,
                password.AsSpan());
            string body;
            try { body = new UTF8Encoding(false, true).GetString(plaintext); }
            finally { CryptographicOperations.ZeroMemory(plaintext); }
            using var viewer = new Form
            {
                Text = "JSON de laboratorio - vista temporal en memoria",
                Width = 860, Height = 590,
                StartPosition = FormStartPosition.CenterParent
            };
            var content = new TextBox
            {
                Dock = DockStyle.Fill, Multiline = true, ReadOnly = true,
                ScrollBars = ScrollBars.Both, WordWrap = false,
                Font = new Font("Consolas", 10), Text = body
            };
            viewer.Controls.Add(content);
            viewer.ShowDialog(owner);
            content.Clear();
            body = string.Empty;
        }
        catch (Exception ex)
        {
            MessageBox.Show("No se pudo abrir JSON cifrado (" +
                ex.GetType().Name + ").", "Captura de laboratorio",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
        finally { password = null; }
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
                exactHttpBodyCaptured = labComparisons.Any(x => x.EncryptedFileName != null),
                cookiesVerified = false,
                proxyVerified = false,
                fingerprintVerified = false,
                extensionsVerified = false,
                sessionAuthenticationVerified = false,
                labServerBrowserComparisons = labComparisons.ToArray(),
                userSelectedEncryptedFiles = savedFileEvidence.ToArray(),
                independentServerProofAudits = labProofAudits.ToArray(),
                verification = new
                {
                    windowsProcesses = history.Count > 0 ? "OBSERVADOS" : "NO_VERIFICADO",
                    tcpConnections = history.Any(x => x.TcpConnections > 0) ?
                        "OBSERVADAS" : "NO_VERIFICADO",
                    httpResponseMetadata = cdpHistory.Any(x => x.Type == "HTTP_RESPONSE") ?
                        "OBSERVADOS_POR_CDP" : "NO_VERIFICADO",
                    exactHttpBody = labComparisons.Any(x => x.EncryptedFileName != null) ?
                        "JSON_LAB_GUARDADO_CIFRADO" : "NO_VERIFICADO",
                    labJsonCompared = "NO_SE_COMPARA_REVISION_MANUAL",
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
            lines.Add("=== Comparación JSON servidor propio vs Chromium (sin cuerpos) ===");
            lines.AddRange(labComparisons.Select(x => x.Utc + " PRUEBA=" + x.TestId +
                " RESULTADO=" + x.Result + " HTTP=" + x.HttpStatus +
                " SERVIDOR=" + x.ServerSha256 + " NAVEGADOR=" + x.ClientSha256));
            lines.Add("=== Pruebas independientes importadas del servidor ===");
            lines.AddRange(labProofAudits.Select(x => x.Utc + " PRUEBA=" + x.TestId +
                " RESULTADO=" + x.Result + " SERVIDOR=" + x.ServerSha256 +
                " CHROMIUM=" + x.ChromiumSha256));
            lines.Add("=== Archivos propios seleccionados y cifrados ===");
            lines.AddRange(savedFileEvidence.Select(x => x.Utc + " " + x.Category +
                " " + x.EncryptedFileName + " " + x.EncryptedBytes + " bytes"));
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
        Dock = DockStyle.Bottom, Height = 58,
        Text = "Capturar y mostrar evidencia; tú comparas con tu servidor. " +
               "Los archivos seleccionados se guardan cifrados.\n" +
               "No se extraen cookies ni contraseñas de sesiones reales; " +
               "una configuración guardada no prueba su aplicación en Chromium.",
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
    private readonly TextBox labOrigin = new()
    {
        Width = 300,
        PlaceholderText = "Origen de laboratorio: https://tu-servidor"
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
        Width = 1040; Height = 710;
        MinimumSize = new Size(920, 580);
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
        add("Iniciar captura", owner.StartRecording);
        add("Detener", owner.StopRecording);
        add("Ver evidencias", owner.ShowEvidence);
        add("Guardar", () => owner.SaveToArchive());
        var advancedToggle = new Button
        {
            Text = "Avanzado ▾", Height = 29, AutoSize = true,
            BackColor = Color.FromArgb(42, 69, 99), ForeColor = Color.White
        };
        toolbar.Controls.Add(advancedToggle);

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
        archiveBar.Controls.Add(new Label
        {
            Text = "Respaldo seguro:", AutoSize = true, ForeColor = Color.White,
            Padding = new Padding(2, 4, 0, 0)
        });
        var encryptButton = new Button { Text = "Añadir archivo", AutoSize = true };
        encryptButton.Click += (_, _) => owner.BackupSelectedFile();
        archiveBar.Controls.Add(encryptButton);
        var openFolder = new Button { Text = "Abrir carpeta", AutoSize = true };
        openFolder.Click += (_, _) => owner.OpenArchive();
        archiveBar.Controls.Add(openFolder);
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
        var labBar = new FlowLayoutPanel
        {
            Dock = DockStyle.Top, Height = 44, Padding = new Padding(8),
            BackColor = Color.FromArgb(33, 61, 79)
        };
        labBar.Controls.Add(new Label
        {
            Text = "Capturar JSON de prueba:", AutoSize = true,
            ForeColor = Color.White, Padding = new Padding(0, 4, 0, 0)
        });
        labBar.Controls.Add(labOrigin);
        var enableLab = new Button { Text = "Activar captura", AutoSize = true };
        enableLab.Click += (_, _) => owner.EnableLabComparison(labOrigin.Text);
        labBar.Controls.Add(enableLab);
        var disableLab = new Button { Text = "Desactivar", AutoSize = true };
        disableLab.Click += (_, _) => owner.DisableLabComparison();
        labBar.Controls.Add(disableLab);
        var importProof = new Button
        {
            Text = "Cargar evidencia del servidor", AutoSize = true
        };
        importProof.Click += (_, _) => owner.ImportLabServerProof();
        labBar.Controls.Add(importProof);
        var advancedPanel = new Panel
        {
            Dock = DockStyle.Top, Height = 218, Visible = false,
            BackColor = Color.FromArgb(29, 45, 67)
        };
        advancedPanel.Controls.Add(labBar);
        advancedPanel.Controls.Add(autoBar);
        advancedPanel.Controls.Add(archiveBar);
        advancedPanel.Controls.Add(apiBar);
        advancedPanel.Controls.Add(cdpbar);
        advancedToggle.Click += (_, _) =>
        {
            advancedPanel.Visible = !advancedPanel.Visible;
            advancedToggle.Text = advancedPanel.Visible ? "Avanzado ▴" : "Avanzado ▾";
        };
        Controls.Add(events);
        Controls.Add(advancedPanel);
        Controls.Add(warning);
        Controls.Add(toolbar);
        Controls.Add(status);
    }

    public void RefreshFrom(DiagnosticBubble bubble)
    {
        if (IsDisposed) return;
        status.Text = "Captura: " + bubble.State + " (" + bubble.Count + " muestras Windows)" +
                      " | Navegador: " + bubble.CdpStatus +
                      "\nEvidencias de respuesta: " + bubble.LabComparisons.Count +
                      " | Servidor: " + bubble.LabProofAudits.Count +
                      " | Archivos cifrados: " + bubble.SavedFileCount +
                      "\nÚltimo guardado: " + bubble.ArchiveStatus +
                      (bubble.Error is null ? "" : "\n" + bubble.Error);
        var windowsLines = bubble.History.TakeLast(12).Select(x =>
            x.Utc[11..19] + " UTC | Motor: " + x.MotorProcesses +
            " | Chromium: " + x.ChromiumProcesses +
            " | TCP: " + x.TcpConnections);
        var cdpLines = bubble.CdpHistory.TakeLast(20).Select(x =>
            x.Utc[11..19] + " UTC | " + x.Type +
            (x.HttpStatus.HasValue ? " | HTTP " + x.HttpStatus : ""));
        var labLines = bubble.LabComparisons.TakeLast(8).Select(x =>
            x.Utc[11..19] + " UTC | LAB " + x.Result +
            " | ID " + x.TestId);
        var proofLines = bubble.LabProofAudits.TakeLast(6).Select(x =>
            x.Utc[11..19] + " UTC | PRUEBA SERVIDOR " + x.Result +
            " | " + x.TestId + " | " + x.FieldSummary);
        var apiLines = bubble.ApiFindings.TakeLast(10).Select(x =>
            x.Utc[11..19] + " UTC | API " + x.Category +
            " " + x.Status);
        var fileLines = bubble.SavedFiles.TakeLast(8).Select(x =>
            x.Utc[11..19] + " UTC | GUARDADO " + x.Category + " | " + x.EncryptedFileName);
        var lines = new List<string>
        {
            "EVIDENCIAS DEL DIAGNOSTICO - Capturar / Mostrar / Guardar",
            "La comparacion con el servidor la realiza el usuario.",
            ""
        };
        lines.AddRange(proofLines);
        lines.AddRange(labLines);
        lines.AddRange(fileLines);
        lines.AddRange(cdpLines.TakeLast(8));
        lines.AddRange(apiLines.TakeLast(5));
        if (bubble.LabComparisons.Count == 0 && bubble.LabProofAudits.Count == 0 &&
            bubble.SavedFileCount == 0)
            lines.Add("No hay JSON de laboratorio ni archivos seleccionados todavía.");
        lines.Add("");
        lines.Add("=== Actividad basica Windows (sin cuerpos HTTP) ===");
        lines.AddRange(windowsLines.TakeLast(5));
        events.Text = string.Join(Environment.NewLine, lines);
    }
}
