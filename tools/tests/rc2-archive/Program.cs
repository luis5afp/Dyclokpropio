using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

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
            var testJson = "{\"ok\":true,\"id\":7}";
            var labSha = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(testJson))).ToLowerInvariant();
            if (!LabResponseComparison.TryCreate("http://127.0.0.1:3000", out var lab) ||
                lab is null)
                throw new Exception("Expected local lab origin");
            if (LabResponseComparison.TryCreate("https://gin-server.dicloak.net", out _))
                throw new Exception("Vendor origin must not be allowed");
            using var cdpEnvelope = JsonDocument.Parse(JsonSerializer.Serialize(new
            {
                url = "http://127.0.0.1:3000/__diloakpro_lab__/echo?tracking=ignored",
                mimeType = "application/json",
                status = 200,
                headers = new Dictionary<string, string>
                {
                    ["X-Diloakpro-Lab-Id"] = "aabbccddeeff001122334455",
                    ["X-Diloakpro-Lab-SHA256"] = labSha
                }
            }));
            if (!lab.TryIdentifyResponse(cdpEnvelope.RootElement, out var expected) ||
                expected is null)
                throw new Exception("Lab test response not recognized");
            var matches = LabResponseComparison.Verify(expected, testJson, false);
            if (matches.Result != "COINCIDE")
                throw new Exception("Matching JSON bytes were not recognized");
            var altered = LabResponseComparison.Verify(expected, "{\"ok\":false}", false);
            if (altered.Result != "DIFERENTE")
                throw new Exception("Changed JSON bytes not detected");
            if (LabResponseComparison.Verify(expected, Convert.ToBase64String(
                Encoding.UTF8.GetBytes(testJson)), true).Result != "COINCIDE")
                throw new Exception("CDP base64 response not recognized");
            using var wrongOrigin = JsonDocument.Parse(JsonSerializer.Serialize(new
            {
                url = "https://other.example.invalid/__diloakpro_lab__/echo",
                mimeType = "application/json", status = 200,
                headers = new Dictionary<string, string>
                {
                    ["X-Diloakpro-Lab-Id"] = "aabbccddeeff001122334455",
                    ["X-Diloakpro-Lab-SHA256"] = labSha
                }
            }));
            if (lab.TryIdentifyResponse(wrongOrigin.RootElement, out _))
                throw new Exception("Other origins must be ignored");
            var proofPath = Path.Combine(testFolder, "sample.proof.json");
            File.WriteAllText(proofPath, JsonSerializer.Serialize(new
            {
                source = "own-test-server",
                transactionId = "aabbccddeeff001122334455",
                responseSha256 = labSha,
                responseBytes = Encoding.UTF8.GetByteCount(testJson),
                responseProofHeaderIssued = true,
                statusCode = 200
            }));
            var independentProof = LabServerProofAudit.Read(proofPath);
            var tripleMatched = LabServerProofAudit.Compare(independentProof,
                new[] { matches });
            if (tripleMatched.Result != "COINCIDE")
                throw new Exception("Independent server proof not matched");
            var tripleMismatch = LabServerProofAudit.Compare(independentProof,
                new[] { altered });
            if (tripleMismatch.Result != "DIFERENTE")
                throw new Exception("Independent server mismatch not detected");
            var missingBrowser = LabServerProofAudit.Compare(independentProof,
                Array.Empty<LabComparisonEvent>());
            if (missingBrowser.Result != "NO_VERIFICADO")
                throw new Exception("Missing Chromium evidence must remain unverified");
            var operation = new ArchiveOperation(DateTime.UtcNow.ToString("O"),
                "COMPROBAR_PERFIL", "OK");
            var result = ProfileArchive.SaveReport(profileId,
                new[] { new Snapshot(DateTime.UtcNow.ToString("O"), 5, 15, 10, 28,
                    "Windows metadata", "HTTP body not captured") },
                new[] { new CdpDiagnosticEvent(DateTime.UtcNow.ToString("O"),
                    "HTTP_RESPONSE", 200, "No response body") },
                new[] { new ApiV2Finding(DateTime.UtcNow.ToString("O"),
                    "EXTENSIONES", "CONFIGURACION_LEIDA", "No secrets") },
                new[] { operation }, new[] { matches, altered }, new[] { tripleMatched });
            if (!File.Exists(result.JsonPath) || !File.Exists(result.TxtPath))
                throw new Exception("TXT/JSON missing");
            var report = File.ReadAllText(result.JsonPath);
            if (!report.Contains("CONFIGURACION_LEIDA") ||
                !report.Contains("HTTP_RESPONSE") ||
                !report.Contains("NO_VERIFICADO") ||
                !report.Contains("COINCIDE") ||
                !report.Contains("DIFERENTE"))
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
            Console.WriteLine("RC2_LAB_BROWSER_SHA256_MATCH_AND_MISMATCH=PASS");
            Console.WriteLine("RC2_LAB_INDEPENDENT_SERVER_PROOF=PASS");
            Console.WriteLine("RC2_LAB_ORIGIN_FILTER=PASS");
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
