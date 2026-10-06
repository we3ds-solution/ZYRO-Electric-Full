using Domain.Entities;

namespace Infrastructure.Repositories;

/// <summary>
/// UserProfile repository interface — data access only.
/// No SaveChangesAsync — use IUnitOfWork from Infrastructure.Persistence.
/// </summary>
public interface IUserProfileRepository
{
    Task<UserProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserClaim>> GetUserClaimsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(UserProfile profile, CancellationToken cancellationToken = default);
}
