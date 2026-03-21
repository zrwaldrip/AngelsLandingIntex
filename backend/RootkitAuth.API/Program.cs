using Microsoft.EntityFrameworkCore;
using RootkitAuth.API.Data;

var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "FrontendClient";
const string DefaultFrontendUrl = "http://localhost:3000";
var frontendUrl = builder.Configuration["FrontendUrl"] ?? DefaultFrontendUrl;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<RootbeerDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("RootkitAuthConnection")));

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(FrontendCorsPolicy);
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
