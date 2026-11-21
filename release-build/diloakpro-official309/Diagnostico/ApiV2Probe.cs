using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace DiloakPRO.Diagnostico;

// API V2 is read-only and opt-in. Never export the API key, names, identities,
// URL, proxy credentials, cookie values or the provider's raw JSON.
internal sealed record ApiV2Finding(string Utc, string Category, string Status, string Detail);
internal sealed record ApiV2ProbeResult(IReadOnlyList<ApiV2Finding> Findings, int? ProfileDebugPort);

internal static class ApiV2Probe
{
    private static readonly string[] Capabilities =
        { "profiles", "sessions", "cookies", "proxies", "fingerprints", "extensions" };

    private static ApiV2Finding Finding(string category, string status, string detail) =>
        new(DateTime.UtcNow.ToString("O"), category, status, detail);

    public static async Task<ApiV2ProbeResult> CheckAsync(int port, string apiKey,
        string profileId, CancellationToken token = default)
    {
        if (port < 1024 || port > 65535)
            throw new ArgumentOutOfRangeException(nameof(port));
        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.Length > 2048)
            throw new ArgumentException("Clave API no válida", nameof(apiKey));
        if (!Regex.IsMatch(profileId, @"^\d{1,32}$", RegexOptions.CultureInvariant))
            throw new ArgumentException("ID de perfil no válido", nameof(profileId));

        var findings = new List<ApiV2Finding>();
        int? debugPort = null;
        using var handler = new HttpClientHandler { UseProxy = false, AllowAutoRedirect = false };
        using var client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(8) };
        client.DefaultRequestHeaders.TryAddWithoutValidation("X-API-KEY", apiKey);
        var prefix = $"http://127.0.0.1:{port}/openapi/v2";

        async Task<JsonDocument?> Get(string endpoint, string label)
        {
            try
            {
                using var response = await client.GetAsync(prefix + endpoint,
                    HttpCompletionOption.ResponseHeadersRead, token);
                if (!response.IsSuccessStatusCode)
                {
                    findings.Add(Finding(label, "NO_VERIFICADO",
                        "Consulta local HTTP " + (int)response.StatusCode));
                    return null;
                }
                // Do not buffer large private API responses.
                await response.Content.LoadIntoBufferAsync(1024 * 1024);
                using var stream = await response.Content.ReadAsStreamAsync(token);
                var doc = await JsonDocument.ParseAsync(stream,
                    new JsonDocumentOptions { MaxDepth = 20 }, token);
                if (!doc.RootElement.TryGetProperty("code", out var code) ||
                    code.ValueKind != JsonValueKind.Number ||
                    !code.TryGetInt32(out var numericCode) || numericCode != 0 ||
                    !doc.RootElement.TryGetProperty("data", out _))
                {
                    doc.Dispose();
                    findings.Add(Finding(label, "NO_VERIFICADO",
                        "La API local no confirmó éxito (code distinto de 0)"));
                    return null;
                }
                return doc;
            }
            catch (OperationCanceledException) when (token.IsCancellationRequested) { throw; }
            catch (Exception ex)
            {
                // Intentionally do not export exception messages, which could contain a URI or key.
                findings.Add(Finding(label, "NO_VERIFICADO",
                    "Error local: " + ex.GetType().Name));
                return null;
            }
        }

        using (var service = await Get("/status", "API_LOCAL"))
        {
            if (service != null)
                findings.Add(Finding("API_LOCAL", "CONFIRMADA",
                    "La API local respondió con código de negocio 0; no implica login web"));
        }

        using (var caps = await Get("/capabilities", "CAPACIDADES"))
        {
            if (caps is not null && TryObject(caps.RootElement, "data", out var data))
            {
                foreach (var name in Capabilities)
                {
                    var supported = data.TryGetProperty(name, out var v) &&
                        (v.ValueKind == JsonValueKind.True ||
                         v.ValueKind == JsonValueKind.False);
                    findings.Add(Finding("CAPACIDAD_" + name.ToUpperInvariant(),
                        supported && data.GetProperty(name).GetBoolean() ?
                            "DISPONIBLE" : "NO_VERIFICADO",
                        "Capacidad declarada por la API; no demuestra que se haya aplicado"));
                }
            }
        }

        using (var session = await Get($"/profiles/{profileId}/session", "SESION_PERFIL"))
        {
            if (session is not null && TryObject(session.RootElement, "data", out var data))
            {
                var state = data.TryGetProperty("status", out var val) &&
                    val.ValueKind == JsonValueKind.String ? val.GetString() : null;
                findings.Add(Finding("SESION_PERFIL",
                    state == "running" ? "PROCESO_ACTIVO" : "NO_VERIFICADO",
                    state == "running" ?
                        "Perfil en ejecución confirmado por API; no demuestra autenticación" :
                        "La API no confirmó un perfil en ejecución"));
                if (state == "running" &&
                    data.TryGetProperty("debug_port", out var portValue) &&
                    portValue.ValueKind == JsonValueKind.Number &&
                    portValue.TryGetInt32(out var dp) && dp >= 1024 && dp <= 65535)
                {
                    debugPort = dp;
                    findings.Add(Finding("PUERTO_CDP", "DISPONIBLE",
                        "Puerto de depuración recibido por API; conexión aún no comprobada"));
                }
            }
        }

        using (var profile = await Get($"/profiles/{profileId}", "PERFIL"))
        {
            if (profile is not null && TryObject(profile.RootElement, "data", out var data))
            {
                var configured = data.TryGetProperty("proxy_binding", out var proxy) &&
                    proxy.ValueKind == JsonValueKind.Object;
                findings.Add(Finding("PROXY", configured ? "CONFIGURACION_LEIDA" : "NO_VERIFICADO",
                    "No se ha probado la ruta de salida de Chromium ni su IP"));
                bool hasExtensions = data.TryGetProperty("extensions", out _) ||
                    data.TryGetProperty("extension_group_id", out _) ||
                    data.TryGetProperty("extension_settings", out _);
                findings.Add(Finding("EXTENSIONES",
                    hasExtensions ? "CONFIGURACION_LEIDA" : "NO_VERIFICADO",
                    "La configuración no demuestra que la extensión esté cargada"));
            }
        }

        using (var fingerprint = await Get($"/profiles/{profileId}/fingerprint",
            "FINGERPRINT"))
        {
            bool available = fingerprint is not null &&
                TryObject(fingerprint.RootElement, "data", out var data) &&
                data.EnumerateObject().MoveNext();
            findings.Add(Finding("FINGERPRINT",
                available ? "CONFIGURACION_LEIDA" : "NO_VERIFICADO",
                "Sin comparación con valores observados dentro de Chromium"));
        }

        // Never retrieve cookie contents or session tokens through this diagnostic.
        findings.Add(Finding("COOKIES", "NO_VERIFICADO",
            "No se leen valores de cookies; su presencia efectiva exige prueba limitada por origen"));
        findings.Add(Finding("JSON_HTTP_ORIGINAL", "NO_VERIFICADO",
            "Requiere un servidor propio de laboratorio y prueba explícita"));
        findings.Add(Finding("AUTENTICACION", "NO_VERIFICADO",
            "Perfil en ejecución o API autorizada no equivalen a sesión autenticada"));
        return new ApiV2ProbeResult(findings, debugPort);
    }

    private static bool TryObject(JsonElement parent, string property, out JsonElement value)
    {
        value = default;
        return parent.ValueKind == JsonValueKind.Object &&
            parent.TryGetProperty(property, out value) &&
            value.ValueKind == JsonValueKind.Object;
    }
}
