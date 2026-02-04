/**
 * Composable public : récupère les textes éditoriaux (site_texts).
 * Utilisé par les pages Biographie, Métahisme, Accueil.
 * Fallback sur i18n si site_texts vide ou indisponible.
 */

export type SiteTextItem = {
  slug: string;
  contentFr: string | null;
  contentEn: string | null;
};

export function useSiteTexts(): {
  items: Ref<SiteTextItem[]>;
  fetchTexts: () => Promise<SiteTextItem[]>;
  getContent: (slug: string, locale: string) => string | null;
} {
  const items = useState<SiteTextItem[]>('siteTexts', () => []);

  async function fetchTexts(): Promise<SiteTextItem[]> {
    try {
      const data = await $fetch<SiteTextItem[] | SiteTextItem | null>('/api/site-texts');
      const list = Array.isArray(data) ? data : data ? [data] : [];
      items.value = list;
      return list;
    } catch {
      items.value = [];
      return [];
    }
  }

  function getContent(slug: string, locale: string): string | null {
    const item = items.value.find((i) => i.slug === slug);
    if (!item) return null;
    const content = locale === 'en' ? item.contentEn : item.contentFr;
    return content ?? (locale === 'en' ? item.contentFr : item.contentEn);
  }

  return { items, fetchTexts, getContent };
}
