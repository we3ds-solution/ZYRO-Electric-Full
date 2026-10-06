using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Repositories;

namespace Tests.Integration;

public class ExampleIntegrationTests
{
    private AppDbContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: $"InMemoryDb_{Guid.NewGuid()}")
            .Options;
            
        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task Example_InMemoryDatabase_ShouldSucceed()
    {
        // Arrange
        using var context = GetInMemoryContext();
        var repository = new UserRepository(context);
        var unitOfWork = new UnitOfWork(context);

        var user = new User("testuser", "test@test.com", "Test", "User");

        // Act
        await repository.AddAsync(user);
        await unitOfWork.SaveChangesAsync(); // Commit via UnitOfWork

        var retrievedUser = await repository.GetUserByIdAsync(user.Id);

        // Assert
        retrievedUser.Should().NotBeNull();
        retrievedUser!.Email.Should().Be("test@test.com");
    }

    [Fact]
    public async Task Example_InMemoryDatabase_UpdateShouldWork()
    {
        // Arrange
        using var context = GetInMemoryContext();
        var repository = new UserRepository(context);
        var unitOfWork = new UnitOfWork(context);

        var user = new User("updateuser", "update@test.com", "Update", "User");
        await repository.AddAsync(user);
        await unitOfWork.SaveChangesAsync();

        // Act
        var trackedUser = await repository.GetTrackedUserByIdAsync(user.Id);
        trackedUser!.SetFirstName("UpdatedName");
        
        repository.Update(trackedUser);
        await unitOfWork.SaveChangesAsync(); // Commit via UnitOfWork

        var retrievedUser = await repository.GetUserByIdAsync(user.Id);

        // Assert
        retrievedUser.Should().NotBeNull();
        retrievedUser!.FirstName.Should().Be("UpdatedName");
    }
}
