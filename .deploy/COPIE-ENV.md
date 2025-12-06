# 📋 Instructions pour copier votre fichier .env

Vous avez déjà un fichier `.env` local. Voici comment le transférer sur votre serveur OVH :

## ⚠️ IMPORTANT - Sécurité

**NE DÉPLOYEZ JAMAIS** le fichier `.env` via FTP/Cyberduck si vous utilisez un protocole non sécurisé !

Le fichier `.env` contient vos clés secrètes (Supabase, etc.). Il doit être transmis de manière sécurisée.

## ✅ Méthode sécurisée recommandée : Via SSH

### 1. Connectez-vous en SSH à votre serveur OVH

```bash
ssh votre-utilisateur@votre-serveur.ovh.net
```

### 2. Créez le fichier .env sur le serveur

#### Option A : Copier via SCP (depuis votre Mac)

Sur votre Mac, dans un nouveau terminal :

```bash
cd ~/Documents/Projet\ perso/LaumondV2/laumond-nuxt
scp .env votre-utilisateur@votre-serveur.ovh.net:/chemin/vers/votre-app/.env
```

#### Option B : Créer manuellement sur le serveur

1. **Connectez-vous en SSH** à votre serveur
2. **Naviguez vers votre application** :
   ```bash
   cd /chemin/vers/votre-app
   ```
3. **Créez le fichier** :
   ```bash
   nano .env
   ```
4. **Copiez-collez le contenu** de votre fichier `.env` local
5. **Sauvegardez** : `Ctrl+X`, puis `Y`, puis `Entrée`
6. **Protégez le fichier** :
   ```bash
   chmod 600 .env
   ```

## 📝 Vérification

Une fois le fichier `.env` créé sur le serveur, vérifiez qu'il est bien en place :

```bash
# Sur le serveur
cd /chemin/vers/votre-app
ls -la .env
# Doit afficher : -rw------- (permissions 600)
```

## 🚀 Après avoir créé le .env sur le serveur

Démarrez votre application avec PM2 qui chargera automatiquement le `.env` :

```bash
cd /chemin/vers/votre-app/server
pm2 start index.mjs --name "laumond-nuxt"
pm2 save
```

PM2 chargera automatiquement les variables depuis le fichier `.env` à la racine de votre application.

## 🔍 Vérifier que les variables sont chargées

```bash
# Vérifier que les variables sont disponibles
pm2 logs laumond-nuxt | grep -i "supabase\|env"

# Ou tester directement
node -e "require('dotenv').config(); console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Définie' : '❌ Non définie')"
```

## ⚠️ Alternative : Utiliser ecosystem.config.js

Si vous préférez ne pas utiliser de fichier `.env` sur le serveur, vous pouvez utiliser le fichier `ecosystem.config.js` fourni dans `.deploy/`. Il contient un template avec les variables d'environnement.

