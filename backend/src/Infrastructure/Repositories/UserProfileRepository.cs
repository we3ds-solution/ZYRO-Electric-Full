using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

/// <summary>
/// UserProfile repository — data access only.
/// Does NOT call SaveChangesAsync; callers use IUnitOfWork for that.
/// </summary>
public class UserProfileRepository : IUserProfileRepository
{
    private readonly AppDbContext _context;

    public UserProfileRepository(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UserProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<UserClaim>> GetUserClaimsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserClaims
            .AsNoTracking()
            .Where(c => c.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Stage profile for insertion — caller must call IUnitOfWork.SaveChangesAsync().
    /// </summary>
    public async Task AddAsync(UserProfile profile, CancellationToken cancellationToken = default)
    {
        await _context.UserProfiles.AddAsync(profile, cancellationToken);
        // No SaveChanges here — use IUnitOfWork
    }
}
