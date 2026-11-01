// DyclokPRO v6.35 — opt-in read-only official DICloak Local API V2.
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
    private bool capabilityCookies=false,capabilityBookmarks=false,capabilityFingerprint=false;
    // The documented Local API V1 is preferred. V2 is attempted only when V1
    // reports that its endpoint is unavailable, never after an auth rejection.
    private bool usingLocalV1=true;
    private int failures=0,autoCursor=0;
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
            Text="API local oficial de DICloak (V1 documentada, V2 si está disponible). Inicia sesión en DICloak antes de conectar.",
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
            "Si tu cliente no habilita la API local, el diagnóstico mostrará el error sin modificar la sesión.",
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
        all.Click+=async (_,_)=>await SaveAll(false);
        var folder=Make("Abrir archivos",135);
        var rename=Make("Nombre de cuenta (API)",183);
        var inspect=Make("Diagnóstico perfil",151);
        inspect.Click+=async (_,_)=>await InspectSelected();
        rename.Click+=async (_,_)=>await SyncAccountName();
        folder.Click+=(_,_)=>{
            string root=ArchiveRoot();
            Directory.CreateDirectory(root);
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo("explorer.exe"){
                ArgumentList={root},UseShellExecute=true
            });
        };
        operations.Controls.Add(save);operations.Controls.Add(all);operations.Controls.Add(folder);operations.Controls.Add(rename);operations.Controls.Add(inspect);

        var flags=new FlowLayoutPanel{Dock=DockStyle.Bottom,Height=58,FlowDirection=FlowDirection.TopDown,WrapContents=false};
        flags.Controls.Add(auto);
        flags.Controls.Add(includeCookies);
        auto.CheckedChanged+=async (_,_)=>{
            timer.Enabled=auto.Checked;
            if(auto.Checked)await SaveAll(true);
        };
        includeCookies.CheckedChanged+=(_,_)=>{
            if(!includeCookies.Checked)return;
            if(MessageBox.Show(this,"Las respuestas de cookies pueden contener sesiones privadas. "+
                "Los archivos se guardarán sin cifrado, como solicitaste. "+
                "No los compartas. ¿Permitir esta exportación?",
                "Datos sensibles",MessageBoxButtons.YesNo,MessageBoxIcon.Warning)!=DialogResult.Yes)
                includeCookies.Checked=false;
        };
        timer.Tick+=async (_,_)=>{if(auto.Checked)await SaveAll(true);};

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
        if(bytes.Length>MaxResponse)throw new InvalidDataException("Respuesta demasiado grande.");
        // Original bytes are never rewritten, but the business code must be 0.
        return (bytes,OfficialApiContract.RequireSuccess(bytes));
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
        return Path.Combine(ArchiveRoot(),OfficialApiContract.ProfileDirectoryName(profile));
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
                "\nComprueba el puerto, la autorización y que la API local esté disponible.";
        }finally{executing=false;}
    }
    private static bool IsAbsentEndpoint(InvalidOperationException ex)=>
        ex.Message.StartsWith("API HTTP 404.",StringComparison.Ordinal) ||
        ex.Message.StartsWith("API HTTP 405.",StringComparison.Ordinal) ||
        ex.Message.StartsWith("API HTTP 501.",StringComparison.Ordinal);

    private async Task LoadProfiles(HttpClient client){
        // Do not turn HTTP 401/403, code=300003 or other provider errors into
        // permission fallbacks. Switching endpoints cannot repair authentication.
        try{
            await LoadProfilesV1(client);
            usingLocalV1=true;
        }catch(InvalidOperationException ex) when(IsAbsentEndpoint(ex)){
            await LoadProfilesV2(client);
            usingLocalV1=false;
        }
    }
    private async Task LoadProfilesV1(HttpClient client){
        var loaded=new List<OfficialProfile>();
        var seen=new HashSet<string>(StringComparer.Ordinal);
        for(int page=1;page<=OfficialApiContract.MaxPages;page++){
            var response=await Get(client,"/openapi/v1/env/list?page_no="+page+
                "&page_size="+OfficialApiContract.PageSize);
            using(response.Item2){
                var current=OfficialApiContract.ParseProfilesPage(response.Item2.RootElement);
                foreach(var p in current)if(seen.Add(p.Id))loaded.Add(p);
                if(!OfficialApiContract.HasMorePages(response.Item2.RootElement,page,current.Count))break;
            }
            await Task.Delay(120);
        }
        // Local V1 profile lists may contain sensitive fields. Only the small
        // projected ID/name/status structures above are kept, never raw JSON.
        profiles.Clear();profiles.AddRange(loaded);
        capabilityCookies=false;capabilityBookmarks=false;capabilityFingerprint=false;
    }
    private async Task LoadProfilesV2(HttpClient client){

            using(var caps=(await Get(client,"/openapi/v2/capabilities")).Item2){
                var data=caps.RootElement.GetProperty("data");
                if(!data.TryGetProperty("profiles",out var cap)||cap.ValueKind!=JsonValueKind.True)
                    throw new InvalidOperationException("La API no declara disponibilidad de perfiles.");
                capabilityCookies=data.TryGetProperty("cookies",out var c)&&c.ValueKind==JsonValueKind.True;
                capabilityBookmarks=data.TryGetProperty("bookmarks",out var b)&&b.ValueKind==JsonValueKind.True;
                capabilityFingerprint=data.TryGetProperty("fingerprints",out var f)&&f.ValueKind==JsonValueKind.True;
            }
            profiles.Clear();
            var seen=new HashSet<string>(StringComparer.Ordinal);
            for(int page=1;page<=OfficialApiContract.MaxPages;page++){
                var response=await Get(client,"/openapi/v2/profiles?page="+page+
                    "&page_size="+OfficialApiContract.PageSize);
                using(response.Item2){
                    var current=OfficialApiContract.ParseProfilesPage(response.Item2.RootElement);
                    foreach(var p in current){
                        if(seen.Add(p.Id))profiles.Add(p);
                    }
                    if(!OfficialApiContract.HasMorePages(response.Item2.RootElement,page,current.Count))break;
                }
                // Keep the authorized Local API responsive and avoid over-querying.
                await Task.Delay(120);
            }
        }
    private async Task Reload()=>await Busy(async()=>{
        using var client=Client();
        await LoadProfiles(client);
        table.Rows.Clear();
        foreach(var p in profiles){
            table.Rows.Add(p.Name,p.Id,p.Status,"Consultar",
                capabilityBookmarks?"API permite consultar":"No soportado",
                capabilityCookies?"Requiere autorización":"No soportado");
        }
        notice.Text=$"API local {(usingLocalV1?"V1":"V2")} autorizada · {profiles.Count} perfiles encontrados. "+
            (usingLocalV1
                ?"V1: solo lista segura de nombres, IDs y estado; archivado de detalles deshabilitado."
                :$"Huellas: {(capabilityFingerprint?"consulta admitida":"no soportada")}; "+
                 "cookies y marcadores: capacidad declarada, contenidos NO verificados.")+
            "\n"+Warning;
    });
    private async Task InspectSelected()=>await Busy(async()=>{
        if(table.CurrentRow?.Cells[1].Value is not string id||
           !OfficialApiContract.ValidProfileId(id))
            throw new InvalidOperationException("Selecciona un perfil válido.");
        if(usingLocalV1){
            var p=profiles.FirstOrDefault(x=>x.Id==id)??throw new InvalidOperationException("Perfil no encontrado.");
            MessageBox.Show(this,"Nombre: "+p.Name+"\nID: "+p.Id+"\nEstado: "+p.Status+
                "\n\nDiagnóstico limitado a la lista oficial V1, sin consultar datos privados.",
                "Diagnóstico de perfil — API V1",MessageBoxButtons.OK,MessageBoxIcon.Information);
            return;
        }
        using var client=Client();
        var response=await Get(client,"/openapi/v2/profiles/"+id);
        using(response.Item2){
            string text=OfficialApiContract.MetadataOnly(response.Item2.RootElement);
            MessageBox.Show(this,text+"\n\nLa presencia de datos en la API no equivale "+
                "a los ficheros completos de Chromium ni garantiza que se hayan descargado cookies.",
                "Diagnóstico de perfil — sin secretos",
                MessageBoxButtons.OK,MessageBoxIcon.Information);
        }
    });
    private async Task SaveSelected()=>await Busy(async()=>{
        if(table.CurrentRow?.Cells[1].Value is not string id)
            throw new InvalidOperationException("Selecciona un perfil primero.");
        var selected=profiles.FirstOrDefault(x=>x.Id==id);
        if(selected is null)throw new InvalidOperationException("Perfil no encontrado.");
        if(usingLocalV1)throw new InvalidOperationException("La API V1 documentada no ofrece aquí un endpoint seguro de archivado de detalles. Se conserva la lista solo en memoria.");
        using var client=Client();
        failures=0;
        int saved=await SaveProfile(client,selected);
        notice.Text=$"{selected.Name}: {saved} respuestas guardadas; {failures} consultas no disponibles o fallidas.\n"+Warning;
    });
    private async Task SaveAll(bool periodic)=>await Busy(async()=>{
        using var client=Client();
        if(profiles.Count==0)await LoadProfiles(client);
        if(profiles.Count==0)throw new InvalidOperationException("No hay perfiles válidos en la API.");
        if(usingLocalV1){auto.Checked=false;timer.Stop();
            throw new InvalidOperationException("La API local V1 se limita a consultar perfiles; el archivado V2 no está habilitado.");}
        failures=0;
        int written=0,selected=periodic?Math.Min(10,profiles.Count):profiles.Count;
        for(int i=0;i<selected;i++){
            var p=periodic?profiles[(autoCursor+i)%profiles.Count]:profiles[i];
            try { written+=await SaveProfile(client,p); }
            catch(ProviderApiFailure ex) when(ex.ApiCode==300003){
                // A session rejection must stop automatic polling. Never
                // reclassify this JSON response as a successful archive.
                auto.Checked=false;timer.Stop();
                throw;
            }
            catch(ProviderApiFailure){failures++;}
            catch(HttpRequestException){failures++;}
            if(!periodic)await Task.Delay(130);
        }
        if(periodic)autoCursor=(autoCursor+selected)%profiles.Count;
        notice.Text=$"Respuestas originales guardadas: {written}; consultas fallidas: {failures}. "+
            $"Perfiles consultados: {selected}/{profiles.Count}."+
            (periodic?" Modo periódico: 10 perfiles por ciclo.":"")+"\n"+Warning;
    });
    private async Task<int> SaveProfile(HttpClient client,OfficialProfile p){
        string dir=ProfileFolder(p);
        int total=0;
        var requests=new List<(string,string)>{
            ("detalle","/openapi/v2/profiles/"+p.Id)
        };
        if(capabilityFingerprint)
            requests.Add(("huella","/openapi/v2/profiles/"+p.Id+"/fingerprint"));
        if(capabilityBookmarks)
            requests.Add(("marcadores","/openapi/v2/profiles/"+p.Id+"/bookmarks"));
        if(capabilityCookies&&includeCookies.Checked)
            requests.Add(("cookies","/openapi/v2/profiles/"+p.Id+"/cookies"));
        foreach(var (label,route) in requests){
            try{
                var response=await Get(client,route);
                using(response.Item2){
                    // The JSON envelope is verified as code=0 before writing.
                    // SaveRaw writes EXACT bytes returned by the local API.
                    SaveRaw(dir,label,response.Item1);
                    total++;
                }
            }catch(ProviderApiFailure ex) when(ex.ApiCode==300003){
                auto.Checked=false;timer.Stop();
                throw; // preserve a single visible, redacted API error
            }
            catch(ProviderApiFailure){failures++;}
            catch(HttpRequestException){failures++;}
            catch(InvalidOperationException){failures++;}
            await Task.Delay(130);
        }
        return total;
    }
    // Older official Local API V1 documents /v1/members plus X-API-KEY.
    // It is optional; never infer a login identity from a profile's name.
    // Only a uniquely marked current_user may rename a DyclokPRO tab.
    private async Task SyncAccountName()=>await Busy(async()=>{
        using var client=Client();
        var result=await Get(client,"/openapi/v1/members?all=true");
        using var doc=result.Item2;
        var data=doc.RootElement.GetProperty("data");
        if(!data.TryGetProperty("list",out var list)||list.ValueKind!=JsonValueKind.Array)
            throw new InvalidOperationException("La API no devolvió una lista de miembros.");
        var current=new List<string>();
        foreach(var member in list.EnumerateArray()){
            if(member.TryGetProperty("current_user",out var marker)&&marker.ValueKind==JsonValueKind.True&&
               member.TryGetProperty("name",out var n)&&n.ValueKind==JsonValueKind.String){
                string val=n.GetString()?.Trim()??"";
                if(val.Length is >=2 and <=80&&!val.Any(char.IsControl))current.Add(val);
            }
        }
        if(current.Count!=1)
            throw new InvalidOperationException("No se encontró un único miembro actual. No se cambió el nombre de la cuenta.");
        if(MessageBox.Show(this,
           "La API autorizada identifica al miembro actual como:\n"+current[0]+
           "\n\n¿Actualizar el nombre visible de esta cuenta en DyclokPRO? "+
           "No se modificarán credenciales ni perfiles.",
           "Nombre del usuario",MessageBoxButtons.YesNo,MessageBoxIcon.Question)!=DialogResult.Yes)return;
        AccountStore.SaveName(accountId,current[0]);
        notice.Text="Nombre actualizado desde miembro actual de la API autorizada. "+
            "Los archivos y la sesión no se alteraron.";
    });
}
