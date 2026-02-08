# Frontend - Sistema de Descuentos

Aplicación web desarrollada con React, TypeScript y Material-UI para la gestión de descuentos.

## Índice

- [Requisitos](#-requisitos)
- [Configuración](#️-configuración)
- [Ejecución](#-ejecución)
- [Estructura del proyecto](#️-estructura-del-proyecto)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Integración con Backend](#-integración-con-backend)
- [Documentación adicional](#-documentación-adicional)

## 📋 Requisitos

### Tecnologías necesarias

- **Node.js** (versión 18 o superior): [Descargar aquí](https://nodejs.org/)
  ```bash
  # Verificar instalación
  node --version
  npm --version
  ```

### Dependencias del proyecto

Las dependencias se instalan automáticamente con `npm install`:

**Producción:**
- **React** (19.2.0) - Librería UI
- **React Router DOM** (7.13.0) - Enrutamiento
- **Material-UI** (7.3.7) - Componentes UI
- **Emotion** - Estilos CSS-in-JS

**Desarrollo:**
- **Vite** (7.2.4) - Build tool y dev server
- **TypeScript** (5.9.3) - Tipado estático
- **ESLint** - Linter de código

## ⚙️ Configuración

### Archivo `.env` (opcional)

Crear un archivo `.env` en la raíz del directorio `frontend/` para configurar la URL del backend:

```env
# URL base de la API backend
VITE_API_BASE_URL=http://localhost:5107/api
```

**Nota**: Si no se configura, el valor por defecto es `http://localhost:5107/api`

### Archivos de configuración

- **vite.config.ts**: Configuración de Vite
- **tsconfig.json**: Configuración de TypeScript
- **eslint.config.js**: Reglas de linting

## 🚀 Ejecución

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:
- **URL**: http://localhost:5173

### Comandos adicionales

```bash
# Compilar para producción
npm run build

# Vista previa del build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🏗️ Estructura del proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── api/            # Cliente HTTP y llamadas a API
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Custom hooks de React
│   ├── pages/          # Páginas/vistas de la aplicación
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html          # HTML base
├── vite.config.ts      # Configuración de Vite
├── package.json        # Dependencias y scripts
└── .env                # Variables de entorno (crear este archivo)
```

## 🔧 Tecnologías utilizadas

- React 19
- TypeScript
- Vite (Build tool)
- Material-UI (MUI)
- React Router
- Emotion (CSS-in-JS)
- ESLint (Code quality)

## 🔗 Integración con Backend

Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend. La URL de conexión se configura mediante la variable de entorno `VITE_API_BASE_URL`.

## 📚 Documentación adicional

- [Componentes](../docs/frontend/COMPONENTS.md)
