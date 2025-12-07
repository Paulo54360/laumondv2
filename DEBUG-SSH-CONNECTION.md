# 🔧 Dépannage : Problème de connexion SSH

## ❌ Problème : Permission denied

Le mot de passe ne fonctionne pas. Voici plusieurs solutions :

---

## 🔍 Solution 1 : Vérifier le mot de passe

### Le mot de passe OVH est sensible à la casse

- Vérifiez que vous avez bien copié **exactement** : `TcXc6YHptp7N`
- **Sans espaces** avant ou après
- **Majuscules/minuscules** sont importantes

### Copier-coller directement

1. Dans l'interface OVH, **cliquez sur l'icône "copier"** à côté du mot de passe
2. Dans le Terminal, **collez** directement (Cmd+V)
3. **Appuyez sur Entrée**

---

## 🔍 Solution 2 : Utiliser la console web OVH

Au lieu de SSH direct, utilisez la console web :

1. **Dans le manager OVH**, allez dans votre VPS
2. **Cherchez** "Console KVM" ou "Console VNC" ou "Console web"
3. **Cliquez dessus**
4. Une **fenêtre de terminal** s'ouvre dans votre navigateur
5. Connectez-vous directement depuis cette console

---

## 🔍 Solution 3 : Attendre quelques minutes

Parfois, le mot de passe prend **quelques minutes** à être activé après génération.

**Attendez 2-3 minutes** puis réessayez.

---

## 🔍 Solution 4 : Vérifier que SSH est activé

### Via la console web OVH :

1. Connectez-vous via la **console web** (voir Solution 2)
2. Vérifiez que le service SSH est actif :

```bash
systemctl status ssh
```

Si ce n'est pas actif :

```bash
systemctl start ssh
systemctl enable ssh
```

---

## 🔍 Solution 5 : Réinitialiser à nouveau le mot de passe

1. **Retournez dans OVH** → Votre VPS
2. **Générez un nouveau mot de passe** (l'ancien expire après un certain temps)
3. **Copiez le nouveau mot de passe**
4. **Réessayez** immédiatement

---

## 🔍 Solution 6 : Utiliser le mode rescue

Si rien ne fonctionne :

1. Dans OVH → Votre VPS → Menu "Boot"
2. **Cliquez sur "Redémarrer en mode rescue"**
3. **Suivez les instructions** pour accéder en mode rescue
4. **Changez le mot de passe** depuis le mode rescue
5. **Redémarrez** normalement

---

## ✅ Solution recommandée : Console web OVH

**La solution la plus simple** est d'utiliser la console web d'OVH :

1. **Manager OVH** → Votre VPS
2. **Cherchez** "Console" ou "KVM" dans le menu
3. **Cliquez dessus**
4. **Connectez-vous** directement depuis le navigateur

Une fois connecté via la console web, vous pourrez :
- Changer le mot de passe
- Configurer SSH correctement
- Copier la clé SSH



