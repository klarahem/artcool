import { useState } from 'react';
import { ArrowRight, Pin, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { Artist, Artwork, Moodboard } from '@/types';
import { ArtistCard } from '@/components/ArtistCard';
import { ArtworkCard } from '@/components/ArtworkCard';
import { Button } from '@/components/ui/button';

interface CollectionSectionProps {
  artists: Artist[];
  pinnedArtworks: { artwork: Artwork; artist: Artist }[];
  recentArtworks: { artwork: Artwork; artist: Artist }[];
  moodboards: Moodboard[];
  onArtistClick: (artist: Artist) => void;
  onArtworkClick: (artwork: Artwork, allArtworks: { artwork: Artwork; artist: Artist }[], index: number) => void;
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
  isPinned: (artworkId: string) => boolean;
  pinArtwork: (artworkId: string) => void;
  unpinArtwork: (artworkId: string) => void;
  onAddToMoodboard?: (moodboardId: string, artworkId: string) => void;
  onViewAllArtists: () => void;
}

export function CollectionSection({ 
  artists, 
  pinnedArtworks,
  recentArtworks,
  moodboards,
  onArtistClick, 
  onArtworkClick,
  isFavorite,
  toggleFavorite,
  isPinned,
  pinArtwork,
  unpinArtwork,
  onAddToMoodboard,
  onViewAllArtists
}: CollectionSectionProps) {
  const [featuredArtist] = useState(() => artists[0]);
  const [featuredArtwork] = useState(() => {
    if (artists.length > 1 && artists[1].artworks.length > 0) {
      return artists[1].artworks[0];
    }
    return artists[0]?.artworks[0];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredArtwork?.imageUrl || artists[0]?.artworks[0]?.imageUrl}
            alt="Featured artwork"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: Artist Info Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md shadow-2xl">
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-3 block">
                Featured Artist
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                {featuredArtist?.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {featuredArtist?.bio}
              </p>
              <button 
                onClick={() => featuredArtist && onArtistClick(featuredArtist)}
                className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:gap-3 transition-all"
              >
                View profile <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Artwork Info */}
            <div className="text-white">
              <span className="font-mono text-xs uppercase tracking-wider text-white/70 mb-2 block">
                Artwork
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-2 max-w-xl">
                {featuredArtwork?.title}
              </h1>
              <p className="text-white/70">
                {featuredArtwork?.year} • {featuredArtwork?.medium}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Pinned Artworks */}
        {pinnedArtworks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Pin className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    Pinned
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Your curated selection
                  </p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pinnedArtworks.slice(0, 4).map(({ artwork, artist }, index) => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={artwork}
                  artist={artist}
                  moodboards={moodboards}
                  isFavorite={isFavorite(artwork.id)}
                  isPinned={isPinned(artwork.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToMoodboard={onAddToMoodboard}
                  onPin={pinArtwork}
                  onUnpin={unpinArtwork}
                  onClick={() => onArtworkClick(artwork, pinnedArtworks, index)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Added */}
        {recentArtworks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                  Fresh Additions
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Recently Added
                </h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentArtworks.slice(0, 4).map(({ artwork, artist }, index) => (
                <ArtworkCard 
                  key={artwork.id}
                  artwork={artwork}
                  artist={artist}
                  moodboards={moodboards}
                  isFavorite={isFavorite(artwork.id)}
                  isPinned={isPinned(artwork.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToMoodboard={onAddToMoodboard}
                  onPin={pinArtwork}
                  onUnpin={unpinArtwork}
                  variant="compact"
                  onClick={() => onArtworkClick(artwork, recentArtworks, index)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Your Artists */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    Your Artists
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {artists.length} artist{artists.length !== 1 ? 's' : ''} in your collection
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={onViewAllArtists}
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
          
          {artists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-500">No artists yet. Start building your collection!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.slice(0, 4).map((artist) => (
                <ArtistCard 
                  key={artist.id} 
                  artist={artist} 
                  onClick={onArtistClick}
                  variant="default"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
