import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const collectionsDir = path.join(root, 'public', 'images', 'collections');
const outPath = path.join(root, 'public', 'collection-manifest.json');

const CATEGORIES = [
  'necklaces',
  'earrings-rings',
  'bracelets-bangles',
  'perfume',
  'crochet',
];

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const IGNORED_IMAGE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\./i;

const manifest = {};

for (const categoryId of CATEGORIES) {
  const dir = path.join(collectionsDir, categoryId);
  if (!fs.existsSync(dir)) {
    manifest[categoryId] = [];
    continue;
  }

  manifest[categoryId] = fs
    .readdirSync(dir)
    .filter((filename) => IMAGE_EXT.test(filename) && !IGNORED_IMAGE_PATTERN.test(filename))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${outPath}`);
