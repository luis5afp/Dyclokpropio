// Dyclokpro v6.2 - Local Chromium profiles. Windows Forms, .NET Framework.
// These profiles are independent: no remote DICloak profile IDs, credentials or lock tokens.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace DyclokproLocal
{
    internal sealed class Profile
    {
        public Guid Id;
        public string Name;
        public override string ToString() { return Name; }
    }

    internal sealed class Window : Form
    {
        private readonly string root;
        private readonly string browser;
        private readonly ListBox profiles = new ListBox();
        private readonly Label message = new Label();
        private readonly Dictionary<string, FileStream> active = new Dictionary<string, FileStream>(StringComparer.OrdinalIgnoreCase);
        private readonly object activeGuard = new object();

        public Window()
        {
            Text = "Dyclokpro - Perfiles locales";
            StartPosition = FormStartPosition.CenterScreen;
            MinimumSize = new Size(620, 420);
            ClientSize = new Size(720, 455);
            Font = new Font("Segoe UI", 10F, FontStyle.Regular);
            BackColor = Color.FromArgb(22, 23, 25);
            ForeColor = Color.White;
            FormBorderStyle = FormBorderStyle.Sizable;
            Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);

            string dataHome = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            root = Path.Combine(dataHome, "Dyclokpro", "LocalProfiles");
            browser = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Chromium", "Application", "ginsbrowser.exe");

            Label title = NewLabel("Perfiles locales de Dyclokpro", 22F, 20, 18, 665, 40, true);
            Label help = NewLabel("Independientes del servidor. No importan ni desbloquean perfiles en la nube.", 9F, 23, 70, 675, 35, false);
            help.ForeColor = Color.LightGray;

            profiles.SetBounds(22, 117, 665, 235);
            profiles.BackColor = Color.FromArgb(36, 38, 42);
            profiles.ForeColor = Color.White;
            profiles.BorderStyle = BorderStyle.FixedSingle;
            profiles.Font = new Font("Segoe UI", 11F);
            profiles.DoubleClick += delegate { OpenSelected(); };
            profiles.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Bottom;
            Controls.Add(profiles);

            Button add = NewButton("Crear perfil local", 22, 363, 185);
            add.Click += delegate { CreateProfile(); };
            Button open = NewButton("Abrir navegador", 217, 363, 180);
            open.Click += delegate { OpenSelected(); };
            Button folder = NewButton("Ver carpetas locales", 407, 363, 190);
            folder.Click += delegate { OpenFolder(); };
            Button refresh = NewButton("Actualizar", 602, 363, 86);
            refresh.Click += delegate { Reload(); };

            message.SetBounds(24, 411, 665, 34);
            message.ForeColor = Color.FromArgb(114, 230, 200);
            message.Text = "Sin bloqueo remoto. Chromium usa una carpeta nueva por perfil.";
            message.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Bottom;
            Controls.Add(message);
            title.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            help.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            foreach(Control ctrl in Controls)
            {
                if (ctrl is Button) ctrl.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            }
            add.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            open.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            folder.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            refresh.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            this.FormClosed += delegate { CloseOpenLocks(); };
            Reload();
        }

        private Label NewLabel(string txt, float size, int x, int y, int w, int h, bool bold)
        {
            Label l = new Label();
            l.Text = txt;
            l.Location = new Point(x, y);
            l.Size = new Size(w, h);
            l.Font = new Font("Segoe UI", size, bold ? FontStyle.Bold : FontStyle.Regular);
            Controls.Add(l);
            return l;
        }

        private Button NewButton(string txt, int x, int y, int w)
        {
            Button b = new Button();
            b.Text = txt;
            b.SetBounds(x, y, w, 37);
            b.FlatStyle = FlatStyle.Flat;
            b.BackColor = Color.FromArgb(24, 126, 107);
            b.ForeColor = Color.White;
            b.FlatAppearance.BorderColor = Color.FromArgb(38, 186, 152);
            Controls.Add(b);
            return b;
        }

        private void Status(string txt)
        {
            if (!IsDisposed) message.Text = txt;
        }

        private void Reload()
        {
            try
            {
                Directory.CreateDirectory(root);
                profiles.Items.Clear();
                foreach(string path in Directory.GetDirectories(root))
                {
                    Guid id;
                    if (!Guid.TryParseExact(Path.GetFileName(path), "N", out id)) continue;
                    string nameFile = Path.Combine(path, "name.txt");
                    if (!File.Exists(nameFile) || new FileInfo(nameFile).Length > 4096) continue;
                    string name = File.ReadAllText(nameFile, Encoding.UTF8).Trim();
                    if (String.IsNullOrWhiteSpace(name) || name.Length > 64) continue;
                    profiles.Items.Add(new Profile {Id=id, Name=name});
                }
                Status(profiles.Items.Count == 0 ? "Crea tu primer perfil local independiente." :
                    "Perfiles locales: " + profiles.Items.Count + ". Ninguno requiere token remoto.");
            }
            catch(Exception e)
            {
                Status("No se pudieron leer los perfiles locales: " + e.GetType().Name);
            }
        }

        private void CreateProfile()
        {
            using(Form prompt = new Form())
            {
                prompt.Text = "Nuevo perfil local";
                prompt.ClientSize = new Size(440, 160);
                prompt.StartPosition = FormStartPosition.CenterParent;
                prompt.FormBorderStyle = FormBorderStyle.FixedDialog;
                prompt.MaximizeBox = false;
                prompt.MinimizeBox = false;
                Label label = new Label{Text="Nombre del perfil local:",Left=16,Top=18,Width=400,Height=25};
                TextBox box = new TextBox{Left=16,Top=48,Width=400,MaxLength=64};
                Button ok = new Button{Text="Crear",Left=228,Top=104,Width=90,DialogResult=DialogResult.OK};
                Button cancel = new Button{Text="Cancelar",Left=326,Top=104,Width=90,DialogResult=DialogResult.Cancel};
                prompt.Controls.Add(label); prompt.Controls.Add(box);
                prompt.Controls.Add(ok); prompt.Controls.Add(cancel);
                prompt.AcceptButton = ok; prompt.CancelButton = cancel;
                if(prompt.ShowDialog(this) != DialogResult.OK) return;
                string name = box.Text.Trim();
                if(name.Length==0 || name.IndexOfAny(new char[] {'\r','\n','\t'})>=0)
                {
                    MessageBox.Show(this, "Escribe un nombre válido.", "Dyclokpro"); return;
                }
                try
                {
                    Guid id=Guid.NewGuid();
                    string folder=Path.Combine(root,id.ToString("N"));
                    Directory.CreateDirectory(folder);
                    Directory.CreateDirectory(Path.Combine(folder,"User Data"));
                    File.WriteAllText(Path.Combine(folder,"name.txt"),name,Encoding.UTF8);
                    Reload();
                    foreach(object item in profiles.Items)
                    {
                        Profile p = item as Profile;
                        if(p!=null && p.Id==id) { profiles.SelectedItem=item; break; }
                    }
                }
                catch(Exception e)
                {
                    MessageBox.Show(this, "No se pudo crear el perfil local: "+e.GetType().Name, "Dyclokpro");
                }
            }
        }

        private void OpenSelected()
        {
            Profile profile=profiles.SelectedItem as Profile;
            if(profile==null){MessageBox.Show(this,"Selecciona un perfil local primero.","Dyclokpro");return;}
            if(!File.Exists(browser))
            {
                MessageBox.Show(this,"No se encontró Chromium incluido. Instala la versión completa de Dyclokpro.\n"+
                  "Ruta relativa esperada: Chromium\\Application\\ginsbrowser.exe","Falta navegador",
                  MessageBoxButtons.OK,MessageBoxIcon.Error);
                return;
            }
            string id=profile.Id.ToString("N");
            string folder=Path.Combine(root,id);
            string data=Path.Combine(folder,"User Data");
            string lockFile=Path.Combine(folder,"local-opening.lock");
            FileStream lease=null;
            try
            {
                Directory.CreateDirectory(data);
                lease=new FileStream(lockFile,FileMode.OpenOrCreate,FileAccess.ReadWrite,FileShare.None);
                lock(activeGuard) { if(active.ContainsKey(id)) throw new IOException("La ventana ya está abierta.");active.Add(id,lease); }
                var start=new ProcessStartInfo();
                start.FileName=browser;
                start.WorkingDirectory=Path.GetDirectoryName(browser);
                start.Arguments="--user-data-dir=\\\"" + data + "\\\" --no-first-run --no-default-browser-check --new-window about:blank";
                start.UseShellExecute=false;
                Process process=Process.Start(start);
                if(process==null) throw new IOException("Chromium no devolvió un proceso.");
                Status("Chromium iniciado para: "+profile.Name+". Carpeta independiente.");
                ThreadPool.QueueUserWorkItem(delegate(object ignored)
                {
                    try { process.WaitForExit(); } catch {}
                    finally
                    {
                        lock(activeGuard)
                        {
                            FileStream old;
                            if(active.TryGetValue(id,out old) && Object.ReferenceEquals(old,lease))
                            { active.Remove(id); old.Dispose(); }
                        }
                        try { process.Dispose(); } catch {}
                    }
                });
            }
            catch(Exception e)
            {
                lock(activeGuard) { active.Remove(id); }
                if(lease!=null) lease.Dispose();
                MessageBox.Show(this,"No se pudo abrir este perfil local.\n\n"+
                  e.GetType().Name+": "+e.Message+
                  "\n\nLos perfiles remotos no se han modificado.","Dyclokpro",
                  MessageBoxButtons.OK,MessageBoxIcon.Warning);
            }
        }

        private void OpenFolder()
        {
            try { Directory.CreateDirectory(root); Process.Start("explorer.exe","\\\""+root+"\\\""); }
            catch(Exception) { Status("No se pudo abrir la carpeta de perfiles locales."); }
        }

        private void CloseOpenLocks()
        {
            lock(activeGuard)
            {
                foreach(FileStream stream in active.Values){try{stream.Dispose();}catch{}}
                active.Clear();
            }
        }

        [STAThread]
        static void Main(string[] args)
        {
            // Build-time validation without opening the GUI or accessing user profiles.
            if(args.Length == 1 && args[0] == "--self-test")
            {
                string chrome = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
                   "Chromium", "Application", "ginsbrowser.exe");
                if (!File.Exists(chrome))
                {
                    Console.Error.WriteLine("LOCAL_PROFILE_TEST=CHROMIUM_MISSING");
                    Environment.Exit(2);
                }
                Console.WriteLine("LOCAL_PROFILE_TEST=PASS");
                return;
            }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Window());
        }
    }
}
