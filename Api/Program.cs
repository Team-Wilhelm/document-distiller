using Core.Services;
using Infrastructure;
using Azure;
using Azure.AI.TextAnalytics;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using VirtualFriend.Extensions;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DbConnection"); // for GitHub Actions workflow

builder.Services.AddDbContext<AppDbContext>(options =>
{
    connectionString ??= Environment.GetEnvironmentVariable("DbConnection");
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddSingleton<TextAnalyticsClient>(provider => {
    var credentials = new AzureKeyCredential(Environment.GetEnvironmentVariable("LANGUAGE_KEY"));
    var endpoint = new Uri(Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT"));
    return new TextAnalyticsClient(endpoint, credentials);
});
builder.Services.AddControllers();

builder.Services.SetupIdentity();
builder.Services.AddAuthorization();

if (args.Contains("--db-init"))
{
    var scope = builder.Services.BuildServiceProvider().CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    db.Database.Migrate();
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = FormOptions.DefaultMultipartBodyLengthLimit;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();