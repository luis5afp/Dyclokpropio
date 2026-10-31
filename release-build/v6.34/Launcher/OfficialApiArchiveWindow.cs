// DyclokPRO v6.34 — opt-in read-only official DICloak Local API V2.
// Never patches the provider's ASAR/EXE or its signatures. Key only in memory.
// IMPORTANT: raw API response files may contain cookies/credentials; opt-in.
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DyclokPRO;
internal sealed record OfficialProfile(string Id,string Name,string Status);
internal sealed class OfficialApiArchiveWindow:Form{
    private readonly string accountId;
    private readonly TextBox port=new(){Text="52100",Width=90};
    private readonly TextBox key=new(){Width=310,UseSystemPasswordChar=true};
    private readonly DataGridView table=new();
    private readonly Label notice=new();
    private readonly CheckBox auto=new(){Text="Guardar respuestas automáticamente cada 3 minutos (solo API autorizada)",AutoSize=true};
    private readonly CheckBox includeCookies=new(){
        Text="Permitir exportar respuestas de cookies sin cifrado (datos sensibles)",AutoSize=true
    };
    private readonly System.Windows.Forms.Timer timer=new(){Interval=180000};
    private readonly List<OfficialProfile> profiles=new();
    private bool executing=false;
    private bool capabilityCookies=false,capabilityBookmarks=false;
    private const int MaxResponse=8*1024*1024;
    private static readonly Regex ProfileId=new(@"^(?:[0-9]{1,25}|[a-f0-9]{32}|[a-f0-9\-]{36})$",RegexOptions.IgnoreCase);
    private const string Warning="Se guardarán respuestas JSON exactas del servidor LOCAL, sin cifrado y sin metadatos. No incluyen automáticamente los archivos físicos del perfil Chromium.";
    internal OfficialApiArchiveWindow(string accountId,string name){
        this.accountId=accountId;
        Text="DyclokPRO · API oficial y archivos — "+name;
        Width=1000;Height=675;MinimumSize=new Size(790,520);
        StartPosition=FormStartPosition.CenterScreen;
        Font=new Font("Segoe UI",10);
        BackColor=Color.FromArgb(17,34,43);ForeColor=Color.White;
        var intro=new Label{
            Text="API local V2 oficial de DICloak (GET, sin modificar perfiles). Abre DICloak e inicia sesión antes de conectar.",
            Dock=DockStyle.Top,Height=38,ForeColor=Color.White
        };
        var line=new FlowLayoutPanel{Dock=DockStyle.Top,Height=46,WrapContents=false};
        line.Controls.Add(new Label{Text="Puerto local:",AutoSize=true,Padding=new Padding(0,10,0,0)});
        line.Controls.Add(port);
        line.Controls.Add(new Label{Text="Clave X-API-KEY:",AutoSize=true,Padding=new Padding(5,10,0,0)});
        line.Controls.Add(key);
        var connect=Make("Consultar API",115);
        connect.Click+=async (_,_)=>await Reload();
        line.Controls.Add(connect);
        var help=Make("¿Dónde está la clave?",155);
        help.Click+=(_,_)=>MessageBox.Show(this,
            "En DICloak oficial: Más ajustes → Open API (API abierta). "+
            "Copia el puerto del servicio local y tu clave API. La clave no se guarda en disco. "+
            "Si tu cuenta no habilita Local API V2, el diagnóstico indicará que no está disponible.",
            "Configuración de API local");
        line.Controls.Add(help);

        table.Dock=DockStyle.Fill;table.BackgroundColor=Color.FromArgb(26,44,52);
        table.ForeColor=Color.Black;table.ReadOnly=true;
        table.AllowUserToAddRows=false;table.AllowUserToDeleteRows=false;
        table.SelectionMode=DataGridViewSelectionMode.FullRowSelect;table.MultiSelect=false;
        table.RowHeadersVisible=false;table.AutoSizeColumnsMode=DataGridViewAutoSizeColumnsMode.Fill;
        foreach(var title in new[]{"Perfil","Identificador","Estado","Configuración","Marcadores","Cookies"})
            table.Columns.Add(title,title);
        table.Columns[0].FillWeight=175;table.Columns[1].FillWeight=135;
        table.Columns[2].FillWeight=65;
        table.Columns[3].FillWeight=95;table.Columns[4].FillWeight=85;
        table.Columns[5].FillWeight=80;
        var operations=new FlowLayoutPanel{Dock=DockStyle.Bottom,Height=45,WrapContents=false};
        var save=Make("Guardar perfil seleccionado",220);
        save.Click+=async (_,_)=>await SaveSelected();
        var all=Make("Guardar todos",140);
        all.Click+=async (_,_)=>await SaveAll();
        var folder=Make("Abrir archivos",135);
        folder.Click+=(_,_)=>{
            string root=ArchiveRoot();
            Directory.CreateDirectory(root);
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo("explorer.exe"){
                ArgumentList={root},UseShellExecute=true
            });
        };
        operations.Controls.Add(save);operations.Controls.Add(all);operations.Controls.Add(folder);

        var flags=new FlowLayoutPanel{Dock=DockStyle.Bottom,Height=58,FlowDirection=FlowDirection.TopDown,WrapContents=false};
        flags.Controls.Add(auto);
        flags.Controls.Add(includeCookies);
        auto.CheckedChanged+=async (_,_)=>{
            timer.Enabled=auto.Checked;
            if(auto.Checked)await SaveAll();
        };
        includeCookies.CheckedChanged+=(_,_)=>{
            if(!includeCookies.Checked)return;
            if(MessageBox.Show(this,"Las respuestas de cookies pueden contener sesiones privadas. "+
                "Los archivos se guardarán sin cifrado, como solicitaste. "+
                "No los compartas. ¿Permitir esta exportación?",
                "Datos sensibles",MessageBoxButtons.YesNo,MessageBoxIcon.Warning)!=DialogResult.Yes)
                includeCookies.Checked=false;
        };
        timer.Tick+=async (_,_)=>{if(auto.Checked)await SaveAll();};

        notice.Dock=DockStyle.Bottom;notice.Height=72;notice.ForeColor=Color.Khaki;
        notice.Text=Warning+"\nNo se han leído cookies, contraseñas ni tokens. API no conectada.";
        var host=new Panel{Dock=DockStyle.Fill,Padding=new Padding(12)};
        host.Controls.Add(table);host.Controls.Add(operations);
        host.Controls.Add(flags);host.Controls.Add(notice);host.Controls.Add(line);host.Controls.Add(intro);
        Controls.Add(host);
        FormClosed+=(_,_)=>{timer.Stop();key.Text=string.Empty;};
    }
    private static Button Make(string caption,int width)=>new(){
        Text=caption,Width=width,Height=34,Margin=new Padding(3,4,3,3),
        FlatStyle=FlatStyle.Flat,BackColor=Color.FromArgb(17,115,95),ForeColor=Color.White
    };
    private int Port(){
        if(!int.TryParse(port.Text,out int p)||p<1024||p>65535)
            throw new InvalidOperationException("Escribe un puerto local válido (1024–65535).");
        return p;
    }
    private HttpClient Client(){
        if(string.IsNullOrWhiteSpace(key.Text)||key.Text.Length>512)
            throw new InvalidOperationException("Introduce tu clave de API local.");
        // Explicit loopback only; no external hosts, HTTPS downgrade, proxy or redirects.
        var handler=new HttpClientHandler{UseProxy=false,AllowAutoRedirect=false,UseCookies=false};
        var client=new HttpClient(handler){BaseAddress=new Uri("http://127.0.0.1:"+Port()),
            Timeout=TimeSpan.FromSeconds(12)};
        client.DefaultRequestHeaders.Add("X-API-KEY",key.Text);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return client;
    }
    private static (byte[] bytes,JsonDocument json) Parse(byte[] bytes){
        if(bytes.Length>MaxResponse)throw new InvalidDataException("Respuesta API demasiado grande.");
        var doc=JsonDocument.Parse(bytes);
        if(doc.RootElement.ValueKind!=JsonValueKind.Object||
            !doc.RootElement.TryGetProperty("code",out var code)||
            code.ValueKind!=JsonValueKind.Number||code.GetInt32()!=0){
            doc.Dispose();
            throw new InvalidOperationException("API no autorizada, no disponible o respondió con error.");
        }
        return (bytes,doc);
    }
    private static async Task<(byte[],JsonDocument)> Get(HttpClient client,string route){
        using var req=new HttpRequestMessage(HttpMethod.Get,route);
        using var resp=await client.SendAsync(req,HttpCompletionOption.ResponseHeadersRead);
        if(!resp.IsSuccessStatusCode)
            throw new InvalidOperationException("API HTTP "+(int)resp.StatusCode+
                ". Verifica que está habilitada y que tu clave tiene permisos.");
        if(resp.Content.Headers.ContentLength>MaxResponse)
            throw new InvalidDataException("La respuesta excede el límite de tamaño.");
        using var stream=await resp.Content.ReadAsStreamAsync();
        using var memory=new MemoryStream();
        var chunk=new byte[8192];int count;
        while((count=await stream.ReadAsync(chunk))>0){
            if(memory.Length+count>MaxResponse)throw new InvalidDataException("Respuesta demasiado grande.");
            memory.Write(chunk,0,count);
        }
        return Parse(memory.ToArray());
    }
    private static string SafeProfileName(string raw){
        string v=raw.Trim();
        foreach(char c in Path.GetInvalidFileNameChars())v=v.Replace(c,'_');
        v=v.TrimEnd('.',' ');
        if(v.Length>75)v=v[..75];
        if(v.Length==0||v=="."||v==".."||Regex.IsMatch(v,@"^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)",RegexOptions.IgnoreCase))v="_"+v;
        return v;
    }
    private string ArchiveRoot()=>Path.Combine(AccountStore.DirectoryFor(accountId),"ArchivoOriginal","Perfiles");
    private static string FilePrefix(string endpoint)=>endpoint.Replace('/','_').Replace('\\','_');
    private string ProfileFolder(OfficialProfile profile){
        if(!ProfileId.IsMatch(profile.Id))throw new InvalidDataException("ID de perfil no válido.");
        return Path.Combine(ArchiveRoot(),SafeProfileName(profile.Name)+" ["+profile.Id+"]");
    }
    private static string SaveRaw(string directory,string endpoint,byte[] bytes){
        Directory.CreateDirectory(directory);
        string now=DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss-fff");
        string label=FilePrefix(endpoint);
        for(int i=0;i<8;i++){
            string filename=Path.Combine(directory,now+"_"+label+"_"+Convert.ToHexString(RandomNumberGenerator.GetBytes(4)).ToLowerInvariant()+".json");
            try{
                using var stream=new FileStream(filename,FileMode.CreateNew,FileAccess.Write,FileShare.None);
                stream.Write(bytes);return filename;
            }catch(IOException) when(File.Exists(filename)){}
        }
        throw new IOException("No fue posible crear un archivo distinto sin sobrescribir.");
    }
    private async Task Busy(Func<Task> action){
        if(executing)return;
        executing=true;
        try{await action();}
        catch(Exception ex){
            // Never display raw response bytes, secrets or HTTP headers.
            notice.Text="Error: "+ex.Message+
                "\nComprueba el puerto, la autorización y que la API V2 esté disponible.";
        }finally{executing=false;}
    }
    private async Task Reload()=>await Busy(async()=>{
        using var client=Client();
        using var caps=(await Get(client,"/openapi/v2/capabilities")).Item2;
        var data=caps.RootElement.GetProperty("data");
        bool supported=data.TryGetProperty("profiles",out var profilesValue)&&profilesValue.ValueKind==JsonValueKind.True;
        capabilityCookies=data.TryGetProperty("cookies",out var cookies)&&cookies.ValueKind==JsonValueKind.True;
        capabilityBookmarks=data.TryGetProperty("bookmarks",out var bookmarks)&&bookmarks.ValueKind==JsonValueKind.True;
        if(!supported)throw new InvalidOperationException("La API local no declara perfiles disponibles.");
        var answer=await Get(client,"/openapi/v2/profiles?page=1&page_size=100");
        using var json=answer.Item2;
        var list=json.RootElement.GetProperty("data").GetProperty("list");
        profiles.Clear();table.Rows.Clear();
        foreach(var item in list.EnumerateArray()){
            string id=item.TryGetProperty("id",out var i)?i.GetString()??"":"";
            string name=item.TryGetProperty("name",out var n)?n.GetString()??"":"";
            string state=item.TryGetProperty("run_status",out var v)?v.GetString()??"":"";
            if(!ProfileId.IsMatch(id)||string.IsNullOrWhiteSpace(name))continue;
            profiles.Add(new OfficialProfile(id,name,state));
            table.Rows.Add(name,id,state,"Disponible",""+(capabilityBookmarks?"Consultar":"No soportado"),
                capabilityCookies?"Opcional":"No soportado");
        }
        notice.Text=$"API autorizada · {profiles.Count} perfiles (primera página, máximo 100). "+
            $"Cookies: {(capabilityCookies?"admitidas":"no disponibles")}; "+
            $"marcadores: {(capabilityBookmarks?"admitidos":"no disponibles")}.\n"+Warning;
    });
    private async Task SaveSelected()=>await Busy(async()=>{
        if(table.CurrentRow?.Cells[1].Value is not string id)
            throw new InvalidOperationException("Selecciona un perfil primero.");
        var selected=profiles.FirstOrDefault(x=>x.Id==id);
        if(selected is null)throw new InvalidOperationException("Perfil no encontrado.");
        using var client=Client();
        int saved=await SaveProfile(client,selected);
        notice.Text=$"{selected.Name}: {saved} respuestas oficiales guardadas sin modificar y sin cifrado.\n"+Warning;
    });
    private async Task SaveAll()=>await Busy(async()=>{
        using var client=Client();
        if(profiles.Count==0){
            using var caps=(await Get(client,"/openapi/v2/capabilities")).Item2;
            var data=caps.RootElement.GetProperty("data");
            if(!data.TryGetProperty("profiles",out var status)||status.ValueKind!=JsonValueKind.True)
                throw new InvalidOperationException("La API no declara perfiles disponibles.");
            capabilityBookmarks=data.TryGetProperty("bookmarks",out var bm)&&bm.ValueKind==JsonValueKind.True;
            capabilityCookies=data.TryGetProperty("cookies",out var ck)&&ck.ValueKind==JsonValueKind.True;
            using var list=(await Get(client,"/openapi/v2/profiles?page=1&page_size=100")).Item2;
            foreach(var item in list.RootElement.GetProperty("data").GetProperty("list").EnumerateArray()){
                string id=item.TryGetProperty("id",out var i)?i.GetString()??"":"";
                string name=item.TryGetProperty("name",out var n)?n.GetString()??"":"";
                if(ProfileId.IsMatch(id)&&!string.IsNullOrWhiteSpace(name))
                    profiles.Add(new OfficialProfile(id,name,""));
            }
        }
        int written=0,errors=0;
        foreach(var profile in profiles.Take(100)){
            try{written+=await SaveProfile(client,profile);}
            catch(HttpRequestException){errors++;}
            catch(InvalidOperationException){errors++;}
        }
        notice.Text=$"Copias exactas nuevas: {written}. Perfiles con errores: {errors}. "+
            $"Se han consultado {Math.Min(profiles.Count,100)} perfiles.\n"+Warning;
    });
    private async Task<int> SaveProfile(HttpClient client,OfficialProfile p){
        string dir=ProfileFolder(p);
        int total=0;
        var requests=new List<(string,string)>{
            ("detalle","/openapi/v2/profiles/"+p.Id)
        };
        if(capabilityBookmarks)requests.Add(("marcadores","/openapi/v2/profiles/"+p.Id+"/bookmarks"));
        if(capabilityCookies&&includeCookies.Checked)
            requests.Add(("cookies","/openapi/v2/profiles/"+p.Id+"/cookies"));
        foreach(var (label,path) in requests){
            try{
                var response=await Get(client,path);
                using(response.Item2){
                    // Only record SUCCESSFUL JSON, never a login error or token/headers.
                    SaveRaw(dir,label,response.Item1);
                    total++;
                }
            }catch(HttpRequestException){ /* unsupported endpoint or transient host */ }
            catch(InvalidOperationException){ /* unavailable, unapproved, or guarded */ }
        }
        return total;
    }
}
