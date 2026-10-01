using System.ComponentModel.DataAnnotations;

namespace CRM.Application.Services.Volunteer_Service;

public class RegisterVolunteerRequest
{
    [Required, MaxLength(150)] public string Name { get; set; } = string.Empty;
    [Required, MaxLength(30)] public string Phone { get; set; } = string.Empty;
    [Required, EmailAddress, MaxLength(200)] public string Email { get; set; } = string.Empty;
    [Required, MaxLength(150)] public string Profession { get; set; } = string.Empty;
    [Range(1, long.MaxValue)] public long DivisionId { get; set; }
    [Range(1, long.MaxValue)] public long DistrictId { get; set; }
    [Range(1, long.MaxValue)] public long UpazilaId { get; set; }
    [Range(1, long.MaxValue)] public long LocalGovernmentId { get; set; }
    [Range(1, long.MaxValue)] public long WardId { get; set; }
}

public class VolunteerVM : RegisterVolunteerRequest
{
    public long Id { get; set; }
    public string Division { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Upazila { get; set; } = string.Empty;
    public string LocalGovernment { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public bool IsApprove { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class VolunteerStatusRequest : IValidatableObject
{
    public bool? IsApprove { get; set; }
    public bool? IsActive { get; set; }
    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (!IsApprove.HasValue && !IsActive.HasValue)
            yield return new ValidationResult("Choose an approval or active status.");
    }
}

public class VolunteerFilter
{
    [MaxLength(200)] public string? Search { get; set; }
    public bool? IsApprove { get; set; }
    public bool? IsActive { get; set; }
    [Range(1, int.MaxValue)] public int Page { get; set; } = 1;
    [Range(1, 100)] public int PageSize { get; set; } = 20;
}

public record VolunteerPage(IReadOnlyList<VolunteerVM> Items, int Total, int Page, int PageSize);
