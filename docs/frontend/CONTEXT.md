# Frontend Context - Sistema de Descuentos

## Propósito de la Aplicación

Interfaz web moderna para gestionar y simular descuentos. Permite crear, listar, visualizar y aplicar diferentes tipos de descuentos a productos de manera interactiva.

---

## Tecnologías Core

- **React 19**: Librería UI principal
- **TypeScript 5.9**: Tipado estático
- **Vite 7**: Build tool y dev server
- **Material-UI (MUI) 7**: Sistema de diseño
- **React Router DOM 7**: Navegación (instalado, preparado para uso)
- **Emotion**: CSS-in-JS

---

## Características Principales

### 1. Gestión de Descuentos
- Listado completo de descuentos creados
- Creación de nuevos descuentos con validación
- Eliminación con confirmación
- Visualización de detalles

### 2. Simulador de Descuentos
- Selección de descuento existente
- Cálculo en tiempo real de:
  - Total original
  - Monto de descuento aplicado
  - Total final con descuento
- Interfaz intuitiva con feedback visual

### 3. Tipos de Descuento Soportados
- **Percentage**: Descuento porcentual (ej: 15%)
- **Fixed Amount**: Monto fijo (ej: $50)
- **Two for One**: 2×1 en productos

---

## Flujo de Usuario

### Flujo de Creación
```
Home → Click "Crear" → Form → 
  Ingresar nombre → 
  Seleccionar tipo → 
  Ingresar valor (si aplica) → 
  Submit → Lista actualizada
```

### Flujo de Simulación
```
Lista → Click "Simular" en descuento → Simulator →
  Ingresar precio unitario →
  Ingresar cantidad →
  Ver resultados calculados
```

### Flujo de Eliminación
```
Lista → Click "Eliminar" → 
  Confirmar en modal → 
  Descuento eliminado → 
  Lista actualizada
```

---

## Comunicación con Backend

### Base URL
Configurable via variable de entorno:
```env
VITE_API_BASE_URL=http://localhost:5107/api
```

### Endpoints Utilizados

| Método | Endpoint | Uso |
|--------|----------|-----|
| GET | `/discounts` | Listar todos los descuentos |
| GET | `/discounts/:id` | Obtener descuento por ID |
| POST | `/discounts` | Crear nuevo descuento |
| POST | `/discounts/apply` | Aplicar descuento y calcular |
| DELETE | `/discounts/:id` | Eliminar descuento |

---

## Gestión de Estado

### Estado de Navegación
Controlado en `App.tsx` mediante tipo discriminado:

```typescript
type Page =
  | { view: 'list' }
  | { view: 'form' }
  | { view: 'simulator'; discountId?: string }
  | { view: 'details'; discountId: string };
```

### Estado de Formularios
- **Local State**: Para inputs y validación
- **Controlled Components**: Todos los inputs controlados por React

### Estado de Carga Asíncrona
Manejado por custom hook `useAsync`:
- Loading state durante fetch
- Error handling automático
- Data caching en estado

---

## Validación de Formularios

### Validaciones Implementadas

**Form de Creación:**
- Nombre: requerido, no vacío
- Tipo: requerido
- Percentage: requerido si tipo es "percentage", debe ser 0-100
- Amount: requerido si tipo es "fixedAmount", debe ser > 0

**Form de Simulación:**
- Descuento: requerido
- Precio unitario: requerido, debe ser > 0
- Cantidad: requerida, debe ser > 0

### Feedback Visual
- Campos con error: borde rojo y mensaje
- Botón submit: deshabilitado si formulario inválido
- Mensajes de error: mostrados claramente

---

## Manejo de Errores

### Errores de API
```typescript
try {
  const data = await discountAPI.createDiscount(formData);
  // Success handling
} catch (error) {
  setError(error instanceof Error ? error.message : 'Unknown error');
}
```

### Errores de UI
- Toast/Snackbar para errores transitorios
- Alert/Dialog para errores críticos
- Estado de error en componentes

---

## Accesibilidad (A11y)

### Implementaciones Actuales
- Labels asociados a inputs
- ARIA attributes en componentes MUI
- Navegación por teclado funcional
- Focus management

### Mejoras Futuras
- Anuncios de screen reader para operaciones async
- Skip links para navegación
- Contraste AA/AAA completo

---

## Responsive Design

### Breakpoints de MUI
```typescript
xs: 0px      // Mobile
sm: 600px    // Tablet
md: 900px    // Desktop
lg: 1200px   // Large desktop
xl: 1536px   // Extra large
```

### Adaptaciones
- Layout adaptativo con Grid/Box
- Tablas scrollables en mobile
- Font sizes responsivos
- Spacing escalable

---

## Performance

### Métricas Actuales
- **Dev Server**: <100ms startup (Vite)
- **HMR**: <50ms actualizaciones
- **Build**: ~2-5s producción
- **Bundle Size**: Optimizado por Vite

### Optimizaciones
- Tree shaking automático
- Code splitting en build
- Minificación de JS/CSS
- Assets optimization

---

## Desarrollo Local

### Hot Module Replacement (HMR)
Vite proporciona HMR ultra rápido:
- Cambios de React se reflejan instantáneamente
- Estado preservado durante actualizaciones
- Error overlay en desarrollo

### Dev Tools
- React DevTools: Inspección de componentes
- Browser DevTools: Network, Console, Performance
- TypeScript: Type checking en tiempo real

---

## Estructura de Estilos

### Global Styles (`index.css`)
```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}
```

### Component Styles
Material-UI con Emotion:
```tsx
<Box sx={{ padding: 2, backgroundColor: 'primary.main' }}>
  Content
</Box>
```

### Theme Customization
Posibilidad de customizar theme de MUI:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});
```

---

## Testing (Preparado para)

### Unit Tests
- Funciones utilitarias
- Custom hooks con React Hooks Testing Library
- Helpers de API

### Component Tests
- React Testing Library
- User interactions
- Props y estado

### Integration Tests
- Flujos completos de usuario
- Mock de API calls
- Navegación entre páginas

### E2E Tests
- Playwright o Cypress
- Casos de uso críticos
- Test de regresión visual

---

## Deployment

### Build para Producción
```bash
npm run build
```

Genera carpeta `dist/` con:
- HTML minificado
- JS bundled y minificado
- CSS optimizado
- Assets optimizados

### Hosting Options
- **Vercel**: Deployment automático con Git
- **Netlify**: Drag-and-drop o Git integration
- **GitHub Pages**: Static hosting gratuito
- **AWS S3 + CloudFront**: Scalable y rápido

### Variables de Entorno en Producción
Configurar `VITE_API_BASE_URL` en plataforma de hosting para apuntar a backend de producción.

---

## Seguridad

### Best Practices Implementadas
- No hay secrets en código
- Variables de entorno para configuración
- CORS manejado por backend
- Input sanitization

### Consideraciones
- XSS: React escapa contenido por defecto
- CSRF: Backend debe implementar protección
- HTTPS: Siempre en producción

---

## Extensibilidad

### Agregar Nuevo Tipo de Descuento
El frontend usa un sistema de **configuración centralizada** (`DISCOUNT_CONFIG`):

1. Actualizar `DiscountType` union y interfaces en `api/types.ts`
2. Agregar entrada en `DISCOUNT_CONFIG` en `config/discountConfig.ts`

Los componentes (Select, Form, List, Details) se actualizan automáticamente.

Ver: [Guía completa para agregar tipos de descuento](../ADD_DISCOUNT_TYPE.md)

### Agregar Nueva Funcionalidad
1. Crear componente/página en estructura adecuada
2. Agregar ruta/estado si es necesario
3. Conectar con API si requiere backend
4. Agregar navegación en Header/menú
5. Actualizar documentación

---

## Logs y Debugging

### Console Logs (Development)
- API calls: URL y payload
- Errores: Stack traces completos
- Warnings: TypeScript y React

### Producción
- Considerar integración con:
  - Sentry (error tracking)
  - LogRocket (session replay)
  - Google Analytics (analytics)

---

## Internacionalización (i18n)

### Estado Actual
Textos hardcoded en español.

### Migración Futura
Considerar:
- `react-i18next` para traducciones
- Archivos JSON de idiomas
- Selector de idioma en UI
- Formato de fechas/moneda por locale

---

## Dependencias Clave

### Producción
```json
{
  "react": "^19.2.0",
  "@mui/material": "^7.3.7",
  "@mui/icons-material": "^7.3.7",
  "react-router-dom": "^7.13.0",
  "@emotion/react": "^11.14.0"
}
```

### Desarrollo
```json
{
  "vite": "^7.2.4",
  "typescript": "~5.9.3",
  "@vitejs/plugin-react-swc": "^4.2.2",
  "eslint": "^9.39.1"
}
```

---

## Futuras Mejoras

### UI/UX
- Dark mode toggle
- Toast notifications más elaboradas
- Loading skeletons
- Animaciones suaves

### Funcionalidad
- Edición de descuentos existentes
- Búsqueda y filtrado en lista
- Sorting por columnas
- Paginación para listas grandes
- Historial de descuentos aplicados

### Técnicas
- React Query para cache management
- State management con Zustand/Redux
- Storybook para componentes
- Unit tests con Vitest
