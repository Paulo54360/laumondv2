# CI/CD & Déploiement — Pipeline actuel

Référence : `.cursorrules`, `docs/refactor-laumond-nuxt.md`. Ce doc décrit le pipeline de build et déploiement tel qu’il est configuré (sans changer le design ni la prod).

---

## 1. Vue d’ensemble

1. **Push sur `main`** (ou déclenchement manuel) → GitHub Actions lance le workflow `Build & Deploy to VPS`.
2. **Build** : image Docker construite (Dockerfile multi-stage), poussée vers GitHub Container Registry (`ghcr.io`).
3. **Déploiement** : `docker-compose.yml` est copié sur le VPS ; SSH exécute `docker compose pull` puis `docker compose up -d` pour mettre à jour l’app.

Pas de PM2 dans ce flux : l’app tourne dans un conteneur Docker sur le VPS.

---

## 2. Fichiers concernés

| Fichier | Rôle |
|--------|------|
| **Dockerfile** | Build multi-stage (node:20-alpine) : `npm ci` + `npm run build`, puis image de run avec `node .output/server/index.mjs`. |
| **docker-compose.yml** | Définit le service `app` (image ghcr.io, port 3000, variables d’env). Utilise **Compose V2** (`docker compose`), sans clé `version` (obsolète). |
| **.github/workflows/deploy.yml** | Workflow : checkout → Buildx → login ghcr.io → build & push → SCP du compose → SSH sur le VPS → `docker compose pull` / `up -d` + nettoyage. |

---

## 3. Déroulement détaillé (GitHub Actions)

1. **Checkout** du dépôt (`actions/checkout@v4`).
2. **Nom d’image** : `IMAGE_NAME` = nom du repo en minuscules (ex. `owner/laumond-nuxt` → `owner/laumondv2` selon le repo).
3. **Docker Buildx** (`docker/setup-buildx-action@v3`).
4. **Login** sur `ghcr.io` avec `GITHUB_TOKEN` (`docker/login-action@v3`).
5. **Build & push** (`docker/build-push-action@v5`) : contexte `.`, tag `ghcr.io/$IMAGE_NAME:latest`, cache GHA (`cache-from: type=gha`, `cache-to: type=gha,mode=max`).
6. **SCP** : copie de `docker-compose.yml` vers le VPS (`appleboy/scp-action`). Cible par défaut : `/home/ubuntu/laumond-app/`. Si ton VPS utilise un autre user ou chemin (ex. `/root/laumond-app`), modifie les champs `target` du SCP et le `script` SSH dans `deploy.yml`.
7. **SSH** (`appleboy/ssh-action`) : sur le VPS, `docker login` → `docker compose pull` → `docker compose up -d` → `docker logout` → `docker image prune -f`.

---

## 4. Secrets GitHub requis

À configurer dans **Settings → Secrets and variables → Actions** (ou Environment « Production ») :

| Secret | Usage |
|--------|--------|
| **VPS_HOST** | Adresse IP ou hostname du VPS. |
| **VPS_USER** | Utilisateur SSH (ex. `ubuntu` ou `root`). |
| **VPS_SSH_KEY** | Clé privée SSH pour se connecter au VPS. |
| **VPS_PORT** | (Optionnel) Port SSH, défaut 22. |
| **NUXT_PUBLIC_GTAG_ID** | (Optionnel) ID Google Analytics / gtag. |

Les variables Supabase et l’URL API sont en général définies **sur le VPS** (fichier `.env` ou env du conteneur), pas forcément dans GitHub. Le `docker-compose.yml` du repo utilise `SUPABASE_URL`, `SUPABASE_KEY`, `NUXT_PUBLIC_API_URL` (avec valeur par défaut pour l’API), etc. — à fournir sur la machine (fichier `.env` à côté de `docker-compose.yml` sur le VPS).

---

## 5. Commandes Docker utilisées (pas de dépréciation)

- **`docker compose pull`** / **`docker compose up -d`** : Compose V2 (recommandé), pas l’ancien `docker-compose` (v1).
- **`docker image prune -f`** : à jour.
- **`docker login` / `docker logout`** : à jour.
- **Dockerfile** : pas d’instruction dépréciée (`MAINTAINER` remplacé par `LABEL` si besoin ; ici non utilisé).
- **docker-compose.yml** : la clé **`version`** est obsolète avec la Compose Specification ; elle a été retirée pour éviter les avertissements.

---

## 6. Vérifications avant déploiement (Story 6.2)

En local, avant de pousser sur `main` :

```bash
npm run lint:fix
npm run test -- --run
npm run build
```

Le workflow ne lance pas les tests automatiquement pour l’instant ; tu peux ajouter un job `test` ou une étape `npm run test -- --run` avant le build si tu veux bloquer le déploiement en cas de tests rouges.

---

## 7. Checklist « déploiement sans stress » (Story 6.3)

- [ ] `npm run lint:fix` OK
- [ ] `npm run test -- --run` OK
- [ ] `npm run build` OK en local (optionnel mais recommandé)
- [ ] Secrets GitHub à jour (VPS_HOST, VPS_USER, VPS_SSH_KEY, etc.)
- [ ] Sur le VPS : `.env` ou variables d’env pour Supabase / API présentes à côté de `docker-compose.yml`
- [ ] Push sur `main` (ou run manuel du workflow)
- [ ] Vérifier les logs du workflow ; en cas d’échec SSH/SCP, vérifier la clé et l’accès au VPS
- [ ] Après déploiement : ouvrir le site et vérifier une page critique (ex. accueil, recherche)

---

## 8. Références

- Règles projet (CI/CD) : `.cursorrules` (§ 5)
- Objectifs refactor : `docs/refactor-laumond-nuxt.md`
- Compose Specification : [Docker Compose file reference](https://docs.docker.com/reference/compose-file/) (sans `version`)
