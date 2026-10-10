using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// UserClaim entity - single responsibility: User custom claims/attributes
/// Stores additional string-based attributes for users
/// Not an aggregate root, owned by User aggregate
/// </summary>
public class UserClaim : BaseEntity
{
    private UserClaim() { }

    /// <summary>
    /// Create user claim
    /// </summary>
    public UserClaim(Guid userId, string claimType, string claimValue)
    {
        UserId = userId;
        ClaimType = claimType ?? throw new ArgumentNullException(nameof(claimType));
        ClaimValue = claimValue ?? throw new ArgumentNullException(nameof(claimValue));
    }

    public Guid UserId { get; private set; }
    public string ClaimType { get; private set; } = string.Empty;
    public string ClaimValue { get; private set; } = string.Empty;

    // Navigation properties
    public User? User { get; set; }

    public void UpdateValue(string value)
    {
        ClaimValue = value ?? throw new ArgumentNullException(nameof(value));
        UpdatedAtNow();
    }
}
