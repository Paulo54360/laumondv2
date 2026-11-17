/**
 * Easter egg « Parcours du curieux » : lire chaque page principale jusqu'en bas
 * puis saisir la phrase secrète dans la recherche affiche une vidéo cachée.
 */
export const EASTER_EGG = {
  /** ID de la vidéo YouTube */
  youtubeId: 'QCO6DOPGgf8',
  /** Phrase à saisir dans la barre de recherche une fois le parcours terminé */
  secret: 'Tout est regard',
  /** Part de la page à parcourir (0-1) pour la considérer comme lue */
  readThreshold: 0.85,
  /** Clé de stockage navigateur */
  storageKey: 'laumond-curious-path',
  /** Pages à lire : clé (chemin sans langue) + clé de traduction du libellé */
  pages: [
    { path: '/', labelKey: 'easter_egg.pages.home' },
    { path: '/biography', labelKey: 'easter_egg.pages.biography' },
    { path: '/metahism', labelKey: 'easter_egg.pages.metahism' },
    { path: '/artworks', labelKey: 'easter_egg.pages.artworks' },
    { path: '/analyses', labelKey: 'easter_egg.pages.analyses' },
    { path: '/le-grand-mikado-de-la-pensee-humaine', labelKey: 'easter_egg.pages.mikado' },
  ],
};

/** Retire le préfixe de langue (/en/biography -> /biography) */
export function normalizePath(path: string): string {
  const clean = path.replace(/^\/(fr|en)(?=\/|$)/, '').replace(/\/+$/, '');
  return clean || '/';
}

/** Normalise une saisie : minuscules, sans accents ni ponctuation */
export function normalizeSecret(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function isSecretPhrase(value: string): boolean {
  return normalizeSecret(value) === normalizeSecret(EASTER_EGG.secret);
}
