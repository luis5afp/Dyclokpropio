using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace DyclokPRO;

internal sealed record UserAccount(string Id, string Name);
internal static class AccountStore
{
    public static readonly string Root=Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"DyclokPRO","Cuentas");
    public static readonly string Registry=Path.Combine(Root,"cuentas.json");
    public static readonly Regex ValidId=new("^[a-f0-9]{32}$",RegexOptions.CultureInvariant);
    public static string DirectoryFor(string id) {
        if(id!="legacy"&&!ValidId.IsMatch(id))throw new ArgumentException("Identificador incorrecto");
        return Path.Combine(Root,id);
    }
    public static List<UserAccount> Get(){
        Directory.CreateDirectory(Root);
        var saved=new Dictionary<string,string>(StringComparer.Ordinal);
        if(File.Exists(Registry)){
            using var document=JsonDocument.Parse(File.ReadAllText(Registry));
            if(document.RootElement.TryGetProperty("accounts",out var array)&&array.ValueKind==JsonValueKind.Array){
                foreach(var item in array.EnumerateArray()){
                    if(item.ValueKind!=JsonValueKind.Object||
                        !item.TryGetProperty("id",out var key)||key.ValueKind!=JsonValueKind.String||
                        !item.TryGetProperty("name",out var name)||name.ValueKind!=JsonValueKind.String)continue;
                    string id=key.GetString()??"", text=name.GetString()?.Trim()??"";
                    if((id=="legacy"||ValidId.IsMatch(id))&&text.Length is >=2 and <=80)
                        saved[id]=text;
                }
            }
        }
        var ids=new List<string>{"legacy"};
        foreach(string dir in System.IO.Directory.EnumerateDirectories(Root)){
            string id=Path.GetFileName(dir);
            if(ValidId.IsMatch(id))ids.Add(id);
        }
        foreach(string id in saved.Keys){
            if(id!="legacy"&&!ids.Contains(id))ids.Add(id);
        }
        return ids.Distinct(StringComparer.Ordinal).Take(28).Select(id=>{
            string label=id=="legacy"?"Cuenta principal":"Cuenta "+id[..6];
            // Existing authenticated account names in cuentas.json take precedence.
            if(saved.TryGetValue(id,out var original))label=original;
            else {
                string file=Path.Combine(DirectoryFor(id),"cuenta-nombre.txt");
                try {
                    if(File.Exists(file)){
                        string localName=File.ReadAllText(file).Trim();
                        if(localName.Length is >=2 and <=80)label=localName;
                    }
                }catch(IOException){}catch(UnauthorizedAccessException){}
            }
            return new UserAccount(id,label);
        }).ToList();
    }
    public static void SaveName(string id,string name){
        if(id!="legacy"&&!ValidId.IsMatch(id))throw new ArgumentException("Cuenta inválida");
        name=name.Trim();
        if(name.Length is <2 or >80||name.Any(char.IsControl))
            throw new ArgumentException("Nombre: 2 a 80 caracteres, sin saltos de línea.");
        Directory.CreateDirectory(Root);
        // Preserve unrecognized fields from existing v6.27 registry. Never
        // overwrite an unreadable registry with a new empty one.
        JsonObject root=File.Exists(Registry)
            ?JsonNode.Parse(File.ReadAllText(Registry)) as JsonObject
                ??throw new InvalidDataException("cuentas.json no contiene un objeto.")
            :new JsonObject();
        JsonArray records=root["accounts"] as JsonArray
            ??(root.ContainsKey("accounts")
                ?throw new InvalidDataException("cuentas.json contiene una lista inválida.")
                :new JsonArray());
        bool found=false;
        foreach(JsonNode? node in records){
            if(node is not JsonObject account || (string?)account["id"]!=id)continue;
            account["name"]=name;found=true;break;
        }
        if(!found)records.Add(new JsonObject{["id"]=id,["name"]=name});
        root["schema"]=1;
        if(!root.ContainsKey("accounts"))root["accounts"]=records;
        string temp=Registry+"."+Guid.NewGuid().ToString("N")+".tmp";
        try{
            File.WriteAllText(temp,root.ToJsonString(new JsonSerializerOptions{WriteIndented=true}));
            File.Move(temp,Registry,true);
        }finally{if(File.Exists(temp))File.Delete(temp);}
        // Compatibility with the v6.30 manager. This is not profile metadata.
        Directory.CreateDirectory(DirectoryFor(id));
        File.WriteAllText(Path.Combine(DirectoryFor(id),"cuenta-nombre.txt"),name);
    }
    public static UserAccount Create(){
        string id=Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLowerInvariant();
        string name="Nueva cuenta "+id[..6];
        Directory.CreateDirectory(DirectoryFor(id));
        SaveName(id,name);
        return new UserAccount(id,name);
    }
}
internal static class Program {
    internal const string AsarSha="b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf";
    [STAThread]
    private static void Main(string[] args){
        if(args.Contains("--dyclok-self-test",StringComparer.OrdinalIgnoreCase)){
            string exe=Path.Combine(AppContext.BaseDirectory,"DICloak.exe");
            string path=Path.Combine(AppContext.BaseDirectory,"resources","app.asar");
            string digest="missing";
            if(File.Exists(path))using(var stream=File.OpenRead(path)){
                digest=Convert.ToHexString(SHA256.HashData(stream)).ToLowerInvariant();
            }
            bool valid=File.Exists(exe)&&digest==AsarSha;
            List<UserAccount> accounts=AccountStore.Get();
            File.WriteAllText(Path.Combine(Path.GetTempPath(),"dyclokpro-v631-selftest.json"),
                JsonSerializer.Serialize(new {
                    version="6.31.0",validOriginalEngine=valid,
                    sha256=digest,accounts=accounts.Select(x=>new {id=x.Id,name=x.Name}).ToArray(),
                    directLaunch=true,
                    automaticServerCapture=false
                }));
            Environment.ExitCode=valid?0:5;return;
        }
        ApplicationConfiguration.Initialize();
        bool smoke=args.Contains("--dyclok-direct-launch-smoke",StringComparer.OrdinalIgnoreCase);
        try{
            // The official browser starts BEFORE any optional user-account
            // ribbon is constructed. No intermediate manager screen.
            Process official=BrowserRibbon.StartNative("legacy");
            if(smoke){
                File.WriteAllText(Path.Combine(Path.GetTempPath(),"dyclokpro-v631-direct-launch.json"),
                    JsonSerializer.Serialize(new{openedNative=official.Id>0,pid=official.Id,
                        largeManagerWindow=false,startedBeforeRibbon=true}));
            }
            Application.Run(new BrowserRibbon(official,smoke));
        }catch(Exception ex){
            MessageBox.Show(ex.Message,"No se pudo iniciar DyclokPRO",MessageBoxButtons.OK,MessageBoxIcon.Error);
            Environment.ExitCode=2;
        }
    }
}
internal sealed class BrowserRibbon:Form{
    [DllImport("user32.dll")] private static extern bool GetWindowRect(IntPtr h,out Rect r);
    [DllImport("user32.dll")] private static extern bool IsWindow(IntPtr h);
    [DllImport("user32.dll")] private static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] private static extern bool IsIconic(IntPtr h);
    [DllImport("user32.dll")] private static extern bool ShowWindow(IntPtr h,int type);
    [DllImport("user32.dll")] private static extern bool SetForegroundWindow(IntPtr h);
    [StructLayout(LayoutKind.Sequential)]
    private struct Rect{public int Left,Top,Right,Bottom;}
    private readonly Dictionary<string,Process> running=new(StringComparer.Ordinal);
    private readonly FlowLayoutPanel tabs=new(){
        Dock=DockStyle.Fill,FlowDirection=FlowDirection.LeftToRight,
        WrapContents=false,AutoScroll=true,Padding=new Padding(4,2,0,0)
    };
    private readonly System.Windows.Forms.Timer clock=new(){Interval=750};
    private readonly NotifyIcon tray=new(){Icon=SystemIcons.Application,Text="DyclokPRO v6.31 · Cuentas"};
    private string active="legacy";
    private readonly bool directSmoke;
    private bool exiting=false, loading=false;
    private string? errorMessage;
    private static readonly string Client=Path.Combine(AppContext.BaseDirectory,"DICloak.exe");
    protected override bool ShowWithoutActivation=>true;

    public BrowserRibbon(Process official,bool smoke=false){
        directSmoke=smoke;
        running["legacy"]=official;
        Text="DyclokPRO v6.31";
        FormBorderStyle=FormBorderStyle.None;
        StartPosition=FormStartPosition.Manual;
        ShowInTaskbar=false;
        BackColor=Color.FromArgb(13,33,42);
        ForeColor=Color.White;
        Height=43;
        Width=900;
        TopMost=true;
        Padding=new Padding(3,1,3,1);
        var label=new Label{
            Text="DyclokPRO",Font=new Font("Segoe UI",9.5f,FontStyle.Bold),
            ForeColor=Color.White,Width=103,Dock=DockStyle.Left,
            TextAlign=ContentAlignment.MiddleCenter
        };
        var right=new FlowLayoutPanel{
            Dock=DockStyle.Right,Width=210,WrapContents=false,FlowDirection=FlowDirection.LeftToRight,
            Padding=new Padding(0,2,0,0)
        };
        var add=Button("+ Cuenta",58);
        add.Click+=(_,_)=>AddUser();
        var files=Button("Archivos",73);
        files.Click+=(_,_)=>ShowArchiveMenu(files);
        var more=Button("⋯",47);
        more.Click+=(_,_)=>ShowSettingsMenu(more);
        right.Controls.Add(add);right.Controls.Add(files);right.Controls.Add(more);
        Controls.Add(tabs);Controls.Add(right);Controls.Add(label);
        var menu=new ContextMenuStrip();
        menu.Items.Add("Abrir cuenta principal",null,(_,_)=>OpenAccount("legacy"));
        menu.Items.Add("Mostrar pestañas",null,(_,_)=>MakeVisible());
        menu.Items.Add("Abrir archivos guardados",null,(_,_)=>OpenArchive(active));
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Salir del gestor",null,(_,_)=>Exit());
        tray.ContextMenuStrip=menu;
        tray.DoubleClick+=(_,_)=>OpenAccount(active);
        clock.Tick+=(_,_)=>PositionBar();
        Shown+=(_,_)=>{
            tray.Visible=true;
            try{AccountStore.Get();RebuildTabs();}
            catch(Exception ex){MessageBox.Show(ex.Message,"DyclokPRO no pudo mostrar las cuentas");errorMessage=ex.Message;}
            clock.Start();
            if(directSmoke){
                int pid=running.TryGetValue("legacy",out var p)?p.Id:0;
                File.WriteAllText(Path.Combine(Path.GetTempPath(),"dyclokpro-v631-direct-launch.json"),
                    JsonSerializer.Serialize(new{openedNative=pid>0,pid,largeManagerWindow=false}));
                var done=new System.Windows.Forms.Timer{Interval=1800};
                done.Tick+=(_,_)=>{done.Stop();done.Dispose();Exit();};done.Start();
            }
        };
    }
    private static Button Button(string text,int width)=>new(){
        Text=text,Width=width,Height=34,Margin=new Padding(2,1,2,1),
        FlatStyle=FlatStyle.Flat,ForeColor=Color.White,BackColor=Color.FromArgb(23,77,76),
        Font=new Font("Segoe UI",9),TabStop=false
    };
    private static string Name(string id)=>AccountStore.Get().FirstOrDefault(x=>x.Id==id)?.Name
        ??(id=="legacy"?"Cuenta principal":"Cuenta "+id[..6]);
    private void RebuildTabs(){
        tabs.SuspendLayout();tabs.Controls.Clear();
        foreach(var user in AccountStore.Get()){
            var b=Button(user.Name,Math.Clamp(40+user.Name.Length*7,100,183));
            b.BackColor=user.Id==active?Color.FromArgb(10,128,109):Color.FromArgb(32,54,65);
            b.Click+=(_,_)=>OpenAccount(user.Id);
            b.MouseUp+=(_,args)=>{
                if(args.Button==MouseButtons.Right)RenameAccount(user.Id);
            };
            tabs.Controls.Add(b);
        }
        tabs.ResumeLayout();
    }
    internal static Process StartNative(string id){
        _=AccountStore.DirectoryFor(id);
        if(!File.Exists(Client))throw new FileNotFoundException("Falta el navegador oficial.",Client);
        // Reuse v6.30 Engine307 locations. NEVER copy or delete older sessions.
        string engine=Path.Combine(AccountStore.DirectoryFor(id),"Engine307");
        string roaming=Path.Combine(engine,"Roaming");
        string local=Path.Combine(engine,"Local");
        string temp=Path.Combine(engine,"Temp");
        foreach(string dir in new[]{roaming,local,temp})Directory.CreateDirectory(dir);
        var info=new ProcessStartInfo{
            FileName=Client,WorkingDirectory=AppContext.BaseDirectory,UseShellExecute=false
        };
        info.Environment["APPDATA"]=roaming;
        info.Environment["LOCALAPPDATA"]=local;
        info.Environment["TEMP"]=temp;info.Environment["TMP"]=temp;
        return Process.Start(info)??throw new InvalidOperationException("Windows no inició DICloak.");
    }
    private void OpenAccount(string id){
        try{
            _=AccountStore.DirectoryFor(id);
            if(!File.Exists(Client))throw new FileNotFoundException("Falta el navegador oficial.",Client);
            if(running.TryGetValue(id,out var old)){
                old.Refresh();
                if(!old.HasExited){active=id;RebuildTabs();BringToFront(old);return;}
                old.Dispose();running.Remove(id);
            }
            var process=StartNative(id);
            running[id]=process;active=id;RebuildTabs();
            errorMessage=null;
        }catch(Exception ex){
            errorMessage=ex.Message;
            MessageBox.Show(ex.Message,"No se pudo abrir "+Name(id),MessageBoxButtons.OK,MessageBoxIcon.Error);
        }
    }
    private static void BringToFront(Process process){
        try{
            process.Refresh();IntPtr h=process.MainWindowHandle;
            if(h==IntPtr.Zero||!IsWindow(h))return;
            if(IsIconic(h))ShowWindow(h,9);
            SetForegroundWindow(h);
        }catch(InvalidOperationException){}
    }
    private void PositionBar(){
        if(loading)return;
        try{
            if(!running.TryGetValue(active,out var current)){Hide();return;}
            current.Refresh();
            if(current.HasExited){Hide();return;}
            IntPtr h=current.MainWindowHandle;
            if(h==IntPtr.Zero||!IsWindow(h)||!IsWindowVisible(h)||IsIconic(h)){
                Hide();return;
            }
            if(!GetWindowRect(h,out var rect)){Hide();return;}
            // Compact tab ribbon stays near the titlebar; original DICloak
            // window remains separate and untouched. No SetParent/injection.
            int width=Math.Clamp(rect.Right-rect.Left-20,350,1150);
            int left=Math.Max(0,rect.Left+9);
            int top=Math.Max(0,rect.Top+5);
            if(Bounds!=new Rectangle(left,top,width,43))Bounds=new Rectangle(left,top,width,43);
            if(!Visible)Show();
        }catch(InvalidOperationException){Hide();}
    }
    private void MakeVisible(){
        if(running.TryGetValue(active,out var p))BringToFront(p);
        PositionBar();
    }
    private void AddUser(){
        try{
            var account=AccountStore.Create();
            OpenAccount(account.Id);
        }catch(Exception ex){MessageBox.Show(ex.Message,"No se creó la cuenta");}
    }
    private void RenameAccount(string id){
        string? value=Microsoft.VisualBasic.Interaction.InputBox(
            "Nuevo nombre de la cuenta (2 a 80 caracteres)","Cambiar nombre",Name(id));
        if(string.IsNullOrWhiteSpace(value))return;
        try{AccountStore.SaveName(id,value);RebuildTabs();}
        catch(Exception ex){MessageBox.Show(ex.Message,"No se guardó el nombre");}
    }
    private static string Archive(string id)=>Path.Combine(AccountStore.DirectoryFor(id),"ArchivoOriginal","Perfiles");
    private static void OpenDirectory(string path){
        Directory.CreateDirectory(path);
        Process.Start(new ProcessStartInfo("explorer.exe"){ArgumentList={path},UseShellExecute=true});
    }
    private static void OpenArchive(string id)=>OpenDirectory(Archive(id));
    private void ShowArchiveMenu(Control origin){
        var m=new ContextMenuStrip();
        m.Items.Add("Abrir archivos guardados — "+Name(active),null,(_,_)=>OpenArchive(active));
        m.Items.Add("Ver estado de archivos",null,(_,_)=>ArchiveStatus());
        m.Items.Add("Importar exportación oficial sin modificar",null,(_,_)=>ImportOfficialFiles());
        m.Items.Add(new ToolStripSeparator());
        m.Items.Add("Aviso: no captura nuevas respuestas API en el motor 3.0.7 firmado")
            .Enabled=false;
        m.Show(origin,new Point(0,origin.Height));
    }
    private void ArchiveStatus(){
        string baseDir=Archive(active);
        if(!Directory.Exists(baseDir)){
            MessageBox.Show("Aún no hay archivos archivados para esta cuenta. "+
                "El motor oficial 3.0.7 no permite activar el capturador anterior sin modificar su paquete protegido.",
                "Archivos guardados");return;
        }
        var files=Directory.EnumerateFiles(baseDir,"*",SearchOption.AllDirectories)
            .Take(20001).ToArray();
        int json=files.Count(f=>f.EndsWith(".json",StringComparison.OrdinalIgnoreCase));
        int enc=files.Count(f=>f.EndsWith(".enc",StringComparison.OrdinalIgnoreCase));
        int db=files.Count(f=>f.EndsWith(".sqlite",StringComparison.OrdinalIgnoreCase)
            ||f.EndsWith(".ldb",StringComparison.OrdinalIgnoreCase));
        MessageBox.Show("Cuenta: "+Name(active)+
            "\nRespuestas JSON guardadas anteriormente: "+json+
            "\nArchivos cifrados anteriores: "+enc+
            "\nArchivos SQLite/LevelDB: "+db+
            "\n\nNo se han verificado cookies, marcadores, LocalStorage o IndexedDB originales del servidor."+
            "\nEl gestor no intercepta respuestas nuevas del cliente oficial.",
            "Estado de archivos — "+Name(active));
    }
    private void ImportOfficialFiles(){
        using var dlg=new OpenFileDialog{
            Title="Seleccionar archivos exportados oficialmente de un perfil",
            Filter="Todos los archivos (*.*)|*.*",
            Multiselect=true,CheckFileExists=true
        };
        if(dlg.ShowDialog(this)!=DialogResult.OK)return;
        string dest=Path.Combine(Archive(active),"Importaciones");
        Directory.CreateDirectory(dest);
        int copied=0,skipped=0;
        foreach(string file in dlg.FileNames){
            try{
                string output=Path.Combine(dest,Path.GetFileName(file));
                File.Copy(file,output,false); // byte-for-byte and same filename, no overwrite
                copied++;
            }catch(IOException){skipped++;}
        }
        MessageBox.Show("Copias exactas de exportaciones: "+copied+
            "\nOmitidos por nombre duplicado o error: "+skipped+
            "\nNingún archivo original fue modificado.",
            "Importaciones");
    }
    private void ShowSettingsMenu(Control origin){
        var m=new ContextMenuStrip();
        m.Items.Add("Renombrar cuenta actual",null,(_,_)=>RenameAccount(active));
        m.Items.Add("Carpeta de la cuenta",null,(_,_)=>OpenDirectory(AccountStore.DirectoryFor(active)));
        m.Items.Add("Abrir motor oficial 3.0.7",null,(_,_)=>OpenAccount(active));
        m.Items.Add("Ver el gestor en área de notificación",null,(_,_)=>{Hide();});
        m.Items.Add("Salir del gestor (sin cerrar DICloak)",null,(_,_)=>Exit());
        m.Show(origin,new Point(0,origin.Height));
    }
    private void Exit(){
        exiting=true;clock.Stop();tray.Visible=false;tray.Dispose();
        Close();
    }
    protected override void OnFormClosing(FormClosingEventArgs e){
        if(!exiting){e.Cancel=true;Hide();}
        base.OnFormClosing(e);
    }
}
