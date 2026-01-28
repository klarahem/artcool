export interface Artwork {
  id: string;
  title: string;
  year: string;
  medium: string;
  style?: string;
  movement?: string;
  era?: string;
  genre?: string;
  imageUrl: string;
  description?: string;
  rating?: number;
  tags: string[];
  dateAdded: string;
  artistId: string;
}

export interface Artist {
  id: string;
  name: string;
  birthYear?: string;
  deathYear?: string;
  nationality?: string;
  bio?: string;
  portraitUrl?: string;
  artworks: Artwork[];
  dateAdded: string;
  tags: string[];
}

export interface Moodboard {
  id: string;
  name: string;
  description?: string;
  artworkIds: string[];
  dateCreated: string;
}

export interface SavedList {
  id: string;
  name: string;
  artworkIds: string[];
  dateCreated: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  pinnedArtworkIds: string[];
  favoriteArtworkIds: string[];
}
