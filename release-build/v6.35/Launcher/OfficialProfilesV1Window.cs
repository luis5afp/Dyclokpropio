using System;
using System.Collections.Generic;
using System.Drawing;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DyclokPRO;

/// <summary>
/// Independent, read-only view using the officially documented Local API V1.
/// DICloak.exe handles login, tokens, sessions and remote HTTP requests.
/// This window never reads Electron userData or cookies or performs logout.
/// </summary>
internal sealed class OfficialProfilesV1Window : Form
{
    private readonly TextBox port = new() { Text = "52100", Width = 82 };
    private readonly TextBox key = new() { Width = 275, UseSystemPasswordChar = true };
    private readonly DataGridView list = new();
    private readonly Label status = new();
    private readonly Button fetch = new() { Text = "Consultar perfiles", Width = 155, Height = 34 };
    private bool busy;

    internal OfficialProfilesV1Window(string accountName)
    {
        Text = "DyclokPRO - perfiles oficiales 3.0.7 - " + accountName;
        Width = 900;
        Height = 600;
        MinimumSize = new Size(700, 440);
        StartPosition = FormStartPosition.CenterParent;
        BackColor = Color.FromArgb(21, 34, 42);
        ForeColor = Color.White;
        Font = new Font("Segoe UI", 10);

        var top = new FlowLayoutPanel {
            Dock = DockStyle.Top, Height = 52, WrapContents = false,
            Padding = new Padding(10, 8, 10, 5)
        };
        top.Controls.Add(new Label { Text = "Puerto API:", AutoSize = true, Padding = new Padding(0, 7, 0, 0) });
        top.Controls.Add(port);
        top.Controls.Add(new Label { Text = "X-API-KEY:", AutoSize = true, Padding = new Padding(6, 7, 0, 0) });
        top.Controls.Add(key);
        top.Controls.Add(fetch);

        list.Dock = DockStyle.Fill;
        list.ReadOnly = true;
        list.RowHeadersVisible = false;
        list.AllowUserToAddRows = false;
        list.AllowUserToDeleteRows = false;
        list.MultiSelect = false;
        list.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
        list.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
        foreach (var name in new[] { "Perfil", "ID", "Estado", "Abierto", "Número" })
            list.Columns.Add(name, name);

        status.Dock = DockStyle.Bottom;
        status.Height = 70;
        status.Padding = new Padding(12);
        status.ForeColor = Color.Khaki;
        status.Text = "Abre el DICloak oficial, inicia sesión y habilita la API local. " +
                      "Esta ventana consulta perfiles de solo lectura. No guarda claves.";
        Controls.Add(list);
        Controls.Add(status);
        Controls.Add(top);
        fetch.Click += async (_, _) => await Reload();
        FormClosed += (_, _) => { key.Text = string.Empty; };
    }

    private static string Field(JsonElement item, string property)
    {
        if (!item.TryGetProperty(property, out var value)) return "";
        return value.ValueKind == JsonValueKind.String ? value.GetString() ?? ""
             : value.ValueKind == JsonValueKind.Number ? value.ToString()
             : "";
    }

    private async Task Reload()
    {
        if (busy) return;
        busy = true;
        fetch.Enabled = false;
        try
        {
            if (!int.TryParse(port.Text, out int p) || p < 1024 || p > 65535)
                throw new InvalidOperationException("Puerto local inválido.");
            if (string.IsNullOrWhiteSpace(key.Text) || key.Text.Length > 512)
                throw new InvalidOperationException("Introduce una clave API local autorizada.");

            var handler = new HttpClientHandler {
                UseCookies = false, UseProxy = false, AllowAutoRedirect = false
            };
            using var client = new HttpClient(handler) {
                BaseAddress = new Uri("http://127.0.0.1:" + p),
                Timeout = TimeSpan.FromSeconds(12)
            };
            client.DefaultRequestHeaders.Add("X-API-KEY", key.Text);
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            var records = new List<string[]>();
            for (int page = 1; page <= 15; page++)
            {
                using var response = await client.GetAsync(
                    "/openapi/v1/env/list?page_no=" + page + "&page_size=100",
                    HttpCompletionOption.ResponseHeadersRead);
                if (!response.IsSuccessStatusCode)
                    throw new InvalidOperationException(
                        "La API local respondió HTTP " + (int)response.StatusCode +
                        ". Verifica la sesión, la API y sus permisos.");

                if (response.Content.Headers.ContentLength > 2_000_000)
                    throw new InvalidOperationException("Respuesta demasiado grande.");
                var bytes = await response.Content.ReadAsByteArrayAsync();
                if (bytes.Length > 2_000_000)
                    throw new InvalidOperationException("Respuesta demasiado grande.");

                using var json = JsonDocument.Parse(bytes);
                var root = json.RootElement;
                if (root.ValueKind != JsonValueKind.Object ||
                    !root.TryGetProperty("code", out var code) ||
                    !code.TryGetInt32(out var apiCode))
                    throw new InvalidOperationException("Respuesta de API inválida.");
                if (apiCode != 0)
                    throw new InvalidOperationException(
                        "La API rechazó la consulta (código " + apiCode +
                        "). No se ha modificado la sesión.");

                if (!root.TryGetProperty("data", out var data) ||
                    data.ValueKind != JsonValueKind.Object ||
                    !data.TryGetProperty("list", out var items) ||
                    items.ValueKind != JsonValueKind.Array)
                    throw new InvalidOperationException("Lista de perfiles no disponible.");

                int count = 0;
                foreach (var item in items.EnumerateArray())
                {
                    if (item.ValueKind != JsonValueKind.Object) continue;
                    var id = Field(item, "id");
                    if (string.IsNullOrWhiteSpace(id)) continue;
                    records.Add(new[] {
                        Field(item, "name"), id, Field(item, "status"),
                        Field(item, "operate_status"), Field(item, "serial_num")
                    });
                    count++;
                }
                if (count < 100) break;
            }
            list.Rows.Clear();
            foreach (var row in records) list.Rows.Add(row);
            status.Text = "API local V1 autorizada: " + records.Count +
                          " perfiles consultados. No se han leído cookies ni tokens.";
        }
        catch (Exception ex) when (ex is HttpRequestException ||
                                   ex is TaskCanceledException ||
                                   ex is InvalidOperationException ||
                                   ex is JsonException)
        {
            // Only sanitized exceptions constructed above / .NET network categories.
            status.Text = ex is HttpRequestException || ex is TaskCanceledException
                ? "No se pudo conectar con la API local. Comprueba que el servicio esté habilitado."
                : ex.Message;
        }
        finally
        {
            fetch.Enabled = true;
            busy = false;
        }
    }
}
