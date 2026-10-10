using Bogus;

namespace Tests.Common.Builders;

/// <summary>
/// Base builder for creating test data using Bogus
/// </summary>
public abstract class TestDataBuilder<T> where T : class
{
    protected Faker<T> Faker { get; }

    protected TestDataBuilder()
    {
        Faker = new Faker<T>();
        Configure();
    }

    protected abstract void Configure();

    public T Build() => Faker.Generate();

    public IEnumerable<T> BuildList(int count) => Faker.Generate(count);

    public T BuildWithDefaults() => Build();

    public T BuildWithCustomDefaults(Action<T> configure)
    {
        var instance = Build();
        configure(instance);
        return instance;
    }
}

/// <summary>
/// Example builder for User entity
/// </summary>
public class UserBuilder : TestDataBuilder<User>
{
    protected override void Configure()
    {
        Faker
            .RuleFor(x => x.Id, f => f.Random.Guid())
            .RuleFor(x => x.Username, f => f.Internet.UserName())
            .RuleFor(x => x.Email, f => f.Internet.Email())
            .RuleFor(x => x.FirstName, f => f.Name.FirstName())
            .RuleFor(x => x.LastName, f => f.Name.LastName())
            .RuleFor(x => x.IsActive, f => f.Random.Bool())
            .RuleFor(x => x.CreatedAt, f => f.Date.PastDateOnly());
    }
}

/// <summary>
/// Example User entity
/// </summary>
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateOnly CreatedAt { get; set; }
}
