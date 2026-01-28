import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Calendar, MapPin, Tag } from 'lucide-react';
import type { Artist, Artwork } from '@/types';
import { Button } from '@/components/ui/button';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkModal } from './ArtworkModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ArtistDetailProps {
  artist: Artist;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddArtwork: (artwork: Omit<Artwork, 'id' | 'dateAdded' | 'artistId'>) => void;
  onEditArtwork: (artworkId: string, updates: Partial<Artwork>) => void;
  onDeleteArtwork: (artworkId: string) => void;
  onArtworkClick?: (artwork: Artwork) => void;
}

export function ArtistDetail({ 
  artist, 
  onBack, 
  onEdit, 
  onDelete,
  onAddArtwork,
  onEditArtwork,
  onDeleteArtwork,
  onArtworkClick
}: ArtistDetailProps) {
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState<string | null>(null);
  const [showDeleteArtistDialog, setShowDeleteArtistDialog] = useState(false);

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setIsArtworkModalOpen(true);
  };

  const handleSaveArtwork = (artworkData: Omit<Artwork, 'id' | 'dateAdded' | 'artistId'>) => {
    if (editingArtwork) {
      onEditArtwork(editingArtwork.id, artworkData);
    } else {
      onAddArtwork(artworkData);
    }
    setEditingArtwork(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-[rgba(14,15,18,0.10)]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[#6B6F7A] hover:text-[#0E0F12] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Artists</span>
            </button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onEdit}
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Artist</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDeleteArtistDialog(true)}
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Artist Profile */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Left: Portrait & Quick Info */}
          <div>
            <div className="sticky top-36">
              <div className="aspect-[3/4] rounded-[28px] overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] mb-6">
                <img
                  src={artist.portraitUrl || 'https://via.placeholder.com/400x600?text=No+Image'}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                {artist.birthYear && (
                  <div className="flex items-center gap-3 text-[#6B6F7A]">
                    <Calendar className="h-5 w-5" />
                    <span>{artist.birthYear}{artist.deathYear ? ` – ${artist.deathYear}` : ''}</span>
                  </div>
                )}
                {artist.nationality && (
                  <div className="flex items-center gap-3 text-[#6B6F7A]">
                    <MapPin className="h-5 w-5" />
                    <span>{artist.nationality}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[#6B6F7A]">
                  <Tag className="h-5 w-5" />
                  <span>{artist.artworks.length} works</span>
                </div>
              </div>

              {artist.tags && artist.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {artist.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#F6F7F9] border border-[rgba(14,15,18,0.10)] text-xs text-[#6B6F7A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Bio & Artworks */}
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-[0.12em] text-[#6B6F7A] mb-2 block">
              Artist
            </span>
            <h1 className="font-['Sora'] text-4xl sm:text-5xl font-semibold text-[#0E0F12] mb-6">
              {artist.name}
            </h1>
            
            {artist.bio && (
              <p className="text-[#6B6F7A] text-lg leading-relaxed mb-10 max-w-2xl">
                {artist.bio}
              </p>
            )}

            {/* Artworks Section */}
            <div className="border-t border-[rgba(14,15,18,0.10)] pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Sora'] text-2xl font-semibold text-[#0E0F12]">
                  Artworks
                </h2>
                <Button 
                  onClick={() => {
                    setEditingArtwork(null);
                    setIsArtworkModalOpen(true);
                  }}
                  className="gap-2 bg-[#4F5DFF] hover:bg-[#4F5DFF]/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Artwork
                </Button>
              </div>

              {artist.artworks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[28px] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                  <p className="text-[#6B6F7A] mb-4">No artworks added yet</p>
                  <Button 
                    onClick={() => {
                      setEditingArtwork(null);
                      setIsArtworkModalOpen(true);
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first artwork
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {artist.artworks.map((artwork) => (
                    <div key={artwork.id} className="relative group">
                      <div onClick={() => onArtworkClick?.(artwork)}>
                        <ArtworkCard 
                          artwork={artwork} 
                          artist={artist}
                          showArtist={false}
                        />
                      </div>
                      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditArtwork(artwork);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        >
                          <Edit2 className="h-4 w-4 text-[#0E0F12]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingArtworkId(artwork.id);
                          }}
                          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Artwork Modal */}
      <ArtworkModal
        isOpen={isArtworkModalOpen}
        onClose={() => {
          setIsArtworkModalOpen(false);
          setEditingArtwork(null);
        }}
        onSave={handleSaveArtwork}
        artwork={editingArtwork}
      />

      {/* Delete Artwork Dialog */}
      <AlertDialog open={!!deletingArtworkId} onOpenChange={() => setDeletingArtworkId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this artwork? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deletingArtworkId) {
                  onDeleteArtwork(deletingArtworkId);
                }
                setDeletingArtworkId(null);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Artist Dialog */}
      <AlertDialog open={showDeleteArtistDialog} onOpenChange={setShowDeleteArtistDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {artist.name}? This will also delete all {artist.artworks.length} artworks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete();
                setShowDeleteArtistDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Artist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
