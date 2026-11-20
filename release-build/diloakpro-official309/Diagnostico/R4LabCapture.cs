using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DiloakPRO.Diagnostico;

// Captures the *entity-body* of an explicitly selected endpoint on user's own test server.
// It does NOT intercept DICloak's internal client traffic or Chromium requests.
internal sealed record R4CaptureProof(
    string Boundary, string Origin, int HttpStatus, long Bytes, string ClientSha256,
    string? ServerSha256, bool? BytesMatchServerProof, string Result,
    string EncryptedFile, bool ChromiumReceivedThisResponse);

internal static class R4LabCapture
{
    private const int MaxBody = 8 * 1024 * 1024;
    private const int Pbkdf2Iterations = 220_000;
    private static readonly byte[] Magic = Encoding.ASCII.GetBytes("DPL30901");
    private static readonly byte[] Aad = Encoding.ASCII.GetBytes("diloakpro-r4-authorized-lab-v1");

    internal static Uri ValidateOrigin(string value)
    {
        if (string.IsNullOrWhiteSpace(value) || value.Length > 256)
            throw new ArgumentException("ORIGEN_INVALIDO");
        if (!Uri.TryCreate(value, UriKind.Absolute, out var u) ||
            (u.Scheme != "https" && u.Scheme != "http") ||
            !string.IsNullOrEmpty(u.UserInfo) || !string.IsNullOrEmpty(u.Query) ||
            !string.IsNullOrEmpty(u.Fragment) || u.AbsolutePath != "/" ||
            u.HostNameType == UriHostNameType.Unknown)
            throw new ArgumentException("ORIGEN_INVALIDO");

        bool loopback = u.IsLoopback || u.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase);
        if (u.Scheme == "http" && !loopback)
            throw new ArgumentException("HTTP_SOLO_LOCALHOST");
        string host = u.Host.ToLowerInvariant();
        if (host == "dicloak.com" || host.EndsWith(".dicloak.com") ||
            host == "dicloak.net" || host.EndsWith(".dicloak.net") ||
            host == "ipflygates.com" || host.EndsWith(".ipflygates.com"))
            throw new ArgumentException("ORIGEN_TERCEROS_NO_PERMITIDO");
        return new Uri(u.GetLeftPart(UriPartial.Authority) + "/");
    }

    internal static async Task<R4CaptureProof> CaptureAsync(
        string origin, string relativePath, string passphrase, string storageRoot,
        CancellationToken cancel = default)
    {
        Uri allowed = ValidateOrigin(origin);
        if (string.IsNullOrWhiteSpace(passphrase) || passphrase.Length < 16)
            throw new ArgumentException("FRASE_MINIMA_16_CARACTERES");
        if (string.IsNullOrWhiteSpace(storageRoot) || !Path.IsPathFullyQualified(storageRoot))
            throw new ArgumentException("RUTA_INVALIDA");
        if (string.IsNullOrEmpty(relativePath) || !relativePath.StartsWith('/') ||
            relativePath.StartsWith("//") || relativePath.IndexOfAny(new[] { '?', '#', '\\' }) >= 0 ||
            relativePath.Contains("..", StringComparison.Ordinal))
            throw new ArgumentException("RUTA_RELATIVA_INVALIDA");
        Uri url = new(allowed, relativePath.TrimStart('/'));
        if (url.GetLeftPart(UriPartial.Authority) != allowed.GetLeftPart(UriPartial.Authority))
            throw new ArgumentException("ORIGEN_NO_COINCIDE");

        using var handler = new HttpClientHandler
        {
            AutomaticDecompression = DecompressionMethods.None,
            AllowAutoRedirect = false,
            UseCookies = false,
            UseProxy = false
        };
        using var client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(30) };
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.TryAddWithoutValidation("Accept", "application/json");
        using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancel);
        if ((int)response.StatusCode is >= 300 and < 400)
            throw new IOException("REDIRECCION_RECHAZADA");
        var contentType = response.Content.Headers.ContentType?.MediaType ?? "";
        if (!contentType.Equals("application/json", StringComparison.OrdinalIgnoreCase) &&
            !contentType.EndsWith("+json", StringComparison.OrdinalIgnoreCase))
            throw new IOException("RESPUESTA_NO_JSON");

        await using var stream = await response.Content.ReadAsStreamAsync(cancel);
        using var buffer = new MemoryStream();
        var data = new byte[65536];
        for (;;)
        {
            int n = await stream.ReadAsync(data, cancel);
            if (n == 0) break;
            if (buffer.Length + n > MaxBody) throw new IOException("CUERPO_EXCEDE_8MIB");
            buffer.Write(data, 0, n);
        }
        Array.Clear(data);
        byte[] raw = buffer.ToArray();
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        byte[] nonce = RandomNumberGenerator.GetBytes(12);
        byte[] key = Rfc2898DeriveBytes.Pbkdf2(
            passphrase, salt, Pbkdf2Iterations, HashAlgorithmName.SHA256, 32);
        byte[] encrypted = new byte[raw.Length];
        byte[] tag = new byte[16];
        string digest = Convert.ToHexString(SHA256.HashData(raw)).ToLowerInvariant();
        string? proof = response.Headers.TryGetValues("X-Diloakpro-Body-SHA256", out var values)
            ? values.FirstOrDefault()?.Trim().ToLowerInvariant() : null;
        bool validProof = proof != null && proof.Length == 64 &&
            proof.All(c => (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f'));
        bool? match = validProof ? proof == digest : null;
        string result = match == true ? "sha256_match" :
            match == false ? "sha256_mismatch" :
            proof == null ? "server_proof_missing" : "invalid_server_proof";
        string outFile = "", evidenceFile = "";
        try
        {
            using (var aes = new AesGcm(key, 16))
                aes.Encrypt(nonce, raw, encrypted, tag, Aad);

            var folder = Path.Combine(storageRoot, "LabCaptures");
            Directory.CreateDirectory(folder);
            string id = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss-") +
                Convert.ToHexString(RandomNumberGenerator.GetBytes(8)).ToLowerInvariant();
            outFile = Path.Combine(folder, id + ".dplab");
            evidenceFile = Path.Combine(folder, id + ".proof.json");
            // DPL30901 | 16-byte salt | 12-byte nonce | 16-byte GCM tag | ciphertext
            await using (var file = new FileStream(outFile, FileMode.CreateNew,
                FileAccess.Write, FileShare.None))
            {
                await file.WriteAsync(Magic, cancel);
                await file.WriteAsync(salt, cancel);
                await file.WriteAsync(nonce, cancel);
                await file.WriteAsync(tag, cancel);
                await file.WriteAsync(encrypted, cancel);
            }
            var evidence = new R4CaptureProof(
                "http_entity_body_before_content_encoding_decompression",
                allowed.GetLeftPart(UriPartial.Authority), (int)response.StatusCode,
                raw.LongLength, digest, validProof ? proof : null, match, result,
                Path.GetFileName(outFile), false);
            await File.WriteAllTextAsync(evidenceFile,
                JsonSerializer.Serialize(evidence, new JsonSerializerOptions { WriteIndented = true }),
                cancel);
            return evidence;
        }
        catch
        {
            if (outFile.Length > 0) try { File.Delete(outFile); } catch { }
            if (evidenceFile.Length > 0) try { File.Delete(evidenceFile); } catch { }
            throw;
        }
        finally
        {
            CryptographicOperations.ZeroMemory(raw);
            CryptographicOperations.ZeroMemory(key);
            CryptographicOperations.ZeroMemory(encrypted);
        }
    }
}
