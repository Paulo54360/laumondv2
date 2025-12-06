#!/bin/bash
# Script pour créer le fichier .env sur le serveur OVH
# Exécutez ce script sur votre serveur après le déploiement

echo "📝 Création du fichier .env..."

cat > .env << 'EOF'
# Variables d'environnement pour Laumond Nuxt
# ⚠️ REMPLACEZ les valeurs ci-dessous par vos vraies valeurs

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NUXT_PUBLIC_API_URL=https://plaumondpicture.s3.eu-west-3.amazonaws.com

PORT=3000
NODE_ENV=production
EOF

# Sécuriser le fichier
chmod 600 .env

echo "✅ Fichier .env créé !"
echo "⚠️  N'oubliez pas d'éditer .env et de remplacer les valeurs par vos vraies clés"
echo ""
echo "Pour éditer :"
echo "  nano .env"

