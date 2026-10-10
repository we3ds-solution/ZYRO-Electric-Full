using Application.Services;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Authentication;

/// <summary>
/// Authorization service for permission and role checking
/// </summary>
public class AuthorizationService : IAuthorizationService
{
    private readonly DbContext _context;

    public AuthorizationService(DbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasPermissionAsync(
        Guid userId,
        string resource,
        string action,
        CancellationToken cancellationToken = default)
    {
        var hasPermission = await _context.Set<User>()
            .AsNoTracking()
            .Where(u => u.Id == userId && u.IsActive)
            .SelectMany(u => u.UserRoles)
            .SelectMany(ur => ur.Role!.RolePermissions)
            .Where(rp => rp.Permission!.Resource == resource && rp.Permission.Action == action)
            .AnyAsync(cancellationToken);

        return hasPermission;
    }

    public async Task<bool> HasRoleAsync(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default)
    {
        var hasRole = await _context.Set<User>()
            .AsNoTracking()
            .Where(u => u.Id == userId && u.IsActive)
            .SelectMany(u => u.UserRoles)
            .Where(ur => ur.Role!.Name == roleName && ur.Role.IsActive)
            .AnyAsync(cancellationToken);

        return hasRole;
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var permissions = await _context.Set<User>()
            .AsNoTracking()
            .Where(u => u.Id == userId && u.IsActive)
            .SelectMany(u => u.UserRoles)
            .SelectMany(ur => ur.Role!.RolePermissions)
            .Where(rp => rp.Permission!.Resource != null && rp.Permission.Action != null)
            .Select(rp => $"{rp.Permission!.Resource}:{rp.Permission.Action}")
            .Distinct()
            .ToListAsync(cancellationToken);

        return permissions;
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var roles = await _context.Set<User>()
            .AsNoTracking()
            .Where(u => u.Id == userId && u.IsActive)
            .SelectMany(u => u.UserRoles)
            .Where(ur => ur.Role!.IsActive)
            .Select(ur => ur.Role!.Name)
            .Distinct()
            .ToListAsync(cancellationToken);

        return roles;
    }
}
