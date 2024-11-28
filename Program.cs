using Microsoft.EntityFrameworkCore;
using TK_ENERGY_GP_PORTAL.Context;
using TK_ENERGY_GP_PORTAL.Services.Contracts;
using TK_ENERGY_GP_PORTAL.Services.Implementations;

using Microsoft.AspNetCore.Authentication.Cookies;

using Microsoft.AspNetCore.Mvc;
using TK_ENERGY_GP_PORTAL.Services.ApiClient;
using Serilog.Debugging;
using Serilog;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

var configuration = new ConfigurationBuilder()
           .SetBasePath(Directory.GetCurrentDirectory())
           .AddJsonFile("appsettings.json")
           .AddJsonFile("appsettings.Development.json")
           .Build();


// Crear una variable para la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("Connection");

// Registrar servicio para la conexión
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));



builder.Services.AddSerilog(options =>
{
    // Configurar Serilog desde la configuración
    options.ReadFrom.Configuration(configuration);
});

builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddSerilog(dispose: true);
    loggingBuilder.AddFilter("Microsoft", LogLevel.Information);
});

SelfLog.Enable(msg => Console.WriteLine(msg));

// Manejo de variables de sesión
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

builder.Services.AddScoped<IApiClient, apiClient>();

builder.Services.AddHttpContextAccessor();

// Registrar servicios
builder.Services.AddScoped<IFuncionarioService, FuncionarioService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IFabricanteService, FabricanteService>();
builder.Services.AddScoped<IMedidorService, MedidorService>();
builder.Services.AddScoped<IServicioService, ServicioService>();
builder.Services.AddScoped<ITransaccionService, TransaccionService>();
builder.Services.AddScoped<IRolService, RolService>();


// Configurar autenticación
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login/SignIn";

        options.Cookie.IsEssential = true; // Esta cookie es esencial para la aplicación.
        options.Cookie.HttpOnly = true; // Evita que la cookie sea accedida por scripts del lado del cliente.
        options.Cookie.SameSite = SameSiteMode.Strict; // Evita que la cookie sea enviada en solicitudes cross-site.
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Asegura que la cookie se envíe solo sobre HTTPS.
        options.Cookie.MaxAge = null; // No establece una edad máxima para la cookie.
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30); // Tiempo de expiración de la cookie.
        options.SlidingExpiration = true; // Renueva el tiempo de expiración al interactuar con la aplicación.
    });

// Eliminar caché para no poder retornar a una vista sin autorización
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new ResponseCacheAttribute
    {
        NoStore = true,
        Location = ResponseCacheLocation.None
    });
});

var app = builder.Build();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Content-Security-Policy",
        "style-src 'self' 'unsafe-hashes' " +
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' " +
        "'sha256-UQBytKn0DQWyDg5/YC+FaQxonSsbQk4k0ErDHqBuhfw=' " +
        "'sha256-5WPI9cMuQx5NLAPv44yIArricQiy+vWND4n458bmRys=' " +
        "'sha256-lz/LPXZySqUVw2p1IHNpkoLTJgSHaV3tgKAr7ACZkLA=' " +
        "'sha256-UP0QZg7irvSMvOBz9mH2PIIE28+57UiavRfeVea0l3g='; " +
        "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*;");

    await next();
});

app.UseStaticFiles();

app.UseRouting();

// Habilitar la sesión antes de la autenticación
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=SignIn}/{id?}");

app.Run();