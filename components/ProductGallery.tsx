'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  // Handle case where images might be empty or undefined
  const [selected, setSelected] = useState(images?.[0] || '');

  // Sync state if images prop changes (important for client-side navigation)
  useEffect(() => {
    if (images?.length > 0) {
      setSelected(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="h-80 sm:h-96 lg:h-[500px] w-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main Image Stage */}
      <div className="relative flex-grow h-80 sm:h-96 lg:h-[500px] w-full bg-white group overflow-hidden">
        <Image
          src={selected}
          alt="Selected product view"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain duration-700 ease-in-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/fallback-image.svg';
          }}
        />
      </div>

      {/* Thumbnails Rail */}
      {images.length > 1 && (
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {images.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                onClick={() => setSelected(img)}
                aria-label={`View product image ${idx + 1}`}
                aria-current={selected === img ? 'true' : 'false'}
                className={`
                  relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden 
                  transition-all duration-200 ring-offset-2
                  ${selected === img 
                    ? 'ring-2 ring-blue-600 opacity-100' 
                    : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-gray-300'
                  }
                `}
              >
                <Image 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  fill 
                  sizes="80px"
                  className="object-cover" 
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}