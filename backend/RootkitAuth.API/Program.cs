using Microsoft.EntityFrameworkCore;
using RootkitAuth.API.Data;
using Microsoft.AspNetCore.Identity;
using RootkitAuth.API.Infrastructure;
using Microsoft.AspNetCore.Authentication.Google;


var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "FrontendClient";
const string DefaultFrontendUrl = "http://localhost:3000";
var frontendUrl = builder.Configuration["FrontendUrl"] ?? DefaultFrontendUrl;
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
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins(frontendUrl)
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader();
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

app.UseSecurityHeaders();

app.UseCors(FrontendCorsPolicy);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGroup("/api/auth").MapIdentityApi<ApplicationUser>();
app.Run();
