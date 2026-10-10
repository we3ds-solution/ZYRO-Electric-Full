using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// UserProfile entity - single responsibility: Extended user profile information
/// Stores additional profile data beyond basic user info
/// Not an aggregate root, owned by User aggregate
/// </summary>
public class UserProfile : BaseEntity
{
    private UserProfile() { }

    /// <summary>
    /// Create user profile for a user
    /// </summary>
    public UserProfile(Guid userId, string profileName)
    {
        UserId = userId;
        ProfileName = profileName ?? throw new ArgumentNullException(nameof(profileName));
        Language = "en";
    }

    public Guid UserId { get; private set; }
    public string ProfileName { get; private set; } = string.Empty;
    public string? PhoneNumber { get; private set; }
    public string? ProfilePictureUrl { get; private set; }
    public string? Bio { get; private set; }
    public string? Country { get; private set; }
    public string? Timezone { get; private set; }
    public string Language { get; private set; } = "en";
    public bool TwoFactorEnabled { get; private set; }

    // Navigation properties
    public User? User { get; set; }

    // Business methods
    public void SetPhoneNumber(string? phoneNumber)
    {
        PhoneNumber = phoneNumber;
        UpdatedAtNow();
    }

    public void SetProfilePictureUrl(string? url)
    {
        ProfilePictureUrl = url;
        UpdatedAtNow();
    }

    public void SetBio(string? bio)
    {
        Bio = bio;
        UpdatedAtNow();
    }

    public void SetCountry(string? country)
    {
        Country = country;
        UpdatedAtNow();
    }

    public void SetTimezone(string? timezone)
    {
        Timezone = timezone;
        UpdatedAtNow();
    }

    public void SetLanguage(string language)
    {
        if (string.IsNullOrWhiteSpace(language))
            throw new ArgumentNullException(nameof(language));

        Language = language;
        UpdatedAtNow();
    }

    public void EnableTwoFactor()
    {
        TwoFactorEnabled = true;
        UpdatedAtNow();
    }

    public void DisableTwoFactor()
    {
        TwoFactorEnabled = false;
        UpdatedAtNow();
    }
}
