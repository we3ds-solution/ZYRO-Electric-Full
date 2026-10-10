using Domain.Entities;

namespace Infrastructure.Repositories;

/// <summary>
/// User repository interface — data access only.
/// No SaveChangesAsync — use IUnitOfWork from Infrastructure.Persistence.
/// Read methods: AsNoTracking for queries, tracked versions for updates.
/// </summary>
public interface IUserRepository
{
    // Read-only queries (AsNoTracking)
    Task<User?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetUserWithPermissionsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

    // Tracked queries (for update flows — EF tracks changes)
    Task<User?> GetUserWithRolesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetUserWithRolesByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<User?> GetTrackedUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);

    // Write operations (stage only — caller uses IUnitOfWork.SaveChangesAsync)
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    void Update(User user);
}
