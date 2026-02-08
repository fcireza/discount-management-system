# Arquitectura del Backend

## Clean Architecture

El proyecto sigue los principios de **Clean Architecture** con una clara separación de responsabilidades en capas.

```
┌─────────────────────────────────────────────────────────────┐
│                      Controllers                            │
│                   (Capa de Presentación)                    │
├─────────────────────────────────────────────────────────────┤
│                      Application                            │
│              (Servicios, DTOs, Interfaces)                  │
├─────────────────────────────────────────────────────────────┤
│                        Domain                               │
│                (Entidades, Enums, Lógica)                   │
├─────────────────────────────────────────────────────────────┤
│                     Infrastructure                          │
│           (Repositorios, DbContext, Factories)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Capas del Sistema

### 1. Domain (Capa de Dominio)

Contiene las entidades del negocio y la lógica de dominio pura.

#### Entidad Base: `Discounts`
```csharp
public abstract class Discounts
{
    public Guid _discountId { get; private set; }
    public string _name { get; private set; }
    public DiscountType _typeDiscount { get; private set; }

    public abstract float CalculateDiscount(float unitPrice, int quantity);
    public virtual ValidationResult Validate(int quantity);
}
```

#### Implementaciones Concretas

**PercentageDiscount**
- Calcula el descuento como porcentaje del total
- Fórmula: `(totalOriginal × percentage) / 100`
- Parámetro: `_percentage` (0-100)

**FixedAmountDiscount**
- Aplica un monto fijo de descuento
- Valida que el descuento no exceda el total
- Parámetro: `_amount` (valor positivo)

**TwoForOneDiscount**
- Calcula items gratis basándose en la cantidad
- Fórmula: `(quantity / 2) × unitPrice`
- Sin parámetros adicionales

---

### 2. Application (Capa de Aplicación)

Contiene la lógica de aplicación, servicios y contratos.

#### DiscountService
Servicio principal que orquesta las operaciones:

```csharp
public class DiscountService
{
    private readonly IDiscountRepository _repository;
    private readonly IDiscountFactory _factory;

    public async Task CreateDiscountAsync(CreateDiscountDto dto);
    public async Task<IEnumerable<Discounts>> getAllDiscounts();
    public async Task<Discounts?> GetDiscountById(Guid discountId);
    public async Task DeleteById(Guid discountId);
    public async Task<DiscountResponseDto> ApplyDiscount(ApplyDiscountRequestDto dto);
}
```

#### DTOs (Data Transfer Objects)

| DTO | Propósito | Campos |
|-----|-----------|--------|
| `CreateDiscountDto` | Datos para crear descuento | name, type, percentage?, amount? |
| `ApplyDiscountRequestDto` | Datos para aplicar descuento | discountId, unitPrice, quantity |
| `DiscountResponseDto` | Respuesta del cálculo | originalTotal, discountedApplied, finalTotal |

---

### 3. Infrastructure (Capa de Infraestructura)

Implementaciones concretas de repositorios y acceso a datos.

#### DiscountRepository
Implementa `IDiscountRepository` con operaciones CRUD:
- `AddAsync(Discounts discount)` - Agrega nuevo descuento
- `GetAllAsync()` - Obtiene todos los descuentos
- `GetByIdAsync(Guid id)` - Busca por ID
- `DeleteAsync(Guid id)` - Elimina descuento

#### DiscountFactory
Implementa el patrón **Factory** para crear instancias:

```csharp
public Discounts CreateDiscount(CreateDiscountDto dto)
{
    var id = Guid.NewGuid();
    
    return dto.Type switch
    {
        DiscountType.PercentageDiscount => 
            new PercentageDiscount(id, dto.name, dto.percentage!.Value),
        DiscountType.FixedAmountDiscount => 
            new FixedAmountDiscount(id, dto.name, dto.amount!.Value),
        DiscountType.TwoForOneDiscount => 
            new TwoForOneDiscount(id, dto.name),
        _ => throw new ArgumentException("Invalid discount type")
    };
}
```

#### AppDbContext
Contexto de Entity Framework configurado con InMemory Database.

```csharp
public class AppDbContext : DbContext
{
    public DbSet<Discounts> Discounts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Discounts>()
            .UseTpcMappingStrategy();
    }
}
```

---

## Patrones de Diseño Utilizados

### 1. Repository Pattern
Abstrae el acceso a datos mediante la interfaz `IDiscountRepository`.

**Beneficios:**
- Desacoplamiento entre lógica de negocio y persistencia
- Facilita testing con mocks
- Permite cambiar la implementación sin afectar servicios

### 2. Factory Pattern
`DiscountFactory` crea la instancia correcta de descuento basándose en el tipo.

**Beneficios:**
- Centraliza la lógica de creación
- Facilita agregar nuevos tipos
- Reduce duplicación de código

### 3. Dependency Injection
Todas las dependencias se inyectan mediante el contenedor de DI de ASP.NET Core:

```csharp
builder.Services.AddScoped<IDiscountRepository, DiscountRepository>();
builder.Services.AddScoped<IDiscountFactory, DiscountFactory>();
builder.Services.AddScoped<DiscountService>();
```

### 4. Strategy Pattern (implícito)
Cada tipo de descuento implementa su propia estrategia de cálculo mediante polimorfismo.

---

## Diagrama de Clases

```
                        ┌──────────────────┐
                        │    Discounts     │
                        │    (abstract)    │
                        ├──────────────────┤
                        │ _discountId      │
                        │ _name            │
                        │ _typeDiscount    │
                        ├──────────────────┤
                        │ CalculateDiscount│
                        │ Validate         │
                        └────────┬─────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ PercentageDiscount│ │FixedAmountDiscount│ │ TwoForOneDiscount │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ _percentage      │  │ _amount          │  │                  │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ CalculateDiscount│  │ CalculateDiscount│  │ CalculateDiscount│
│ Validate         │  │ Validate         │  │ Validate         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Flujo de una Petición

### Crear Descuento
```
HTTP POST /api/discounts
       │
       ▼
DiscountsController
       │
       ▼
DiscountService.CreateDiscountAsync()
       │
       ├──► IDiscountFactory.CreateDiscount()
       │    (crea instancia correcta)
       │
       └──► IDiscountRepository.AddAsync()
            (persiste en DB)
       │
       ▼
HTTP 200 OK
```

### Aplicar Descuento
```
HTTP POST /api/discounts/apply
       │
       ▼
DiscountsController
       │
       ▼
DiscountService.ApplyDiscount()
       │
       ├──► IDiscountRepository.GetByIdAsync()
       │    (buscar descuento)
       │
       ├──► discount.Validate()
       │    (validar parámetros)
       │
       └──► discount.CalculateDiscount()
            (calcular descuento)
       │
       ▼
HTTP 200 OK (DiscountResponseDto)
```

---

## Serialización JSON

Se utiliza `System.Text.Json` con soporte para polimorfismo mediante discriminadores de tipo:

```csharp
[JsonDerivedType(typeof(PercentageDiscount), typeDiscriminator: "percentage")]
[JsonDerivedType(typeof(FixedAmountDiscount), typeDiscriminator: "fixedAmount")]
[JsonDerivedType(typeof(TwoForOneDiscount), typeDiscriminator: "twoForOne")]
public abstract class Discounts { }
```

Configuración en `Program.cs`:
```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
        options.JsonSerializerOptions.IncludeFields = true;
    });
```

---

## Configuración y Dependencias

### NuGet Packages

| Paquete | Versión | Propósito |
|---------|---------|----------|
| Microsoft.EntityFrameworkCore | 10.0.2 | ORM principal |
| Microsoft.EntityFrameworkCore.InMemory | 10.0.2 | Base de datos en memoria |
| Swashbuckle.AspNetCore | 10.1.2 | Documentación Swagger |
| DotNetEnv | 3.1.1 | Variables de entorno |

### Variables de Entorno

Configuradas en archivo `.env`:

```env
FRONTEND_URLS=http://localhost:5173
INMEMORY_DB_NAME=DiscountsDb
DB_MOCKUP=true
```

**Uso en código:**
```csharp
var frontendOrigins = Environment.GetEnvironmentVariable("FRONTEND_URLS") 
                      ?? "http://localhost:5173";
var inMemoryDbName = Environment.GetEnvironmentVariable("INMEMORY_DB_NAME") 
                     ?? "DiscountsDb";
var dbmockup = Environment.GetEnvironmentVariable("DB_MOCKUP") == "true";
```

---

## CORS Configuration

Configuración para permitir peticiones desde el frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

app.UseCors("AllowFrontend");
```

**Seguridad:**
- Origins configurables por entorno
- Solo permite origins especificados
- Permite todos los headers y métodos HTTP

---

## Validación

Cada tipo de descuento implementa su propia lógica de validación:

### Validación Base
```csharp
public virtual ValidationResult Validate(int quantity)
{
    if (quantity <= 0)
        return ValidationResult.Failure("Quantity must be greater than zero.");
    
    return ValidationResult.Success();
}
```

### Validaciones Específicas

**FixedAmountDiscount**:
```csharp
public override ValidationResult Validate(int quantity)
{
    var baseValidation = base.Validate(quantity);
    if (!baseValidation.IsValid)
        return baseValidation;

    float originalTotal = CalculateOriginalTotal(unitPrice, quantity);
    if (_amount > originalTotal)
        return ValidationResult.Failure(
            "Discount amount cannot exceed the total price."
        );
    
    return ValidationResult.Success();
}
```

---

## Base de Datos

### In-Memory Database

Configuración en `Program.cs`:
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase(inMemoryDbName));
```

**Características:**
- ✅ No requiere SQL Server u otro motor
- ✅ Datos se pierden al reiniciar la aplicación
- ✅ Ideal para desarrollo y testing
- ✅ Rápida y sin configuración adicional
- ⚠️ No apta para producción

### Seed Data (Datos de Prueba)

```csharp
var dbmockup = Environment.GetEnvironmentVariable("DB_MOCKUP") == "true";
if (dbmockup)
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbMockups.Seed(context);
}
```

---

## Swagger/OpenAPI

Documentación automática de la API disponible en desarrollo:

```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

**Acceso**: `https://localhost:5001/swagger`

**Características:**
- Documentación interactiva de endpoints
- Pruebas directas desde el navegador
- Esquemas JSON automáticos
- Ejemplos de requests/responses

---

## Extensibilidad

### Agregar Nuevo Tipo de Descuento

**Pasos:**
1. Crear clase que herede de `Discounts`
2. Implementar `CalculateDiscount()`
3. Sobrescribir `Validate()` si es necesario
4. Agregar tipo al enum `DiscountType`
5. Actualizar `DiscountFactory` con nuevo case
6. Agregar `[JsonDerivedType]` en clase base

Ver: [Guía completa para agregar tipos de descuento](../ADD_DISCOUNT_TYPE.md)

---

## Mejores Prácticas Implementadas

✅ **Separación de responsabilidades** por capas  
✅ **Inyección de dependencias** para bajo acoplamiento  
✅ **Programación a interfaces** (IDiscountRepository, IDiscountFactory)  
✅ **Inmutabilidad** en entidades (private setters)  
✅ **Validación centralizada** en entidades de dominio  
✅ **Async/Await** para operaciones no bloqueantes  
✅ **Polimorfismo** para extensibilidad  
✅ **CORS configurado** para seguridad  
✅ **Variables de entorno** para configuración flexible  
✅ **Documentación automática** con Swagger  

---

## Referencias

- [Context](CONTEXT.md) - Tecnologías y contexto del proyecto
- [API Reference](API.md) - Documentación de endpoints
- [Add Discount Type](../ADD_DISCOUNT_TYPE.md) - Guía de extensión
