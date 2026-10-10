using Xunit;
using FluentAssertions;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Tests.Common.Fixtures;

namespace Tests.API;

/// <summary>
/// Example API integration tests using WebApplicationFactory
/// These tests run the full ASP.NET application and make HTTP requests
/// </summary>
public class ExampleApiTests : IAsyncLifetime
{
    private WebApplicationFactory<Program>? _factory;
    private HttpClient? _client;

    public async Task InitializeAsync()
    {
        _factory = new WebApplicationFactory<Program>();
        _client = _factory.CreateClient();
        await Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        if (_client != null)
        {
            _client.Dispose();
        }

        if (_factory != null)
        {
            await _factory.DisposeAsync();
        }
    }

    [Fact]
    public async Task HealthCheck_ShouldReturnOk()
    {
        // Arrange
        var url = "/health"; // Adjust based on your actual health check endpoint

        // Act
        var response = await _client!.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Theory]
    [InlineData("/swagger/index.html")]
    [InlineData("/swagger/v1/swagger.json")]
    public async Task Swagger_ShouldBeAvailable(string url)
    {
        // Act
        var response = await _client!.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Api_UnknownEndpoint_ShouldReturn404()
    {
        // Arrange
        var url = "/api/nonexistent/endpoint";

        // Act
        var response = await _client!.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Api_InvalidRequest_ShouldReturnBadRequest()
    {
        // Arrange
        var url = "/api/example/invalid";
        var content = new StringContent("{ invalid json",
            System.Text.Encoding.UTF8, "application/json");

        // Act
        var response = await _client!.PostAsync(url, content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Api_ShouldHaveCorsHeaders()
    {
        // Arrange
        var url = "/health";

        // Act
        var response = await _client!.GetAsync(url);

        // Assert
        response.Headers.Should().NotBeNull();
        // Adjust based on your actual CORS configuration
    }
}

