# 🔄 Réinitialiser le mot de passe root - Guide rapide

## ⚡ Méthode rapide

### 1. Allez dans le manager OVH

https://www.ovh.com/manager/

### 2. Naviguez vers votre VPS

**`Bare Metal Cloud`** → **`Virtual private servers`** → Cliquez sur votre VPS

### 3. Réinitialiser le mot de passe

**Option A : Via l'onglet "IP"**
1. Cliquez sur **"IP"** dans le menu de votre VPS
2. Cherchez le bouton **"..."** (trois points) ou **"Actions"**
3. Cliquez sur **"Réinitialiser le mot de passe root"**

**Option B : Via "Boot"**
1. Cliquez sur **"Boot"** ou **"Réinstallation"**
2. Choisissez **"Réinitialiser le mot de passe"** (sans réinstaller le système)

### 4. Recevoir le nouveau mot de passe

- OVH va générer un nouveau mot de passe
- **Vous recevrez un email** avec le nouveau mot de passe
- ⚠️ Vérifiez aussi vos **spams** !

### 5. Se connecter

```bash
ssh root@37.59.110.130
```

Entrez le nouveau mot de passe.

---

## 📧 Vérifier vos emails

L'email sera envoyé à l'adresse associée à votre compte OVH :
- Vérifiez la boîte mail de `plaumond@yahoo.fr` (selon votre dashboard)
- Cherchez "OVH" dans vos emails
- Cherchez "mot de passe" ou "password" en français et anglais

---

## 🔍 Si vous ne trouvez pas l'option

Dans certaines interfaces OVH, l'option peut être dans :
- **"Informations générales"** → **"Actions"** → **"Réinitialiser le mot de passe"**
- **Menu "..."** en haut à droite de la carte du VPS
- **"Sécurité"** ou **"Accès"** dans le menu latéral

---

## ✅ Une fois connecté

Changez le mot de passe pour quelque chose que vous mémorisez :

```bash
passwd
```





