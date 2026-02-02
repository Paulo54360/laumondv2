## Contexte

`laumond-nuxt` est le site vitrine de Patrick Laumond, développé rapidement en Nuxt.
Le site est **en production**, avec une **CI/CD Docker + VPS** qui fonctionne et un **rendu visuel satisfaisant**.

Aujourd’hui, le code est perçu comme une **“boîte noire”** : architecture confuse, difficulté à comprendre ce qui fait quoi, crainte de casser la prod à chaque modification.

## Problème actuel

- **Prod fragile** : chaque push nécessite des vérifications manuelles importantes.
- **Forte dépendance à l’IA** pour la moindre modification, faute de compréhension de l’architecture actuelle.
- **Architecture et structure de code peu claires** (pages, composants, flux de données, configuration).
- **Scalabilité limitée** : difficile d’ajouter de nouvelles fonctionnalités sereinement.
- **Sentiment de ne pas être fier du code**, même si le résultat visuel est bon.

## Objectifs du refactor

1. **Rendre le projet compréhensible et maitrisé**
   - Pouvoir expliquer simplement la structure (pages, composants, services, données).
   - Réduire la dépendance à l’IA pour les modifications courantes.

2. **Stabiliser la production**
   - Réduire drastiquement le risque de casse à chaque déploiement.
   - Garder la CI/CD Docker + VPS qui fonctionne, en la clarifiant si nécessaire.

3. **Mettre en place une architecture simple et scalable**
   - Structure de dossiers claire (pages, composants, services, styles, config).
   - Flux de données et appels externes localisés et cohérents.
   - Pas de sur-développement : seulement ce qui sert le site actuel + sa future évolution raisonnable.

4. **Nettoyer et assainir le code**
   - Supprimer le code mort / deprecated / non utilisé.
   - Réduire les duplications évidentes.
   - Clarifier les dépendances (libs front, plugins, middlewares, etc.).

5. **Documenter le minimum vital**
   - Document court expliquant l’architecture cible.
   - Quelques conventions de code et de structure (où mettre quoi, comment nommer, comment ajouter une page ou une section).

6. **Préparer l’apprentissage et la fierté**
   - S’aligner sur des bonnes pratiques Nuxt/Vue raisonnables (sans usine à gaz).
   - Arriver à un état où le propriétaire du projet est **fier** du code autant que du rendu.

## Périmètre

### Inclus dans le refactor

- **Code Nuxt/Vue**
  - Pages, layouts, composants, composables/services.
  - Gestion des données et appels API (ou équivalents).
  - Configuration Nuxt et modules utilisés.
- **Organisation des styles**
  - Respect des tokens/design actuels.
  - Clarification de l’organisation CSS/SCSS/Tailwind (selon ce qui est utilisé).
- **Nettoyage et simplification**
  - Suppression du code mort et des expérimentations anciennes.
  - Réduction des patterns trop complexes ou inutiles.
- **Documentation**
  - Documentation minimale mais claire (architecture + conventions).

### Exclu ou à ne pas casser

- **Rendu visuel actuel**
  - Look & feel, animations, layout général : doivent rester identiques (sauf corrections mineures de bugs).
- **Fonctionnalités existantes**
  - Tout ce qui fonctionne aujourd’hui doit continuer à fonctionner après refactor.
- **Pipeline CI/CD fonctionnel**
  - Docker + déploiement VPS doivent continuer à marcher (améliorations possibles mais sans tout réécrire).

## Contraintes

- **Pas de sur-dev** : pas de nouvelles fonctionnalités majeures tant que le refactor de base n’est pas stabilisé.
- **Itératif** : avancer par petits lots (par zone du code) pour garder la prod stable.
- **Temps** : pas de pression business immédiate, mais viser un refactor qui tienne en quelques semaines, pas plusieurs mois.

## Indicateurs de réussite

- Tu peux :
  - **Ajouter ou modifier une page ou un composant simple sans avoir peur** de casser la prod.
  - **Expliquer la structure du projet** à quelqu’un en quelques minutes.
  - **Faire un déploiement sans devoir tout vérifier manuellement** à chaque fois.
- Le dépôt ne contient plus :
  - De gros blocs de code manifestement morts / non utilisés.
  - De “magie” incompréhensible sans commentaire ou structure.
- Il existe :
  - Un document d’architecture simple.
  - Un ensemble de règles/conventions courtes pour garder le projet propre.

## Risques & garde-fous

- **Risque** : refactor trop ambitieux → on réécrit tout → on ralentit pour rien.  
  **Garde-fou** : garder les objectifs simples et revenir régulièrement au périmètre défini ici.

- **Risque** : casser le design ou des comportements subtils.  
  **Garde-fou** : vérifier systématiquement les pages clés après chaque lot de refactor, garder des comparaisons visuelles simples.

- **Risque** : retomber dans le flou dans 6 mois.  
  **Garde-fou** : garder la documentation courte mais à jour, et respecter les conventions décidées.

