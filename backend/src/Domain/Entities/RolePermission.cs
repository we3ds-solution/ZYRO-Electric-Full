using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// RolePermission entity - single responsibility: Role-to-Permission relationship
/// Represents many-to-many relationship between Roles and Permissions
/// Not an aggregate root, owned by Role aggregate
/// </summary>
public class RolePermission : BaseEntity
{
    private RolePermission() { }

    /// <summary>
    /// Create role-permission relationship
    /// </summary>
    public RolePermission(Guid roleId, Guid permissionId)
    {
        RoleId = roleId;
        PermissionId = permissionId;
    }

    public Guid RoleId { get; private set; }
    public Guid PermissionId { get; private set; }

    // Navigation properties
    public Role? Role { get; set; }
    public Permission? Permission { get; set; }
}
