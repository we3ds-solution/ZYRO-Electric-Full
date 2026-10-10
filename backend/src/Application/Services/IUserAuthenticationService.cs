using Application.Dtos.Auth;

namespace Application.Services;

/// <summary>
/// User authentication service interface - handles login and registration
/// </summary>
public interface IUserAuthenticationService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<LoginResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
}
