import { Link } from 'react-router-dom';
import type { Superhero } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

// Helper: extrae una descripción legíble del campo biography (objeto o string legacy)
function getBiographyText(bio: Superhero['biography']): string {
  if (!bio) return '';
  if (typeof bio === 'string') return bio;
  return bio.description ?? '';
}

// Helper: URL de imagen del backend
function getImageUrl(images: string[]): string {
  if (!images || images.length === 0) return '';
  const first = images[0];
  // Si ya es una URL completa no la prefijamos
  if (first.startsWith('http')) return first;
  return `${API_BASE}/static/heroes/${encodeURIComponent(first)}`;
}

interface Props {
  hero: Superhero;
}

export default function SuperheroCard({ hero }: Props) {
  const imageUrl = getImageUrl(hero.images);
  const description = getBiographyText(hero.biography);
  const houseColor = hero.house?.toLowerCase() === 'marvel'
    ? 'bg-red-600'
    : 'bg-blue-600';

  return (
    <Link
      to={`/superhero/${hero.id}`}
      className="group flex flex-col bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-900/30"
    >
      {/* Imagen */}
      <div className="flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-3 sm:h-56 lg:h-60">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hero.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '';
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-gray-600">
            🦸
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Nombre + casa */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
            {hero.name}
          </h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${houseColor}`}>
            {hero.house}
          </span>
        </div>

        {/* Alias */}
        {hero.alias && (
          <p className="text-sm text-gray-400">{hero.alias}</p>
        )}

        {/* Descripción */}
        {description && (
          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            Poder:{' '}
            <span className="text-indigo-400 font-semibold">{hero.power_level ?? 'N/D'}</span>
          </span>
          <span>{hero.year}</span>
        </div>
      </div>
    </Link>
  );
}
