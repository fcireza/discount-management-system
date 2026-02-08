# Componentes y Arquitectura del Frontend

## Vista General

El frontend sigue una arquitectura basada en componentes con separación clara de responsabilidades utilizando React 19, TypeScript y Material-UI.

```
┌─────────────────────────────────────────────────────────────┐
│                          App                                │
│                  (Navegación y Estado)                      │
├─────────────────────────────────────────────────────────────┤
│                         Pages                               │
│          (List, Form, FormSimulator, Details)               │
├─────────────────────────────────────────────────────────────┤
│                       Components                            │
│              (SelectTypeDiscount, etc.)                     │
├─────────────────────────────────────────────────────────────┤
│                        Config                               │
│            (DISCOUNT_CONFIG — single source of truth)       │
├─────────────────────────────────────────────────────────────┤
│                         Hooks                               │
│              (useAsync, useDiscountTypes)                   │
├─────────────────────────────────────────────────────────────┤
│                          API                                │
│              (client, discountAPI, types)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### App.tsx

Componente raíz que maneja la navegación mediante estado local.

**Estado de Navegación:**
```typescript
type Page =
  | { view: 'list' }
  | { view: 'form' }
  | { view: 'simulator'; discountId?: string }
  | { view: 'details'; discountId: string };

const [page, setPage] = useState<Page>({ view: 'list' });
```

**Responsabilidades:**
- Mantener estado de navegación
- Renderizar Header y Footer
- Pasar callbacks de navegación a componentes hijos
- Renderizar página actual mediante `Home` component

**Ejemplo de navegación:**
```typescript
// Navegar a lista
setPage({ view: 'list' });

// Navegar a formulario
setPage({ view: 'form' });

// Navegar a simulador con descuento
setPage({ view: 'simulator', discountId: 'abc-123' });

// Navegar a detalles
setPage({ view: 'details', discountId: 'abc-123' });
```

---

## Layout Components

### Header

**Ubicación**: `pages/Header.tsx`  
**Propósito**: Navegación principal de la aplicación

**Props:**
```typescript
interface HeaderProps {
  onNavigateToList: () => void;
  onNavigateToForm: () => void;
  onNavigateToSimulator: () => void;
}
```

**Estructura:**
```tsx
<Box sx={{ flexGrow: 1 }}>
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">
        Discounts Management
      </Typography>
      <Box sx={{ marginLeft: 'auto' }}>
        <Button onClick={onNavigateToList}>List</Button>
        <Button onClick={onNavigateToForm}>Create</Button>
        <Button onClick={onNavigateToSimulator}>Simulator</Button>
      </Box>
    </Toolbar>
  </AppBar>
</Box>
```

**Características:**
- Sticky header con Material-UI AppBar
- Botones de navegación principales
- Responsive (mobile hamburger menu recomendado)

---

### Footer

**Ubicación**: `pages/Footer.tsx`  
**Propósito**: Información del pie de página

**Estructura:**
```tsx
<Box 
  component="footer" 
  sx={{ 
    py: 3, 
    px: 2, 
    mt: 'auto',
    backgroundColor: theme.palette.grey[200] 
  }}
>
  <Container maxWidth="sm">
    <Typography variant="body2" color="text.secondary" align="center">
      © 2026 Discounts System
    </Typography>
  </Container>
</Box>
```

---

## Page Components

### DiscountListPage

**Ubicación**: `pages/Discounts/List.tsx`  
**Propósito**: Mostrar tabla con todos los descuentos

**Props:**
```typescript
interface ListProps {
  goToForm: () => void;
  goToSimulator: (discountId: string) => void;
  goToDetails: (discountId: string) => void;
}
```

**Estado:**
```typescript
const { data: discounts, loading, error } = useAsync(() => 
  discountAPI.getAllDiscounts()
);
const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
```

**Estructura:**
```tsx
<Container maxWidth="lg">
  {/* Header con botón crear */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
    <Typography variant="h4">Discounts</Typography>
    <Button variant="contained" onClick={goToForm}>
      Create New Discount
    </Button>
  </Box>

  {/* Estados de carga/error */}
  {loading && <CircularProgress />}
  {error && <Alert severity="error">{error}</Alert>}

  {/* Tabla de discounts */}
  {discounts && (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {discounts.map(discount => (
            <TableRow key={discount._discountId}>
              <TableCell>{discount._discountId.slice(0, 8)}...</TableCell>
              <TableCell>{discount._name}</TableCell>
              <TableCell>{getTypeLabel(discount._typeDiscount)}</TableCell>
              <TableCell>{formatValue(discount)}</TableCell>
              <TableCell>
                <ButtonGroup>
                  <Button onClick={() => goToSimulator(discount._discountId)}>
                    Simulate
                  </Button>
                  <Button onClick={() => goToDetails(discount._discountId)}>
                    Details
                  </Button>
                  <Button 
                    color="error"
                    onClick={() => setDeleteConfirmId(discount._discountId)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}

  {/* Modal de confirmación de eliminación */}
  <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      Are you sure you want to delete this discount?
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
      <Button color="error" onClick={handleDelete}>Delete</Button>
    </DialogActions>
  </Dialog>
</Container>
```

**Helper Functions:**

Labels y formateo ahora se derivan de `DISCOUNT_CONFIG` a través del hook `useDiscountTypes`:

```typescript
import { useDiscountTypes } from '../../hooks/useDiscountTypes';

const { getLabel, getFormattedValue } = useDiscountTypes();

// En la tabla:
<TableCell>{getLabel(d._typeDiscount)}</TableCell>
<TableCell>{getFormattedValue(d)}</TableCell>
```

No se necesitan funciones `switch/case` manuales — todo se resuelve desde la configuración centralizada.

**Manejo de eliminación:**
```typescript
const handleDelete = async () => {
  if (!deleteConfirmId) return;
  
  try {
    await discountAPI.deleteDiscount(deleteConfirmId);
    setDeleteConfirmId(null);
    // Re-fetch data
    window.location.reload(); // O usar state management
  } catch (err) {
    console.error('Error deleting discount:', err);
  }
};
```

---

### DiscountFormPage

**Ubicación**: `pages/Discounts/Form.tsx`  
**Propósito**: Crear nuevos descuentos

**Props:**
```typescript
interface FormProps {
  goToList: () => void;
}
```

**Estado:**
```typescript
const [name, setName] = useState('');
const [type, setType] = useState<DiscountType | ''>('');
const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
const createState = useAsync<void>();
```

**Estructura:**
```tsx
<Card>
  <CardContent>
    <Typography variant="h5" gutterBottom>Crear Descuento</Typography>

    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />

        {/* Selector con campos dinámicos desde DISCOUNT_CONFIG */}
        <SelectTypeDiscount
          value={type}
          onChange={handleTypeChange}
          fieldValues={fieldValues}
          onFieldChange={(name, value) =>
            setFieldValues((prev) => ({ ...prev, [name]: value }))
          }
        />

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Crear Descuento
          </Button>
          <Button variant="outlined" onClick={goToList}>
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </form>
  </CardContent>
</Card>
```

**Manejo de submit (dinámico):**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isValid) return;

  const config = DISCOUNT_CONFIG[type as DiscountType];
  const numericFields: Record<string, number> = {};
  config.fields.forEach((field) => {
    if (field.type === 'number') {
      numericFields[field.name] = parseFloat(fieldValues[field.name]) || 0;
    }
  });

  await createState.execute(() =>
    discountsApi.create({
      name: name.trim(),
      type: type as DiscountType,
      ...numericFields,
    } as CreateDiscountRequest)
  );
  onNavigateToList();
};
```

---

### FormSimulatorPage

**Ubicación**: `pages/Discounts/FormSimulator.tsx`  
**Propósito**: Simular aplicación de descuentos

**Props:**
```typescript
interface SimulatorProps {
  initialDiscountId?: string;
  goToList: () => void;
}
```

**Estado:**
```typescript
const { data: discounts } = useAsync(() => discountAPI.getAllDiscounts());
const [discountId, setDiscountId] = useState(initialDiscountId || '');
const [unitPrice, setUnitPrice] = useState('');
const [quantity, setQuantity] = useState('');
const [result, setResult] = useState<ApplyDiscountResponse | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Estructura:**
```tsx
<Container maxWidth="md">
  <Paper sx={{ p: 3, mt: 3 }}>
    <Typography variant="h5" gutterBottom>
      Discount Simulator
    </Typography>

    {/* Selector de descuento */}
    <FormControl fullWidth margin="normal">
      <InputLabel>Select Discount</InputLabel>
      <Select
        value={discountId}
        onChange={(e) => setDiscountId(e.target.value)}
      >
        {discounts?.map(d => (
          <MenuItem key={d._discountId} value={d._discountId}>
            {d._name} ({getTypeLabel(d._typeDiscount)})
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Inputs de simulación */}
    <TextField
      label="Unit Price ($)"
      type="number"
      value={unitPrice}
      onChange={(e) => setUnitPrice(e.target.value)}
      fullWidth
      margin="normal"
      inputProps={{ min: 0, step: 0.01 }}
    />

    <TextField
      label="Quantity"
      type="number"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      fullWidth
      margin="normal"
      inputProps={{ min: 1, step: 1 }}
    />

    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

    {/* Botón calcular */}
    <Button
      variant="contained"
      onClick={handleCalculate}
      disabled={loading || !discountId || !unitPrice || !quantity}
      fullWidth
      sx={{ mt: 2 }}
    >
      {loading ? 'Calculating...' : 'Calculate Discount'}
    </Button>

    {/* Resultados */}
    {result && (
      <Card sx={{ mt: 3, backgroundColor: 'success.light' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography>
              Original Total: <strong>${result.originalTotal.toFixed(2)}</strong>
            </Typography>
            <Typography color="success.dark">
              Discount Applied: <strong>-${result.discountedApplied.toFixed(2)}</strong>
            </Typography>
            <Divider />
            <Typography variant="h6" color="primary">
              Final Total: <strong>${result.finalTotal.toFixed(2)}</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )}

    <Button
      variant="outlined"
      onClick={goToList}
      fullWidth
      sx={{ mt: 2 }}
    >
      Back to List
    </Button>
  </Paper>
</Container>
```

**Manejo de cálculo:**
```typescript
const handleCalculate = async () => {
  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const response = await discountAPI.applyDiscount({
      discountId,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity)
    });
    setResult(response);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error calculating discount');
  } finally {
    setLoading(false);
  }
};
```

---

### DiscountDetailsPage

**Ubicación**: `pages/Discounts/Details.tsx`  
**Propósito**: Mostrar información detallada de un descuento

**Props:**
```typescript
interface DetailsProps {
  discountId: string;
  goToList: () => void;
  goToSimulator: (discountId: string) => void;
}
```

**Estado:**
```typescript
const { data: discount, loading, error } = useAsync(() => 
  discountAPI.getDiscountById(discountId)
);
```

**Estructura:**
```tsx
<Container maxWidth="sm">
  <Paper sx={{ p: 3, mt: 3 }}>
    <Typography variant="h5" gutterBottom>
      Discount Details
    </Typography>

    {loading && <CircularProgress />}
    {error && <Alert severity="error">{error}</Alert>}

    {discount && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          <strong>ID:</strong> {discount._discountId}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Name:</strong> {discount._name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Type:</strong> {getLabel(discount._typeDiscount)}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Value:</strong> {getFormattedValue(discount)}
        </Typography>

        {/* Fields rendered dynamically from DISCOUNT_CONFIG */}
        {DISCOUNT_CONFIG[discount._typeDiscount]?.fields.map((field) => {
          const value = discount[field.responseField];
          return value != null ? (
            <Typography key={field.name} variant="body1" gutterBottom>
              <strong>{field.label}:</strong>{' '}
              {field.adornment?.position === 'start' && field.adornment.text}
              {value}
              {field.adornment?.position === 'end' && field.adornment.text}
            </Typography>
          ) : null;
        })}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => goToSimulator(discount._discountId)}
            fullWidth
          >
            Simulate This Discount
          </Button>
          <Button 
            variant="outlined" 
            onClick={goToList}
            fullWidth
          >
            Back to List
          </Button>
        </Box>
      </Box>
    )}
  </Paper>
</Container>
```

---

## Componentes Reutilizables

### SelectTypeDiscount

**Ubicación**: `components/selectTypeDiscount.tsx`  
**Propósito**: Selector de tipo de descuento con campos dinámicos derivados de `DISCOUNT_CONFIG`

**Props:**
```typescript
interface Props {
  value: DiscountType | '';
  onChange: (type: DiscountType | '') => void;
  fieldValues: Record<string, string>;
  onFieldChange: (name: string, value: string) => void;
}
```

**Implementación:**
```tsx
export function SelectTypeDiscount({
  value,
  onChange,
  fieldValues,
  onFieldChange,
}: Props) {
  const { options } = useDiscountTypes();
  const config = value ? DISCOUNT_CONFIG[value] : null;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Tipo de descuento</InputLabel>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value as DiscountType | '')}
          label="Tipo de descuento"
        >
          <MenuItem value="">
            <em>Seleccione un tipo</em>
          </MenuItem>
          {/* Options auto-generated from DISCOUNT_CONFIG */}
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Fields auto-generated from DISCOUNT_CONFIG */}
      {config?.fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          type={field.type}
          value={fieldValues[field.name] || ''}
          onChange={(e) => onFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          slotProps={{ htmlInput: field.inputProps }}
          InputProps={
            field.adornment
              ? { [`${field.adornment.position}Adornment`]: 
                    <InputAdornment position={field.adornment.position}>{field.adornment.text}</InputAdornment> }
              : undefined
          }
          fullWidth
        />
      ))}

      {/* Info message for types with no fields (e.g., TwoForOne) */}
      {config?.infoMessage && (
        <Alert severity="info">{config.infoMessage}</Alert>
      )}
    </>
  );
}
```

**Key point:** No `switch/case` or `if/else` — all rendering is config-driven.

---

## Custom Hooks

### useDiscountTypes

**Ubicación**: `hooks/useDiscountTypes.ts`  
**Propósito**: Derivar opciones, labels y formatters desde `DISCOUNT_CONFIG`

**Interfaz:**
```typescript
function useDiscountTypes(): {
  options: DiscountTypeOption[];
  getLabel: (type: DiscountType) => string;
  getFormattedValue: (discount: Discount) => string;
}
```

**Implementación:**
```typescript
import { DISCOUNT_CONFIG } from '../config/discountConfig';

const DISCOUNT_TYPE_OPTIONS = (
  Object.entries(DISCOUNT_CONFIG) as [DiscountType, DiscountTypeConfig][]
).map(([value, config]) => ({ value, label: config.label }));

export function useDiscountTypes() {
  const getFormattedValue = (discount: Discount): string => {
    return DISCOUNT_CONFIG[discount._typeDiscount]?.formatter(discount) ?? '-';
  };

  return {
    options: DISCOUNT_TYPE_OPTIONS,
    getLabel: (type: DiscountType) => DISCOUNT_CONFIG[type]?.label ?? type,
    getFormattedValue,
  };
}
```

All label/format logic is driven by `DISCOUNT_CONFIG` — no `switch` statements needed.

---

### useAsync

**Ubicación**: `hooks/useAsync.ts`  
**Propósito**: Manejar estados de operaciones asíncronas

**Interfaz:**
```typescript
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(): {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (fn: () => Promise<T>) => Promise<T>;
}
```

**Uso:**
```typescript
const loadingState = useAsync<Discount[]>();

useEffect(() => {
  loadingState.execute(() => discountsApi.getAll());
}, []);
```

---

## Capa API

### client.ts

Cliente HTTP base con configuración de fetch:

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5107/api';

export async function httpClient<T>(
  input: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BASE_URL}${input}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'API error');
  }

  // 204 No Content
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

---

### discountAPI.ts

Métodos específicos para descuentos:

```typescript
import { httpClient } from './client';
import type { 
  Discount, 
  CreateDiscountRequest, 
  ApplyDiscountRequest, 
  ApplyDiscountResponse 
} from './types';

export const discountAPI = {
  getAllDiscounts: (): Promise<Discount[]> => {
    return httpClient<Discount[]>('/Discounts');
  },

  getDiscountById: (id: string): Promise<Discount> => {
    return httpClient<Discount>(`/Discounts/${id}`);
  },

  createDiscount: (data: CreateDiscountRequest): Promise<void> => {
    return httpClient<void>('/Discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteDiscount: (id: string): Promise<void> => {
    return httpClient<void>(`/Discounts/${id}`, {
      method: 'DELETE',
    });
  },

  applyDiscount: (data: ApplyDiscountRequest): Promise<ApplyDiscountResponse> => {
    return httpClient<ApplyDiscountResponse>('/Discounts/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
```

---

## Material-UI Styling

### Theming

**Colores del tema por defecto:**
```typescript
primary: '#1976d2'    // Azul
secondary: '#dc004e'  // Rosa
error: '#d32f2f'      // Rojo
warning: '#ed6c02'    // Naranja
success: '#2e7d32'    // Verde
```

### Componentes de estilos (sx prop)

```typescript
// Spacing
<Box sx={{ p: 2, m: 3, mt: 1 }}>

// Flexbox
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

// Grid
<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>

// Responsive
<Box sx={{ 
  width: { xs: '100%', sm: '80%', md: '60%' },
  padding: { xs: 1, sm: 2, md: 3 }
}}>

// Colors
<Typography sx={{ color: 'primary.main', backgroundColor: 'grey.100' }}>
```

---

## Mejores Prácticas Implementadas

✅ **TypeScript**: Tipado fuerte en todo el código  
✅ **Componentes funcionales**: Uso de hooks  
✅ **Controlled components**: Todos los inputs controlados  
✅ **Loading states**: Feedback visual durante operaciones async  
✅ **Error handling**: Mensajes de error claros  
✅ **Responsive design**: Mobile-first con MUI  
✅ **Accesibilidad**: Labels y ARIA en formularios  
✅ **Validación**: Cliente y servidor  

---

## Testing (Recomendado)

### Unit Tests (Ejemplo con React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { SelectTypeDiscount } from './selectTypeDiscount';

test('shows percentage field when percentage type selected', () => {
  render(
    <SelectTypeDiscount
      value="PercentageDiscount"
      onChange={jest.fn()}
      fieldValues={{ percentage: '' }}
      onFieldChange={jest.fn()}
    />
  );

  expect(screen.getByLabelText('Porcentaje')).toBeInTheDocument();
  expect(screen.queryByLabelText('Monto')).not.toBeInTheDocument();
});
```

---

## Referencias

- [Architecture](ARCHITECTURE.md) - Arquitectura detallada del frontend
- [Context](CONTEXT.md) - Tecnologías y contexto
- [Add Discount Type](../ADD_DISCOUNT_TYPE.md) - Extender con nuevos tipos (solo 2 archivos en frontend)
- [Material-UI Docs](https://mui.com/) - Documentación oficial MUI
