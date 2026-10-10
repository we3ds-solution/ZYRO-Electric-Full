namespace Domain.Common;

/// <summary>
/// Base interface for all domain entities
/// Single responsibility: Define entity contract
/// </summary>
public interface IEntity
{
    Guid Id { get; }
    DateTime CreatedAt { get; }
    DateTime? UpdatedAt { get; }
}
