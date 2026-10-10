namespace Application.Exceptions;

/// <summary>
/// Exception thrown when user is not authorized to perform an action
/// </summary>
public class UnauthorizedAccessException : Exception
{
    public UnauthorizedAccessException(string message) : base(message)
    {
    }

    public UnauthorizedAccessException(string message, Exception innerException) 
        : base(message, innerException)
    {
    }
}
