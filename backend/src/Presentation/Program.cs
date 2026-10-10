using Infrastructure.Authentication;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHealthChecks();

// Register the application DbContext (repos and auth services depend on DbContext)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Server=(localdb)\\mssqllocaldb;Database=MarketUserDb;Trusted_Connection=true;",
        b => b.MigrationsAssembly("Infrastructure")));
builder.Services.AddScoped<DbContext>(sp =>
    sp.GetRequiredService<AppDbContext>());

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Authentication and CORS are now registered completely via this extension
builder.Services.AddCompleteAuthentication(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Use the unified policy created in AddAppCors
app.UseCors("AppCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

// Expose Program for WebApplicationFactory in integration tests
public partial class Program { }
