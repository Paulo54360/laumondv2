# Guide de déploiement FTP

## Option 1 : Hébergement avec Node.js (Recommandé)

Si votre hébergement OVH supporte Node.js :

### Fichiers à déployer via Cyberduck :

1. **Tout le dossier `.output/`** contenant :
   - `public/` - Fichiers statiques
   - `server/` - Code serveur Node.js (nécessaire pour les API)
   - `nitro.json` - Configuration Nitro

### Structure à déployer :
```
.output/
├── public/          ← Fichiers statiques
├── server/          ← Code serveur (API routes)
└── nitro.json       ← Configuration
```

### Commande de build :
```bash
npm run build
```

### Configuration serveur nécessaire :
- Node.js (version >= 20.18.0)
- Point d'entrée : `node .output/server/index.mjs`
- Variables d'environnement : `SUPABASE_URL`, `SUPABASE_KEY`

---

## Option 2 : Hébergement statique uniquement (sans API)

Si votre hébergement est uniquement statique (sans Node.js) :

⚠️ **Attention** : La recherche ne fonctionnera pas car elle nécessite les routes API.

### Fichiers à déployer via Cyberduck :

1. **Tout le contenu de `.output/public/`** uniquement

### Commande de build :
```bash
npm run generate
```

### Structure à déployer :
```
.output/public/
├── _nuxt/          ← Assets JS/CSS
├── fr/             ← Pages françaises
├── en/             ← Pages anglaises
├── index.html
└── ...
```

---

## Instructions pour Cyberduck :

### Pour Option 1 (avec Node.js) :
1. Connectez-vous via FTP/SFTP à votre serveur
2. Naviguez vers le dossier de votre application
3. Glissez-déposez **tout le dossier `.output/`** dans Cyberduck
4. Configurez votre serveur pour exécuter : `node .output/server/index.mjs`

### Pour Option 2 (statique) :
1. Connectez-vous via FTP/SFTP à votre serveur
2. Naviguez vers le dossier `www` ou `public_html`
3. Glissez-déposez **tout le contenu de `.output/public/`** dans Cyberduck

---

## Variables d'environnement

Si vous utilisez Option 1, configurez ces variables sur votre serveur :
- `SUPABASE_URL` - URL de votre projet Supabase
- `SUPABASE_KEY` - Clé API Supabase
- `NUXT_PUBLIC_API_URL` (optionnel) - URL S3 par défaut

---

## Vérification après déploiement

1. ✅ La page d'accueil charge
2. ✅ La recherche fonctionne (si Option 1)
3. ✅ Les images s'affichent correctement
4. ✅ Le changement de langue fonctionne

