import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BaseLayout() {
  const navigate = useNavigate();
  const [seeding, setSeeding] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleSeed = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }

    try {
      setSeeding(true);
      setConfirm(false);
      await api.post('/api/superheroes/seed');
      navigate('/home', { replace: true });
      window.location.reload();
    } catch {
      alert('Error al restaurar los datos. Intentá de nuevo.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link
          to="/home"
          className="text-xl font-bold tracking-wide text-white hover:text-indigo-400 transition-colors"
        >
          ⚡ Superheroes SPA
        </Link>

        <div className="flex items-center gap-3">
          {confirm ? (
            <>
              <span className="text-sm text-yellow-400">¿Seguro? Esto borrará todos los héroes actuales.</span>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Sí, restaurar
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleSeed}
              disabled={seeding}
              title="Restaurar los 40 héroes por defecto"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {seeding ? 'Restaurando…' : '↺ Restaurar datos'}
            </button>
          )}

          <Link
            to="/create"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Crear héroe
          </Link>
        </div>
      </nav>

      {/* Contenido de la página */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

