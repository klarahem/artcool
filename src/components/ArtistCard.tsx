import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Artist } from '@/types';

interface ArtistCardProps {
  artist: Artist;
  onClick?: (artist: Artist) => void;
  variant?: 'default' | 'compact' | 'portrait';
}

export function ArtistCard({ artist, onClick, variant = 'default' }: ArtistCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (variant === 'portrait') {
    return (
      <div 
        onClick={() => onClick?.(artist)}
        className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2"
      >
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={artist.portraitUrl || 'https://via.placeholder.com/400x600?text=No+Image'}
            alt={artist.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#F6F7F9] animate-pulse" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-white/70 mb-2 block">
              Artist
            </span>
            <h3 className="font-['Sora'] text-2xl font-semibold text-white mb-1 leading-tight">
              {artist.name}
            </h3>
            <p className="text-white/70 text-sm mb-3">
              {artist.nationality} • {artist.birthYear}{artist.deathYear ? `–${artist.deathYear}` : ''}
            </p>
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>View profile</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onClick?.(artist)}
        className="group flex items-center gap-4 p-4 rounded-[22px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#F6F7F9] shrink-0">
          <img
            src={artist.portraitUrl || 'https://via.placeholder.com/100?text=No+Image'}
            alt={artist.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-['Sora'] text-base font-semibold text-[#0E0F12] truncate">
            {artist.name}
          </h4>
          <p className="text-[#6B6F7A] text-sm truncate">
            {artist.nationality} • {artist.artworks.length} works
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-[#6B6F7A] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    );
  }

  // Default variant
  return (
    <div 
      onClick={() => onClick?.(artist)}
      className="group relative cursor-pointer overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <img
          src={artist.portraitUrl || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={artist.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#F6F7F9] animate-pulse" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-5">
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#6B6F7A] mb-2 block">
          Artist
        </span>
        <h3 className="font-['Sora'] text-lg font-semibold text-[#0E0F12] mb-1 leading-tight">
          {artist.name}
        </h3>
        <p className="text-[#6B6F7A] text-sm mb-2">
          {artist.nationality}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#6B6F7A] text-xs">
            {artist.artworks.length} works
          </span>
          <span className="text-[#4F5DFF] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
