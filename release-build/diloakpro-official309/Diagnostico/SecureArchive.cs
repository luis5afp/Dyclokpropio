using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace DiloakPRO.Diagnostico;

// Manual, explicitly selected backups only. No browser credential extraction,
// cookie jar access, filesystem scanning or automatic decrypting.
internal static class SecureArchive
{
    private static readonly byte[] Magic = Encoding.ASCII.GetBytes("DPROARC1");
    private static readonly byte[] AssociatedData = Encoding.UTF8.GetBytes("diloakpro-v1");
    private const int MaxSize = 64 * 1024 * 1024;
    private const int Iterations = 310000;

    internal static string EncryptSelectedFile(string? profileId, string sourceFile, string password)
    {
        if (!File.Exists(sourceFile))
            throw new FileNotFoundException("Selecciona un archivo existente");
        if (string.IsNullOrWhiteSpace(password) || password.Length < 12)
            throw new ArgumentException("Utiliza una contraseña de al menos 12 caracteres");

        var info = new FileInfo(sourceFile);
        if (info.Length == 0 || info.Length > MaxSize)
            throw new InvalidDataException("El respaldo admite archivos de 1 byte a 64 MiB");

        var folder = Path.Combine(ProfileArchive.GetProfileDirectory(profileId),
            "RespaldosCifrados");
        Directory.CreateDirectory(folder);
        var dest = Path.Combine(folder, "archivo-" +
            DateTime.UtcNow.ToString("yyyyMMdd-HHmmss-fffffff") + "-" +
            Guid.NewGuid().ToString("N")[..8] + ".dlvault");
        var tmp = dest + ".tmp";

        var plaintext = File.ReadAllBytes(sourceFile);
        var ciphertext = new byte[plaintext.Length];
        var salt = RandomNumberGenerator.GetBytes(16);
        var nonce = RandomNumberGenerator.GetBytes(12);
        var tag = new byte[16];
        var key = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations,
            HashAlgorithmName.SHA256, 32);
        try
        {
            using (var aes = new AesGcm(key, tag.Length))
                aes.Encrypt(nonce, plaintext, ciphertext, tag, AssociatedData);
            using (var stream = new FileStream(tmp, FileMode.CreateNew, FileAccess.Write,
                       FileShare.None, 65536, FileOptions.WriteThrough))
            using (var writer = new BinaryWriter(stream))
            {
                writer.Write(Magic);
                writer.Write((byte)1);
                writer.Write(salt);
                writer.Write(nonce);
                writer.Write(tag);
                writer.Write(ciphertext.Length);
                writer.Write(ciphertext);
                writer.Flush();
                stream.Flush(true);
            }
            File.Move(tmp, dest);
            return dest;
        }
        finally
        {
            CryptographicOperations.ZeroMemory(plaintext);
            CryptographicOperations.ZeroMemory(key);
            CryptographicOperations.ZeroMemory(ciphertext);
            if (File.Exists(tmp)) File.Delete(tmp);
        }
    }

    // Capture only an explicitly enabled, bounded JSON response from the user's lab.
    // Never create a plaintext intermediate file; the output uses the existing
    // .dlvault format and can be restored only with the chosen password.
    internal static string EncryptLabResponse(string? profileId,
        ReadOnlySpan<byte> plaintext, ReadOnlySpan<char> password)
    {
        if (plaintext.Length == 0 || plaintext.Length > 128 * 1024)
            throw new InvalidDataException("Respuesta de laboratorio fuera del limite");
        if (password.Length < 12)
            throw new ArgumentException("Se necesita contraseña de 12+ caracteres");

        var folder = Path.Combine(ProfileArchive.GetProfileDirectory(profileId),
            "RespaldosCifrados");
        Directory.CreateDirectory(folder);
        var dest = Path.Combine(folder, "respuesta-lab-" +
            DateTime.UtcNow.ToString("yyyyMMdd-HHmmss-fffffff") + "-" +
            Guid.NewGuid().ToString("N")[..8] + ".dlvault");
        var tmp = dest + ".tmp";
        var salt = RandomNumberGenerator.GetBytes(16);
        var nonce = RandomNumberGenerator.GetBytes(12);
        var tag = new byte[16];
        var ciphertext = new byte[plaintext.Length];
        var key = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations,
            HashAlgorithmName.SHA256, 32);
        try
        {
            using (var aes = new AesGcm(key, tag.Length))
                aes.Encrypt(nonce, plaintext, ciphertext, tag, AssociatedData);
            using (var stream = new FileStream(tmp, FileMode.CreateNew,
                       FileAccess.Write, FileShare.None, 65536, FileOptions.WriteThrough))
            using (var writer = new BinaryWriter(stream))
            {
                writer.Write(Magic);
                writer.Write((byte)1);
                writer.Write(salt);
                writer.Write(nonce);
                writer.Write(tag);
                writer.Write(ciphertext.Length);
                writer.Write(ciphertext);
                writer.Flush();
                stream.Flush(true);
            }
            File.Move(tmp, dest);
            return dest;
        }
        finally
        {
            CryptographicOperations.ZeroMemory(key);
            CryptographicOperations.ZeroMemory(ciphertext);
            if (File.Exists(tmp)) File.Delete(tmp);
        }
    }

    // Password-gated, in-memory viewing of an encrypted lab JSON payload.
    // The caller must clear the returned byte array immediately after use.
    internal static byte[] ReadLabResponse(string encryptedFile,
        ReadOnlySpan<char> password)
    {
        if (!File.Exists(encryptedFile) ||
            !Path.GetFileName(encryptedFile).StartsWith("respuesta-lab-",
                StringComparison.OrdinalIgnoreCase) ||
            !encryptedFile.EndsWith(".dlvault", StringComparison.OrdinalIgnoreCase))
            throw new InvalidDataException("Selecciona una captura JSON de laboratorio");
        using var stream = new FileStream(encryptedFile, FileMode.Open,
            FileAccess.Read, FileShare.Read);
        if (stream.Length <= 8 + 1 + 16 + 12 + 16 + 4 ||
            stream.Length > 128 * 1024 + 8 + 1 + 16 + 12 + 16 + 4)
            throw new InvalidDataException("Longitud de respuesta cifrada no valida");
        using var reader = new BinaryReader(stream);
        if (!reader.ReadBytes(8).AsSpan().SequenceEqual(Magic) ||
            reader.ReadByte() != 1)
            throw new InvalidDataException("Formato de captura no admitido");
        var salt = reader.ReadBytes(16);
        var nonce = reader.ReadBytes(12);
        var tag = reader.ReadBytes(16);
        var length = reader.ReadInt32();
        if (length < 1 || length > 128 * 1024 ||
            length != stream.Length - stream.Position)
            throw new InvalidDataException("Tamano de captura no valido");
        var ciphertext = reader.ReadBytes(length);
        var plaintext = new byte[length];
        var key = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations,
            HashAlgorithmName.SHA256, 32);
        try
        {
            using (var aes = new AesGcm(key, tag.Length))
                aes.Decrypt(nonce, ciphertext, tag, plaintext, AssociatedData);
            return plaintext;
        }
        catch
        {
            CryptographicOperations.ZeroMemory(plaintext);
            throw;
        }
        finally
        {
            CryptographicOperations.ZeroMemory(key);
            CryptographicOperations.ZeroMemory(ciphertext);
        }
    }

    internal static void RestoreToSelectedFile(string encryptedFile, string destination,
        string password)
    {
        if (!File.Exists(encryptedFile) ||
            !encryptedFile.EndsWith(".dlvault", StringComparison.OrdinalIgnoreCase))
            throw new InvalidDataException("Selecciona un respaldo .dlvault");
        if (File.Exists(destination))
            throw new IOException("No se sobrescriben archivos existentes");
        if (string.IsNullOrWhiteSpace(password))
            throw new ArgumentException("Se necesita la contraseña del respaldo");

        using var stream = new FileStream(encryptedFile, FileMode.Open,
            FileAccess.Read, FileShare.Read);
        if (stream.Length < 8 + 1 + 16 + 12 + 16 + 4 ||
            stream.Length > MaxSize + 8 + 1 + 16 + 12 + 16 + 4)
            throw new InvalidDataException("Tamaño de respaldo no válido");
        using var reader = new BinaryReader(stream);
        if (!reader.ReadBytes(8).AsSpan().SequenceEqual(Magic) ||
            reader.ReadByte() != 1)
            throw new InvalidDataException("Formato de respaldo no admitido");
        var salt = reader.ReadBytes(16);
        var nonce = reader.ReadBytes(12);
        var tag = reader.ReadBytes(16);
        var length = reader.ReadInt32();
        if (length < 1 || length > MaxSize || length != stream.Length - stream.Position)
            throw new InvalidDataException("Longitud de respaldo no válida");
        var ciphertext = reader.ReadBytes(length);
        var plaintext = new byte[length];
        var key = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations,
            HashAlgorithmName.SHA256, 32);
        var temp = destination + "." + Guid.NewGuid().ToString("N") + ".tmp";
        try
        {
            using (var aes = new AesGcm(key, tag.Length))
                aes.Decrypt(nonce, ciphertext, tag, plaintext, AssociatedData);
            using (var file = new FileStream(temp, FileMode.CreateNew, FileAccess.Write,
                       FileShare.None, 65536, FileOptions.WriteThrough))
            {
                file.Write(plaintext);
                file.Flush(true);
            }
            // Restore only to the explicit user-selected destination, never into
            // a browser profile or vendor-managed session directory automatically.
            File.Move(temp, destination);
        }
        finally
        {
            CryptographicOperations.ZeroMemory(key);
            CryptographicOperations.ZeroMemory(plaintext);
            CryptographicOperations.ZeroMemory(ciphertext);
            if (File.Exists(temp)) File.Delete(temp);
        }
    }
}
