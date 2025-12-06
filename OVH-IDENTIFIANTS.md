# 🔑 Comment récupérer vos identifiants OVH

## 📍 Où trouver vos identifiants

### 1. Connectez-vous à votre espace client OVH

Allez sur : **https://www.ovh.com/manager/** ou **https://www.ovh.com/auth/**

Connectez-vous avec :
- Votre **nic-handle** (ex: `ab12345-ovh`) ou votre **email**
- Votre **mot de passe**

---

## 🖥️ Si vous avez un VPS ou serveur Cloud

### Identifier votre serveur

1. **Connectez-vous au manager OVH**
2. Allez dans : **`Bare Metal Cloud`** → **`VPS`** (ou **`Serveurs dédiés`** ou **`Instances`**)
3. Cliquez sur votre serveur

### Récupérer les informations de connexion SSH

#### Option A : Dans l'interface OVH

1. Dans la page de votre serveur, cherchez :
   - **"Informations générales"** ou **"Résumé"**
   - **"IP"** ou **"Adresse IPv4"** → C'est l'adresse de votre serveur
   - **"Utilisateur SSH"** ou **"Nom d'utilisateur"** → Généralement `root` ou `ubuntu` ou `debian`

2. Pour le mot de passe SSH :
   - Si vous l'avez défini lors de la création, vous le connaissez
   - Sinon, allez dans **"Réinstallation"** → **"Mot de passe root"** pour le réinitialiser

#### Option B : Via email OVH

OVH vous a envoyé un email lors de la création de votre serveur avec :
- L'adresse IP
- Le nom d'utilisateur
- Le mot de passe initial (si défini)

---

## 🌐 Si vous avez un hébergement Web Cloud

### Pour SSH (si disponible)

1. Allez dans : **`Web Cloud`** → **`Hébergements`** → Votre hébergement
2. Cherchez l'onglet : **"FTP - SSH"** ou **"Accès SSH"**
3. Vous verrez :
   - **Serveur SSH** : `ssh.clusterXXX.ovh.net` (XXX = numéro)
   - **Utilisateur SSH** : Généralement votre identifiant FTP
   - **Port SSH** : Généralement `22`

⚠️ **Note** : L'accès SSH n'est pas toujours disponible sur les hébergements mutualisés classiques.

---

## 🔍 Détails de connexion

### Format de connexion SSH

```bash
ssh utilisateur@adresse-serveur
```

Exemples :
```bash
# VPS OVH
ssh root@123.45.67.89

# Serveur avec nom de domaine
ssh root@votre-serveur.ovh.net

# Hébergement Web (si SSH disponible)
ssh votre-ftp-user@ssh.clusterXXX.ovh.net
```

### Identifiants courants selon le type de serveur

| Type de serveur | Utilisateur par défaut | Port |
|----------------|----------------------|------|
| VPS OVH Linux | `root` ou `ubuntu` ou `debian` | 22 |
| Serveur dédié OVH | `root` | 22 |
| Hébergement Web | Votre identifiant FTP | 22 |

---

## 🔐 Si vous avez oublié votre mot de passe SSH

### Pour un VPS/Cloud

1. **Via le manager OVH** :
   - Allez dans votre serveur
   - Cliquez sur **"Réinstallation"** ou **"Réinitialisation"**
   - Choisissez **"Réinitialiser le mot de passe root"**
   - Un nouveau mot de passe vous sera envoyé par email

2. **Via le manager OVH (réinitialisation)** :
   - Allez dans votre serveur → **"IP"** → **"Actions"**
   - **"Réinitialiser le mot de passe root"**
   - Vous recevrez un email avec le nouveau mot de passe

### Pour un hébergement Web

- Le mot de passe SSH est généralement le même que votre mot de passe FTP
- Vous pouvez le réinitialiser dans : **`Web Cloud`** → **`Hébergements`** → **"FTP - SSH"** → **"Modifier le mot de passe"**

---

## 🌍 Si vous avez un nom de domaine

Votre serveur peut aussi être accessible via votre nom de domaine :

```bash
ssh root@votre-domaine.com
```

---

## ✅ Tester la connexion

Une fois que vous avez vos identifiants, testez la connexion :

```bash
ssh utilisateur@adresse-serveur
```

Si c'est la première fois, vous verrez :
```
The authenticity of host '...' can't be established.
Are you sure you want to continue connecting (yes/no)?
```
Tapez `yes` puis Entrée.

Ensuite, entrez votre mot de passe.

---

## 🔑 Créer une clé SSH (optionnel, plus sécurisé)

Pour éviter de taper le mot de passe à chaque fois :

### 1. Générer une clé SSH sur votre Mac

```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
```

Appuyez sur Entrée pour accepter l'emplacement par défaut.

### 2. Copier la clé publique sur votre serveur

```bash
ssh-copy-id utilisateur@adresse-serveur
```

### 3. Tester la connexion sans mot de passe

```bash
ssh utilisateur@adresse-serveur
```

Vous devriez vous connecter sans mot de passe !

---

## 📞 Besoin d'aide ?

Si vous ne trouvez pas vos identifiants :

1. **Consultez vos emails OVH** (recherchez "OVH" dans votre boîte mail)
2. **Contactez le support OVH** : https://www.ovh.com/fr/support/
3. **Vérifiez la documentation OVH** : https://docs.ovh.com/

---

## 📝 Résumé rapide

Pour vous connecter en SSH, vous avez besoin de :

1. ✅ **Adresse du serveur** (IP ou nom de domaine) → Trouvée dans le manager OVH
2. ✅ **Nom d'utilisateur** (généralement `root` pour un VPS) → Trouvé dans le manager OVH
3. ✅ **Mot de passe** → Celui que vous avez défini ou reçu par email, sinon réinitialisez-le

Une fois ces 3 informations en main, vous pouvez vous connecter !

