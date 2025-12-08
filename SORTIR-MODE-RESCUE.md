# 🔧 Sortir du mode RESCUE

## 📍 Situation actuelle

Vous êtes connecté en **mode RESCUE**. C'est un mode spécial pour réparer le système.

**Indicateur** : Vous voyez `[RESCUE]` dans votre prompt.

---

## ✅ Solution : Redémarrer en mode normal

### Option 1 : Via l'interface OVH (Recommandé)

1. **Allez dans** Manager OVH → Votre VPS
2. **Bloc "Votre VPS"** → **"Boot"** → Cliquez sur **"..."** (trois points)
3. **Choisissez** : **"Redémarrer mon VPS"** (pas "mode rescue")
4. Attendez que le VPS redémarre (1-2 minutes)

### Option 2 : Depuis le mode rescue (si vous voulez rester)

Vous pouvez aussi changer le mot de passe depuis le mode rescue, mais c'est plus complexe.

---

## 🎯 Action recommandée

**Quittez le mode rescue** et **redémarrez normalement** :

1. **Fermez** votre session SSH : Tapez `exit`
2. **Dans OVH Manager** → Votre VPS → Boot → Redémarrer normalement
3. **Attendez 1-2 minutes** que le VPS redémarre
4. **Reconnectez-vous** :

```bash
ssh root@37.59.110.130
```

Utilisez le mot de passe : `Y6qtLBDK7d5a` (celui affiché dans le mode rescue)

---

## ✅ Une fois en mode normal

Une fois que vous êtes connecté en mode normal (sans `[RESCUE]`), vous pourrez :

1. **Réinstaller Node.js et PM2** (le VPS est vierge)
2. **Configurer votre application**
3. **Déployer votre application**

---

## 📝 Note

Le mot de passe `Y6qtLBDK7d5a` est celui du mode rescue. Une fois en mode normal, vous devrez peut-être utiliser le mot de passe que vous avez défini lors de la réinstallation, ou en générer un nouveau.





