// DyclokPRO v6.35 — testable, read-only contracts for the official Local API.
// No transport credentials are persisted or copied. Never treat HTTP 200 alone
// as evidence of success: the API also returns business error codes (e.g. 300003).
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace DyclokPRO;

internal sealed class ProviderApiFailure : Exception {
    internal int? ApiCode { get; }
    internal ProviderApiFailure(int? code)
      : base(code is null ? "Respuesta de API sin código válido."
                          : $"La API rechazó la solicitud (código {code}). No se guardaron datos.") {
        ApiCode=code;
    }
}
internal static class OfficialApiContract {
    internal const int MaxProfiles=1000;
    internal const int PageSize=100;
    internal const int MaxPages=10;
    private static readonly Regex Id=new(
        @"^(?:[0-9]{1,25}|[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9-]{27,36})$",
        RegexOptions.IgnoreCase|RegexOptions.CultureInvariant);
    internal static bool ValidProfileId(string? id)=>id is not null&&Id.IsMatch(id);

    // JSON is parsed only to validate; original received bytes are always
    // written as-is. Never serialize, pretty-print or normalize a response.
    internal static JsonDocument RequireSuccess(byte[] received) {
        JsonDocument doc;
        try { doc=JsonDocument.Parse(received); }
        catch(JsonException){throw new ProviderApiFailure(null);}
        if(doc.RootElement.ValueKind!=JsonValueKind.Object ||
           !doc.RootElement.TryGetProperty("code",out var code)||
           code.ValueKind!=JsonValueKind.Number||!code.TryGetInt32(out int value)){
            doc.Dispose();
            throw new ProviderApiFailure(null);
        }
        if(value!=0){
            doc.Dispose();
            throw new ProviderApiFailure(value);
        }
        return doc;
    }
    private static string Value(JsonElement item,string property) {
        return item.TryGetProperty(property,out var el)&&el.ValueKind==JsonValueKind.String
            ?el.GetString()??"": "";
    }
    internal static List<OfficialProfile> ParseProfilesPage(JsonElement envelope){
        if(envelope.ValueKind!=JsonValueKind.Object||
           !envelope.TryGetProperty("data",out var data)||
           data.ValueKind!=JsonValueKind.Object||
           !data.TryGetProperty("list",out var list)||
           list.ValueKind!=JsonValueKind.Array)
            throw new InvalidDataException("API de perfiles: falta data.list.");
        var parsed=new List<OfficialProfile>();
        foreach(var entry in list.EnumerateArray()){
            if(entry.ValueKind!=JsonValueKind.Object)continue;
            string id=Value(entry,"id");
            string name=Value(entry,"name").Trim();
            if(!ValidProfileId(id)||name.Length is <1 or >300)continue;
            string status=Value(entry,"run_status");
            if(string.IsNullOrWhiteSpace(status))status=Value(entry,"operate_status");
            parsed.Add(new OfficialProfile(id,name,status));
        }
        return parsed;
    }
    internal static bool HasMorePages(JsonElement envelope,int page,int pageCount){
        if(page>=MaxPages||pageCount==0)return false;
        if(envelope.TryGetProperty("next",out var next)){
            if(next.ValueKind==JsonValueKind.Null)return false;
            if(next.ValueKind==JsonValueKind.False)return false;
        }
        // Some desktop versions omit a "next" field but support page/page_size.
        return pageCount>=PageSize;
    }
    internal static string SafeFolderName(string raw){
        string value=raw.Trim();
        foreach(var c in Path.GetInvalidFileNameChars())
            value=value.Replace(c,'_');
        value=value.TrimEnd('.',' ');
        if(value.Length>75)value=value[..75];
        if(string.IsNullOrEmpty(value)||value is "." or ".." ||
            Regex.IsMatch(value,@"^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)",
             RegexOptions.IgnoreCase|RegexOptions.CultureInvariant))
            value="_"+value;
        return value;
    }
    internal static string ProfileDirectoryName(OfficialProfile profile){
        if(!ValidProfileId(profile.Id))throw new InvalidDataException("ID de perfil inválido.");
        return SafeFolderName(profile.Name)+" ["+profile.Id+"]";
    }
    internal static string MetadataOnly(JsonElement envelope){
        if(!envelope.TryGetProperty("data",out var data)||
           data.ValueKind!=JsonValueKind.Object)
            return "El servidor no proporcionó datos de perfil reconocibles.";
        string id=Value(data,"id"),name=Value(data,"name");
        bool proxy=data.TryGetProperty("proxy_binding",out var p)&&p.ValueKind==JsonValueKind.Object;
        bool fingerprint=data.TryGetProperty("fingerprint",out var f)&&f.ValueKind==JsonValueKind.Object;
        bool advanced=data.TryGetProperty("advanced",out var a)&&a.ValueKind==JsonValueKind.Object;
        bool account=data.TryGetProperty("account_list",out var ac)&&ac.ValueKind==JsonValueKind.Array;
        // We deliberately never print values from proxy, fingerprint, cookie,
        // platform accounts, passwords, or any protected storage object.
        return "Perfil identificado: "+(ValidProfileId(id)?"sí":"no")+
            "\nNombre informado: "+(!string.IsNullOrWhiteSpace(name)?"sí":"no")+
            "\nConfiguración proxy: "+(proxy?"objeto presente":"no confirmada")+
            "\nHuella digital: "+(fingerprint?"objeto presente":"no confirmada")+
            "\nParámetros avanzados: "+(advanced?"objeto presente":"no confirmados")+
            "\nLista de cuentas vinculadas: "+(account?"presente":"no confirmada")+
            "\nCookies: no consultadas en este diagnóstico"+
            "\nMarcadores: no consultados en este diagnóstico"+
            "\nLocalStorage e IndexedDB físicos: no disponibles por esta consulta.";
    }
    internal static void SelfTest(){
        const string ident="2097722254089396228";
        byte[] valid=Encoding.UTF8.GetBytes(
            "{\"code\":0,\"data\":{\"list\":[{\"id\":\""+ident+"\",\"name\":\"1#KAIZEN/FLOW-ULTRA\",\"run_status\":\"running\"}]},\"next\":null}");
        using(var doc=RequireSuccess(valid)){
            var list=ParseProfilesPage(doc.RootElement);
            if(list.Count!=1 || list[0].Name!="1#KAIZEN/FLOW-ULTRA"||
               ProfileDirectoryName(list[0])!="1#KAIZEN_FLOW-ULTRA ["+ident+"]"||
               HasMorePages(doc.RootElement,1,1))
                throw new InvalidDataException("El nombre, ID o paginación del perfil cambió.");
        }
        // Documented Local V1 returns operate_status rather than run_status.
        byte[] v1=Encoding.UTF8.GetBytes(
            "{\"code\":0,\"data\":{\"list\":[{\"id\":\""+ident+"\",\"name\":\"Perfil oficial\",\"operate_status\":\"ENABLED\"}],\"total\":1}}");
        using(var v1Doc=RequireSuccess(v1)){
            var list=ParseProfilesPage(v1Doc.RootElement);
            if(list.Count!=1||list[0].Name!="Perfil oficial"||list[0].Status!="ENABLED"||
               HasMorePages(v1Doc.RootElement,1,list.Count))
                throw new InvalidDataException("La API local V1 devolvió un contrato incompatible.");
        }
        byte[] rejected=Encoding.UTF8.GetBytes("{\"code\":300003,\"msg\":\"sesión inválida\",\"data\":null}");
        try{
            using var unexpected=RequireSuccess(rejected);
            throw new InvalidDataException("300003 no debe considerarse una respuesta correcta.");
        }catch(ProviderApiFailure ex)when(ex.ApiCode==300003){}
        byte[] detail=Encoding.UTF8.GetBytes(
            "{\"code\":0,\"data\":{\"id\":\""+ident+"\",\"proxy_binding\":{\"password\":\"NO_REVELAR\"},\"account_list\":[{\"secret\":\"NO_REVELAR\"}]}}");
        using(var doc=RequireSuccess(detail)){
            var summary=MetadataOnly(doc.RootElement);
            if(summary.Contains("NO_REVELAR")||summary.Contains("password"))
                throw new InvalidDataException("Se revelaron secretos en el diagnóstico.");
        }
        if(!ValidProfileId(ident)||ValidProfileId("open_detail"))
            throw new InvalidDataException("Clasificación insegura de ID/operación.");
        if(Encoding.UTF8.GetString(valid).Contains("code")==false)
            throw new InvalidDataException("Bytes originales alterados.");
    }
}
