using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace DyclokPRO;

/// <summary>
/// Windows HWND host for an UNMODIFIED, separately running DICloak.exe.
/// UI-only reparenting, never DLL injection, Electron ASAR modification,
/// HTTP interception, session copying or signed-header emulation.
/// Cross-process parenting is experimental (DPI, compositor, focus).
/// A failed attachment always keeps the official window usable externally.
/// </summary>
internal sealed class EngineWindowHost : Panel
{
    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr SetParent(IntPtr child, IntPtr newParent);
    [DllImport("user32.dll", SetLastError = true)]
    private static extern IntPtr GetParent(IntPtr child);
    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW", SetLastError = true)]
    private static extern IntPtr GetWindowLongPtr(IntPtr hwnd, int index);
    [DllImport("user32.dll", EntryPoint = "SetWindowLongPtrW", SetLastError = true)]
    private static extern IntPtr SetWindowLongPtr(IntPtr hwnd, int index, IntPtr style);
    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool MoveWindow(IntPtr hwnd, int x, int y, int width, int height, bool repaint);
    [DllImport("user32.dll", SetLastError = true)]
    private static extern bool SetWindowPos(IntPtr hwnd, IntPtr after, int x, int y,
        int width, int height, uint flags);
    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hwnd, out uint processId);
    [DllImport("user32.dll")]
    private static extern bool IsWindow(IntPtr hwnd);
    [DllImport("user32.dll")]
    private static extern bool ShowWindow(IntPtr hwnd, int cmd);

    private const int GWL_STYLE = -16;
    private const long WS_POPUP = 0x80000000;
    private const long WS_CHILD = 0x40000000;
    private const long WS_CAPTION = 0x00C00000;
    private const long WS_THICKFRAME = 0x00040000;
    private const long WS_MINIMIZEBOX = 0x00020000;
    private const long WS_MAXIMIZEBOX = 0x00010000;
    private const long WS_SYSMENU = 0x00080000;
    private const uint SWP_FRAMECHANGED = 0x0020;
    private const uint SWP_NOZORDER = 0x0004;
    private const uint SWP_SHOWWINDOW = 0x0040;

    private IntPtr embeddedWindow;
    private IntPtr formerParent;
    private IntPtr formerStyle;
    internal bool IsEmbedded => embeddedWindow != IntPtr.Zero && IsWindow(embeddedWindow);
    internal string? LastError { get; private set; }

    internal EngineWindowHost()
    {
        Dock = DockStyle.Fill;
        BackColor = Color.FromArgb(17, 24, 31);
        Resize += (_, _) => ResizeEmbedded();
        HandleDestroyed += (_, _) => Detach();
    }

    internal bool TryAttach(Process process)
    {
        if (IsEmbedded) return true;
        process.Refresh();
        if (process.HasExited) { LastError = "El proceso terminó antes de crear su ventana."; return false; }
        IntPtr window = process.MainWindowHandle;
        if (window == IntPtr.Zero || !IsWindow(window)) {
            LastError = "El motor todavía no creó una ventana."; return false;
        }
        GetWindowThreadProcessId(window, out uint owner);
        if (owner != (uint)process.Id) {
            LastError = "La ventana no corresponde al proceso esperado."; return false;
        }
        try
        {
            CreateControl();
            if (!IsHandleCreated) { LastError = "El panel no tiene HWND."; return false; }
            formerParent = GetParent(window);
            formerStyle = GetWindowLongPtr(window, GWL_STYLE);
            long original = formerStyle.ToInt64();
            long style = (original &
                ~(WS_POPUP | WS_CAPTION | WS_THICKFRAME | WS_MINIMIZEBOX |
                  WS_MAXIMIZEBOX | WS_SYSMENU)) | WS_CHILD;

            SetWindowLongPtr(window, GWL_STYLE, new IntPtr(style));
            SetParent(window, Handle);
            if (GetParent(window) != Handle)
            {
                SetWindowLongPtr(window, GWL_STYLE, formerStyle);
                LastError = "Windows no permitió integrar la ventana (DPI o permisos).";
                return false;
            }
            embeddedWindow = window;
            ResizeEmbedded();
            ShowWindow(embeddedWindow, 5);
            LastError = null;
            return true;
        }
        catch (Exception e) when (e is Win32Exception or InvalidOperationException or ArgumentException)
        {
            Detach();
            LastError = "Windows rechazó la integración de la ventana: " + e.GetType().Name;
            return false;
        }
    }

    internal void ResizeEmbedded()
    {
        if (!IsEmbedded) return;
        MoveWindow(embeddedWindow, 0, 0,
            Math.Max(1, ClientSize.Width), Math.Max(1, ClientSize.Height), true);
        SetWindowPos(embeddedWindow, IntPtr.Zero, 0, 0,
            Math.Max(1, ClientSize.Width), Math.Max(1, ClientSize.Height),
            SWP_FRAMECHANGED | SWP_NOZORDER | SWP_SHOWWINDOW);
    }

    internal void Detach()
    {
        IntPtr child = embeddedWindow;
        embeddedWindow = IntPtr.Zero;
        if (child == IntPtr.Zero || !IsWindow(child)) return;
        // The official process is not closed when the host is closed.
        // Restore normal styles before returning its HWND to the desktop.
        SetParent(child, formerParent);
        SetWindowLongPtr(child, GWL_STYLE, formerStyle);
        SetWindowPos(child, IntPtr.Zero, 120, 110, 1100, 740,
            SWP_FRAMECHANGED | SWP_NOZORDER | SWP_SHOWWINDOW);
    }
}
