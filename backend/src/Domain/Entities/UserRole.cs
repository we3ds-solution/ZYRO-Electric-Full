using Domain.Common;

namespace Domain.Entities;

/// <summary>
/// UserRole entity - single responsibility: User-to-Role relationship
/// Represents many-to-many relationship between Users and Roles
/// Not an aggregate root, owned by User aggregate
/// </summary>
public class UserRole : BaseEntity
{
    private UserRole() { }

    /// <summary>
    /// Create user-role relationship
    /// </summary>
    public UserRole(Guid userId, Guid roleId)
    {
        UserId = userId;
        RoleId = roleId;
    }

    public Guid UserId { get; private set; }
    public Guid RoleId { get; private set; }

    // Navigation properties
    public User? User { get; set; }
    public Role? Role { get; set; }
}
