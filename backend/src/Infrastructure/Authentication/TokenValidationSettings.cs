using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication;

/// <summary>
/// Token validation settings - single responsibility: JWT validation configuration
/// No duplication - used by both JwtTokenService and AuthenticationExtensions
/// </summary>
public static class TokenValidationSettings
{
    /// <summary>
    /// Create token validation parameters from JWT settings
    /// </summary>
    public static TokenValidationParameters Create(JwtSettings settings)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret));

        return new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = settings.Issuer,
            ValidAudience = settings.Audience,
            IssuerSigningKey = key,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            NameClaimType = System.Security.Claims.ClaimTypes.Name,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role
        };
    }
}
