using Application.Dtos.Auth;
using Application.Services;
using Infrastructure.Persistence;
using Infrastructure.Repositories;

namespace Infrastructure.Services;

/// <summary>
/// User profile service — profile retrieval and update.
/// Update is atomic: user + profile committed via IUnitOfWork in a single SaveChanges.
/// ProfileUpdateRequest is separate from UserProfileDto to prevent mass assignment.
/// </summary>
public class UserProfileService : IUserProfileService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserProfileRepository _userProfileRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UserProfileService(
        IUserRepository userRepository,
        IUserProfileRepository userProfileRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _userProfileRepository = userProfileRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetUserWithRolesAsync(userId, cancellationToken);

        if (user == null)
            throw new InvalidOperationException("User not found.");

        var userProfile = await _userProfileRepository.GetByUserIdAsync(userId, cancellationToken);
        var claims = await _userProfileRepository.GetUserClaimsAsync(userId, cancellationToken);

        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.GetFullName(),
            PhoneNumber = userProfile?.PhoneNumber,
            ProfilePictureUrl = userProfile?.ProfilePictureUrl,
            Bio = userProfile?.Bio,
            Language = userProfile?.Language ?? "en",
            TwoFactorEnabled = userProfile?.TwoFactorEnabled ?? false,
            CreatedAt = user.CreatedAt,
            Roles = user.UserRoles
                .Where(ur => ur.Role?.IsActive == true)
                .Select(ur => ur.Role!.Name)
                .ToList(),
            Claims = claims.Select(c => new UserClaimDto
            {
                ClaimType = c.ClaimType,
                ClaimValue = c.ClaimValue
            }).ToList()
        };
    }

    /// <summary>
    /// Update profile atomically:
    /// load user (tracked) + load profile (tracked) → update both → single SaveChanges.
    /// Client cannot modify: Id, Roles, Claims, security flags via this method.
    /// </summary>
    public async Task UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken = default)
    {
        // Load tracked user (EF will track changes)
        var user = await _userRepository.GetTrackedUserByIdAsync(userId, cancellationToken);

        if (user == null)
            throw new InvalidOperationException("User not found.");

        // Update allowed user fields only
        if (!string.IsNullOrWhiteSpace(request.FirstName))
            user.SetFirstName(request.FirstName);

        if (!string.IsNullOrWhiteSpace(request.LastName))
            user.SetLastName(request.LastName);

        // Load tracked profile
        var userProfile = await _userProfileRepository.GetByUserIdAsync(userId, cancellationToken);

        if (userProfile == null)
        {
            // Create new profile
            var profileName = $"{request.FirstName} {request.LastName}".Trim();
            if (string.IsNullOrWhiteSpace(profileName))
                profileName = user.Username;

            userProfile = new Domain.Entities.UserProfile(userId, profileName);
            userProfile.SetBio(request.Bio);
            userProfile.SetPhoneNumber(request.PhoneNumber);
            userProfile.SetProfilePictureUrl(request.ProfilePictureUrl);

            await _userProfileRepository.AddAsync(userProfile, cancellationToken);
        }
        else
        {
            // Update existing profile (tracked entity — EF detects changes)
            userProfile.SetBio(request.Bio);
            userProfile.SetPhoneNumber(request.PhoneNumber);
            userProfile.SetProfilePictureUrl(request.ProfilePictureUrl);

            if (!string.IsNullOrWhiteSpace(request.Language))
                userProfile.SetLanguage(request.Language);
        }

        // Single SaveChanges for both user + profile atomically
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
