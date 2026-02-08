<div align="center">

# Discounts Management System

Sistema de Gestión de Descuentos con **.NET Web API** y **React + TypeScript**.

</div>

> 🇪🇸 Readme principal en español. 🇬🇧 English version below.

---

## 📚 Índice | Table of Contents

- [Discounts Management System](#discounts-management-system)
  - [📚 Índice | Table of Contents](#-índice--table-of-contents)
  - [🧾 Descripción](#-descripción)
  - [✨ Funcionalidades clave](#-funcionalidades-clave)
  - [🧱 Stack tecnológico](#-stack-tecnológico)
  - [🏗️ Arquitectura (resumen)](#️-arquitectura-resumen)
  - [🚀 Cómo ejecutar el proyecto](#-cómo-ejecutar-el-proyecto)
    - [1. Requisitos](#1-requisitos)
    - [2. Backend (.NET API)](#2-backend-net-api)
    - [3. Frontend (React + Vite)](#3-frontend-react--vite)
  - [🗂️ Estructura del repositorio](#️-estructura-del-repositorio)
  - [📚 Documentación útil](#-documentación-útil)
  - [🌍 English version](#-english-version)
    - [Overview](#overview)
    - [Tech Stack](#tech-stack)
    - [Run the project](#run-the-project)

## 🧾 Descripción

Aplicación **full‑stack** para gestionar y simular distintos tipos de descuentos sobre productos.

- Backend en **ASP.NET Core** con **Entity Framework Core InMemory**, diseñado con **Clean Architecture**.
- Frontend en **React + TypeScript** (Vite) con UI moderna basada en **Material‑UI**.
- Soporta múltiples tipos de descuentos usando **OOP**, **polimorfismo** y **Factory Pattern**.

Casos de uso principales:
- Crear y listar descuentos.
- Simular el impacto de un descuento sobre precio unitario y cantidad.
- Explorar y probar la API desde **Swagger UI**.

---

## ✨ Funcionalidades clave

- ✅ **Tipos de descuento** listos para usar:
	- PercentageDiscount (porcentaje)
	- FixedAmountDiscount (monto fijo)
	- TwoForOneDiscount (2x1)
- ✅ **CRUD de descuentos** vía API REST.
- ✅ **Simulador de descuentos** (cálculo de total original, descuento aplicado y total final).
- ✅ **Documentación de API** con Swagger/OpenAPI.
- ✅ Arquitectura preparada para **agregar nuevos tipos de descuento** fácilmente.

---

## 🧱 Stack tecnológico

**Backend**
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core (In‑Memory Database)
- Swagger / Swashbuckle

**Frontend**
- React 19 + TypeScript
- Vite
- Material‑UI

---

## 🏗️ Arquitectura (resumen)

**Backend (Clean Architecture)**
- Controllers – capa de presentación (endpoints REST).
- Application – servicios, DTOs, interfaces.
- Domain – entidades, enums y lógica de negocio.
- Infrastructure – repositorios, DbContext, factories.

**Frontend (React modular)**
- `pages/` – vistas principales (lista, formulario, simulador, detalles).
- `components/` – componentes reutilizables (por ejemplo, selector de tipo de descuento).
- `hooks/` – lógica reutilizable (fetch, estados async, tipos de descuento).
- `api/` – cliente HTTP tipado y funciones para la API de descuentos.

Más detalles en la documentación de [backend](docs/backend/ARCHITECTURE.md) y [frontend](docs/frontend/ARCHITECTURE.md).

---

## 🚀 Cómo ejecutar el proyecto

### 1. Requisitos

- .NET SDK 8.0 o superior
- Node.js 18 o superior

### 2. Backend (.NET API)

```bash
cd backend
dotnet restore
dotnet run
```

Por defecto:
- API: `http://localhost:5000` o `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

Configura las variables en `backend/.env` (ejemplo mínimo):

```env
FRONTEND_URLS=http://localhost:5173
INMEMORY_DB_NAME=DiscountsDb
DB_MOCKUP=true
```

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Aplicación disponible en:
- `http://localhost:5173`

Variables en `frontend/.env` (ejemplo):

```env
VITE_API_BASE_URL=http://localhost:5107/api
```

---

## 🗂️ Estructura del repositorio

```bash
.
├── backend/        # API .NET (Clean Architecture)
├── frontend/       # App React + TS (Vite)
└── docs/           # Documentación de backend, frontend y guía de descuentos
```

Documentación general: [docs/README.md](docs/README.md)

---

## 📚 Documentación útil

- General: [docs/README.md](docs/README.md)
- Backend:
	- Arquitectura: [docs/backend/ARCHITECTURE.md](docs/backend/ARCHITECTURE.md)
	- API: [docs/backend/API.md](docs/backend/API.md)
- Frontend:
	- Arquitectura: [docs/frontend/ARCHITECTURE.md](docs/frontend/ARCHITECTURE.md)
- Agregar un nuevo tipo de descuento:
	- [docs/ADD_DISCOUNT_TYPE.md](docs/ADD_DISCOUNT_TYPE.md)

---

## 🌍 English version

### Overview

Discounts Management System is a **full‑stack** application to manage and simulate multiple discount types over products.

- Backend built with **ASP.NET Core** and **Entity Framework Core InMemory**, following **Clean Architecture**.
- Frontend built with **React + TypeScript** (Vite) and a modern **Material‑UI** interface.
- Supports multiple discount strategies using **OOP**, **polymorphism** and the **Factory Pattern**.

Main use cases:
- Create and list discounts.
- Simulate discount effects over unit price and quantity.
- Explore and test the API using **Swagger UI**.

### Tech Stack

**Backend**
- .NET 10.0
- ASP.NET Core Web API
- Entity Framework Core (In‑Memory Database)
- Swagger / Swashbuckle

**Frontend**
- React 19 + TypeScript
- Vite
- Material‑UI

### Run the project

**Backend**

```bash
cd backend
dotnet restore
dotnet run
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

For complete documentation (EN/ES), see [docs/README.md](docs/README.md).

