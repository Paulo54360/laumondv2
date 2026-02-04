# Configuration CORS du bucket S3

Sans CORS, le navigateur bloque l’affichage des images S3 quand le site est servi depuis une autre origine (ex. `http://localhost:3000` ou ton domaine de prod). Les requêtes vers `https://plaumondpicture.s3.eu-west-3.amazonaws.com/...` échouent avec : *"blocked by CORS policy: No 'Access-Control-Allow-Origin' header"*.

## Étapes dans la console AWS

1. Ouvre **AWS Console** → **S3** → bucket **plaumondpicture**.
2. Onglet **Permissions** (Autorisations).
3. Descends jusqu’à **Cross-origin resource sharing (CORS)**.
4. Clique **Edit** et colle la configuration suivante (ajuste les origines si besoin) :

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://ton-domaine-production.com"
    ],
    "ExposeHeaders": []
  }
]
```

5. Remplace `https://ton-domaine-production.com` par l’URL réelle du site en production (ex. `https://patricklaumond.com`).
6. Enregistre les changements.

Après sauvegarde, les images du bucket (galerie, recherche, modale) devraient s’afficher depuis localhost et depuis ton domaine.

## Vérification

- Recharge la page (ex. `/fr/deployments` ou la recherche).
- En cas d’erreur CORS persistante, vérifie que l’origine dans la barre d’adresse correspond exactement à une des valeurs dans `AllowedOrigins` (schéma + domaine + port).
