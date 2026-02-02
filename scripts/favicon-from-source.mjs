#!/usr/bin/env node

/**
 * Génère public/favicon.ico à partir d'une image PNG (carrée ou recadrée en carré).
 * Usage: node scripts/favicon-from-source.mjs [input.png]
 * Défaut: public/favicon-source.png → public/favicon.ico
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(
    import.meta.url));
const root = path.resolve(__dirname, '..');
const inputPath = path.resolve(root, process.argv[2] || 'public/favicon-source.png');
const outputPath = path.resolve(root, 'public/favicon.ico');
const tempSquarePath = path.join(root, 'public', '.favicon-256.png');

async function main() {
    const meta = await sharp(inputPath).metadata();
    const { width = 0, height = 0 } = meta;
    const size = Math.max(width, height, 256);
    const squared = await sharp(inputPath)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .resize(256, 256)
        .png()
        .toFile(tempSquarePath);
    const icoBuffer = await pngToIco(tempSquarePath);
    fs.writeFileSync(outputPath, icoBuffer);
    fs.unlinkSync(tempSquarePath);
    console.log('Favicon généré:', outputPath);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});