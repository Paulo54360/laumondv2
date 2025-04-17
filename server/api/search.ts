import { createClient } from '@supabase/supabase-js'

// Fonction de gestion de la recherche
export default defineEventHandler(async (event) => {
  try {
    // Récupération du terme de recherche
    const query = getQuery(event)
    const searchTerm = query.q ? String(query.q) : ''
    
    // Initialisation du client Supabase
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Erreur de configuration Supabase')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Recherche dans la base de données
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        categories (
          name,
          path
        )
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(20)
    
    if (error) throw error
    
    // Retour des résultats
    return {
      artworks: data || []
    }
    
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    
    // En cas d'erreur, on renvoie un code d'erreur et un message
    return createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la recherche',
      data: error
    })
  }
}) 