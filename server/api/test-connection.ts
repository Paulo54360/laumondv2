import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Récupération des variables d'environnement
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_KEY
    
    // Liste de toutes les variables d'environnement commençant par SUPABASE ou liées à la base de données
    const envKeys = Object.keys(process.env).filter(key => 
      key.includes('SUPABASE') || 
      key.includes('DATABASE') || 
      key.includes('URL')
    );
    
    // Informations de diagnostic
    const diagnostics = {
      env: {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseKey,
        nodeEnv: process.env.NODE_ENV,
        currentTime: new Date().toISOString(),
        // Liste des clés d'environnement pertinentes
        relevantEnvKeys: envKeys,
        // Valeurs tronquées pour la sécurité
        supabaseUrlValue: supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : null,
        supabaseKeyValue: supabaseKey ? `${supabaseKey.substring(0, 10)}...` : null
      },
      connectionTest: null,
      error: null
    }
    
    // Tester la connexion à Supabase si les variables sont définies
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // Tester une requête simple
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .limit(1)
        
        if (error) throw error
        
        diagnostics.connectionTest = {
          success: true,
          data: data
        }
      } catch (connError) {
        diagnostics.connectionTest = {
          success: false
        }
        diagnostics.error = {
          message: connError.message,
          stack: process.env.NODE_ENV === 'development' ? connError.stack : null
        }
      }
    }
    
    return diagnostics
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : null
      }
    }
  }
}) 