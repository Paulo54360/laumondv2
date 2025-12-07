# 🔄 Redémarrer depuis le mode RESCUE

## ⚠️ Problème

L'erreur "Action not available for VPS in netboot mode rescue" signifie que vous ne pouvez **pas** redémarrer directement tant que le VPS est configuré en mode RESCUE.

## ✅ Solution : Changer le mode de boot D'ABORD

### Étape 1 : Aller dans l'onglet "Boot"

Dans l'interface OVH Manager :
1. Cliquez sur l'onglet **"Boot"** (à côté de "Accueil")

### Étape 2 : Changer en mode normal

Dans l'onglet Boot :
1. Vous verrez probablement **"Rescue"** sélectionné
2. Cherchez un bouton pour changer vers **"Boot normal"** ou **"Boot sur disque dur"**
   - Cela peut être un bouton **"Modifier"** ou **"Changer"**
   - Ou un menu déroulant

3. Sélectionnez **"Boot normal"** (ou équivalent)
4. **Sauvegardez** la modification

### Étape 3 : Redémarrer

**Maintenant** vous pouvez redémarrer :
1. Retournez dans l'onglet **"Accueil"** ou **"Boot"**
2. Cliquez sur **"..."** (trois points) à côté de votre VPS
3. Sélectionnez **"Redémarrer mon VPS"**
4. Confirmez

OU

1. Allez dans l'onglet **"Boot"**
2. Il devrait y avoir un bouton **"Redémarrer"** qui fonctionne maintenant

### Étape 4 : Attendre et se connecter

1. Attendez **1-2 minutes** que le VPS redémarre
2. Vérifiez que le statut passe à **"En cours d'exécution"**
3. Connectez-vous avec votre **nouveau mot de passe** :
   ```bash
   ssh root@37.59.110.130
   ```

---

## 🔍 Si vous ne trouvez pas l'option "Boot normal"

### Option A : Cherchez "Modifier le mode de boot"

Dans l'onglet **"Boot"**, cherchez :
- **"Modifier"** ou **"Éditer"**
- **"Changer le mode de boot"**
- **"Boot sur disque dur"**
- **"Boot normal"**

### Option B : Utilisez l'ancienne interface

Si vous êtes sur la nouvelle interface, cherchez un lien vers **"Ancienne interface"** en bas de page.

### Option C : Contactez le support OVH

Si vraiment rien ne fonctionne, contactez le support OVH qui peut changer le mode de boot pour vous.

---

## 📝 Résumé

1. ✅ Mot de passe changé (fait)
2. ⏭️ **Onglet "Boot"** → Changer en "Boot normal"
3. ⏭️ Redémarrer depuis l'interface
4. ⏭️ Se connecter avec le nouveau mot de passe

**Le point clé :** Il faut changer le mode de boot AVANT de redémarrer !


