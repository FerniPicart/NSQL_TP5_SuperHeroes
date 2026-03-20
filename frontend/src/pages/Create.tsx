import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import SuperheroForm, { type SuperheroFormPayload } from '../components/SuperheroForm';
import type { ApiResponse } from '../types';

export default function Create() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: SuperheroFormPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const { data: res } = await api.post<ApiResponse<unknown>>('/api/superheroes', payload);

      if (!res.success) {
        setError(res.message || 'No se pudo crear el superhéroe.');
        return;
      }

      navigate('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message || 'Error al crear el superhéroe.');
        return;
      }

      setError(err instanceof Error ? err.message : 'Error al crear el superhéroe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Crear héroe</h1>
          <p className="mt-1 text-sm text-gray-400">Completa los datos y guarda el nuevo personaje.</p>
        </div>

        <Link
          to="/home"
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          Cancelar
        </Link>
      </div>

      <SuperheroForm
        submitLabel="Crear superhéroe"
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        serverError={error}
      />
    </div>
  );
}
