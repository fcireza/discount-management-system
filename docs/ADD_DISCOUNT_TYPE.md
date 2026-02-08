# Adding a New Discount Type | Agregar Nuevo Tipo de Descuento

Complete guide to extend the system with new discount types.  
Guía completa para extender el sistema con nuevos tipos de descuento.

---

## Table of Contents | Índice

### English 🇬🇧
- [Prerequisites](#prerequisites)
- [Overview](#overview)
- [Backend Implementation](#backend-implementation)
  - [Step 1: Create Domain Entity](#step-1-create-domain-entity)
  - [Step 2: Update DiscountType Enum](#step-2-update-discounttype-enum)
  - [Step 3: Update JSON Serialization](#step-3-update-json-serialization)
  - [Step 4: Update DTOs](#step-4-update-dtos)
  - [Step 5: Update DiscountFactory](#step-5-update-discountfactory)
  - [Backend Testing](#backend-testing)
- [Frontend Implementation](#frontend-implementation)
  - [Step 6: Update TypeScript Types](#step-6-update-typescript-types)
  - [Step 7: Add Entry to DISCOUNT_CONFIG](#step-7-add-entry-to-discount_config)
  - [Frontend Testing](#frontend-testing)
- [Common Pitfalls](#common-pitfalls)
- [Testing Checklist](#testing-checklist)
- [Troubleshooting](#troubleshooting)
- [Example: Full Implementation](#example-full-implementation)
- [Need Help?](#need-help)

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

## Backend Implementation

### Step 1: Create Domain Entity

Create a new class in `backend/src/Domain/Entities/` that extends `Discounts`.

**Example**: Adding a "Buy X Get Y" discount

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
        // Calculate how many free items
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

**Key Points:**
- Inherit from `Discounts` base class
- Implement `CalculateDiscount()` with your business logic
- Override `Validate()` for custom validation rules
- Use private setters to ensure immutability

---

### Step 2: Update DiscountType Enum

Add your new type to the enum in `backend/src/Domain/Enums/DiscountType.cs`:

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
        
        // Add your new type
        [EnumMember(Value = "buyXGetY")]
        BuyXGetY
    }
}
```

**Important:**
- Use `[EnumMember]` attribute for JSON serialization
- Keep the naming convention consistent

---

### Step 3: Update JSON Serialization

Add JSON derived type to the base `Discounts` class in `backend/src/Domain/Entities/Discounts.cs`:

```csharp
[JsonDerivedType(typeof(PercentageDiscount), typeDiscriminator: "percentage")]
[JsonDerivedType(typeof(FixedAmountDiscount), typeDiscriminator: "fixedAmount")]
[JsonDerivedType(typeof(TwoForOneDiscount), typeDiscriminator: "twoForOne")]
[JsonDerivedType(typeof(BuyXGetYDiscount), typeDiscriminator: "buyXGetY")] // Add this
public abstract class Discounts
{
    // ... existing code
}
```

---

### Step 4: Update DTOs

Add properties to `CreateDiscountDto` in `backend/src/Application/DTOs/CreateDiscountDto.cs`:

```csharp
public class CreateDiscountDto
{
    public string name { get; set; }
    public DiscountType Type { get; set; }
    public float? percentage { get; set; }
    public float? amount { get; set; }
    
    // Add new properties
    public int? buyQuantity { get; set; }
    public int? getQuantity { get; set; }
}
```

---

### Step 5: Update DiscountFactory

Add factory logic in `backend/src/Infrastructure/Factories/DiscountFactory.cs`:

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
            
        // Add your new case
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

---

### Backend Testing

1. **Build the project:**
   ```bash
   cd backend
   dotnet build
   ```

2. **Run the API:**
   ```bash
   dotnet run
   ```

3. **Test with Swagger** (`https://localhost:5001/swagger`):
   - Create a new discount with your type
   - Apply it and verify calculation
   - Check validation rules

4. **Manual test with curl:**
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

## Frontend Implementation

The frontend uses a **centralized configuration system** (`DISCOUNT_CONFIG`) that drives the UI dynamically. Adding a new discount type requires changes in only **two files**: `types.ts` and `discountConfig.ts`. No component modifications needed.

### Step 6: Update TypeScript Types

Add the new type and its properties to `frontend/src/api/types.ts`:

```typescript
// 1. Add to the DiscountType union
export type DiscountType = 'PercentageDiscount' | 'FixedAmountDiscount' | 'TwoForOneDiscount' | 'BuyXGetY';

// 2. Add response properties to Discount interface
export interface Discount {
  _discountId: string;
  _name: string;
  _typeDiscount: DiscountType;
  _percentage?: number;
  _amount?: number;
  // Add new properties
  _buyQuantity?: number;
  _getQuantity?: number;
}

// 3. Add request properties to CreateDiscountRequest
export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  percentage?: number;
  amount?: number;
  // Add new properties
  buyQuantity?: number;
  getQuantity?: number;
}
```

---

### Step 7: Add Entry to DISCOUNT_CONFIG

Add a new entry to `frontend/src/config/discountConfig.ts`. **This is the only other file you need to modify.** The Select options, form fields, detail view, and list formatting are all driven from this config automatically.

```typescript
// File: frontend/src/config/discountConfig.ts

export const DISCOUNT_CONFIG: Record<DiscountType, DiscountTypeConfig> = {
  // ... existing entries ...

  // Add your new type
  BuyXGetY: {
    label: 'Compre X Lleve Y',
    fields: [
      {
        name: 'buyQuantity',             // Property name in CreateDiscountRequest
        responseField: '_buyQuantity',    // Property name in Discount response
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

**That's it!** The following components automatically pick up the new type:
- **SelectTypeDiscount**: Shows the new option in the dropdown and renders its fields
- **Form.tsx**: Handles field state and builds the create request dynamically
- **List.tsx**: Formats the discount value using the `formatter`
- **Details.tsx**: Displays detail fields with labels and adornments

#### DiscountTypeConfig Reference

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display name in Select dropdown |
| `fields` | `FieldConfig[]` | Form fields to render (empty array = no extra fields) |
| `formatter` | `(discount: Discount) => string` | How to display the value in list/details |
| `infoMessage` | `string?` | Optional info alert shown when type is selected |

#### FieldConfig Reference

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Property name in `CreateDiscountRequest` |
| `responseField` | `string` | Property name in `Discount` response (with `_` prefix) |
| `label` | `string` | Field label shown in form |
| `type` | `'number' \| 'text'` | Input type |
| `placeholder` | `string?` | Input placeholder |
| `inputProps` | `Record<string, number>?` | HTML input attributes (min, max, step) |
| `adornment` | `{ position, text }?` | Prefix/suffix adornment (e.g., `$`, `%`) |

---

### Frontend Testing

1. **Run the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Manual testing:**
   - Navigate to Create Discount form
   - Select your new discount type
   - Verify that the correct fields appear
   - Fill in the form and submit
   - Check that it appears in the list
   - Use the simulator to test calculation

3. **Browser DevTools:**
   - Check Network tab for API calls
   - Verify request payload structure
   - Check for console errors

---

## Common Pitfalls

### ❌ Don't Forget:
- [ ] JSON serialization attributes
- [ ] Enum member values matching
- [ ] DTO property validation
- [ ] Factory pattern case
- [ ] Frontend `DiscountType` union type
- [ ] Frontend `DISCOUNT_CONFIG` entry

### ✅ Best Practices:
- Use immutable properties (private setters)
- Validate inputs in both backend and frontend
- Keep naming consistent across layers
- Add helpful error messages
- Test edge cases (zero quantity, negative values)
- Document complex business logic
- Use `DISCOUNT_CONFIG` as the single source of truth for frontend UI

---

## Testing Checklist

- [ ] Backend builds without errors
- [ ] Swagger shows new type in schema
- [ ] Can create discount via API
- [ ] Calculation logic is correct
- [ ] Validation rules work as expected
- [ ] Frontend TypeScript compiles (`npx tsc --noEmit`)
- [ ] New type appears in Select dropdown
- [ ] Form fields render correctly for the new type
- [ ] Can create discount via UI
- [ ] List displays formatted value correctly
- [ ] Details page shows field values
- [ ] Simulator works with new type
- [ ] Can delete discount

---

## Troubleshooting

### Issue: "Invalid discount type" error

**Solution:** Check that enum values match exactly:
- Backend: `[EnumMember(Value = "buyXGetY")]`
- Frontend: `BuyXGetY = 'BuyXGetY'`
- API call: `"type": "BuyXGetY"`

### Issue: Fields not appearing in form

**Solution:** Verify:
1. `DISCOUNT_CONFIG` entry has the correct `fields` array
2. Each field has correct `name` and `responseField`
3. The `DiscountType` string in `DISCOUNT_CONFIG` matches the type in `types.ts`

### Issue: Calculation returns wrong result

**Solution:**
1. Add console logs to debug calculation
2. Test with Swagger first to isolate backend logic
3. Verify formula implementation
4. Check for integer division issues

---

## Example: Full Implementation

See the existing `TwoForOneDiscount` implementation as a reference:
- Backend: [TwoForOneDiscount.cs](../backend/src/Domain/Entities/TwoForOneDiscount.cs)
- Frontend types: [types.ts](../frontend/src/api/types.ts)
- Frontend config: [discountConfig.ts](../frontend/src/config/discountConfig.ts)
- Frontend component: [selectTypeDiscount.tsx](../frontend/src/components/selectTypeDiscount.tsx)

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

### Ejemplo Completo

Ver la implementación en inglés arriba para código detallado del ejemplo "Buy X Get Y".

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

**¡Listo! Tu nuevo tipo de descuento ahora está integrado en todo el sistema.**
