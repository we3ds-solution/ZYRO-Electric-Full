using Application.Services;

namespace Infrastructure.Services;

/// <summary>
/// Cached authorization service - single responsibility: permission caching
/// Implements caching strategy from included requirements
/// </summary>
public class CachedAuthorizationService : IAuthorizationService
{
    private readonly IAuthorizationService _innerService;
    private readonly ICacheService _cacheService;
    private const int PermissionCacheDurationMinutes = 60;

    public CachedAuthorizationService(
        IAuthorizationService innerService,
        ICacheService cacheService)
    {
        _innerService = innerService;
        _cacheService = cacheService;
    }

    public async Task<bool> HasPermissionAsync(
        Guid userId,
        string resource,
        string action,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"permission:{userId}:{resource}:{action}";

        // Check memory cache first
        var cached = _cacheService.Get<bool?>(cacheKey);
        if (cached.HasValue)
            return cached.Value;

        // Query database if not cached
        var hasPermission = await _innerService.HasPermissionAsync(userId, resource, action, cancellationToken);

        // Cache result
        _cacheService.Set(cacheKey, hasPermission, PermissionCacheDurationMinutes * 60 * 1000);

        return hasPermission;
    }

    public async Task<bool> HasRoleAsync(
        Guid userId,
        string roleName,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"role:{userId}:{roleName}";

        var cached = _cacheService.Get<bool?>(cacheKey);
        if (cached.HasValue)
            return cached.Value;

        var hasRole = await _innerService.HasRoleAsync(userId, roleName, cancellationToken);

        _cacheService.Set(cacheKey, hasRole, PermissionCacheDurationMinutes * 60 * 1000);

        return hasRole;
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"permissions:{userId}";

        var cached = _cacheService.Get<IEnumerable<string>?>(cacheKey);
        if (cached != null)
            return cached;

        var permissions = await _innerService.GetUserPermissionsAsync(userId, cancellationToken);
        var permissionsList = permissions.ToList();

        _cacheService.Set(cacheKey, permissionsList, PermissionCacheDurationMinutes * 60 * 1000);

        return permissionsList;
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"roles:{userId}";

        var cached = _cacheService.Get<IEnumerable<string>?>(cacheKey);
        if (cached != null)
            return cached;

        var roles = await _innerService.GetUserRolesAsync(userId, cancellationToken);
        var rolesList = roles.ToList();

        _cacheService.Set(cacheKey, rolesList, PermissionCacheDurationMinutes * 60 * 1000);

        return rolesList;
    }
}
