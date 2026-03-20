import { Link } from 'react-router-dom';

interface ActionButtonsProps {
  heroId: string;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function ActionButtons({ heroId, onDelete, isDeleting }: ActionButtonsProps) {
  const handleDeleteClick = () => {
    const confirmed = window.confirm('¿Seguro que querés eliminar este superhéroe?');

    if (!confirmed) {
      return;
    }

    onDelete();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        to={`/edit/${heroId}`}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-amber-400"
      >
        Editar
      </Link>

      <button
        type="button"
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
}
