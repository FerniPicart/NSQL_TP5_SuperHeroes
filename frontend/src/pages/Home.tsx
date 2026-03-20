import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SearchFilter from '../components/Filters';
import Pagination from '../components/Pagination';
import SuperheroCard from '../components/SuperheroCard';
import type { ApiResponse, PaginatedData, Superhero } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;

function toPositiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [heroes, setHeroes] = useState<Superhero[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page: toPositiveNumber(searchParams.get('page'), DEFAULT_PAGE),
      limit: toPositiveNumber(searchParams.get('limit'), DEFAULT_LIMIT),
      name: searchParams.get('name') ?? '',
      house: searchParams.get('house') ?? '',
      sort: searchParams.get('sort') ?? 'name',
    }),
    [searchParams]
  );

  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  const updateSearchParams = useCallback((updates: Record<string, string | number | null>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === '' ||
        value === DEFAULT_PAGE ||
        value === DEFAULT_LIMIT ||
        (key === 'sort' && value === 'name')
      ) {
        nextParams.delete(key);
        return;
      }

      nextParams.set(key, String(value));
    });

    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string | number> = {
          page: filters.page,
          limit: filters.limit,
        };

        if (filters.name) {
          params.name = filters.name;
        }

        if (filters.house) {
          params.house = filters.house;
        }

        if (filters.sort) {
          params.sort = filters.sort;
        }

        const { data: res } = await api.get<ApiResponse<PaginatedData<Superhero>>>(
          '/api/superheroes',
          { params }
        );

        if (res.success && res.data) {
          const nextTotalPages = Math.max(1, Math.ceil(res.data.total / res.data.limit));

          if (filters.page > nextTotalPages) {
            updateSearchParams({ page: nextTotalPages });
            return;
          }

          setHeroes(res.data.items);
          setTotal(res.data.total);
        } else {
          setError(res.message ?? 'Error al obtener los héroes');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error de conexión con el servidor';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [filters, updateSearchParams]);

  const handleFilterChange = (
    field: 'name' | 'house' | 'sort',
    value: string
  ) => {
    updateSearchParams({
      [field]: value,
      page: DEFAULT_PAGE,
    });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === filters.page) {
      return;
    }

    updateSearchParams({ page });
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div>
        <SearchFilter
          value={{
            name: filters.name,
            house: filters.house,
            sort: filters.sort,
          }}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Cargando héroes…</p>
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <SearchFilter
          value={{
            name: filters.name,
            house: filters.house,
            sort: filters.sort,
          }}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-lg font-semibold text-red-400">❌ Error</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm transition-colors hover:bg-indigo-500"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ─── Vacío ────────────────────────────────────────────────────────────────
  if (heroes.length === 0) {
    return (
      <div>
        <SearchFilter
          value={{
            name: filters.name,
            house: filters.house,
            sort: filters.sort,
          }}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-6xl text-gray-400">🦦</p>
          <p className="font-semibold text-gray-300">No hay resultados para los filtros actuales</p>
          <p className="text-sm text-gray-500">Probá limpiar la búsqueda o cambiar la casa.</p>
        </div>
      </div>
    );
  }

  // ─── Listado ────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Héroes
            <span className="ml-2 text-base font-normal text-gray-400">({total})</span>
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Página {filters.page} de {totalPages}
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-300">
          Mostrando <span className="font-semibold text-white">{heroes.length}</span> resultados en esta página
        </div>
      </div>

      <SearchFilter
        value={{
          name: filters.name,
          house: filters.house,
          sort: filters.sort,
        }}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Resultados</h2>
        <span className="text-sm text-gray-400">{filters.limit} por página</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {heroes.map((hero) => (
          <SuperheroCard key={hero.id} hero={hero} />
        ))}
      </div>

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
