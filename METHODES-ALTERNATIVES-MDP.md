# 🔧 Méthodes alternatives pour réinitialiser le mot de passe

## ❌ Si l'option n'apparaît pas dans les menus

Voici d'autres façons de réinitialiser ou contourner le problème :

---

## ✅ Méthode 1 : Via OVHcloud Shell (Recommandé)

Si vous êtes toujours dans OVHcloud Shell :

```bash
ovhcloud vps set-password vps-117c11c9.vps.ovh.net
```

Cela va déclencher le processus de réinitialisation du mot de passe.

---

## ✅ Méthode 2 : Utiliser la console KVM/VNC (SANS mot de passe)

C'est souvent la **meilleure solution** - la console KVM vous donne accès direct au VPS !

### Via OVHcloud Shell :

```bash
ovhcloud vps get-console-url vps-117c11c9.vps.ovh.net
```

Cela vous donne une URL. **Ouvrez-la dans un nouvel onglet** de votre navigateur.

### Ou chercher dans l'interface :

1. **Manager OVH** → Votre VPS
2. **Cherchez** dans les onglets du menu latéral :
   - **"Monitoring"**
   - **"Accès"**
   - **"Console"**
3. Ou cherchez un bouton **"Console KVM"** ou **"Console VNC"** quelque part sur la page

Une fois dans la console KVM, vous pourrez :
- Vous connecter directement au VPS
- Changer le mot de passe avec `passwd`
- Configurer SSH

---

## ✅ Méthode 3 : Mode rescue

Si la console KVM n'est pas disponible :

1. **Menu "Boot"** → **"..."** → **"Redémarrer en mode rescue"**
2. Suivez les instructions
3. Dans le mode rescue, vous pouvez changer le mot de passe
4. Puis redémarrer normalement

---

## ✅ Méthode 4 : Chercher dans d'autres onglets

Dans le menu latéral de votre VPS, vérifiez ces onglets :

- **"Monitoring"** → peut contenir l'accès console
- **"Bases de données"** → non, pas ici
- **"DNS Secondaire"** → non, pas ici
- **Autres onglets** disponibles

---

## ✅ Méthode 5 : Support OVH

Si rien ne fonctionne :

1. **Contactez le support OVH** : https://www.ovh.com/fr/support/
2. Expliquez que vous ne trouvez pas l'option pour réinitialiser le mot de passe root
3. Donnez-leur votre VPS : `vps-117c11c9.vps.ovh.net`

---

## 🎯 Solution recommandée IMMÉDIATE

**Utilisez la console KVM/VNC** (Méthode 2) :

Dans OVHcloud Shell, tapez :

```bash
ovhcloud vps get-console-url vps-117c11c9.vps.ovh.net
```

Cela vous donnera une URL à ouvrir dans votre navigateur. Vous pourrez accéder au VPS **sans avoir besoin du mot de passe SSH** !

Une fois dans la console, vous pourrez changer le mot de passe vous-même.



