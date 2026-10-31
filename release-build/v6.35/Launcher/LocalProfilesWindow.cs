// DyclokPRO v6.35 - external local profile manager: never deletes
// native Chromium databases; use Windows Explorer for file operations.
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
namespace DyclokPRO;
internal sealed class LocalProfilesWindow:Form {
    private readonly string account;
    private readonly DataGridView grid=new();
    private readonly Label note=new();
    private sealed record Folder(string Name,string Type,string Path);
    internal LocalProfilesWindow(string id,string accountName){
        account=id;
        Text="Perfiles locales · "+accountName;
        Width=850;Height=550;MinimumSize=new Size(650,400);
        StartPosition=FormStartPosition.CenterScreen;
        Font=new Font("Segoe UI",10);BackColor=Color.FromArgb(16,36,45);ForeColor=Color.White;
        var heading=new Label{Text="Administrador de perfiles locales (solo lectura)",
            Dock=DockStyle.Top,Height=44,Font=new Font("Segoe UI",13,FontStyle.Bold)};
        var help=new Label{Dock=DockStyle.Top,Height=67,ForeColor=Color.Khaki,
            Text="Muestra las carpetas antiguas y actuales asociadas a esta cuenta. "+
            "No copia ni modifica sesiones activas. Los datos de Chromium pertenecen "+
            "al navegador y no deben alterarse mientras esté abierto."};
        grid.Dock=DockStyle.Fill;grid.ReadOnly=true;grid.AllowUserToAddRows=false;
        grid.AllowUserToDeleteRows=false;grid.RowHeadersVisible=false;
        grid.BackgroundColor=Color.FromArgb(25,44,53);grid.ForeColor=Color.Black;
        grid.MultiSelect=false;grid.SelectionMode=DataGridViewSelectionMode.FullRowSelect;
        grid.AutoSizeColumnsMode=DataGridViewAutoSizeColumnsMode.Fill;
        grid.Columns.Add("name","Carpeta");grid.Columns.Add("kind","Tipo de datos");
        grid.Columns.Add("count","Archivos");grid.Columns.Add("size","Tamaño aprox.");
        grid.Columns[0].FillWeight=170;grid.Columns[1].FillWeight=135;
        grid.CellDoubleClick+=(_,_)=>Open();
        var buttons=new FlowLayoutPanel{Dock=DockStyle.Bottom,Height=48};
        foreach(var (text,action) in new (string,Action)[]{
            ("Actualizar",Reload),("Abrir selección",Open),("Abrir carpeta Cuentas",()=>OpenDirectory(AccountStore.Root))
        }){
            var b=new Button{Text=text,AutoSize=true,Height=37,FlatStyle=FlatStyle.Flat,
                BackColor=Color.FromArgb(27,99,82),ForeColor=Color.White};
            b.Click+=(_,_)=>action();buttons.Controls.Add(b);
        }
        note.Dock=DockStyle.Bottom;note.Height=55;
        var panel=new Panel{Dock=DockStyle.Fill,Padding=new Padding(12)};
        panel.Controls.Add(grid);panel.Controls.Add(note);panel.Controls.Add(buttons);
        panel.Controls.Add(help);panel.Controls.Add(heading);
        Controls.Add(panel);Shown+=(_,_)=>Reload();
    }
    private static IEnumerable<Folder> Known(string id){
        string root=AccountStore.DirectoryFor(id);
        string archives=Path.Combine(root,"ArchivoOriginal","Perfiles");
        if(Directory.Exists(archives)){
            foreach(string path in Directory.EnumerateDirectories(archives)){
                if(File.GetAttributes(path).HasFlag(FileAttributes.ReparsePoint))continue;
                yield return new Folder(System.IO.Path.GetFileName(path),"Archivo antiguo por perfil",path);
            }
        }
        string old=Path.Combine(root,"Electron");
        if(Directory.Exists(old))yield return new Folder("Electron","Sesión antigua DyclokPRO",old);
        string current=Path.Combine(root,"Engine307");
        if(Directory.Exists(current))yield return new Folder("Engine307","Sesión motor oficial 3.0.7",current);
    }
    private static (int files,long bytes) Estimate(string path){
        int count=0;long total=0;
        var pending=new Stack<string>();pending.Push(path);
        while(pending.Count>0&&count<25000){
            string folder=pending.Pop();string[] paths;
            try{paths=Directory.GetFileSystemEntries(folder);}
            catch(IOException){continue;}catch(UnauthorizedAccessException){continue;}
            foreach(string f in paths){
                try{
                    var flags=File.GetAttributes(f);
                    if(flags.HasFlag(FileAttributes.ReparsePoint))continue;
                    if(flags.HasFlag(FileAttributes.Directory)){pending.Push(f);continue;}
                    var info=new FileInfo(f);count++;total+=info.Length;
                    if(count>=25000)break;
                }catch(IOException){}catch(UnauthorizedAccessException){}
            }
        }
        return (count,total);
    }
    private void Reload(){
        grid.Rows.Clear();int rows=0;
        foreach(var data in Known(account).Take(80)){
            var stats=Estimate(data.Path);
            int index=grid.Rows.Add(data.Name,data.Type,stats.files,stats.bytes>1048576?
                $"{stats.bytes/1048576d:0.0} MB":$"{stats.bytes/1024d:0.0} KB");
            grid.Rows[index].Tag=data.Path;rows++;
        }
        note.Text=$"Carpetas visibles: {rows}. El recuento se limita a 25 000 archivos por carpeta."+
            "\nNo se toca el estado de sesión; la sincronización la gestiona el navegador oficial.";
    }
    private void Open(){
        if(grid.CurrentRow?.Tag is string p)OpenDirectory(p);
        else MessageBox.Show(this,"Selecciona una carpeta de la tabla.");
    }
    private void OpenDirectory(string p){
        if(!Directory.Exists(p))return;
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo("explorer.exe"){
            ArgumentList={p},UseShellExecute=true
        });
    }
}