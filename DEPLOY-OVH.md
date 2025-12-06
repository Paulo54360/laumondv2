# Guide de déploiement OVH avec Node.js

## 📦 Fichiers à déployer

Le dossier `.deploy/output/` contient tous les fichiers nécessaires pour le déploiement.

## 🚀 Étapes de déploiement via Cyberduck

### 1. Connexion FTP
- Ouvrez Cyberduck
- Créez une nouvelle connexion FTP/SFTP vers votre serveur OVH
- Connectez-vous

### 2. Upload des fichiers
- Naviguez vers le dossier de votre application (ex: `www/` ou `app/`)
- **Glissez-déposez TOUT le contenu de `.deploy/output/`** dans Cyberduck
- ⚠️ Assurez-vous que la structure est préservée :
  ```
  votre-serveur/
  ├── public/
  ├── server/
  ├── node_modules/
  ├── package.json
  └── nitro.json
  ```

### 3. Configuration des variables d'environnement

Sur votre serveur OVH, configurez les variables d'environnement :

```bash
export SUPABASE_URL="votre-url-supabase"
export SUPABASE_KEY="votre-cle-supabase"
export NUXT_PUBLIC_API_URL="https://plaumondpicture.s3.eu-west-3.amazonaws.com"
```

**Pour OVH**, vous pouvez créer un fichier `.env` à la racine de votre application :
```env
SUPABASE_URL=votre-url-supabase
SUPABASE_KEY=votre-cle-supabase
NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
```

Ou configurez-les dans le panneau OVH si disponible.

### 4. Installation des dépendances

Sur votre serveur, dans le dossier de l'application :

```bash
cd /chemin/vers/votre-app
npm install --production
```

### 5. Démarrage de l'application

#### Option A : Avec PM2 (recommandé)

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer l'application
pm2 start server/index.mjs --name "laumond-nuxt"

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

#### Option B : Avec Node directement

```bash
node server/index.mjs
```

#### Option C : Avec systemd (service Linux)

Créez un fichier `/etc/systemd/system/laumond-nuxt.service` :

```ini
[Unit]
Description=Laumond Nuxt Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/chemin/vers/votre-app
Environment="NODE_ENV=production"
Environment="SUPABASE_URL=votre-url-supabase"
Environment="SUPABASE_KEY=votre-cle-supabase"
Environment="NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com"
ExecStart=/usr/bin/node server/index.mjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Puis :
```bash
sudo systemctl daemon-reload
sudo systemctl enable laumond-nuxt
sudo systemctl start laumond-nuxt
```

### 6. Configuration du serveur web (Nginx/Apache)

#### Avec Nginx (exemple)

Créez/modifiez `/etc/nginx/sites-available/laumond-nuxt` :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

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

Activez le site :
```bash
sudo ln -s /etc/nginx/sites-available/laumond-nuxt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Port par défaut

Par défaut, Nuxt/Nitro écoute sur le port **3000**. 
- Si votre OVH a un port spécifique, configurez-le dans `nitro.json` ou via la variable d'environnement `PORT`
- Sinon, configurez votre reverse proxy (Nginx) pour rediriger vers le port 3000

### 7. Vérification

Testez que tout fonctionne :
- ✅ Page d'accueil : `http://votre-domaine.com`
- ✅ Recherche : `http://votre-domaine.com/api/search?q=test`
- ✅ Pages en français : `http://votre-domaine.com/fr`
- ✅ Pages en anglais : `http://votre-domaine.com/en`

## 🔍 Résolution de problèmes

### La recherche ne fonctionne pas
1. Vérifiez que les variables `SUPABASE_URL` et `SUPABASE_KEY` sont bien configurées
2. Vérifiez les logs : `pm2 logs laumond-nuxt` ou `journalctl -u laumond-nuxt`
3. Testez l'API directement : `curl http://localhost:3000/api/search?q=test`

### L'application ne démarre pas
1. Vérifiez que Node.js >= 20.18.0 est installé : `node --version`
2. Vérifiez que les dépendances sont installées : `npm install --production`
3. Vérifiez les logs d'erreur

### Les images ne s'affichent pas
1. Vérifiez que `NUXT_PUBLIC_API_URL` pointe vers votre bucket S3
2. Vérifiez les permissions CORS sur S3

## 📝 Notes importantes

- ⚠️ Ne déployez **jamais** le dossier `.nuxt/`, `node_modules/` local, ou `.env` local
- ✅ Utilisez **uniquement** le contenu de `.deploy/output/` préparé par le script
- 🔒 Gardez vos clés Supabase secrètes (ne les commitez pas dans Git)

