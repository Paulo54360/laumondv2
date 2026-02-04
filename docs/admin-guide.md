# Guide utilisateur — Back-office Patrick Laumond

Guide d’utilisation du back-office pour Patrick (édition des œuvres et des textes).

---

## Accès

1. Se connecter à la page `/admin/login` (ou `/en/admin/login` en anglais)
2. Saisir l’email et le mot de passe configurés (voir [admin-setup.md](admin-setup.md))
3. Après connexion : accès aux pages **Liste des œuvres**, **Ajouter une œuvre**, **Textes**

---

## Gestion des œuvres

### Liste des œuvres

- **URL** : `/admin/artworks`
- Affiche toutes les œuvres avec miniature, titre, catégorie, date
- **Modifier** : ouvre la page d’édition
- **Supprimer** : envoie l’œuvre dans la corbeille (soft delete)
- **Pagination** : boutons Précédent / Suivant

### Ajouter une œuvre

- **URL** : `/admin/upload`
- Renseigner : **Titre** (FR et EN), **Description** (optionnelle), **Catégorie**
- Glisser-déposer ou sélectionner des images (JPEG/PNG, max 10 Mo chacune)
- Cliquer sur **Publier l’œuvre**

### Modifier une œuvre

- Depuis la liste, cliquer sur **Modifier**
- Modifier les métadonnées (titre, description, catégorie)
- **Images** : supprimer des images existantes, ou en ajouter de nouvelles
- L’œuvre doit garder au moins une image
- Cliquer sur **Enregistrer**

### Corbeille

- **URL** : `/admin/artworks/trash`
- Affiche les œuvres supprimées (soft delete)
- **Restaurer** : remet l’œuvre dans la liste active
- **Supprimer définitivement** : supprime l’œuvre et ses images (irréversible)

---

## Gestion des textes

### Édition des textes éditoriaux

- **URL** : `/admin/texts`
- Sections disponibles : **Biographie**, **Métahisme**, **Biographie (accueil)**, **Métahisme (accueil)**
- Chaque section a des onglets **Français** et **English**
- Onglet **Aperçu** : prévisualisation du rendu Markdown

### Markdown supporté

| Syntaxe      | Effet          | Exemple              |
| ------------ | -------------- | -------------------- |
| `**texte**`  | Gras           | **gras**             |
| `*texte*`    | Italique       | *italique*           |
| `[lien](url)`| Lien cliquable | [exemple](https://…) |
| `## Titre`   | Titre niveau 2 | ## Section           |

### Enregistrer

- Modifier le contenu dans la zone de texte
- Cliquer sur **Enregistrer** pour sauvegarder les changements

### Restaurer la version précédente

- Si une modification est erronée, cliquer sur **Restaurer la version précédente**
- Le contenu revient à l’état de la dernière sauvegarde
- S’il n’y a jamais eu de sauvegarde pour cette section, le bouton affichera un message d’erreur

---

## Sécurité & bonnes pratiques

- Se déconnecter après utilisation (bouton **Déconnexion**)
- Ne pas partager les identifiants
- Faire des sauvegardes régulières (les textes ont un historique automatique avant chaque modification)

---

## Voir aussi

- [Configuration Admin](admin-setup.md) — création du compte, variables d’environnement
- [Migrations BDD](migrations.md) — migrations SQL et scripts de données
