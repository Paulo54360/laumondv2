# 🔑 Comment récupérer le mot de passe de votre VPS OVH

## 📧 Méthode 1 : Dans vos emails OVH

Quand vous avez créé votre VPS, OVH vous a envoyé un email avec :
- ✅ L'adresse IP
- ✅ Le nom d'utilisateur (généralement `root`)
- ✅ Le mot de passe initial

**Cherchez dans votre boîte mail** :
- Recherchez "OVH" + "VPS"
- Recherchez "création" + "serveur"
- Recherchez "37.59.110.130" (votre IP)

---

## 🔄 Méthode 2 : Réinitialiser le mot de passe via le manager OVH

Si vous ne trouvez pas le mot de passe dans vos emails :

### Étape 1 : Aller dans le manager OVH

1. **Connectez-vous** : https://www.ovh.com/manager/
2. Allez dans : **`Bare Metal Cloud`** → **`Virtual private servers`**
3. **Cliquez sur votre VPS** (celui avec l'IP `37.59.110.130`)

### Étape 2 : Réinitialiser le mot de passe root

1. **Cherchez** l'onglet **"Informations générales"** ou **"Résumé"**
2. **Cherchez** un bouton **"Réinitialiser le mot de passe root"** ou **"Réinstallation"**
3. **Cliquez dessus**
4. **Choisissez** : Réinitialiser le mot de passe root (sans réinstaller)
5. **OVH va générer** un nouveau mot de passe
6. **Vous recevrez un email** avec le nouveau mot de passe

⚠️ **Important** : Ce nouveau mot de passe sera envoyé par **email** à l'adresse associée à votre compte OVH.

---

## 📱 Méthode 3 : Via l'interface VNC (si disponible)

Si vous ne recevez pas l'email :

1. Dans le manager OVH, cherchez **"Console KVM"** ou **"Console VNC"**
2. **Connectez-vous** via cette console
3. Vous pourrez changer le mot de passe directement depuis la console

---

## 🔍 Où trouver l'option de réinitialisation dans OVH

Dans la page de votre VPS, cherchez :

- **"IP"** → **"Actions"** → **"Réinitialiser le mot de passe root"**
- **"Boot"** → **"Réinstallation"** → Choisissez "Réinitialiser le mot de passe uniquement"
- **Menu "..."** (trois points) → **"Réinitialiser le mot de passe"**

---

## ✅ Une fois que vous avez le mot de passe

### Tester la connexion

```bash
ssh root@37.59.110.130
```

Entrez le mot de passe quand demandé.

### Changer le mot de passe (recommandé)

Une fois connecté, changez-le pour quelque chose que vous choisissez :

```bash
passwd
```

Suivez les instructions pour définir un nouveau mot de passe.

---

## 🆘 Si rien ne fonctionne

1. **Contactez le support OVH** : https://www.ovh.com/fr/support/
2. Expliquez que vous avez besoin de réinitialiser le mot de passe root de votre VPS
3. Donnez-leur l'IP : `37.59.110.130`

---

## 📋 Checklist

- [ ] Chercher dans vos emails OVH
- [ ] Essayer de réinitialiser via le manager OVH
- [ ] Vérifier votre boîte mail (y compris les spams)
- [ ] Contacter le support OVH si nécessaire





