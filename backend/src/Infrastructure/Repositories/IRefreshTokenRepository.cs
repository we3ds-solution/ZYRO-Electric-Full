using Domain.Entities;

namespace Infrastructure.Repositories;

/// <summary>
/// RefreshToken repository interface — data access only.
/// No SaveChangesAsync — use IUnitOfWork from Infrastructure.Persistence.
/// </summary>
public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
    Task<RefreshToken?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<RefreshToken>> GetUserTokensAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<RefreshToken>> GetActiveUserTokensAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(RefreshToken token, CancellationToken cancellationToken = default);
    Task RevokeAllUserTokensAsync(Guid userId, CancellationToken cancellationToken = default);
}
