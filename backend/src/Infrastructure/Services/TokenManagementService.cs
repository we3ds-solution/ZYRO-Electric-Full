using Application.Dtos.Auth;
using Application.Services;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Authentication;

namespace Infrastructure.Services;

/// <summary>
/// Token management service — JWT and refresh token lifecycle.
/// Refresh flow: lookup token → validate → load user from DB → rotate → commit atomically.
/// </summary>
public class TokenManagementService : ITokenManagementService
{
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtSettings _jwtSettings;

    public TokenManagementService(
        IJwtTokenService jwtTokenService,
        IRefreshTokenRepository refreshTokenRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        JwtSettings jwtSettings)
    {
        _jwtTokenService = jwtTokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _jwtSettings = jwtSettings;
    }

    /// <summary>
    /// Full refresh token rotation — no null user accepted, no caller trust for user/roles.
    /// Flow: lookup token → validate → load user from token.UserId → validate active
    ///       → revoke old → generate + persist new → commit atomically.
    /// </summary>
    public async Task<RefreshTokenResponse> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default)
    {
        var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken, cancellationToken);

        if (token == null)
            throw new UnauthorizedAccessException("Refresh token not found.");

        if (token.IsRevoked)
            throw new UnauthorizedAccessException("Refresh token has been revoked. Possible token theft — please log in again.");

        if (token.IsExpired)
            throw new UnauthorizedAccessException("Refresh token has expired. Please log in again.");

        // Load user from DB using token.UserId — never trust caller for user identity
        var user = await _userRepository.GetUserWithRolesAsync(token.UserId, cancellationToken);

        if (user == null)
            throw new UnauthorizedAccessException("Associated user not found.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("User account is deactivated.");

        var roles = user.UserRoles
            .Where(ur => ur.Role?.IsActive == true)
            .Select(ur => ur.Role!.Name)
            .ToList();

        // Revoke old token (EF tracking handles the update)
        token.Revoke();

        // Generate and stage new refresh token
        var newRefreshTokenValue = _jwtTokenService.GenerateRefreshToken();
        var newRefreshTokenEntity = new RefreshToken(
            user.Id,
            newRefreshTokenValue,
            _jwtSettings.RefreshTokenExpirationDays);
        await _refreshTokenRepository.AddAsync(newRefreshTokenEntity, cancellationToken);

        // Generate new access token
        var newAccessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Username, roles);

        // Commit both revocation + new token atomically
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new RefreshTokenResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshTokenValue,
            ExpiresIn = _jwtSettings.ExpirationMinutes * 60
        };
    }

    public async Task RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken, cancellationToken);

        if (token == null)
            throw new InvalidOperationException("Refresh token not found.");

        if (token.IsRevoked)
            return; // Already revoked — idempotent

        token.Revoke();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task RevokeAllUserTokensAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await _refreshTokenRepository.RevokeAllUserTokensAsync(userId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public string GenerateAccessToken(Guid userId, string username, IEnumerable<string> roles)
        => _jwtTokenService.GenerateAccessToken(userId, username, roles);

    public string GenerateRefreshToken()
        => _jwtTokenService.GenerateRefreshToken();
}
