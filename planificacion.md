# Planificación de Frontend - Superheroes SPA

## Objetivo general
Construir el frontend por fases, con entregas pequeñas y verificables, minimizando retrabajo y manteniendo tipado fuerte con TypeScript.

## Convenciones de seguimiento
- `[ ]` Pendiente
- `[-]` En progreso
- `[x]` Completado

## Visión funcional acordada

### Funciones principales del frontend
- [x] Listar superhéroes
- [x] Ver detalle
- [x] Crear
- [x] Editar
- [x] Filtrar / búsqueda visual
- [x] Experiencia visual (cards + carrusel)

### Arquitectura de UI (responsabilidades)

#### Componentes reutilizables
- [x] `SuperheroCard` (Home): imagen, nombre, resumen y link a detalle
- [x] `ImageCarousel` (Detail): navegación anterior/siguiente, animación simple, índice interno
- [x] `SuperheroForm` (Create/Edit): inputs, validación básica y `onSubmit`
- [x] `SearchFilter` (Home): input + selects, emite cambios (sin consumir API)
- [x] `ActionButtons` (Detail, opcional): editar, eliminar y confirmación

#### Páginas principales
- [x] `Home` (`/home`): orquesta listado, filtros y paginación
- [x] `Detail` (`/superhero/:id`): muestra detalle completo + carrusel + acciones
- [x] `Create` (`/create`): formulario + POST + redirección
- [x] `Edit` (`/edit/:id`): carga inicial + formulario + PUT + redirección

### Flujo mental de navegación
- [x] Usuario entra en `/home` → GET listado → render de cards
- [x] Click en card → `/superhero/:id` → GET by id → detalle + carrusel
- [x] Crear → `/create` → formulario → POST → redirect
- [x] Editar → `/edit/:id` → GET by id → formulario con valores → PUT → redirect

---

## Estado actual del proyecto

### Backend (ya disponible)
- [x] API en FastAPI operativa
- [x] MongoDB integrada
- [x] Arquitectura en capas (Controller → Service → Repository)
- [x] CRUD completo
- [x] Filtros, paginación y ordenamiento
- [x] Endpoint por casa
- [x] Respuesta estandarizada `{ success, message, data }`

### Frontend (base creada)
- [x] Proyecto creado con React + TypeScript + Vite
- [x] Dependencias base instaladas (`react`, `react-router-dom`, `axios`)
- [x] Estructura de carpetas y archivos creada
- [x] Tailwind v4 configurado y validado (`@tailwindcss/vite` + Vite plugin)
- [x] Base técnica implementada (Fase 1 completada)

---

## Roadmap por fases

## Fase 0 - Preparación y alineación
**Meta:** dejar claro contrato API, estructura y estrategia antes de implementar lógica.

### Tareas
- [x] Definir estrategia por fases (MVP incremental)
- [x] Confirmar estructura de carpetas y responsabilidades (`api`, `components`, `pages`, `types`)
- [x] Revisar contrato real de respuestas del backend con ejemplos concretos
- [x] Definir variables de entorno para `baseURL` (dev/prod)

### Criterio de finalización
- Contrato API y estructura documentados sin ambigüedades.

---

## Fase 1 - Base técnica del frontend ✅
**Meta:** tener app navegable con rutas, layout y tipado base.

### Tareas
- [x] Configurar React Router (`/home`, `/superhero/:id`, `/create`, `/edit/:id`)
- [x] Crear `BaseLayout` con estructura común
- [x] Implementar páginas base (`Home`, `Detail`, `Create`, `Edit`) con placeholders
- [x] Configurar `api/axios.ts` con `baseURL` centralizada
- [x] Definir tipos base en `types/index.ts` (`Superhero`, `ApiResponse<T>`, `PaginatedData<T>`)
- [x] Limpiar boilerplate inicial de Vite en `App.tsx`/`App.css`
- [x] Corregir Tailwind v4 (plugin `@tailwindcss/vite` + `@import "tailwindcss"` en CSS)
- [x] Crear `.env` con `VITE_API_BASE_URL`

### Criterio de finalización
- Navegación funcional entre rutas + tipos base listos + cliente Axios configurado.

---

## Fase 2 - Home MVP (lectura principal) ✅
**Meta:** listar superhéroes desde backend en pantalla principal.

### Tareas
- [x] Crear capa simple de consumo para listado (sin sobrearquitectura)
- [x] Implementar fetch de `GET /api/superheroes`
- [x] Renderizar lista con `SuperheroCard` y CTA de crear nuevo
- [x] Manejar estados de UI: loading / error / vacío
- [x] Verificar y ajustar parseo de `ApiResponse<T>` según respuesta real
- [x] Ajustar tipo `biography` para compatibilidad objeto/string (seed vs schema)

### Criterio de finalización
- Home muestra héroes reales con manejo de estados básico.

---

## Fase 3 - Filtros, paginación y orden ✅
**Meta:** hacer la Home realmente utilizable para navegación de datos.

### Tareas
- [x] Implementar `SearchFilter` (nombre / poder / casa)
- [x] Implementar `Pagination`
- [x] Integrar parámetros de consulta con backend (`page`, `limit`, `sort`, filtros)
- [x] Sincronizar estado con query params en URL
- [x] Mantener consistencia entre filtros, paginado y refresco de navegador

### Criterio de finalización
- El usuario puede filtrar, paginar y ordenar sin perder estado.

---

## Fase 4 - Detalle de superhéroe ✅
**Meta:** visualizar información completa de un héroe individual.

### Tareas
- [x] Implementar `Detail` con `GET /api/superheroes/{id}`
- [x] Integrar `ImageCarousel` para múltiples imágenes
- [x] Integrar `ActionButtons` (editar/eliminar con confirmación)
- [x] Manejar estados loading / error / no encontrado
- [x] Agregar navegación de retorno clara a Home

### Criterio de finalización
- Ruta de detalle estable y robusta ante errores.

---

## Fase 5 - Creación y edición (formulario reutilizable) ✅
**Meta:** permitir alta y modificación con un único componente de formulario.

### Tareas
- [x] Diseñar `SuperheroForm` reusable (modo create/edit)
- [x] Implementar `Create` con `POST /api/superheroes`
- [x] Implementar `Edit` con `PUT /api/superheroes/{id}`
- [x] Validaciones mínimas de formulario (frontend)
- [x] Feedback de éxito/error y redirecciones

### Criterio de finalización
- Crear y editar funciona de punta a punta con UX clara.

---

## Fase 6 - Eliminación y pulido final ✅
**Meta:** cerrar CRUD completo en frontend y estabilizar UX.

### Tareas
- [x] Implementar eliminación con `DELETE /api/superheroes/{id}`
- [x] Confirmación antes de eliminar
- [x] Ajustes finales de UI/UX (mensajes, estados vacíos, consistencia)
- [x] Revisión final de tipado y limpieza de código
- [x] Revisión rápida de lint/build

### Criterio de finalización
- CRUD frontend completo, consistente y listo para demo/entrega.

---

## Registro de avances
> Iremos actualizando esta sección en cada paso para dejar trazabilidad.

### 2026-02-24
- [x] Se creó la planificación inicial por fases.
- [x] Se definió estrategia incremental para implementación.
- [x] Se incorporó la visión funcional completa (componentes, páginas y flujo).

### 2026-03-10
- [x] **Fase 1 completada.** React Router, BaseLayout, páginas placeholder, tipos, Axios y Tailwind v4 funcionando.
- [x] **Fase 2 completada.** `Home` con fetch real, estados loading/error/vacío y `SuperheroCard` funcional.
- [x] **Fase 3 completada.** `SearchFilter`, `Pagination`, orden y query params sincronizados en `Home`.
- [x] **Fase 4 completada.** `Detail` con fetch por ID, `ImageCarousel`, estados completos y acciones de editar/eliminar.
- [x] **Fase 5 completada.** `SuperheroForm` reusable + páginas `Create`/`Edit` conectadas con validación y redirecciones.
- [x] **Fase 6 completada.** Pulido final, eliminación confirmada y validación completa (`lint`, `build`, `tsc`).
- [x] Frontend listo para demo/entrega.
