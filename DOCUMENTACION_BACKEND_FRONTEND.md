# Documentación funcional: Backend + Frontend

## 1) Objetivo del proyecto
SPA de superhéroes con CRUD completo.

- Backend: expone API REST y sirve archivos estáticos de imágenes.
- Frontend: consume la API y renderiza listado, detalle, creación y edición.

---

## 2) Backend (FastAPI + MongoDB)

### Stack y estructura
- Framework: FastAPI
- Base de datos: MongoDB
- Arquitectura: Controller → Service → Repository
- Archivo de arranque API: `backend/app/main.py`
- Prefijo de rutas: `/api/superheroes`

### CORS y estáticos
En `backend/app/main.py`:
- CORS habilitado para todos los orígenes (`allow_origins=["*"]`)
- Archivos estáticos montados en `/static`
  - Ejemplo: `http://localhost:8081/static/heroes/ironman.jpg`

### Endpoints disponibles
Base URL backend (dev): `http://localhost:8081`

1. `GET /api/superheroes`
   - Lista con filtros, paginación y orden.
   - Query params soportados:
     - `page` (default 1)
     - `limit` (default 10)
     - `name`
     - `power`
     - `house`
     - `sort` (por ejemplo `name`, `-name`, `year`, `-year`)

2. `GET /api/superheroes/{id}`
   - Obtiene detalle por ID.

3. `POST /api/superheroes`
   - Crea un héroe.

4. `PUT /api/superheroes/{id}`
   - Actualiza un héroe.

5. `DELETE /api/superheroes/{id}`
   - Elimina un héroe.

6. `GET /api/superheroes/house/{house}`
   - Lista por casa (Marvel/DC).

### Formato de respuesta estándar
```json
{
  "success": true,
  "message": "texto",
  "data": {}
}
```

Nota: en DELETE la respuesta puede venir sin `data` y solo con `success` + `message`.

---

## 3) Frontend (React + TypeScript + Vite)

### Stack
- React
- TypeScript
- Vite
- Tailwind CSS v4
- Axios
- React Router

### Configuración API
En `frontend/src/api/axios.ts`:
- Instancia Axios centralizada.
- Toma `baseURL` desde `VITE_API_BASE_URL`.

Archivo de entorno actual:
- `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:8081
```

### Rutas del frontend
Definidas en `frontend/src/App.tsx`:
- `/` → redirige a `/home`
- `/home` → listado principal
- `/superhero/:id` → detalle
- `/create` → creación
- `/edit/:id` → edición

### Layout
- `BaseLayout` (`frontend/src/layouts/BaseLayout.tsx`)
  - Navbar
  - Botón “Crear héroe”
  - Render de páginas vía `<Outlet />`

---

## 4) Qué hace cada página

## `/home` (Home)
Archivo: `frontend/src/pages/Home.tsx`

Responsabilidades:
- Llamar `GET /api/superheroes`
- Mostrar resultados en cards
- Manejar estados: loading, error, vacío
- Aplicar filtros y orden
- Manejar paginación
- Sincronizar estado con query params de la URL

Componentes usados:
- `SearchFilter` (`components/Filters.tsx`)
- `SuperheroCard` (`components/SuperheroCard.tsx`)
- `Pagination` (`components/Pagination.tsx`)

Ejemplo de URL con estado:
- `/home?name=man&house=marvel&sort=-year&page=2`

## `/superhero/:id` (Detail)
Archivo: `frontend/src/pages/Detail.tsx`

Responsabilidades:
- Llamar `GET /api/superheroes/{id}`
- Mostrar detalle completo
- Mostrar carrusel de imágenes
- Acciones de editar/eliminar
- Manejar estados: loading, error, no encontrado

Componentes usados:
- `ImageCarousel` (`components/Carousel.tsx`)
- `ActionButtons` (`components/ActionButtons.tsx`)

## `/create` (Create)
Archivo: `frontend/src/pages/Create.tsx`

Responsabilidades:
- Mostrar formulario
- Validar campos básicos en frontend
- Enviar `POST /api/superheroes`
- Redirigir al listado al crear

Componente usado:
- `SuperheroForm`

## `/edit/:id` (Edit)
Archivo: `frontend/src/pages/Edit.tsx`

Responsabilidades:
- Cargar héroe con `GET /api/superheroes/{id}`
- Pre-cargar formulario con valores actuales
- Enviar `PUT /api/superheroes/{id}`
- Redirigir al detalle al guardar

Componente usado:
- `SuperheroForm` (reutilizado)

---

## 5) Componentes clave (resumen)

- `SuperheroCard`:
  - Muestra imagen, nombre, casa, resumen y datos rápidos.
  - Navega al detalle.

- `SearchFilter`:
  - Captura filtros (name, power, house, sort).
  - No consume API directamente; notifica a Home.

- `Pagination`:
  - Navega entre páginas.
  - Home decide qué página pedir al backend.

- `ImageCarousel`:
  - Muestra imágenes del héroe con anterior/siguiente e indicadores.

- `ActionButtons`:
  - Botón Editar.
  - Botón Eliminar con confirmación.

- `SuperheroForm`:
  - Formulario reusable para Create y Edit.
  - Validaciones mínimas frontend.

---

## 6) Cómo se conectan backend y frontend

## Cliente HTTP
Frontend usa una única instancia Axios (`api`) para todas las llamadas.

## Flujo general
1. Usuario navega a una ruta frontend.
2. La página correspondiente dispara una llamada HTTP al backend.
3. El backend responde con `{ success, message, data }`.
4. El frontend actualiza estado y renderiza.

## Relación ruta frontend ↔ endpoint backend
- Home (`/home`) ↔ `GET /api/superheroes`
- Detail (`/superhero/:id`) ↔ `GET /api/superheroes/{id}`
- Create (`/create`) ↔ `POST /api/superheroes`
- Edit (`/edit/:id`) ↔ `PUT /api/superheroes/{id}`
- Delete (desde Detail) ↔ `DELETE /api/superheroes/{id}`

## Imágenes
- El backend sirve imágenes en `/static/heroes/...`.
- El frontend arma URL final usando `VITE_API_BASE_URL + /static/heroes/{filename}`.

---

## 7) Arranque rápido (dev)

Desde raíz del proyecto:

1. Levantar backend + mongo
```bash
docker compose up -d --build
```

2. Levantar frontend
```bash
cd frontend
npm install
npm run dev
```

3. URLs esperadas
- Backend API: `http://localhost:8081/api/superheroes`
- Frontend: `http://localhost:5173/home`

---

## 8) Estado actual
- Fases 1 a 6 completadas.
- CRUD funcional en frontend y backend.
- Build, lint y type-check del frontend en estado correcto.
