import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomOut } from 'lucide-react';
import type { Artwork, Artist } from '@/types';

interface ArtworkSlideshowProps {
  artworks: { artwork: Artwork; artist: Artist }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export function ArtworkSlideshow({ 
  artworks, 
  currentIndex, 
  isOpen, 
  onClose,
  onNavigate 
}: ArtworkSlideshowProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentItem = artworks[currentIndex];

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setImageLoaded(false);
      onNavigate?.(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const goToNext = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      setImageLoaded(false);
      onNavigate?.(currentIndex + 1);
    }
  }, [currentIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentItem) return null;

  const { artwork, artist } = currentItem;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="text-white">
          <h3 className="font-['Sora'] text-lg font-semibold">{artwork.title}</h3>
          <p className="text-white/70 text-sm">{artist.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm mr-2">
            {currentIndex + 1} / {artworks.length}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ZoomOut className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Image */}
        <div className="relative max-w-[90vw] max-h-[85vh]">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={`max-w-full max-h-[85vh] w-auto h-auto object-contain transition-all duration-300 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Next Button */}
        {currentIndex < artworks.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
          {artwork.year && <span>{artwork.year}</span>}
          {artwork.medium && <span>• {artwork.medium}</span>}
          {artwork.style && <span>• {artwork.style}</span>}
          {artwork.movement && <span>• {artwork.movement}</span>}
        </div>
      </div>
    </div>
  );
}
