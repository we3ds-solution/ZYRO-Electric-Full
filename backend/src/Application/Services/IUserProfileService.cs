using Application.Dtos.Auth;

namespace Application.Services;

/// <summary>
/// User profile service interface
/// </summary>
public interface IUserProfileService
{
    Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update allowed profile fields only (firstName, lastName, bio, phone, picture, language).
    /// Does NOT expose Id, Roles, Claims, or security flags.
    /// </summary>
    Task UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken = default);
}
