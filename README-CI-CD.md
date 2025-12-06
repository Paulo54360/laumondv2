# 🚀 CI/CD - Déploiement automatique

## 📋 Résumé

Votre projet est configuré pour un déploiement automatique sur votre VPS OVH via GitHub Actions.

**Quand vous pushez sur `main` → L'application est automatiquement déployée ! 🎉**

---

## ⚡ Démarrage rapide

### 1. Générer la clé SSH

```bash
npm run setup:cicd
```

Suivez les instructions affichées.

### 2. Configurer les secrets GitHub

Allez sur GitHub → Votre repo → `Settings` → `Secrets and variables` → `Actions`

Ajoutez ces secrets :
- `VPS_HOST` = `37.59.110.130`
- `VPS_USER` = `root`
- `VPS_SSH_KEY` = (contenu de votre clé privée)
- `SUPABASE_URL` = (votre URL)
- `SUPABASE_KEY` = (votre clé)
- `NUXT_PUBLIC_API_URL` = `https://plaumondpicture.s3.eu-west-3.amazonaws.com`

### 3. Pusher sur main

```bash
git add .
git commit -m "Configure CI/CD"
git push origin main
```

Le déploiement se lance automatiquement ! 🚀

---

## 📚 Documentation complète

Voir `CI-CD-SETUP.md` pour le guide détaillé.

---

## 🔄 Workflow

1. **Push sur `main`** → Déclenche le workflow
2. **Build** → Compile l'application Nuxt
3. **Deploy** → Transfère les fichiers sur le VPS
4. **Restart** → Redémarre l'application avec PM2

---

## 🔐 Sécurité

- ✅ Le fichier `.env` n'est **jamais** déployé via CI/CD
- ✅ Les secrets sont stockés dans GitHub Secrets
- ✅ La clé SSH est dédiée uniquement au déploiement

