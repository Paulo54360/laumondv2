/**
 * Helpers pour afficher le titre et la description d'une œuvre selon la locale.
 */

export interface ILocalizedArtwork {
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

export function getLocalizedTitle(artwork: ILocalizedArtwork, locale: string): string {
  if (locale === 'en' && artwork.titleEn?.trim()) {
    return artwork.titleEn.trim();
  }
  return (artwork.titleFr ?? artwork.titleEn ?? '').trim() || '';
}

export function getLocalizedDescription(artwork: ILocalizedArtwork, locale: string): string {
  if (locale === 'en' && artwork.descriptionEn?.trim()) {
    return artwork.descriptionEn.trim();
  }
  return (artwork.descriptionFr ?? artwork.descriptionEn ?? '').trim() || '';
}
