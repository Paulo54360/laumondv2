# 🔑 Changer le mot de passe depuis le mode RESCUE

## ⚠️ Important

**Quitter le mode rescue ne change PAS le mot de passe automatiquement.**

- Le mode rescue a son propre système d'authentification
- Quand vous redémarrez en mode normal, vous revenez au mot de passe root original
- Si ce mot de passe ne fonctionne plus, changez-le **AVANT** de quitter le mode rescue

---

## 📋 Étapes détaillées

### 1️⃣ Vérifier que vous êtes en mode RESCUE

Vous devriez voir quelque chose comme `rescue-*` dans votre prompt :

```bash
rescue-customer:~#
```

### 2️⃣ Identifier le disque système

```bash
lsblk
```

Vous verrez quelque chose comme :
```
NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sda     8:0    0   20G  0 disk
├─sda1  8:1    0   19G  0 part
└─sda2  8:2    0  512M  0 part
```

Le disque principal est généralement `/dev/sda1` ou `/dev/sdb1`.

### 3️⃣ Monter le disque système

```bash
mount /dev/sda1 /mnt
```

**Si ça ne fonctionne pas**, essayez `/dev/sdb1` :

```bash
mount /dev/sdb1 /mnt
```

**Si ça ne fonctionne toujours pas**, vérifiez quel disque contient votre système :

```bash
blkid | grep -v rescue
```

### 4️⃣ Changer le mot de passe root

```bash
chroot /mnt
passwd root
```

**Entrez votre nouveau mot de passe deux fois** (il sera caché à l'écran, c'est normal).

Vous devriez voir :
```
New password: 
Retype new password: 
passwd: password updated successfully
```

### 5️⃣ Quitter le chroot et démonter

```bash
exit
umount /mnt
```

### 6️⃣ Redémarrer en mode normal

**Depuis OVH Manager** :
1. Allez dans votre VPS
2. Onglet **Boot**
3. Cliquez sur **"..."** à droite de "Rescue"
4. Sélectionnez **"Redémarrer mon VPS"**
5. Sélectionnez **"Boot normal"** (pas Rescue)
6. Confirmez

Attendez 1-2 minutes que le VPS redémarre.

### 7️⃣ Tester la connexion

```bash
ssh root@37.59.110.130
```

Utilisez le **nouveau mot de passe** que vous venez de définir.

---

## 🔍 Si ça ne fonctionne pas

### Erreur "mount: /mnt: mount point does not exist"

```bash
mkdir -p /mnt
mount /dev/sda1 /mnt
```

### Erreur "mount: wrong fs type"

Essayez avec le type de système de fichiers :

```bash
mount -t ext4 /dev/sda1 /mnt
```

### Vous ne voyez pas de disques avec `lsblk`

Le système peut être sur un autre contrôleur. Essayez :

```bash
fdisk -l
```

### Le mot de passe ne fonctionne toujours pas après redémarrage

1. Utilisez la **console web OVH** (KVM/VNC) pour vous connecter directement
2. Depuis là, vous pouvez utiliser `passwd` directement
3. Consultez le guide `CONNEXION-CONSOLE-WEB.md`

---

## ✅ Résumé

```bash
# 1. Voir les disques
lsblk

# 2. Monter (remplacez sda1 par le bon disque)
mount /dev/sda1 /mnt

# 3. Changer le mot de passe
chroot /mnt
passwd root
# (entrez le nouveau mot de passe)
exit

# 4. Démonter
umount /mnt

# 5. Redémarrer en mode normal depuis OVH Manager
```


