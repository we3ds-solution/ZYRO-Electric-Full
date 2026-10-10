using Application.Services;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Infrastructure.Authentication;

/// <summary>
/// Authentication and authorization dependency injection extensions
/// Single responsibility: Configure DI for authentication services following DIP
/// </summary>
public static class AuthenticationExtensions
{
    /// <summary>
    /// Add JWT authentication - single responsibility: JWT setup
    /// Uses TokenValidationSettings to eliminate duplication
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSettings = new JwtSettings();
        configuration.GetSection("JwtSettings").Bind(jwtSettings);

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Use centralized token validation settings - DRY principle
                options.TokenValidationParameters = TokenValidationSettings.Create(jwtSettings);

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception is Microsoft.IdentityModel.Tokens.SecurityTokenExpiredException)
                        {
                            context.Response.Headers["X-Token-Expired"] = "true";
                        }
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddSingleton(jwtSettings);
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        return services;
    }

    /// <summary>
    /// Add repository layer and UnitOfWork
    /// </summary>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<Infrastructure.Persistence.IUnitOfWork, Infrastructure.Persistence.UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        return services;
    }

    /// <summary>
    /// Add authentication domain services - single responsibility: auth use cases
    /// Each service has one reason to change
    /// </summary>
    public static IServiceCollection AddDomainAuthenticationServices(
        this IServiceCollection services)
    {
        services.AddScoped<IUserAuthenticationService, UserAuthenticationService>();
        services.AddScoped<ITokenManagementService, TokenManagementService>();
        services.AddScoped<IPasswordManagementService, PasswordManagementService>();
        services.AddScoped<IUserProfileService, UserProfileService>();
        services.AddScoped<ISessionService, SessionService>();
        services.AddScoped<IPasswordService, PasswordService>();

        return services;
    }

    /// <summary>
    /// Add authorization services - single responsibility: authorization logic
    /// Uses caching strategy per included requirements
    /// </summary>
    public static IServiceCollection AddAuthorizationServices(
        this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddSingleton<ICacheService, MemoryCacheService>();

        services.AddScoped<Application.Services.IAuthorizationService, AuthorizationService>();
        
        // Add caching wrapper for authorization service
        services.Decorate<Application.Services.IAuthorizationService, CachedAuthorizationService>();

        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionHandler>();

        services
            .AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
                options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
                options.AddPolicy("EmailVerified", policy => policy.RequireClaim("email_verified", "true"));
            });

        return services;
    }

    /// <summary>
    /// Add CORS configuration - single responsibility: CORS setup
    /// </summary>
    public static IServiceCollection AddAppCors(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddPolicy("AppCorsPolicy", builder =>
            {
                builder
                    .WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        return services;
    }

    /// <summary>
    /// Add all authentication services - convenience method
    /// </summary>
    public static IServiceCollection AddCompleteAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddJwtAuthentication(configuration);
        services.AddRepositories();
        services.AddDomainAuthenticationServices();
        services.AddAuthorizationServices();
        services.AddAppCors(configuration);

        return services;
    }
}

/// <summary>
/// Decorator pattern helper for wrapping services
/// </summary>
public static class DecoratorExtensions
{
    public static IServiceCollection Decorate<TInterface, TDecorator>(this IServiceCollection services)
        where TInterface : class
        where TDecorator : class, TInterface
    {
        var wrappedDescriptor = services.FirstOrDefault(s => s.ServiceType == typeof(TInterface));
        if (wrappedDescriptor == null)
            throw new InvalidOperationException($"{typeof(TInterface).Name} is not registered");

        var objectFactory = ActivatorUtilities.CreateFactory(typeof(TDecorator), new[] { typeof(TInterface) });

        services.Replace(ServiceDescriptor.Describe(
            typeof(TInterface),
            provider => (TInterface)objectFactory(provider, new[] { provider.CreateInstance(wrappedDescriptor) })!,
            wrappedDescriptor.Lifetime));

        return services;
    }

    private static object CreateInstance(this IServiceProvider provider, ServiceDescriptor descriptor)
    {
        if (descriptor.ImplementationInstance != null)
            return descriptor.ImplementationInstance;

        if (descriptor.ImplementationFactory != null)
            return descriptor.ImplementationFactory(provider);

        return ActivatorUtilities.GetServiceOrCreateInstance(provider, descriptor.ImplementationType!);
    }
}
