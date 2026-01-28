import { useState } from 'react';
import { Plus, Folder, Image as ImageIcon, Trash2, ArrowLeft, X } from 'lucide-react';
import type { Moodboard, Artist, Artwork } from '@/types';
import { ArtworkCard } from '@/components/ArtworkCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';

interface MoodboardsSectionProps {
  moodboards: Moodboard[];
  artists: Artist[];
  onAddMoodboard: (name: string, description?: string) => void;
  onDeleteMoodboard: (id: string) => void;
  onUpdateMoodboard: (id: string, updates: Partial<Moodboard>) => void;
  onRemoveFromMoodboard: (moodboardId: string, artworkId: string) => void;
  onArtworkClick: (artwork: Artwork, allArtworks: { artwork: Artwork; artist: Artist }[], index: number) => void;
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
  isPinned: (artworkId: string) => boolean;
  pinArtwork: (artworkId: string) => void;
  unpinArtwork: (artworkId: string) => void;
}

export function MoodboardsSection({ 
  moodboards, 
  artists, 
  onAddMoodboard, 
  onDeleteMoodboard,
  onUpdateMoodboard,
  onRemoveFromMoodboard,
  onArtworkClick,
  isFavorite,
  toggleFavorite,
  isPinned,
  pinArtwork,
  unpinArtwork
}: MoodboardsSectionProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingMoodboardId, setDeletingMoodboardId] = useState<string | null>(null);
  const [viewingMoodboard, setViewingMoodboard] = useState<Moodboard | null>(null);
  const [editingMoodboard, setEditingMoodboard] = useState<Moodboard | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const getArtworkThumbnails = (moodboard: Moodboard) => {
    const thumbnails: string[] = [];
    for (const artworkId of moodboard.artworkIds.slice(0, 3)) {
      for (const artist of artists) {
        const artwork = artist.artworks.find(a => a.id === artworkId);
        if (artwork) {
          thumbnails.push(artwork.imageUrl);
          break;
        }
      }
    }
    return thumbnails;
  };

  const getMoodboardArtworks = (moodboard: Moodboard) => {
    return moodboard.artworkIds.map(artworkId => {
      for (const artist of artists) {
        const artwork = artist.artworks.find(a => a.id === artworkId);
        if (artwork) return { artwork, artist };
      }
      return null;
    }).filter((item): item is { artwork: Artwork; artist: Artist } => item !== null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingMoodboard) {
        onUpdateMoodboard(editingMoodboard.id, { 
          name: formData.name.trim(), 
          description: formData.description.trim() || undefined 
        });
        toast.success('Moodboard updated');
      } else {
        onAddMoodboard(formData.name.trim(), formData.description.trim() || undefined);
        toast.success(`Created moodboard "${formData.name.trim()}"`);
      }
      setFormData({ name: '', description: '' });
      setIsCreateModalOpen(false);
      setEditingMoodboard(null);
    }
  };

  const openEditModal = (moodboard: Moodboard) => {
    setEditingMoodboard(moodboard);
    setFormData({ 
      name: moodboard.name, 
      description: moodboard.description || '' 
    });
    setIsCreateModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingMoodboard(null);
    setFormData({ name: '', description: '' });
    setIsCreateModalOpen(true);
  };

  const pageContent = viewingMoodboard ? (() => {
    const moodboardArtworks = getMoodboardArtworks(viewingMoodboard);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => setViewingMoodboard(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Moodboards</span>
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {viewingMoodboard.name}
                </h1>
                {viewingMoodboard.description && (
                  <p className="text-gray-500 mt-1">{viewingMoodboard.description}</p>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  {moodboardArtworks.length} artwork{moodboardArtworks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => openEditModal(viewingMoodboard)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setDeletingMoodboardId(viewingMoodboard.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {moodboardArtworks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No artworks yet
              </h3>
              <p className="text-gray-500">
                Add artworks to this moodboard from the archive
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {moodboardArtworks.map(({ artwork, artist }, index) => (
                <div key={artwork.id} className="relative group">
                  <ArtworkCard 
                    artwork={artwork}
                    artist={artist}
                    moodboards={moodboards}
                    isFavorite={isFavorite(artwork.id)}
                    isPinned={isPinned(artwork.id)}
                    onToggleFavorite={toggleFavorite}
                    onPin={pinArtwork}
                    onUnpin={unpinArtwork}
                    onClick={() => onArtworkClick(artwork, moodboardArtworks, index)}
                  />
                  <button
                    onClick={() => {
                      onRemoveFromMoodboard(viewingMoodboard.id, artwork.id);
                      toast.success('Removed from moodboard');
                    }}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  })() : (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2 block">
                Visual Studies
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                Moodboards
              </h1>
              <p className="text-gray-500 mt-2">
                {moodboards.length} moodboard{moodboards.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              onClick={openCreateModal}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Moodboard
            </Button>
          </div>
        </div>
      </div>

      {/* Moodboards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {moodboards.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Folder className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No moodboards yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create moodboards to organize and study artworks
            </p>
            <Button 
              onClick={openCreateModal}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create your first moodboard
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moodboards.map((moodboard) => {
              const thumbnails = getArtworkThumbnails(moodboard);
              return (
                <div 
                  key={moodboard.id}
                  onClick={() => setViewingMoodboard(moodboard)}
                  className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                      >
                        {thumbnails[i] ? (
                          <img 
                            src={thumbnails[i]} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {moodboard.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {moodboard.artworkIds.length} artwork{moodboard.artworkIds.length !== 1 ? 's' : ''}
                      </p>
                      {moodboard.description && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {moodboard.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingMoodboardId(moodboard.id);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {pageContent}

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingMoodboard ? 'Edit Moodboard' : 'Create New Moodboard'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Blue Period Study"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this moodboard about?"
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingMoodboard(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {editingMoodboard ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingMoodboardId} onOpenChange={() => setDeletingMoodboardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Moodboard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this moodboard? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deletingMoodboardId) {
                  onDeleteMoodboard(deletingMoodboardId);
                  // If we're viewing the deleted moodboard, go back to list
                  setViewingMoodboard(null);
                  toast.success('Moodboard deleted');
                }
                setDeletingMoodboardId(null);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
