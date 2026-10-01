using System.ComponentModel.DataAnnotations;
using CRM.Domain.Entities.Locations;

namespace CRM.Domain.Entities.Volunteers;

public class Volunteer : EntityBase
{
    [Required, MaxLength(150)] public string Name { get; set; } = string.Empty;
    [Required, MaxLength(20)] public string Phone { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Email { get; set; } = string.Empty;
    [Required, MaxLength(150)] public string Profession { get; set; } = string.Empty;
    public long DivisionId { get; set; }
    public Division? Division { get; set; }
    public long DistrictId { get; set; }
    public District? District { get; set; }
    public long UpazilaId { get; set; }
    public Upazila? Upazila { get; set; }
    public long LocalGovernmentId { get; set; }
    public UnionParishadorPourashava? LocalGovernment { get; set; }
    public long WardId { get; set; }
    public Ward? Ward { get; set; }
    public bool IsApprove { get; set; }
    public bool IsActive { get; set; } = true;
}
