# 🚀 Guide de déploiement sur votre VPS OVH

## Informations de votre VPS

- **IP :** `37.59.110.130`
- **Système :** Ubuntu 25.04
- **Ressources :** 4 vCores, 8 Go RAM, 75 Go stockage
- **Statut :** ✅ Actif

---

## 📋 Étape 1 : Connexion SSH au VPS

### Sur votre Mac, ouvrez le Terminal et tapez :

```bash
ssh root@37.59.110.130
```

⚠️ **Première connexion :**
- Vous verrez un message de confirmation → Tapez `yes`
- Entrez le mot de passe root que vous avez reçu par email OVH

✅ Une fois connecté, vous verrez : `root@vps-117c11c9:~#`

---

## 📦 Étape 2 : Installation de Node.js

Votre VPS a besoin de Node.js version 20.18.0 ou supérieure.

### 2.1 Installer Node.js via NodeSource

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer les dépendances
apt install -y curl git build-essential

# Installer Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v20.x.x
npm --version
```

---

## 📦 Étape 3 : Installation de PM2

PM2 permettra de faire tourner votre application en arrière-plan et de la redémarrer automatiquement.

```bash
npm install -g pm2
```

---

## 📤 Étape 4 : Upload des fichiers de votre application

Vous avez deux options :

### Option A : Via SCP (depuis votre Mac)

Sur votre Mac, dans un nouveau terminal :

```bash
cd ~/Documents/Projet\ perso/LaumondV2/laumond-nuxt
scp -r .deploy/output/* root@37.59.110.130:/root/laumond-app/
```

### Option B : Via Cyberduck (plus simple)

1. Ouvrez Cyberduck
2. Créez une nouvelle connexion **SFTP** :
   - **Serveur :** `37.59.110.130`
   - **Utilisateur :** `root`
   - **Mot de passe :** Votre mot de passe root
3. Connectez-vous
4. Créez un dossier `laumond-app`
5. Glissez-déposez **tout le contenu** de `.deploy/output/` dans ce dossier

---

## 🔐 Étape 5 : Configuration du fichier .env

### 5.1 Créer le fichier .env

Sur le VPS (en SSH) :

```bash
cd /root/laumond-app
nano .env
```

### 5.2 Ajouter vos variables

Copiez-collez le contenu de votre fichier `.env` local :

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=votre-url
DIRECT_URL=votre-url
S3_BASE_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
PORT=3000
NODE_ENV=production
```

**Sauvegardez :** `Ctrl+X`, puis `Y`, puis `Entrée`

### 5.3 Protéger le fichier

```bash
chmod 600 .env
```

---

## 🚀 Étape 6 : Installation des dépendances

```bash
cd /root/laumond-app/server
npm install --production
```

---

## 🎯 Étape 7 : Démarrer l'application avec PM2

```bash
# Retourner à la racine de l'application
cd /root/laumond-app

# Démarrer l'application
pm2 start server/index.mjs --name "laumond-nuxt"

# Vérifier que ça tourne
pm2 status

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivez les instructions affichées (copiez-collez la commande suggérée)
```

---

## 🌐 Étape 8 : Configurer le reverse proxy (Nginx)

Pour que votre application soit accessible via votre domaine `laumond.com` :

### 8.1 Installer Nginx

```bash
apt install -y nginx
```

### 8.2 Configurer Nginx

```bash
nano /etc/nginx/sites-available/laumond
```

Ajoutez cette configuration :

```nginx
server {
    listen 80;
    server_name laumond.com www.laumond.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sauvegardez : `Ctrl+X`, puis `Y`, puis `Entrée`

### 8.3 Activer le site

```bash
ln -s /etc/nginx/sites-available/laumond /etc/nginx/sites-enabled/
nginx -t  # Vérifier la configuration
systemctl restart nginx
```

---

## ✅ Étape 9 : Vérification

### 9.1 Tester l'application

```bash
# Vérifier les logs PM2
pm2 logs laumond-nuxt

# Tester l'API directement
curl http://localhost:3000/api/search?q=test
```

### 9.2 Vérifier depuis votre navigateur

- **En local sur le VPS :** `http://37.59.110.130:3000`
- **Via le domaine (si configuré) :** `http://laumond.com`

---

## 📊 Commandes utiles PM2

```bash
# Voir les logs en temps réel
pm2 logs laumond-nuxt

# Redémarrer l'application
pm2 restart laumond-nuxt

# Arrêter l'application
pm2 stop laumond-nuxt

# Voir le statut
pm2 status

# Surveiller les ressources
pm2 monit
```

---

## 🔧 Dépannage

### L'application ne démarre pas ?

```bash
# Voir les logs d'erreur
pm2 logs laumond-nuxt --err

# Vérifier que le port 3000 n'est pas déjà utilisé
netstat -tulpn | grep 3000

# Vérifier les variables d'environnement
cd /root/laumond-app
cat .env
```

### La recherche ne fonctionne pas ?

1. Vérifiez que les variables `SUPABASE_URL` et `SUPABASE_KEY` sont bien définies
2. Vérifiez les logs : `pm2 logs laumond-nuxt`
3. Testez l'API : `curl http://localhost:3000/api/search?q=test`

---

## 🎉 C'est tout !

Votre application Nuxt devrait maintenant être en ligne avec la recherche fonctionnelle !

