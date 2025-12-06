# 🚀 Guide de connexion SSH à votre serveur OVH

## Étapes rapides

### 1. Trouver vos identifiants

1. Connectez-vous à : https://www.ovh.com/manager/
2. Allez dans **`Bare Metal Cloud`** → **`VPS`** (ou votre type de serveur)
3. Cliquez sur votre serveur
4. Notez :
   - **Adresse IPv4** (ex: `123.45.67.89`)
   - **Utilisateur SSH** (généralement `root`)

### 2. Se connecter en SSH

Sur votre Mac, ouvrez le Terminal et tapez :

```bash
ssh root@123.45.67.89
```

⚠️ Remplacez `123.45.67.89` par l'adresse IP de votre serveur.

### 3. Entrer le mot de passe

Lors de la première connexion :
- Vous verrez un message de confirmation → Tapez `yes`
- Entrez votre mot de passe SSH
- Si vous ne le connaissez pas, réinitialisez-le dans le manager OVH

### 4. Une fois connecté

Vous verrez quelque chose comme :
```bash
root@vps12345:~#
```

Vous êtes maintenant connecté ! 🎉

## Commandes utiles une fois connecté

```bash
# Voir où vous êtes
pwd

# Naviguer vers votre application (exemple)
cd /var/www/votre-app

# Voir les fichiers
ls -la

# Vérifier que Node.js est installé
node --version

# Quitter la session SSH
exit
```

## Besoin d'aide ?

Consultez le fichier `OVH-IDENTIFIANTS.md` pour plus de détails.

