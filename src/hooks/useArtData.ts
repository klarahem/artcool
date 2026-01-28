import { useCallback } from 'react';
import type { Artist, Artwork, Moodboard, SavedList, UserProfile } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

// Sample initial data
const sampleArtists: Artist[] = [
  {
    id: '1',
    name: 'Katsushika Hokusai',
    birthYear: '1760',
    deathYear: '1849',
    nationality: 'Japanese',
    bio: 'Japanese ukiyo-e painter and printmaker, known for dramatic landscapes and meticulous detail. His work influenced many Western artists including the Impressionists.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Hokusai_portrait.jpg/440px-Hokusai_portrait.jpg',
    dateAdded: new Date().toISOString(),
    tags: ['ukiyo-e', 'landscape', 'printmaker'],
    artworks: [
      {
        id: 'art1',
        title: 'The Great Wave off Kanagawa',
        year: 'c. 1831',
        medium: 'Woodblock print',
        style: 'Ukiyo-e',
        movement: 'Edo period',
        era: '19th Century',
        genre: 'Landscape',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg',
        description: 'Perhaps the most recognizable work of Japanese art in the world.',
        rating: 5,
        tags: ['wave', 'mount fuji', 'ocean', 'landscape'],
        dateAdded: new Date().toISOString(),
        artistId: '1'
      },
      {
        id: 'art2',
        title: 'Red Fuji',
        year: 'c. 1831',
        medium: 'Woodblock print',
        style: 'Ukiyo-e',
        movement: 'Edo period',
        era: '19th Century',
        genre: 'Landscape',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Red_Fuji_southern_wind_clear_morning.jpg/1280px-Red_Fuji_southern_wind_clear_morning.jpg',
        tags: ['mount fuji', 'landscape'],
        dateAdded: new Date().toISOString(),
        artistId: '1'
      }
    ]
  },
  {
    id: '2',
    name: 'Vincent van Gogh',
    birthYear: '1853',
    deathYear: '1890',
    nationality: 'Dutch',
    bio: 'Dutch Post-Impressionist painter who posthumously became one of the most famous and influential figures in Western art history.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/440px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg',
    dateAdded: new Date().toISOString(),
    tags: ['post-impressionism', 'landscape', 'portrait'],
    artworks: [
      {
        id: 'art3',
        title: 'The Starry Night',
        year: 'June 1889',
        medium: 'Oil on canvas',
        style: 'Post-Impressionism',
        movement: 'Modernism',
        era: '19th Century',
        genre: 'Landscape',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        description: 'Painted from memory during his stay at the asylum.',
        rating: 5,
        tags: ['night', 'stars', 'swirls', 'landscape'],
        dateAdded: new Date().toISOString(),
        artistId: '2'
      },
      {
        id: 'art4',
        title: 'Sunflowers',
        year: '1888',
        medium: 'Oil on canvas',
        style: 'Post-Impressionism',
        movement: 'Modernism',
        era: '19th Century',
        genre: 'Still life',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg',
        tags: ['flowers', 'yellow', 'still life'],
        dateAdded: new Date().toISOString(),
        artistId: '2'
      }
    ]
  },
  {
    id: '3',
    name: 'Frida Kahlo',
    birthYear: '1907',
    deathYear: '1954',
    nationality: 'Mexican',
    bio: 'Mexican painter whose work fused surrealism with personal symbolism, exploring identity, pain, and the human form.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/440px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg',
    dateAdded: new Date().toISOString(),
    tags: ['surrealism', 'portrait', 'symbolism'],
    artworks: [
      {
        id: 'art5',
        title: 'The Two Fridas',
        year: '1939',
        medium: 'Oil on canvas',
        style: 'Surrealism',
        movement: 'Modernism',
        era: '20th Century',
        genre: 'Portrait',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Frida_Kahlo_%281939%29_-_Las_Dos_Fridas.jpg/1280px-Frida_Kahlo_%281939%29_-_Las_Dos_Fridas.jpg',
        description: 'A double self-portrait representing her dual heritage.',
        rating: 5,
        tags: ['self-portrait', 'identity', 'heart'],
        dateAdded: new Date().toISOString(),
        artistId: '3'
      },
      {
        id: 'art6',
        title: 'Self-Portrait with Thorn Necklace',
        year: '1940',
        medium: 'Oil on canvas',
        style: 'Surrealism',
        movement: 'Modernism',
        era: '20th Century',
        genre: 'Portrait',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Frida_Kahlo_%281940%29_-_Self-Portrait_with_Thorn_Necklace_and_Hummingbird.jpg/800px-Frida_Kahlo_%281940%29_-_Self-Portrait_with_Thorn_Necklace_and_Hummingbird.jpg',
        tags: ['self-portrait', 'pain', 'nature'],
        dateAdded: new Date().toISOString(),
        artistId: '3'
      }
    ]
  },
  {
    id: '4',
    name: 'Caspar David Friedrich',
    birthYear: '1774',
    deathYear: '1840',
    nationality: 'German',
    bio: 'German Romantic landscape painter, generally considered the most important German artist of his generation.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Caspar_David_Friedrich_-_Selbstbildnis_mit_Staffelei.jpg/440px-Caspar_David_Friedrich_-_Selbstbildnis_mit_Staffelei.jpg',
    dateAdded: new Date().toISOString(),
    tags: ['romanticism', 'landscape', 'symbolism'],
    artworks: [
      {
        id: 'art7',
        title: 'Wanderer above the Sea of Fog',
        year: 'c. 1818',
        medium: 'Oil on canvas',
        style: 'Romanticism',
        movement: 'Romanticism',
        era: '19th Century',
        genre: 'Landscape',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog_-_Google_Art_Project.jpg/800px-Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog_-_Google_Art_Project.jpg',
        description: 'An iconic image of Romanticism, representing self-reflection.',
        tags: ['fog', 'mountains', 'contemplation', 'sublime'],
        rating: 5,
        dateAdded: new Date().toISOString(),
        artistId: '4'
      }
    ]
  },
  {
    id: '5',
    name: 'Hieronymus Bosch',
    birthYear: 'c. 1450',
    deathYear: '1516',
    nationality: 'Dutch',
    bio: 'Dutch/Netherlandish painter from Brabant. He is one of the most notable representatives of the Early Netherlandish painting school.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Hieronymus_Bosch_-_Self-portrait_%28cropped%29.jpg/440px-Hieronymus_Bosch_-_Self-portrait_%28cropped%29.jpg',
    dateAdded: new Date().toISOString(),
    tags: ['renaissance', 'surrealism', 'religious'],
    artworks: [
      {
        id: 'art8',
        title: 'The Garden of Earthly Delights',
        year: 'c. 1490–1510',
        medium: 'Oil on oak panels',
        style: 'Early Netherlandish',
        movement: 'Northern Renaissance',
        era: '15th-16th Century',
        genre: 'Religious',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Hieronymus_Bosch_-_The_Garden_of_Earthly_Delights_-_Google_Art_Project.jpg/1280px-Hieronymus_Bosch_-_The_Garden_of_Earthly_Delights_-_Google_Art_Project.jpg',
        description: 'A triptych representing paradise, earthly pleasures, and hell.',
        tags: ['triptych', 'fantasy', 'religious', 'hell'],
        rating: 5,
        dateAdded: new Date().toISOString(),
        artistId: '5'
      }
    ]
  },
  {
    id: '6',
    name: 'Johannes Vermeer',
    birthYear: '1632',
    deathYear: '1675',
    nationality: 'Dutch',
    bio: 'Dutch Baroque Period painter who specialized in domestic interior scenes of middle-class life.',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jan_Vermeer_van_Delft_002.jpg/440px-Jan_Vermeer_van_Delft_002.jpg',
    dateAdded: new Date().toISOString(),
    tags: ['baroque', 'portrait', 'interior'],
    artworks: [
      {
        id: 'art9',
        title: 'Girl with a Pearl Earring',
        year: 'c. 1665',
        medium: 'Oil on canvas',
        style: 'Baroque',
        movement: 'Dutch Golden Age',
        era: '17th Century',
        genre: 'Portrait',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
        description: 'Often referred to as the "Mona Lisa of the North".',
        tags: ['portrait', 'pearl', 'mystery', 'tronie'],
        rating: 5,
        dateAdded: new Date().toISOString(),
        artistId: '6'
      }
    ]
  }
];

const defaultProfile: UserProfile = {
  name: 'Art Collector',
  pinnedArtworkIds: [],
  favoriteArtworkIds: []
};

export function useArtData() {
  const [artists, setArtists] = useLocalStorage<Artist[]>('artvault-artists', sampleArtists);
  const [moodboards, setMoodboards] = useLocalStorage<Moodboard[]>('artvault-moodboards', []);
  const [savedLists, setSavedLists] = useLocalStorage<SavedList[]>('artvault-savedlists', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('artvault-profile', defaultProfile);

  // Get all artworks with their artists
  const getAllArtworks = useCallback(() => {
    return artists.flatMap(artist => 
      artist.artworks.map(artwork => ({ artwork, artist }))
    );
  }, [artists]);

  // Get favorite artworks
  const getFavoriteArtworks = useCallback(() => {
    const allArtworks = getAllArtworks();
    return allArtworks.filter(({ artwork }) => 
      profile.favoriteArtworkIds.includes(artwork.id)
    );
  }, [getAllArtworks, profile.favoriteArtworkIds]);

  // Get pinned artworks
  const getPinnedArtworks = useCallback(() => {
    const allArtworks = getAllArtworks();
    return profile.pinnedArtworkIds
      .map(id => allArtworks.find(({ artwork }) => artwork.id === id))
      .filter((item): item is { artwork: Artwork; artist: Artist } => item !== undefined);
  }, [getAllArtworks, profile.pinnedArtworkIds]);

  // Toggle favorite
  const toggleFavorite = useCallback((artworkId: string) => {
    setProfile(prev => {
      const isFavorite = prev.favoriteArtworkIds.includes(artworkId);
      return {
        ...prev,
        favoriteArtworkIds: isFavorite
          ? prev.favoriteArtworkIds.filter(id => id !== artworkId)
          : [...prev.favoriteArtworkIds, artworkId]
      };
    });
  }, [setProfile]);

  // Check if artwork is favorite
  const isFavorite = useCallback((artworkId: string) => {
    return profile.favoriteArtworkIds.includes(artworkId);
  }, [profile.favoriteArtworkIds]);

  // Pin artwork
  const pinArtwork = useCallback((artworkId: string) => {
    setProfile(prev => {
      if (prev.pinnedArtworkIds.includes(artworkId)) return prev;
      return {
        ...prev,
        pinnedArtworkIds: [...prev.pinnedArtworkIds, artworkId]
      };
    });
  }, [setProfile]);

  // Unpin artwork
  const unpinArtwork = useCallback((artworkId: string) => {
    setProfile(prev => ({
      ...prev,
      pinnedArtworkIds: prev.pinnedArtworkIds.filter(id => id !== artworkId)
    }));
  }, [setProfile]);

  // Check if artwork is pinned
  const isPinned = useCallback((artworkId: string) => {
    return profile.pinnedArtworkIds.includes(artworkId);
  }, [profile.pinnedArtworkIds]);

  // Update profile
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, [setProfile]);

  // Artist operations
  const addArtist = useCallback((artistData: Omit<Artist, 'id' | 'dateAdded' | 'artworks'>) => {
    const newArtist: Artist = {
      ...artistData,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
      artworks: []
    };
    setArtists(prev => [newArtist, ...prev]);
    return newArtist.id;
  }, [setArtists]);

  const updateArtist = useCallback((id: string, updates: Partial<Artist>) => {
    setArtists(prev => prev.map(artist => 
      artist.id === id ? { ...artist, ...updates } : artist
    ));
  }, [setArtists]);

  const deleteArtist = useCallback((id: string) => {
    setArtists(prev => prev.filter(artist => artist.id !== id));
  }, [setArtists]);

  const getArtistById = useCallback((id: string) => {
    return artists.find(artist => artist.id === id);
  }, [artists]);

  // Artwork operations
  const addArtwork = useCallback((artistId: string, artworkData: Omit<Artwork, 'id' | 'dateAdded' | 'artistId'>) => {
    const newArtwork: Artwork = {
      ...artworkData,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
      artistId
    };
    setArtists(prev => prev.map(artist => 
      artist.id === artistId 
        ? { ...artist, artworks: [newArtwork, ...artist.artworks] }
        : artist
    ));
    return newArtwork.id;
  }, [setArtists]);

  const updateArtwork = useCallback((artistId: string, artworkId: string, updates: Partial<Artwork>) => {
    setArtists(prev => prev.map(artist => 
      artist.id === artistId 
        ? { 
            ...artist, 
            artworks: artist.artworks.map(artwork => 
              artwork.id === artworkId ? { ...artwork, ...updates } : artwork
            )
          }
        : artist
    ));
  }, [setArtists]);

  const deleteArtwork = useCallback((artistId: string, artworkId: string) => {
    setArtists(prev => prev.map(artist => 
      artist.id === artistId 
        ? { ...artist, artworks: artist.artworks.filter(artwork => artwork.id !== artworkId) }
        : artist
    ));
    // Also remove from favorites and pinned if present
    setProfile(prev => ({
      ...prev,
      favoriteArtworkIds: prev.favoriteArtworkIds.filter(id => id !== artworkId),
      pinnedArtworkIds: prev.pinnedArtworkIds.filter(id => id !== artworkId)
    }));
  }, [setArtists, setProfile]);

  const getArtworkById = useCallback((artworkId: string) => {
    for (const artist of artists) {
      const artwork = artist.artworks.find(a => a.id === artworkId);
      if (artwork) return { artwork, artist };
    }
    return null;
  }, [artists]);

  // Search and filter
  const searchArtists = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return artists.filter(artist => 
      artist.name.toLowerCase().includes(lowerQuery) ||
      artist.nationality?.toLowerCase().includes(lowerQuery) ||
      artist.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [artists]);

  const searchArtworks = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return getAllArtworks().filter(({ artwork }) => 
      artwork.title.toLowerCase().includes(lowerQuery) ||
      artwork.medium.toLowerCase().includes(lowerQuery) ||
      artwork.style?.toLowerCase().includes(lowerQuery) ||
      artwork.movement?.toLowerCase().includes(lowerQuery) ||
      artwork.era?.toLowerCase().includes(lowerQuery) ||
      artwork.genre?.toLowerCase().includes(lowerQuery) ||
      artwork.description?.toLowerCase().includes(lowerQuery) ||
      artwork.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [getAllArtworks]);

  // Moodboard operations
  const addMoodboard = useCallback((name: string, description?: string) => {
    const newMoodboard: Moodboard = {
      id: uuidv4(),
      name,
      description,
      artworkIds: [],
      dateCreated: new Date().toISOString()
    };
    setMoodboards(prev => [newMoodboard, ...prev]);
    return newMoodboard.id;
  }, [setMoodboards]);

  const updateMoodboard = useCallback((id: string, updates: Partial<Moodboard>) => {
    setMoodboards(prev => prev.map(mb => 
      mb.id === id ? { ...mb, ...updates } : mb
    ));
  }, [setMoodboards]);

  const addToMoodboard = useCallback((moodboardId: string, artworkId: string) => {
    setMoodboards(prev => prev.map(mb => 
      mb.id === moodboardId && !mb.artworkIds.includes(artworkId)
        ? { ...mb, artworkIds: [...mb.artworkIds, artworkId] }
        : mb
    ));
  }, [setMoodboards]);

  const removeFromMoodboard = useCallback((moodboardId: string, artworkId: string) => {
    setMoodboards(prev => prev.map(mb => 
      mb.id === moodboardId 
        ? { ...mb, artworkIds: mb.artworkIds.filter(id => id !== artworkId) }
        : mb
    ));
  }, [setMoodboards]);

  const deleteMoodboard = useCallback((id: string) => {
    setMoodboards(prev => prev.filter(mb => mb.id !== id));
  }, [setMoodboards]);

  const getMoodboardArtworks = useCallback((moodboardId: string) => {
    const moodboard = moodboards.find(mb => mb.id === moodboardId);
    if (!moodboard) return [];
    
    const allArtworks = getAllArtworks();
    return moodboard.artworkIds
      .map(id => allArtworks.find(({ artwork }) => artwork.id === id))
      .filter((item): item is { artwork: Artwork; artist: Artist } => item !== undefined);
  }, [moodboards, getAllArtworks]);

  // Saved List operations
  const addSavedList = useCallback((name: string) => {
    const newList: SavedList = {
      id: uuidv4(),
      name,
      artworkIds: [],
      dateCreated: new Date().toISOString()
    };
    setSavedLists(prev => [newList, ...prev]);
    return newList.id;
  }, [setSavedLists]);

  const addToSavedList = useCallback((listId: string, artworkId: string) => {
    setSavedLists(prev => prev.map(list => 
      list.id === listId && !list.artworkIds.includes(artworkId)
        ? { ...list, artworkIds: [...list.artworkIds, artworkId] }
        : list
    ));
  }, [setSavedLists]);

  const removeFromSavedList = useCallback((listId: string, artworkId: string) => {
    setSavedLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, artworkIds: list.artworkIds.filter(id => id !== artworkId) }
        : list
    ));
  }, [setSavedLists]);

  const deleteSavedList = useCallback((id: string) => {
    setSavedLists(prev => prev.filter(list => list.id !== id));
  }, [setSavedLists]);

  return {
    artists,
    moodboards,
    savedLists,
    profile,
    getAllArtworks,
    getFavoriteArtworks,
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
    getArtistById,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    getArtworkById,
    searchArtists,
    searchArtworks,
    addMoodboard,
    updateMoodboard,
    addToMoodboard,
    removeFromMoodboard,
    deleteMoodboard,
    getMoodboardArtworks,
    addSavedList,
    addToSavedList,
    removeFromSavedList,
    deleteSavedList
  };
}
