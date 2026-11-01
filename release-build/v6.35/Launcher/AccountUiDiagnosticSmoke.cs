using System;
using System.IO;
using System.Linq;

namespace DyclokPRO;

/// <summary>
/// Offline Windows CI regression for account names and diagnostic layout.
/// Uses a disposable test ID in the CI runner; never inspects or exports
/// real profile contents, credentials or live network traffic.
/// </summary>
internal static class AccountUiDiagnosticSmoke
{
    internal static bool Run()
    {
        if(Environment.GetEnvironmentVariable("GITHUB_ACTIONS")!="true")return false;
        string id=Guid.NewGuid().ToString("N"),alias="Danna - cuenta de CI";
        string root=AccountStore.DirectoryFor(id);
        try{
            AccountStore.SaveName(id,"Iniciar sesión 4");
            if(!AccountFriendlyName.NeedsIdentification("Iniciar sesión 4")
              ||!AccountFriendlyName.NeedsIdentification("Cuenta 841ab3")
              ||!AccountFriendlyName.NeedsIdentification("Cuenta principal")
              ||AccountFriendlyName.NeedsIdentification("Eddie - Trabajo"))
                return false;
            if(!AccountFriendlyName.Label(id,"Iniciar sesión 4").StartsWith("Sin identificar"))
                return false;
            AccountStore.SaveName(id,alias);
            var recovered=AccountStore.Get().SingleOrDefault(a=>a.Id==id);
            if(recovered is null||recovered.Name!=alias)return false;
            string folder=AccountDiagnosticFolder.Folder(id,alias);
            if(!folder.StartsWith(root+Path.DirectorySeparatorChar,
                StringComparison.OrdinalIgnoreCase))return false;
            Directory.CreateDirectory(folder);
            string rawFile=Path.Combine(folder,"test-original.netlog.json");
            const string original="{\"events\":[{\"type\":\"ORIGINAL_TEST_BYTES_123\"}]}";
            File.WriteAllText(rawFile,original);
            string result=AccountDiagnosticFolder.Prepare(id,alias);
            string index=Path.Combine(result,"LEER_PRIMERO.txt");
            if(!File.Exists(index)||File.ReadAllText(rawFile)!=original)return false;
            if(!File.ReadAllText(index).Contains("NO") ||
               !File.ReadAllText(index).Contains("ArchivoOriginal"))return false;
            AccountFriendlyName.Dismiss(id);
            if(!AccountFriendlyName.WasDismissed(id))return false;
            AccountFriendlyName.Reset(id);
            if(AccountFriendlyName.WasDismissed(id))return false;
            return true;
        }catch(Exception ex) when(ex is IOException or UnauthorizedAccessException or
           InvalidOperationException or ArgumentException){return false;}
        finally{
            // CI test fixture cleanup, not user account cleanup.
            // The account registry is local to the ephemeral GitHub runner.
            try{if(Directory.Exists(root))Directory.Delete(root,true);}
            catch(IOException){}
            catch(UnauthorizedAccessException){}
        }
    }
}
