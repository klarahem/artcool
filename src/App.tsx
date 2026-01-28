import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { ArtistModal } from '@/components/ArtistModal';
import { ArtistDetail } from '@/components/ArtistDetail';
import { ArtworkDetail } from '@/components/ArtworkDetail';
import { CollectionSection } from '@/sections/CollectionSection';
import { ArtistsSection } from '@/sections/ArtistsSection';
import { MoodboardsSection } from '@/sections/MoodboardsSection';
import { ArchiveSection } from '@/sections/ArchiveSection';
import { ProfileSection } from '@/sections/ProfileSection';
import { useArtData } from '@/hooks/useArtData';
import type { Artist, Artwork } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type Tab = 'collection' | 'artists' | 'moodboards' | 'archive' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('collection');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Artist detail view
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  
  // Artwork detail view
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedArtworkArtist, setSelectedArtworkArtist] = useState<Artist | null>(null);
  const [isArtworkDetailOpen, setIsArtworkDetailOpen] = useState(false);
  
  // Slideshow navigation
  const [slideshowArtworks, setSlideshowArtworks] = useState<{ artwork: Artwork; artist: Artist }[]>([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  
  // Artist modal
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

  const {
    artists,
    moodboards,
    profile,
    getAllArtworks,
    getPinnedArtworks,
    toggleFavorite,
    isFavorite,
    pinArtwork,
    unpinArtwork,
    isPinned,
    updateProfile,
    addArtist,
    updateArtist,
    deleteArtist,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    addMoodboard,
    updateMoodboard,
    deleteMoodboard,
    addToMoodboard,
    removeFromMoodboard,
    searchArtists
  } = useArtData();

  // Get data for collection section
  const allArtworks = useMemo(() => getAllArtworks(), [getAllArtworks]);
  const pinnedArtworks = useMemo(() => getPinnedArtworks(), [getPinnedArtworks]);
  
  // Get recent artworks (last 4 added)
  const recentArtworks = useMemo(() => {
    return [...allArtworks]
      .sort((a, b) => new Date(b.artwork.dateAdded).getTime() - new Date(a.artwork.dateAdded).getTime())
      .slice(0, 4);
  }, [allArtworks]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    setSelectedArtist(null);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setActiveTab('artists');
    }
  };

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtist(artist);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArtworkClick = (artwork: Artwork, allArtworks?: { artwork: Artwork; artist: Artist }[], index?: number) => {
    const artist = artists.find(a => a.id === artwork.artistId);
    setSelectedArtwork(artwork);
    setSelectedArtworkArtist(artist || null);
    
    // Set up slideshow navigation if provided
    if (allArtworks && allArtworks.length > 0 && index !== undefined) {
      setSlideshowArtworks(allArtworks);
      setSlideshowIndex(index);
    } else {
      // Default: just this artwork
      setSlideshowArtworks([{ artwork, artist: artist! }]);
      setSlideshowIndex(0);
    }
    
    setIsArtworkDetailOpen(true);
  };

  const handleSlideshowNavigate = (newIndex: number) => {
    const item = slideshowArtworks[newIndex];
    if (item) {
      setSlideshowIndex(newIndex);
      setSelectedArtwork(item.artwork);
      setSelectedArtworkArtist(item.artist);
    }
  };

  const handleAddArtist = (artistData: Omit<Artist, 'id' | 'dateAdded' | 'artworks'>) => {
    addArtist(artistData);
    toast.success(`Added ${artistData.name} to your collection`);
  };

  const handleUpdateArtist = (id: string, updates: Partial<Artist>) => {
    updateArtist(id, updates);
    if (selectedArtist && selectedArtist.id === id) {
      setSelectedArtist({ ...selectedArtist, ...updates });
    }
    toast.success('Artist updated');
  };

  const handleDeleteArtist = () => {
    if (selectedArtist) {
      deleteArtist(selectedArtist.id);
      setSelectedArtist(null);
      toast.success('Artist deleted');
    }
  };

  const handleAddArtwork = (artistId: string, artworkData: Omit<Artwork, 'id' | 'dateAdded' | 'artistId'>) => {
    addArtwork(artistId, artworkData);
    toast.success(`Added "${artworkData.title}"`);
  };

  const handleUpdateArtwork = (artistId: string, artworkId: string, updates: Partial<Artwork>) => {
    updateArtwork(artistId, artworkId, updates);
    toast.success('Artwork updated');
  };

  const handleDeleteArtwork = (artistId: string, artworkId: string) => {
    deleteArtwork(artistId, artworkId);
    toast.success('Artwork deleted');
  };

  const handleAddMoodboard = (name: string, description?: string) => {
    addMoodboard(name, description);
    toast.success(`Created moodboard "${name}"`);
  };

  const handleToggleFavorite = (artworkId: string) => {
    toggleFavorite(artworkId);
  };

  // If viewing an artist detail
  if (selectedArtist) {
    // Get all artworks for this artist for slideshow navigation
    const artistArtworks = selectedArtist.artworks.map(artwork => ({
      artwork,
      artist: selectedArtist
    }));

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          onSearch={handleSearch} 
          searchQuery={searchQuery}
          onTabChange={handleTabChange}
          activeTab={activeTab}
          userAvatar={profile.avatarUrl}
        />
        <div className="pt-16">
          <ArtistDetail
            artist={selectedArtist}
            onBack={() => setSelectedArtist(null)}
            onEdit={() => {
              setEditingArtist(selectedArtist);
              setIsArtistModalOpen(true);
            }}
            onDelete={handleDeleteArtist}
            onAddArtwork={(artworkData) => handleAddArtwork(selectedArtist.id, artworkData)}
            onEditArtwork={(artworkId, updates) => handleUpdateArtwork(selectedArtist.id, artworkId, updates)}
            onDeleteArtwork={(artworkId) => handleDeleteArtwork(selectedArtist.id, artworkId)}
            onArtworkClick={(artwork) => handleArtworkClick(artwork, artistArtworks, artistArtworks.findIndex(a => a.artwork.id === artwork.id))}
          />
        </div>
        
        {/* Artist Modal */}
        <ArtistModal
          isOpen={isArtistModalOpen}
          onClose={() => {
            setIsArtistModalOpen(false);
            setEditingArtist(null);
          }}
          onSave={(data) => {
            if (editingArtist) {
              handleUpdateArtist(editingArtist.id, data);
            } else {
              handleAddArtist(data);
            }
            setIsArtistModalOpen(false);
            setEditingArtist(null);
          }}
          artist={editingArtist}
        />

        {/* Artwork Detail Modal */}
        <ArtworkDetail
          artwork={selectedArtwork}
          artist={selectedArtworkArtist}
          isOpen={isArtworkDetailOpen}
          onClose={() => setIsArtworkDetailOpen(false)}
          onArtistClick={handleArtistClick}
          allArtworks={slideshowArtworks}
          currentIndex={slideshowIndex}
          onNavigate={handleSlideshowNavigate}
          isFavorite={selectedArtwork ? isFavorite(selectedArtwork.id) : false}
          onToggleFavorite={handleToggleFavorite}
        />

        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onSearch={handleSearch} 
        searchQuery={searchQuery}
        onTabChange={handleTabChange}
        activeTab={activeTab}
        userAvatar={profile.avatarUrl}
      />
      
      <main className="pt-16">
        {activeTab === 'collection' && (
          <CollectionSection 
            artists={artists}
            pinnedArtworks={pinnedArtworks}
            recentArtworks={recentArtworks}
            moodboards={moodboards}
            onArtistClick={handleArtistClick}
            onArtworkClick={handleArtworkClick}
            isFavorite={isFavorite}
            toggleFavorite={handleToggleFavorite}
            isPinned={isPinned}
            pinArtwork={pinArtwork}
            unpinArtwork={unpinArtwork}
            onAddToMoodboard={addToMoodboard}
            onViewAllArtists={() => setActiveTab('artists')}
          />
        )}

        {activeTab === 'artists' && (
          <ArtistsSection
            artists={searchQuery ? searchArtists(searchQuery) : artists}
            onArtistClick={handleArtistClick}
            onAddArtist={() => {
              setEditingArtist(null);
              setIsArtistModalOpen(true);
            }}
          />
        )}

        {activeTab === 'moodboards' && (
          <MoodboardsSection
            moodboards={moodboards}
            artists={artists}
            onAddMoodboard={handleAddMoodboard}
            onDeleteMoodboard={deleteMoodboard}
            onUpdateMoodboard={updateMoodboard}
            onRemoveFromMoodboard={removeFromMoodboard}
            onArtworkClick={handleArtworkClick}
            isFavorite={isFavorite}
            toggleFavorite={handleToggleFavorite}
            isPinned={isPinned}
            pinArtwork={pinArtwork}
            unpinArtwork={unpinArtwork}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveSection
            artists={artists}
            onArtworkClick={handleArtworkClick}
            moodboards={moodboards}
            isFavorite={isFavorite}
            toggleFavorite={handleToggleFavorite}
            isPinned={isPinned}
            pinArtwork={pinArtwork}
            unpinArtwork={unpinArtwork}
            onAddToMoodboard={addToMoodboard}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profile={profile}
            artists={artists}
            moodboards={moodboards}
            onUpdateProfile={updateProfile}
            onArtworkClick={handleArtworkClick}
            isFavorite={isFavorite}
            toggleFavorite={handleToggleFavorite}
            isPinned={isPinned}
            pinArtwork={pinArtwork}
            unpinArtwork={unpinArtwork}
            onAddToMoodboard={addToMoodboard}
          />
        )}
      </main>

      {/* Artist Modal */}
      <ArtistModal
        isOpen={isArtistModalOpen}
        onClose={() => {
          setIsArtistModalOpen(false);
          setEditingArtist(null);
        }}
        onSave={(data) => {
          if (editingArtist) {
            handleUpdateArtist(editingArtist.id, data);
          } else {
            handleAddArtist(data);
          }
          setIsArtistModalOpen(false);
          setEditingArtist(null);
        }}
        artist={editingArtist}
      />

      {/* Artwork Detail Modal */}
      <ArtworkDetail
        artwork={selectedArtwork}
        artist={selectedArtworkArtist}
        isOpen={isArtworkDetailOpen}
        onClose={() => setIsArtworkDetailOpen(false)}
        onArtistClick={handleArtistClick}
        allArtworks={slideshowArtworks}
        currentIndex={slideshowIndex}
        onNavigate={handleSlideshowNavigate}
        isFavorite={selectedArtwork ? isFavorite(selectedArtwork.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
