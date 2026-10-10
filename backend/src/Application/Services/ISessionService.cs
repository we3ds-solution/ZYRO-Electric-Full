namespace Application.Services;

/// <summary>
/// Session service interface - handles session management
/// </summary>
public interface ISessionService
{
    Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default);
}
