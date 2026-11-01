using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace DyclokPRO;

/// <summary>
/// Offline keyboard test across a REAL cross-process Windows HWND parent:
/// Child: temporary WinForms text field (not login, no browser data).
/// Parent: DyclokPRO EngineWindowHost, selects the embedded child and types
/// a fixed harmless probe. Only a boolean success marker is recorded.
/// </summary>
internal static class EngineFocusSmoke
{
    internal const string Text="DYTEST456";
    internal static readonly string Marker=Path.Combine(Path.GetTempPath(),"dyclokpro-v643-input-test.json");

    internal static int Child()
    {
        ApplicationConfiguration.Initialize();
        using var form=new Form {
            Text="DyclokPRO Keyboard Probe",
            Width=800,Height=450,StartPosition=FormStartPosition.CenterScreen
        };
        var box=new TextBox {Dock=DockStyle.Top,Font=new Font("Segoe UI",12),
            AccessibleName="Synthetic keyboard probe field"};
        form.Controls.Add(box);
        form.Shown+=(_,_)=>box.Focus();
        box.TextChanged+=(_,_)=>{
            if(box.Text==Text){
                File.WriteAllText(Marker,"{\"received\":true,\"syntheticOnly\":true}");
                form.BeginInvoke(new Action(()=>form.Close()));
            }
        };
        Application.Run(form);
        return 0;
    }

    internal static int Parent()
    {
        ApplicationConfiguration.Initialize();
        File.Delete(Marker);
        Process? child=null;
        bool succeeded=false;
        try{
            var info=new ProcessStartInfo {
                FileName=Environment.ProcessPath
                    ??throw new InvalidOperationException("Executable path missing"),
                UseShellExecute=false
            };
            info.ArgumentList.Add("--dyclok-focus-child");
            child=Process.Start(info)??throw new InvalidOperationException("Child not started");
            using var form=new Form {
                Text="DyclokPRO Focus Regression",
                Width=850,Height=500,StartPosition=FormStartPosition.CenterScreen
            };
            var panel=new EngineWindowHost();
            form.Controls.Add(panel);
            int ticks=0,sendAttempts=0;
            var clock=new System.Windows.Forms.Timer{Interval=260};
            clock.Tick+=(_,_)=>{
                ticks++;
                if(File.Exists(Marker)){
                    succeeded=File.ReadAllText(Marker).Contains("\"received\":true");
                    clock.Stop();
                    form.Close();
                    return;
                }
                if(ticks>70||(child?.HasExited??true)){
                    clock.Stop();
                    form.Close();
                    return;
                }
                if(!panel.IsEmbedded) {
                    panel.TryAttach(child!);
                    return;
                }
                if(ticks%8==0 && sendAttempts<3){
                    // In a real application, this transfer occurs when the user
                    // selects the tab. SendKeys is ONLY for this known marker.
                    if(panel.RestoreKeyboardFocus()){
                        sendAttempts++;
                        try{SendKeys.SendWait(Text);}catch(InvalidOperationException){}
                    }
                }
            };
            form.Shown+=(_,_)=>clock.Start();
            Application.Run(form);
            clock.Dispose();
            return succeeded?0:17;
        }
        catch(Exception) { return 17; }
        finally{
            if(child is not null){
                try{if(!child.HasExited)child.Kill(entireProcessTree:true);}
                catch(InvalidOperationException){}
                catch(System.ComponentModel.Win32Exception){}
                child.Dispose();
            }
        }
    }
}
