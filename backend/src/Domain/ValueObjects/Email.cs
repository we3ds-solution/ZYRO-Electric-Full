namespace Domain.ValueObjects;

/// <summary>
/// Email value object - single responsibility: Email validation and encapsulation
/// Ensures email is always valid when created
/// Immutable and implements value equality
/// </summary>
public sealed class Email : IEquatable<Email>
{
    private Email(string value)
    {
        Value = value;
    }

    public string Value { get; }

    /// <summary>
    /// Create email from string with validation
    /// </summary>
    public static Result<Email> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result<Email>.FailureResult("Email cannot be empty");

        email = email.Trim().ToLowerInvariant();

        if (!IsValidEmail(email))
            return Result<Email>.FailureResult("Invalid email format");

        return Result<Email>.SuccessResult(new Email(email));
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public bool Equals(Email? other)
    {
        if (other is null)
            return false;

        return Value == other.Value;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Email);
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public override string ToString()
    {
        return Value;
    }

    public static bool operator ==(Email? left, Email? right)
    {
        if (left is null && right is null)
            return true;

        if (left is null || right is null)
            return false;

        return left.Equals(right);
    }

    public static bool operator !=(Email? left, Email? right)
    {
        return !(left == right);
    }
}
