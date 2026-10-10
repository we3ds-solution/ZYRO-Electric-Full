# Backend Testing Framework

Comprehensive testing framework for ASP.NET 9 backend with clean architecture.

## Test Projects

### 1. Unit Tests (`Tests.Unit`)
- **Framework**: xUnit
- **Mocking**: Moq, NSubstitute
- **Assertions**: FluentAssertions
- **Test Data**: AutoFixture, Bogus

Tests for Domain and Application layer business logic without external dependencies.

**Location**: `backend/tests/Unit/`

### 2. Integration Tests (`Tests.Integration`)
- **Framework**: xUnit
- **Database**: Testcontainers + SQL Server
- **Assertions**: FluentAssertions

Tests for repository patterns and service integration with real database using testcontainers.

**Location**: `backend/tests/Integration/`

### 3. API Tests (`Tests.API`)
- **Framework**: xUnit + Microsoft.AspNetCore.Mvc.Testing
- **HTTP Client**: RestSharp
- **Assertions**: FluentAssertions
- **Database**: Testcontainers + SQL Server

Full end-to-end API tests using WebApplicationFactory.

**Location**: `backend/tests/API/`

### 4. Architecture Tests (`Tests.Architecture`)
- **Framework**: NetArchTest, ArchUnitNET
- **Assertions**: FluentAssertions

Enforce clean architecture principles and dependency rules.

**Location**: `backend/tests/Architecture/`

### 5. Common (`Tests.Common`)
- **Fixtures**: Base test classes, database fixtures
- **Builders**: Test data builders using Bogus
- **Test Data**: Seed data and factory methods

Shared utilities and fixtures for all test projects.

**Location**: `backend/tests/Common/`

## Dependencies

### Core Testing
- **xunit** (2.6.6) - Test framework
- **Microsoft.NET.Test.Sdk** (17.8.2) - Test SDK
- **FluentAssertions** (6.12.0) - Assertion library

### Mocking & Fixtures
- **Moq** (4.20.70) - Mocking library
- **NSubstitute** (5.1.0) - Mocking alternative
- **AutoFixture** (4.18.1) - Test data generation
- **Bogus** (35.3.0) - Fake data generator

### Database Testing
- **Testcontainers** (3.7.0) - Container orchestration
- **Testcontainers.MsSql** (3.7.0) - SQL Server container

### API Testing
- **Microsoft.AspNetCore.Mvc.Testing** (9.0.0) - Integration testing
- **RestSharp** (107.3.0) - HTTP client

### Architecture Testing
- **NetArchTest.Rules** (1.3.2) - Architecture rules
- **ArchUnitNET** (0.14.3) - Architecture testing

### Code Coverage
- **coverlet.collector** (6.0.0) - Code coverage

## Running Tests

### All Tests
```bash
dotnet test backend/
```

### Specific Test Project
```bash
# Unit tests
dotnet test backend/tests/Unit/Unit.csproj

# Integration tests
dotnet test backend/tests/Integration/Integration.csproj

# API tests
dotnet test backend/tests/API/API.csproj

# Architecture tests
dotnet test backend/tests/Architecture/Architecture.csproj
```

### With Coverage
```bash
dotnet test backend/ /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura
```

### Specific Test
```bash
dotnet test backend/tests/Unit/Unit.csproj --filter "FullyQualifiedName~ExampleUnitTests.Example_SimpleTest_ShouldPass"
```

### Watch Mode
```bash
dotnet watch test backend/tests/Unit/Unit.csproj
```

## Test Data Management

### Using Builders
```csharp
// Single entity
var user = new UserBuilder().Build();

// Multiple entities
var users = new UserBuilder().BuildList(10);

// With custom values
var user = new UserBuilder().BuildWithCustomDefaults(u => 
{
    u.Email = "custom@test.com";
});
```

### Using Seed Data
```csharp
// Get predefined test data
var adminUser = SeedData.GetAdminUser();
var allUsers = SeedData.GetDefaultUsers();

// Generate random users
var randomUsers = SeedData.GenerateRandomUsers(count: 20);
```

## Test Patterns

### Unit Test Example
```csharp
[Fact]
public void Service_Method_ShouldReturnExpectedResult()
{
    // Arrange
    var mockRepository = new Mock<IRepository>();
    mockRepository
        .Setup(x => x.GetById(It.IsAny<Guid>()))
        .ReturnsAsync(new TestEntity());
    
    var service = new Service(mockRepository.Object);

    // Act
    var result = await service.DoSomething();

    // Assert
    result.Should().NotBeNull();
    mockRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Once);
}
```

### Integration Test Example
```csharp
[Collection("Database collection")]
public class RepositoryTests : BaseIntegrationFixture
{
    public RepositoryTests(DatabaseFixture databaseFixture) 
        : base(databaseFixture) { }

    [Fact]
    public async Task Insert_ShouldPersistData()
    {
        // Arrange
        using var connection = new SqlConnection(DatabaseFixture.ConnectionString);
        await connection.OpenAsync();

        // Act
        var result = await _repository.AddAsync(testEntity);

        // Assert
        result.Should().Be(1);
    }
}
```

### API Test Example
```csharp
public class ApiTests : IAsyncLifetime
{
    private WebApplicationFactory<Program> _factory;
    private HttpClient _client;

    public async Task InitializeAsync()
    {
        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetEndpoint_ShouldReturnOk()
    {
        // Act
        var response = await _client.GetAsync("/api/items");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
```

### Architecture Test Example
```csharp
[Fact]
public void DomainLayer_ShouldNotDependOnOtherLayers()
{
    var result = Types.InNamespace("Domain")
        .Should()
        .NotHaveDependencyOn("Application", "Infrastructure", "Presentation")
        .GetResult();

    result.IsSuccessful.Should().BeTrue();
}
```

## CI/CD Integration

Tests run automatically on:
- Push to main/testing/test branches
- Pull requests to main/testing/test
- Manual workflow trigger (workflow_dispatch)

Results:
- Test results uploaded as artifacts
- Code coverage published to Codecov
- Architecture validation enforced

## Best Practices

1. **Test Naming**: Use pattern `[Unit/System/Feature]_[Condition]_[Expected Result]`
2. **Arrange-Act-Assert**: Follow AAA pattern in every test
3. **One Assertion**: Keep tests focused on single behavior
4. **Test Data**: Use builders for complex entities, Bogus for simple data
5. **Database**: Use Testcontainers for isolation
6. **Mocking**: Mock external dependencies, test real logic
7. **Coverage**: Aim for 80%+ coverage on critical paths
8. **Architecture**: Run architecture tests in CI/CD

## Troubleshooting

### Testcontainer Issues
- Ensure Docker is running
- Check Docker daemon accessibility
- Verify container images are pulled

### Test Failures
- Check SQL Server container logs
- Verify connection strings
- Ensure ports aren't already in use

### Timeout Issues
- Increase test timeout for slow tests
- Use `[Trait("Category", "Slow")]` to separate slow tests
- Profile tests with `--logger "trx"`

## Resources

- [xUnit Documentation](https://xunit.net/)
- [FluentAssertions Documentation](https://fluentassertions.com/)
- [Moq Documentation](https://github.com/moq/moq4)
- [Testcontainers Documentation](https://testcontainers.com/)
- [NetArchTest Documentation](https://github.com/BenMorris/NetArchTest)
