/**
 * Œuvre telle que retournée par l'API /api/search (et utilisée par la recherche).
 */
export interface SearchArtwork {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string | null;
  descriptionEn: string | null;
  imageUrls: string[];
  folderPath: string | null;
  subcategory: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  categoryId: number | null;
  category: { id: number; name: string; path: string } | null;
}

export interface SearchResponse {
  artworks: SearchArtwork[];
}
