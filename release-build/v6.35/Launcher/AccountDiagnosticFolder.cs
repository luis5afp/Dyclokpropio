using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace DyclokPRO;

/// <summary>
/// One-click access to original diagnostic artifacts of the selected account.
/// Does not read/re-serialize any original NetLog, HTTP data, cookies or profiles.
/// </summary>
internal static class AccountDiagnosticFolder
{
    internal static string Folder(string id,string alias) =>
        NativeNetLogCapture.DirectoryFor(id,alias);

    internal static string Prepare(string id,string alias)
    {
        string dir=Folder(id,alias);
        Directory.CreateDirectory(dir);
        string oldBase=Path.Combine(AccountStore.DirectoryFor(id),"Diagnostico");
        string archive=Path.Combine(AccountStore.DirectoryFor(id),"ArchivoOriginal","Perfiles");
        var others=Directory.Exists(oldBase)
            ?Directory.GetDirectories(oldBase).Where(d=>!string.Equals(d,dir,
                StringComparison.OrdinalIgnoreCase)).ToArray()
            :Array.Empty<string>();
        // Only this explanatory INDEX is overwritten. All captured records
        // remain unchanged; old aliases are still accessible under Diagnostico.
        string text=
            "DyclokPRO - DIAGNÓSTICO DE "+alias+Environment.NewLine+
            "===================================================="+Environment.NewLine+
            "Esta carpeta contiene los registros que REALMENTE existen para esta cuenta."+
                Environment.NewLine+
            "eventos-proceso.jsonl: arranques, cierres y errores, si se registraron."+
                Environment.NewLine+
            "<fecha>/*.netlog.json: eventos de red ORIGINALES de Chromium,"+
                Environment.NewLine+
            "solo si se activó Captura de conexiones ANTES de arrancar la cuenta."+
                Environment.NewLine+
            "Esos archivos se conservan sin modificar. No se promete copiar"+
                Environment.NewLine+
            "todos los paquetes HTTP, cuerpos POST, peticiones de Node.js,"+
                Environment.NewLine+
            "perfiles remotos ni credenciales fuera de lo que Chromium haya registrado."+
                Environment.NewLine+Environment.NewLine+
            "Directorio original de la cuenta: "+AccountStore.DirectoryFor(id)+Environment.NewLine+
            "Archivos originales de perfiles, si existen: "+archive+Environment.NewLine+
            "Journal general de procesos: "+SessionDiagnostics.JournalFolder+Environment.NewLine+
            "Otros directorios por nombres anteriores:"+Environment.NewLine+
            (others.Length==0?"(ninguno)"+Environment.NewLine:
              string.Join(Environment.NewLine,others)+Environment.NewLine)+
            Environment.NewLine+
            "ADVERTENCIA: NetLog en modo completo puede contener cookies,"+
                Environment.NewLine+
            "contraseñas, tokens o encabezados privados SIN CIFRAR."+
                Environment.NewLine+
            "No compartas el directorio íntegro sin revisar su contenido."+
                Environment.NewLine;
        string index=Path.Combine(dir,"LEER_PRIMERO.txt");
        File.WriteAllText(index,text,new UTF8Encoding(false));
        return dir;
    }

    internal static void Open(string id,string alias)
    {
        string path=Prepare(id,alias);
        Process.Start(new ProcessStartInfo("explorer.exe"){
            UseShellExecute=true,ArgumentList={path}
        });
    }
}

internal static class AccountFriendlyName
{
    private static readonly Regex Placeholder=new(
        @"^(?:iniciar\s+sesi[oó]n(?:\s+\d+)?|nueva\s+cuenta(?:\s+.*)?|cuenta\s+(?:principal|[a-f0-9]{6})|principal)$",
        RegexOptions.IgnoreCase|RegexOptions.CultureInvariant|RegexOptions.Compiled);
    internal static bool NeedsIdentification(string name) =>
        string.IsNullOrWhiteSpace(name)||Placeholder.IsMatch(name.Trim());
    internal static string Label(string id,string name)
    {
        if(!NeedsIdentification(name))return name.Trim();
        return id=="legacy"?"Principal · sin nombre":"Sin identificar · "+id[..6];
    }
    internal static string PromptMarker(string id) =>
        Path.Combine(AccountStore.DirectoryFor(id),"identificacion-pendiente.txt");
    internal static bool WasDismissed(string id) => File.Exists(PromptMarker(id));
    internal static void Dismiss(string id)
    {
        Directory.CreateDirectory(AccountStore.DirectoryFor(id));
        File.WriteAllText(PromptMarker(id),"El usuario pospuso la identificación local.");
    }
    internal static void Reset(string id)
    {
        string path=PromptMarker(id);
        if(File.Exists(path))File.Delete(path);
    }
}
