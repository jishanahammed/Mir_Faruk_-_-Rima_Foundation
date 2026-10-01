$ErrorActionPreference = 'Stop'
$backendRoot = 'D:\Foundation\BackEnd'
$stagedRoot = Join-Path $PSScriptRoot 'backend'
$utf8 = [System.Text.UTF8Encoding]::new($false)
Get-ChildItem -LiteralPath $stagedRoot -File -Recurse | ForEach-Object {
    $relative = $_.FullName.Substring($stagedRoot.Length + 1)
    $target = Join-Path $backendRoot $relative
    if (Test-Path -LiteralPath $target) { throw "New file already exists: $target" }
    [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($target)) | Out-Null
    [System.IO.File]::Copy($_.FullName, $target)
}
$contextPath = Join-Path $backendRoot 'CRM.Infrastructure\FoundationDbContext.cs'
$context = [System.IO.File]::ReadAllText($contextPath)
$context = "using CRM.Domain.Entities.Volunteers;`r`n" + $context
$context = $context.Replace('    #region Donors', "    public DbSet<Volunteer> Volunteers { get; set; }`r`n`r`n    #region Donors")
$config = @'
        builder.Entity<Volunteer>(entity =>
        {
            entity.HasIndex(x => x.Phone).IsUnique().HasFilter("[IsDelete] = 0");
            entity.HasIndex(x => x.Email).IsUnique().HasFilter("[IsDelete] = 0");
            entity.HasIndex(x => new { x.IsDelete, x.IsApprove, x.IsActive });
            entity.HasOne(x => x.Division).WithMany().HasForeignKey(x => x.DivisionId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.District).WithMany().HasForeignKey(x => x.DistrictId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Upazila).WithMany().HasForeignKey(x => x.UpazilaId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.LocalGovernment).WithMany().HasForeignKey(x => x.LocalGovernmentId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Ward).WithMany().HasForeignKey(x => x.WardId).OnDelete(DeleteBehavior.Restrict);
        });

'@
$context = $context.Replace('        builder.Entity<CustomerFeedback>(entity =>', $config + "`r`n        builder.Entity<CustomerFeedback>(entity =>")
[System.IO.File]::WriteAllText($contextPath, $context, $utf8)
$diPath = Join-Path $backendRoot 'CRM.Application\Extensions\DependencyInjectionExtensions.cs'
$di = [System.IO.File]::ReadAllText($diPath)
$di = "using CRM.Application.Services.Volunteer_Service;`r`n" + $di
$di = $di.Replace('        services.AddScoped<IUnitOfWork, UnitOfWork>();', "        services.AddScoped<IVolunteerService, VolunteerService>();`r`n        services.AddScoped<IUnitOfWork, UnitOfWork>();")
[System.IO.File]::WriteAllText($diPath, $di, $utf8)
Write-Output 'Installed volunteer backend files and registered the entity and service.'
