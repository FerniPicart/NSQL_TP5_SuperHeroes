import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import api from '../api/axios';
import ImageCarousel from '../components/Carousel';
import ActionButtons from '../components/ActionButtons';
import type { ApiResponse, Superhero } from '../types';

function getBiographyText(bio: Superhero['biography']) {
  if (!bio) return 'Sin biografía disponible';
  if (typeof bio === 'string') return bio;
  return bio.description || 'Sin biografía disponible';
}

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hero, setHero] = useState<Superhero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      if (!id) {
        setError('ID inválido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: res } = await api.get<ApiResponse<Superhero>>(`/api/superheroes/${id}`);

        if (!res.success || !res.data) {
          setError(res.message ?? 'No se pudo obtener el superhéroe');
          setHero(null);
          return;
        }

        setHero(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Superhéroe no encontrado');
          setHero(null);
          return;
        }

        const message = err instanceof Error ? err.message : 'Error de conexión con el servidor';
        setError(message);
        setHero(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [id]);

  const handleDelete = async () => {
    if (!hero?.id) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/api/superheroes/${hero.id}`);
      navigate('/home', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo eliminar el superhéroe';
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const biographyText = useMemo(() => getBiographyText(hero?.biography as Superhero['biography']), [hero]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-gray-400">Cargando detalle del héroe…</p>
      </div>
    );
  }

  if (error || !hero) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-2xl font-semibold text-red-400">No se pudo cargar el detalle</p>
        <p className="max-w-lg text-sm text-gray-400">{error ?? 'Superhéroe no encontrado'}</p>
        <Link
          to="/home"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-500"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  const realName = hero.real_name || hero.alias || 'Desconocido';
  const houseLabel = hero.house ?? 'N/D';
  const powerLevel = hero.power_level ?? 'N/D';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/home"
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          ← Volver
        </Link>
        <ActionButtons heroId={hero.id} onDelete={handleDelete} isDeleting={isDeleting} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ImageCarousel images={hero.images ?? []} heroName={hero.name} />

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 space-y-5">
          <header className="space-y-1">
            <h1 className="text-3xl font-bold text-white">{hero.name}</h1>
            <p className="text-gray-400">{realName}</p>
          </header>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-gray-950 p-3">
              <p className="text-gray-500">Casa</p>
              <p className="font-semibold text-white capitalize">{houseLabel}</p>
            </div>
            <div className="rounded-lg bg-gray-950 p-3">
              <p className="text-gray-500">Año</p>
              <p className="font-semibold text-white">{hero.year}</p>
            </div>
            <div className="rounded-lg bg-gray-950 p-3">
              <p className="text-gray-500">Power level</p>
              <p className="font-semibold text-indigo-400">{powerLevel}</p>
            </div>
            <div className="rounded-lg bg-gray-950 p-3">
              <p className="text-gray-500">Estado</p>
              <p className="font-semibold text-white">{hero.is_active === false ? 'Inactivo' : 'Activo'}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-white">Biografía</h2>
            <p className="leading-relaxed text-gray-300">{biographyText}</p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold text-white">Equipamiento</h2>
            {hero.equipment?.length ? (
              <ul className="list-disc space-y-1 pl-5 text-gray-300">
                {hero.equipment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Sin equipamiento registrado</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
