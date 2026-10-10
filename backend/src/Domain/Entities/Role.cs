using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// Role entity - single responsibility: Permission group definition
/// Represents a group of permissions assigned to users
/// </summary>
public class Role : AggregateRoot
{
    private readonly List<RolePermission> _rolePermissions = new();

    private Role() { }

    /// <summary>
    /// Create new role with name and description
    /// </summary>
    public Role(string name, string description = "")
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Description = description ?? string.Empty;
        IsActive = true;
    }

    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }

    // Navigation properties
    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();

    // Business methods
    public void Deactivate()
    {
        IsActive = false;
        UpdatedAtNow();
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAtNow();
    }

    public void UpdateDescription(string description)
    {
        Description = description ?? string.Empty;
        UpdatedAtNow();
    }

    public void AddPermission(RolePermission permission)
    {
        if (permission is null)
            throw new ArgumentNullException(nameof(permission));

        if (_rolePermissions.Any(p => p.PermissionId == permission.PermissionId))
            return; // Permission already assigned

        _rolePermissions.Add(permission);
        UpdatedAtNow();
    }

    public void RemovePermission(Guid permissionId)
    {
        var permission = _rolePermissions.FirstOrDefault(p => p.PermissionId == permissionId);
        if (permission is not null)
        {
            _rolePermissions.Remove(permission);
            UpdatedAtNow();
        }
    }
}
