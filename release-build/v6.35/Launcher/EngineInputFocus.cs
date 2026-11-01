using System;
using System.Runtime.InteropServices;

namespace DyclokPRO;

/// <summary>
/// Transfers keyboard focus between the WinForms tab owner and the original
/// Electron window, which have different Windows GUI input queues.
///
/// No keystroke hooks, keyboard injection, passwords, tokens, messages, or
/// browser state are collected. AttachThreadInput is scoped to one call.
/// </summary>
internal static class EngineInputFocus
{
    [StructLayout(LayoutKind.Sequential)]
    private struct Rect { public int L,T,R,B; }
    [StructLayout(LayoutKind.Sequential)]
    private struct GuiThreadInfo {
        public uint cbSize;
        public uint flags;
        public IntPtr hwndActive, hwndFocus, hwndCapture, hwndMenuOwner, hwndMoveSize, hwndCaret;
        public Rect rcCaret;
    }

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hwnd,out uint pid);
    [DllImport("kernel32.dll")]
    private static extern uint GetCurrentThreadId();
    [DllImport("user32.dll",SetLastError=true)]
    private static extern bool AttachThreadInput(uint a,uint b,bool attach);
    [DllImport("user32.dll",SetLastError=true)]
    private static extern IntPtr SetFocus(IntPtr hWnd);
    [DllImport("user32.dll",SetLastError=true)]
    private static extern bool GetGUIThreadInfo(uint thread,ref GuiThreadInfo info);
    [DllImport("user32.dll")]
    private static extern bool IsChild(IntPtr parent,IntPtr child);
    [DllImport("user32.dll")]
    private static extern bool IsWindow(IntPtr hwnd);
    [DllImport("user32.dll")]
    private static extern IntPtr GetForegroundWindow();

    private static bool Within(IntPtr root,IntPtr candidate) =>
        root!=IntPtr.Zero && candidate!=IntPtr.Zero && IsWindow(candidate) &&
        (candidate==root || IsChild(root,candidate));

    private static IntPtr ReadFocus(uint thread)
    {
        var state=new GuiThreadInfo {cbSize=(uint)Marshal.SizeOf<GuiThreadInfo>()};
        return GetGUIThreadInfo(thread,ref state) ? state.hwndFocus : IntPtr.Zero;
    }

    /// <summary>
    /// Preserve a provider-owned input HWND on tab deselection, including
    /// Chromium child widgets. No text or field content is inspected.
    /// </summary>
    internal static IntPtr Remember(IntPtr electron)
    {
        if(!IsWindow(electron))return IntPtr.Zero;
        uint thread=GetWindowThreadProcessId(electron,out _);
        if(thread==0)return IntPtr.Zero;
        IntPtr focused=ReadFocus(thread);
        return Within(electron,focused) ? focused : IntPtr.Zero;
    }

    /// <summary>
    /// If user activation of the host is known, restore focus into the actual
    /// Electron input queue, not the WinForms tab/control.
    /// Never call from a polling timer; it would steal input while typing.
    /// </summary>
    internal static bool Restore(IntPtr electron,IntPtr topLevelHost,
                                 IntPtr remembered=default)
    {
        if(!IsWindow(electron)||!IsWindow(topLevelHost))return false;
        uint targetThread=GetWindowThreadProcessId(electron,out _);
        uint ourThread=GetCurrentThreadId();
        if(targetThread==0||ourThread==0)return false;

        // This method is only called on genuine user tab activation or the
        // first provider HWND attachment. Keep application in foreground.
        IntPtr fg=GetForegroundWindow();
        // Never steal focus from an unrelated application. Only transfer
        // keyboard input if this account host is already in the foreground.
        if(fg!=topLevelHost && !IsChild(topLevelHost,fg))return false;

        bool attached=false;
        try {
            if(targetThread!=ourThread) {
                if(!AttachThreadInput(ourThread,targetThread,true))return false;
                attached=true;
            }
            IntPtr current=ReadFocus(targetThread);
            IntPtr target=Within(electron,current) ? current :
                         Within(electron,remembered) ? remembered : electron;
            SetFocus(target);
            IntPtr after=ReadFocus(targetThread);
            // An invalid return from SetFocus is not proof of failure: a NULL
            // previous-focus handle is legitimate; verify the actual queue.
            return Within(electron,after);
        }
        finally {
            if(attached)AttachThreadInput(ourThread,targetThread,false);
        }
    }
}
