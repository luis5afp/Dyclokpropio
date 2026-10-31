// DyclokPRO v6.35 — local archive inspector only.
// No HTTP interception, decryption, cookie/token reading, or modifications.
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
namespace DyclokPRO;
internal sealed class ArchiveAuditWindow:Form{
  private readonly string root;
  private readonly string accountId;
  private readonly DataGridView grid=new();
  private readonly Label status=new();
  internal ArchiveAuditWindow(string id,string displayName){
    accountId=id;
    root=Path.Combine(AccountStore.DirectoryFor(id),"ArchivoOriginal","Perfiles");
    Text="Archivos guardados · "+displayName;
    Width=920;Height=580;MinimumSize=new Size(720,420);
    StartPosition=FormStartPosition.CenterParent;
    BackColor=Color.FromArgb(16,32,40);ForeColor=Color.White;
    Font=new Font("Segoe UI",10);
    var heading=new Label{
      Text="Diagnóstico local por perfil · Solo lectura",
      Dock=DockStyle.Top,Height=45,
      Font=new Font("Segoe UI",14,FontStyle.Bold)
    };
    var warning=new Label{
      Text="Este panel solo cuenta archivos ya guardados en Windows. No lee contraseñas, valores de cookies ni tokens. "+
        "Una respuesta JSON no equivale a los archivos originales de Chromium.",
      Dock=DockStyle.Top,Height=57,ForeColor=Color.Khaki
    };
    grid.Dock=DockStyle.Fill;grid.BackgroundColor=Color.FromArgb(25,42,51);
    grid.ForeColor=Color.Black;grid.RowHeadersVisible=false;
    grid.AllowUserToAddRows=false;grid.AllowUserToDeleteRows=false;
    grid.ReadOnly=true;grid.MultiSelect=false;
    grid.SelectionMode=DataGridViewSelectionMode.FullRowSelect;
    grid.AutoSizeColumnsMode=DataGridViewAutoSizeColumnsMode.Fill;
    foreach(string name in new[]{"Perfil / carpeta","JSON","ENC antiguos","DB locales","Otros","Tamaño","Última modificación"})
      grid.Columns.Add(name,name);
    grid.Columns[0].FillWeight=210;
    grid.Columns[1].FillWeight=60;grid.Columns[2].FillWeight=70;
    grid.Columns[3].FillWeight=75;grid.Columns[4].FillWeight=60;
    grid.Columns[5].FillWeight=90;grid.Columns[6].FillWeight=140;
    grid.CellDoubleClick+=(_,_)=>OpenSelected();
    status.Dock=DockStyle.Bottom;status.Height=55;status.AutoEllipsis=true;
    var actions=new FlowLayoutPanel{Dock=DockStyle.Bottom,Height=49,WrapContents=false};
    Button refresh=Make("Actualizar"),open=Make("Abrir perfil"),folder=Make("Abrir carpeta principal"),export=Make("Exportar .enc originales");
    refresh.Click+=(_,_)=>Reload();
    open.Click+=(_,_)=>OpenSelected();
    folder.Click+=(_,_)=>OpenFolder(root);
    export.Click+=(_,_)=>ExportEncrypted();
    actions.Controls.Add(refresh);actions.Controls.Add(open);actions.Controls.Add(folder);actions.Controls.Add(export);
    var panel=new Panel{Dock=DockStyle.Fill,Padding=new Padding(14)};
    panel.Controls.Add(grid);panel.Controls.Add(status);panel.Controls.Add(actions);
    panel.Controls.Add(warning);panel.Controls.Add(heading);
    Controls.Add(panel);Shown+=(_,_)=>Reload();
  }
  private static Button Make(string label)=>new(){
    Text=label,AutoSize=true,MinimumSize=new Size(138,34),
    BackColor=Color.FromArgb(21,106,85),ForeColor=Color.White,
    FlatStyle=FlatStyle.Flat,Margin=new Padding(0,3,10,3)
  };
  private static string SizeText(long bytes)=>bytes>=1048576
    ?$"{bytes/1048576d:0.0} MB":bytes>=1024
    ?$"{bytes/1024d:0.0} KB":$"{bytes} B";
  private static IEnumerable<FileInfo> Walk(string top,int max){
    var directories=new Stack<string>();directories.Push(top);
    int found=0;
    while(directories.Count>0&&found<max){
      var current=directories.Pop();
      string[] entries;
      try{entries=Directory.GetFileSystemEntries(current);}
      catch(IOException){continue;}catch(UnauthorizedAccessException){continue;}
      foreach(var entry in entries){
        FileAttributes attr;
        try{attr=File.GetAttributes(entry);}
        catch(IOException){continue;}catch(UnauthorizedAccessException){continue;}
        if(attr.HasFlag(FileAttributes.ReparsePoint))continue;
        if(attr.HasFlag(FileAttributes.Directory)){directories.Push(entry);continue;}
        var file=new FileInfo(entry);
        if(!file.Exists)continue;
        found++;yield return file;
        if(found>=max)yield break;
      }
    }
  }
  private void Reload(){
    grid.Rows.Clear();
    if(!Directory.Exists(root)){
      status.Text="No hay carpeta de archivos guardados para esta cuenta. No se crearon archivos.";
      return;
    }
    int folders=0,jCount=0,eCount=0,dCount=0,oCount=0;
    long total=0;
    foreach(var folder in Directory.EnumerateDirectories(root)
      .OrderBy(x=>Path.GetFileName(x),StringComparer.OrdinalIgnoreCase)){
      if(File.GetAttributes(folder).HasFlag(FileAttributes.ReparsePoint))continue;
      int json=0,enc=0,db=0,other=0;long bytes=0;
      DateTime last=DateTime.MinValue;
      foreach(var file in Walk(folder,4000)){
        string ext=file.Extension.ToLowerInvariant();
        if(ext==".json")json++;
        else if(ext==".enc")enc++;
        else if(ext is ".db" or ".sqlite" or ".sqlite3" or ".ldb")db++;
        else other++;
        bytes+=file.Length;
        if(file.LastWriteTime>last)last=file.LastWriteTime;
      }
      int row=grid.Rows.Add(Path.GetFileName(folder),json,enc,db,other,
        SizeText(bytes),last==DateTime.MinValue?"—":last.ToString("yyyy-MM-dd HH:mm"));
      grid.Rows[row].Tag=folder;
      folders++;jCount+=json;eCount+=enc;dCount+=db;oCount+=other;total+=bytes;
    }
    status.Text=$"Cuenta: {accountId} · Carpetas: {folders} · JSON: {jCount} · ENC: {eCount} · DB: {dCount} · Otros: {oCount} · Total: {SizeText(total)}\n"+
      "No se descifran archivos ni se comprueba su contenido; un registro local no garantiza una descarga completa del servidor.";
  }
  private void OpenSelected(){
    if(grid.CurrentRow?.Tag is string folder)OpenFolder(folder);
    else MessageBox.Show(this,"Selecciona una carpeta de perfil.","Archivos guardados");
  }
  private void OpenFolder(string location){
    if(!Directory.Exists(location)){
      MessageBox.Show(this,"La carpeta no existe.","Archivos guardados");return;
    }
    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo("explorer.exe"){
      ArgumentList={location},UseShellExecute=true
    });
  }
  private void ExportEncrypted(){
    if(!Directory.Exists(root)){
      MessageBox.Show(this,"No hay archivos anteriores para exportar.");return;
    }
    var source=grid.CurrentRow?.Tag as string;
    if(source is null){
      MessageBox.Show(this,"Selecciona la carpeta de un perfil en la tabla.");return;
    }
    using var selector=new FolderBrowserDialog{
      Description="Selecciona una carpeta de destino diferente para las copias .enc",
      UseDescriptionForTitle=true
    };
    if(selector.ShowDialog(this)!=DialogResult.OK)return;
    string target=Path.GetFullPath(selector.SelectedPath);
    string sourceFull=Path.GetFullPath(source);
    if(target.StartsWith(sourceFull+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase)||
       target.StartsWith(Path.GetFullPath(root)+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase)||
       sourceFull.StartsWith(target+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase)){
       MessageBox.Show(this,"El destino no puede estar dentro de los archivos originales ni contenerlos.");
       return;
    }
    if(MessageBox.Show(this,
       "Se copiarán los archivos .enc EXACTAMENTE como están, sin descifrar ni modificar. "+
       "La exportación NO recupera cookies en texto y no sobrescribe archivos existentes. ¿Continuar?",
       "Exportación de datos antiguos",
       MessageBoxButtons.YesNo,MessageBoxIcon.Warning)!=DialogResult.Yes)return;
    int copied=0,skipped=0;
    foreach(var file in Walk(source,10000).Where(f=>f.Extension.Equals(".enc",StringComparison.OrdinalIgnoreCase))){
       try{
         string relative=Path.GetRelativePath(source,file.FullName);
         string dest=Path.GetFullPath(Path.Combine(target,Path.GetFileName(source),relative));
         string boundary=Path.GetFullPath(target)+Path.DirectorySeparatorChar;
         if(!dest.StartsWith(boundary,StringComparison.OrdinalIgnoreCase))throw new IOException("Destino fuera de carpeta");
         Directory.CreateDirectory(Path.GetDirectoryName(dest)!);
         File.Copy(file.FullName,dest,false);
         copied++;
       }catch(IOException){skipped++;}
       catch(UnauthorizedAccessException){skipped++;}
    }
    MessageBox.Show(this,$"Copias .enc sin alterar: {copied}. Omitidos: {skipped}.\nNo se ha realizado ningún descifrado.",
       "Exportación completada");
  }
}