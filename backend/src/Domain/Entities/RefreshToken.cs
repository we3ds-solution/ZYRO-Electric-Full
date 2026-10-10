using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// RefreshToken entity - single responsibility: JWT refresh token lifecycle
/// Manages refresh token creation, validation, and revocation
/// Not an aggregate root, owned by User aggregate
/// </summary>
public class RefreshToken : BaseEntity
{
    private RefreshToken() { }

    /// <summary>
    /// Create new refresh token
    /// </summary>
    public RefreshToken(Guid userId, string token, int expirationDays)
    {
        UserId = userId;
        Token = token ?? throw new ArgumentNullException(nameof(token));
        ExpiresAt = DateTime.UtcNow.AddDays(expirationDays);
        IsRevoked = false;
    }

    public Guid UserId { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public DateTime ExpiresAt { get; private set; }
    public bool IsRevoked { get; private set; }
    public DateTime? RevokedAt { get; private set; }

    // Navigation properties
    public User? User { get; set; }

    // Computed properties
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
    public bool IsValid => !IsRevoked && !IsExpired;

    /// <summary>
    /// Revoke this refresh token
    /// </summary>
    public void Revoke()
    {
        IsRevoked = true;
        RevokedAt = DateTime.UtcNow;
        UpdatedAtNow();
    }

    /// <summary>
    /// Check if token matches provided value and is valid
    /// </summary>
    public bool IsTokenValid(string token)
    {
        return Token == token && IsValid;
    }
}
