# 🔐 Passer en root sur le VPS

## ⚠️ Problème

Vous êtes connecté avec l'utilisateur `ubuntu` au lieu de `root`. Pour installer Node.js, vous devez avoir les droits administrateur.

## ✅ Solution : Passer en root

### Option 1 : Utiliser `sudo su` (recommandé)

```bash
sudo su
```

Vous passerez en root. Le prompt changera de :
```
ubuntu@vps-117c11c9:~$ 
```

à :
```
root@vps-117c11c9:/home/ubuntu#
```

### Option 2 : Utiliser `sudo` devant chaque commande

Au lieu de passer en root, vous pouvez utiliser `sudo` :

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
sudo curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
sudo apt install -y nodejs
```

### Option 3 : Se reconnecter directement en root

Si vous connaissez le mot de passe root que vous avez configuré :

```bash
exit  # Déconnecter la session ubuntu
ssh root@37.59.110.130  # Se reconnecter en root
```

---

## 🎯 Recommandation

**Utilisez `sudo su`** pour passer en root, c'est le plus simple pour la suite.

Une fois en root, vous pourrez installer Node.js sans problème.

