# API Reference - Sistema de Descuentos

Base URL: `http://localhost:5000/api` | `https://localhost:5001/api`

## Autenticación

**Estado actual**: Sin autenticación  
**Para producción**: Considerar JWT o API Keys

---

## Endpoints

### Descuentos

---

#### `GET /discounts`

Obtiene todos los descuentos registrados.

**Headers**
```
Content-Type: application/json
```

**Response** `200 OK`
```json
[
  {
    "_discountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "_name": "Descuento Verano",
    "_typeDiscount": "PercentageDiscount",
    "_percentage": 15.0
  },
  {
    "_discountId": "7bc91d28-4b2f-4891-a5e3-8d7f2c9e1a4b",
    "_name": "Cupón $50",
    "_typeDiscount": "FixedAmountDiscount",
    "_amount": 50.0
  },
  {
    "_discountId": "9df42a11-6c8e-4d72-b9f1-3e5a7b8c2f6d",
    "_name": "2x1 Especial",
    "_typeDiscount": "TwoForOneDiscount"
  }
]
```

**Notas:**
- Retorna array vacío si no hay descuentos: `[]`
- Los campos `_percentage` y `_amount` aparecen solo en sus tipos correspondientes

---

#### `GET /discounts/{discountId}`

Obtiene un descuento por su ID.

**Parámetros**
| Parámetro | Tipo | Ubicación | Descripción |
|-----------|------|-----------|-------------|
| `discountId` | GUID | Path | ID único del descuento |

**Ejemplo:**
```
GET /api/discounts/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Response** `200 OK`
```json
{
  "_discountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "_name": "Descuento Verano",
  "_typeDiscount": "PercentageDiscount",
  "_percentage": 15.0
}
```

**Errors**
- `404 Not Found`: Descuento no encontrado
  ```json
  "Discount not found"
  ```

---

#### `POST /discounts`

Crea un nuevo descuento.

**Request Body**

**Ejemplo 1: Porcentaje**
```json
{
  "name": "Black Friday",
  "type": "PercentageDiscount",
  "percentage": 25.0
}
```

**Ejemplo 2: Monto Fijo**
```json
{
  "name": "Cupón Bienvenida",
  "type": "FixedAmountDiscount",
  "amount": 100.0
}
```

**Ejemplo 3: Dos por Uno**
```json
{
  "name": "2x1 Promoción",
  "type": "TwoForOneDiscount"
}
```

**Campos**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | ✅ Sí | Nombre descriptivo del descuento |
| `type` | enum | ✅ Sí | `PercentageDiscount`, `FixedAmountDiscount`, `TwoForOneDiscount` |
| `percentage` | float | ⚠️ Condicional | Requerido si `type` es `PercentageDiscount` (0-100) |
| `amount` | float | ⚠️ Condicional | Requerido si `type` es `FixedAmountDiscount` (> 0) |

**Response** `200 OK`
```
(Sin contenido)
```

**Errors**
- `500 Internal Server Error`: Error al crear
  ```json
  "Error: [mensaje descriptivo]"
  ```

---

#### `DELETE /discounts/{discountId}`

Elimina un descuento por su ID.

**Parámetros**
| Parámetro | Tipo | Ubicación | Descripción |
|-----------|------|-----------|-------------|
| `discountId` | GUID | Path | ID único del descuento |

**Ejemplo:**
```
DELETE /api/discounts/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Response** `204 No Content`

**Errors**
- `404 Not Found`: Descuento no encontrado

---

#### `POST /discounts/apply`

Aplica un descuento a un producto/cantidad y calcula el resultado.

**Request Body**
```json
{
  "discountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "unitPrice": 100.00,
  "quantity": 5
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `discountId` | GUID | ✅ Sí | ID del descuento a aplicar |
| `unitPrice` | float | ✅ Sí | Precio unitario del producto (> 0) |
| `quantity` | int | ✅ Sí | Cantidad de productos (> 0) |

**Response** `200 OK`
```json
{
  "discountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "originalTotal": 500.00,
  "discountedApplied": 75.00,
  "finalTotal": 425.00
}
```

| Campo | Descripción |
|-------|-------------|
| `discountId` | ID del descuento aplicado |
| `originalTotal` | Precio total sin descuento (unitPrice × quantity) |
| `discountedApplied` | Monto del descuento aplicado |
| `finalTotal` | Precio final después del descuento |

**Errors**
- `404 Not Found`: Descuento no encontrado
- `500 Internal Server Error`: Error de validación
  ```json
  "Error: Quantity must be greater than zero."
  ```

---

## Ejemplos de Cálculo de Descuentos

### Descuento por Porcentaje (15%)

**Request:**
```json
{
  "discountId": "guid-percentage",
  "unitPrice": 100.0,
  "quantity": 3
}
```

**Cálculo:**
- Total original: $100 × 3 = $300
- Descuento: $300 × 15% = $45
- Total final: $300 - $45 = $255

**Response:**
```json
{
  "discountId": "guid-percentage",
  "originalTotal": 300.0,
  "discountedApplied": 45.0,
  "finalTotal": 255.0
}
```

---

### Descuento por Monto Fijo ($50)

**Request:**
```json
{
  "discountId": "guid-fixed",
  "unitPrice": 100.0,
  "quantity": 2
}
```

**Cálculo:**
- Total original: $100 × 2 = $200
- Descuento: $50 (fijo)
- Total final: $200 - $50 = $150

**Response:**
```json
{
  "discountId": "guid-fixed",
  "originalTotal": 200.0,
  "discountedApplied": 50.0,
  "finalTotal": 150.0
}
```

---

### Descuento 2x1

**Request:**
```json
{
  "discountId": "guid-twoforone",
  "unitPrice": 100.0,
  "quantity": 5
}
```

**Cálculo:**
- Total original: $100 × 5 = $500
- Items gratis: 5 ÷ 2 = 2 (división entera)
- Descuento: 2 × $100 = $200
- Total final: $500 - $200 = $300

**Response:**
```json
{
  "discountId": "guid-twoforone",
  "originalTotal": 500.0,
  "discountedApplied": 200.0,
  "finalTotal": 300.0
}
```

---

## Códigos de Estado HTTP

| Código | Descripción | Cuándo ocurre |
|--------|-------------|---------------|
| `200 OK` | Operación exitosa | GET, POST /apply |
| `204 No Content` | Eliminación exitosa | DELETE |
| `404 Not Found` | Recurso no encontrado | GET by ID, DELETE, POST /apply |
| `500 Internal Server Error` | Error interno | Validación fallida, excepciones |

---

## Swagger/OpenAPI

### Acceso a Documentación Interactiva

En modo desarrollo, Swagger UI está disponible en:
```
https://localhost:5001/swagger
```

### Características

✅ **Documentación automática** de todos los endpoints  
✅ **Testing interactivo** desde el navegador  
✅ **Esquemas JSON** de requests y responses  
✅ **Códigos de estado** documentados  
✅ **Ejemplos** de cada tipo de descuento  

### Cómo Probar Endpoints en Swagger

1. Navega a `https://localhost:5001/swagger`
2. Expande un endpoint (ej: `POST /api/discounts`)
3. Click en **"Try it out"**
4. Completa el JSON de request en el editor
5. Click en **"Execute"**
6. Revisa la respuesta en la sección "Response body"

---

## Ejemplos de Uso con cURL

### Crear Descuento Porcentual
```bash
curl -X POST https://localhost:5001/api/discounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Black Friday",
    "type": "PercentageDiscount",
    "percentage": 25.0
  }'
```

### Crear Descuento Monto Fijo
```bash
curl -X POST https://localhost:5001/api/discounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cupón $100",
    "type": "FixedAmountDiscount",
    "amount": 100.0
  }'
```

### Crear Descuento 2×1
```bash
curl -X POST https://localhost:5001/api/discounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Promo 2x1",
    "type": "TwoForOneDiscount"
  }'
```

### Listar Todos los Descuentos
```bash
curl https://localhost:5001/api/discounts
```

### Obtener Descuento Específico
```bash
curl https://localhost:5001/api/discounts/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

### Aplicar Descuento
```bash
curl -X POST https://localhost:5001/api/discounts/apply \
  -H "Content-Type: application/json" \
  -d '{
    "discountId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "unitPrice": 50.0,
    "quantity": 4
  }'
```

### Eliminar Descuento
```bash
curl -X DELETE https://localhost:5001/api/discounts/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

---

## Validaciones

### Validaciones de Creación

**Todos los tipos:**
- ❌ `name` vacío o null
- ❌ `type` inválido o no especificado

**PercentageDiscount:**
- ❌ `percentage` no especificado
- ❌ `percentage` < 0 o > 100

**FixedAmountDiscount:**
- ❌ `amount` no especificado
- ❌ `amount` <= 0

**TwoForOneDiscount:**
- ✅ No requiere campos adicionales

### Validaciones de Aplicación

**Todos los tipos:**
- ❌ `discountId` no existe
- ❌ `unitPrice` <= 0
- ❌ `quantity` <= 0

**FixedAmountDiscount específico:**
- ❌ `amount` > (unitPrice × quantity)
  - Ejemplo: No se puede aplicar descuento de $100 sobre total de $50

### Mensajes de Error

**Formato:**
```json
"Error: [mensaje descriptivo]"
```

**Ejemplos:**
```json
"Discount not found"
"Error: Quantity must be greater than zero."
"Error: Discount amount cannot exceed the total price."
```

---

## Tipos de Descuento Detallados

### PercentageDiscount

**Descripción**: Aplica un porcentaje de descuento sobre el total.  
**Parámetros**: `percentage` (0-100)  
**Fórmula**: `descuento = (unitPrice × quantity × percentage) / 100`

**Ejemplo Request de Creación:**
```json
{
  "name": "Descuento Verano",
  "type": "PercentageDiscount",
  "percentage": 15.0
}
```

**Casos de uso:**
- Ventas estacionales
- Descuentos por volumen
- Promociones temporales

---

### FixedAmountDiscount

**Descripción**: Aplica un monto fijo de descuento.  
**Parámetros**: `amount` (valor positivo)  
**Fórmula**: `descuento = min(amount, unitPrice × quantity)`  
**Validación especial**: El descuento no puede exceder el total

**Ejemplo Request de Creación:**
```json
{
  "name": "Cupón $50",
  "type": "FixedAmountDiscount",
  "amount": 50.0
}
```

**Casos de uso:**
- Cupones de bienvenida
- Descuentos por fidelidad
- Compensaciones

---

### TwoForOneDiscount

**Descripción**: Por cada 2 productos, se paga solo 1.  
**Parámetros**: Ninguno  
**Fórmula**: `descuento = (quantity / 2) × unitPrice` (división entera)  
**Nota**: Cantidad impar resulta en redondeo hacia abajo

**Ejemplo Request de Creación:**
```json
{
  "name": "2×1 Especial",
  "type": "TwoForOneDiscount"
}
```

**Casos de uso:**
- Liquidación de stock
- Promociones de productos específicos
- Venta cruzada

**Ejemplos de cantidades:**
| Cantidad | Items Gratis | Descuento |
|----------|--------------|-----------|
| 1 | 0 | $0 |
| 2 | 1 | 1 × unitPrice |
| 3 | 1 | 1 × unitPrice |
| 4 | 2 | 2 × unitPrice |
| 5 | 2 | 2 × unitPrice |

---

## Testing con Postman

### Importar Collection

Puedes crear una colección de Postman con estos endpoints:

**Environment Variables:**
- `base_url`: `https://localhost:5001`
- `discount_id`: (guardar del response de crear)

**Secuencia de prueba sugerida:**
1. ✅ Crear descuento → guardar `_discountId`
2. ✅ Listar todos → verificar que aparece
3. ✅ Obtener por ID → verificar datos
4. ✅ Aplicar descuento → verificar cálculo
5. ✅ Eliminar → verificar eliminación
6. ✅ Listar todos → verificar que no aparece

### Pre-request Scripts (Ejemplo)

```javascript
// Generar GUID para tests
pm.globals.set("discount_id", pm.variables.replaceIn('{{$guid}}'));
```

### Tests (Ejemplo)

```javascript
// Verificar status 200
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Guardar ID del descuento
pm.test("Save discount ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("discount_id", jsonData._discountId);
});
```

---

## CORS Headers

La API incluye headers CORS para permitir peticiones desde el frontend:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Content-Type
```

**Configuración:**
- Definido mediante variable de entorno `FRONTEND_URLS`
- Múltiples origins separados por coma
- Configurado en `Program.cs`

---

## Rate Limiting

**Estado actual**: ❌ No implementado  
**Para producción**: ✅ Considerar agregar:
- Middleware de rate limiting
- Límites por IP o API key
- Respuestas 429 Too Many Requests

---

## Versionado

**Versión actual**: v1 (implícita)  
**Para futuro**: Considerar versionado explícito:
- En URL: `/api/v1/discounts`, `/api/v2/discounts`
- En headers: `Accept: application/vnd.api.v1+json`

---

## Performance Tips

### Optimizaciones Actuales
- ✅ In-Memory DB (muy rápido)
- ✅ Async/Await (no bloqueante)
- ✅ JSON serialization eficiente

### Para Producción
- Agregar caching (Redis)
- Response compression
- Paginación para grandes datasets
- Connection pooling en DB real

---

## Troubleshooting

### Error: "Certificate validation failed"

**Solución para desarrollo:**
```bash
# Solo para desarrollo/testing
curl -k https://localhost:5001/api/discounts
```

### Error: "CORS policy blocked"

**Causa**: Frontend URL no está en `FRONTEND_URLS`

**Solución**: Agregar URL al archivo `.env`:
```env
FRONTEND_URLS=http://localhost:5173,http://localhost:3000
```

### Error: "Discount not found"

**Causa**: ID inválido o descuento eliminado

**Solución**: Verificar ID con `GET /discounts`

---

## Referencias

- [Architecture](ARCHITECTURE.md) - Diseño del sistema
- [Context](CONTEXT.md) - Tecnologías y contexto
- [Add Discount Type](../ADD_DISCOUNT_TYPE.md) - Extender con nuevos tipos
