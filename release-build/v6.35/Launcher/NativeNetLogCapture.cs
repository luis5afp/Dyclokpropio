// KAIZEN-style connection diagnostic, ADAPTED for the untouched official
// DICloak 3.0.7 process. Its proprietary Electron main/preload cannot import
// KAIZEN's monkeypatch modules without modifying the vendor package.
// Chromium NetLog observes the ORIGINAL traffic (no proxy, request rewrites
// or auth-header changes) and creates its own JSON in a named account folder.
// IMPORTANT: NetLog is not a complete byte-for-byte HTTP transaction recorder.
// POST bodies and some Node.js-only traffic may be absent.
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace DyclokPRO;

internal sealed record NetLogSettings(bool Enabled=false,bool Everything=false);
internal static class NativeNetLogCapture
{
    private static readonly object Gate=new();
    private const int DurationSeconds=900; // Bounds exposure and flushes a completed file.
    private const int MaxMegabytes=256;
    internal static readonly string PolicyNotice=
        "Los eventos se copian TAL COMO los genera Chromium. " +
        "No se editan peticiones, respuestas, cookies ni cabeceras del motor. " +
        "NetLog NO captura necesariamente todos los cuerpos POST o tráfico Node.js. " +
        "El modo completo puede registrar contraseñas, cookies y tokens.";
    private static readonly Regex InvalidPart=new(
        @"[\\/:*?""<>|\x00-\x1f]",RegexOptions.Compiled);

    private static string Config(string accountId)=>
        Path.Combine(AccountStore.DirectoryFor(accountId),"Diagnostico","config-netlog.json");

    internal static string SafeName(string raw)
    {
        string value=InvalidPart.Replace(raw??"","_").Trim().TrimEnd('.',' ');
        if(value.Length>60)value=value[..60].TrimEnd('.',' ');
        if(value.Length==0)value="Cuenta";
        if(Regex.IsMatch(value,@"^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)",
            RegexOptions.IgnoreCase))value="_"+value;
        return value;
    }
    internal static string DirectoryFor(string accountId,string alias)
    {
        // Keep diagnostic output under the account's data path; the suffix
        // prevents two accounts with the same alias from mixing records.
        string suffix=accountId=="legacy"?"principal":accountId[..6];
        return Path.Combine(AccountStore.DirectoryFor(accountId),
            "Diagnostico",SafeName(alias)+"_"+suffix);
    }
    private static string AccountAlias(string accountId) =>
        AccountStore.Get().FirstOrDefault(x=>x.Id==accountId)?.Name
        ??(accountId=="legacy"?"Principal":"Cuenta");

    internal static NetLogSettings Read(string accountId)
    {
        try {
            string file=Config(accountId);
            if(!File.Exists(file))return new();
            var settings=JsonSerializer.Deserialize<NetLogSettings>(File.ReadAllText(file));
            return settings ?? new();
        }catch(Exception ex) when(ex is IOException or UnauthorizedAccessException or
                                  JsonException){
            return new(); // Corrupt settings must NOT affect official login.
        }
    }
    internal static void Save(string accountId,NetLogSettings settings)
    {
        lock(Gate){
            string path=Config(accountId),folder=Path.GetDirectoryName(path)!;
            Directory.CreateDirectory(folder);
            string temp=path+"."+Guid.NewGuid().ToString("N")+".tmp";
            try{
                File.WriteAllText(temp,JsonSerializer.Serialize(settings,
                    new JsonSerializerOptions{WriteIndented=true}));
                File.Move(temp,path,true);
            }finally{if(File.Exists(temp))File.Delete(temp);}
        }
    }

    // icacls is part of Windows. If we cannot restrict the folder, never
    // initiate an unredacted capture. No external process receives the log.
    private static bool RestrictFolder(string folder)
    {
        if(!OperatingSystem.IsWindows())return false;
        string? sid=WindowsIdentity.GetCurrent().User?.Value;
        if(string.IsNullOrWhiteSpace(sid))return false;
        var start=new ProcessStartInfo{
            FileName="icacls.exe",UseShellExecute=false,CreateNoWindow=true,
            RedirectStandardOutput=true,RedirectStandardError=true
        };
        start.ArgumentList.Add(folder);
        start.ArgumentList.Add("/inheritance:r");
        start.ArgumentList.Add("/grant:r");
        start.ArgumentList.Add("*"+sid+":(OI)(CI)F");
        start.ArgumentList.Add("*S-1-5-18:(OI)(CI)F");
        start.ArgumentList.Add("*S-1-5-32-544:(OI)(CI)F");
        try{
            using var proc=Process.Start(start);
            if(proc is null)return false;
            if(!proc.WaitForExit(4500)){
                try{proc.Kill();}catch(InvalidOperationException){}
                return false;
            }
            return proc.ExitCode==0;
        }catch(Exception ex) when(ex is IOException or
                     System.ComponentModel.Win32Exception or InvalidOperationException){
            return false;
        }
    }

    internal static string[] NetLogArguments(string path,bool everything) =>
        new[]{
            "--log-net-log="+path,
            "--net-log-capture-mode="+(everything?"Everything":"Default"),
            "--net-log-max-size-mb="+MaxMegabytes,
            "--net-log-duration="+DurationSeconds
        };

    internal static string? PrepareArguments(ProcessStartInfo info,string accountId)
    {
        NetLogSettings settings=Read(accountId);
        if(!settings.Enabled)return null;
        try{
            string alias=AccountAlias(accountId);
            string root=DirectoryFor(accountId,alias);
            string day=Path.Combine(root,DateTime.Now.ToString("yyyy-MM-dd"));
            Directory.CreateDirectory(day);
            if(!RestrictFolder(day))throw new UnauthorizedAccessException(
                "No se pudo restringir el acceso a la carpeta de captura.");
            string stamp=DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss-fff");
            string file=Path.Combine(day,stamp+"_"+Guid.NewGuid().ToString("N")[..8]+".netlog.json");
            foreach(string flag in NetLogArguments(file,settings.Everything))
                info.ArgumentList.Add(flag);
            // Manifest contains no cookies, headers, URLs or tokens.
            // The original NetLog JSON is NEVER parsed, transformed or edited.
            string manifest=Path.ChangeExtension(file,"info.json");
            File.WriteAllText(manifest,JsonSerializer.Serialize(new{
                source="Chromium NetLog (official engine 3.0.7)",accountAlias=alias,
                accountId,startedUtc=DateTime.UtcNow,
                mode=settings.Everything?"Everything":"Default",
                maxMegabytes=MaxMegabytes,durationSeconds=DurationSeconds,
                netLogFile=Path.GetFileName(file),
                caveat="No cubre todos los cuerpos de solicitudes POST ni todo el tráfico Node.js",
                rawLogPreserved=true,requestsUnmodified=true
            },new JsonSerializerOptions{WriteIndented=true}));
            return file;
        }catch(Exception ex) when(ex is IOException or UnauthorizedAccessException or
                                  ArgumentException or
                                  System.ComponentModel.Win32Exception){
            // NetLog failure MUST NOT disrupt signing in to DICloak.
            SessionDiagnostics.Record("CAPTURE_FAILED",accountId);
            return null;
        }
    }

    internal static bool SelfTest()
    {
        var flags=NetLogArguments(@"C:\Test\Danna\red.netlog.json",true);
        bool full=flags.Length==4
            &&flags[0]==@"--log-net-log=C:\Test\Danna\red.netlog.json"
            &&flags[1]=="--net-log-capture-mode=Everything";
        var defaults=NetLogArguments(@"C:\Test\Danna\red.netlog.json",false);
        return full && defaults[1]=="--net-log-capture-mode=Default"
            && SafeName(@"Danna\../: *")=="Danna_..__ _"
            && !Read("legacy").Enabled; // Runner has no capture enabled.
    }
}

internal sealed class NativeNetLogCaptureWindow:Form
{
    private readonly string accountId;
    private readonly string alias;
    private readonly CheckBox enabled=new(){
        Text="Activar registro de conexiones en el próximo inicio",AutoSize=true
    };
    private readonly CheckBox complete=new(){
        Text="Modo completo: eventos y bytes que Chromium permita registrar",AutoSize=true
    };
    private readonly Label details=new(){
        Dock=DockStyle.Fill,ForeColor=Color.FromArgb(229,213,157),
        Padding=new Padding(12),AutoSize=false
    };
    internal NativeNetLogCaptureWindow(string id,string name)
    {
        accountId=id;alias=name;
        Text="DyclokPRO · Diagnóstico de red — "+name;
        Width=720;Height=435;MinimumSize=new Size(600,370);
        StartPosition=FormStartPosition.CenterParent;
        Font=new Font("Segoe UI",10);
        BackColor=Color.FromArgb(17,25,29);ForeColor=Color.White;
        var title=new Label{
            Text="Diagnóstico de conexiones · "+name,
            Dock=DockStyle.Top,Height=53,
            Padding=new Padding(14,12,0,0),
            Font=new Font("Segoe UI Semibold",14,FontStyle.Bold)
        };
        var options=new FlowLayoutPanel{
            Dock=DockStyle.Top,Height=86,Padding=new Padding(12,4,0,0),
            FlowDirection=FlowDirection.TopDown,WrapContents=false
        };
        var cfg=NativeNetLogCapture.Read(id);
        enabled.Checked=cfg.Enabled;
        complete.Checked=cfg.Everything;
        options.Controls.Add(enabled);
        options.Controls.Add(complete);
        var actions=new FlowLayoutPanel{
            Dock=DockStyle.Bottom,Height=56,Padding=new Padding(10,5,0,5)
        };
        var save=new Button{Text="Guardar configuración",AutoSize=true,Height=35};
        save.Click+=(_,_)=>Save();
        var folder=new Button{Text="Abrir carpeta",AutoSize=true,Height=35};
        folder.Click+=(_,_)=>OpenFolder();
        var stop=new Button{Text="Desactivar capturas futuras",AutoSize=true,Height=35};
        stop.Click+=(_,_)=>{
            NativeNetLogCapture.Save(accountId,new NetLogSettings(false,false));
            enabled.Checked=false;complete.Checked=false;
            UpdateDetails("Desactivado para el próximo inicio. Un archivo abierto por DICloak "+
                          "terminará al cumplirse su duración o al cerrar el motor.");
        };
        actions.Controls.Add(save);actions.Controls.Add(folder);actions.Controls.Add(stop);
        Controls.Add(details);Controls.Add(actions);Controls.Add(options);Controls.Add(title);
        UpdateDetails("Solo funciona desde el PRÓXIMO inicio de la cuenta. "+
                      "Cierra normalmente la cuenta y vuelve a abrirla mediante +.");
    }
    private void Save()
    {
        if(enabled.Checked && complete.Checked &&
           MessageBox.Show(this,
             "El registro COMPLETO puede guardar credenciales, cookies, "+
             "encabezados firmados y datos privados SIN CIFRAR. "+
             "Se restringirá el acceso de Windows a su carpeta, y no se enviará "+
             "nada a Internet. ¿Confirmas que deseas activarlo?",
             "Captura con datos sensibles",MessageBoxButtons.YesNo,MessageBoxIcon.Warning)
             !=DialogResult.Yes)return;
        NativeNetLogCapture.Save(accountId,
            new NetLogSettings(enabled.Checked,enabled.Checked&&complete.Checked));
        UpdateDetails(enabled.Checked?
            "Configuración guardada. Debes cerrar y volver a abrir la cuenta para iniciar "+
            "la captura. Duración máxima: 15 minutos; tamaño máximo: 256 MB por archivo.":
            "Captura desactivada para el próximo inicio.");
    }
    private void UpdateDetails(string status){
        string location=NativeNetLogCapture.DirectoryFor(accountId,alias);
        details.Text=status+"\n\n"+
            NativeNetLogCapture.PolicyNotice+"\n\n"+
            "Carpeta de la cuenta:\n"+location+"\n\n"+
            "No hay proxy ni interceptación HTTP. "+
            "Este diagnóstico NO equivale a recuperar todas las solicitudes y "+
            "respuestas de KAIZEN dentro de un Electron modificado.";
    }
    private void OpenFolder(){
        string path=NativeNetLogCapture.DirectoryFor(accountId,alias);
        Directory.CreateDirectory(path);
        Process.Start(new ProcessStartInfo("explorer.exe"){
            ArgumentList={path},UseShellExecute=true
        });
    }
}
