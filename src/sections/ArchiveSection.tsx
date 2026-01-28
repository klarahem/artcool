import { useState, useMemo } from 'react';
import { Search, Grid3X3, LayoutGrid } from 'lucide-react';
import type { Artist, Artwork, Moodboard } from '@/types';
import { ArtworkCard } from '@/components/ArtworkCard';
import { Input } from '@/components/ui/input';

interface ArchiveSectionProps {
  artists: Artist[];
  onArtworkClick: (artwork: Artwork, allArtworks: { artwork: Artwork; artist: Artist }[], index: number) => void;
  moodboards: Moodboard[];
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
  isPinned: (artworkId: string) => boolean;
  pinArtwork: (artworkId: string) => void;
  unpinArtwork: (artworkId: string) => void;
  onAddToMoodboard?: (moodboardId: string, artworkId: string) => void;
}

export function ArchiveSection({
  artists,
  onArtworkClick,
  moodboards,
  isFavorite,
  toggleFavorite,
  isPinned,
  pinArtwork,
  unpinArtwork,
  onAddToMoodboard
}: ArchiveSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  const allArtworks = useMemo(() => {
    return artists.flatMap(artist => 
      artist.artworks.map(artwork => ({
        artwork,
        artist
      }))
    );
  }, [artists]);

  const filteredArtworks = useMemo(() => {
    if (!searchQuery.trim()) return allArtworks;
    
    const query = searchQuery.toLowerCase();
    return allArtworks.filter(({ artwork, artist }) => 
      artwork.title.toLowerCase().includes(query) ||
      artist.name.toLowerCase().includes(query) ||
      artwork.medium.toLowerCase().includes(query) ||
      artwork.style?.toLowerCase().includes(query) ||
      artwork.movement?.toLowerCase().includes(query) ||
      artwork.era?.toLowerCase().includes(query) ||
      artwork.genre?.toLowerCase().includes(query) ||
      artwork.description?.toLowerCase().includes(query) ||
      artwork.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allArtworks, searchQuery]);

  const handleArtworkClick = (artwork: Artwork) => {
    const index = filteredArtworks.findIndex(item => item.artwork.id === artwork.id);
    onArtworkClick(artwork, filteredArtworks, index);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Header */}
      <div className="bg-white border-b border-[rgba(14,15,18,0.10)]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#6B6F7A] mb-2 block">
                Browse
              </span>
              <h1 className="font-['Sora'] text-3xl sm:text-4xl font-semibold text-[#0E0F12]">
                Archive
              </h1>
              <p className="text-[#6B6F7A] mt-2">
                {allArtworks.length} artwork{allArtworks.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-[rgba(14,15,18,0.10)] sticky top-16 z-30">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F7A]" />
              <Input
                type="text"
                placeholder="Search by title, artist, medium, style, movement, era, genre, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#4F5DFF]/10 text-[#4F5DFF]' 
                    : 'text-[#6B6F7A] hover:bg-[#F6F7F9]'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'compact' 
                    ? 'bg-[#4F5DFF]/10 text-[#4F5DFF]' 
                    : 'text-[#6B6F7A] hover:bg-[#F6F7F9]'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#F6F7F9] flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-[#6B6F7A]" />
            </div>
            <h3 className="font-['Sora'] text-xl font-semibold text-[#0E0F12] mb-2">
              No artworks found
            </h3>
            <p className="text-[#6B6F7A]">
              Try adjusting your search term
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
          }`}>
            {filteredArtworks.map(({ artwork, artist }) => (
              <div key={artwork.id} onClick={() => handleArtworkClick(artwork)}>
                <ArtworkCard 
                  artwork={artwork}
                  artist={artist}
                  variant={viewMode === 'compact' ? 'square' : 'default'}
                  moodboards={moodboards}
                  isFavorite={isFavorite(artwork.id)}
                  isPinned={isPinned(artwork.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToMoodboard={onAddToMoodboard}
                  onPin={pinArtwork}
                  onUnpin={unpinArtwork}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
