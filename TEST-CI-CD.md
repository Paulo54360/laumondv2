# ✅ Test de votre CI/CD

## 🎯 Vérification rapide

Maintenant que toutes les clés sont configurées, testons que tout fonctionne !

---

## 📋 Checklist des secrets GitHub

Vérifiez que vous avez bien ces secrets dans GitHub :

1. ✅ `VPS_HOST` = `37.59.110.130`
2. ✅ `VPS_USER` = `root`
3. ✅ `VPS_SSH_KEY` = (votre clé privée)
4. ✅ `SUPABASE_URL` = (votre URL)
5. ✅ `SUPABASE_KEY` = (votre clé)
6. ✅ `NUXT_PUBLIC_API_URL` = `https://plaumondpicture.s3.eu-west-3.amazonaws.com`

---

## 🧪 Test 1 : Connexion SSH locale

Sur votre Mac, testez que la clé fonctionne :

```bash
ssh -i ~/.ssh/github_actions_deploy root@37.59.110.130
```

**Résultat attendu :** Vous devez être connecté **sans mot de passe**.

Si ça demande un mot de passe, vérifiez que vous avez bien fait `ssh-copy-id` à l'étape 2.

---

## 🚀 Test 2 : Premier déploiement GitHub Actions

### Option A : Déploiement automatique (push sur main)

1. **Faites un petit changement** dans votre code (ou créez juste un fichier de test) :

```bash
git add .
git commit -m "Test CI/CD deployment"
git push origin main
```

2. **Sur GitHub**, allez dans : `Actions` (onglet en haut)

3. **Vous devriez voir** :
   - Un workflow "Deploy to VPS" qui se lance
   - Les étapes s'exécuter en temps réel
   - Un ✅ vert si tout fonctionne

### Option B : Déploiement manuel

1. **Sur GitHub**, allez dans : `Actions`

2. **Sélectionnez** le workflow "Deploy to VPS" (ou "Deploy to VPS (Simple)")

3. **Cliquez sur** : `Run workflow` (bouton en haut à droite)

4. **Choisissez** la branche `main`

5. **Cliquez sur** : `Run workflow`

6. **Le workflow se lance** et vous pouvez suivre les logs en temps réel

---

## 📊 Vérifier que le déploiement a réussi

### Sur GitHub Actions

- ✅ Toutes les étapes doivent être vertes
- ✅ Pas d'erreurs rouges
- Le dernier message doit être : "✅ Déploiement terminé !"

### Sur votre VPS

Connectez-vous en SSH :

```bash
ssh root@37.59.110.130
pm2 status
```

**Résultat attendu :**
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ cpu     │ memory   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ laumond-nuxt     │ online  │ 0%      │ 50 MB    │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

### Vérifier que l'application fonctionne

```bash
# Sur le VPS
curl http://localhost:3000

# Ou depuis votre Mac (si le port 3000 est accessible)
curl http://37.59.110.130:3000
```

---

## 🔍 En cas d'erreur

### Erreur : "Permission denied"

**Cause :** La clé SSH n'est pas bien configurée

**Solution :**
```bash
# Vérifier que la clé publique est sur le VPS
ssh root@37.59.110.130 "cat ~/.ssh/authorized_keys | grep github-actions"
```

Si rien ne s'affiche, refaites :
```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@37.59.110.130
```

### Erreur : "PM2 command not found"

**Cause :** PM2 n'est pas installé sur le VPS

**Solution :** Connectez-vous en SSH et installez PM2 :
```bash
ssh root@37.59.110.130
npm install -g pm2
```

### Erreur : "Application failed to start"

**Cause :** Problème avec les variables d'environnement ou dépendances

**Solution :** 
1. Vérifiez le fichier `.env` sur le VPS : `cat /root/laumond-app/.env`
2. Vérifiez les logs : `pm2 logs laumond-nuxt`

---

## ✅ Prochaines étapes après le premier déploiement réussi

Une fois que le premier déploiement fonctionne :

1. **Configurez Nginx** pour votre domaine (voir `DEPLOY-VPS-ETAPES.md`)
2. **Configurez le SSL/HTTPS** avec Let's Encrypt
3. **Configurez les sauvegardes automatiques**

---

## 🎉 Félicitations !

Si tout fonctionne, votre CI/CD est opérationnel ! 

**Désormais, à chaque fois que vous pushez sur `main`, votre application sera automatiquement déployée ! 🚀**

