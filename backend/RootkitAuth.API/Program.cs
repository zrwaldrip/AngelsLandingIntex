using Microsoft.EntityFrameworkCore;
using RootkitAuth.API.Data;
using Microsoft.AspNetCore.Identity;
using RootkitAuth.API.Infrastructure;
using Microsoft.AspNetCore.Authentication.Google;


var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "FrontendClient";
const string DefaultFrontendUrl = "http://localhost:3000";
var frontendUrl = builder.Configuration["FrontendUrl"] ?? DefaultFrontendUrl;
var allowAnyOrigin = string.Equals(
    builder.Configuration["Cors:AllowAnyOrigin"],
    "true",
    StringComparison.OrdinalIgnoreCase);

// Comma-separated list, e.g. "http://localhost:3000,https://your-app.azurestaticapps.net"
// Azure App Service: set Cors__AllowedOrigins (or FrontendUrl alone still works).
var corsAllowedOriginsRaw = builder.Configuration["Cors:AllowedOrigins"];
var corsOrigins = new List<string>();
if (!string.IsNullOrWhiteSpace(corsAllowedOriginsRaw))
{
    foreach (var part in corsAllowedOriginsRaw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
    {
        corsOrigins.Add(part.TrimEnd('/'));
    }
}

if (corsOrigins.Count == 0 && !string.IsNullOrWhiteSpace(frontendUrl))
{
    corsOrigins.Add(frontendUrl.TrimEnd('/'));
}

if (corsOrigins.Count == 0)
{
    corsOrigins.Add(DefaultFrontendUrl);
}

// Cookies must use SameSite=None for cross-site (SWA origin → App Service API) with credentials.
var needsCrossSiteAuthCookies =
    allowAnyOrigin ||
    corsOrigins.Exists(static o =>
        o.StartsWith("https://", StringComparison.OrdinalIgnoreCase));
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

static string EnsureAzureWritableSqlite(string? configuredConnectionString, string fallbackFileName)
{
    // On Azure App Service (Linux), the app directory may be read-only. /home is writable.
    // If the configured connection string points to a relative sqlite file, relocate it under /home.
    var conn = configuredConnectionString;
    if (string.IsNullOrWhiteSpace(conn))
    {
        conn = $"Data Source={fallbackFileName}";
    }

    const string DataSourcePrefix = "Data Source=";
    if (!conn.TrimStart().StartsWith(DataSourcePrefix, StringComparison.OrdinalIgnoreCase))
    {
        return conn;
    }

    var ds = conn.Trim()[DataSourcePrefix.Length..].Trim().Trim('"');
    var isPathRooted =
        Path.IsPathRooted(ds) ||
        ds.StartsWith("/", StringComparison.Ordinal); // linux absolute path

    var home = Environment.GetEnvironmentVariable("HOME");
    var runningInAzure = !string.IsNullOrWhiteSpace(home);

    if (!runningInAzure || isPathRooted)
    {
        return conn;
    }

    var dbDir = Path.Combine(home!, "site", "data");
    Directory.CreateDirectory(dbDir);
    var dbPath = Path.Combine(dbDir, Path.GetFileName(ds));

    return $"{DataSourcePrefix}{dbPath}";
}

builder.Services.AddDbContext<ProgramEntryDbContext>(options =>
    options.UseSqlite(
        EnsureAzureWritableSqlite(
            builder.Configuration.GetConnectionString("RootkitAuthConnection"),
            "RootkitAuth.sqlite")));

builder.Services.AddDbContext<AuthIdentityDbContext>(options =>
    options.UseSqlite(
        EnsureAzureWritableSqlite(
            builder.Configuration.GetConnectionString("RootkitIdentityConnection"),
            "RootkitIdentity.sqlite")));

builder.Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AuthIdentityDbContext>();

if (!string.IsNullOrEmpty(googleClientId) && !string.IsNullOrEmpty(googleClientSecret))
{
    builder.Services.AddAuthentication()
        .AddGoogle(options =>
        {
            options.ClientId = googleClientId;
            options.ClientSecret = googleClientSecret;
            options.SignInScheme = IdentityConstants.ExternalScheme;
            options.CallbackPath = "/signin-google";
        });
}

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicies.ManageCatalog, policy => policy.RequireRole(AuthRoles.Admin));
});

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 14;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    // Cross-site SPA + API (e.g. Azure Static Web Apps → App Service) needs SameSite=None for fetch(..., credentials).
    options.Cookie.SameSite = needsCrossSiteAuthCookies ? SameSiteMode.None : SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        if (allowAnyOrigin)
        {
            // WARNING: Very permissive. Use only temporarily for deployment/testing.
            // Allows credentialed requests from any origin.
            policy.SetIsOriginAllowed(_ => true)
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
        else
        {
            policy.WithOrigins(corsOrigins.Distinct(StringComparer.OrdinalIgnoreCase).ToArray())
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    await AuthIdentityGenerator.GenerateDefaultIdentityAsync(scope.ServiceProvider, app.Configuration);
    }

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

// CORS must run after routing is established. Keep it early so preflight + all API responses get headers.
app.UseRouting();
app.UseCors(FrontendCorsPolicy);
app.UseSecurityHeaders();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
// Identity minimal APIs + conventional controllers need explicit CORS endpoint metadata in some hosts.
app.MapControllers().RequireCors(FrontendCorsPolicy);
app.MapGroup("/api/auth")
    .RequireCors(FrontendCorsPolicy)
    .MapIdentityApi<ApplicationUser>();
app.Run();
