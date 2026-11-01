using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace DyclokPRO;

/// <summary>
/// Counts ONLY top-level windows of a given native engine PID. A successful
/// SetParent alone does not guarantee that the original desktop window is gone.
/// </summary>
internal static class TopLevelEngineWindows
{
    private delegate bool EnumWindowCallback(IntPtr window,IntPtr state);
    [DllImport("user32.dll")]
    private static extern bool EnumWindows(EnumWindowCallback callback,IntPtr state);
    [DllImport("user32.dll")]
    private static extern bool IsWindowVisible(IntPtr window);
    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr window,out uint pid);
    [DllImport("user32.dll")]
    private static extern IntPtr GetParent(IntPtr window);

    internal static int VisibleFor(Process process)
    {
        int count=0;
        try{
            process.Refresh();
            if(process.HasExited)return 0;
            EnumWindows((window,_)=>{
                GetWindowThreadProcessId(window,out uint pid);
                if(pid==(uint)process.Id&&GetParent(window)==IntPtr.Zero&&
                   IsWindowVisible(window)) count++;
                return true;
            },IntPtr.Zero);
        }catch(InvalidOperationException){}
        return count;
    }
}
