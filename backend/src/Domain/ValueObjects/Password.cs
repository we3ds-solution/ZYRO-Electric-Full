namespace Domain.ValueObjects;

/// <summary>
/// Password value object - single responsibility: Password validation
/// Ensures password meets complexity requirements when created
/// Note: Stores plain password for validation only, never store/persist this
/// </summary>
public sealed class Password : IEquatable<Password>
{
    private Password(string value)
    {
        Value = value;
    }

    public string Value { get; }

    private const int MinLength = 8;
    private const int MaxLength = 128;

    /// <summary>
    /// Create password from string with validation
    /// </summary>
    public static Result<Password> Create(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return Result<Password>.FailureResult("Password cannot be empty");

        if (password.Length < MinLength)
            return Result<Password>.FailureResult($"Password must be at least {MinLength} characters long");

        if (password.Length > MaxLength)
            return Result<Password>.FailureResult($"Password must not exceed {MaxLength} characters");

        if (!HasUpperCase(password))
            return Result<Password>.FailureResult("Password must contain at least one uppercase letter");

        if (!HasLowerCase(password))
            return Result<Password>.FailureResult("Password must contain at least one lowercase letter");

        if (!HasDigit(password))
            return Result<Password>.FailureResult("Password must contain at least one digit");

        if (!HasSpecialCharacter(password))
            return Result<Password>.FailureResult("Password must contain at least one special character");

        return Result<Password>.SuccessResult(new Password(password));
    }

    private static bool HasUpperCase(string password) => password.Any(char.IsUpper);
    private static bool HasLowerCase(string password) => password.Any(char.IsLower);
    private static bool HasDigit(string password) => password.Any(char.IsDigit);
    private static bool HasSpecialCharacter(string password) => password.Any(c => !char.IsLetterOrDigit(c));

    public bool Equals(Password? other)
    {
        if (other is null)
            return false;

        return Value == other.Value;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Password);
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public static bool operator ==(Password? left, Password? right)
    {
        if (left is null && right is null)
            return true;

        if (left is null || right is null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(Password? left, Password? right)
    {
        return !(left == right);
    }
}
