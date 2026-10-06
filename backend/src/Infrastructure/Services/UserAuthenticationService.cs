using Application.Dtos.Auth;
using Application.Services;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Authentication;

namespace Infrastructure.Services;

/// <summary>
/// User authentication service — login and registration.
/// Critical fix: both flows now PERSIST refresh tokens before returning.
/// All changes committed atomically via IUnitOfWork.
/// </summary>
public class UserAuthenticationService : IUserAuthenticationService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IPasswordService _passwordService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtSettings _jwtSettings;

    public UserAuthenticationService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IPasswordService passwordService,
        IJwtTokenService jwtTokenService,
        IUnitOfWork unitOfWork,
        JwtSettings jwtSettings)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _passwordService = passwordService;
        _jwtTokenService = jwtTokenService;
        _unitOfWork = unitOfWork;
        _jwtSettings = jwtSettings;
    }

    /// <summary>
    /// Login flow:
    /// validate credentials → update LastLogin → generate tokens → persist refresh token → commit.
    /// </summary>
    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        // Load tracked user with roles (EF tracks changes for LastLogin update)
        var user = await _userRepository.GetUserWithRolesByUsernameAsync(request.Username, cancellationToken);

        if (user == null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("User account is deactivated.");

        var roles = user.UserRoles
            .Where(ur => ur.Role?.IsActive == true)
            .Select(ur => ur.Role!.Name)
            .ToList();

        user.UpdateLastLogin();

        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Username, roles);
        var refreshTokenValue = _jwtTokenService.GenerateRefreshToken();

        // CRITICAL FIX: persist refresh token (was missing before)
        var refreshTokenEntity = new RefreshToken(user.Id, refreshTokenValue, _jwtSettings.RefreshTokenExpirationDays);
        await _refreshTokenRepository.AddAsync(refreshTokenEntity, cancellationToken);

        // Commit LastLogin update + new refresh token atomically
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.GetFullName(),
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            ExpiresIn = _jwtSettings.ExpirationMinutes * 60,
            Roles = roles
        };
    }

    /// <summary>
    /// Register flow:
    /// check uniqueness → create user → generate tokens → persist refresh token → commit.
    /// DB unique constraints are the final integrity guarantee against race conditions.
    /// </summary>
    public async Task<LoginResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        // Application-level checks for friendly error messages
        if (await _userRepository.UsernameExistsAsync(request.Username, cancellationToken))
            throw new InvalidOperationException("Username is already taken.");

        if (await _userRepository.EmailExistsAsync(request.Email, cancellationToken))
            throw new InvalidOperationException("Email is already registered.");

        var user = new User(request.Username, request.Email, request.FirstName, request.LastName);
        user.SetPasswordHash(_passwordService.HashPassword(request.Password));

        await _userRepository.AddAsync(user, cancellationToken);

        var roles = new List<string> { "User" };
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Username, roles);
        var refreshTokenValue = _jwtTokenService.GenerateRefreshToken();

        // CRITICAL FIX: persist refresh token (was missing before)
        var refreshTokenEntity = new RefreshToken(user.Id, refreshTokenValue, _jwtSettings.RefreshTokenExpirationDays);
        await _refreshTokenRepository.AddAsync(refreshTokenEntity, cancellationToken);

        // Commit user + refresh token atomically
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.GetFullName(),
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            ExpiresIn = _jwtSettings.ExpirationMinutes * 60,
            Roles = roles
        };
    }
}
