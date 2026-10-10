using Application.Services;
using Infrastructure.Repositories;

namespace Infrastructure.Services;

/// <summary>
/// Session service - single responsibility: user session management (logout)
/// </summary>
public class SessionService : ISessionService
{
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public SessionService(IRefreshTokenRepository refreshTokenRepository)
    {
        _refreshTokenRepository = refreshTokenRepository;
    }

    public async Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await _refreshTokenRepository.RevokeAllUserTokensAsync(userId, cancellationToken);
    }
}
