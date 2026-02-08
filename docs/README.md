# Discounts Management System Documentation

**Sistema de Gestión de Descuentos** | _Discounts Management System_

---

## Table of Contents | Índice

### English 🇬🇧
- [Discounts Management System Documentation](#discounts-management-system-documentation)
  - [Table of Contents | Índice](#table-of-contents--índice)
    - [English 🇬🇧](#english-)
    - [Español 🇪🇸](#español-)
  - [English 🇬🇧](#english--1)
    - [Overview](#overview)
    - [Tech Stack](#tech-stack)
    - [Features](#features)
    - [Project Structure](#project-structure)
    - [Quick Start](#quick-start)
    - [Documentation](#documentation)
    - [Discount Types](#discount-types)
    - [API Endpoints](#api-endpoints)
    - [Requirements](#requirements)
    - [Environment Variables](#environment-variables)
    - [Contributing](#contributing)
    - [License](#license)
  - [Español 🇪🇸](#español--1)
    - [Descripción General](#descripción-general)
    - [Stack Tecnológico](#stack-tecnológico)
    - [Características](#características)
    - [Estructura del Proyecto](#estructura-del-proyecto)
    - [Inicio Rápido](#inicio-rápido)
    - [Documentación](#documentación)
    - [Endpoints API](#endpoints-api)
    - [Requisitos](#requisitos)
    - [Variables de Entorno](#variables-de-entorno)
    - [Contribuir](#contribuir)
    - [Licencia](#licencia)

### Español 🇪🇸
- [Discounts Management System Documentation](#discounts-management-system-documentation)
  - [Table of Contents | Índice](#table-of-contents--índice)
    - [English 🇬🇧](#english-)
    - [Español 🇪🇸](#español-)
  - [English 🇬🇧](#english--1)
    - [Overview](#overview)
    - [Tech Stack](#tech-stack)
    - [Features](#features)
    - [Project Structure](#project-structure)
    - [Quick Start](#quick-start)
    - [Documentation](#documentation)
    - [Discount Types](#discount-types)
    - [API Endpoints](#api-endpoints)
    - [Requirements](#requirements)
    - [Environment Variables](#environment-variables)
    - [Contributing](#contributing)
    - [License](#license)
  - [Español 🇪🇸](#español--1)
    - [Descripción General](#descripción-general)
    - [Stack Tecnológico](#stack-tecnológico)
    - [Características](#características)
    - [Estructura del Proyecto](#estructura-del-proyecto)
    - [Inicio Rápido](#inicio-rápido)
    - [Documentación](#documentación)
    - [Endpoints API](#endpoints-api)
    - [Requisitos](#requisitos)
    - [Variables de Entorno](#variables-de-entorno)
    - [Contribuir](#contribuir)
    - [Licencia](#licencia)

---

## English 🇬🇧

### Overview

Full-stack application for managing and applying different types of discounts to products. Built with modern technologies and clean architecture principles.

### Tech Stack

**Backend:**
- .NET 10.0
- ASP.NET Core Web API
- Entity Framework Core (In-Memory)
- Swagger/OpenAPI

**Frontend:**
- React 19 + TypeScript
- Vite
- Material-UI
- React Router

### Features

✅ **Create Discounts**: Support for Percentage, Fixed Amount, and Two-for-One discounts  
✅ **List & Manage**: View all discounts with detailed information  
✅ **Simulator**: Calculate discounts before applying them  
✅ **RESTful API**: Well-documented endpoints with Swagger  
✅ **Type Safety**: Full TypeScript support  
✅ **Modern UI**: Material Design with responsive layout  

### Project Structure

```
Discounts/
├── backend/          # .NET API
│   ├── src/
│   │   ├── Application/    # Services, DTOs
│   │   ├── Controllers/    # API endpoints
│   │   ├── Domain/        # Business logic
│   │   └── Infrastructure/ # Data access
│   └── Program.cs
├── frontend/         # React app
│   └── src/
│       ├── api/          # API client
│       ├── components/   # Reusable components
│       ├── hooks/        # Custom hooks
│       └── pages/        # Views
└── docs/            # Documentation (you are here)
    ├── backend/
    ├── frontend/
    └── ADD_DISCOUNT_TYPE.md
```

### Quick Start

**Backend:**
```bash
cd backend
dotnet restore
dotnet run
# API: https://localhost:5001
# Swagger: https://localhost:5001/swagger
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

### Documentation

**Backend:**
- [Architecture](backend/ARCHITECTURE.md) - System design and patterns
- [Context](backend/CONTEXT.md) - Technologies and business logic
- [API Reference](backend/API.md) - Endpoints documentation

**Frontend:**
- [Architecture](frontend/ARCHITECTURE.md) - Component structure
- [Context](frontend/CONTEXT.md) - Technologies and features
- [Components](frontend/COMPONENTS.md) - UI components guide

**General:**
- [Add New Discount Type](ADD_DISCOUNT_TYPE.md) - Step-by-step guide

### Discount Types

| Type | Description | Example |
|------|-------------|---------|
| **Percentage** | Applies a percentage discount | 15% off on $100 = $15 discount |
| **Fixed Amount** | Applies a fixed amount | $50 off on $200 = $50 discount |
| **Two for One** | Buy 2, pay for 1 | 5 items × $10 = 2 free items ($20 off) |

### API Endpoints

- `GET /api/discounts` - List all discounts
- `GET /api/discounts/{id}` - Get discount by ID
- `POST /api/discounts` - Create new discount
- `POST /api/discounts/apply` - Apply discount and calculate
- `DELETE /api/discounts/{id}` - Delete discount

### Requirements

- **.NET SDK 10.0** or higher
- **Node.js 18** or higher
- Modern web browser

### Environment Variables

**Backend (`.env`):**
```env
FRONTEND_URLS=http://localhost:5173
INMEMORY_DB_NAME=DiscountsDb
DB_MOCKUP=true
```

**Frontend (`.env`):**
```env
VITE_API_BASE_URL=http://localhost:5107/api
```

### Contributing

To add a new discount type, follow the guide: [ADD_DISCOUNT_TYPE.md](ADD_DISCOUNT_TYPE.md)

### License

This project is for educational and demonstration purposes.

---

## Español 🇪🇸

### Descripción General

Aplicación full-stack para gestionar y aplicar diferentes tipos de descuentos a productos. Construida con tecnologías modernas y principios de arquitectura limpia.

### Stack Tecnológico

**Backend:**
- .NET 10.0
- ASP.NET Core Web API
- Entity Framework Core (In-Memory)
- Swagger/OpenAPI

**Frontend:**
- React 19 + TypeScript
- Vite
- Material-UI
- React Router

### Características

✅ **Crear Descuentos**: Soporte para descuentos Porcentuales, Monto Fijo y 2×1  
✅ **Listar y Gestionar**: Ver todos los descuentos con información detallada  
✅ **Simulador**: Calcular descuentos antes de aplicarlos  
✅ **API RESTful**: Endpoints bien documentados con Swagger  
✅ **Tipado Seguro**: Soporte completo de TypeScript  
✅ **UI Moderna**: Material Design con diseño responsive  

### Estructura del Proyecto

```
Discounts/
├── backend/          # API .NET
│   ├── src/
│   │   ├── Application/    # Servicios, DTOs
│   │   ├── Controllers/    # Endpoints API
│   │   ├── Domain/        # Lógica de negocio
│   │   └── Infrastructure/ # Acceso a datos
│   └── Program.cs
├── frontend/         # App React
│   └── src/
│       ├── api/          # Cliente API
│       ├── components/   # Componentes reutilizables
│       ├── hooks/        # Hooks personalizados
│       └── pages/        # Vistas
└── docs/            # Documentación (estás aquí)
    ├── backend/
    ├── frontend/
    └── ADD_DISCOUNT_TYPE.md
```

### Inicio Rápido

**Backend:**
```bash
cd backend
dotnet restore
dotnet run
# API: https://localhost:5001
# Swagger: https://localhost:5001/swagger
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

### Documentación

**Backend:**
- [Arquitectura](backend/ARCHITECTURE.md) - Diseño del sistema y patrones
- [Contexto](backend/CONTEXT.md) - Tecnologías y lógica de negocio
- [Referencia API](backend/API.md) - Documentación de endpoints

**Frontend:**
- [Arquitectura](frontend/ARCHITECTURE.md) - Estructura de componentes
- [Contexto](frontend/CONTEXT.md) - Tecnologías y características
- [Componentes](frontend/COMPONENTS.md) - Guía de componentes UI

**General:**
- [Agregar Nuevo Tipo de Descuento](ADD_DISCOUNT_TYPE.md) - Guía paso a paso

### Endpoints API

- `GET /api/discounts` - Listar todos los descuentos
- `GET /api/discounts/{id}` - Obtener descuento por ID
- `POST /api/discounts` - Crear nuevo descuento
- `POST /api/discounts/apply` - Aplicar descuento y calcular
- `DELETE /api/discounts/{id}` - Eliminar descuento

### Requisitos

- **.NET SDK 10.0** o superior
- **Node.js 18** o superior
- Navegador web moderno

### Variables de Entorno

**Backend (`.env`):**
```env
FRONTEND_URLS=http://localhost:5173
INMEMORY_DB_NAME=DiscountsDb
DB_MOCKUP=true
```

**Frontend (`.env`):**
```env
VITE_API_BASE_URL=http://localhost:5107/api
```

### Contribuir

Para agregar un nuevo tipo de descuento, sigue la guía: [ADD_DISCOUNT_TYPE.md](ADD_DISCOUNT_TYPE.md)

### Licencia

Este proyecto es para propósitos educativos y de demostración.

---
