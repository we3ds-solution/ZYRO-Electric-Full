using Application.Dtos.Auth;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Utilities;

namespace Presentation.Controllers;

/// <summary>
/// Authentication controller - delegates to focused domain services
/// Single responsibility: HTTP routing and response formatting only
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IUserAuthenticationService _userAuthService;
    private readonly ITokenManagementService _tokenService;
    private readonly IPasswordManagementService _passwordService;
    private readonly IUserProfileService _profileService;
    private readonly ISessionService _sessionService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserAuthenticationService userAuthService,
        ITokenManagementService tokenService,
        IPasswordManagementService passwordService,
        IUserProfileService profileService,
        ISessionService sessionService,
        ILogger<AuthController> logger)
    {
        _userAuthService = userAuthService;
        _tokenService = tokenService;
        _passwordService = passwordService;
        _profileService = profileService;
        _sessionService = sessionService;
        _logger = logger;
    }

    /// <summary>
    /// Login with username and password
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _userAuthService.LoginAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Login failed for user: {Username}", request.Username);
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login for user: {Username}", request.Username);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (request.Password != request.ConfirmPassword)
                return BadRequest(new { message = "Passwords do not match" });

            var response = await _userAuthService.RegisterAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Registration failed for user: {Username}", request.Username);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during registration for user: {Username}", request.Username);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Refresh access token using refresh token
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(RefreshTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken(
        [FromBody] RefreshTokenRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _tokenService.RefreshTokenAsync(
                request.RefreshToken,
                cancellationToken);
            
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Token refresh failed");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during token refresh");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Get current user profile
    /// </summary>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetProfile(
        CancellationToken cancellationToken = default)
    {
        var userId = ClaimsHelper.GetUserId(User);
        if (userId == Guid.Empty)
            return Unauthorized();

        try
        {
            var profile = await _profileService.GetProfileAsync(userId, cancellationToken);
            return Ok(profile);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "User not found: {UserId}", userId);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for user: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Update user profile
    /// </summary>
    [HttpPut("profile")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = ClaimsHelper.GetUserId(User);
        if (userId == Guid.Empty)
            return Unauthorized();

        try
        {
            await _profileService.UpdateProfileAsync(userId, request, cancellationToken);
            return Ok(new { message = "Profile updated successfully" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error updating profile for user: {UserId}", userId);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error updating profile for user: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Change password
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = ClaimsHelper.GetUserId(User);
        if (userId == Guid.Empty)
            return Unauthorized();

        if (request.NewPassword != request.ConfirmPassword)
            return BadRequest(new { message = "Passwords do not match" });

        try
        {
            await _passwordService.ChangePasswordAsync(userId, request, cancellationToken);
            return Ok(new { message = "Password changed successfully" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Error changing password for user: {UserId}", userId);
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Invalid current password for user: {UserId}", userId);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error changing password for user: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Logout - revoke all user tokens
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout(
        CancellationToken cancellationToken = default)
    {
        var userId = ClaimsHelper.GetUserId(User);
        if (userId == Guid.Empty)
            return Unauthorized();

        try
        {
            await _sessionService.LogoutAsync(userId, cancellationToken);
            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging out user: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    /// <summary>
    /// Revoke specific refresh token
    /// </summary>
    [HttpPost("revoke")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RevokeToken(
        [FromBody] RefreshTokenRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _tokenService.RevokeTokenAsync(request.RefreshToken, cancellationToken);
            return Ok(new { message = "Token revoked successfully" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Token not found for revocation");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error revoking token");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
