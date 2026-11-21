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
    string TestId, string ResponseSha256, int StatusCode, long ResponseBytes, bool HeaderIssued);
internal sealed record LabProofAudit(
    string Utc, string TestId, string Result, string ServerSha256,
    string? ChromiumSha256, string Explanation);

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
            code, length, wasIssued.GetBoolean());
    }

    internal static LabProofAudit Compare(LabServerProof server,
        IEnumerable<LabComparisonEvent> observed)
    {
        var utc = DateTime.UtcNow.ToString("O");
        var client = observed.LastOrDefault(x => x.TestId == server.TestId);
        if (!server.HeaderIssued)
            return new(utc, server.TestId, "NO_VERIFICADO", server.ResponseSha256,
                client?.ClientSha256, "Servidor no adjuntó SHA-256 al mensaje");
        if (client is null || client.ClientSha256 is null)
            return new(utc, server.TestId, "NO_VERIFICADO", server.ResponseSha256,
                null, "No hay cuerpo observado en Chromium para esta transacción");
        var matches = string.Equals(server.ResponseSha256,
            client.ServerSha256, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(server.ResponseSha256,
                client.ClientSha256, StringComparison.OrdinalIgnoreCase) &&
            server.StatusCode == client.HttpStatus;
        return new(utc, server.TestId, matches ? "COINCIDE" : "DIFERENTE",
            server.ResponseSha256, client.ClientSha256,
            matches ? "Servidor y Chromium: mismo ID, HTTP y SHA-256 JSON" :
                "Servidor, cabecera y/o Chromium discrepan; investigar caché o transformación");
    }

    private static string GetString(JsonElement obj, string property) =>
        obj.TryGetProperty(property, out var v) && v.ValueKind == JsonValueKind.String ?
            v.GetString() ?? "" : "";
}
