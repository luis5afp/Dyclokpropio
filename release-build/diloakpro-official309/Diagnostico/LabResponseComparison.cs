using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace DiloakPRO.Diagnostico;

// Restricted to the user's own, deliberately instrumented laboratory endpoint.
// Raw JSON stays in RAM only until SHA-256 is calculated.
internal sealed record LabComparisonEvent(
    string Utc, string TestId, string Result, int? HttpStatus,
    string? ServerSha256, string? ClientSha256, string Explanation);

internal sealed record LabPendingResponse(
    string TestId, string ExpectedSha256, int HttpStatus);

internal sealed class LabResponseComparison
{
    private const int MaxBody = 128 * 1024;
    private const string LabPrefix = "/__diloakpro_lab__/";
    private readonly Uri origin;

    private LabResponseComparison(Uri origin) => this.origin = origin;

    public static bool TryCreate(string? value, out LabResponseComparison? config)
    {
        config = null;
        if (string.IsNullOrWhiteSpace(value) || value.Length > 240 ||
            !Uri.TryCreate(value, UriKind.Absolute, out var u) ||
            !string.IsNullOrEmpty(u.UserInfo) || u.AbsolutePath != "/" ||
            !string.IsNullOrEmpty(u.Query) || !string.IsNullOrEmpty(u.Fragment))
            return false;
        if (u.Scheme != Uri.UriSchemeHttps && !(u.Scheme == Uri.UriSchemeHttp && u.IsLoopback))
            return false;
        if (u.Host.Equals("dicloak.com", StringComparison.OrdinalIgnoreCase) ||
            u.Host.EndsWith(".dicloak.com", StringComparison.OrdinalIgnoreCase) ||
            u.Host.Equals("dicloak.net", StringComparison.OrdinalIgnoreCase) ||
            u.Host.EndsWith(".dicloak.net", StringComparison.OrdinalIgnoreCase))
            return false;
        config = new LabResponseComparison(u);
        return true;
    }

    public bool TryIdentifyResponse(JsonElement response, out LabPendingResponse? pending)
    {
        pending = null;
        if (response.ValueKind != JsonValueKind.Object ||
            !response.TryGetProperty("url", out var urlValue) ||
            urlValue.ValueKind != JsonValueKind.String ||
            !Uri.TryCreate(urlValue.GetString(), UriKind.Absolute, out var responseUri) ||
            !string.Equals(responseUri.GetLeftPart(UriPartial.Authority),
                origin.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase) ||
            !responseUri.AbsolutePath.StartsWith(LabPrefix, StringComparison.Ordinal))
            return false;

        // This is a real response from the browser's own network events.
        // Reject cached, service-worker or compressed responses: those bytes
        // need not be identical to the server's uncompressed test JSON.
        if (PropertyTrue(response, "fromDiskCache") ||
            PropertyTrue(response, "fromServiceWorker") ||
            PropertyTrue(response, "fromPrefetchCache"))
            return false;
        if (!response.TryGetProperty("mimeType", out var mime) ||
            mime.ValueKind != JsonValueKind.String ||
            !mime.GetString()!.StartsWith("application/json", StringComparison.OrdinalIgnoreCase))
            return false;
        if (!response.TryGetProperty("status", out var statusVal) ||
            !statusVal.TryGetDouble(out var statusDouble) ||
            statusDouble < 200 || statusDouble > 599 ||
            !response.TryGetProperty("headers", out var headers) ||
            headers.ValueKind != JsonValueKind.Object)
            return false;

        var encoding = Header(headers, "content-encoding");
        if (encoding is not null && !encoding.Equals("identity", StringComparison.OrdinalIgnoreCase))
            return false;
        var id = Header(headers, "x-diloakpro-lab-id");
        var digest = Header(headers, "x-diloakpro-lab-sha256");
        if (id is null || digest is null ||
            !Regex.IsMatch(id, @"\A[a-fA-F0-9]{24}\z") ||
            !Regex.IsMatch(digest, @"\A[a-fA-F0-9]{64}\z"))
            return false;
        pending = new LabPendingResponse(id, digest.ToLowerInvariant(), (int)statusDouble);
        return true;
    }

    public static LabComparisonEvent Verify(LabPendingResponse expected,
        string? browserBody, bool base64Encoded)
    {
        var utc = DateTime.UtcNow.ToString("O");
        if (browserBody is null || browserBody.Length > MaxBody * 2)
            return new(utc, expected.TestId, "NO_VERIFICADO", expected.HttpStatus,
                expected.ExpectedSha256, null, "Cuerpo CDP ausente o demasiado grande");
        byte[] bytes;
        try
        {
            bytes = base64Encoded ?
                Convert.FromBase64String(browserBody) :
                new UTF8Encoding(false, true).GetBytes(browserBody);
        }
        catch (Exception ex) when (ex is FormatException or EncoderFallbackException)
        {
            return new(utc, expected.TestId, "NO_VERIFICADO", expected.HttpStatus,
                expected.ExpectedSha256, null, "Respuesta CDP no decodificable");
        }
        try
        {
            if (bytes.Length > MaxBody)
                return new(utc, expected.TestId, "NO_VERIFICADO", expected.HttpStatus,
                    expected.ExpectedSha256, null, "Respuesta supera límite de laboratorio");
            var actual = Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant();
            var equal = CryptographicOperations.FixedTimeEquals(
                Convert.FromHexString(actual), Convert.FromHexString(expected.ExpectedSha256));
            return new(utc, expected.TestId, equal ? "COINCIDE" : "DIFERENTE",
                expected.HttpStatus, expected.ExpectedSha256, actual,
                equal ? "JSON UTF-8 recibido por Chromium igual al servidor" :
                    "JSON UTF-8 recibido por Chromium diferente al servidor");
        }
        finally
        {
            CryptographicOperations.ZeroMemory(bytes);
        }
    }

    // User-driven workflow: capture both independent SHA-256 values for
    // inspection, without issuing an automatic match/mismatch verdict.
    public static LabComparisonEvent CaptureForManualReview(LabPendingResponse expected,
        string? browserBody, bool base64Encoded)
    {
        var utc = DateTime.UtcNow.ToString("O");
        if (browserBody is null || browserBody.Length > MaxBody * 2)
            return new(utc, expected.TestId, "NO_VERIFICADO", expected.HttpStatus,
                expected.ExpectedSha256, null, "Cuerpo CDP ausente o demasiado grande");
        byte[] bytes;
        try
        {
            bytes = base64Encoded ?
                Convert.FromBase64String(browserBody) :
                new UTF8Encoding(false, true).GetBytes(browserBody);
        }
        catch (Exception ex) when (ex is FormatException or EncoderFallbackException)
        {
            return new(utc, expected.TestId, "NO_VERIFICADO", expected.HttpStatus,
                expected.ExpectedSha256, null, "Respuesta CDP no decodificable");
        }
        try
        {
            if (bytes.Length > MaxBody)
                return new(utc, expected.TestId, "NO_VERIFICADO", expected.HttpStatus,
                    expected.ExpectedSha256, null, "Respuesta supera limite de laboratorio");
            var actual = Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant();
            return new(utc, expected.TestId, "CAPTURADO", expected.HttpStatus,
                expected.ExpectedSha256, actual,
                "SHA servidor/cabecera y SHA Chromium disponibles para revision manual");
        }
        finally
        {
            CryptographicOperations.ZeroMemory(bytes);
        }
    }

    public static LabComparisonEvent Unverified(LabPendingResponse expected, string explanation) =>
        new(DateTime.UtcNow.ToString("O"), expected.TestId, "NO_VERIFICADO",
            expected.HttpStatus, expected.ExpectedSha256, null, explanation);

    private static bool PropertyTrue(JsonElement data, string name) =>
        data.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.True;

    private static string? Header(JsonElement headers, string name)
    {
        foreach (var entry in headers.EnumerateObject())
            if (string.Equals(entry.Name, name, StringComparison.OrdinalIgnoreCase) &&
                entry.Value.ValueKind == JsonValueKind.String)
                return entry.Value.GetString();
        return null;
    }
}
