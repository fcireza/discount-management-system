# Arquitectura del Frontend

## Modern React Architecture

El proyecto sigue una arquitectura modular y escalable utilizando React con TypeScript y Material-UI.

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                            │
│              (Estado Global y Navegación)                   │
├─────────────────────────────────────────────────────────────┤
│                          Pages                              │
│        (List, Form, FormSimulator, Details)                 │
├─────────────────────────────────────────────────────────────┤
│                       Components                            │
│              (Componentes Reutilizables)                    │
├─────────────────────────────────────────────────────────────┤
│                          Hooks                              │
│          (Lógica Reutilizable y Side Effects)               │
├─────────────────────────────────────────────────────────────┤
│                       API Layer                             │
│            (HTTP Client y API Calls)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
src/
├── api/                 # Capa de comunicación con backend
│   ├── client.ts       # HTTP client base
│   ├── discountAPI.ts  # Endpoints de descuentos
│   └── types.ts        # Tipos TypeScript para API
├── assets/             # Imágenes y recursos estáticos
├── components/         # Componentes reutilizables
│   └── selectTypeDiscount.tsx
├── config/             # Configuración centralizada
│   └── discountConfig.ts  # Config de tipos de descuento (DISCOUNT_CONFIG)
├── hooks/              # Custom React Hooks
│   ├── useAsync.ts     # Hook para operaciones asíncronas
│   └── useDiscountTypes.ts
├── pages/              # Páginas/Vistas principales
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Home.tsx        # Router de páginas
│   └── Discounts/      # Módulo de descuentos
│       ├── List.tsx
│       ├── Form.tsx
│       ├── FormSimulator.tsx
│       └── Details.tsx
├── App.tsx             # Componente raíz
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

---

## Capas de la Aplicación

### 1. API Layer

Responsable de todas las comunicaciones con el backend.

#### HTTP Client (`api/client.ts`)
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5107/api';

export async function httpClient<T>(
    input: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${BASE_URL}${input}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    
    if (!response.ok) {
        throw new Error(await response.text());
    }
    
    return response.json();
}
```

#### Discount API (`api/discountAPI.ts`)
Expone métodos tipados para operaciones CRUD:
- `getAllDiscounts()`
- `getDiscountById(id)`
- `createDiscount(data)`
- `deleteDiscount(id)`
- `applyDiscount(data)`

---

### 2. Custom Hooks

#### useAsync
Hook genérico para manejar estados de operaciones asíncronas:

```typescript
interface UseAsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

function useAsync<T>(asyncFunction: () => Promise<T>): UseAsyncState<T>
```

**Estados manejados:**
- `loading`: Durante la ejecución
- `data`: Resultado exitoso
- `error`: Mensaje de error

---

### 3. Components (Componentes Reutilizables)

#### SelectTypeDiscount
Selector compuesto que muestra campos dinámicos según el tipo de descuento, derivados de `DISCOUNT_CONFIG`:

**Props:**
```typescript
interface Props {
    value: DiscountType | '';
    onChange: (type: DiscountType | '') => void;
    fieldValues: Record<string, string>;
    onFieldChange: (name: string, value: string) => void;
}
```

**Comportamiento:**
- Muestra selector de tipo dropdown (opciones derivadas de `DISCOUNT_CONFIG`)
- Renderiza campos dinámicamente según `config.fields` del tipo seleccionado
- Muestra adornments (prefijo/sufijo) y placeholders configurados
- Muestra `infoMessage` cuando el tipo no requiere campos adicionales

### 4. Config (Configuración Centralizada)

#### DISCOUNT_CONFIG
Fuente única de verdad para la UI de tipos de descuento en `config/discountConfig.ts`:

```typescript
export const DISCOUNT_CONFIG: Record<DiscountType, DiscountTypeConfig> = {
  PercentageDiscount: {
    label: 'Porcentaje',
    fields: [{ name, responseField, label, type, inputProps, adornment }],
    formatter: (d) => `${d._percentage}%`,
  },
  // ... otros tipos
};
```

**Cada entrada define:**
- `label`: Nombre para mostrar en el Select
- `fields`: Campos del formulario (renderizados dinámicamente)
- `formatter`: Cómo mostrar el valor en lista/detalles
- `infoMessage`: Mensaje informativo opcional

---

### 4. Pages (Páginas)

#### Home.tsx
Router interno que renderiza la página correcta según el estado de navegación:

```typescript
type Page =
  | { view: 'list' }
  | { view: 'form' }
  | { view: 'simulator'; discountId?: string }
  | { view: 'details'; discountId: string };
```

#### List (Listado)
- **Responsabilidad**: Mostrar todos los descuentos en tabla
- **Hooks utilizados**: `useAsync` para carga de datos
- **Interacciones**: 
  - Navegación a Form, Simulator, Details
  - Eliminación con confirmación

#### Form (Formulario de Creación)
- **Responsabilidad**: Crear nuevos descuentos
- **Estado local**: Nombre, tipo, percentage, amount
- **Validación**: Campos requeridos según tipo

#### FormSimulator (Simulador)
- **Responsabilidad**: Aplicar descuentos y mostrar resultados
- **Inputs**: ID de descuento, precio unitario, cantidad
- **Output**: Total original, descuento, total final

#### Details (Detalles)
- **Responsabilidad**: Mostrar información completa de un descuento
- **Navegación**: Desde lista o simulador

---

## Gestión de Estado

### Estado Local (useState)
Para estado específico de componentes:
- Formularios
- UI temporal (modals, confirmaciones)
- Campos de input

### Estado de Navegación
Manejado en `App.tsx` mediante tipo union `Page`:
```typescript
const [page, setPage] = useState<Page>({ view: 'list' });
```

**Ventajas:**
- Type-safe navigation
- Sin dependencias externas de routing
- Control total del estado

### Estado de Servidor (useAsync)
Para datos fetched del backend:
- Lista de descuentos
- Descuento individual
- Resultados de simulación

---

## Patrones de Diseño

### 1. Container/Presentational Pattern
- **Pages**: Containers con lógica y estado
- **Components**: Presentacionales y reutilizables

### 2. Custom Hooks Pattern
Lógica reutilizable extraída en hooks:
- `useAsync`: Manejo de async operations
- `useDiscountTypes`: Derivar opciones, labels y formatters desde `DISCOUNT_CONFIG`

### 3. Configuration-Driven UI Pattern
Los componentes de descuento se renderizan dinámicamente desde `DISCOUNT_CONFIG`:
- Select options, form fields, list formatting y detail view se generan automáticamente
- Agregar un nuevo tipo de descuento no requiere modificar componentes

### 3. Composition Pattern
Componentes compuestos a partir de Material-UI:
```tsx
<Box>
  <Card>
    <CardContent>
      <Typography>...</Typography>
    </CardContent>
  </Card>
</Box>
```

---

## Tipado con TypeScript

### Tipos de API
```typescript
export type DiscountType = 'PercentageDiscount' | 'FixedAmountDiscount' | 'TwoForOneDiscount';

export interface Discount {
  _discountId: string;
  _name: string;
  _typeDiscount: DiscountType;
  _percentage?: number;
  _amount?: number;
}
```

### Props de Componentes
Todas las props están fuertemente tipadas con interfaces.

---

## Estilización

### Material-UI (MUI)
Sistema de diseño principal:
- Componentes prediseñados
- Theme customization
- Responsive por defecto
- Iconos con `@mui/icons-material`

### Emotion
CSS-in-JS provider de Material-UI:
- Estilos encapsulados
- Props dinámicas
- Theme access

### CSS Global
`index.css` para estilos base del HTML.

---

## Build y Optimización

### Vite
Build tool moderno:
- **HMR**: Hot Module Replacement ultra rápido
- **Tree Shaking**: Eliminación de código no usado
- **Code Splitting**: Carga optimizada
- **TypeScript**: Soporte nativo

### Optimizaciones
```typescript
// Lazy loading (futuro)
const List = lazy(() => import('./pages/Discounts/List'));

// Memoization para componentes pesados
const MemoizedList = memo(DiscountList);
```

---

## Manejo de Errores

### Try-Catch en API Calls
```typescript
try {
  const data = await createDiscount(formData);
  // Success handling
} catch (error) {
  setError(error.message);
}
```

### Error Boundaries (recomendado agregar)
Para capturar errores de renderizado en producción.

---

## Testing (Preparado para)

El código está estructurado para facilitar testing:

- **Unit Tests**: Funciones puras, custom hooks
- **Component Tests**: React Testing Library
- **Integration Tests**: Mock API calls
- **E2E Tests**: Playwright o Cypress

---

## Accesibilidad

Material-UI incluye accesibilidad por defecto:
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

---

## Performance

### Optimizaciones actuales:
- SWC para compilación rápida (Vite plugin)
- Mínimas re-renderizaciones
- Lazy loading de imágenes

### Mejoras futuras:
- React.memo para componentes pesados
- useMemo/useCallback para cálculos
- Virtual scrolling para listas grandes
- Service Workers para caching

---

## Extensibilidad

### Agregar nueva página:
1. Crear componente en `pages/`
2. Agregar vista al tipo `Page`
3. Actualizar router en `Home.tsx`
4. Agregar navegación en `Header.tsx`

### Agregar nuevo tipo de descuento:
1. Actualizar union type `DiscountType` y interfaces en `api/types.ts`
2. Agregar entrada en `DISCOUNT_CONFIG` en `config/discountConfig.ts`
3. Los componentes se actualizan automáticamente

Ver: [Guía para agregar nuevos tipos de descuento](../ADD_DISCOUNT_TYPE.md)
