using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// Permission entity - single responsibility: Individual permission definition
/// Represents a specific action on a resource (Resource:Action)
/// </summary>
public class Permission : AggregateRoot
{
    private readonly List<RolePermission> _rolePermissions = new();

    private Permission() { }

    /// <summary>
    /// Create new permission with resource and action
    /// </summary>
    public Permission(string name, string resource, string action, string description = "")
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Resource = resource ?? throw new ArgumentNullException(nameof(resource));
        Action = action ?? throw new ArgumentNullException(nameof(action));
        Description = description ?? string.Empty;
    }

    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string Resource { get; private set; } = string.Empty;
    public string Action { get; private set; } = string.Empty;

    // Navigation properties
    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();

    /// <summary>
    /// Get combined permission identifier (Resource:Action)
    /// </summary>
    public string GetPermissionIdentifier() => $"{Resource}:{Action}";

    public void UpdateDescription(string description)
    {
        Description = description ?? string.Empty;
        UpdatedAtNow();
    }
}
