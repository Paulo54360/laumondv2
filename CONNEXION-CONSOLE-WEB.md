# 🌐 Se connecter via la console web OVH

## 📍 Où trouver la console web

### Option 1 : Via le menu latéral

1. **Manager OVH** → Votre VPS
2. Dans le **menu latéral à gauche**, cherchez :
   - **"Console KVM"**
   - **"Console VNC"**
   - **"Console"**
   - **"Accès console"**

### Option 2 : Via les onglets

1. **Manager OVH** → Votre VPS
2. Cherchez dans les **onglets en haut** :
   - **"Monitoring"** → peut contenir l'accès console
   - **"Accueil"** → peut avoir un bouton console

### Option 3 : Via le menu Actions

1. **Manager OVH** → Votre VPS
2. Cherchez le bouton **"Actions"** ou **"..."** (trois points)
3. Dans le menu, cherchez **"Console"** ou **"Accès console"**

---

## 🖥️ Utiliser la console web

Une fois que vous cliquez sur "Console", une **fenêtre s'ouvre** dans votre navigateur avec un terminal.

### Se connecter

1. **Tapez** `root` puis Entrée
2. **Entrez le mot de passe** : `TcXc6YHptp7N` (ou celui que vous avez généré)
3. **Appuyez sur Entrée**

✅ Vous êtes connecté !

---

## ✅ Une fois connecté via la console web

### Changer le mot de passe

```bash
passwd
```

Définissez un nouveau mot de passe que vous retiendrez.

### Activer SSH (si nécessaire)

```bash
systemctl status ssh
```

Si ce n'est pas actif :

```bash
systemctl start ssh
systemctl enable ssh
```

### Vérifier que SSH fonctionne

```bash
systemctl status ssh
```

Doit afficher `active (running)`.

---

## 🔑 Ensuite : Configurer la clé SSH

Une fois connecté et le mot de passe changé, vous pouvez configurer la clé SSH pour GitHub Actions.

### Depuis votre Mac

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@37.59.110.130
```

Utilisez votre **nouveau mot de passe** quand demandé.

---

## 📋 Avantages de la console web

- ✅ Fonctionne **même si SSH est désactivé**
- ✅ **Pas besoin** de configurer SSH avant
- ✅ **Accès direct** au serveur
- ✅ Permet de **réparer SSH** si nécessaire





