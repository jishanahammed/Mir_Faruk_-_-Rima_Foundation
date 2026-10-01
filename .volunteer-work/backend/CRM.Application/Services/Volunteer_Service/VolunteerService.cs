using System.Linq.Expressions;
using System.Text.RegularExpressions;
using CRM.Domain.Entities.Volunteers;
using CRM.Infrastructure.Repositories;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace CRM.Application.Services.Volunteer_Service;

public class VolunteerService(IUnitOfWork uow) : IVolunteerService
{
    private IQueryable<Volunteer> Query => uow.Context.Volunteers.Where(x => x.IsDelete != 1);

    private static readonly Expression<Func<Volunteer, VolunteerVM>> Project = x => new VolunteerVM
    {
        Id = x.Id, Name = x.Name, Phone = x.Phone, Email = x.Email, Profession = x.Profession,
        DivisionId = x.DivisionId, Division = x.Division!.NameEn,
        DistrictId = x.DistrictId, District = x.District!.NameEn,
        UpazilaId = x.UpazilaId, Upazila = x.Upazila!.NameEn,
        LocalGovernmentId = x.LocalGovernmentId, LocalGovernment = x.LocalGovernment!.NameEn,
        WardId = x.WardId, Ward = x.Ward!.NameEn,
        IsApprove = x.IsApprove, IsActive = x.IsActive, CreatedAt = x.CreatedAt
    };

    public async Task<VolunteerPage> GetAllAsync(VolunteerFilter filter, CancellationToken ct)
    {
        var query = Query.AsNoTracking();
        if (filter.IsApprove.HasValue) query = query.Where(x => x.IsApprove == filter.IsApprove.Value);
        if (filter.IsActive.HasValue) query = query.Where(x => x.IsActive == filter.IsActive.Value);
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var term = filter.Search.Trim();
            query = query.Where(x => x.Name.Contains(term) || x.Phone.Contains(term) || x.Email.Contains(term)
                || x.Profession.Contains(term) || x.Division!.NameEn.Contains(term)
                || x.District!.NameEn.Contains(term) || x.Upazila!.NameEn.Contains(term)
                || x.LocalGovernment!.NameEn.Contains(term) || x.Ward!.NameEn.Contains(term));
        }
        var total = await query.CountAsync(ct);
        var page = Math.Clamp(filter.Page, 1, Math.Max(1, (int)Math.Ceiling(total / (double)filter.PageSize)));
        var items = await query.OrderByDescending(x => x.CreatedAt).ThenByDescending(x => x.Id)
            .Skip((page - 1) * filter.PageSize).Take(filter.PageSize).Select(Project).ToListAsync(ct);
        return new VolunteerPage(items, total, page, filter.PageSize);
    }

    public Task<VolunteerVM?> GetByIdAsync(long id, CancellationToken ct) =>
        Query.AsNoTracking().Where(x => x.Id == id).Select(Project).FirstOrDefaultAsync(ct);

    public async Task<VolunteerVM> RegisterAsync(RegisterVolunteerRequest request, CancellationToken ct)
    {
        var entity = new Volunteer { IsDelete = 0, IsApprove = false, IsActive = true,
            CreatedAt = DateTime.UtcNow, CreatedBy = "PUBLIC-VOLUNTEER-REGISTRATION" };
        await ApplyAsync(entity, request, ct);
        uow.Context.Volunteers.Add(entity);
        await SaveAsync(ct);
        return (await GetByIdAsync(entity.Id, ct))!;
    }

    public async Task<VolunteerVM> UpdateAsync(long id, RegisterVolunteerRequest request, string actor, CancellationToken ct)
    {
        var entity = await FindAsync(id, ct);
        await ApplyAsync(entity, request, ct);
        Audit(entity, actor);
        await SaveAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task<VolunteerVM> UpdateStatusAsync(long id, VolunteerStatusRequest request, string actor, CancellationToken ct)
    {
        var entity = await FindAsync(id, ct);
        if (request.IsApprove.HasValue) entity.IsApprove = request.IsApprove.Value;
        if (request.IsActive.HasValue) entity.IsActive = request.IsActive.Value;
        Audit(entity, actor);
        await uow.SaveChangesAsync(ct);
        return (await GetByIdAsync(id, ct))!;
    }

    public async Task DeleteAsync(long id, string actor, CancellationToken ct)
    {
        var entity = await FindAsync(id, ct);
        entity.IsDelete = 1;
        entity.IsActive = false;
        Audit(entity, actor);
        await uow.SaveChangesAsync(ct);
    }

    private async Task ApplyAsync(Volunteer entity, RegisterVolunteerRequest request, CancellationToken ct)
    {
        var results = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
        if (!System.ComponentModel.DataAnnotations.Validator.TryValidateObject(request,
            new System.ComponentModel.DataAnnotations.ValidationContext(request), results, true))
            throw new InvalidOperationException(results[0].ErrorMessage);

        var phone = Regex.Replace(request.Phone.Trim(), @"[\s()\-]", "");
        if (phone.StartsWith("00880")) phone = phone[2..];
        if (phone.StartsWith("+880")) phone = "0" + phone[4..];
        else if (phone.StartsWith("880")) phone = "0" + phone[3..];
        if (!Regex.IsMatch(phone, @"^01[3-9][0-9]{8}$"))
            throw new InvalidOperationException("Enter a valid Bangladesh mobile number (01XXXXXXXXX or +8801XXXXXXXXX).");
        var email = request.Email.Trim().ToLowerInvariant();
        if (await Query.AnyAsync(x => x.Id != entity.Id && (x.Phone == phone || x.Email == email), ct))
            throw new VolunteerConflictException();

        // Validate the complete hierarchy so IDs from unrelated locations cannot be combined.
        var locationValid = await uow.Context.Wards.AnyAsync(w => w.Id == request.WardId && w.IsActive && w.IsDelete != 1
            && w.LocalGovernmentId == request.LocalGovernmentId
            && w.UnionParishadorPourashava!.IsActive && w.UnionParishadorPourashava.IsDelete != 1
            && w.UnionParishadorPourashava.UpazilaId == request.UpazilaId
            && w.UnionParishadorPourashava.Upazila!.IsActive && w.UnionParishadorPourashava.Upazila.IsDelete != 1
            && w.UnionParishadorPourashava.Upazila.DistrictId == request.DistrictId
            && w.UnionParishadorPourashava.Upazila.District!.IsActive && w.UnionParishadorPourashava.Upazila.District.IsDelete != 1
            && w.UnionParishadorPourashava.Upazila.District.DivisionId == request.DivisionId
            && w.UnionParishadorPourashava.Upazila.District.Division!.IsActive
            && w.UnionParishadorPourashava.Upazila.District.Division.IsDelete != 1, ct);
        // Existing records may retain a location that has since been deactivated.
        var unchangedLocation = entity.Id > 0 && entity.DivisionId == request.DivisionId
            && entity.DistrictId == request.DistrictId && entity.UpazilaId == request.UpazilaId
            && entity.LocalGovernmentId == request.LocalGovernmentId && entity.WardId == request.WardId;
        if (!locationValid && !unchangedLocation)
            throw new InvalidOperationException("Select a valid active division, district, upazila, union/pourashava and ward.");

        entity.Name = request.Name.Trim(); entity.Phone = phone; entity.Email = email;
        entity.Profession = request.Profession.Trim(); entity.DivisionId = request.DivisionId;
        entity.DistrictId = request.DistrictId; entity.UpazilaId = request.UpazilaId;
        entity.LocalGovernmentId = request.LocalGovernmentId; entity.WardId = request.WardId;
    }

    private async Task<Volunteer> FindAsync(long id, CancellationToken ct) =>
        await Query.FirstOrDefaultAsync(x => x.Id == id, ct) ?? throw new KeyNotFoundException("Volunteer not found.");

    private static void Audit(Volunteer entity, string actor)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = actor;
    }

    private async Task SaveAsync(CancellationToken ct)
    {
        try { await uow.SaveChangesAsync(ct); }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        { throw new VolunteerConflictException(); }
    }
}

public class VolunteerConflictException() : Exception("A volunteer registration already exists with this phone number or email.");
