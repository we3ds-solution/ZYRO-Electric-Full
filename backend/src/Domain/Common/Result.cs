namespace Domain.Common;

/// <summary>
/// Result type - single responsibility: Represent operation success or failure
/// Used by value objects for validation results
/// Enables functional error handling without exceptions
/// </summary>
public abstract class Result<T>
{
    protected Result() { }

    public sealed class Success : Result<T>
    {
        public T Value { get; }
        public Success(T value) => Value = value;
    }

    public sealed class Failure : Result<T>
    {
        public string Error { get; }
        public Failure(string error) => Error = error;
    }

    public TResult Match<TResult>(
        Func<T, TResult> onSuccess,
        Func<string, TResult> onFailure)
    {
        return this switch
        {
            Success s => onSuccess(s.Value),
            Failure f => onFailure(f.Error),
            _ => throw new InvalidOperationException("Unknown result type")
        };
    }

    public void Match(
        Action<T> onSuccess,
        Action<string> onFailure)
    {
        _ = Match<object?>(
            v => { onSuccess(v); return null; },
            e => { onFailure(e); return null; });
    }

    public static Result<T> SuccessResult(T value) => new Success(value);
    public static Result<T> FailureResult(string error) => new Failure(error);
}

/// <summary>
/// Result type without value - for operations that don't return data
/// </summary>
public abstract class Result
{
    protected Result() { }

    public sealed class Success : Result { }
    
    public sealed class Failure : Result
    {
        public string Error { get; }
        public Failure(string error) => Error = error;
    }

    public TResult Match<TResult>(
        Func<TResult> onSuccess,
        Func<string, TResult> onFailure)
    {
        return this switch
        {
            Success _ => onSuccess(),
            Failure f => onFailure(f.Error),
            _ => throw new InvalidOperationException("Unknown result type")
        };
    }

    public void Match(
        Action onSuccess,
        Action<string> onFailure)
    {
        _ = Match<object?>(
            () => { onSuccess(); return null; },
            e => { onFailure(e); return null; });
    }

    public static Result SuccessResult() => new Success();
    public static Result FailureResult(string error) => new Failure(error);
}
