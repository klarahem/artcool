import { useState } from 'react';
import { Star, Heart, Plus, Check, Pin } from 'lucide-react';
import type { Artwork, Artist, Moodboard } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ArtworkCardProps {
  artwork: Artwork;
  artist?: Artist;
  onClick?: (artwork: Artwork) => void;
  moodboards?: Moodboard[];
  isFavorite?: boolean;
  isPinned?: boolean;
  onToggleFavorite?: (artworkId: string) => void;
  onAddToMoodboard?: (moodboardId: string, artworkId: string) => void;
  onPin?: (artworkId: string) => void;
  onUnpin?: (artworkId: string) => void;
  variant?: 'default' | 'compact' | 'wide' | 'square';
  showArtist?: boolean;
  hideHoverActions?: boolean;
}

export function ArtworkCard({ 
  artwork, 
  artist, 
  onClick, 
  moodboards = [],
  isFavorite = false,
  isPinned = false,
  onToggleFavorite,
  onAddToMoodboard,
  onPin,
  onUnpin,
  variant = 'default',
  showArtist = true,
  hideHoverActions = false 
}: ArtworkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get metadata display
  const getMetadataDisplay = () => {
    const parts = [];
    if (artwork.year) parts.push(artwork.year);
    if (artwork.medium) parts.push(artwork.medium);
    return parts.join(' • ');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    onToggleFavorite?.(artwork.id);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToMoodboard = (moodboardId: string) => {
    onAddToMoodboard?.(moodboardId, artwork.id);
    const moodboard = moodboards.find(mb => mb.id === moodboardId);
    toast.success(`Added to "${moodboard?.name}"`);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinned) {
      if (!onUnpin) return;
      onUnpin?.(artwork.id);
      toast.success('Unpinned from homepage');
    } else {
      if (!onPin) return;
      onPin?.(artwork.id);
      toast.success('Pinned to homepage');
    }
  };

  if (variant === 'wide') {
    return (
      <div 
        onClick={() => onClick?.(artwork)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex gap-5 p-4 rounded-[22px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="w-32 h-32 rounded-[18px] overflow-hidden bg-[#F6F7F9] shrink-0 relative">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {isPinned && (
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Pin className="h-3 w-3 text-white fill-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1 block">
                {artwork.genre || artwork.medium}
              </span>
              <h4 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                {artwork.title}
              </h4>
              {showArtist && artist && (
                <p className="text-gray-500 text-sm mb-2">
                  {artist.name}
                </p>
              )}
              <p className="text-gray-400 text-xs">
                {getMetadataDisplay()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {artwork.rating && artwork.rating > 0 && (
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < artwork.rating! ? 'fill-indigo-500 text-indigo-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'square') {
    return (
      <div 
        onClick={() => onClick?.(artwork)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative cursor-pointer overflow-hidden rounded-[22px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          
          {/* Pin indicator */}
          {isPinned && (
            <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center z-10">
              <Pin className="h-3.5 w-3.5 text-white fill-white" />
            </div>
          )}

          {!hideHoverActions && (onPin || onUnpin || onToggleFavorite) && (
            <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
              {(onPin || onUnpin) && (
                <button
                  onClick={handlePinClick}
                  className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                    isPinned ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Pin className={`h-4 w-4 ${isPinned ? 'fill-indigo-600' : ''}`} />
                </button>
              )}

              {onToggleFavorite && (
                <button
                  onClick={handleFavoriteClick}
                  className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                    isFavorite ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button>
              )}
            </div>
          )}
          
          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-4 left-4 right-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 mb-1 block">
                {artwork.genre || artwork.medium}
              </span>
              <h4 className="font-semibold text-sm text-white leading-tight">
                {artwork.title}
              </h4>
              {showArtist && artist && (
                <p className="text-white/70 text-xs mt-1">
                  {artist.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onClick?.(artwork)}
        className="group cursor-pointer"
      >
        <div className="aspect-[3/4] rounded-[18px] overflow-hidden bg-gray-100 mb-3 relative">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {isPinned && (
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Pin className="h-3 w-3 text-white fill-white" />
            </div>
          )}

          {!hideHoverActions && (onPin || onUnpin || onToggleFavorite) && (
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {(onPin || onUnpin) && (
                <button
                  onClick={handlePinClick}
                  className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                    isPinned ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Pin className={`h-4 w-4 ${isPinned ? 'fill-indigo-600' : ''}`} />
                </button>
              )}
              {onToggleFavorite && (
                <button
                  onClick={handleFavoriteClick}
                  className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                    isFavorite ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button>
              )}
            </div>
          )}
        </div>
        <h4 className="font-semibold text-sm text-gray-900 truncate">
          {artwork.title}
        </h4>
        {showArtist && artist && (
          <p className="text-gray-500 text-xs truncate">
            {artist.name}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2"
    >
      <div 
        onClick={() => onClick?.(artwork)}
        className="aspect-[3/4] relative overflow-hidden cursor-pointer"
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        
        {/* Pin indicator */}
        {isPinned && (
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center z-10">
            <Pin className="h-3.5 w-3.5 text-white fill-white" />
          </div>
        )}
        
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Action buttons on hover */}
        {!hideHoverActions && (onPin || onUnpin || onToggleFavorite || (moodboards.length > 0 && onAddToMoodboard)) && (
          <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            {/* Pin button */}
            {(onPin || onUnpin) && (
              <button
                onClick={handlePinClick}
                className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                  isPinned ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                <Pin className={`h-4 w-4 ${isPinned ? 'fill-indigo-600' : ''}`} />
              </button>
            )}

            {/* Favorite button */}
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
                  isFavorite ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            )}

            {/* Moodboard dropdown */}
            {moodboards.length > 0 && onAddToMoodboard && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                    <Plus className="h-4 w-4 text-gray-700" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="text-xs text-gray-500">
                    Add to Moodboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {moodboards.map((mb) => {
                    const isInMoodboard = mb.artworkIds.includes(artwork.id);
                    return (
                      <DropdownMenuItem 
                        key={mb.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isInMoodboard) {
                            handleAddToMoodboard(mb.id);
                          }
                        }}
                        disabled={isInMoodboard}
                        className={isInMoodboard ? 'text-gray-400' : ''}
                      >
                        <span className="flex-1">{mb.name}</span>
                        {isInMoodboard && <Check className="h-4 w-4 ml-2" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Content overlay on hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 mb-1 block">
            {artwork.genre || artwork.medium}
          </span>
          <h3 className="font-semibold text-lg text-white mb-1 leading-tight">
            {artwork.title}
          </h3>
          {showArtist && artist && (
            <p className="text-white/70 text-sm">
              {artist.name}
            </p>
          )}
          <p className="text-white/50 text-xs mt-1">
            {getMetadataDisplay()}
          </p>
        </div>
      </div>
      
      {/* Card footer (visible when not hovered) */}
      <div className={`p-5 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mb-1 block">
          {artwork.genre || artwork.medium}
        </span>
        <h3 className="font-semibold text-base text-gray-900 mb-1 leading-tight line-clamp-2">
          {artwork.title}
        </h3>
        {showArtist && artist && (
          <p className="text-gray-500 text-sm">
            {artist.name}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          {getMetadataDisplay()}
        </p>
        {artwork.rating && artwork.rating > 0 && (
          <div className="flex items-center gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < artwork.rating! ? 'fill-indigo-500 text-indigo-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
