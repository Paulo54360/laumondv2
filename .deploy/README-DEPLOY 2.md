# Instructions de déploiement

## Fichiers déployés
Déployez tout le contenu du dossier 'output/' sur votre serveur.

## Configuration serveur

### Point d'entrée
`node output/server/index.mjs`

### Variables d'environnement nécessaires
- SUPABASE_URL
- SUPABASE_KEY

### Package.json pour PM2 ou autre process manager
{
  "name": "laumond-nuxt",
  "scripts": {
    "start": "node output/server/index.mjs"
  }
}

## Vérification
Une fois déployé, vérifiez que :
- ✅ La page d'accueil charge
- ✅ La recherche fonctionne (/api/search)
- ✅ Les images s'affichent
