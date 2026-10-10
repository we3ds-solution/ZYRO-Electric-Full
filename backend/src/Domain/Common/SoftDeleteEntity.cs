namespace Domain.Common;

/// <summary>
/// Soft delete entity - single responsibility: logical deletion without removing data
/// Inherits from BaseEntity and adds soft delete capability
/// Used for entities that should support historical tracking and auditing
/// </summary>
public abstract class SoftDeleteEntity : BaseEntity
{
    /// <summary>
    /// Indicates if entity is logically deleted
    /// Query filters should exclude IsDeleted = true
    /// </summary>
    public bool IsDeleted { get; protected set; }
    
    /// <summary>
    /// Timestamp when entity was deleted (UTC)
    /// Null if entity is not deleted
    /// </summary>
    public DateTime? DeletedAt { get; protected set; }

    /// <summary>
    /// Soft delete: mark entity as deleted without removing data
    /// Single responsibility: Logical deletion
    /// </summary>
    public virtual void Delete()
    {
        IsDeleted = true;
        DeletedAt = DateTime.UtcNow;
        UpdatedAtNow();
    }

    /// <summary>
    /// Restore a soft-deleted entity
    /// Single responsibility: Logical restoration
    /// </summary>
    public virtual void Restore()
    {
        IsDeleted = false;
        DeletedAt = null;
        UpdatedAtNow();
    }
}
