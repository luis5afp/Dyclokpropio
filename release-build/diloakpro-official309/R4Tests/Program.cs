using System;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using DiloakPRO.Diagnostico;

static class Program
{
    const string Phrase = "SOLO-CLAVES-DE-PRUEBA-2026";
    static readonly byte[] AAD=Encoding.ASCII.GetBytes("diloakpro-r4-authorized-lab-v1");
    static async Task Main()
    {
        var temp = Path.Combine(Path.GetTempPath(),"diloakpro-r4-test-"+Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(temp);
        try
        {
            bool throwsInvalidHttp = false;
            try { R4LabCapture.ValidateOrigin("http://example.org"); }
            catch (ArgumentException) { throwsInvalidHttp=true; }
            Assert(throwsInvalidHttp,"Refuse non-loopback HTTP");
            bool throwsThirdParty = false;
            try { R4LabCapture.ValidateOrigin("https://gin-server.dicloak.net"); }
            catch (ArgumentException) { throwsThirdParty=true; }
            Assert(throwsThirdParty,"Exclude third-party endpoints");
            Assert(R4LabCapture.ValidateOrigin("http://127.0.0.1:8765").Port==8765,
                "Loopback test accepted");
            await Scenario(temp,false,true);
            await Scenario(temp,true,true);
            await Scenario(temp,true,false);
            await Scenario(temp,false,null);
            Console.WriteLine("PASS: R4 exact JSON body, gzip, incorrect SHA, missing SHA, AES-GCM roundtrip.");
        }
        finally {Directory.Delete(temp,true);}
    }

    static async Task Scenario(string root,bool gzip,bool? validProof)
    {
        var plaintext=Encoding.UTF8.GetBytes(
            "{\"credentials\":{\"password\":\"FAKE\"},\"cookies\":[{\"value\":\"TEST\"}],\"proxy\":\"fake\"}\n");
        byte[] body;
        if(gzip)
        {
            using var compressed=new MemoryStream();
            using(var zip=new GZipStream(compressed,CompressionLevel.Optimal,leaveOpen:true))
                zip.Write(plaintext);
            body=compressed.ToArray();
        }
        else body=plaintext;

        using var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        int port=((IPEndPoint)listener.LocalEndpoint).Port;
        string expectedSha=Convert.ToHexString(SHA256.HashData(body)).ToLowerInvariant();
        string? serverSha = validProof == true ? expectedSha :
                            validProof == false ? new string('0',64) : null;
        var task=Task.Run(async()=>
        {
            using var client=await listener.AcceptTcpClientAsync();
            using var stream=client.GetStream();
            var req=new byte[8192];
            await stream.ReadAsync(req);
            var headers="HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n" +
                (gzip?"Content-Encoding: gzip\r\n":"") +
                "Content-Length: "+body.Length+"\r\n" +
                (serverSha!=null ? "X-Diloakpro-Body-SHA256: "+serverSha+"\r\n" : "") +
                "Connection: close\r\n\r\n";
            await stream.WriteAsync(Encoding.ASCII.GetBytes(headers));
            await stream.WriteAsync(body);
            await stream.FlushAsync();
        });
        var proof=await R4LabCapture.CaptureAsync("http://127.0.0.1:"+port,
            "/json",Phrase,root);
        await task;
        Assert(proof.Bytes==body.Length,"byte count unchanged");
        Assert(proof.ClientSha256==expectedSha,"sha from same raw entity bytes");
        Assert(proof.BytesMatchServerProof==validProof,"correct server-provided proof verdict");
        Assert(!proof.ChromiumReceivedThisResponse,"never overclaim DICloak interception");
        var file=Path.Combine(root,"LabCaptures",proof.EncryptedFile);
        var data=File.ReadAllBytes(file);
        Assert(Encoding.ASCII.GetString(data,0,8)=="DPL30901","versioned encryption envelope");
        Assert(!data.AsSpan().SequenceEqual(body),"not stored plaintext");
        var salt=data.AsSpan(8,16);
        var nonce=data.AsSpan(24,12);
        var tag=data.AsSpan(36,16);
        var ciphertext=data.AsSpan(52);
        var key=Rfc2898DeriveBytes.Pbkdf2(Phrase,salt,220_000,HashAlgorithmName.SHA256,32);
        var decrypted=new byte[ciphertext.Length];
        using(var aes=new AesGcm(key,16))
            aes.Decrypt(nonce,ciphertext,tag,decrypted,AAD);
        Assert(decrypted.AsSpan().SequenceEqual(body),"AES-GCM decrypts exactly same bytes");
    }

    static void Assert(bool value,string message)
    {
        if(!value)throw new Exception("FAIL: "+message);
    }
}
