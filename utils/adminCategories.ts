export type RawCategoryRow = {
  id: number;
  name: string;
  path: string | null;
};

type CanonicalEntry = {
  key: 'archetypes' | 'deployments' | 'drawings' | 'transcriptions';
  label: string;
  path: string;
};

const CANONICAL: CanonicalEntry[] = [
  { key: 'archetypes', label: 'Archetypes', path: 'Archetypes' },
  { key: 'deployments', label: 'Deployments', path: 'Deployments' },
  { key: 'drawings', label: 'Drawings', path: 'Drawings+' },
  { key: 'transcriptions', label: 'Transcriptions', path: 'Transcriptions' },
];

const VARIANTS = new Map<string, CanonicalEntry['key']>([
  ['archetypes', 'archetypes'],
  ['archetype', 'archetypes'],
  ['deployments', 'deployments'],
  ['deploiement', 'deployments'],
  ['deploiements', 'deployments'],
  ['dessin', 'drawings'],
  ['drawings', 'drawings'],
  ['drawings+', 'drawings'],
  ['drawing', 'drawings'],
  ['transcriptions', 'transcriptions'],
  ['transcription', 'transcriptions'],
]);

const normalize = (value?: string | null): string =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/^images\//, '')
    .replace(/\s+/g, '');

/**
 * Map Supabase categories to the canonical list used dans l'admin.
 */
export function mapCategoriesToCanonical(
  rows: RawCategoryRow[]
): Array<{ id: number; name: string }> {
  const candidates = new Map<CanonicalEntry['key'], { row: RawCategoryRow; score: number }>();

  for (const row of rows ?? []) {
    const normalized = normalize(row.path || row.name);
    const key = VARIANTS.get(normalized);
    if (!key) continue;

    const canonicalEntry = CANONICAL.find((entry) => entry.key === key);
    const pathMatch =
      canonicalEntry && normalize(row.path) === normalize(canonicalEntry.path) ? 2 : 0;
    const nameMatch =
      canonicalEntry && normalize(row.name) === normalize(canonicalEntry.label) ? 1 : 0;
    const score = pathMatch + nameMatch;

    const existing = candidates.get(key);
    if (!existing || score > existing.score) {
      candidates.set(key, { row, score });
    }
  }

  return CANONICAL.map((entry) => {
    const candidate = candidates.get(entry.key)?.row;
    return candidate ? { id: candidate.id, name: entry.label } : null;
  }).filter((entry): entry is { id: number; name: string } => entry !== null);
}
