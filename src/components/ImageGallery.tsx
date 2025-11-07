import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  maxVisible?: number;
}

export default function ImageGallery({ images, maxVisible = 5 }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const hasMoreImages = images.length > maxVisible;
  const visibleImages = hasMoreImages ? images.slice(0, maxVisible - 1) : images;

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') setSelectedImage(null);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;

    if (clickX < halfWidth) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 row-span-2">
          <img
            src={images[0]}
            alt="Main view"
            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage(0)}
          />
        </div>
        {visibleImages.slice(1).map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`View ${index + 2}`}
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(index + 1)}
            />
          </div>
        ))}
        {hasMoreImages && (
          <div
            className="relative cursor-pointer group"
            onClick={() => setSelectedImage(maxVisible - 1)}
          >
            <img
              src={images[maxVisible - 1]}
              alt={`View ${maxVisible}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center group-hover:bg-opacity-60 transition-all">
              <Plus size={48} className="text-white" />
              <span className="text-white text-2xl font-bold ml-2">
                {images.length - maxVisible + 1}
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <img
            src={images[selectedImage]}
            alt={`View ${selectedImage + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain cursor-pointer"
            onClick={handleImageClick}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-4 text-white text-lg">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
