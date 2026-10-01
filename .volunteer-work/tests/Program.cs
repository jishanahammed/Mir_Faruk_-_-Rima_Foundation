using System.ComponentModel.DataAnnotations;
using System.Reflection;
using CRM.Application.Services.Volunteer_Service;
using CRM.Domain.Entities.Locations;
using CRM.Domain.Enums;
using CRM.Infrastructure;
using CRM.Infrastructure.Repositories;
using CRM.WebAPI.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

// Run from the backend root. Every test write is enclosed in one rolled-back transaction.
var configuration = new ConfigurationBuilder()
    .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "CRM.API"))
    .AddJsonFile("appsettings.json").AddJsonFile("appsettings.Development.json", optional: true)
    .AddEnvironmentVariables().Build();
var options = new DbContextOptionsBuilder<FoundationDbContext>()
    .UseSqlServer(configuration.GetConnectionString("DefaultConnection")).Options;
await using var db = new FoundationDbContext(options);
await using var transaction = await db.Database.BeginTransactionAsync();
var service = new VolunteerService(new UnitOfWork(db));
var ct = CancellationToken.None;
var marker = "Volunteer check " + Guid.NewGuid().ToString("N")[..10];
var checks = 0;
void Check(bool condition, string message)
{
    if (!condition) throw new Exception("FAIL: " + message);
    checks++;
    Console.WriteLine("PASS: " + message);
}
async Task Reject<T>(Func<Task> action, string message) where T : Exception
{
    try { await action(); }
    catch (T) { Check(true, message); return; }
    throw new Exception("FAIL: " + message);
}

try
{
    var division = new Division { NameEn = marker, NameBn = marker, IsActive = true, IsDelete = 0 };
    var district = new District { NameEn = marker, NameBn = marker, Division = division, IsActive = true, IsDelete = 0 };
    var upazila = new Upazila { NameEn = marker, NameBn = marker, District = district, IsActive = true, IsDelete = 0 };
    var local = new UnionParishadorPourashava { NameEn = marker, NameBn = marker, Upazila = upazila,
        Type = LocalGovernmentType.UnionParishad, IsActive = true, IsDelete = 0 };
    var ward = new Ward { NameEn = marker, NameBn = marker, WardNo = 1, UnionParishadorPourashava = local,
        IsActive = true, IsDelete = 0 };
    db.Wards.Add(ward);
    await db.SaveChangesAsync();
    var phone = "019" + Random.Shared.Next(10000000, 99999999);
    var email = Guid.NewGuid().ToString("N") + "@example.invalid";
    RegisterVolunteerRequest Request() => new() { Name = "  " + marker + "  ", Phone = "+880" + phone[1..],
        Email = email.ToUpperInvariant(), Profession = " Teacher ", DivisionId = division.Id, DistrictId = district.Id,
        UpazilaId = upazila.Id, LocalGovernmentId = local.Id, WardId = ward.Id };

    var created = await service.RegisterAsync(Request(), ct);
    Check(!created.IsApprove && created.IsActive, "Public registration is pending and active");
    Check(created.Phone == phone && created.Email == email && created.Name == marker && created.Profession == "Teacher",
        "Contact details are normalized");
    Check(created.Ward == marker && created.Division == marker, "Location labels are projected from related tables");

    var duplicatePhone = Request(); duplicatePhone.Email = "second-" + email; duplicatePhone.Phone = "00880" + phone[1..];
    await Reject<VolunteerConflictException>(() => service.RegisterAsync(duplicatePhone, ct), "Equivalent phone formats cannot register twice");
    var duplicateEmail = Request(); duplicateEmail.Phone = "018" + phone[3..];
    await Reject<VolunteerConflictException>(() => service.RegisterAsync(duplicateEmail, ct), "Duplicate email is rejected");
    var invalidPhone = Request(); invalidPhone.Phone = "123";
    await Reject<InvalidOperationException>(() => service.RegisterAsync(invalidPhone, ct), "Invalid phone is rejected");
    var invalidEmail = Request(); invalidEmail.Email = "not-an-email";
    await Reject<InvalidOperationException>(() => service.RegisterAsync(invalidEmail, ct), "Invalid email is rejected");
    var mismatched = Request(); mismatched.Email = "different-" + email; mismatched.Phone = "017" + phone[3..]; mismatched.DivisionId = long.MaxValue;
    await Reject<InvalidOperationException>(() => service.RegisterAsync(mismatched, ct), "Mismatched location hierarchy is rejected");

    ward.IsActive = false; await db.SaveChangesAsync();
    var inactive = Request(); inactive.Email = "inactive-" + email; inactive.Phone = "016" + phone[3..];
    await Reject<InvalidOperationException>(() => service.RegisterAsync(inactive, ct), "Inactive locations cannot receive new registrations");
    var update = Request(); update.Profession = "Engineer";
    var updated = await service.UpdateAsync(created.Id, update, "volunteer-check", ct);
    Check(updated.Profession == "Engineer", "Existing inactive locations can be retained while editing contact details");
    ward.IsActive = true; await db.SaveChangesAsync();

    var approved = await service.UpdateStatusAsync(created.Id, new() { IsApprove = true }, "volunteer-check", ct);
    Check(approved.IsApprove && approved.IsActive, "Approval updates preserve active status");
    var deactivated = await service.UpdateStatusAsync(created.Id, new() { IsActive = false }, "volunteer-check", ct);
    Check(deactivated.IsApprove && !deactivated.IsActive, "Active updates preserve approval status");
    var page = await service.GetAllAsync(new() { Search = marker, IsApprove = true, IsActive = false, Page = int.MaxValue, PageSize = 1 }, ct);
    Check(page.Total == 1 && page.Page == 1 && page.Items.Single().Id == created.Id, "Search, status filters and page clamping work");
    Check((await service.GetAllAsync(new() { Search = marker, IsApprove = false }, ct)).Total == 0, "Pending filter excludes approved records");
    var statusErrors = new List<ValidationResult>();
    var emptyStatus = new VolunteerStatusRequest();
    Check(!Validator.TryValidateObject(emptyStatus, new ValidationContext(emptyStatus), statusErrors, true),
        "Empty status updates are invalid");
    await service.DeleteAsync(created.Id, "volunteer-check", ct);
    Check(await service.GetByIdAsync(created.Id, ct) is null, "Deleted volunteers are hidden");
    await Reject<KeyNotFoundException>(() => service.UpdateStatusAsync(created.Id, new() { IsApprove = true }, "volunteer-check", ct), "Deleted volunteers cannot be updated");
    Check((await service.RegisterAsync(Request(), ct)).Id != created.Id, "Deleted contact details can be registered again");

    var controller = typeof(VolunteersController);
    Check(controller.GetCustomAttribute<AuthorizeAttribute>()?.Roles == "Admin", "Volunteer management requires the Admin role");
    Check(controller.GetMethods().Where(m => m.GetCustomAttribute<AllowAnonymousAttribute>() != null).Select(m => m.Name).SequenceEqual(["Register"]),
        "Only registration allows anonymous access");
    Console.WriteLine($"All {checks} volunteer checks passed.");
}
finally
{
    await transaction.RollbackAsync();
    Console.WriteLine("All test data rolled back.");
}
