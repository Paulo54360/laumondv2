# Configuration Admin — Compte Patrick

Ce document décrit comment configurer Supabase Auth et créer le compte de Patrick pour le back-office.

## 1. Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs (voir README).

Variables requises pour l'admin :

- `SUPABASE_URL` — URL du projet Supabase
- `SUPABASE_KEY` — Clé anon (Auth client-side)
- `SUPABASE_SERVICE_ROLE_KEY` — Clé service role (vérification JWT côté serveur)

## 2. Activer Auth dans Supabase

1. Ouvrir le [dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionner le projet
3. Aller dans **Authentication** > **Providers**
4. S'assurer que **Email** est activé (par défaut)

## 3. Créer le compte Patrick

1. Dans le dashboard : **Authentication** > **Users**
2. Cliquer sur **Add user** > **Create new user**
3. Saisir l'**email** de Patrick
4. Saisir un **mot de passe** (à communiquer de façon sécurisée)
5. Optionnel : cocher **Auto Confirm User** pour éviter la vérification d'email
6. Valider

Le compte sera créé dans `auth.users`. Aucune table métier `users` n'est nécessaire.

## 4. Vérifier la connexion

Exécuter le script de vérification (après avoir configuré `.env` avec SUPABASE_URL et SUPABASE_KEY) :

**Option A — identifiants dans `.env`** (recommandé, évite de taper le mot de passe en clair) :
Décommenter et renseigner `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env`, puis :

```bash
npm run verify:admin-auth
```

**Option B — identifiants en arguments** :

```bash
npx tsx scripts/verify-admin-auth.ts <email> <mot-de-passe>
```

Le script appelle `signInWithPassword` et vérifie qu'un JWT valide est retourné. En cas de succès, un message confirme que l'auth est opérationnelle.

## 5. Sécurité

- Ne jamais committer `.env`
- La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être exposée côté client
- Changer le mot de passe Patrick si compromission suspectée
- Préférer `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `.env` plutôt que les arguments CLI (le mot de passe en argument apparaît dans la liste des processus)

## Voir aussi- [Configuration CORS S3](s3-cors-setup.md) — pour que les images uploadées s'affichent correctement depuis le site (localhost et production).
- [Migrations BDD](migrations.md) — migrations pour le back-office complet (corbeille, artwork_images, site_texts).