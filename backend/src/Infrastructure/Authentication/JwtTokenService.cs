using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Application.Services;

namespace Infrastructure.Authentication;

/// <summary>
/// JWT token service implementation
/// </summary>
public class JwtTokenService : IJwtTokenService
{
    private readonly JwtSettings _jwtSettings;

    public JwtTokenService(JwtSettings jwtSettings)
    {
        _jwtSettings = jwtSettings ?? throw new ArgumentNullException(nameof(jwtSettings));
    }

    public string GenerateAccessToken(Guid userId, string username, IEnumerable<string> roles, IEnumerable<Claim> claims = null!)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claimsList = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim("username", username)
        };

        foreach (var role in roles)
        {
            claimsList.Add(new Claim(ClaimTypes.Role, role));
        }

        if (claims != null)
        {
            claimsList.AddRange(claims);
        }

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claimsList,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

        if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }

    public bool ValidateToken(string token)
    {
        try
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                IssuerSigningKey = key,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            return true;
        }
        catch
        {
            return false;
        }
    }
}

/// <summary>
/// JWT configuration settings
/// </summary>
public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 15;
    public int RefreshTokenExpirationDays { get; set; } = 7;
}
