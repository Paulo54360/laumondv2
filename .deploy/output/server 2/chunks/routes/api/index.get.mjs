import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const S3_BASE_URL = "https://plaumondpicture.s3.eu-west-3.amazonaws.com";
const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchTerm = query.q;
    if (!searchTerm) {
      return { artworks: [] };
    }
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Erreur de configuration Supabase");
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const searchPattern = `%${searchTerm.trim()}%`;
    console.log(`\u{1F50D} Recherche pour: "${searchTerm}" (pattern: "${searchPattern}")`);
    const selectFields = `
      id,
      title,
      description,
      image_urls,
      folder_path,
      subcategory,
      created_at,
      updated_at,
      category_id,
      categories (
        id,
        name,
        path
      )
    `;
    const { data: byTitle, error: errorTitle } = await supabase.from("artworks").select(selectFields).ilike("title", searchPattern).limit(200);
    if (errorTitle) {
      console.error("\u274C Erreur recherche title:", errorTitle);
    }
    const { data: byDescription, error: errorDescription } = await supabase.from("artworks").select(selectFields).not("description", "is", null).ilike("description", searchPattern).limit(200);
    if (errorDescription) {
      console.error("\u274C Erreur recherche description:", errorDescription);
    }
    const { data: bySubcategory, error: errorSubcategory } = await supabase.from("artworks").select(selectFields).not("subcategory", "is", null).ilike("subcategory", searchPattern).limit(200);
    if (errorSubcategory) {
      console.error("\u274C Erreur recherche subcategory:", errorSubcategory);
    }
    const { data: matchingCategories, error: categoriesError } = await supabase.from("categories").select("id").ilike("name", searchPattern).limit(50);
    let byCategory = [];
    if (!categoriesError && matchingCategories && matchingCategories.length > 0) {
      const categoryIds = matchingCategories.map((cat) => cat.id);
      const { data: artworksByCategory, error: categoryArtworksError } = await supabase.from("artworks").select(selectFields).in("category_id", categoryIds).limit(200);
      if (!categoryArtworksError && artworksByCategory) {
        byCategory = artworksByCategory;
      } else if (categoryArtworksError) {
        console.error("\u274C Erreur recherche par category:", categoryArtworksError);
      }
    }
    const allResults = [
      ...byTitle || [],
      ...byDescription || [],
      ...bySubcategory || [],
      ...byCategory || []
    ];
    const uniqueArtworksMap = /* @__PURE__ */ new Map();
    allResults.forEach((artwork) => {
      if (artwork && artwork.id) {
        uniqueArtworksMap.set(artwork.id, artwork);
      }
    });
    const artworks = Array.from(uniqueArtworksMap.values()).sort(
      (a, b) => (a.title || "").localeCompare(b.title || "", void 0, { sensitivity: "base" })
    );
    console.log(`\u2705 Recherche "${searchTerm}": ${artworks.length} r\xE9sultats totaux`);
    console.log(`   - Title: ${(byTitle == null ? void 0 : byTitle.length) || 0}, Description: ${(byDescription == null ? void 0 : byDescription.length) || 0}, Subcategory: ${(bySubcategory == null ? void 0 : bySubcategory.length) || 0}, Category: ${byCategory.length}`);
    const hasCriticalError = errorTitle || errorDescription || errorSubcategory || categoriesError;
    if (hasCriticalError && artworks.length === 0) {
      console.error("\u274C Erreurs de recherche:", {
        title: errorTitle,
        description: errorDescription,
        subcategory: errorSubcategory,
        categories: categoriesError
      });
    }
    const formattedArtworks = (artworks || []).map((artwork) => {
      let urls = [];
      try {
        if (artwork.image_urls) {
          if (typeof artwork.image_urls === "string") {
            if (artwork.image_urls.startsWith("[") && artwork.image_urls.endsWith("]")) {
              urls = JSON.parse(artwork.image_urls);
            } else if (artwork.image_urls.trim().startsWith("http")) {
              urls = [artwork.image_urls.trim()];
            }
          } else if (Array.isArray(artwork.image_urls)) {
            urls = artwork.image_urls;
          }
        }
      } catch (e) {
        console.error("Erreur de parsing des URLs pour l'artwork", artwork.id, ":", e);
        urls = [];
      }
      if (urls.length === 0 && typeof artwork.image_urls === "string" && artwork.image_urls.includes('["https://')) {
        try {
          const match = artwork.image_urls.match(/"(https:\/\/[^"]+)"/);
          if (match && match[1]) {
            urls = [match[1]];
          }
        } catch (e) {
          console.error("Erreur lors de l'extraction de l'URL:", e);
        }
      }
      urls = urls.filter((url) => typeof url === "string" && url.trim().startsWith("http"));
      if (urls.length === 0 && artwork.folder_path && artwork.subcategory) {
        urls = [`${S3_BASE_URL}/${artwork.folder_path}/01.jpg`];
      }
      return {
        id: artwork.id,
        title: artwork.title,
        description: artwork.description,
        imageUrls: urls,
        folderPath: artwork.folder_path,
        subcategory: artwork.subcategory,
        createdAt: artwork.created_at,
        updatedAt: artwork.updated_at,
        categoryId: artwork.category_id,
        // Renommer la propriété categories en category pour compatibilité
        category: artwork.categories
      };
    }) || [];
    return {
      artworks: formattedArtworks
    };
  } catch (error) {
    console.error("Erreur de recherche:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la recherche"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
