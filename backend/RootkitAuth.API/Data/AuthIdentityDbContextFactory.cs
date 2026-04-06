using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace RootkitAuth.API.Data;

/// <summary>
/// Used by EF Core tools (<c>dotnet ef migrations</c>) at design time. Set
/// <c>ConnectionStrings__RootkitIdentityConnection</c> to your Supabase Postgres connection string,
/// or rely on the dev fallback below.
/// </summary>
public sealed class AuthIdentityDbContextFactory : IDesignTimeDbContextFactory<AuthIdentityDbContext>
{
    public AuthIdentityDbContext CreateDbContext(string[] args)
    {
        var cs =
            Environment.GetEnvironmentVariable("ConnectionStrings__RootkitIdentityConnection")
            ?? Environment.GetEnvironmentVariable("ROOTKIT_IDENTITY_CONNECTION")
            ?? "Host=127.0.0.1;Port=5432;Database=postgres;Username=postgres;Password=postgres;SSL Mode=Prefer";

        var optionsBuilder = new DbContextOptionsBuilder<AuthIdentityDbContext>();
        optionsBuilder.UseNpgsql(cs);
        return new AuthIdentityDbContext(optionsBuilder.Options);
    }
}
