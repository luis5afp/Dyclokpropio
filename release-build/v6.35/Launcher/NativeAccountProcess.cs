using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace DyclokPRO;

/// <summary>
/// Recover an existing native 3.0.7 engine instead of spawning a new process
/// that Electron's single-instance lock immediately terminates. A tracked
/// engine is identified by PID + creation time + exact executable path +
/// Windows logon session; no account data, tokens or cookies are inspected.
/// </summary>
internal static class NativeAccountProcess
{
    private sealed record Instance(int Pid,DateTime StartedUtc,string ExePath);
    private static readonly object Gate=new();
    private static string RecordPath(string id)=>
        Path.Combine(AccountStore.DirectoryFor(id),"engine-running.json");

    private static bool SameExecutable(Process process,string expected)
    {
        try {
            if(process.HasExited || process.SessionId!=Process.GetCurrentProcess().SessionId)
                return false;
            return string.Equals(Path.GetFullPath(process.MainModule!.FileName),
                Path.GetFullPath(expected),StringComparison.OrdinalIgnoreCase);
        } catch(Exception ex) when(ex is InvalidOperationException or
            System.ComponentModel.Win32Exception or UnauthorizedAccessException or IOException){
            return false;
        }
    }
    private static bool HasMainWindow(Process process)
    {
        try{process.Refresh();return !process.HasExited&&process.MainWindowHandle!=IntPtr.Zero;}
        catch(InvalidOperationException){return false;}
    }

    internal static Process? Recover(string id,string executable)
    {
        lock(Gate){
            string file=RecordPath(id);
            if(File.Exists(file)){
                try{
                    var old=JsonSerializer.Deserialize<Instance>(File.ReadAllText(file));
                    if(old is not null && old.Pid>0 &&
                       string.Equals(Path.GetFullPath(old.ExePath),Path.GetFullPath(executable),
                           StringComparison.OrdinalIgnoreCase)){
                        var p=Process.GetProcessById(old.Pid);
                        if(SameExecutable(p,executable) &&
                           Math.Abs((p.StartTime.ToUniversalTime()-old.StartedUtc).TotalSeconds)<2)
                            return p;
                        p.Dispose();
                    }
                }catch(Exception ex) when(ex is IOException or JsonException or
                    ArgumentException or InvalidOperationException or
                    System.ComponentModel.Win32Exception or UnauthorizedAccessException){}
            }
            // Older DyclokPRO versions left the principal engine running
            // without any process manifest. Only recover an EXACT executable
            // in the same Windows session and with a real main window.
            // Never infer auxiliary account identity from an arbitrary PID.
            if(id=="legacy"){
                var matches=new List<Process>();
                foreach(var p in Process.GetProcessesByName("DICloak")){
                    if(SameExecutable(p,executable)&&HasMainWindow(p))matches.Add(p);
                    else p.Dispose();
                }
                if(matches.Count==1){
                    Save(id,matches[0],executable);
                    return matches[0];
                }
                foreach(var p in matches)p.Dispose();
                if(matches.Count>1)
                    throw new InvalidOperationException(
                        "Hay varias ventanas DICloak 3.0.7 abiertas. "+
                        "Cierra las que no correspondan a la cuenta principal "+
                        "e inicia DyclokPRO nuevamente. No se mezclaron sesiones.");
            }
            return null;
        }
    }

    internal static void Save(string id,Process process,string executable)
    {
        lock(Gate){
            Directory.CreateDirectory(AccountStore.DirectoryFor(id));
            string path=RecordPath(id);
            string temp=path+"."+Guid.NewGuid().ToString("N")+".tmp";
            File.WriteAllText(temp,JsonSerializer.Serialize(new Instance(
                process.Id,process.StartTime.ToUniversalTime(),Path.GetFullPath(executable))));
            File.Move(temp,path,true);
        }
    }

    internal static void ClearIfMatches(string id,int pid)
    {
        lock(Gate){
            try {
                string path=RecordPath(id);
                if(!File.Exists(path))return;
                var r=JsonSerializer.Deserialize<Instance>(File.ReadAllText(path));
                if(r?.Pid==pid)File.Delete(path);
            }catch(Exception ex) when(ex is IOException or UnauthorizedAccessException or JsonException){}
        }
    }

    internal static Process StartOrRecover(string id,string executable,Func<Process> launch)
    {
        var found=Recover(id,executable);
        if(found is not null)return found;
        var process=launch();
        try{Save(id,process,executable);}
        catch(IOException){} // Motor must remain functional if journal fails.
        return process;
    }
}
