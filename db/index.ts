import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Création du client Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
)

// Configuration de la connexion PostgreSQL via Drizzle
const connectionString = process.env.DATABASE_URL || ''
const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// Helper pour la recherche d'œuvres
export async function searchArtworks(searchTerm: string) {
  const { data, error } = await supabase
    .from('artworks')
    .select(`
      *,
      categories (
        name,
        path
      )
    `)
    .ilike('title', `%${searchTerm}%`)

  if (error) throw error
  return data
} 