# 🔧 Le mot de passe ne fonctionne pas - Solutions

## ❌ Problème

Le mot de passe `TcXc6YHptp7N` ne fonctionne pas lors de la connexion SSH.

---

## ✅ Solution 1 : Générer un nouveau mot de passe (Recommandé)

Les mots de passe OVH expirent **rapidement** (souvent en quelques minutes).

### Étapes :

1. **Retournez dans le manager OVH** → Votre VPS
2. **Générez un NOUVEAU mot de passe root** :
   - Allez dans l'onglet "IP" ou "Boot"
   - Cherchez "Réinitialiser le mot de passe root"
   - Générez un nouveau mot de passe
3. **COPIEZ le nouveau mot de passe** immédiatement
4. **Utilisez-le DANS LES 2 MINUTES** qui suivent

⚠️ **IMPORTANT** : Utilisez le nouveau mot de passe **immédiatement**, ils expirent très vite !

---

## ✅ Solution 2 : Utiliser la console KVM/VNC

Au lieu de SSH, utilisez la console web directe :

### Via OVHcloud Shell :

```bash
ovhcloud vps get-console-url vps-117c11c9.vps.ovh.net
```

Cela vous donnera une URL. **Ouvrez-la dans un nouvel onglet** de votre navigateur.

### Ou via l'interface web :

1. **Manager OVH** → Votre VPS
2. **Cherchez** "Console KVM" ou "Console VNC" dans le menu
3. **Cliquez dessus**
4. Une **console s'ouvre** dans votre navigateur
5. **Connectez-vous** avec :
   - Utilisateur : `root`
   - Mot de passe : Le nouveau que vous venez de générer

---

## ✅ Solution 3 : Réinstaller le VPS (si rien ne fonctionne)

⚠️ **ATTENTION** : Cela **efface tout** sur le VPS. Utilisez seulement si c'est un nouveau VPS sans données importantes.

### Via OVHcloud Shell :

```bash
ovhcloud vps reinstall vps-117c11c9.vps.ovh.net --image ubuntu-latest
```

### Via l'interface web :

1. Manager OVH → Votre VPS → "Réinstallation"
2. Choisissez Ubuntu
3. **Définissez un nouveau mot de passe** que vous retiendrez
4. Laissez réinstaller

---

## 🔍 Solution 4 : Vérifier via la console web

Si vous arrivez à accéder via la console web (Solution 2), vérifiez que SSH est actif :

```bash
systemctl status ssh
```

Si ce n'est pas actif :

```bash
systemctl start ssh
systemctl enable ssh
```

Puis réessayez SSH depuis votre Mac.

---

## 📋 Checklist de dépannage

- [ ] J'ai généré un **NOUVEAU** mot de passe dans OVH
- [ ] J'ai utilisé le nouveau mot de passe **immédiatement** (dans les 2 minutes)
- [ ] J'ai vérifié qu'il n'y a **pas d'espaces** avant/après le mot de passe
- [ ] J'ai **copié-collé** le mot de passe (pas tapé manuellement)
- [ ] J'utilise le **Terminal Mac** (pas OVHcloud Shell) pour SSH
- [ ] J'ai essayé via la **console KVM/VNC** (solution 2)

---

## 🎯 Action immédiate recommandée

1. **Générez un nouveau mot de passe** dans OVH (Solution 1)
2. **Utilisez-le IMMÉDIATEMENT** (dans les 2 minutes)
3. **Essayez de vous connecter** via SSH : `ssh root@37.59.110.130`

Si ça ne fonctionne toujours pas, utilisez la console KVM/VNC (Solution 2).



