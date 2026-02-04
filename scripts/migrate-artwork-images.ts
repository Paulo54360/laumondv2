/**
 * Script de migration: artworks.image_urls (JSON) → artwork_images (table)
 * À exécuter après les migrations SQL 20260203000001 et 20260203000002.
 *
 * Usage:
 *   npx tsx scripts/migrate-artwork-images.ts          # Exécution
 *   npx tsx scripts/migrate-artwork-images.ts --dry-run  # Simulation
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const DRY_RUN = process.argv.includes('--dry-run');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_KEY) requises dans .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function ensureArray(val: string | string[] | null | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter((u) => typeof u === 'string');
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((u): u is string => typeof u === 'string')
        : val.trim().startsWith('http')
          ? [val.trim()]
          : [];
    } catch {
      return val.trim().startsWith('http') ? [val.trim()] : [];
    }
  }
  return [];
}

function extractFilename(url: string): string {
  try {
    const u = new URL(url);
    const pathname = u.pathname || '';
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] ?? 'image.jpg';
  } catch {
    return 'image.jpg';
  }
}

async function main(): Promise<void> {
  console.log(DRY_RUN ? '🔍 Mode dry-run (simulation)' : '🚀 Migration artwork_images');
  console.log('');

  const { data: artworks, error: fetchError } = await supabase
    .from('artworks')
    .select('id, title, image_urls');

  if (fetchError) {
    console.error('❌ Erreur lecture artworks:', fetchError.message);
    process.exit(1);
  }

  const list = artworks ?? [];
  console.log(`📋 ${list.length} œuvres actives à traiter`);

  let inserted = 0;
  let skipped = 0;

  for (const artwork of list) {
    const urls = ensureArray(artwork.image_urls);
    if (urls.length === 0) {
      skipped++;
      continue;
    }

    if (!DRY_RUN) {
      const { data: existing } = await supabase
        .from('artwork_images')
        .select('id')
        .eq('artwork_id', artwork.id)
        .is('deleted_at', null)
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }
    }

    const rows = urls.map((url, idx) => ({
      artwork_id: artwork.id,
      url,
      filename: extractFilename(url),
      position: idx,
    }));

    if (DRY_RUN) {
      console.log(`  [dry-run] Artwork ${artwork.id} "${artwork.title}": ${rows.length} image(s)`);
      inserted += rows.length;
      continue;
    }

    const { error: insertError } = await supabase
      .from('artwork_images')
      .insert(rows);

    if (insertError) {
      console.error(`  ❌ Artwork ${artwork.id}:`, insertError.message);
    } else {
      inserted += rows.length;
      console.log(`  ✓ Artwork ${artwork.id} "${artwork.title}": ${rows.length} image(s)`);
    }
  }

  console.log('');
  console.log(`✅ Terminé: ${inserted} image(s) migrée(s), ${skipped} œuvre(s) ignorée(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
