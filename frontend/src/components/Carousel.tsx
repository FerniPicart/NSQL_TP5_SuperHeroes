import { useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081';

interface ImageCarouselProps {
  images: string[];
  heroName: string;
}

function buildImageUrl(imageName: string) {
  if (imageName.startsWith('http')) {
    return imageName;
  }

  return `${API_BASE}/static/heroes/${encodeURIComponent(imageName)}`;
}

export default function ImageCarousel({ images, heroName }: ImageCarouselProps) {
  const validImages = useMemo(
    () => images.filter((img) => img && !img.toLowerCase().includes('imagen de superheroe no encontrada')),
    [images]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-gray-800 bg-gray-900 text-6xl text-gray-600 sm:h-96 lg:h-[32rem]">
        🦸
      </div>
    );
  }

  const currentImage = validImages[currentIndex];
  const canNavigate = validImages.length > 1;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="space-y-3">
      <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-4 sm:h-96 lg:h-[32rem] lg:p-6">
        <img
          key={currentImage}
          src={buildImageUrl(currentImage)}
          alt={`${heroName} - imagen ${currentIndex + 1}`}
          className="h-full w-full object-contain opacity-100 transition-transform duration-300"
        />

        {canNavigate ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white transition-colors hover:bg-black/70"
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white transition-colors hover:bg-black/70"
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {canNavigate ? (
        <div className="flex justify-center gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={[
                'h-2.5 w-2.5 rounded-full transition-colors',
                index === currentIndex ? 'bg-indigo-500' : 'bg-gray-600 hover:bg-gray-500',
              ].join(' ')}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
