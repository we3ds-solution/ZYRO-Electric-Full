using Application.Services;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services;

/// <summary>
/// Memory cache service implementation using IMemoryCache
/// </summary>
public class MemoryCacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;

    public MemoryCacheService(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;
    }

    public T? Get<T>(string key)
    {
        return _memoryCache.TryGetValue(key, out T? value) ? value : default;
    }

    public void Set<T>(string key, T value, double expirationMs)
    {
        var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMilliseconds(expirationMs));

        _memoryCache.Set(key, value, cacheEntryOptions);
    }
}
