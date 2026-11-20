using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DiloakPRO.Diagnostico;

// Read-only audit, attached exclusively to a user-specified local CDP port
// and an already-open page at the exact user's LAB origin. Never enables CDP
// on another browser, exports cookies, or controls navigation.
internal sealed record R4ChromiumAuditResult(
    string Result, bool BrowserEndpointReached, bool AuthorizedPageFound,
    bool FingerprintStateObserved, string? UserAgent, string? Language,
    string? Timezone, int? ScreenWidth, int? ScreenHeight,
    int? HardwareConcurrency, int? JavaScriptVisibleCookieCount,
    int ExtensionBackgroundTargetsObserved,
    bool HttpOnlyCookiesVerified, bool ProxyAppliedVerified,
    bool ExtensionsAppliedVerified, bool FingerprintMatchesExpected,
    bool ChromiumProfileIdentityVerified,
    string EvidenceBoundary);

internal static class R4ChromiumAudit
{
    internal static async Task<R4ChromiumAuditResult> RunAsync(
        int port, string authorizedOrigin, CancellationToken cancel = default)
    {
        if (port is < 1024 or > 65535)
            throw new ArgumentException("PUERTO_CDP_INVALIDO");
        Uri expected = R4LabCapture.ValidateOrigin(authorizedOrigin);
        string baseUri = "http://127.0.0.1:" + port;
        using var client = new HttpClient(new HttpClientHandler
        {
            AllowAutoRedirect = false, UseCookies = false, UseProxy = false
        }) { Timeout = TimeSpan.FromSeconds(5) };
        static R4ChromiumAuditResult result(string status, bool browser,
            bool page, int extensions = 0) => new(status, browser, page,
                false, null, null, null, null, null, null, null, extensions,
                false, false, false, false, false,
                "cdp_local_read_only_unmapped_profile");
        try
        {
            using var resp = await client.GetAsync(baseUri + "/json/list", cancel);
            if (!resp.IsSuccessStatusCode) return result("cdp_unavailable", false, false);
            using var targets = JsonDocument.Parse(await resp.Content.ReadAsStringAsync(cancel));
            if (targets.RootElement.ValueKind != JsonValueKind.Array)
                return result("cdp_invalid_targets", false, false);
            string? ws = null;
            var distinctExtensionTargets = new HashSet<string>(StringComparer.Ordinal);
            foreach (var item in targets.RootElement.EnumerateArray())
            {
                if (!item.TryGetProperty("type", out var type) ||
                    !item.TryGetProperty("url", out var url)) continue;
                string kind = type.GetString() ?? "", address = url.GetString() ?? "";
                if ((kind == "background_page" || kind == "service_worker") &&
                    address.StartsWith("chrome-extension://", StringComparison.Ordinal) &&
                    Uri.TryCreate(address, UriKind.Absolute, out var extension))
                    distinctExtensionTargets.Add(extension.Host);

                if (kind != "page" || !Uri.TryCreate(address, UriKind.Absolute, out var pageUrl) ||
                    pageUrl.GetLeftPart(UriPartial.Authority) !=
                        expected.GetLeftPart(UriPartial.Authority))
                    continue;
                if (item.TryGetProperty("webSocketDebuggerUrl", out var socket))
                    ws = socket.GetString();
            }
            int count = distinctExtensionTargets.Count;
            if (ws == null) return result("no_lab_page_or_no_page_socket", true, false, count);
            if (!Uri.TryCreate(ws, UriKind.Absolute, out var socketUri) ||
                socketUri.Scheme != "ws" ||
                !(socketUri.Host == "127.0.0.1" || socketUri.Host == "localhost") ||
                socketUri.Port != port)
                return result("cdp_socket_not_loopback", true, false, count);

            using var socketClient = new ClientWebSocket();
            using var limit = CancellationTokenSource.CreateLinkedTokenSource(cancel);
            limit.CancelAfter(TimeSpan.FromSeconds(7));
            await socketClient.ConnectAsync(socketUri, limit.Token);
            const string expression = @"(() => ({
                userAgent: String(navigator.userAgent).slice(0,400),
                language: String(navigator.language).slice(0,80),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                screenWidth: screen.width,
                screenHeight: screen.height,
                hardwareConcurrency: navigator.hardwareConcurrency || null,
                jsCookieCount: document.cookie ? document.cookie.split(';').filter(Boolean).length : 0
            }))()";
            byte[] request = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new
            {
                id = 301, method = "Runtime.evaluate",
                @params = new { expression, returnByValue = true, awaitPromise = false }
            }));
            await socketClient.SendAsync(request, WebSocketMessageType.Text, true, limit.Token);
            byte[] receive = new byte[65536];
            using var buffer = new System.IO.MemoryStream();
            while (buffer.Length < 65536)
            {
                var message = await socketClient.ReceiveAsync(receive, limit.Token);
                if (message.MessageType != WebSocketMessageType.Text)
                    return result("cdp_unexpected_message", true, true, count);
                buffer.Write(receive, 0, message.Count);
                if (!message.EndOfMessage) continue;
                using var doc = JsonDocument.Parse(buffer.ToArray());
                buffer.SetLength(0);
                if (!doc.RootElement.TryGetProperty("id", out var id) ||
                    id.GetInt32() != 301) continue;
                if (!doc.RootElement.TryGetProperty("result", out var response) ||
                    !response.TryGetProperty("result", out var value) ||
                    !value.TryGetProperty("value", out var fields))
                    return result("cdp_eval_failed", true, true, count);

                string? str(string name) =>
                    fields.TryGetProperty(name, out var el) && el.ValueKind == JsonValueKind.String ?
                        el.GetString() : null;
                int? num(string name) =>
                    fields.TryGetProperty(name, out var el) && el.TryGetInt32(out int n) ? n : null;
                return new R4ChromiumAuditResult("observed_in_authorized_page",
                    true, true, true, str("userAgent"), str("language"),
                    str("timezone"), num("screenWidth"), num("screenHeight"),
                    num("hardwareConcurrency"), num("jsCookieCount"), count,
                    false, false, false, false, false,
                    "cdp_runtime_evaluate_in_existing_lab_page");
            }
            return result("cdp_message_too_large", true, true, count);
        }
        catch (OperationCanceledException) when (!cancel.IsCancellationRequested)
        {
            return result("cdp_timeout", false, false);
        }
        catch (Exception)
        {
            return result("cdp_unavailable_or_invalid", false, false);
        }
    }
}
