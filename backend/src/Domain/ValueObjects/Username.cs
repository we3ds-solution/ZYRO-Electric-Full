namespace Domain.ValueObjects;

/// <summary>
/// Username value object - single responsibility: Username validation
/// Ensures username meets requirements (3-20 chars, alphanumeric + underscore)
/// Immutable and implements value equality
/// </summary>
public sealed class Username : IEquatable<Username>
{
    private Username(string value)
    {
        Value = value;
    }

    public string Value { get; }

    private const int MinLength = 3;
    private const int MaxLength = 20;

    /// <summary>
    /// Create username from string with validation
    /// </summary>
    public static Result<Username> Create(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            return Result<Username>.FailureResult("Username cannot be empty");

        username = username.Trim();

        if (username.Length < MinLength)
            return Result<Username>.FailureResult($"Username must be at least {MinLength} characters long");

        if (username.Length > MaxLength)
            return Result<Username>.FailureResult($"Username must not exceed {MaxLength} characters");

        if (!IsValidFormat(username))
            return Result<Username>.FailureResult("Username can only contain letters, numbers, and underscores");

        return Result<Username>.SuccessResult(new Username(username));
    }

    private static bool IsValidFormat(string username)
    {
        // Only alphanumeric and underscore allowed
        return System.Text.RegularExpressions.Regex.IsMatch(username, @"^[a-zA-Z0-9_]+$");
    }

    public bool Equals(Username? other)
    {
        if (other is null)
            return false;

        return Value.Equals(other.Value, StringComparison.OrdinalIgnoreCase);
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Username);
    }

    public override int GetHashCode()
    {
        return Value.ToLowerInvariant().GetHashCode();
    }

    public override string ToString()
    {
        return Value;
    }

    public static bool operator ==(Username? left, Username? right)
    {
        if (left is null && right is null)
            return true;

        if (left is null || right is null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(Username? left, Username? right)
    {
        return !(left == right);
    }
}
