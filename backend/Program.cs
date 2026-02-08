using Microsoft.EntityFrameworkCore;
using backend.src.application.Interfaces;
using backend.src.application.Services;
using backend.src.Infratructure.Persistence.AppDbContext;
using backend.src.Infratructure.Repositories;
using backend.src.Infratructure.Factories;
using Infrastructure.Persistence.DbMockups;
using System.Text.Json.Serialization;
using DotNetEnv;

// Carga variables de entorno desde archivo.
Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Lee las URLs del frontend permitidas desde .env (por defecto localhost:5173)
var frontendOrigins = Environment.GetEnvironmentVariable("FRONTEND_URLS") ?? "http://localhost:5173";
// Separa las URLs por coma y elimina espacios en blanco
var allowedOrigins = frontendOrigins
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

// Obtiene el nombre de la base de datos en memoria desde .env
var inMemoryDbName = Environment.GetEnvironmentVariable("INMEMORY_DB_NAME") ?? "DiscountsDb";

// Registra el DbContext con una base de datos en memoria (sin persistencia real)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase(inMemoryDbName));

// Registra los servicios en el contenedor de inyección de dependencias
builder.Services.AddScoped<IDiscountRepository, DiscountRepository>();
builder.Services.AddScoped<IDiscountFactory, DiscountFactory>();
builder.Services.AddScoped<DiscountService>();

// Agrega controladores MVC y configura la serialización JSON para incluir todos los campos
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
        options.JsonSerializerOptions.IncludeFields = true;
    });

// Habilita la exploración de endpoints y la generación de documentación Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Discounts API",
        Version = "v1",
        Description = "API para gestión de descuentos y promociones",
    });

    // Opcional: Agregar comentarios XML
    // var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    // var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    // options.IncludeXmlComments(xmlPath);
});

// Configura CORS para permitir peticiones desde el frontend con cualquier header y método
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins.Length > 0 ? allowedOrigins : new[] { "http://localhost:5173" })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Activa Swagger UI solo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirige HTTP a HTTPS y aplica la política CORS
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Mapea las rutas de los controladores a endpoints HTTP
app.MapControllers();

// Carga datos de prueba iniciales, si DB_MOCKUP es true en el .env
var dbmockup = Environment.GetEnvironmentVariable("DB_MOCKUP") == "true";
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (dbmockup)
    {
        DbMockups.Seed(context);
    }
}

// Inicia la aplicación y escucha peticiones HTTP
app.Run();