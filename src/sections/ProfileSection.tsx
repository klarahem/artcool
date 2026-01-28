import { useState, useRef } from 'react';
import { User, Heart, Pin, Image as ImageIcon, Edit2, Camera, Grid3X3, LayoutGrid } from 'lucide-react';
import type { Artist, Artwork, UserProfile, Moodboard } from '@/types';
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
import { toast } from 'sonner';

interface ProfileSectionProps {
  profile: UserProfile;
  artists: Artist[];
  moodboards: Moodboard[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onArtworkClick: (artwork: Artwork, allArtworks: { artwork: Artwork; artist: Artist }[], index: number) => void;
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
  isPinned: (artworkId: string) => boolean;
  pinArtwork: (artworkId: string) => void;
  unpinArtwork: (artworkId: string) => void;
  onAddToMoodboard?: (moodboardId: string, artworkId: string) => void;
}

export function ProfileSection({
  profile,
  artists,
  moodboards,
  onUpdateProfile,
  onArtworkClick,
  isFavorite,
  toggleFavorite,
  isPinned,
  pinArtwork,
  unpinArtwork,
  onAddToMoodboard
}: ProfileSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'collection' | 'favorites' | 'pinned'>('collection');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email || '',
    bio: profile.bio || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allArtworks = artists.flatMap(artist => 
    artist.artworks.map(artwork => ({ artwork, artist }))
  );

  const favoriteArtworks = allArtworks.filter(({ artwork }) => 
    profile.favoriteArtworkIds.includes(artwork.id)
  );

  const pinnedArtworks = profile.pinnedArtworkIds
    .map(id => allArtworks.find(({ artwork }) => artwork.id === id))
    .filter((item): item is { artwork: Artwork; artist: Artist } => item !== undefined);

  const getDisplayedArtworks = () => {
    switch (activeTab) {
      case 'favorites':
        return favoriteArtworks;
      case 'pinned':
        return pinnedArtworks;
      default:
        return allArtworks;
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: formData.name,
      email: formData.email || undefined,
      bio: formData.bio || undefined
    });
    setIsEditModalOpen(false);
    toast.success('Profile updated');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatarUrl: reader.result as string });
        toast.success('Avatar updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const displayedArtworks = getDisplayedArtworks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div 
                onClick={handleAvatarClick}
                className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer group relative"
              >
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">{profile.name}</h1>
                  {profile.email && (
                    <p className="text-gray-500 mt-1">{profile.email}</p>
                  )}
                  {profile.bio && (
                    <p className="text-gray-600 mt-3 max-w-xl">{profile.bio}</p>
                  )}
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: profile.name,
                      email: profile.email || '',
                      bio: profile.bio || ''
                    });
                    setIsEditModalOpen(true);
                  }}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{allArtworks.length}</p>
                  <p className="text-sm text-gray-500">Artworks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{artists.length}</p>
                  <p className="text-sm text-gray-500">Artists</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{favoriteArtworks.length}</p>
                  <p className="text-sm text-gray-500">Favorites</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{moodboards.length}</p>
                  <p className="text-sm text-gray-500">Moodboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('collection')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'collection'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Collection
                </span>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'favorites'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                  {favoriteArtworks.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                      {favoriteArtworks.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('pinned')}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pinned'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  Pinned
                  {pinnedArtworks.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                      {pinnedArtworks.length}
                    </span>
                  )}
                </span>
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'compact' 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {displayedArtworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              {activeTab === 'favorites' ? (
                <Heart className="h-8 w-8 text-gray-300" />
              ) : activeTab === 'pinned' ? (
                <Pin className="h-8 w-8 text-gray-300" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-300" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'favorites' 
                ? 'No favorites yet'
                : activeTab === 'pinned'
                ? 'No pinned artworks'
                : 'No artworks yet'
              }
            </h3>
            <p className="text-gray-500">
              {activeTab === 'favorites' 
                ? 'Add artworks to your favorites by clicking the heart icon'
                : activeTab === 'pinned'
                ? 'Pin artworks to see them on your homepage'
                : 'Start building your collection by adding artists and artworks'
              }
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
          }`}>
            {displayedArtworks.map(({ artwork, artist }, index) => (
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
                variant={viewMode === 'compact' ? 'square' : 'default'}
                onClick={() => onArtworkClick(artwork, displayedArtworks, index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
