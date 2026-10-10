using Tests.Common.Builders;

namespace Tests.Common.TestData;

/// <summary>
/// Centralized test data seeding for integration tests
/// </summary>
public static class SeedData
{
    public static List<User> GetDefaultUsers()
    {
        return new List<User>
        {
            new()
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Username = "admin",
                Email = "admin@test.com",
                FirstName = "Admin",
                LastName = "User",
                IsActive = true,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30))
            },
            new()
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Username = "testuser",
                Email = "test@test.com",
                FirstName = "Test",
                LastName = "User",
                IsActive = true,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-10))
            },
            new()
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Username = "inactive_user",
                Email = "inactive@test.com",
                FirstName = "Inactive",
                LastName = "User",
                IsActive = false,
                CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-5))
            }
        };
    }

    public static User GetAdminUser()
    {
        return GetDefaultUsers().First(u => u.Username == "admin");
    }

    public static User GetTestUser()
    {
        return GetDefaultUsers().First(u => u.Username == "testuser");
    }

    public static IEnumerable<User> GenerateRandomUsers(int count = 10)
    {
        return new UserBuilder().BuildList(count);
    }
}
