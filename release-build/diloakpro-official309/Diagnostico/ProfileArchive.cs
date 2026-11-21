using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace DiloakPRO.Diagnostico;

// Local-only archive of sanitized diagnostics. Never store API keys,
// plaintext cookies, passwords, credential material or HTTP message bodies.
internal sealed record ArchiveOperation(string Utc, string Action, string Result);
internal sealed record ArchiveSaveResult(string Directory, string JsonPath, string TxtPath, string Sha256);

internal static class ProfileArchive
{
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    internal static string GetProfileDirectory(string? profileId)
    {
        var safeId = IsSafeProfileId(profileId) ? profileId! : "General";
        return Path.Combine(Environment.GetFolderPath(
                Environment.SpecialFolder.LocalApplicationData),
            "diloakPRO", "ArchivoRC2", "Perfiles", "Perfil-" + safeId);
    }

    internal static bool IsSafeProfileId(string? id) =>
        !string.IsNullOrWhiteSpace(id) &&
        id.Length <= 32 &&
        id.All(c => c >= '0' && c <= '9');

    internal static ArchiveSaveResult SaveReport(
        string? profileId,
        IReadOnlyList<Snapshot> windows,
        IReadOnlyList<CdpDiagnosticEvent> cdpEvents,
        IReadOnlyList<ApiV2Finding> apiFindings,
        IReadOnlyList<ArchiveOperation> commands)
    {
        // Each record is a structured, hard-coded allowlist of non-secret fields.
        var folder = Path.Combine(GetProfileDirectory(profileId), "Diagnosticos");
        Directory.CreateDirectory(folder);
        var stem = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss-fffffff") + "-" +
            Guid.NewGuid().ToString("N")[..8];
        var jsonPath = Path.Combine(folder, "diagnostico-" + stem + ".json");
        var txtPath = Path.Combine(folder, "diagnostico-" + stem + ".txt");
        var manifestPath = Path.Combine(folder, "diagnostico-" + stem + ".sha256");

        var verified = new
        {
            windowsProcesses = windows.Count > 0 ? "OBSERVADO" : "NO_VERIFICADO",
            tcpConnections = windows.Any(x => x.TcpConnections > 0) ?
                "OBSERVADO" : "NO_VERIFICADO",
            httpMetadata = cdpEvents.Any(x => x.Type == "HTTP_RESPONSE") ?
                "OBSERVADO_EN_CDP" : "NO_VERIFICADO",
            exactHttpBodies = "NO_VERIFICADO",
            cookiesApplied = "NO_VERIFICADO",
            proxyApplied = "NO_VERIFICADO",
            fingerprintApplied = "NO_VERIFICADO",
            extensionsLoaded = "NO_VERIFICADO",
            authenticatedSession = "NO_VERIFICADO"
        };
        var report = new
        {
            schema = 3,
            diagnosticVersion = "30.0.28-rc2-archive-lab",
            capturedAtUtc = DateTime.UtcNow.ToString("O"),
            profile = IsSafeProfileId(profileId) ? profileId : null,
            coverage = "Metadatos Windows/CDP/API V2 sin secretos",
            verification = verified,
            events = windows.ToArray(),
            cdp = cdpEvents.ToArray(),
            localApiFindings = apiFindings.ToArray(),
            commands = commands.ToArray()
        };
        var json = JsonSerializer.Serialize(report, JsonOptions) + "\n";
        var txt = new StringBuilder();
        txt.AppendLine("diloakPRO RC2 - Almacen local de diagnostico");
        txt.AppendLine("Motor oficial 3.0.9: sin modificacion");
        txt.AppendLine("Perfil: " + (IsSafeProfileId(profileId) ? profileId : "General"));
        txt.AppendLine("NOTA: ninguna configuracion demuestra por si sola su aplicacion en Chromium.");
        txt.AppendLine("Cookies, credenciales, sesiones web y cuerpos HTTP: NO exportados.");
        txt.AppendLine("=== Procesos Windows/TCP ===");
        foreach (var e in windows)
            txt.AppendLine(e.Utc + " Motor=" + e.MotorProcesses +
                " Chromium=" + e.ChromiumProcesses + " TCP=" + e.TcpConnections);
        txt.AppendLine("=== CDP (metadatos sanitizados) ===");
        foreach (var e in cdpEvents)
            txt.AppendLine(e.Utc + " " + e.Type +
                (e.HttpStatus.HasValue ? " HTTP=" + e.HttpStatus.Value : ""));
        txt.AppendLine("=== Estado API V2 ===");
        foreach (var e in apiFindings)
            txt.AppendLine(e.Utc + " " + e.Category + ": " + e.Status);
        txt.AppendLine("=== Acciones propias del diagnostico (sin argumentos privados) ===");
        foreach (var e in commands)
            txt.AppendLine(e.Utc + " " + e.Action + ": " + e.Result);

        // New filenames are unique; failed writes never become visible as final files.
        AtomicText(jsonPath, json);
        AtomicText(txtPath, txt.ToString());
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(json)))
            .ToLowerInvariant();
        AtomicText(manifestPath, hash + "  " + Path.GetFileName(jsonPath) + "\n");
        return new ArchiveSaveResult(folder, jsonPath, txtPath, hash);
    }

    private static void AtomicText(string destination, string content)
    {
        var tmp = destination + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            File.WriteAllText(tmp, content, new UTF8Encoding(false));
            File.Move(tmp, destination);
        }
        finally
        {
            if (File.Exists(tmp)) File.Delete(tmp);
        }
    }
}
