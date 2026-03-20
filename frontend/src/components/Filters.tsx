interface SearchFilterValues {
  name: string;
  house: string;
  sort: string;
}

interface SearchFilterProps {
  value: SearchFilterValues;
  onChange: (field: keyof SearchFilterValues, value: string) => void;
  onReset: () => void;
}

export default function SearchFilter({
  value,
  onChange,
  onReset,
}: SearchFilterProps) {
  return (
    <section className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Búsqueda y filtros</h2>
          <p className="text-sm text-gray-400">
            Ajustá la lista por nombre, casa y orden.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          Limpiar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Nombre</span>
          <input
            key={value.name}
            type="text"
            defaultValue={value.name}
            onBlur={(event) => onChange('name', event.target.value)}
            placeholder="Ej: Batman"
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-indigo-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Casa</span>
          <select
            value={value.house}
            onChange={(event) => onChange('house', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition-colors focus:border-indigo-500"
          >
            <option value="">Todas</option>
            <option value="marvel">Marvel</option>
            <option value="dc">DC</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-300">
          <span>Orden</span>
          <select
            value={value.sort}
            onChange={(event) => onChange('sort', event.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-white outline-none transition-colors focus:border-indigo-500"
          >
            <option value="name">Nombre A-Z</option>
            <option value="-name">Nombre Z-A</option>
            <option value="year">Año ascendente</option>
            <option value="-year">Año descendente</option>
          </select>
        </label>
      </div>
    </section>
  );
}
