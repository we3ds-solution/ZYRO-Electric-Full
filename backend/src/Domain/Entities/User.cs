using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// User aggregate root - single responsibility: User identity and lifecycle
/// Only aggregates: User, UserRole, UserClaim, UserProfile, RefreshToken
/// </summary>
public class User : AggregateRoot
{
    // Backing fields for navigation properties
    private readonly List<UserRole> _userRoles = new();
    private readonly List<RefreshToken> _refreshTokens = new();
    private readonly List<UserClaim> _userClaims = new();
    private readonly List<UserProfile> _userProfiles = new();

    private User() { }

    /// <summary>
    /// Create new user with required fields
    /// </summary>
    public User(string username, string email, string firstName, string lastName)
    {
        Username = username ?? throw new ArgumentNullException(nameof(username));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
        LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
        
        IsActive = true;
        EmailConfirmed = false;
    }

    // Core properties
    public string Username { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public bool EmailConfirmed { get; private set; }
    public DateTime? LastLoginAt { get; private set; }

    // Navigation properties (read-only collections)
    public IReadOnlyCollection<UserRole> UserRoles => _userRoles.AsReadOnly();
    public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();
    public IReadOnlyCollection<UserClaim> UserClaims => _userClaims.AsReadOnly();
    public IReadOnlyCollection<UserProfile> UserProfiles => _userProfiles.AsReadOnly();

    // Aggregate methods - business operations
    public void SetPasswordHash(string hash)
    {
        if (string.IsNullOrWhiteSpace(hash))
            throw new ArgumentNullException(nameof(hash));

        PasswordHash = hash;
        UpdatedAtNow();
    }

    public void SetEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentNullException(nameof(email));

        Email = email;
        UpdatedAtNow();
    }

    public void SetFirstName(string firstName)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentNullException(nameof(firstName));

        FirstName = firstName;
        UpdatedAtNow();
    }

    public void SetLastName(string lastName)
    {
        if (string.IsNullOrWhiteSpace(lastName))
            throw new ArgumentNullException(nameof(lastName));

        LastName = lastName;
        UpdatedAtNow();
    }

    public void ConfirmEmail()
    {
        EmailConfirmed = true;
        UpdatedAtNow();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAtNow();
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAtNow();
    }

    public void UpdateLastLogin()
    {
        LastLoginAt = DateTime.UtcNow;
        UpdatedAtNow();
    }

    public string GetFullName() => $"{FirstName} {LastName}".Trim();

    // Aggregate composition methods
    public void AddRole(UserRole role)
    {
        if (role is null)
            throw new ArgumentNullException(nameof(role));

        if (_userRoles.Any(r => r.RoleId == role.RoleId))
            return; // Role already assigned

        _userRoles.Add(role);
        UpdatedAtNow();
    }

    public void RemoveRole(Guid roleId)
    {
        var role = _userRoles.FirstOrDefault(r => r.RoleId == roleId);
        if (role is not null)
        {
            _userRoles.Remove(role);
            UpdatedAtNow();
        }
    }

    public void AddRefreshToken(RefreshToken token)
    {
        if (token is null)
            throw new ArgumentNullException(nameof(token));

        _refreshTokens.Add(token);
        UpdatedAtNow();
    }

    public void AddClaim(UserClaim claim)
    {
        if (claim is null)
            throw new ArgumentNullException(nameof(claim));

        _userClaims.Add(claim);
        UpdatedAtNow();
    }

    public void AddProfile(UserProfile profile)
    {
        if (profile is null)
            throw new ArgumentNullException(nameof(profile));

        _userProfiles.Add(profile);
        UpdatedAtNow();
    }
}
