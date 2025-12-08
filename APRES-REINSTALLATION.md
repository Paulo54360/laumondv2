# 🔄 Après réinstallation du VPS

## ✅ Ce qui s'est passé

Vous avez réinstallé le VPS, donc :
- ✅ La clé SSH du serveur a changé (normal)
- ✅ Vous avez déjà copié votre clé publique (ligne 158)
- ⚠️ Votre Mac a encore l'ancienne clé dans `known_hosts`

---

## 🔧 Solution : Supprimer l'ancienne clé

J'ai exécuté la commande pour supprimer l'ancienne clé. Maintenant :

### 1. Réessayez la connexion SSH

Dans votre Terminal Mac :

```bash
ssh root@37.59.110.130
```

### 2. Acceptez la nouvelle clé

Quand il demande :
```
Are you sure you want to continue connecting (yes/no)?
```

Tapez : `yes` puis Entrée

### 3. Entrez le mot de passe

Il va demander le mot de passe. Utilisez :
- Le mot de passe que vous avez défini lors de la réinstallation
- Ou le nouveau mot de passe que vous avez généré

---

## ✅ Si vous avez déjà copié la clé publique

Si la clé publique est déjà sur le serveur (ligne 158), après avoir accepté la nouvelle clé, vous devriez pouvoir vous connecter **sans mot de passe** !

---

## 🎯 Prochaines étapes

Une fois connecté :

1. **Changez le mot de passe** (si vous voulez) :
   ```bash
   passwd
   ```

2. **Vérifiez que tout est OK** :
   ```bash
   node --version  # Vérifier Node.js
   pm2 --version   # Vérifier PM2
   ```

3. **Configurez votre application** (voir `DEPLOY-VPS-ETAPES.md`)

---

## 📝 Note

Après une réinstallation, le VPS est "vierge". Il faudra :
- Réinstaller Node.js
- Réinstaller PM2
- Reconfigurer votre application

Mais au moins, vous avez maintenant un accès SSH qui fonctionne ! ✅





