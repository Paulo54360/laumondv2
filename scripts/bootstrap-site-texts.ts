/**
 * Script de bootstrap: importer les textes i18n existants dans site_texts.
 * À exécuter après les migrations 20260203000003 et 20260203000005.
 *
 * Usage:
 *   npx tsx scripts/bootstrap-site-texts.ts
 *   npx tsx scripts/bootstrap-site-texts.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

config();

const DRY_RUN = process.argv.includes('--dry-run');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requises dans .env'
  );
  process.exit(1);
}

type I18nNode = Record<string, string | I18nNode>;

function getNested(obj: I18nNode, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const p of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as I18nNode)[p];
  }
  return typeof current === 'string' ? current : undefined;
}

function buildBiographyContent(i18n: I18nNode): string {
  const sections: [string, string][] = [
    ['', 'intro_text'],
    ['experimentation_title', 'experimentation_text'],
    ['language_title', 'language_text'],
    ['meta_title', 'meta_text'],
    ['theorisation_title', 'theorisation_text'],
    ['paradigme_title', 'paradigme_text'],
    ['vision_title', 'vision_text'],
    ['creation_title', 'creation_text'],
    ['cerveau_title', 'cerveau_text'],
    ['holographique_title', 'holographique_text'],
  ];
  const parts: string[] = [];
  for (const [titleKey, textKey] of sections) {
    const title = titleKey ? getNested(i18n, `biography.${titleKey}`) : null;
    const text = textKey ? getNested(i18n, `biography.${textKey}`) : null;
    if (title) parts.push(`## ${title}\n\n`);
    if (text) parts.push(`${text}\n\n`);
  }
  return parts.join('').trim() || '';
}

function buildMetahismContent(i18n: I18nNode): string {
  return getNested(i18n, 'homepage.metahisme_text') ?? '';
}

function buildMetahismPageContent(i18n: I18nNode): string {
  const meta = i18n['MétaHisme'] as I18nNode | undefined;
  if (!meta || typeof meta !== 'object') return '';
  const keys = [
    'Texte', 'Texte2', 'Texte3', 'Texte4,1', 'Texte4,2', 'Texte4,3', 'Texte5',
    'Texte6,1', 'Texte6,2', 'Texte7', 'Texte8,1', 'Texte8,2', 'Texte8,3',
    'Texte9', 'Texte10,1', 'Texte10,2', 'Texte10,3', 'Texte11',
    'Texte12,1', 'Texte12,2', 'Texte12,3', 'Texte12,4', 'Texte12,5', 'Texte12,6',
    'Texte16', 'Texte13', 'Texte14', 'Footnote',
  ];
  const parts: string[] = [];
  for (const k of keys) {
    const v = meta[k];
    if (typeof v === 'string' && v.trim()) parts.push(v.trim());
  }
  return parts.join('\n\n');
}

function buildAnalysisFromKeys(
  i18n: I18nNode,
  prefix: string,
  textKeys: string[],
  authorKey?: string,
  footnoteKeys?: string[]
): string {
  const parts: string[] = [];
  for (const k of textKeys) {
    const v = getNested(i18n, `${prefix}.${k}`);
    if (typeof v === 'string' && v.trim()) parts.push(v.trim());
  }
  if (authorKey) {
    const author = getNested(i18n, `${prefix}.${authorKey}`);
    if (author) parts.push(`\n\n— ${author}`);
  }
  if (footnoteKeys?.length) {
    for (const k of footnoteKeys) {
      const fn = getNested(i18n, `${prefix}.${k}`);
      if (fn) parts.push(`\n\n${fn}`);
    }
  }
  return parts.join('\n\n');
}

async function main(): Promise<void> {
  console.log(DRY_RUN ? '🔍 Mode dry-run (simulation)' : '🚀 Bootstrap site_texts');

  const frPath = join(process.cwd(), 'i18n/locales/fr.json');
  const enPath = join(process.cwd(), 'i18n/locales/en.json');
  const fr = JSON.parse(readFileSync(frPath, 'utf-8')) as I18nNode;
  const en = JSON.parse(readFileSync(enPath, 'utf-8')) as I18nNode;

  const laecKeys = [
    'Texte1LAEC', 'Texte2LAEC', 'Texte3LAEC', 'Texte4LAEC', 'Texte5LAEC',
    'Texte6LAEC', 'Texte10LAEC', 'Texte12LAEC', 'Texte13LAEC', 'Texte14LAEC',
    'Texte15LAEC', 'Texte16LAEC', 'Texte17LAEC', 'Texte18LAEC', 'Texte19LAEC',
  ];
  const aqjaKeys = [
    'Texte1AQJA', 'Texte2AQJA', 'Texte3AQJA', 'Texte4AQJA', 'Texte5AQJA',
    'Texte6AQJA', 'Texte7AQJA', 'Texte8AQJA', 'Texte9AQJA', 'Texte10AQJA',
    'Texte11AQJA', 'Texte12AQJA', 'Texte13AQJA', 'Texte14AQJA', 'Texte15AQJA',
    'Texte16AQJA', 'Texte17AQJA', 'Texte18AQJA', 'Texte19AQJA', 'Texte20AQJA',
    'Texte21AQJA', 'Texte22AQJA', 'Texte23AQJA', 'Texte24AQJA', 'Texte25AQJA',
    'Texte26AQJA', 'Texte27AQJA', 'Texte28AQJA', 'Texte29AQJA', 'Texte30AQJA',
    'Texte31AQJA', 'Texte32AQJA', 'Texte33AQJA', 'Texte34AQJA',
  ];

  type Entry = { slug: string; category: string; content_fr: string; content_en: string };

  const entries: Entry[] = [
    // Biographie
    {
      slug: 'biography',
      category: 'biography',
      content_fr: buildBiographyContent(fr),
      content_en: buildBiographyContent(en),
    },
    // Métahisme
    {
      slug: 'metahism',
      category: 'metahism',
      content_fr: buildMetahismPageContent(fr),
      content_en: buildMetahismPageContent(en),
    },
    // Accueil
    {
      slug: 'homepage_biography',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.biography_text') ?? '',
      content_en: getNested(en, 'homepage.biography_text') ?? '',
    },
    {
      slug: 'homepage_metahism',
      category: 'homepage',
      content_fr: buildMetahismContent(fr),
      content_en: buildMetahismContent(en),
    },
    {
      slug: 'homepage_hero_title_top',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.hero_title_top') ?? '',
      content_en: getNested(en, 'homepage.hero_title_top') ?? '',
    },
    {
      slug: 'homepage_hero_title_bottom',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.hero_title_bottom') ?? '',
      content_en: getNested(en, 'homepage.hero_title_bottom') ?? '',
    },
    {
      slug: 'homepage_hero_descriptions',
      category: 'homepage',
      content_fr: [
        getNested(fr, 'homepage.hero_description_1'),
        getNested(fr, 'homepage.hero_description_2'),
        getNested(fr, 'homepage.hero_description_3'),
      ].filter(Boolean).join('\n'),
      content_en: [
        getNested(en, 'homepage.hero_description_1'),
        getNested(en, 'homepage.hero_description_2'),
        getNested(en, 'homepage.hero_description_3'),
      ].filter(Boolean).join('\n'),
    },
    {
      slug: 'homepage_biography_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.biography_title') ?? '',
      content_en: getNested(en, 'homepage.biography_title') ?? '',
    },
    {
      slug: 'homepage_portrait_caption',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.portrait_caption') ?? '',
      content_en: getNested(en, 'homepage.portrait_caption') ?? '',
    },
    {
      slug: 'homepage_read_biography',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.read_biography') ?? '',
      content_en: getNested(en, 'homepage.read_biography') ?? '',
    },
    {
      slug: 'homepage_metahism_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.metahisme_title') ?? '',
      content_en: getNested(en, 'homepage.metahisme_title') ?? '',
    },
    {
      slug: 'homepage_mobile_ouverture_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.mobile_ouverture_title') ?? '',
      content_en: getNested(en, 'homepage.mobile_ouverture_title') ?? '',
    },
    {
      slug: 'homepage_metahisme_artwork_caption',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.metahisme_artwork_caption') ?? '',
      content_en: getNested(en, 'homepage.metahisme_artwork_caption') ?? '',
    },
    {
      slug: 'homepage_discover_metahisme',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.discover_metahisme') ?? '',
      content_en: getNested(en, 'homepage.discover_metahisme') ?? '',
    },
    {
      slug: 'homepage_artworks_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artworks_title') ?? '',
      content_en: getNested(en, 'homepage.artworks_title') ?? '',
    },
    {
      slug: 'homepage_browse_artworks',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.browse_artworks') ?? '',
      content_en: getNested(en, 'homepage.browse_artworks') ?? '',
    },
    {
      slug: 'homepage_analyses_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.analyses_title') ?? '',
      content_en: getNested(en, 'homepage.analyses_title') ?? '',
    },
    {
      slug: 'homepage_read_analyses',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.read_analyses') ?? '',
      content_en: getNested(en, 'homepage.read_analyses') ?? '',
    },
    {
      slug: 'homepage_artwork_portant',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artwork_portant') ?? '',
      content_en: getNested(en, 'homepage.artwork_portant') ?? '',
    },
    {
      slug: 'homepage_artwork_portant_author',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artwork_portant_author') ?? '',
      content_en: getNested(en, 'homepage.artwork_portant_author') ?? '',
    },
    {
      slug: 'homepage_artwork_concordance',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artwork_concordance') ?? '',
      content_en: getNested(en, 'homepage.artwork_concordance') ?? '',
    },
    {
      slug: 'homepage_artwork_concordance_author',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artwork_concordance_author') ?? '',
      content_en: getNested(en, 'homepage.artwork_concordance_author') ?? '',
    },
    {
      slug: 'homepage_artwork_mobile',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artwork_mobile_ouverture') ?? '',
      content_en: getNested(en, 'homepage.artwork_mobile_ouverture') ?? '',
    },
    {
      slug: 'homepage_artwork_mobile_author',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.artwork_mobile_author') ?? '',
      content_en: getNested(en, 'homepage.artwork_mobile_author') ?? '',
    },
    {
      slug: 'homepage_analysis_portant_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.analysis_portant_title') ?? '',
      content_en: getNested(en, 'homepage.analysis_portant_title') ?? '',
    },
    {
      slug: 'homepage_analysis_portant_excerpt',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.analysis_portant_excerpt') ?? '',
      content_en: getNested(en, 'homepage.analysis_portant_excerpt') ?? '',
    },
    {
      slug: 'homepage_analysis_concordance_title',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.analysis_concordance_title') ?? '',
      content_en: getNested(en, 'homepage.analysis_concordance_title') ?? '',
    },
    {
      slug: 'homepage_analysis_concordance_excerpt',
      category: 'homepage',
      content_fr: getNested(fr, 'homepage.analysis_concordance_excerpt') ?? '',
      content_en: getNested(en, 'homepage.analysis_concordance_excerpt') ?? '',
    },
    // Analyses (articles complets)
    {
      slug: 'analysis_portant',
      category: 'analyses',
      content_fr: buildAnalysisFromKeys(fr, 'LAEC', laecKeys, 'AuteurLAEC'),
      content_en: buildAnalysisFromKeys(en, 'LAEC', laecKeys, 'AuteurLAEC'),
    },
    {
      slug: 'analysis_concordance',
      category: 'analyses',
      content_fr: buildAnalysisFromKeys(fr, 'CU', ['TexteCU'], 'AuteurCU'),
      content_en: buildAnalysisFromKeys(en, 'CU', ['TexteCU'], 'AuteurCU'),
    },
    {
      slug: 'analysis_aimants',
      category: 'analyses',
      content_fr: buildAnalysisFromKeys(fr, 'CDA', ['Texte1CDA', 'Texte2CDA', 'Texte3CDA'], 'AuteurCDA'),
      content_en: buildAnalysisFromKeys(en, 'CDA', ['Texte1CDA', 'Texte2CDA', 'Texte3CDA'], 'AuteurCDA'),
    },
    {
      slug: 'analysis_advienne',
      category: 'analyses',
      content_fr: buildAnalysisFromKeys(fr, 'AQJA', aqjaKeys, undefined, ['Legende1AQJA', 'Legende2AQJA']),
      content_en: buildAnalysisFromKeys(en, 'AQJA', aqjaKeys, undefined, ['Legende1AQJA', 'Legende2AQJA']),
    },
  ];

  if (DRY_RUN) {
    console.log('Entrées à créer (par catégorie):');
    const byCat = entries.reduce<Record<string, Entry[]>>((acc, e) => {
      (acc[e.category] ??= []).push(e);
      return acc;
    }, {});
    for (const [cat, items] of Object.entries(byCat)) {
      console.log(`\n  [${cat}]`);
      for (const e of items) {
        console.log(`    - ${e.slug}: FR ${e.content_fr?.length ?? 0} chars, EN ${e.content_en?.length ?? 0} chars`);
      }
    }
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  for (const entry of entries) {
    const payload: Record<string, unknown> = {
      slug: entry.slug,
      content_fr: entry.content_fr,
      content_en: entry.content_en,
    };
    const { error } = await supabase
      .from('site_texts')
      .upsert(payload, { onConflict: 'slug', ignoreDuplicates: false });
    if (error) {
      console.error(`❌ Erreur pour ${entry.slug}:`, error.message);
      process.exit(1);
    }
    console.log(`✅ ${entry.slug}`);
  }
  console.log('Bootstrap terminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
