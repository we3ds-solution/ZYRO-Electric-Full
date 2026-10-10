using System.Security.Cryptography;
using System.Text;
using Application.Services;

namespace Infrastructure.Authentication;

/// <summary>
/// Password hashing and verification service using PBKDF2
/// </summary>
public class PasswordService : IPasswordService
{
    private const int KeySize = 64;
    // Updated to OWASP recommended iteration count for production security
    private const int Iterations = 600000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public string HashPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
            throw new ArgumentException("Password cannot be empty", nameof(password));

        var salt = RandomNumberGenerator.GetBytes(KeySize);
        var hash = Pbkdf2(password, salt, Iterations, Algorithm, KeySize);
        var hashWithSalt = new byte[salt.Length + hash.Length];

        Buffer.BlockCopy(salt, 0, hashWithSalt, 0, salt.Length);
        Buffer.BlockCopy(hash, 0, hashWithSalt, salt.Length, hash.Length);

        return Convert.ToBase64String(hashWithSalt);
    }

    public bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
            return false;

        try
        {
            var hashBytes = Convert.FromBase64String(hash);
            var salt = new byte[KeySize];
            Buffer.BlockCopy(hashBytes, 0, salt, 0, KeySize);

            var hashToCompare = Pbkdf2(password, salt, Iterations, Algorithm, KeySize);

            return CryptographicOperations.FixedTimeEquals(
                hashBytes.AsSpan(KeySize),
                hashToCompare);
        }
        catch
        {
            return false;
        }
    }

    private static byte[] Pbkdf2(string password, byte[] salt, int iterations, HashAlgorithmName algorithm, int keySize)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations, algorithm);
        return pbkdf2.GetBytes(keySize);
    }
}
