# 🚀 Configuration CI/CD pour déploiement automatique

Ce guide vous explique comment configurer le déploiement automatique sur votre VPS OVH avec GitHub Actions.

## 📋 Prérequis

- ✅ Votre code est sur GitHub (dépôt public ou privé)
- ✅ Vous avez un VPS OVH avec accès SSH
- ✅ PM2 est installé sur le VPS

---

## 🔐 Étape 1 : Générer une clé SSH pour le déploiement

### Sur votre Mac

1. **Générer une clé SSH dédiée** :

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

⚠️ **N'entrez PAS de passphrase** (laissez vide) pour que GitHub Actions puisse l'utiliser automatiquement.

2. **Copier la clé publique sur votre VPS** :

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@37.59.110.130
```

Ou manuellement :

```bash
# Afficher la clé publique
cat ~/.ssh/github_actions_deploy.pub

# Sur le VPS, ajouter à authorized_keys
ssh root@37.59.110.130
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Collez la clé publique, sauvegardez (Ctrl+X, Y, Entrée)
chmod 600 ~/.ssh/authorized_keys
exit
```

3. **Tester la connexion** :

```bash
ssh -i ~/.ssh/github_actions_deploy root@37.59.110.130
```

Si ça fonctionne sans mot de passe, c'est bon ! ✅

---

## 🔑 Étape 2 : Configurer les secrets GitHub

1. **Allez sur GitHub** : https://github.com/votre-username/votre-repo

2. **Allez dans** : `Settings` → `Secrets and variables` → `Actions`

3. **Ajoutez les secrets suivants** (cliquez sur "New repository secret") :

### Secrets nécessaires :

| Nom du secret GitHub | Variable .env correspondante | Valeur/Description |
|---------------------|------------------------------|-------------------|
| `VPS_HOST` | - | `37.59.110.130` (Adresse IP du VPS) |
| `VPS_USER` | - | `root` (Utilisateur SSH) |
| `VPS_SSH_KEY` | - | Contenu de `~/.ssh/github_actions_deploy` (clé **privée**) |
| `VPS_PORT` | - | `22` (optionnel, port SSH) |
| `SUPABASE_URL` | `SUPABASE_URL` | Votre URL Supabase (ex: `https://xxxxx.supabase.co`) |
| `SUPABASE_KEY` | `SUPABASE_KEY` | Votre clé Supabase |
| `NUXT_PUBLIC_API_URL` | `NUXT_PUBLIC_API_URL` | `https://plaumondpicture.s3.eu-west-3.amazonaws.com` |

**⚠️ Important :** Les noms `SUPABASE_URL`, `SUPABASE_KEY` et `NUXT_PUBLIC_API_URL` doivent être identiques dans GitHub Secrets et dans votre fichier `.env` sur le VPS.

### Comment obtenir la clé privée :

Sur votre Mac :

```bash
cat ~/.ssh/github_actions_deploy
```

Copiez **TOUT** le contenu (de `-----BEGIN OPENSSH PRIVATE KEY-----` à `-----END OPENSSH PRIVATE KEY-----`) et collez-le dans le secret `VPS_SSH_KEY`.

---

## 📝 Étape 3 : Vérifier la configuration du workflow

Le fichier `.github/workflows/deploy.yml` est déjà créé. Il va :

1. ✅ Build l'application quand vous pushez sur `main`
2. ✅ Préparer les fichiers de déploiement
3. ✅ Les transférer sur le VPS
4. ✅ Installer les dépendances
5. ✅ Redémarrer l'application avec PM2

---

## 🎯 Étape 4 : Premier déploiement

### Option A : Déploiement automatique

1. **Commitez et pushez sur la branche `main`** :

```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

2. **Sur GitHub**, allez dans `Actions` → Vous verrez le workflow se lancer automatiquement

### Option B : Déploiement manuel

1. Sur GitHub, allez dans `Actions`
2. Sélectionnez le workflow "Deploy to VPS"
3. Cliquez sur "Run workflow"
4. Choisissez la branche `main`
5. Cliquez sur "Run workflow"

---

## 📊 Étape 5 : Surveiller les déploiements

1. **Sur GitHub** : `Actions` → Cliquez sur le workflow en cours
2. **Vous verrez les logs en temps réel**
3. **En cas d'erreur**, les logs vous indiqueront ce qui s'est mal passé

---

## 🔧 Étape 6 : Configuration initiale du VPS (une seule fois)

Avant le premier déploiement automatique, configurez le VPS :

```bash
ssh root@37.59.110.130

# Créer le dossier de l'application
mkdir -p /root/laumond-app
cd /root/laumond-app

# Créer le fichier .env (important, ne sera pas écrasé)
nano .env
# Ajoutez vos variables d'environnement (mêmes noms que dans GitHub Secrets)
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com
# PORT=3000
# NODE_ENV=production

chmod 600 .env

# Installer Node.js et PM2 (si pas déjà fait)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

---

## 🛡️ Sécurité du fichier .env

Le workflow CI/CD **NE REMPLACE PAS** votre fichier `.env` sur le VPS. Il est préservé entre les déploiements.

Pour modifier les variables d'environnement :
- Connectez-vous en SSH
- Éditez `/root/laumond-app/.env`
- Redémarrez : `pm2 restart laumond-nuxt`

---

## 📦 Structure de déploiement

```
/root/laumond-app/
├── .env              ← Préservé (vos secrets)
├── server/           ← Mis à jour à chaque déploiement
├── public/           ← Mis à jour à chaque déploiement
├── nitro.json        ← Mis à jour à chaque déploiement
└── backups/          ← Sauvegardes automatiques
```

---

## ✅ Vérification après déploiement

```bash
ssh root@37.59.110.130
pm2 status
pm2 logs laumond-nuxt --lines 50
```

---

## 🔄 Workflow simplifié (alternative)

Si vous préférez une version plus simple, utilisez `.github/workflows/deploy-simple.yml` :

1. Renommez-le en `deploy.yml`
2. Il fait la même chose mais de manière plus directe

---

## 🆘 Dépannage

### Le déploiement échoue avec "Permission denied"

- Vérifiez que la clé SSH publique est bien dans `~/.ssh/authorized_keys` sur le VPS
- Vérifiez les permissions : `chmod 600 ~/.ssh/authorized_keys`

### PM2 ne redémarre pas l'application

- Connectez-vous en SSH et vérifiez : `pm2 status`
- Redémarrez manuellement : `pm2 restart laumond-nuxt`

### L'application ne fonctionne pas après déploiement

- Vérifiez les logs : `pm2 logs laumond-nuxt`
- Vérifiez le fichier `.env` : `cat /root/laumond-app/.env`

---

## 🎉 C'est tout !

Désormais, à chaque push sur `main`, votre application sera automatiquement déployée sur le VPS ! 🚀

