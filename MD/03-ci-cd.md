# CI/CD (résumé pour prompt)

- Pipeline : GitHub Actions `deploy.yml` sur push `main`. Étapes : tests (`npm test -- --run`), build Nuxt, pack, transfert vers VPS, install deps, restart PM2.
- Cible : VPS OVH `37.59.110.130`, app dans `/root/laumond-app`, process PM2 `laumond-nuxt`. Le `.env` serveur est préservé entre déploiements.
- Secrets GitHub nécessaires : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (clé privée dédiée), `VPS_PORT` (optionnel), `SUPABASE_URL`, `SUPABASE_KEY`, `NUXT_PUBLIC_API_URL`.
- Préparation VPS (one-shot) : créer `/root/laumond-app`, poser `.env` avec les mêmes noms que les secrets, installer Node 20+ et PM2.
- Vérifs post-déploiement : `pm2 status`, `pm2 logs laumond-nuxt --lines 50`. Si SSH échoue : vérifier `authorized_keys` et permissions `600`.
