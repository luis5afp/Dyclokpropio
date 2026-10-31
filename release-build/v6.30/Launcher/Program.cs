using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace DyclokPRO;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new ManagerWindow());
    }
}

internal sealed class AccountItem
{
    public string Id { get; init; } = "";
    public string Name { get; init; } = "";
    public override string ToString() => Name + (Id == "legacy" ? "  · Principal" : "  · " + Id[..6]);
}

internal sealed class ManagerWindow : Form
{
    private static readonly Regex ValidId = new(@"^[a-f0-9]{32}$", RegexOptions.CultureInvariant);
    private static readonly string Root =
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                     "DyclokPRO", "Cuentas");
    private static readonly string OfficialExe = Path.Combine(AppContext.BaseDirectory, "DICloak.exe");

    private readonly ListBox accountList = new();
    private readonly Label footer = new();
    private readonly Button openButton = MakeButton("Abrir cuenta seleccionada");
    private readonly Button officialButton = MakeButton("Abrir DICloak oficial");
    private readonly Button addButton = MakeButton("+ Nueva cuenta");
    private readonly Button renameButton = MakeButton("Cambiar nombre");
    private readonly Button archiveButton = MakeButton("Archivos automáticos");
    private readonly Button folderButton = MakeButton("Carpeta de la cuenta");

    private static Button MakeButton(string text) =>
        new() { Text = text, Height = 38, Dock = DockStyle.Top, Margin = new Padding(0, 0, 0, 9) };

    public ManagerWindow()
    {
        Text = "DyclokPRO v6.30 · Gestor externo — DICloak 3.0.7";
        Width = 740;
        Height = 570;
        MinimumSize = new Size(680, 480);
        StartPosition = FormStartPosition.CenterScreen;
        Font = new Font("Segoe UI", 10);
        BackColor = Color.FromArgb(19, 30, 38);
        ForeColor = Color.White;

        var head = new Label
        {
            Text = "DyclokPRO 6.30  |  Motor oficial DICloak 3.0.7",
            Font = new Font("Segoe UI", 16, FontStyle.Bold),
            ForeColor = Color.White,
            Height = 42,
            Dock = DockStyle.Top
        };
        var intro = new Label
        {
            Text = "El motor oficial y su app.asar permanecen intactos. Las cuentas se abren en ventanas distintas. " +
                   "El aislamiento de perfiles del proveedor aún requiere una prueba real de inicio de sesión.",
            ForeColor = Color.LightGray,
            Height = 58,
            Dock = DockStyle.Top
        };
        accountList.Dock = DockStyle.Fill;
        accountList.Font = new Font("Segoe UI", 11);
        accountList.BackColor = Color.FromArgb(27, 43, 53);
        accountList.ForeColor = Color.White;
        accountList.BorderStyle = BorderStyle.FixedSingle;
        accountList.IntegralHeight = false;
        accountList.SelectedIndexChanged += (_, _) => UpdateButtons();
        accountList.DoubleClick += (_, _) => OpenSelected();

        var sidebar = new TableLayoutPanel
        {
            Dock = DockStyle.Right,
            Width = 270,
            Padding = new Padding(12, 0, 0, 0),
            ColumnCount = 1,
            RowCount = 6
        };
        foreach (Button b in new[]
                 { openButton, addButton, renameButton, archiveButton, folderButton, officialButton })
        {
            b.BackColor = Color.FromArgb(26, 84, 81);
            b.ForeColor = Color.White;
            b.FlatStyle = FlatStyle.Flat;
            b.FlatAppearance.BorderColor = Color.FromArgb(67, 140, 128);
            b.Dock = DockStyle.Top;
            b.Height = 42;
            sidebar.Controls.Add(b);
        }
        openButton.Click += (_, _) => OpenSelected();
        officialButton.Click += (_, _) => StartOfficial(null);
        addButton.Click += (_, _) => AddAccount();
        renameButton.Click += (_, _) => RenameAccount();
        archiveButton.Click += (_, _) => OpenArchive();
        folderButton.Click += (_, _) => OpenAccountFolder();

        footer.Text = "Modo experimental · Respalda Cuentas antes de usar. No modifica ni borra los archivos del navegador.";
        footer.ForeColor = Color.FromArgb(197, 213, 214);
        footer.Dock = DockStyle.Bottom;
        footer.Height = 47;

        var body = new Panel { Dock = DockStyle.Fill };
        body.Controls.Add(accountList);
        body.Controls.Add(sidebar);

        var frame = new Panel { Dock = DockStyle.Fill, Padding = new Padding(18) };
        frame.Controls.Add(body);
        frame.Controls.Add(footer);
        frame.Controls.Add(intro);
        frame.Controls.Add(head);
        Controls.Add(frame);

        LoadAccounts();
    }

    private static string AccountDirectory(string id)
    {
        if (id != "legacy" && !ValidId.IsMatch(id))
            throw new InvalidOperationException("Identificador de cuenta no válido.");
        return Path.Combine(Root, id);
    }

    private AccountItem? Selected => accountList.SelectedItem as AccountItem;

    private void UpdateButtons()
    {
        bool selected = Selected is not null;
        openButton.Enabled = selected;
        renameButton.Enabled = selected;
        archiveButton.Enabled = selected;
        folderButton.Enabled = selected;
    }

    private void LoadAccounts(string? highlightId = null)
    {
        Directory.CreateDirectory(Root);
        var ids = new List<string> { "legacy" };
        foreach (string folder in Directory.EnumerateDirectories(Root))
        {
            string id = Path.GetFileName(folder);
            if (ValidId.IsMatch(id)) ids.Add(id);
        }
        accountList.Items.Clear();
        foreach (string id in ids.Distinct(StringComparer.Ordinal))
        {
            string name = id == "legacy" ? "Cuenta principal" : "Cuenta " + id[..6];
            try
            {
                string candidate = File.ReadAllText(Path.Combine(AccountDirectory(id), "cuenta-nombre.txt")).Trim();
                if (!string.IsNullOrEmpty(candidate) && candidate.Length <= 80) name = candidate;
            }
            catch (IOException) { }
            catch (UnauthorizedAccessException) { }

            accountList.Items.Add(new AccountItem { Id = id, Name = name });
        }
        int idx = accountList.Items.Cast<AccountItem>().ToList()
            .FindIndex(a => a.Id == (highlightId ?? "legacy"));
        accountList.SelectedIndex = idx >= 0 ? idx : 0;
    }

    private static void OpenFolder(string folder)
    {
        Directory.CreateDirectory(folder);
        Process.Start(new ProcessStartInfo
        {
            FileName = "explorer.exe",
            Arguments = "\"" + folder + "\"",
            UseShellExecute = true
        });
    }

    private static void StartOfficial(string? accountId)
    {
        if (!File.Exists(OfficialExe))
            throw new FileNotFoundException("No se encontró el cliente DICloak oficial 3.0.7.", OfficialExe);

        var info = new ProcessStartInfo
        {
            FileName = OfficialExe,
            WorkingDirectory = AppContext.BaseDirectory,
            UseShellExecute = false
        };
        if (accountId is not null)
        {
            string engine = Path.Combine(AccountDirectory(accountId), "Engine307");
            string roaming = Path.Combine(engine, "Roaming");
            string local = Path.Combine(engine, "Local");
            string temp = Path.Combine(engine, "Temp");
            Directory.CreateDirectory(roaming);
            Directory.CreateDirectory(local);
            Directory.CreateDirectory(temp);
            info.Environment["APPDATA"] = roaming;
            info.Environment["LOCALAPPDATA"] = local;
            info.Environment["TEMP"] = temp;
            info.Environment["TMP"] = temp;
        }
        Process.Start(info);
    }

    private void OpenSelected()
    {
        try
        {
            if (Selected is { } account) StartOfficial(account.Id);
        }
        catch (Exception ex) { ShowError("No se pudo abrir la cuenta", ex); }
    }

    private void AddAccount()
    {
        try
        {
            string id = Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant();
            string path = AccountDirectory(id);
            Directory.CreateDirectory(path);
            File.WriteAllText(Path.Combine(path, "cuenta-nombre.txt"), "Cuenta " + id[..6]);
            LoadAccounts(id);
            MessageBox.Show(this, "La nueva cuenta se creó sin modificar las anteriores. Inicia sesión en su ventana.",
                "Cuenta creada", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        catch (Exception ex) { ShowError("No se pudo crear la cuenta", ex); }
    }

    private void RenameAccount()
    {
        if (Selected is not { } a) return;
        using var dialog = new Form
        {
            Text = "Nombre de la cuenta",
            Width = 440,
            Height = 170,
            StartPosition = FormStartPosition.CenterParent,
            FormBorderStyle = FormBorderStyle.FixedDialog,
            MaximizeBox = false,
            MinimizeBox = false
        };
        var field = new TextBox { Text = a.Name, Left = 16, Top = 15, Width = 395, MaxLength = 80 };
        var ok = new Button { Text = "Guardar", DialogResult = DialogResult.OK, Left = 286, Top = 55, Width = 125 };
        dialog.Controls.Add(field);
        dialog.Controls.Add(ok);
        dialog.AcceptButton = ok;
        if (dialog.ShowDialog(this) != DialogResult.OK) return;
        string value = field.Text.Trim();
        if (value.Length == 0 || value.Any(char.IsControl))
        {
            MessageBox.Show(this, "El nombre no es válido."); return;
        }
        try
        {
            Directory.CreateDirectory(AccountDirectory(a.Id));
            File.WriteAllText(Path.Combine(AccountDirectory(a.Id), "cuenta-nombre.txt"), value);
            LoadAccounts(a.Id);
        }
        catch (Exception ex) { ShowError("No se pudo guardar el nombre", ex); }
    }

    private void OpenArchive()
    {
        try
        {
            if (Selected is { } a) OpenFolder(Path.Combine(AccountDirectory(a.Id), "ArchivoOriginal", "Perfiles"));
        }
        catch (Exception ex) { ShowError("No se pudo abrir Archivos automáticos", ex); }
    }

    private void OpenAccountFolder()
    {
        try
        {
            if (Selected is { } a) OpenFolder(AccountDirectory(a.Id));
        }
        catch (Exception ex) { ShowError("No se pudo abrir la carpeta", ex); }
    }

    private void ShowError(string title, Exception ex) =>
        MessageBox.Show(this, ex.Message, title, MessageBoxButtons.OK, MessageBoxIcon.Error);
}
