namespace Domain.Common;

/// <summary>
/// Base entity - single responsibility: common entity properties and lifecycle
/// All domain entities inherit from this to share:
/// - Unique identifier (Guid)
/// - Audit timestamps (CreatedAt, UpdatedAt)
/// - Change tracking
/// </summary>
public abstract class BaseEntity : IEntity
{
    protected BaseEntity()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
    }

    public Guid Id { get; protected set; }
    
    /// <summary>
    /// Creation timestamp (UTC)
    /// </summary>
    public DateTime CreatedAt { get; protected set; }
    
    /// <summary>
    /// Last update timestamp (UTC)
    /// </summary>
    public DateTime? UpdatedAt { get; protected set; }

    /// <summary>
    /// Update the UpdatedAt timestamp to current UTC time
    /// Single responsibility: Track when entity was last modified
    /// </summary>
    public virtual void UpdatedAtNow()
    {
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Override Equals to compare entities by Id
    /// Single responsibility: Entity identity comparison
    /// </summary>
    public override bool Equals(object? obj)
    {
        if (obj is not BaseEntity other)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (Id == Guid.Empty || other.Id == Guid.Empty)
            return false;

        return Id == other.Id;
    }

    /// <summary>
    /// Override GetHashCode to use Id
    /// Single responsibility: Entity identity hashing
    /// </summary>
    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }

    public static bool operator ==(BaseEntity? left, BaseEntity? right)
    {
        if (left is null && right is null)
            return true;

        if (left is null || right is null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(BaseEntity? left, BaseEntity? right)
    {
        return !(left == right);
    }
}
