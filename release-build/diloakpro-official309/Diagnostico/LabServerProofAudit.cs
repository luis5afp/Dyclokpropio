using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace DiloakPRO.Diagnostico;

// Imports a sanitized .proof.json exported from our own instrumented server.
// The proof file contains hashes/IDs only, never response bodies or cookies.
internal sealed record LabServerProof(
    string TestId, string ResponseSha256, int StatusCode, long ResponseBytes,
    bool HeaderIssued, string FieldSummary = "SIN_AUDITORIA");
internal sealed record LabProofAudit(
    string Utc, string TestId, string Result, string ServerSha256,
    string? ChromiumSha256, string Explanation, string FieldSummary = "SIN_AUDITORIA");

internal static class LabServerProofAudit
{
    internal static LabServerProof Read(string file)
    {
        if (!file.EndsWith(".proof.json", StringComparison.OrdinalIgnoreCase))
            throw new InvalidDataException("Solo archivos .proof.json");
        var info = new FileInfo(file);
        if (!info.Exists || info.Length < 30 || info.Length > 24 * 1024)
            throw new InvalidDataException("Prueba ausente o de tamaño inesperado");
        using var stream = File.OpenRead(file);
        using var doc = JsonDocument.Parse(stream,
            new JsonDocumentOptions { MaxDepth = 8 });
        var obj = doc.RootElement;
        if (obj.ValueKind != JsonValueKind.Object ||
            !GetString(obj, "source").Equals("own-test-server", StringComparison.Ordinal) ||
            !GetString(obj, "transactionId").Equals(GetString(obj, "transactionId").ToLowerInvariant(), StringComparison.Ordinal) ||
            !Regex.IsMatch(GetString(obj, "transactionId"), @"\A[a-f0-9]{24}\z") ||
            !Regex.IsMatch(GetString(obj, "responseSha256"), @"\A[a-f0-9]{64}\z") ||
            !obj.TryGetProperty("statusCode", out var status) ||
            !status.TryGetInt32(out var code) || code < 100 || code > 599 ||
            !obj.TryGetProperty("responseBytes", out var size) ||
            !size.TryGetInt64(out var length) || length < 0 || length > 1024 * 1024 ||
            !obj.TryGetProperty("responseProofHeaderIssued", out var wasIssued) ||
            wasIssued.ValueKind is not (JsonValueKind.True or JsonValueKind.False))
            throw new InvalidDataException("Prueba de servidor no reconocida");
        return new(GetString(obj, "transactionId"), GetString(obj, "responseSha256"),
            code, length, wasIssued.GetBoolean(), DescribeSafeFieldCounts(obj));
    }

    internal static LabProofAudit Compare(LabServerProof server,
        IEnumerable<LabComparisonEvent> observed)
    {
        var utc = DateTime.UtcNow.ToString("O");
        var client = observed.LastOrDefault(x => x.TestId == server.TestId);
        if (!server.HeaderIssued)
            return new(utc, server.TestId, "NO_VERIFICADO", server.ResponseSha256,
                client?.ClientSha256, "Servidor no adjuntó SHA-256 al mensaje",
                server.FieldSummary);
        if (client is null || client.ClientSha256 is null)
            return new(utc, server.TestId, "NO_VERIFICADO", server.ResponseSha256,
                null, "No hay cuerpo observado en Chromium para esta transacción",
                server.FieldSummary);
        var matches = string.Equals(server.ResponseSha256,
            client.ServerSha256, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(server.ResponseSha256,
                client.ClientSha256, StringComparison.OrdinalIgnoreCase) &&
            server.StatusCode == client.HttpStatus;
        return new(utc, server.TestId, matches ? "COINCIDE" : "DIFERENTE",
            server.ResponseSha256, client.ClientSha256,
            matches ? "Servidor y Chromium: mismo ID, HTTP y SHA-256 JSON" :
                "Servidor, cabecera y/o Chromium discrepan; investigar caché o transformación",
            server.FieldSummary);
    }

    // Allowlisted labels only. We never copy raw property names/values,
    // cookies, usernames or passwords from a downloaded proof file.
    private static string DescribeSafeFieldCounts(JsonElement proof)
    {
        if (!proof.TryGetProperty("audit", out var audit) ||
            audit.ValueKind != JsonValueKind.Object)
            return "SIN_AUDITORIA";
        var sections = new List<string>();
        string[] categories = { "email", "password", "proxy", "extension",
            "fingerprint", "cookie", "session" };
        foreach (var (field, caption) in new[]
        {
            ("requestJson", "CLIENTE_ENVIA"),
            ("responseJson", "SERVIDOR_ENVIA")
        })
        {
            if (!audit.TryGetProperty(field, out var block) ||
                block.ValueKind != JsonValueKind.Object ||
                !block.TryGetProperty("categories", out var counts) ||
                counts.ValueKind != JsonValueKind.Object) continue;
            foreach (var category in categories)
            {
                if (!counts.TryGetProperty(category, out var val) ||
                    val.ValueKind != JsonValueKind.Number ||
                    !val.TryGetInt32(out var count) || count <= 0 || count > 2500)
                    continue;
                sections.Add(caption + "_" + category.ToUpperInvariant() +
                    "=" + count);
            }
        }
        if (audit.TryGetProperty("setCookieHeaderCount", out var setCookie) &&
            setCookie.ValueKind == JsonValueKind.Number &&
            setCookie.TryGetInt32(out var amount) && amount >= 0 && amount <= 50)
            sections.Add("SERVIDOR_SET_COOKIE=" + amount);
        if (audit.TryGetProperty("requestCookieHeaderPresent", out var reqCookie) &&
            reqCookie.ValueKind is JsonValueKind.True or JsonValueKind.False)
            sections.Add("CLIENTE_COOKIE_PRESENTE=" +
                (reqCookie.GetBoolean() ? "SI" : "NO"));
        return sections.Count > 0 ? string.Join("; ", sections) : "SIN_AUDITORIA";
    }

    private static string GetString(JsonElement obj, string property) =>
        obj.TryGetProperty(property, out var v) && v.ValueKind == JsonValueKind.String ?
            v.GetString() ?? "" : "";
}
