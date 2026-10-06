using Application.Dtos.Auth;

namespace Application.Services;

/// <summary>
/// Token management service interface — JWT and refresh token lifecycle.
/// RefreshTokenAsync looks up user from the token itself; no null user accepted.
/// </summary>
public interface ITokenManagementService
{
    /// <summary>
    /// Rotate refresh token: validate old → revoke → issue new access + refresh tokens.
    /// Loads user and roles from database using the token; does NOT accept null user.
    /// </summary>
    Task<RefreshTokenResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

    Task RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    Task RevokeAllUserTokensAsync(Guid userId, CancellationToken cancellationToken = default);
    string GenerateAccessToken(Guid userId, string username, IEnumerable<string> roles);
    string GenerateRefreshToken();
}
