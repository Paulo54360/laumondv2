# 📤 Instructions de déploiement via Cyberduck

## ✅ Fichiers prêts !

Tous les fichiers nécessaires sont dans le dossier `.deploy/output/`

## 🚀 Étapes rapides

### 1. Ouvrir Cyberduck
- Lancez Cyberduck sur votre Mac

### 2. Se connecter au serveur OVH
- Cliquez sur "Nouvelle connexion"
- Type : **FTP** ou **SFTP** (selon votre configuration OVH)
- Serveur : `ftp.votre-domaine.com` (ou l'adresse FTP fournie par OVH)
- Nom d'utilisateur : Votre identifiant OVH
- Mot de passe : Votre mot de passe FTP
- Port : 21 (FTP) ou 22 (SFTP)
- Cliquez sur "Se connecter"

### 3. Naviguer vers le dossier de votre application
- Naviguez jusqu'au dossier où vous voulez déployer (ex: `www/`, `app/`, `htdocs/`)

### 4. Upload des fichiers
- Ouvrez un Finder
- Naviguez vers : `/Users/paulo/Documents/Projet perso/LaumondV2/laumond-nuxt/.deploy/output/`
- **Sélectionnez TOUT le contenu** du dossier `output/` (les 3 dossiers + fichiers)
- Glissez-déposez dans Cyberduck

⚠️ **Important** : Déployez le **contenu** de `output/`, pas le dossier `output/` lui-même.

La structure sur le serveur doit être :
```
votre-serveur/
├── public/
├── server/
│   ├── node_modules/
│   ├── chunks/
│   ├── index.mjs
│   └── package.json
└── nitro.json
```

### 5. Configuration des variables d'environnement

Une fois les fichiers uploadés, connectez-vous en SSH à votre serveur OVH et :

1. Créez un fichier `.env` à la racine de votre application :
```bash
cd /chemin/vers/votre-app
nano .env
```

2. Ajoutez ces lignes (remplacez par vos vraies valeurs) :
```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-cle-supabase
NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
PORT=3000
```

3. Sauvegardez (Ctrl+X, puis Y, puis Entrée)

### 6. Démarrer l'application

Toujours en SSH :

```bash
# Aller dans le dossier
cd /chemin/vers/votre-app/server

# Vérifier que Node.js est installé
node --version  # Doit être >= 20.18.0

# Installer PM2 si nécessaire
npm install -g pm2

# Démarrer l'application
pm2 start index.mjs --name "laumond-nuxt"

# Sauvegarder la configuration
pm2 save

# Configurer pour démarrer au boot
pm2 startup
```

### 7. Configurer le reverse proxy (si nécessaire)

Si vous utilisez Nginx ou Apache, configurez-le pour rediriger vers le port 3000.

Voir le fichier `DEPLOY-OVH.md` pour les détails de configuration Nginx.

## ✅ Vérification

Une fois tout configuré :
- ✅ Visitez `http://votre-domaine.com` → La page d'accueil doit s'afficher
- ✅ Testez la recherche → Elle doit fonctionner
- ✅ Vérifiez les logs : `pm2 logs laumond-nuxt`

## 📞 Support

Si vous rencontrez des problèmes, consultez `DEPLOY-OVH.md` pour plus de détails.

