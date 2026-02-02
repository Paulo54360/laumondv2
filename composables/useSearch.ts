import type { SearchArtwork, SearchResponse } from '~/types/artwork';

/**
 * Composable centralisant l'appel à l'API de recherche d'œuvres.
 * Utilisé par SearchBar, pages/search.vue, etc.
 */
export function useSearch(): {
  searchArtworks: (q: string) => Promise<SearchArtwork[]>;
} {
  const searchArtworks = async (q: string): Promise<SearchArtwork[]> => {
    if (!q?.trim()) return [];
    const res = await $fetch<SearchResponse>('/api/search', {
      params: { q: q.trim() },
    });
    return res?.artworks ?? [];
  };

  return { searchArtworks };
}
