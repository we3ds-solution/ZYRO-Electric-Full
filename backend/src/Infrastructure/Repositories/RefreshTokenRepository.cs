using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

/// <summary>
/// RefreshToken repository — data access only.
/// Does NOT call SaveChangesAsync; callers use IUnitOfWork for that.
/// </summary>
public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _context;

    public RefreshTokenRepository(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token, cancellationToken);
    }

    public async Task<RefreshToken?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<RefreshToken>> GetUserTokensAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.RefreshTokens
            .Where(rt => rt.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<RefreshToken>> GetActiveUserTokensAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Stage token for insertion — caller must call IUnitOfWork.SaveChangesAsync().
    /// </summary>
    public async Task AddAsync(RefreshToken token, CancellationToken cancellationToken = default)
    {
        await _context.RefreshTokens.AddAsync(token, cancellationToken);
        // No SaveChanges here — use IUnitOfWork
    }

    /// <summary>
    /// Revoke all active tokens for a user and stage the update.
    /// Caller must call IUnitOfWork.SaveChangesAsync().
    /// </summary>
    public async Task RevokeAllUserTokensAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync(cancellationToken);

        foreach (var token in tokens)
        {
            token.Revoke();
        }
        // No SaveChanges here — use IUnitOfWork
    }
}
