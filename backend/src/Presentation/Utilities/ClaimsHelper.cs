using System.Security.Claims;

namespace Presentation.Utilities;

/// <summary>
/// Claims helper utility - single responsibility: extract claims from ClaimsPrincipal
/// Eliminates duplication of claim extraction logic across controllers
/// </summary>
public static class ClaimsHelper
{
    /// <summary>
    /// Extract user ID from claims
    /// </summary>
    public static Guid GetUserId(ClaimsPrincipal user)
    {
        var claim = user?.FindFirst(ClaimTypes.NameIdentifier);
        if (claim != null && Guid.TryParse(claim.Value, out var userId))
            return userId;

        return Guid.Empty;
    }

    /// <summary>
    /// Extract username from claims
    /// </summary>
    public static string GetUsername(ClaimsPrincipal user)
    {
        var claim = user?.FindFirst(ClaimTypes.Name);
        return claim?.Value ?? string.Empty;
    }

    /// <summary>
    /// Extract email from claims
    /// </summary>
    public static string GetEmail(ClaimsPrincipal user)
    {
        var claim = user?.FindFirst(ClaimTypes.Email);
        return claim?.Value ?? string.Empty;
    }

    /// <summary>
    /// Get user roles from claims
    /// </summary>
    public static IEnumerable<string> GetRoles(ClaimsPrincipal user)
    {
        return user?.FindAll(ClaimTypes.Role).Select(c => c.Value) ?? Enumerable.Empty<string>();
    }

    /// <summary>
    /// Check if user is authenticated
    /// </summary>
    public static bool IsAuthenticated(ClaimsPrincipal user)
    {
        return user?.Identity?.IsAuthenticated ?? false;
    }

    /// <summary>
    /// Check if user has specific role
    /// </summary>
    public static bool HasRole(ClaimsPrincipal user, string role)
    {
        return GetRoles(user).Contains(role, StringComparer.OrdinalIgnoreCase);
    }
}
