import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import SuperheroForm, {
  type SuperheroFormInitialValues,
  type SuperheroFormPayload,
} from '../components/SuperheroForm';
import type { ApiResponse, Superhero } from '../types';

function getBiographyText(bio: Superhero['biography']) {
  if (!bio) return '';
  if (typeof bio === 'string') return bio;
  return bio.description ?? '';
}

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hero, setHero] = useState<Superhero | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      if (!id) {
        setError('ID inválido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: res } = await api.get<ApiResponse<Superhero>>(`/api/superheroes/${id}`);

        if (!res.success || !res.data) {
          setError(res.message || 'No se pudo cargar el héroe para editar.');
          return;
        }

        setHero(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Superhéroe no encontrado.');
          return;
        }

        setError(err instanceof Error ? err.message : 'No se pudo cargar el héroe para editar.');
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [id]);

  const initialValues = useMemo<SuperheroFormInitialValues | undefined>(() => {
    if (!hero) {
      return undefined;
    }

    return {
      name: hero.name,
      real_name: hero.real_name,
      house: (hero.house ?? 'marvel').toLowerCase(),
      year: hero.year,
      biography: getBiographyText(hero.biography),
      equipment: hero.equipment ?? [],
      images: hero.images ?? [],
      power_level: hero.power_level ?? 50,
      is_active: hero.is_active ?? true,
    };
  }, [hero]);

  const handleUpdate = async (payload: SuperheroFormPayload) => {
    if (!id) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { data: res } = await api.put<ApiResponse<unknown>>(`/api/superheroes/${id}`, payload);

      if (!res.success) {
        setError(res.message || 'No se pudo actualizar el superhéroe.');
        return;
      }

      navigate(`/superhero/${id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message || 'No se pudo actualizar el superhéroe.');
        return;
      }

      setError(err instanceof Error ? err.message : 'No se pudo actualizar el superhéroe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-28">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Cargando datos del héroe…</p>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-2xl font-semibold text-red-400">No se pudo abrir la edición</p>
        <p className="text-sm text-gray-400">{error || 'Superhéroe no encontrado.'}</p>
        <Link
          to="/home"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-500"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Editar héroe</h1>
          <p className="mt-1 text-sm text-gray-400">Actualiza la información de {hero.name}.</p>
        </div>

        <Link
          to={`/superhero/${hero.id}`}
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          Cancelar
        </Link>
      </div>

      <SuperheroForm
        initialValues={initialValues}
        submitLabel="Guardar cambios"
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        serverError={error}
      />
    </div>
  );
}
