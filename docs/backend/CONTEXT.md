# Backend Context - Sistema de Descuentos

## Propósito del Sistema

API RESTful diseñada para gestionar diferentes tipos de descuentos y aplicarlos a productos. Permite crear, consultar, eliminar y simular descuentos con lógica de negocio específica para cada tipo.

---

## Tecnologías Core

- **.NET 10.0**: Framework principal
- **ASP.NET Core Web API**: Para endpoints REST
- **Entity Framework Core**: ORM para acceso a datos
- **In-Memory Database**: Base de datos volátil para desarrollo
- **Swagger/OpenAPI**: Documentación automática de API

---

## Patrones de Diseño Implementados

### 1. Factory Pattern
**Clase**: `DiscountFactory`

Centraliza la creación de diferentes tipos de descuentos basándose en el DTO recibido.

```csharp
public Discounts CreateDiscount(CreateDiscountDto dto)
{
    return dto.Type switch
    {
        DiscountType.PercentageDiscount => new PercentageDiscount(...),
        DiscountType.FixedAmountDiscount => new FixedAmountDiscount(...),
        DiscountType.TwoForOneDiscount => new TwoForOneDiscount(...),
        _ => throw new ArgumentException("Invalid discount type")
    };
}
```

### 2. Repository Pattern
**Interface**: `IDiscountRepository`

Abstrae la lógica de acceso a datos, permitiendo cambiar la implementación sin afectar la capa de servicio.

### 3. Dependency Injection
Todas las dependencias se registran e inyectan a través del contenedor de servicios de ASP.NET Core:
- `IDiscountRepository → DiscountRepository`
- `IDiscountFactory → DiscountFactory`
- `DiscountService`

### 4. Strategy Pattern (implícito)
Cada tipo de descuento implementa su propia estrategia de cálculo mediante el método abstracto `CalculateDiscount`.

---

## Flujo de Datos

### Crear Descuento
```
HTTP POST → Controller → DiscountService 
          → Factory → Entity → Repository → Database
```

### Aplicar Descuento
```
HTTP POST → Controller → DiscountService 
          → Repository (buscar) → Entity.CalculateDiscount() 
          → DTO Response
```

---

## Tipos de Descuento

### PercentageDiscount
- **Descripción**: Aplica un porcentaje de descuento sobre el total
- **Parámetros**: `percentage` (0-100)
- **Cálculo**: `total * (percentage / 100)`
- **Ejemplo**: 15% sobre $100 = $15 de descuento

### FixedAmountDiscount
- **Descripción**: Aplica un monto fijo de descuento
- **Parámetros**: `amount` (valor positivo)
- **Cálculo**: `amount` (no puede exceder el total)
- **Ejemplo**: $50 sobre $200 = $50 de descuento

### TwoForOneDiscount
- **Descripción**: Por cada 2 items, se paga solo 1
- **Parámetros**: Ninguno
- **Cálculo**: `(quantity / 2) * unitPrice`
- **Ejemplo**: 5 items × $10 = $20 de descuento (2 items gratis)

---

## Validaciones

Cada descuento implementa validaciones específicas:

1. **Cantidad**: Debe ser mayor a 0
2. **FixedAmount**: El descuento no debe exceder el total
3. **Percentage**: Debe estar entre 0 y 100

---

## Configuración de Entorno

El backend utiliza variables de entorno (`.env`) para configuración flexible:

- **FRONTEND_URLS**: URLs permitidas para CORS
- **INMEMORY_DB_NAME**: Nombre de la base de datos en memoria
- **DB_MOCKUP**: Si se deben cargar datos de prueba al iniciar

---

## Extensibilidad

El sistema está diseñado para agregar nuevos tipos de descuento fácilmente:

1. Crear nueva clase que herede de `Discounts`
2. Implementar `CalculateDiscount` y `Validate`
3. Agregar el tipo al enum `DiscountType`
4. Actualizar `DiscountFactory` con el nuevo case
5. Agregar serialización JSON en la clase base

Ver: [Guía para agregar nuevos tipos de descuento](../ADD_DISCOUNT_TYPE.md)

---

## Base de Datos

### Modo In-Memory
- No hay persistencia real entre reinicios
- Útil para desarrollo y testing
- Configurado mediante Entity Framework Core

### Migración a Base de Datos Real
Para migrar a SQL Server, PostgreSQL u otra:

1. Instalar el paquete NuGet correspondiente
2. Modificar `Program.cs` para usar `UseSqlServer()` o similar
3. Configurar connection string en `appsettings.json`
4. Crear y aplicar migraciones con `dotnet ef migrations add`

---

## Testing

El proyecto está estructurado para facilitar testing:

- **Servicios**: Inyección de dependencias permite mocks
- **Repositorios**: Interfaces permiten test doubles
- **Lógica de dominio**: Métodos puros sin dependencias externas

---

## Seguridad

Consideraciones implementadas:

- **CORS**: Controlado mediante configuración de origins permitidos
- **HTTPS**: Redirección automática en producción
- **Validación**: DTOs validados antes de procesamiento
- **Exception Handling**: Errores capturados y sanitizados

---

## Performance

Optimizaciones actuales:

- **In-Memory Database**: Operaciones extremadamente rápidas
- **Async/Await**: Operaciones no bloqueantes
- **Dependency Injection**: Scoped lifetime para repositorios
- **JSON Serialization**: Configuración optimizada

---

## Logging

Sistema de logging integrado de ASP.NET Core:

```json
"Logging": {
  "LogLevel": {
    "Default": "Information",
    "Microsoft.AspNetCore": "Warning"
  }
}
```

Para producción, considerar:
- Serilog
- Application Insights
- ELK Stack

---

## Documentación API

Swagger UI disponible en modo desarrollo:
- URL: `https://localhost:5001/swagger`
- Generación automática desde atributos de controladores
- Permite testing interactivo de endpoints
