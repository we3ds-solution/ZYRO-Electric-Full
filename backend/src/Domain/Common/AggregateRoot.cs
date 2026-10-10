namespace Domain.Common;

/// <summary>
/// Aggregate root - single responsibility: Define boundary for a domain aggregate
/// Aggregate roots contain related entities and value objects that form a consistency boundary
/// Only aggregate roots should be queried from repositories
/// </summary>
public abstract class AggregateRoot : BaseEntity
{
    /// <summary>
    /// Domain events that occurred on this aggregate
    /// Events are raised during business operations
    /// </summary>
    private readonly List<DomainEvent> _domainEvents = new();

    /// <summary>
    /// Get all domain events raised on this aggregate
    /// </summary>
    public IReadOnlyCollection<DomainEvent> GetDomainEvents() => _domainEvents.AsReadOnly();

    /// <summary>
    /// Add a domain event
    /// Single responsibility: Event tracking
    /// </summary>
    protected void AddDomainEvent(DomainEvent @event)
    {
        _domainEvents.Add(@event);
    }

    /// <summary>
    /// Clear all domain events after they are processed
    /// Single responsibility: Event cleanup
    /// </summary>
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}

/// <summary>
/// Base class for domain events
/// Single responsibility: Define domain event contract
/// </summary>
public abstract class DomainEvent
{
    protected DomainEvent()
    {
        OccurredAt = DateTime.UtcNow;
        EventId = Guid.NewGuid();
    }

    public Guid EventId { get; }
    public DateTime OccurredAt { get; }
}
