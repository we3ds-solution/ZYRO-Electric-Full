using Application.Dtos.Auth;

namespace Application.Services;

/// <summary>
/// Password management service interface - handles password changes
/// </summary>
public interface IPasswordManagementService
{
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken = default);
}
