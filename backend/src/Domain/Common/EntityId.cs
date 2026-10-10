namespace Domain.Common;

/// <summary>
/// Entity identifier value object - single responsibility: Strongly typed ID
/// Prevents passing wrong IDs to methods
/// Example: User.GetById(userId) ensures correct type is passed
/// </summary>
public abstract class EntityId : IEquatable<EntityId>
{
    protected EntityId(Guid value)
    {
        if (value == Guid.Empty)
            throw new ArgumentException("Entity ID cannot be empty");

        Value = value;
    }

    public Guid Value { get; }

    public bool Equals(EntityId? other)
    {
        if (other is null)
            return false;

        return Value == other.Value && GetType() == other.GetType();
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as EntityId);
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public override string ToString()
    {
        return Value.ToString();
    }

    public static bool operator ==(EntityId? left, EntityId? right)
    {
        if (left is null && right is null)
            return true;

        if (left is null || right is null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(EntityId? left, EntityId? right)
    {
        return !(left == right);
    }
}

/// <summary>
/// User ID value object - single responsibility: Strongly typed user identifier
/// </summary>
public sealed class UserId : EntityId
{
    public UserId(Guid value) : base(value) { }

    public static UserId Create() => new(Guid.NewGuid());
    public static UserId From(Guid value) => new(value);
}

/// <summary>
/// Role ID value object - single responsibility: Strongly typed role identifier
/// </summary>
public sealed class RoleId : EntityId
{
    public RoleId(Guid value) : base(value) { }

    public static RoleId Create() => new(Guid.NewGuid());
    public static RoleId From(Guid value) => new(value);
}

/// <summary>
/// Permission ID value object - single responsibility: Strongly typed permission identifier
/// </summary>
public sealed class PermissionId : EntityId
{
    public PermissionId(Guid value) : base(value) { }

    public static PermissionId Create() => new(Guid.NewGuid());
    public static PermissionId From(Guid value) => new(value);
}

/// <summary>
/// RefreshToken ID value object - single responsibility: Strongly typed refresh token identifier
/// </summary>
public sealed class RefreshTokenId : EntityId
{
    public RefreshTokenId(Guid value) : base(value) { }

    public static RefreshTokenId Create() => new(Guid.NewGuid());
    public static RefreshTokenId From(Guid value) => new(value);
}

/// <summary>
/// UserProfile ID value object - single responsibility: Strongly typed user profile identifier
/// </summary>
public sealed class UserProfileId : EntityId
{
    public UserProfileId(Guid value) : base(value) { }

    public static UserProfileId Create() => new(Guid.NewGuid());
    public static UserProfileId From(Guid value) => new(value);
}
