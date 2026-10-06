namespace Infrastructure.Persistence;

/// <summary>
/// Unit of Work abstraction.
/// Repositories perform data operations; SaveChangesAsync is called once per use-case
/// to commit all changes atomically.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Commit all pending changes to the database in a single transaction.
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
