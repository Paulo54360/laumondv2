# Configuration des variables d'environnement sur OVH

Selon votre type d'hébergement OVH, voici où configurer les variables d'environnement :

## 🔍 Identifier votre type d'hébergement OVH

### Option 1 : VPS ou Cloud (SSH disponible) ✅ Recommandé

Si vous avez accès SSH à votre serveur :

#### Méthode A : Fichier `.env` (Simple)

1. **Connectez-vous en SSH** à votre serveur OVH :
```bash
ssh votre-utilisateur@votre-serveur.ovh.net
```

2. **Naviguez vers votre application** :
```bash
cd /chemin/vers/votre-app
```

3. **Créez un fichier `.env`** :
```bash
nano .env
```

4. **Ajoutez vos variables** :
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
PORT=3000
NODE_ENV=production
```

5. **Sauvegardez** : `Ctrl+X`, puis `Y`, puis `Entrée`

6. **Assurez-vous que votre application lit le fichier `.env`**
   - Avec PM2 : Ajoutez `--env production` à votre commande PM2

#### Méthode B : Variables système (Pour PM2)

1. **Modifiez votre fichier PM2 ecosystem** :
```bash
nano ecosystem.config.js
```

2. **Ajoutez les variables** :
```javascript
module.exports = {
  apps: [{
    name: 'laumond-nuxt',
    script: 'server/index.mjs',
    env: {
      SUPABASE_URL: 'https://xxxxx.supabase.co',
      SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      NUXT_PUBLIC_API_URL: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com',
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
}
```

3. **Démarrez avec PM2** :
```bash
pm2 start ecosystem.config.js
pm2 save
```

#### Méthode C : Export dans `.bashrc` ou `.profile`

1. **Éditez votre fichier de profil** :
```bash
nano ~/.bashrc
```

2. **Ajoutez à la fin** :
```bash
export SUPABASE_URL="https://xxxxx.supabase.co"
export SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export NUXT_PUBLIC_API_URL="https://plaumondpicture.s3.eu-west-3.amazonaws.com"
export PORT=3000
export NODE_ENV=production
```

3. **Rechargez** :
```bash
source ~/.bashrc
```

---

### Option 2 : Web Cloud PaaS (Platform as a Service)

Si vous utilisez OVH Managed Kubernetes ou un service PaaS :

1. **Connectez-vous au manager OVH** : https://www.ovh.com/manager/

2. **Allez dans** : `Web Cloud` → `PaaS` → `Votre service`

3. **Cherchez la section** : `Variables d'environnement` ou `Environment Variables`

4. **Ajoutez chaque variable** :
   - `SUPABASE_URL` = `votre-url`
   - `SUPABASE_KEY` = `votre-cle`
   - `NUXT_PUBLIC_API_URL` = `https://plaumondpicture.s3.eu-west-3.amazonaws.com`
   - `PORT` = `3000`

5. **Sauvegardez** et redémarrez votre application

---

### Option 3 : Hébergement Web classique (Sans Node.js) ❌

⚠️ **Attention** : Si vous avez un hébergement web classique OVH (sans SSH), vous **ne pouvez pas** faire tourner Node.js directement.

**Solutions alternatives** :
1. **Upgrade vers un VPS OVH** (à partir de ~3€/mois)
2. **Utilisez OVH Web Cloud PaaS**
3. **Déployez sur un autre hébergeur** supportant Node.js (Heroku, Railway, Render, etc.)

---

### Option 4 : Via le panneau d'administration OVH

#### Pour un VPS/Cloud :

1. **Connectez-vous** : https://www.ovh.com/manager/

2. **Allez dans** : `Bare Metal Cloud` → `Votre serveur`

3. **Cherchez** : `Gestion des variables d'environnement` (si disponible)

⚠️ **Note** : Cette option n'est pas toujours disponible. Il est plus simple d'utiliser SSH avec un fichier `.env`.

---

## 🔐 Sécurité

⚠️ **IMPORTANT** : 

- ❌ **Ne commitez JAMAIS** le fichier `.env` dans Git
- ✅ Ajoutez `.env` dans votre `.gitignore`
- ✅ Utilisez des permissions restrictives : `chmod 600 .env`
- ✅ Ne partagez jamais vos clés publiquement

---

## ✅ Vérification

Après configuration, vérifiez que les variables sont bien chargées :

```bash
# En SSH, testez :
echo $SUPABASE_URL

# Ou dans Node.js (test rapide) :
node -e "console.log(process.env.SUPABASE_URL)"
```

---

## 🆘 Besoin d'aide ?

Si vous ne savez pas quel type d'hébergement vous avez :

1. **Connectez-vous au manager OVH** : https://www.ovh.com/manager/
2. **Vérifiez dans** : `Bare Metal Cloud` ou `Web Cloud`
3. **Regardez si vous avez** :
   - Un VPS/Cloud → Utilisez SSH (Méthode 1)
   - Un service PaaS → Utilisez l'interface web (Méthode 2)
   - Un hébergement web classique → Upgrade nécessaire

---

## 📝 Script rapide pour créer le fichier .env

Si vous avez accès SSH, vous pouvez utiliser ce script :

```bash
#!/bin/bash
cat > .env << EOF
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
PORT=3000
NODE_ENV=production
EOF

chmod 600 .env
echo "✅ Fichier .env créé avec les permissions correctes"
```

**Remplacez** `xxxxx` par vos vraies valeurs avant d'exécuter.

