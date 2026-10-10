using Xunit;
using FluentAssertions;
using Moq;
using NSubstitute;

namespace Tests.Common.Fixtures;

/// <summary>
/// Base fixture for unit tests with common setup/teardown
/// </summary>
public abstract class BaseTestFixture : IAsyncLifetime
{
    protected virtual async Task OnInitializeAsync() => await Task.CompletedTask;
    protected virtual async Task OnDisposeAsync() => await Task.CompletedTask;

    public async Task InitializeAsync() => await OnInitializeAsync();

    public async Task DisposeAsync() => await OnDisposeAsync();

    /// <summary>
    /// Helper to verify mock call count
    /// </summary>
    protected void VerifyMockCallCount<T>(Mock<T> mock, int expectedCount) where T : class
    {
        mock.Invocations.Count.Should().Be(expectedCount);
    }

    /// <summary>
    /// Helper to verify substitution call count
    /// </summary>
    protected void VerifySubstituteCallCount<T>(T substitute, int expectedCount) where T : class
    {
        substitute.ReceivedCalls().Count().Should().Be(expectedCount);
    }
}


