# 🔑 Où régénérer votre mot de passe root dans OVH

## 📍 Emplacement dans l'interface OVH

### Méthode 1 : Via l'onglet "IP" (le plus commun)

1. **Allez dans** : Manager OVH → `Bare Metal Cloud` → `Virtual private servers`
2. **Cliquez sur votre VPS** (celui avec l'IP `37.59.110.130`)
3. **Vous êtes sur la page "Accueil"** de votre VPS
4. **Cherchez le bloc "IP"** (généralement en haut à droite)
5. **À côté de "IPv4"** (`37.59.110.130`), il y a des boutons :
   - Une **icône de copie** 📋
   - Un bouton **"..."** (trois points)
6. **Cliquez sur les "..."** (trois points)
7. **Dans le menu déroulant**, cherchez :
   - **"Réinitialiser le mot de passe root"**
   - **"Reset root password"**
   - **"Générer un nouveau mot de passe"**

---

### Méthode 2 : Via le bloc "Boot"

1. **Sur la page de votre VPS**
2. **Cherchez le bloc "Votre VPS"** (en haut à gauche)
3. **À côté de "Boot : LOCAL"**, il y a un bouton **"..."** (trois points)
4. **Cliquez dessus**
5. **Dans le menu**, cherchez :
   - **"Réinstallation"**
   - **"Réinitialiser le mot de passe"**
6. **Choisissez** : "Réinitialiser uniquement le mot de passe" (sans réinstaller)

---

### Méthode 3 : Via l'onglet "IP" du menu latéral

1. **Sur la page de votre VPS**
2. **Dans le menu latéral à gauche**, cliquez sur **"IP"** (si disponible)
3. **Vous verrez la liste de vos IPs**
4. **À côté de votre IPv4**, cherchez un bouton **"Actions"** ou **"..."**
5. **Cliquez dessus** et cherchez **"Réinitialiser le mot de passe root"**

---

### Méthode 4 : Via le menu Actions général

1. **Sur la page de votre VPS**
2. **Cherchez un bouton "Actions"** en haut à droite de la page
3. **Cliquez dessus**
4. **Cherchez** dans le menu :
   - **"Réinitialiser le mot de passe root"**
   - **"Reset password"**

---

### Méthode 5 : Via OVHcloud Shell (si vous y êtes)

```bash
ovhcloud vps set-password vps-117c11c9.vps.ovh.net
```

Suivez les instructions pour définir un nouveau mot de passe.

---

## 🎯 Méthode recommandée

**Commencez par la Méthode 1** (via le bloc "IP" avec les "..." à côté de l'IPv4).

---

## 📝 Une fois que vous trouvez l'option

1. **Cliquez sur** "Réinitialiser le mot de passe root"
2. **OVH va générer** un nouveau mot de passe
3. **Une nouvelle page/fenêtre s'ouvre** avec :
   - Le **nouveau mot de passe**
   - La **date d'expiration**
4. **COPIEZ le mot de passe** immédiatement (cliquez sur l'icône copier 📋)
5. **Utilisez-le DANS LES 2 MINUTES** qui suivent

---

## ⚠️ Important

- Le mot de passe expire **rapidement** (souvent en 5-15 minutes)
- **Copiez-le** immédiatement
- **Utilisez-le tout de suite** dans votre Terminal Mac

---

## 🆘 Si vous ne trouvez toujours pas

1. **Cherchez** dans tous les menus "..." (trois points) sur la page
2. **Vérifiez** tous les onglets du menu latéral
3. **Cherchez** "password", "mot de passe", "reset", "réinitialiser" dans l'interface



