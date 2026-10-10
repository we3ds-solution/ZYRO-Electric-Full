using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

/// <summary>
/// Example controller - demonstrates API conventions and request validation
/// Single responsibility: sample endpoint for request validation behavior
/// </summary>
[ApiController]
[Route("api/example")]
[Produces("application/json")]
public class ExampleController : ControllerBase
{
    /// <summary>
    /// Example endpoint - accepts a JSON body
    /// Invalid JSON is automatically rejected with 400 Bad Request
    /// </summary>
    [HttpPost("invalid")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Invalid([FromBody] object? request)
    {
        return Ok(new { message = "Request accepted" });
    }
}
