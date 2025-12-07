# 🚀 Guide de déploiement CI/CD - Mode rapide

## ✅ Étape 1 : Vérifier/copier la clé SSH sur le VPS

Votre clé publique SSH :
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKsdFFfb+BJV8RQ8iPYDnsBkSsQIsp66bw0AoPvRD4Cf github-actions-deploy
```

### Option A : Copier automatiquement

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@37.59.110.130
```

### Option B : Copier manuellement

```bash
# 1. Se connecter au VPS
ssh root@37.59.110.130

# 2. Créer le dossier .ssh si nécessaire
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 3. Ajouter la clé publique
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKsdFFfb+BJV8RQ8iPYDnsBkSsQIsp66bw0AoPvRD4Cf github-actions-deploy" >> ~/.ssh/authorized_keys

# 4. Sécuriser les permissions
chmod 600 ~/.ssh/authorized_keys

# 5. Tester la connexion depuis votre Mac
exit
ssh -i ~/.ssh/github_actions_deploy root@37.59.110.130
# Ça doit fonctionner SANS mot de passe ✅
```

---

## 🔑 Étape 2 : Configurer les secrets GitHub

1. **Allez sur GitHub** : https://github.com/votre-username/votre-repo
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Secrets à ajouter :

| Nom du secret GitHub | Nom de la variable dans .env | Valeur/Description |
|---------------------|------------------------------|-------------------|
| `VPS_HOST` | - | `37.59.110.130` |
| `VPS_USER` | - | `root` |
| `VPS_SSH_KEY` | - | (clé privée SSH - voir ci-dessous) |
| `SUPABASE_URL` | `SUPABASE_URL` | (votre URL Supabase, ex: `https://xxxxx.supabase.co`) |
| `SUPABASE_KEY` | `SUPABASE_KEY` | (votre clé Supabase) |
| `NUXT_PUBLIC_API_URL` | `NUXT_PUBLIC_API_URL` | `https://plaumondpicture.s3.eu-west-3.amazonaws.com` |

### Obtenir la clé privée (pour `VPS_SSH_KEY`) :

```bash
cat ~/.ssh/github_actions_deploy
```

**Copiez TOUT le contenu** (de `-----BEGIN OPENSSH PRIVATE KEY-----` à `-----END OPENSSH PRIVATE KEY-----`) et collez-le dans le secret GitHub.

---

## 🖥️ Étape 3 : Configuration initiale du VPS

```bash
ssh root@37.59.110.130

# 1. Créer le dossier de l'application
mkdir -p /root/laumond-app
cd /root/laumond-app

# 2. Installer PM2 (si pas déjà fait)
npm install -g pm2

# 3. Créer le fichier .env (IMPORTANT : ne sera pas écrasé par le déploiement)
nano .env
```

### Contenu du fichier `.env` :

**Utilisez EXACTEMENT les mêmes noms que dans vos secrets GitHub :**

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
PORT=3000
NODE_ENV=production
```

**⚠️ Important :** Les noms des variables doivent correspondre exactement à ceux utilisés dans votre code (`SUPABASE_URL`, `SUPABASE_KEY`, `NUXT_PUBLIC_API_URL`).

```bash
# 4. Sécuriser le fichier .env
chmod 600 .env

# 5. Vérifier que PM2 est installé
pm2 --version

# 6. Configurer PM2 pour démarrer au boot (optionnel mais recommandé)
pm2 startup
# Suivez les instructions affichées
```

---

## 🎯 Étape 4 : Premier déploiement

### Option A : Déploiement automatique (recommandé)

```bash
# Sur votre Mac, dans le dossier du projet
git add .
git commit -m "Configure CI/CD deployment"
git push origin main
```

Le workflow GitHub Actions va :
1. ✅ Builder l'application
2. ✅ Préparer les fichiers de déploiement
3. ✅ Les transférer sur le VPS
4. ✅ Installer les dépendances
5. ✅ Redémarrer l'application avec PM2

**Surveillez le déploiement** : GitHub → Actions → Voir les logs en temps réel

### Option B : Déploiement manuel

1. Allez sur GitHub → **Actions**
2. Sélectionnez le workflow **"Deploy to VPS"**
3. Cliquez sur **"Run workflow"**
4. Choisissez la branche **`main`**
5. Cliquez sur **"Run workflow"**

---

## ✅ Étape 5 : Vérifier le déploiement

```bash
ssh root@37.59.110.130

# Vérifier que l'application tourne
pm2 status

# Voir les logs
pm2 logs laumond-nuxt --lines 50

# Vérifier les fichiers déployés
ls -la /root/laumond-app/

# Tester l'application (si vous avez configuré Nginx ou un reverse proxy)
curl http://localhost:3000
```

---

## 🔄 Déploiements suivants

**Désormais, à chaque `git push origin main`, le site sera automatiquement déployé !** 🎉

---

## 🆘 Dépannage

### ❌ Erreur "Permission denied" lors du déploiement

```bash
# Vérifier que la clé publique est sur le VPS
ssh root@37.59.110.130
cat ~/.ssh/authorized_keys | grep github-actions-deploy

# Vérifier les permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### ❌ PM2 ne démarre pas l'application

```bash
ssh root@37.59.110.130
cd /root/laumond-app
pm2 status
pm2 logs laumond-nuxt --err
# Vérifier les erreurs et corriger
```

### ❌ L'application ne répond pas

```bash
# Vérifier que le fichier .env existe et contient les bonnes valeurs
cat /root/laumond-app/.env

# Vérifier que les ports sont ouverts
netstat -tlnp | grep 3000

# Redémarrer manuellement
cd /root/laumond-app
pm2 restart laumond-nuxt
```

---

## 📚 Documentation complète

Pour plus de détails, consultez :
- `CI-CD-SETUP.md` - Guide détaillé
- `README-CI-CD.md` - Résumé rapide

---

## 🎉 C'est tout !

Une fois configuré, le déploiement est **100% automatique** ! 🚀

