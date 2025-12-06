# 🔑 Guide pas à pas : Clé SSH pour GitHub Actions

## 🎯 Objectif

Créer une clé SSH qui permettra à GitHub Actions de se connecter automatiquement à votre VPS.

---

## 📝 Étape par étape

### ÉTAPE 1 : Générer la clé SSH

**Sur votre Mac, ouvrez le Terminal et copiez-collez cette commande :**

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy -N ""
```

**Résultat attendu :**
```
Generating public/private ed25519 key pair.
Your identification has been saved in /Users/paulo/.ssh/github_actions_deploy
Your public key has been saved in /Users/paulo/.ssh/github_actions_deploy.pub
```

✅ **C'est fait !** La clé est créée.

---

### ÉTAPE 2 : Copier la clé PUBLIQUE sur votre VPS

**Dans le Terminal, copiez-collez :**

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@37.59.110.130
```

**Quand il demande le mot de passe :**
- Entrez le mot de passe root de votre VPS
- Appuyez sur Entrée

**Résultat attendu :**
```
Number of key(s) added: 1
```

✅ **C'est fait !** Votre VPS accepte maintenant cette clé.

---

### ÉTAPE 3 : Obtenir la clé PRIVÉE (pour GitHub)

**Dans le Terminal, copiez-collez :**

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
1. **Sélectionnez TOUT** le texte affiché (de `-----BEGIN` jusqu'à `-----END`)
2. **Copiez-le** (Cmd+C)

---

### ÉTAPE 4 : Ajouter dans GitHub Secrets

1. **Allez sur GitHub** : https://github.com/votre-username/votre-repo
   (Remplacez par votre vrai nom d'utilisateur et nom de repo)

2. **Cliquez sur** : `Settings` (en haut à droite du repo)

3. **Dans le menu de gauche**, cliquez sur : 
   `Secrets and variables` → `Actions`

4. **Cliquez sur** : `New repository secret` (bouton vert en haut à droite)

5. **Remplissez le formulaire** :
   - **Name** : `VPS_SSH_KEY`
   - **Secret** : Collez la clé privée que vous avez copiée à l'étape 3
     (Tout le contenu, de `-----BEGIN` à `-----END`)

6. **Cliquez sur** : `Add secret` (bouton vert en bas)

✅ **C'est fait !** Le secret est sauvegardé dans GitHub.

---

## ✅ Vérification

### Test 1 : Vérifier que la connexion fonctionne

**Dans le Terminal :**

```bash
ssh -i ~/.ssh/github_actions_deploy root@37.59.110.130
```

**Si ça se connecte SANS demander de mot de passe**, c'est parfait ! ✅

**Pour quitter :** Tapez `exit`

---

### Test 2 : Vérifier les secrets GitHub

1. Allez sur GitHub → Votre repo → `Settings` → `Secrets and variables` → `Actions`
2. Vous devriez voir `VPS_SSH_KEY` dans la liste
3. Cliquez dessus pour vérifier (mais vous ne verrez pas le contenu, c'est normal, c'est secret)

---

## 📋 Checklist

- [ ] Clé SSH générée (`~/.ssh/github_actions_deploy` existe)
- [ ] Clé publique copiée sur le VPS (test SSH sans mot de passe fonctionne)
- [ ] Clé privée ajoutée dans GitHub Secrets (`VPS_SSH_KEY`)
- [ ] Autres secrets ajoutés (`VPS_HOST`, `VPS_USER`, etc.)

---

## 🆘 Si ça ne fonctionne pas

### "Permission denied" lors du test SSH

```bash
# Vérifier que la clé publique est bien sur le VPS
ssh root@37.59.110.130 "cat ~/.ssh/authorized_keys | grep github-actions"
```

Si rien ne s'affiche, refaites l'étape 2.

### Le workflow GitHub Actions échoue

- Vérifiez que vous avez bien copié **TOUT** le contenu de la clé privée
- Vérifiez qu'il n'y a pas d'espaces en trop au début/fin
- Vérifiez que les autres secrets sont bien configurés (`VPS_HOST`, `VPS_USER`)

---

## 🎉 C'est tout !

Une fois ces étapes terminées, votre CI/CD pourra se connecter automatiquement à votre VPS ! 🚀

