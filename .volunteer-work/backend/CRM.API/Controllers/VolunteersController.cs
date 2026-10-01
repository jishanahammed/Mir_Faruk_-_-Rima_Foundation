using System.Security.Claims;
using CRM.Application.Services.Volunteer_Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.WebAPI.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class VolunteersController(IVolunteerService service) : ControllerBase
{
    private string Actor => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "ADMIN-VOLUNTEER-MANAGEMENT";

    [AllowAnonymous]
    [HttpPost("register")]
    public Task<IActionResult> Register(RegisterVolunteerRequest request, CancellationToken ct) => Handle(async () =>
    {
        var result = await service.RegisterAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, new { result.Id, message = "Registration received. Our team will review your application." });
    });

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] VolunteerFilter filter, CancellationToken ct) =>
        Ok(await service.GetAllAsync(filter, ct));

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct)
    {
        var result = await service.GetByIdAsync(id, ct);
        return result is null ? NotFound(new { message = "Volunteer not found." }) : Ok(result);
    }

    [HttpPut("{id:long}")]
    public Task<IActionResult> Update(long id, RegisterVolunteerRequest request, CancellationToken ct) =>
        Handle(async () => Ok(await service.UpdateAsync(id, request, Actor, ct)));

    [HttpPut("{id:long}/status")]
    public Task<IActionResult> UpdateStatus(long id, VolunteerStatusRequest request, CancellationToken ct) =>
        Handle(async () => Ok(await service.UpdateStatusAsync(id, request, Actor, ct)));

    [HttpDelete("{id:long}")]
    public Task<IActionResult> Delete(long id, CancellationToken ct) => Handle(async () =>
    {
        await service.DeleteAsync(id, Actor, ct);
        return NoContent();
    });

    private async Task<IActionResult> Handle(Func<Task<IActionResult>> action)
    {
        try { return await action(); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
        catch (VolunteerConflictException ex) { return Conflict(new { message = ex.Message }); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }
}
