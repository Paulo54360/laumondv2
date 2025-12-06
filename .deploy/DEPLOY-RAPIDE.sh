#!/bin/bash
# Script de déploiement rapide pour VPS OVH
# À exécuter sur votre VPS en SSH après avoir uploadé les fichiers

echo "🚀 Déploiement de l'application Laumond Nuxt"
echo "=========================================="
echo ""

# Vérifier qu'on est dans le bon dossier
if [ ! -f "server/index.mjs" ]; then
    echo "❌ Erreur: Le fichier server/index.mjs n'existe pas"
    echo "   Assurez-vous d'être dans le dossier de l'application"
    exit 1
fi

echo "✅ 1. Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js n'est pas installé. Installation en cours..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    echo "   Node.js $(node --version) est installé"
fi

echo ""
echo "✅ 2. Installation de PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo "   PM2 installé"
else
    echo "   PM2 est déjà installé"
fi

echo ""
echo "✅ 3. Vérification du fichier .env..."
if [ ! -f ".env" ]; then
    echo "⚠️  Le fichier .env n'existe pas"
    echo "   Créez-le avec: nano .env"
    echo "   Ajoutez vos variables SUPABASE_URL, SUPABASE_KEY, etc."
    exit 1
else
    echo "   Fichier .env trouvé"
    chmod 600 .env
fi

echo ""
echo "✅ 4. Installation des dépendances..."
cd server
npm install --production
cd ..

echo ""
echo "✅ 5. Démarrage de l'application avec PM2..."
pm2 stop laumond-nuxt 2>/dev/null  # Arrêter si déjà en cours
pm2 start server/index.mjs --name "laumond-nuxt"
pm2 save

echo ""
echo "✅ 6. Configuration de PM2 pour démarrage automatique..."
pm2 startup | tail -1 | bash

echo ""
echo "=========================================="
echo "✅ Déploiement terminé !"
echo ""
echo "📊 Statut de l'application:"
pm2 status
echo ""
echo "📝 Pour voir les logs: pm2 logs laumond-nuxt"
echo "🌐 Application accessible sur: http://localhost:3000"
echo ""
echo "⚠️  N'oubliez pas de configurer Nginx pour votre domaine !"

