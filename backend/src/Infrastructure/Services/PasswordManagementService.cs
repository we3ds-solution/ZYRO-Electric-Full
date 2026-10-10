using Application.Dtos.Auth;
using Application.Services;
using Infrastructure.Persistence;
using Infrastructure.Repositories;

namespace Infrastructure.Services;

/// <summary>
/// Password management service - single responsibility: password changes
/// Uses UnitOfWork for atomic commits.
/// </summary>
public class PasswordManagementService : IPasswordManagementService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly IUnitOfWork _unitOfWork;

    public PasswordManagementService(
        IUserRepository userRepository,
        IPasswordService passwordService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _unitOfWork = unitOfWork;
    }

    public async Task ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequest request,
        CancellationToken cancellationToken = default)
    {
        // Use tracked query so EF tracks changes to PasswordHash
        var user = await _userRepository.GetTrackedUserByIdAsync(userId, cancellationToken);

        if (user == null)
            throw new InvalidOperationException("User not found");

        if (!_passwordService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            throw new UnauthorizedAccessException("Current password is incorrect");

        var newHash = _passwordService.HashPassword(request.NewPassword);
        user.SetPasswordHash(newHash);

        // Commit change atomically
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
