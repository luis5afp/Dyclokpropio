using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace DiloakPRO.Diagnostico;

internal sealed record Snapshot(
    string Utc, int MotorProcesses, int DescendantProcesses,
    int ChromiumProcesses, int TcpConnections, string Coverage, string Verification);
internal sealed record CdpDiagnosticEvent(string Utc, string Type, int? HttpStatus, string Detail);
internal sealed record ApiV2Finding(string Utc, string Category, string Status, string Detail);

internal static class ArchiveTests
{
    public static int Main()
    {
        var profileId = DateTime.UtcNow.Ticks.ToString();
        var profilePath = ProfileArchive.GetProfileDirectory(profileId);
        var testFolder = Path.Combine(Path.GetTempPath(),
            "diloakpro-archive-fixture-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(testFolder);
        try
        {
            var operation = new ArchiveOperation(DateTime.UtcNow.ToString("O"),
                "COMPROBAR_PERFIL", "OK");
            var result = ProfileArchive.SaveReport(profileId,
                new[] { new Snapshot(DateTime.UtcNow.ToString("O"), 5, 15, 10, 28,
                    "Windows metadata", "HTTP body not captured") },
                new[] { new CdpDiagnosticEvent(DateTime.UtcNow.ToString("O"),
                    "HTTP_RESPONSE", 200, "No response body") },
                new[] { new ApiV2Finding(DateTime.UtcNow.ToString("O"),
                    "EXTENSIONES", "CONFIGURACION_LEIDA", "No secrets") },
                new[] { operation });
            if (!File.Exists(result.JsonPath) || !File.Exists(result.TxtPath))
                throw new Exception("TXT/JSON missing");
            var report = File.ReadAllText(result.JsonPath);
            if (!report.Contains("CONFIGURACION_LEIDA") ||
                !report.Contains("HTTP_RESPONSE") ||
                !report.Contains("NO_VERIFICADO"))
                throw new Exception("Report data incomplete");
            if (ProfileArchive.IsSafeProfileId("../evil"))
                throw new Exception("Unsafe folder name accepted");

            var input = Path.Combine(testFolder, "exportacion-propia.json");
            var payload = Encoding.UTF8.GetBytes(
                "{ \"fixture\": \"sensitive-unit-test-only\", \"cookie\": \"synthetic-value\" }");
            File.WriteAllBytes(input, payload);
            var encrypted = SecureArchive.EncryptSelectedFile(
                profileId, input, "test-passphrase-strong-123!");
            if (!File.Exists(encrypted) ||
                File.ReadAllBytes(encrypted).AsSpan().IndexOf(payload) >= 0)
                throw new Exception("Encrypted bytes invalid");
            var wrongOutput = Path.Combine(testFolder, "wrong.json");
            try
            {
                SecureArchive.RestoreToSelectedFile(encrypted, wrongOutput, "wrong passphrase");
                throw new Exception("Wrong key must be rejected");
            }
            catch (CryptographicException) { }
            if (File.Exists(wrongOutput))
                throw new Exception("Wrong-key file written");

            var restored = Path.Combine(testFolder, "restored.json");
            SecureArchive.RestoreToSelectedFile(encrypted, restored,
                "test-passphrase-strong-123!");
            if (!File.ReadAllBytes(restored).SequenceEqual(payload))
                throw new Exception("Round-trip contents changed");
            if (File.ReadAllText(result.JsonPath).Contains("synthetic-value"))
                throw new Exception("Private fixture was mixed into plain reports");
            Console.WriteLine("RC2_ARCHIVE_JSON_TXT_SHA256=PASS");
            Console.WriteLine("RC2_ARCHIVE_AES256_GCM_ROUNDTRIP=PASS");
            Console.WriteLine("RC2_ARCHIVE_WRONG_PASSWORD=REJECTED");
            Console.WriteLine("RC2_ARCHIVE_PLAINTEXT_SEPARATION=PASS");
            return 0;
        }
        finally
        {
            if (Directory.Exists(profilePath))
                Directory.Delete(profilePath, true);
            if (Directory.Exists(testFolder))
                Directory.Delete(testFolder, true);
        }
    }
}
