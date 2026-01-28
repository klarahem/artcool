import { useState, useEffect } from 'react';
import { Star, Calendar, Palette, ArrowRight, X, Maximize2, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import type { Artwork, Artist } from '@/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ArtworkSlideshow } from './ArtworkSlideshow';

interface ArtworkDetailProps {
  artwork: Artwork | null;
  artist: Artist | null;
  isOpen: boolean;
  onClose: () => void;
  onArtistClick?: (artist: Artist) => void;
  allArtworks?: { artwork: Artwork; artist: Artist }[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (artworkId: string) => void;
}

export function ArtworkDetail({ 
  artwork, 
  artist, 
  isOpen, 
  onClose, 
  onArtistClick,
  allArtworks = [],
  currentIndex = 0,
  onNavigate,
  isFavorite = false,
  onToggleFavorite
}: ArtworkDetailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsSlideshowOpen(false);
    }
  }, [isOpen]);

  // Always calculate these values, even if component won't render
  const hasNavigation = allArtworks.length > 1 && onNavigate;
  const canGoPrevious = hasNavigation && currentIndex > 0;
  const canGoNext = hasNavigation && currentIndex < allArtworks.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onNavigate!(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onNavigate!(currentIndex + 1);
    }
  };

  // Reset image loaded state when artwork changes
  useEffect(() => {
    if (artwork?.id) {
      setImageLoaded(false);
      setIsSlideshowOpen(false);
    }
  }, [artwork?.id]);

  // Debug logging
  useEffect(() => {
    if (isOpen && artwork) {
      console.log('ArtworkDetail opened:', { artwork, artist, isOpen });
    }
  }, [isOpen, artwork, artist]);

  // Keyboard navigation - always set up the effect
  useEffect(() => {
    if (!isOpen || isSlideshowOpen || !artwork) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSlideshowOpen, canGoPrevious, canGoNext, currentIndex, artwork]);

  // Early return after all hooks are called
  if (!artwork || !isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="flex w-[95vw] max-w-[1400px] sm:max-w-[1400px] h-[90vh] p-0 gap-0 border-0 overflow-hidden rounded-2xl"
          showCloseButton={false}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <X className="h-5 w-5 text-gray-900" />
          </button>

          <div className="flex flex-col lg:flex-row h-full min-h-0">
            {/* Image Section - Takes up more space on larger screens */}
            <div className="relative flex-none h-[40vh] lg:h-full lg:flex-1 bg-gray-900 flex items-center justify-center group">
              {/* Navigation arrows */}
              {hasNavigation && canGoPrevious && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
              )}
              {hasNavigation && canGoNext && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              )}

              {/* Fullscreen button */}
              <button
                onClick={() => setIsSlideshowOpen(true)}
                className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Maximize2 className="h-4 w-4 text-white" />
              </button>

              {/* Click image to open fullscreen */}
              <div 
                onClick={() => setIsSlideshowOpen(true)}
                className="cursor-zoom-in w-full h-full flex items-center justify-center p-4 lg:p-8"
              >
                {artwork.imageUrl ? (
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      console.error('Image failed to load:', artwork.imageUrl);
                      setImageLoaded(true); // Show even if failed
                    }}
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {!imageLoaded && artwork.imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Info Panel - Fixed width on larger screens */}
            <div className="flex-1 min-h-0 w-full lg:flex-none lg:w-[420px] xl:w-[480px] p-6 lg:p-8 overflow-y-auto bg-white">
              {/* Header */}
              <div className="mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                  {artwork.medium || 'Artwork'}
                </span>
                <h2 className="font-semibold text-2xl lg:text-3xl text-gray-900 leading-tight">
                  {artwork.title}
                </h2>
              </div>

              {/* Artist Card */}
              {artist ? (
                <div 
                  onClick={() => {
                    onClose();
                    onArtistClick?.(artist);
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-colors group mb-6"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={artist.portraitUrl || 'https://via.placeholder.com/100?text=No+Image'}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-500 block mb-0.5">Artist</span>
                    <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate block">
                      {artist.name}
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Artist</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-500 block mb-0.5">Artist</span>
                    <span className="font-semibold text-gray-900 truncate block">Unknown Artist</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => onToggleFavorite?.(artwork.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-colors ${
                    isFavorite 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </span>
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {artwork.year && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs text-gray-500 block">Year</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">{artwork.year}</span>
                    </div>
                  </div>
                )}
                {artwork.medium && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <Palette className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs text-gray-500 block">Medium</span>
                      <span className="text-sm font-medium text-gray-900 truncate block">{artwork.medium}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Metadata */}
              {(artwork.style || artwork.movement || artwork.era || artwork.genre) && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {artwork.style && (
                    <div className="p-3 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-500 block mb-1">Style</span>
                      <span className="text-sm font-medium text-gray-900">{artwork.style}</span>
                    </div>
                  )}
                  {artwork.movement && (
                    <div className="p-3 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-500 block mb-1">Movement</span>
                      <span className="text-sm font-medium text-gray-900">{artwork.movement}</span>
                    </div>
                  )}
                  {artwork.era && (
                    <div className="p-3 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-500 block mb-1">Era</span>
                      <span className="text-sm font-medium text-gray-900">{artwork.era}</span>
                    </div>
                  )}
                  {artwork.genre && (
                    <div className="p-3 rounded-xl bg-gray-50">
                      <span className="text-xs text-gray-500 block mb-1">Genre</span>
                      <span className="text-sm font-medium text-gray-900">{artwork.genre}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs text-gray-500 block mb-2">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {artwork.rating && artwork.rating > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-gray-500">Your rating:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < artwork.rating! ? 'fill-indigo-500 text-indigo-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {artwork.description && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-900 block mb-2">Notes</span>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {artwork.description}
                  </p>
                </div>
              )}

              {/* Date Added */}
              <div className="pt-4 border-t border-gray-100 mt-4">
                <span className="text-xs text-gray-400">
                  Added {new Date(artwork.dateAdded).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Fullscreen Slideshow (must be inside DialogContent so it can receive pointer events) */}
          <ArtworkSlideshow
            artworks={allArtworks}
            currentIndex={currentIndex}
            isOpen={isSlideshowOpen}
            onClose={() => setIsSlideshowOpen(false)}
            onNavigate={(index) => {
              onNavigate?.(index);
              setImageLoaded(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
