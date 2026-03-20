// ─── Biography ────────────────────────────────────────────────────────────────
export interface Biography {
  origin?: string;
  description?: string;
  alignment?: string;
}

// ─── Superhero ────────────────────────────────────────────────────────────────
export interface Superhero {
  id: string;
  name: string;
  real_name?: string;
  alias?: string;
  house: string;
  year: number;
  // biography puede ser objeto (schema nuevo) o string (seed legacy)
  biography: Biography | string;
  equipment: string[];
  images: string[];
  power_level?: number;
  is_active?: boolean;
}

// ─── Respuesta estandarizada del backend ──────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Datos paginados (data de GET /api/superheroes) ───────────────────────────
export interface PaginatedData<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}
