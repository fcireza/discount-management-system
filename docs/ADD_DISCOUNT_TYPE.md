# Adding a New Discount Type | Agregar Nuevo Tipo de Descuento

Complete guide to extend the system with new discount types.  
Guía completa para extender el sistema con nuevos tipos de descuento.

---

## Table of Contents | Índice

### English 🇬🇧
- [Adding a New Discount Type | Agregar Nuevo Tipo de Descuento](#adding-a-new-discount-type--agregar-nuevo-tipo-de-descuento)
  - [Table of Contents | Índice](#table-of-contents--índice)
    - [English 🇬🇧](#english-)
    - [Español 🇪🇸](#español-)
  - [English 🇬🇧](#english--1)
    - [Prerequisites](#prerequisites)
    - [Overview](#overview)
  - [Common Pitfalls](#common-pitfalls)
    - [✅ Best Practices:](#-best-practices)
  - [Need Help?](#need-help)
- [Español 🇪🇸](#español--1)
  - [Agregando un Nuevo Tipo de Descuento](#agregando-un-nuevo-tipo-de-descuento)
    - [Resumen del Proceso](#resumen-del-proceso)
    - [Pasos Principales](#pasos-principales)
      - [Backend](#backend)
      - [Frontend](#frontend)
    - [Lista de Verificación](#lista-de-verificación)
  - [Implementación Detallada (Backend)](#implementación-detallada-backend)
    - [Paso 1: Crear la Entidad de Dominio](#paso-1-crear-la-entidad-de-dominio)
    - [Paso 2: Actualizar el Enum `DiscountType`](#paso-2-actualizar-el-enum-discounttype)
    - [Paso 3: Actualizar la Serialización JSON (Polimorfismo)](#paso-3-actualizar-la-serialización-json-polimorfismo)
    - [Paso 4: Actualizar los DTOs](#paso-4-actualizar-los-dtos)
    - [Paso 5: Actualizar la `DiscountFactory`](#paso-5-actualizar-la-discountfactory)
    - [Testing Backend](#testing-backend)
  - [Implementación Detallada (Frontend)](#implementación-detallada-frontend)
    - [Paso 6: Actualizar Tipos de TypeScript](#paso-6-actualizar-tipos-de-typescript)
    - [Paso 7: Agregar Entrada en `DISCOUNT_CONFIG`](#paso-7-agregar-entrada-en-discount_config)
    - [Referencia Rápida de Configuración](#referencia-rápida-de-configuración)
    - [Testing Frontend](#testing-frontend)

### Español 🇪🇸
- [Agregando un Nuevo Tipo de Descuento](#agregando-un-nuevo-tipo-de-descuento)
  - [Resumen del Proceso](#resumen-del-proceso)
  - [Pasos Principales](#pasos-principales)
  - [Ejemplo Completo](#ejemplo-completo)
  - [Lista de Verificación](#lista-de-verificación)

---

## English 🇬🇧

### Prerequisites

- Understanding of C# and object-oriented programming
- Basic knowledge of React and TypeScript
- Familiarity with the project structure

### Overview

Adding a new discount type requires changes in both backend and frontend. Follow these steps in order:

1. **Backend**: Create domain logic
2. **Backend**: Update factory and enum
3. **Frontend**: Update types and UI components
4. **Testing**: Verify full integration

---

## Common Pitfalls

### ✅ Best Practices:
- Use immutable properties (private setters)
- Validate inputs in both backend and frontend
- Keep naming consistent across layers
- Add helpful error messages
- Test edge cases (zero quantity, negative values)
- Document complex business logic
- Use `DISCOUNT_CONFIG` as the single source of truth for frontend UI

---

## Need Help?

- Review existing discount implementations
- Check [Backend Architecture](backend/ARCHITECTURE.md)
- Check [Frontend Architecture](frontend/ARCHITECTURE.md)
- Test incrementally (backend first, then frontend)

---

# Español 🇪🇸

## Agregando un Nuevo Tipo de Descuento

### Resumen del Proceso

1. **Backend**: Crear entidad de dominio
2. **Backend**: Actualizar factory y enum
3. **Frontend**: Actualizar tipos y componentes UI
4. **Testing**: Verificar integración completa

### Pasos Principales

#### Backend

1. **Crear clase de entidad** en `backend/src/Domain/Entities/`
   - Heredar de `Discounts`
   - Implementar `CalculateDiscount()`
   - Sobrescribir `Validate()` si es necesario

2. **Actualizar enum** `DiscountType` con el nuevo tipo

3. **Agregar atributo JSON** `[JsonDerivedType]` en clase base

4. **Actualizar DTO** `CreateDiscountDto` con nuevas propiedades

5. **Actualizar Factory** con el nuevo case en el switch

#### Frontend

6. **Actualizar tipos TypeScript** en `api/types.ts`
   - Agregar tipo al union `DiscountType`
   - Agregar propiedades a `Discount` y `CreateDiscountRequest`

7. **Agregar entrada en `DISCOUNT_CONFIG`** en `config/discountConfig.ts`
   - Definir label, campos del formulario y formatter
   - Los componentes (Select, Form, List, Details) se actualizan automáticamente


### Lista de Verificación

- [ ] Backend compila sin errores
- [ ] Se puede crear descuento vía API
- [ ] Cálculo funciona correctamente
- [ ] Frontend compila sin errores (`npx tsc --noEmit`)
- [ ] Nuevo tipo aparece en el Select
- [ ] Formulario muestra campos correctos
- [ ] Se puede crear descuento vía UI
- [ ] Lista muestra valor formateado correctamente
- [ ] Detalles muestran los campos del tipo
- [ ] Simulador funciona con el nuevo tipo

---

## Implementación Detallada (Backend)

### Paso 1: Crear la Entidad de Dominio

Crea una nueva clase en `backend/src/Domain/Entities/` que herede de `Discounts`.

**Ejemplo**: Descuento "Compre X y Lleve Y"

```csharp
// File: backend/src/Domain/Entities/BuyXGetYDiscount.cs

using backend.src.domain.Entities.Discounts;
using backend.src.domain.Enums;

namespace backend.src.domain.Entities;

public class BuyXGetYDiscount : Discounts
{
    public int _buyQuantity { get; private set; }
    public int _getQuantity { get; private set; }

    public BuyXGetYDiscount(
        Guid discountId,
        string name,
        int buyQuantity,
        int getQuantity
    ) : base(discountId, name, DiscountType.BuyXGetY)
    {
        _buyQuantity = buyQuantity;
        _getQuantity = getQuantity;
    }

    public override float CalculateDiscount(float unitPrice, int quantity)
    {
        // Calcular cuántos ítems gratis corresponden
        int completeSets = quantity / (_buyQuantity + _getQuantity);
        int freeItems = completeSets * _getQuantity;

        return freeItems * unitPrice;
    }

    public override ValidationResult Validate(int quantity)
    {
        var baseValidation = base.Validate(quantity);
        if (!baseValidation.IsValid)
            return baseValidation;

        if (quantity < _buyQuantity)
            return ValidationResult.Failure(
                $"Quantity must be at least {_buyQuantity} to apply this discount."
            );

        return ValidationResult.Success();
    }
}
```

**Puntos clave:**
- Heredar siempre de la clase base `Discounts`.
- Implementar `CalculateDiscount()` con la lógica de negocio.
- Sobrescribir `Validate()` para reglas específicas del tipo.
- Usar setters privados para mantener inmutabilidad.

### Paso 2: Actualizar el Enum `DiscountType`

Agrega tu nuevo tipo en `backend/src/Domain/Enums/DiscountType.cs`:

```csharp
using System.Text.Json.Serialization;
using System.Runtime.Serialization;

namespace backend.src.domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum DiscountType
    {
        [EnumMember(Value = "percentage")]
        PercentageDiscount,

        [EnumMember(Value = "fixedAmount")]
        FixedAmountDiscount,

        [EnumMember(Value = "twoForOne")]
        TwoForOneDiscount,

        // Nuevo tipo
        [EnumMember(Value = "buyXGetY")]
        BuyXGetY
    }
}
```

**Importante:**
- Usa `[EnumMember]` para controlar cómo se serializa a JSON.
- Mantén el naming consistente con el resto de tipos.

### Paso 3: Actualizar la Serialización JSON (Polimorfismo)

Agrega el tipo derivado en la clase base `Discounts` (`backend/src/Domain/Entities/Discounts.cs`):

```csharp
[JsonDerivedType(typeof(PercentageDiscount), typeDiscriminator: "percentage")]
[JsonDerivedType(typeof(FixedAmountDiscount), typeDiscriminator: "fixedAmount")]
[JsonDerivedType(typeof(TwoForOneDiscount), typeDiscriminator: "twoForOne")]
[JsonDerivedType(typeof(BuyXGetYDiscount), typeDiscriminator: "buyXGetY")]
public abstract class Discounts
{
    // ... existing code
}
```

### Paso 4: Actualizar los DTOs

Agrega las nuevas propiedades en `backend/src/Application/DTOs/CreateDiscountDto.cs`:

```csharp
public class CreateDiscountDto
{
    public string name { get; set; }
    public DiscountType Type { get; set; }
    public float? percentage { get; set; }
    public float? amount { get; set; }

    // Nuevas propiedades
    public int? buyQuantity { get; set; }
    public int? getQuantity { get; set; }
}
```

### Paso 5: Actualizar la `DiscountFactory`

Agrega el nuevo case en `backend/src/Infrastructure/Factories/DiscountFactory.cs`:

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

        // Nuevo tipo
        DiscountType.BuyXGetY =>
            new BuyXGetYDiscount(
                id,
                dto.name,
                dto.buyQuantity!.Value,
                dto.getQuantity!.Value
            ),

        _ => throw new ArgumentException("Invalid discount type")
    };
}
```

### Testing Backend

1. **Compilar el proyecto:**
   ```bash
   cd backend
   dotnet build
   ```

2. **Levantar la API:**
   ```bash
   dotnet run
   ```

3. **Probar con Swagger** (`https://localhost:5001/swagger`):
   - Crear un descuento con tu nuevo tipo.
   - Aplicarlo y verificar el cálculo.
   - Revisar mensajes de validación.

4. **Prueba rápida con curl:**
   ```bash
   curl -X POST https://localhost:5001/api/discounts \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Buy 3 Get 1",
       "type": "buyXGetY",
       "buyQuantity": 3,
       "getQuantity": 1
     }'
   ```

---

## Implementación Detallada (Frontend)

El frontend usa una **configuración centralizada** (`DISCOUNT_CONFIG`) que define cómo se muestran y editan los distintos tipos de descuento. Para agregar uno nuevo solo necesitas tocar **dos archivos**: `types.ts` y `discountConfig.ts`.

### Paso 6: Actualizar Tipos de TypeScript

Edita `frontend/src/api/types.ts` y agrega tu nuevo tipo y propiedades:

```typescript
// 1. Agregar al union DiscountType
export type DiscountType =
  | 'PercentageDiscount'
  | 'FixedAmountDiscount'
  | 'TwoForOneDiscount'
  | 'BuyXGetY';

// 2. Propiedades de respuesta en la interfaz Discount
export interface Discount {
  _discountId: string;
  _name: string;
  _typeDiscount: DiscountType;
  _percentage?: number;
  _amount?: number;
  // Nuevas propiedades
  _buyQuantity?: number;
  _getQuantity?: number;
}

// 3. Propiedades de request en CreateDiscountRequest
export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  percentage?: number;
  amount?: number;
  // Nuevas propiedades
  buyQuantity?: number;
  getQuantity?: number;
}
```

### Paso 7: Agregar Entrada en `DISCOUNT_CONFIG`

En `frontend/src/config/discountConfig.ts`, agrega la configuración para el nuevo tipo. Desde aquí se generan automáticamente:
- Las opciones del Select.
- Los campos del formulario.
- El formato de lista y detalle.

```typescript
// File: frontend/src/config/discountConfig.ts

export const DISCOUNT_CONFIG: Record<DiscountType, DiscountTypeConfig> = {
  // ... existentes ...

  BuyXGetY: {
    label: 'Compre X Lleve Y',
    fields: [
      {
        name: 'buyQuantity',
        responseField: '_buyQuantity',
        label: 'Cantidad a comprar',
        type: 'number',
        placeholder: 'Ej: 3',
        inputProps: { min: 1, step: 1 },
      },
      {
        name: 'getQuantity',
        responseField: '_getQuantity',
        label: 'Cantidad gratis',
        type: 'number',
        placeholder: 'Ej: 1',
        inputProps: { min: 1, step: 1 },
      },
    ],
    formatter: (d) => `Compre ${d._buyQuantity} Lleve ${d._getQuantity}`,
  },
};
```

Con esto, se actualizan automáticamente:
- `SelectTypeDiscount` (dropdown y campos dinámicos).
- `Form.tsx` (creación de descuentos).
- `List.tsx` (formato de valor en la tabla).
- `Details.tsx` (detalle del descuento).

### Referencia Rápida de Configuración

**`DiscountTypeConfig`**

| Propiedad     | Tipo                             | Descripción                                           |
|---------------|----------------------------------|-------------------------------------------------------|
| `label`       | `string`                         | Texto que se muestra en el Select                     |
| `fields`      | `FieldConfig[]`                  | Campos del formulario para ese tipo                   |
| `formatter`   | `(discount: Discount) => string` | Cómo se muestra el valor en lista/detalle             |
| `infoMessage` | `string?`                        | Mensaje informativo opcional en el formulario         |

**`FieldConfig`**

| Propiedad      | Tipo                    | Descripción                                      |
|----------------|-------------------------|--------------------------------------------------|
| `name`         | `string`                | Nombre en `CreateDiscountRequest`               |
| `responseField`| `string`                | Nombre en `Discount` (con prefijo `_`)          |
| `label`        | `string`                | Label del input                                  |
| `type`         | `'number' \| 'text'`   | Tipo de input HTML                               |
| `placeholder`  | `string?`               | Placeholder                                      |
| `inputProps`   | `Record<string, number>?` | Atributos HTML (min, max, step, etc.)          |
| `adornment`    | `{ position, text }?`   | Prefijo/sufijo visual (ej: `$`, `%`)             |

### Testing Frontend

1. **Levantar el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Pruebas manuales:**
   - Ir al formulario de creación de descuentos.
   - Seleccionar tu nuevo tipo.
   - Verificar que los campos dinámicos sean correctos.
   - Crear el descuento y comprobar que aparece en la lista.
   - Probarlo en el simulador.

3. **DevTools del navegador:**
   - Revisar la pestaña Network para ver el payload.
   - Verificar que no haya errores en consola.

---

**¡Listo! Tu nuevo tipo de descuento ahora está integrado en todo el sistema. ✨**
