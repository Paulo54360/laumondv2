#!/usr/bin/env node
/**
 * Script pour préparer les fichiers de déploiement
 * Crée un dossier .deploy/ avec les fichiers nécessaires selon le type d'hébergement
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const DEPLOY_DIR = '.deploy';

function cleanDeployDir() {
  if (fs.existsSync(DEPLOY_DIR)) {
    fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });
}

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source n'existe pas: ${src}`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function prepareStatic() {
  console.log('📦 Préparation pour déploiement STATIQUE...\n');

  // Vérifier que generate a été fait
  if (!fs.existsSync('.output/public')) {
    console.error("❌ .output/public n'existe pas. Exécutez d'abord: npm run generate");
    process.exit(1);
  }

  cleanDeployDir();
  copyDir('.output/public', path.join(DEPLOY_DIR, 'public'));

  console.log('✅ Fichiers prêts dans .deploy/public/');
  console.log('📤 Déployez tout le contenu de .deploy/public/ via Cyberduck\n');
}

function prepareNode() {
  console.log('📦 Préparation pour déploiement NODE.JS...\n');

  // Vérifier que build a été fait
  if (!fs.existsSync('.output')) {
    console.error("❌ .output n'existe pas. Exécutez d'abord: npm run build");
    process.exit(1);
  }

  cleanDeployDir();
  copyDir('.output', path.join(DEPLOY_DIR, 'output'));

  // Créer un fichier README avec les instructions
  const readme = `# Instructions de déploiement

## Fichiers déployés
Déployez tout le contenu du dossier 'output/' sur votre serveur.

## Configuration serveur

### Point d'entrée
\`node output/server/index.mjs\`

### Variables d'environnement nécessaires
- SUPABASE_URL
- SUPABASE_KEY

### Package.json pour PM2 ou autre process manager
{
  "name": "laumond-nuxt",
  "scripts": {
    "start": "node output/server/index.mjs"
  }
}

## Vérification
Une fois déployé, vérifiez que :
- ✅ La page d'accueil charge
- ✅ La recherche fonctionne (/api/search)
- ✅ Les images s'affichent
`;

  fs.writeFileSync(path.join(DEPLOY_DIR, 'README-DEPLOY.md'), readme);

  console.log('✅ Fichiers prêts dans .deploy/output/');
  console.log('📤 Déployez tout le contenu de .deploy/output/ via Cyberduck');
  console.log('📋 Instructions dans .deploy/README-DEPLOY.md\n');
}

// Main
const mode = process.argv[2] || 'node';

if (mode === 'static') {
  prepareStatic();
} else if (mode === 'node') {
  prepareNode();
} else {
  console.error('Usage: tsx scripts/prepare-deploy.ts [static|node]');
  console.error('  static - Pour hébergement statique (sans Node.js)');
  console.error('  node   - Pour hébergement avec Node.js (par défaut)');
  process.exit(1);
}
