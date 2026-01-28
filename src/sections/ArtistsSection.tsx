import { useState, useMemo } from 'react';
import { Plus, Search, Grid3X3, LayoutList } from 'lucide-react';
import type { Artist } from '@/types';
import { ArtistCard } from '@/components/ArtistCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ArtistsSectionProps {
  artists: Artist[];
  onArtistClick: (artist: Artist) => void;
  onAddArtist: () => void;
}

export function ArtistsSection({ artists, onArtistClick, onAddArtist }: ArtistsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return artists;
    const query = searchQuery.toLowerCase();
    return artists.filter(artist => 
      artist.name.toLowerCase().includes(query) ||
      artist.nationality?.toLowerCase().includes(query) ||
      artist.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [artists, searchQuery]);

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
                All Artists
              </h1>
              <p className="text-[#6B6F7A] mt-2">
                {artists.length} artist{artists.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
            <Button 
              onClick={onAddArtist}
              className="gap-2 bg-[#4F5DFF] hover:bg-[#4F5DFF]/90 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Add Artist
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white border-b border-[rgba(14,15,18,0.10)] sticky top-16 z-30">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F7A]" />
              <Input
                type="text"
                placeholder="Search artists, nationalities, tags..."
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
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#4F5DFF]/10 text-[#4F5DFF]' 
                    : 'text-[#6B6F7A] hover:bg-[#F6F7F9]'
                }`}
              >
                <LayoutList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artists Grid/List */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArtists.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#F6F7F9] flex items-center justify-center mx-auto mb-6">
              <Search className="h-8 w-8 text-[#6B6F7A]" />
            </div>
            <h3 className="font-['Sora'] text-xl font-semibold text-[#0E0F12] mb-2">
              No artists found
            </h3>
            <p className="text-[#6B6F7A] mb-6">
              {searchQuery ? 'Try a different search term' : 'Start building your collection'}
            </p>
            {!searchQuery && (
              <Button 
                onClick={onAddArtist}
                className="gap-2 bg-[#4F5DFF] hover:bg-[#4F5DFF]/90"
              >
                <Plus className="h-4 w-4" />
                Add your first artist
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'max-w-2xl'
          }`}>
            {filteredArtists.map((artist) => (
              <ArtistCard 
                key={artist.id} 
                artist={artist} 
                onClick={onArtistClick}
                variant={viewMode === 'list' ? 'compact' : 'portrait'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
