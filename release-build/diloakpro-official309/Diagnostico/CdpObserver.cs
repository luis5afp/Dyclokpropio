using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace DiloakPRO.Diagnostico;

// Outside the explicitly allowlisted lab route, only event categories and HTTP
// status codes are recorded. Lab JSON bodies may be stored ONLY when a user
// enables password-protected local capture; no URLs or secrets enter plain logs.
internal sealed record CdpDiagnosticEvent(string Utc, string Type, int? HttpStatus, string Detail);

internal sealed class CdpObserver : IDisposable
{
    private CancellationTokenSource? cancellation;
    private Task? worker;
    private LabResponseComparison? labConfig;
    private Action<LabComparisonEvent>? labOutput;
    private Func<LabPendingResponse, byte[], string>? encryptedLabStorage;

    internal bool ConfigureLab(string origin, Action<LabComparisonEvent> report,
        Func<LabPendingResponse, byte[], string>? storeEncrypted = null)
    {
        LabResponseComparison? config;
        if (string.IsNullOrWhiteSpace(origin))
            config = LabResponseComparison.CreateAutomatic();
        else if (!LabResponseComparison.TryCreate(origin, out config))
            return false;
        Volatile.Write(ref labOutput, report);
        Volatile.Write(ref encryptedLabStorage, storeEncrypted);
        Volatile.Write(ref labConfig, config);
        return true;
    }

    internal void StopLab()
    {
        Volatile.Write(ref labConfig, null);
        Volatile.Write(ref labOutput, null);
        Volatile.Write(ref encryptedLabStorage, null);
    }

    private void EmitLab(LabComparisonEvent result)
    {
        if (Volatile.Read(ref labConfig) is null) return;
        var listener = Volatile.Read(ref labOutput);
        try { listener?.Invoke(result); } catch { }
    }

    public bool IsRunning => worker is { IsCompleted: false };

    public void Start(int port, Action<CdpDiagnosticEvent> report)
    {
        if (port < 1024 || port > 65535)
            throw new ArgumentOutOfRangeException(nameof(port), "El puerto debe estar entre 1024 y 65535");
        if (IsRunning)
            throw new InvalidOperationException("CDP ya está conectado");
        cancellation?.Dispose();
        cancellation = new CancellationTokenSource();
        worker = ObserveAsync(port, report, cancellation.Token);
    }

    public void Stop()
    {
        try { cancellation?.Cancel(); }
        catch (ObjectDisposedException) { }
    }

    public void Dispose()
    {
        Stop();
        StopLab();
        // The cancellation token source is disposed at the next Start; the observer
        // task may still be unwinding when the companion window closes.
    }

    private static void Emit(Action<CdpDiagnosticEvent> report, string type, int? status, string detail)
    {
        report(new CdpDiagnosticEvent(DateTime.UtcNow.ToString("O"), type, status, detail));
    }

    private async Task ObserveAsync(int port, Action<CdpDiagnosticEvent> report,
        CancellationToken token)
    {
        try
        {
            using var handler = new HttpClientHandler { UseProxy = false, AllowAutoRedirect = false };
            using var http = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(5) };
            // The port must come from the authorized local API or user input;
            // no port scanning and no remote hosts.
            var discoveryUrl = $"http://127.0.0.1:{port}/json/list";
            using var discovery = await http.GetAsync(discoveryUrl, token);
            if (!discovery.IsSuccessStatusCode)
            {
                Emit(report, "CDP_UNAVAILABLE", (int)discovery.StatusCode,
                    "Endpoint CDP local sin respuesta válida");
                return;
            }

            var jsonText = await discovery.Content.ReadAsStringAsync(token);
            if (jsonText.Length > 262144)
                throw new InvalidDataException("Respuesta de descubrimiento demasiado grande");
            using var targets = JsonDocument.Parse(jsonText);
            if (targets.RootElement.ValueKind != JsonValueKind.Array)
                throw new InvalidDataException("Lista CDP inesperada");

            Uri? selected = null;
            foreach (var item in targets.RootElement.EnumerateArray())
            {
                if (!item.TryGetProperty("type", out var kind) ||
                    kind.GetString() != "page" ||
                    !item.TryGetProperty("webSocketDebuggerUrl", out var endpoint))
                    continue;
                if (!Uri.TryCreate(endpoint.GetString(), UriKind.Absolute, out var uri))
                    continue;
                if (uri.Scheme != "ws" || !uri.IsLoopback || uri.Port != port)
                    continue;
                selected = uri;
                break;
            }

            if (selected is null)
            {
                Emit(report, "CDP_NO_TARGET", null,
                    "No hay pestaña page accesible en el puerto autorizado");
                return;
            }

            using var ws = new ClientWebSocket();
            ws.Options.KeepAliveInterval = TimeSpan.FromSeconds(15);
            await ws.ConnectAsync(selected, token);
            var command = Encoding.UTF8.GetBytes("{\"id\":1,\"method\":\"Network.enable\"}");
            await ws.SendAsync(new ArraySegment<byte>(command), WebSocketMessageType.Text, true, token);
            Emit(report, "CDP_ATTACHED", null,
                "WebSocket conectado al primer target page; esperando Network.enable");

            var requestsForLab = new Dictionary<string, LabPendingResponse>();
            var bodyCommands = new Dictionary<int, LabPendingResponse>();
            var nextBodyCommandId = 100;
            var buffer = new byte[8192];
            while (!token.IsCancellationRequested && ws.State == WebSocketState.Open)
            {
                using var frame = new MemoryStream();
                WebSocketReceiveResult received;
                do
                {
                    received = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), token);
                    if (received.MessageType == WebSocketMessageType.Close)
                        return;
                    if (frame.Length + received.Count > 262144)
                        throw new InvalidDataException("Evento CDP excede el límite permitido");
                    frame.Write(buffer, 0, received.Count);
                }
                while (!received.EndOfMessage);

                if (received.MessageType != WebSocketMessageType.Text)
                    continue;
                using var message = JsonDocument.Parse(frame.ToArray());
                var root = message.RootElement;
                if (root.TryGetProperty("id", out var browserCommandId) &&
                    browserCommandId.ValueKind == JsonValueKind.Number &&
                    browserCommandId.TryGetInt32(out var bodyCommandId) &&
                    bodyCommands.Remove(bodyCommandId, out var expected))
                {
                    if (root.TryGetProperty("result", out var bodyResult) &&
                        bodyResult.ValueKind == JsonValueKind.Object &&
                        bodyResult.TryGetProperty("body", out var bodyValue) &&
                        bodyValue.ValueKind == JsonValueKind.String)
                    {
                        var isBase64 = bodyResult.TryGetProperty("base64Encoded", out var encodedValue) &&
                            encodedValue.ValueKind == JsonValueKind.True;
                        EmitLab(LabResponseComparison.CaptureForManualReview(expected,
                            bodyValue.GetString(), isBase64,
                            Volatile.Read(ref encryptedLabStorage)));
                    }
                    else
                    {
                        EmitLab(LabResponseComparison.Unverified(expected,
                            "Chromium no entregó el cuerpo de prueba solicitado"));
                    }
                    continue;
                }
                if (root.TryGetProperty("id", out var responseId) &&
                    responseId.ValueKind == JsonValueKind.Number &&
                    responseId.TryGetInt32(out var id) && id == 1)
                {
                    if (root.TryGetProperty("error", out _))
                    {
                        Emit(report, "CDP_ENABLE_FAILED", null,
                            "El target rechazó Network.enable");
                        return;
                    }
                    Emit(report, "CDP_NETWORK_ENABLED", null,
                        "Network.enable confirmado; primer target page solamente");
                    continue;
                }
                if (!root.TryGetProperty("method", out var methodValue))
                    continue;
                var method = methodValue.GetString();
                if (Volatile.Read(ref labConfig) is { } comparison &&
                    root.TryGetProperty("params", out var labParams) &&
                    labParams.ValueKind == JsonValueKind.Object)
                {
                    if (method == "Network.responseReceived" &&
                        labParams.TryGetProperty("requestId", out var labRequestId) &&
                        labRequestId.ValueKind == JsonValueKind.String &&
                        labParams.TryGetProperty("response", out var labResponse) &&
                        comparison.TryIdentifyResponse(labResponse, out var pendingResponse) &&
                        pendingResponse is not null &&
                        requestsForLab.Count < 40)
                    {
                        requestsForLab[labRequestId.GetString()!] = pendingResponse;
                    }
                    else if (method == "Network.loadingFinished" &&
                        labParams.TryGetProperty("requestId", out var finishedId) &&
                        finishedId.ValueKind == JsonValueKind.String &&
                        requestsForLab.Remove(finishedId.GetString()!, out var expectedResponse))
                    {
                        // Network.getResponseBody is read-only. It does not
                        // modify, pause, replay or replace any browser traffic.
                        var encodedLengthOk = !labParams.TryGetProperty("encodedDataLength", out var lengthValue) ||
                            (lengthValue.TryGetDouble(out var dataLength) && dataLength <= 131072);
                        if (!encodedLengthOk || bodyCommands.Count >= 40)
                        {
                            EmitLab(LabResponseComparison.Unverified(expectedResponse,
                                "Límite de tamaño o comandos CDP concurrentes"));
                        }
                        else
                        {
                            var cmdId = nextBodyCommandId++;
                            var messageJson = JsonSerializer.Serialize(new
                            {
                                id = cmdId,
                                method = "Network.getResponseBody",
                                @params = new { requestId = finishedId.GetString() }
                            });
                            var cmdBytes = Encoding.UTF8.GetBytes(messageJson);
                            bodyCommands[cmdId] = expectedResponse;
                            await ws.SendAsync(new ArraySegment<byte>(cmdBytes),
                                WebSocketMessageType.Text, true, token);
                        }
                    }
                    else if (method == "Network.loadingFailed" &&
                        labParams.TryGetProperty("requestId", out var failedId) &&
                        failedId.ValueKind == JsonValueKind.String &&
                        requestsForLab.Remove(failedId.GetString()!, out var failedExpected))
                    {
                        EmitLab(LabResponseComparison.Unverified(failedExpected,
                            "Chromium informó que la respuesta no terminó de cargar"));
                    }
                }
                if (method == "Network.requestWillBeSent")
                {
                    Emit(report, "HTTP_REQUEST", null, "Solicitud observada sin URL ni cabeceras");
                }
                else if (method == "Network.responseReceived" &&
                         root.TryGetProperty("params", out var parameters) &&
                         parameters.TryGetProperty("response", out var response) &&
                         response.TryGetProperty("status", out var statusValue) &&
                         statusValue.TryGetDouble(out var statusDouble) &&
                         statusDouble >= 100 && statusDouble <= 599)
                {
                    var status = (int)statusDouble;
                    Emit(report, "HTTP_RESPONSE", status,
                        status >= 500 ? "Respuesta de error del servidor" :
                        status >= 400 ? "Respuesta de error del cliente" :
                        "Respuesta HTTP observada (sin contenido)");
                }
                else if (method == "Network.loadingFailed")
                {
                    Emit(report, "HTTP_FAILED", null, "Error de carga (detalles privados omitidos)");
                }
            }
        }
        catch (OperationCanceledException) when (token.IsCancellationRequested) { }
        catch (Exception ex)
        {
            // Exception class only, never include potentially sensitive exception messages.
            Emit(report, "CDP_ERROR", null, "CDP no disponible: " + ex.GetType().Name);
        }
        finally
        {
            Emit(report, "CDP_STOPPED", null, "Observación CDP finalizada");
        }
    }
}
