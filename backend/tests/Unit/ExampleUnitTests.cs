using Xunit;
using FluentAssertions;
using Moq;
using AutoFixture;

namespace Tests.Unit;

/// <summary>
/// Example unit tests demonstrating xUnit, FluentAssertions, and Moq patterns
/// Replace with actual domain/application layer tests
/// </summary>
public class ExampleUnitTests
{
    private readonly IFixture _fixture;

    public ExampleUnitTests()
    {
        _fixture = new Fixture();
    }

    [Fact]
    public void Example_SimpleTest_ShouldPass()
    {
        // Arrange
        var expected = 42;
        var actual = 40 + 2;

        // Act & Assert
        actual.Should().Be(expected);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    public void Example_ParameterizedTest_ShouldWork(int input)
    {
        // Arrange & Act
        var result = input * 2;

        // Assert
        result.Should().BeGreaterThan(0);
        result.Should().BeLessThanOrEqualTo(6);
    }

    [Fact]
    public void Example_MockingTest_ShouldVerifyCall()
    {
        // Arrange
        var mockService = new Mock<IExampleService>();
        mockService
            .Setup(x => x.GetValue())
            .Returns("test-value");

        var sut = new ExampleClass(mockService.Object);

        // Act
        var result = sut.DoSomething();

        // Assert
        result.Should().Be("test-value");
        mockService.Verify(x => x.GetValue(), Times.Once);
    }

    [Fact]
    public void Example_AutoFixtureTest_ShouldCreateObject()
    {
        // Arrange & Act
        var entity = _fixture.Create<ExampleEntity>();

        // Assert
        entity.Should().NotBeNull();
        entity.Id.Should().NotBe(Guid.Empty);
        entity.Name.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void Example_FluentAssertions_ShouldProvideClearErrors()
    {
        // Arrange
        var user = new { Name = "John", Age = 30 };

        // Act & Assert
        user.Should().NotBeNull();
        user.Name.Should().Be("John");
        user.Age.Should().Be(30);
    }
}

/// <summary>
/// Example service interface
/// </summary>
public interface IExampleService
{
    string GetValue();
}

/// <summary>
/// Example class for testing
/// </summary>
public class ExampleClass
{
    private readonly IExampleService _service;

    public ExampleClass(IExampleService service)
    {
        _service = service;
    }

    public string DoSomething()
    {
        return _service.GetValue();
    }
}

/// <summary>
/// Example entity for testing
/// </summary>
public class ExampleEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "Default";
    public int Value { get; set; }
}
