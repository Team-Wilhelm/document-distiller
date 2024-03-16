using System.Reflection;
using System.Text;
using Core.Services;
using Infrastructure;
using Azure;
using Azure.AI.TextAnalytics;
using Core.Context;
using Fleck;
using lib;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.CognitiveServices.Speech;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Shared.Dtos;
using Shared.Models;
using VirtualFriend.Configuration;
using VirtualFriend.Extensions;
using VirtualFriend.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var connectionString = builder.Configuration.GetConnectionString("DbConnection"); // for GitHub Actions workflow

builder.Services.AddDbContext<AppDbContext>(options =>
{
    connectionString ??= Environment.GetEnvironmentVariable("DbConnection");
    connectionString = "Host=localhost;Port=5432;Database=postgres;Username=root;Password=password;Include Error Detail=true;"; // TODO: remove this line
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<DocumentRepository>();
builder.Services.AddScoped<ProjectRepository>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<SpeechService>();
builder.Services.AddScoped<ProjectService>();
builder.Services.AddSingleton<TextAnalyticsClient>(provider =>
{
    var languageKey = Environment.GetEnvironmentVariable("LANGUAGE_KEY") ??
                      builder.Configuration.GetSection("AzureAIServices")["LANGUAGE_KEY"]!;
    var languageEndpoint = Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT") ??
                           builder.Configuration.GetSection("AzureAIServices")["LANGUAGE_ENDPOINT"]!;
    var credentials = new AzureKeyCredential(languageKey);
    var endpoint = new Uri(languageEndpoint);
    return new TextAnalyticsClient(endpoint, credentials);
});

builder.Services.AddSingleton<SpeechSynthesizer>(provider => {
    var speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY") ??
                    builder.Configuration.GetSection("AzureAIServices")["SPEECH_KEY"]!;
    var speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION") ??
                       builder.Configuration.GetSection("AzureAIServices")["SPEECH_REGION"]!;
    var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
    speechConfig.SpeechSynthesisVoiceName = "en-GB-RyanNeural";
    return new SpeechSynthesizer(speechConfig);
});

var eventHandlers = builder.FindAndInjectClientEventHandlers(Assembly.GetExecutingAssembly(), ServiceLifetime.Scoped);


builder.Services.AddScoped<CurrentContext>();
builder.Services.AddControllers();

builder.Services.SetupIdentity();
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options =>
    {
        var jwtConfig = builder.Configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtConfig.GetValue<string>("Key")
                                         ?? throw new NullReferenceException("JWT key cannot be null"));
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig.GetValue<string>("Issuer"),
            ValidAudience = jwtConfig.GetValue<string>("Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "Document Distiller",
            Version = "v1"
        });
    // using System.Reflection;
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    //c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. <br/>
                      Enter 'Bearer' [space] and then your token in the text input below.
                      <br/> Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Development", policyBuilder =>
    {
        policyBuilder.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = FormOptions.DefaultMultipartBodyLengthLimit;
});

var app = builder.Build();

var server = new WebSocketServer("ws://0.0.0.0:8181");

server.Start(ws =>
{
    ws.OnMessage = async message =>
    {
        try
        {
            await app.InvokeClientEventHandler(eventHandlers, ws, message, ServiceLifetime.Scoped);
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            Console.WriteLine(e.InnerException);
            Console.WriteLine(e.StackTrace);
            //e.Handle(ws, message);
        }
    };

    ws.OnOpen = () =>
    {
        //TODO add jwt validation
        Console.WriteLine("Open!");
    };

    ws.OnClose = () =>
    {
        Console.WriteLine("Close!");
    };
    //TODO implement error handling
    //ws.OnError = e => { e.Handle(ws, null); };
});

if (args.Contains("--db-init"))
{
    var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.ExecuteSql($"DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    db.Database.EnsureCreated();
    db.Database.Migrate();

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    var defaultUser = new RegisterDto
    {
        Email = "user@app.com",
        Password = "P@ssw0rd.+"
    };
    await userManager.CreateAsync(new AppUser { Email = defaultUser.Email, UserName = defaultUser.Email },
        defaultUser.Password);
    var guid = userManager.Users.First().Id;

    await db.SeedData(guid);
}

if (app.Environment.IsDevelopment())
{
    app.UseCors("Development");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.UseMiddleware<CurrentContextMiddleware>();

app.Run();