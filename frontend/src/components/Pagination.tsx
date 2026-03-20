interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function buildVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = buildVisiblePages(currentPage, totalPages);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Anterior
      </button>

      {visiblePages.map((page, index) => {
        const previousPage = visiblePages[index - 1];
        const showEllipsis = previousPage && page - previousPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis ? <span className="px-1 text-gray-500">…</span> : null}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={[
                'min-w-10 rounded-lg border px-3 py-2 text-sm transition-colors',
                currentPage === page
                  ? 'border-indigo-500 bg-indigo-600 text-white'
                  : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white',
              ].join(' ')}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente
      </button>
    </nav>
  );
}
