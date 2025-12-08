# 🔑 Changer le mot de passe root

## Option 1 : Depuis le mode RESCUE (actuel)

Si vous êtes encore en mode RESCUE, vous pouvez changer le mot de passe :

### Étapes :

1. **Monter le disque système** :

```bash
mount /dev/sdb1 /mnt
```

Si ça ne fonctionne pas, vérifiez quel disque :

```bash
lsblk
```

Puis montez le bon disque (généralement `/dev/sdb1` ou `/dev/sda1`).

2. **Changer le mot de passe** :

```bash
chroot /mnt
passwd root
```

Entrez le nouveau mot de passe deux fois.

3. **Quitter** :

```bash
exit
umount /mnt
```

4. **Redémarrer en mode normal** (depuis OVH Manager)

---

## Option 2 : Depuis le mode normal (Recommandé - Plus simple)

1. **Redémarrez en mode normal** :
   - Manager OVH → Votre VPS → Boot → Redémarrer normalement
   
2. **Connectez-vous** :

```bash
ssh root@37.59.110.130
```

3. **Changez le mot de passe** :

```bash
passwd
```

Entrez le nouveau mot de passe deux fois.

✅ C'est fait !

---

## 🎯 Recommandation

**Option 2 est plus simple** - redémarrer en mode normal puis utiliser `passwd`.

Mais si vous voulez le faire maintenant depuis le mode rescue, utilisez l'Option 1.





