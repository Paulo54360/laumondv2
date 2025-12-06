#!/bin/bash
# Script pour configurer la CI/CD sur votre VPS
# À exécuter sur votre Mac

echo "🔧 Configuration CI/CD pour déploiement automatique"
echo "=================================================="
echo ""

# Vérifier si la clé SSH existe déjà
SSH_KEY="$HOME/.ssh/github_actions_deploy"

if [ -f "$SSH_KEY" ]; then
    echo "⚠️  La clé SSH $SSH_KEY existe déjà"
    read -p "Voulez-vous la régénérer ? (o/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        rm -f "$SSH_KEY" "$SSH_KEY.pub"
        echo "✅ Ancienne clé supprimée"
    else
        echo "ℹ️  Utilisation de la clé existante"
    fi
fi

# Générer la clé si elle n'existe pas
if [ ! -f "$SSH_KEY" ]; then
    echo "📝 Génération de la clé SSH..."
    ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$SSH_KEY" -N ""
    echo "✅ Clé SSH générée"
fi

echo ""
echo "📋 Instructions :"
echo "================"
echo ""
echo "1. Copiez votre clé PUBLIQUE sur le VPS :"
echo ""
echo "   ssh-copy-id -i $SSH_KEY.pub root@37.59.110.130"
echo ""
echo "   OU manuellement :"
echo "   cat $SSH_KEY.pub"
echo "   (Puis ajoutez-la dans ~/.ssh/authorized_keys sur le VPS)"
echo ""
echo "2. Testez la connexion :"
echo ""
echo "   ssh -i $SSH_KEY root@37.59.110.130"
echo ""
echo "3. Sur GitHub, ajoutez ces secrets dans Settings > Secrets :"
echo ""
echo "   VPS_HOST = 37.59.110.130"
echo "   VPS_USER = root"
echo "   VPS_SSH_KEY = (contenu de la clé PRIVÉE ci-dessous)"
echo ""
echo "4. Pour obtenir la clé PRIVÉE (à mettre dans GitHub) :"
echo ""
echo "   cat $SSH_KEY"
echo ""
echo "⚠️  ATTENTION : Ne partagez JAMAIS votre clé privée publiquement !"
echo ""
echo "=================================================="

