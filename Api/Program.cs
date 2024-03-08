using Azure;
using Azure.AI.TextAnalytics;
using Core;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<DocumentService>();
builder.Services.AddControllers();

builder.Services.AddSingleton<TextAnalyticsClient>(provider => {
    var credentials = new AzureKeyCredential(Environment.GetEnvironmentVariable("LANGUAGE_KEY"));
    var endpoint = new Uri(Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT"));
    return new TextAnalyticsClient(endpoint, credentials);
});

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