using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DiloakPRO.Diagnostico;

// Explicit consent and a valid X-API-KEY are mandatory.
// Discover only the vendor-documented default local port 52100, or the
// manually supplied port; never scan ports, read app secrets or change profiles.
internal sealed record AutoProfileDiscovery(
    int? ApiPort, string Status, IReadOnlyList<string> RunningProfileIds);

internal static class AutoDiagnosticDiscovery
{
    private const int DocumentedLocalPort = 52100;
    private const int MaxBodyBytes = 512 * 1024;

    internal static async Task<AutoProfileDiscovery> DiscoverAsync(
        string apiKey, int? chosenPort, CancellationToken token = default)
    {
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.Length > 2048)
            return new(null, "CLAVE_API_REQUERIDA", Array.Empty<string>());
        if (chosenPort.HasValue && (chosenPort < 1024 || chosenPort > 65535))
            return new(null, "PUERTO_API_INVALIDO", Array.Empty<string>());

        var port = chosenPort ?? DocumentedLocalPort;
        using var handler = new HttpClientHandler
        {
            UseProxy = false, AllowAutoRedirect = false
        };
        using var client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(6) };
        client.DefaultRequestHeaders.TryAddWithoutValidation("X-API-KEY", apiKey);

        async Task<JsonDocument?> GetAsync(string relative)
        {
            try
            {
                using var response = await client.GetAsync(
                    $"http://127.0.0.1:{port}/openapi/v2{relative}",
                    HttpCompletionOption.ResponseHeadersRead, token);
                if (!response.IsSuccessStatusCode)
                    return null;
                await response.Content.LoadIntoBufferAsync(MaxBodyBytes);
                using var stream = await response.Content.ReadAsStreamAsync(token);
                var parsed = await JsonDocument.ParseAsync(stream,
                    new JsonDocumentOptions { MaxDepth = 20 }, token);
                if (!parsed.RootElement.TryGetProperty("code", out var code) ||
                    code.ValueKind != JsonValueKind.Number ||
                    !code.TryGetInt32(out var codeNumber) || codeNumber != 0 ||
                    !parsed.RootElement.TryGetProperty("data", out _))
                {
                    parsed.Dispose();
                    return null;
                }
                return parsed;
            }
            catch (OperationCanceledException) when (token.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception)
            {
                // Do not include potentially sensitive URI/header/exception message.
                return null;
            }
        }

        using var status = await GetAsync("/status");
        if (status is null)
            return new(null, chosenPort.HasValue ?
                "API_NO_CONFIRMADA_EN_PUERTO_INDICADO" :
                "API_NO_CONFIRMADA_EN_PUERTO_HABITUAL_52100",
                Array.Empty<string>());

        if (!TryObject(status.RootElement, "data", out var serviceData) ||
            !serviceData.TryGetProperty("service", out var serviceName) ||
            serviceName.ValueKind != JsonValueKind.String ||
            serviceName.GetString() != "dicloak-local-api")
            return new(null, "SERVICIO_NO_IDENTIFICADO", Array.Empty<string>());

        using var profiles = await GetAsync("/profiles?run_status=running&page=1&page_size=50");
        if (profiles is null)
            return new(port, "API_OK_PERFILES_NO_DISPONIBLES", Array.Empty<string>());
        if (!TryObject(profiles.RootElement, "data", out var data) ||
            !data.TryGetProperty("list", out var list) ||
            list.ValueKind != JsonValueKind.Array)
            return new(port, "API_OK_LISTA_INESPERADA", Array.Empty<string>());

        var ids = new List<string>();
        foreach (var item in list.EnumerateArray())
        {
            if (item.ValueKind != JsonValueKind.Object ||
                !item.TryGetProperty("id", out var field) ||
                field.ValueKind != JsonValueKind.String)
                continue;
            var id = field.GetString();
            if (id is not { Length: > 0 and <= 32 } ||
                !id.All(c => c >= '0' && c <= '9'))
                continue;
            // Do not trust a response that returns explicitly stopped profiles.
            if (item.TryGetProperty("run_status", out var state) &&
                state.ValueKind == JsonValueKind.String &&
                state.GetString() != "running")
                continue;
            ids.Add(id);
        }

        var distinct = ids.Distinct(StringComparer.Ordinal).ToArray();
        return new(port,
            distinct.Length switch
            {
                0 => "SIN_PERFILES_ABIERTOS",
                1 => "UN_PERFIL_ABIERTO",
                _ => "VARIOS_PERFILES_ABIERTOS"
            }, distinct);
    }

    private static bool TryObject(JsonElement element, string property,
        out JsonElement value)
    {
        value = default;
        return element.ValueKind == JsonValueKind.Object &&
            element.TryGetProperty(property, out value) &&
            value.ValueKind == JsonValueKind.Object;
    }
}
