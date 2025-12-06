# 🔑 Guide : Comment obtenir la clé VPS_SSH_KEY

## 📝 Explication simple

`VPS_SSH_KEY` est la **clé privée SSH** qui permet à GitHub Actions de se connecter à votre VPS sans mot de passe.

---

## 🚀 Étapes détaillées

### Étape 1 : Générer la clé SSH (sur votre Mac)

Ouvrez le Terminal et exécutez :

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

**Quand il demande une passphrase :**
- ⚠️ **Appuyez juste sur Entrée** (laissez vide)
- ⚠️ **Appuyez encore sur Entrée** pour confirmer

Vous verrez quelque chose comme :
```
Generating public/private ed25519 key pair.
Your identification has been saved in ~/.ssh/github_actions_deploy
Your public key has been saved in ~/.ssh/github_actions_deploy.pub
```

✅ **C'est fait !** La clé est créée.

---

### Étape 2 : Copier la clé PUBLIQUE sur votre VPS

Cette étape permet à votre VPS d'accepter la connexion depuis GitHub Actions.

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@37.59.110.130
```

**Entrez le mot de passe de votre VPS** quand demandé.

✅ **C'est fait !** Votre VPS accepte maintenant cette clé.

---

### Étape 3 : Obtenir le contenu de la clé PRIVÉE

C'est cette clé que vous allez mettre dans GitHub Secrets.

Sur votre Mac, dans le Terminal :

```bash
cat ~/.ssh/github_actions_deploy
```

**Vous verrez quelque chose comme :**

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACD... (beaucoup de lignes) ...
...xyz123ABC==
-----END OPENSSH PRIVATE KEY-----
```

**⚠️ IMPORTANT :**
- Copiez **TOUT** le contenu (de `-----BEGIN` à `-----END`)
- Y compris les lignes `-----BEGIN` et `-----END`
- Toutes les lignes entre les deux

---

### Étape 4 : Ajouter dans GitHub Secrets

1. **Allez sur GitHub** : https://github.com/votre-username/votre-repo

2. **Cliquez sur** : `Settings` (en haut du repo)

3. **Dans le menu de gauche**, cliquez sur : `Secrets and variables` → `Actions`

4. **Cliquez sur** : `New repository secret` (bouton vert)

5. **Remplissez** :
   - **Name** : `VPS_SSH_KEY`
   - **Secret** : Collez **TOUT** le contenu de la clé privée (que vous avez copié à l'étape 3)

6. **Cliquez sur** : `Add secret`

✅ **C'est fait !** Le secret est sauvegardé.

---

## 🧪 Tester que ça fonctionne

### Test 1 : Connexion depuis votre Mac

```bash
ssh -i ~/.ssh/github_actions_deploy root@37.59.110.130
```

Si ça se connecte **sans demander de mot de passe**, c'est bon ! ✅

### Test 2 : Premier déploiement GitHub Actions

1. Faites un petit changement dans votre code
2. Commitez et pushez :
   ```bash
   git add .
   git commit -m "Test CI/CD"
   git push origin main
   ```
3. Allez sur GitHub → `Actions`
4. Vous devriez voir le workflow se lancer

---

## 📋 Résumé visuel

```
1. Générer la clé
   └─> ssh-keygen ... (crée 2 fichiers)

2. Clé PUBLIQUE → VPS
   └─> ssh-copy-id ... (autorise la connexion)

3. Clé PRIVÉE → GitHub Secrets
   └─> cat ~/.ssh/github_actions_deploy
   └─> Copier TOUT le contenu
   └─> Coller dans GitHub Secrets → VPS_SSH_KEY
```

---

## ⚠️ Sécurité

- ✅ La clé **privée** va dans GitHub Secrets (secret, pas visible)
- ✅ La clé **publique** va sur votre VPS (c'est normal, elle est publique)
- ❌ **Ne partagez JAMAIS** votre clé privée publiquement
- ❌ **Ne commitez JAMAIS** la clé privée dans Git

---

## 🆘 Problèmes courants

### "Permission denied" lors du test

- Vérifiez que vous avez bien copié la clé publique sur le VPS
- Vérifiez les permissions : `chmod 600 ~/.ssh/authorized_keys` sur le VPS

### Le workflow GitHub Actions échoue

- Vérifiez que vous avez copié **TOUT** le contenu de la clé privée (y compris les `-----BEGIN` et `-----END`)
- Vérifiez qu'il n'y a pas d'espaces supplémentaires au début/fin

### "No such file or directory"

- Vérifiez que la clé existe : `ls -la ~/.ssh/github_actions_deploy`
- Si elle n'existe pas, régénérez-la avec l'étape 1

