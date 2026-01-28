import { useState, useEffect } from 'react';
import { Star, Plus, X } from 'lucide-react';
import type { Artwork } from '@/types';
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

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artwork: Omit<Artwork, 'id' | 'dateAdded' | 'artistId'>) => void;
  artwork?: Artwork | null;
}

export function ArtworkModal({ isOpen, onClose, onSave, artwork }: ArtworkModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    medium: '',
    style: '',
    movement: '',
    era: '',
    genre: '',
    imageUrl: '',
    description: '',
    rating: 0,
    tags: [] as string[],
    newTag: ''
  });

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title,
        year: artwork.year,
        medium: artwork.medium,
        style: artwork.style || '',
        movement: artwork.movement || '',
        era: artwork.era || '',
        genre: artwork.genre || '',
        imageUrl: artwork.imageUrl,
        description: artwork.description || '',
        rating: artwork.rating || 0,
        tags: artwork.tags || [],
        newTag: ''
      });
    } else {
      setFormData({
        title: '',
        year: '',
        medium: '',
        style: '',
        movement: '',
        era: '',
        genre: '',
        imageUrl: '',
        description: '',
        rating: 0,
        tags: [],
        newTag: ''
      });
    }
  }, [artwork, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      year: formData.year,
      medium: formData.medium,
      style: formData.style || undefined,
      movement: formData.movement || undefined,
      era: formData.era || undefined,
      genre: formData.genre || undefined,
      imageUrl: formData.imageUrl,
      description: formData.description || undefined,
      rating: formData.rating || undefined,
      tags: formData.tags
    });
    onClose();
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Sora'] text-2xl font-semibold">
            {artwork ? 'Edit Artwork' : 'Add New Artwork'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-[#0E0F12]">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., The Starry Night"
              required
              className="h-11"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium text-[#0E0F12]">
              Image URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              required
              className="h-11"
            />
            {formData.imageUrl && (
              <div className="mt-2 w-full h-48 rounded-lg overflow-hidden bg-[#F6F7F9]">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Year and Medium */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium text-[#0E0F12]">
                Year
              </Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 1889"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium" className="text-sm font-medium text-[#0E0F12]">
                Medium
              </Label>
              <Input
                id="medium"
                value={formData.medium}
                onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                placeholder="e.g., Oil on canvas"
                className="h-11"
              />
            </div>
          </div>

          {/* Style, Movement, Era, Genre */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style" className="text-sm font-medium text-[#0E0F12]">
                Style
              </Label>
              <Input
                id="style"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="e.g., Post-Impressionism"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="movement" className="text-sm font-medium text-[#0E0F12]">
                Movement
              </Label>
              <Input
                id="movement"
                value={formData.movement}
                onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                placeholder="e.g., Modernism"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="era" className="text-sm font-medium text-[#0E0F12]">
                Era
              </Label>
              <Input
                id="era"
                value={formData.era}
                onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                placeholder="e.g., 19th Century"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-sm font-medium text-[#0E0F12]">
                Genre
              </Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="e.g., Landscape"
                className="h-11"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#0E0F12]">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                value={formData.newTag}
                onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                placeholder="Add a tag..."
                className="h-11"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="h-11 px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4F5DFF]/10 text-[#4F5DFF] text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-[#0E0F12]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-[#0E0F12]">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description or notes about the artwork..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#0E0F12]">
              Rating
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`h-6 w-6 ${star <= formData.rating ? 'fill-[#4F5DFF] text-[#4F5DFF]' : 'text-[#6B6F7A]/30'}`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: 0 })}
                  className="ml-2 text-sm text-[#6B6F7A] hover:text-[#0E0F12]"
                >
                  Clear
                </button>
              )}
            </div>
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
              {artwork ? 'Save Changes' : 'Add Artwork'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
