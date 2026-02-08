# Backend - Sistema de Descuentos

API RESTful para gestión de descuentos desarrollada con .NET y Entity Framework Core.

## Índice

- [Requisitos](#-requisitos)
- [Configuración](#️-configuración)
- [Ejecución](#-ejecución)
- [Estructura del proyecto](#️-estructura-del-proyecto)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Documentación adicional](#-documentación-adicional)

## 📋 Requisitos

### Tecnologías necesarias

- **.NET SDK 10.0**: [Descargar aquí](https://dotnet.microsoft.com/download/dotnet/10.0)
  ```bash
  # Verificar instalación
  dotnet --version
  ```

### Dependencias del proyecto

Las dependencias se instalan automáticamente al ejecutar `dotnet restore`:

- **Microsoft.EntityFrameworkCore** (10.0.2) - ORM para acceso a datos
- **Microsoft.EntityFrameworkCore.InMemory** (10.0.2) - Base de datos en memoria
- **Swashbuckle.AspNetCore** (10.1.2) - Documentación Swagger/OpenAPI
- **DotNetEnv** (3.1.1) - Gestión de variables de entorno

## ⚙️ Configuración

### Archivo `.env` (requerido)

Crear un archivo `.env` en la raíz del directorio `backend/` con las siguientes variables:

```env
# URLs del frontend permitidas para CORS (separadas por coma)
FRONTEND_URLS=http://localhost:5173,http://localhost:3000

# Nombre de la base de datos en memoria
INMEMORY_DB_NAME=DiscountsDb

# Cargar datos de prueba al iniciar (true/false)
DB_MOCKUP=true
```

### Archivos de configuración

- **appsettings.json**: Configuración general de la aplicación
- **appsettings.Development.json**: Configuración específica para desarrollo
- **Properties/launchSettings.json**: Configuración de puertos y entorno

## 🚀 Ejecución

### 1. Restaurar dependencias

```bash
cd backend
dotnet restore
```

### 2. Ejecutar el proyecto

```bash
dotnet run
```

El servidor estará disponible en:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001
- **Swagger UI**: https://localhost:5001/swagger (solo en desarrollo)

### Comandos adicionales

```bash
# Compilar sin ejecutar
dotnet build

# Ejecutar en modo watch (recarga automática)
dotnet watch run

# Ejecutar tests (si existen)
dotnet test
```

## 🏗️ Estructura del proyecto

```
backend/
├── src/
│   ├── Application/      # Lógica de aplicación (DTOs, Services)
│   ├── Controllers/      # Controladores API REST
│   ├── Domain/          # Entidades y lógica de negocio
│   └── Infrastructure/  # Persistencia, repositorios y factories
├── Program.cs           # Punto de entrada y configuración
├── backend.csproj       # Archivo de proyecto .NET
└── .env                 # Variables de entorno (crear este archivo)
```

## 🔧 Tecnologías utilizadas

- .NET 10.0
- ASP.NET Core Web API
- Entity Framework Core (In-Memory Database)
- Swagger/OpenAPI
- CORS configurado
- Inyección de dependencias nativa

## 📚 Documentación adicional

- [Arquitectura del proyecto](../docs/backend/ARCHITECTURE.md)
- [Documentación de API](../docs/backend/API.md)
- [Agregar nuevos tipos de descuento](../docs/backend/ADD_DISCOUNT_TYPE.md)
