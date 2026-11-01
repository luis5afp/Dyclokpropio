using System;
using System.Diagnostics;
using System.IO;
using System.Security.Cryptography;

namespace DyclokPRO;

/// <summary>
/// Check that account windows will use the complete official 3.0.7 engine,
/// rather than an old Electron runtime with a changed display version.
/// Does not inspect credentials, cookies, API calls, or private user folders.
/// </summary>
internal static class Engine307Guard
{
    internal const string ExpectedPeFileVersion = "3.0.7.3079";
    internal static void Validate(string installDir)
    {
        var exe = Path.Combine(installDir, "DICloak.exe");
        var asar = Path.Combine(installDir, "resources", "app.asar");
        if (!File.Exists(exe) || !File.Exists(asar))
            throw new FileNotFoundException(
                "Faltan los archivos del motor oficial DICloak 3.0.7.");

        string fileVersion = FileVersionInfo.GetVersionInfo(exe).FileVersion ?? "";
        if (!string.Equals(fileVersion, ExpectedPeFileVersion,
                           StringComparison.Ordinal))
            throw new InvalidDataException(
                "El ejecutable no corresponde al motor oficial DICloak 3.0.7.");

        using var stream = File.OpenRead(asar);
        string actual = Convert.ToHexString(SHA256.HashData(stream))
                               .ToLowerInvariant();
        if (!string.Equals(actual, Program.AsarSha,
                           StringComparison.Ordinal))
            throw new InvalidDataException(
                "El paquete del motor oficial DICloak 3.0.7 ha cambiado. " +
                "No se iniciará una combinación de motores.");
    }
}
