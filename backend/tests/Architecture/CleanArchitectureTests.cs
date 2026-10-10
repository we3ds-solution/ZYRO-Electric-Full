using System;
using System.Linq;
using Xunit;
using FluentAssertions;
using NetArchTest.Rules;

namespace Tests.Architecture;

/// <summary>
/// Architecture tests to enforce clean architecture principles
/// Using NetArchTest to verify dependency rules
/// </summary>
public class CleanArchitectureTests
{
    private const string DomainNamespace = "Domain";
    private const string ApplicationNamespace = "Application";
    private const string InfrastructureNamespace = "Infrastructure";
    private const string PresentationNamespace = "Presentation";
    private const string CommonNamespace = "Common";

    [Fact]
    public void DomainLayer_ShouldNotDependOnOtherLayers()
    {
        // Arrange
        var domainTypes = Types.InNamespace(DomainNamespace)
            .Should()
            .NotHaveDependencyOnAll(
                ApplicationNamespace,
                InfrastructureNamespace,
                PresentationNamespace
            );

        // Act & Assert
        var result = domainTypes.GetResult();
        var failingNames = result.FailingTypes?.Select(t => t.Name) ?? Enumerable.Empty<string>();
        result.IsSuccessful.Should().BeTrue(
            $"Domain layer should not depend on other layers. Failures: {string.Join(", ", failingNames)}");
    }

    [Fact]
    public void ApplicationLayer_ShouldNotDependOnInfrastructureOrPresentation()
    {
        // Arrange
        var applicationTypes = Types.InNamespace(ApplicationNamespace)
            .Should()
            .NotHaveDependencyOnAll(
                InfrastructureNamespace,
                PresentationNamespace
            );

        // Act & Assert
        var result = applicationTypes.GetResult();
        var failingNames = result.FailingTypes?.Select(t => t.Name) ?? Enumerable.Empty<string>();
        result.IsSuccessful.Should().BeTrue(
            $"Application layer should not depend on Infrastructure or Presentation. Failures: {string.Join(", ", failingNames)}");
    }

    [Fact]
    public void InfrastructureLayer_ShouldNotDependOnPresentation()
    {
        // Arrange
        var infrastructureTypes = Types.InNamespace(InfrastructureNamespace)
            .Should()
            .NotHaveDependencyOn(PresentationNamespace);

        // Act & Assert
        var result = infrastructureTypes.GetResult();
        var failingNames = result.FailingTypes?.Select(t => t.Name) ?? Enumerable.Empty<string>();
        result.IsSuccessful.Should().BeTrue(
            $"Infrastructure layer should not depend on Presentation. Failures: {string.Join(", ", failingNames)}");
    }

    [Fact]
    public void ApplicationLayer_ShouldDependOnDomainLayer()
    {
        // Arrange
        var applicationTypes = Types.InNamespace(ApplicationNamespace)
            .That()
            .AreClasses()
            .Should()
            .HaveDependencyOn(DomainNamespace);

        // Act & Assert
        var result = applicationTypes.GetResult();
        result.IsSuccessful.Should().BeTrue("Application layer should have dependency on Domain layer");
    }

    [Fact]
    public void EntityClasses_ShouldResideInDomainNamespace()
    {
        // Arrange - check that domain entities are in the right namespace
        var domainTypes = Types.InNamespace(DomainNamespace)
            .That()
            .ResideInNamespace("Domain.Entities")
            .Should()
            .BeClasses();

        // Act & Assert
        var result = domainTypes.GetResult();
        result.IsSuccessful.Should().BeTrue("Entity classes should be located in Domain.Entities namespace");
    }

    [Fact]
    public void ServiceClasses_ShouldBeInApplicationServicesNamespace()
    {
        // Arrange - verify classes in Application.Services are actually classes
        var applicationServiceTypes = Types.InNamespace(ApplicationNamespace)
            .That()
            .ResideInNamespace("Application.Services")
            .And()
            .AreClasses()
            .Should()
            .BeClasses();

        // Act & Assert
        var result = applicationServiceTypes.GetResult();
        result.IsSuccessful.Should().BeTrue("Service classes should be in Application.Services namespace");
    }

    [Fact]
    public void Exceptions_ShouldBeInApplicationNamespace()
    {
        // Arrange
        var types = Types.InNamespace(ApplicationNamespace)
            .That()
            .ResideInNamespace("Application.Exceptions")
            .Should()
            .Inherit(typeof(Exception));

        // Act & Assert
        var result = types.GetResult();
        result.IsSuccessful.Should().BeTrue("Exception classes should inherit from System.Exception");
    }

    [Fact]
    public void DTOClasses_ShouldResideInApplicationNamespace()
    {
        // Arrange - verify DTO classes are in the Application.Dtos namespace
        var types = Types.InNamespace(ApplicationNamespace)
            .That()
            .ResideInNamespace("Application.Dtos")
            .Should()
            .BeClasses();

        // Act & Assert
        var result = types.GetResult();
        result.IsSuccessful.Should().BeTrue("DTO classes should reside in Application.Dtos namespace");
    }
}
