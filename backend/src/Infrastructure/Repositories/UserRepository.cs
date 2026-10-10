using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

/// <summary>
/// User repository — data access only.
/// Does NOT call SaveChangesAsync; callers use IUnitOfWork for that.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }

    public async Task<User?> GetUserByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetUserWithRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive, cancellationToken);
    }

    // Tracked version used by login (EF tracks LastLogin update)
    public async Task<User?> GetUserWithRolesByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == username && u.IsActive, cancellationToken);
    }

    public async Task<User?> GetUserWithPermissionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r!.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive, cancellationToken);
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Where(u => u.Id == userId && u.IsActive)
            .SelectMany(u => u.UserRoles)
            .Where(ur => ur.Role!.IsActive)
            .Select(ur => ur.Role!.Name)
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Where(u => u.Id == userId && u.IsActive)
            .SelectMany(u => u.UserRoles)
            .SelectMany(ur => ur.Role!.RolePermissions)
            .Select(rp => $"{rp.Permission!.Resource}:{rp.Permission.Action}")
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Stage user for insertion — caller must call IUnitOfWork.SaveChangesAsync().
    /// </summary>
    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
        // No SaveChanges here — use IUnitOfWork
    }

    /// <summary>
    /// Stage user for update — caller must call IUnitOfWork.SaveChangesAsync().
    /// </summary>
    public void Update(User user)
    {
        _context.Users.Update(user);
        // No SaveChanges here — use IUnitOfWork
    }

    public async Task<bool> ExistsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);
    }

    public async Task<bool> UsernameExistsAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Username == username, cancellationToken);
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email, cancellationToken);
    }

    /// <summary>
    /// Attach a tracked user (for update without AsNoTracking)
    /// </summary>
    public async Task<User?> GetTrackedUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }

    /// <summary>
    /// Attach a tracked user with roles
    /// </summary>
    public async Task<User?> GetTrackedUserWithRolesByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == username && u.IsActive, cancellationToken);
    }
}
