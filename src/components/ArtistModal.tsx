import { useState, useEffect } from 'react';
import type { Artist } from '@/types';
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

interface ArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artist: Omit<Artist, 'id' | 'dateAdded' | 'artworks'>) => void;
  artist?: Artist | null;
}

export function ArtistModal({ isOpen, onClose, onSave, artist }: ArtistModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    deathYear: '',
    nationality: '',
    bio: '',
    portraitUrl: '',
    tags: ''
  });

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        birthYear: artist.birthYear || '',
        deathYear: artist.deathYear || '',
        nationality: artist.nationality || '',
        bio: artist.bio || '',
        portraitUrl: artist.portraitUrl || '',
        tags: artist.tags?.join(', ') || ''
      });
    } else {
      setFormData({
        name: '',
        birthYear: '',
        deathYear: '',
        nationality: '',
        bio: '',
        portraitUrl: '',
        tags: ''
      });
    }
  }, [artist, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      birthYear: formData.birthYear || undefined,
      deathYear: formData.deathYear || undefined,
      nationality: formData.nationality || undefined,
      bio: formData.bio || undefined,
      portraitUrl: formData.portraitUrl || undefined,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Sora'] text-2xl font-semibold">
            {artist ? 'Edit Artist' : 'Add New Artist'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-[#0E0F12]">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Vincent van Gogh"
              required
              className="h-11"
            />
          </div>

          {/* Years */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthYear" className="text-sm font-medium text-[#0E0F12]">
                Birth Year
              </Label>
              <Input
                id="birthYear"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                placeholder="e.g., 1853"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathYear" className="text-sm font-medium text-[#0E0F12]">
                Death Year
              </Label>
              <Input
                id="deathYear"
                value={formData.deathYear}
                onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                placeholder="e.g., 1890"
                className="h-11"
              />
            </div>
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-sm font-medium text-[#0E0F12]">
              Nationality
            </Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              placeholder="e.g., Dutch"
              className="h-11"
            />
          </div>

          {/* Portrait URL */}
          <div className="space-y-2">
            <Label htmlFor="portraitUrl" className="text-sm font-medium text-[#0E0F12]">
              Portrait Image URL
            </Label>
            <Input
              id="portraitUrl"
              value={formData.portraitUrl}
              onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
              placeholder="https://..."
              className="h-11"
            />
            {formData.portraitUrl && (
              <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-[#F6F7F9]">
                <img 
                  src={formData.portraitUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-[#0E0F12]">
              Biography
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief biography of the artist..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-[#0E0F12]">
              Tags (comma separated)
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., impressionism, landscape, portrait"
              className="h-11"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-[#4F5DFF] hover:bg-[#4F5DFF]/90"
            >
              {artist ? 'Save Changes' : 'Add Artist'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
