namespace Application.Services;

/// <summary>
/// Cache service interface - single responsibility: cache management
/// </summary>
public interface ICacheService
{
    T? Get<T>(string key);
    void Set<T>(string key, T value, double expirationMs);
}
