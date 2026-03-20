import { useEffect, useState } from 'react';

export interface SuperheroFormPayload {
  name: string;
  real_name?: string;
  house: string;
  year: number;
  biography: string;
  equipment: string[];
  images: string[];
  power_level: number;
  is_active: boolean;
}

export interface SuperheroFormInitialValues {
  name?: string;
  real_name?: string;
  house?: string;
  year?: number;
  biography?: string;
  equipment?: string[];
  images?: string[];
  power_level?: number;
  is_active?: boolean;
}

interface SuperheroFormProps {
  initialValues?: SuperheroFormInitialValues;
  onSubmit: (payload: SuperheroFormPayload) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
  serverError?: string | null;
}

interface FormState {
  name: string;
  real_name: string;
  house: string;
  year: number;
  biography: string;
  equipmentInput: string;
  imagesInput: string;
  power_level: number;
  is_active: boolean;
}

function createInitialState(values?: SuperheroFormInitialValues): FormState {
  return {
    name: values?.name ?? '',
    real_name: values?.real_name ?? '',
    house: (values?.house ?? 'marvel').toLowerCase(),
    year: values?.year ?? 2000,
    biography: values?.biography ?? '',
    equipmentInput: values?.equipment?.join(', ') ?? '',
    imagesInput: values?.images?.join(', ') ?? '',
    power_level: values?.power_level ?? 50,
    is_active: values?.is_active ?? true,
  };
}

export default function SuperheroForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  serverError,
}: SuperheroFormProps) {
  const [form, setForm] = useState<FormState>(() => createInitialState(initialValues));
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    setForm(createInitialState(initialValues));
  }, [initialValues]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError(null);

    if (!form.name.trim()) {
      setClientError('El nombre es obligatorio.');
      return;
    }

    if (!form.biography.trim()) {
      setClientError('La biografía es obligatoria.');
      return;
    }

    if (form.year < 1900 || form.year > 2100) {
      setClientError('El año debe estar entre 1900 y 2100.');
      return;
    }

    if (form.power_level < 0 || form.power_level > 100) {
      setClientError('El power level debe estar entre 0 y 100.');
      return;
    }

    const equipment = form.equipmentInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const images = form.imagesInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (images.length === 0) {
      setClientError('Debes ingresar al menos una imagen (separadas por coma).');
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      real_name: form.real_name.trim() || undefined,
      house: form.house,
      year: Number(form.year),
      biography: form.biography.trim(),
      equipment,
      images,
      power_level: Number(form.power_level),
      is_active: form.is_active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Nombre *</span>
          <input
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
            placeholder="Ej: Batman"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Nombre real</span>
          <input
            value={form.real_name}
            onChange={(event) => updateField('real_name', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
            placeholder="Ej: Bruce Wayne"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Casa *</span>
          <select
            value={form.house}
            onChange={(event) => updateField('house', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
          >
            <option value="marvel">Marvel</option>
            <option value="dc">DC</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Año *</span>
          <input
            type="number"
            value={form.year}
            onChange={(event) => updateField('year', Number(event.target.value))}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300 md:col-span-2">
          <span>Biografía *</span>
          <textarea
            value={form.biography}
            onChange={(event) => updateField('biography', event.target.value)}
            rows={4}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
            placeholder="Descripción del héroe"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300 md:col-span-2">
          <span>Equipamiento (separado por coma)</span>
          <input
            value={form.equipmentInput}
            onChange={(event) => updateField('equipmentInput', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
            placeholder="Batarang, Batmobile"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300 md:col-span-2">
          <span>Imágenes * (separadas por coma)</span>
          <input
            value={form.imagesInput}
            onChange={(event) => updateField('imagesInput', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
            placeholder="batman.jpg, batman_2.jpg"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Power level (0-100)</span>
          <input
            type="number"
            min={0}
            max={100}
            value={form.power_level}
            onChange={(event) => updateField('power_level', Number(event.target.value))}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
          />
        </label>

        <label className="mt-8 flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) => updateField('is_active', event.target.checked)}
            className="h-4 w-4 rounded border-gray-700 bg-gray-950"
          />
          Héroe activo
        </label>
      </div>

      {(clientError || serverError) ? (
        <p className="rounded-lg border border-red-700 bg-red-900/20 px-3 py-2 text-sm text-red-300">
          {clientError ?? serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
