using Application.Dtos.Auth;
using System.Security.Claims;

namespace Application.Services;

/// <summary>
/// JWT token service interface - single responsibility: token generation and validation
/// </summary>
public interface IJwtTokenService
{
    string GenerateAccessToken(Guid userId, string username, IEnumerable<string> roles, IEnumerable<Claim> claims = null!);
    string GenerateRefreshToken();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    bool ValidateToken(string token);
}

/// <summary>
/// Password service interface - single responsibility: password hashing and verification
/// </summary>
public interface IPasswordService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}

/// <summary>
/// Authorization service interface - single responsibility: permission and role checks
/// </summary>
public interface IAuthorizationService
{
    Task<bool> HasPermissionAsync(Guid userId, string resource, string action, CancellationToken cancellationToken = default);
    Task<bool> HasRoleAsync(Guid userId, string roleName, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);
}

/// <summary>
/// OAuth service interface - single responsibility: external provider authentication
/// </summary>
public interface IOAuthService
{
    Task<LoginResponse> AuthenticateWithProviderAsync(string provider, string code, CancellationToken cancellationToken = default);
    string GetAuthorizationUrl(string provider, string returnUrl);
}

