// NusaStat — hand-in program (Node 22, standard library only).
// Copies the site (app/) and its screenshots into the output directory and
// writes dossier.json with the vendored make.fun library, exactly as the
// kit's starter does. Outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps from the scorer's gate: dossier text at most 160 KiB; at most 4
// screenshots of at most 256 KiB each; app/ at most 993 entries / 16 MiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
console.log('NusaStat dossier written to ' + out + '/dossier.json');
console.log('Dossier size: ' + statSync(join(out, 'dossier.json')).size + ' bytes; ' +
  'screenshots: ' + (existsSync(join(here, 'screenshots')) ? 'present' : 'missing'));
