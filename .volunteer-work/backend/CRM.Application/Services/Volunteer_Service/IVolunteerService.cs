namespace CRM.Application.Services.Volunteer_Service;

public interface IVolunteerService
{
    Task<VolunteerVM> RegisterAsync(RegisterVolunteerRequest request, CancellationToken ct);
    Task<VolunteerPage> GetAllAsync(VolunteerFilter filter, CancellationToken ct);
    Task<VolunteerVM?> GetByIdAsync(long id, CancellationToken ct);
    Task<VolunteerVM> UpdateAsync(long id, RegisterVolunteerRequest request, string actor, CancellationToken ct);
    Task<VolunteerVM> UpdateStatusAsync(long id, VolunteerStatusRequest request, string actor, CancellationToken ct);
    Task DeleteAsync(long id, string actor, CancellationToken ct);
}
