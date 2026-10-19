/**
 * Builds the `@iatec/nephos` package into `dist/` (P70, amended by P74).
 *
 * Steps, in order. Any failure stops the build with its exit code:
 *   1. clean `dist/`;
 *   2. JavaScript, one ES module per component (`vite.config.lib.ts`);
 *   3. declarations, `.d.ts` (`tsconfig.build.json`), made valid for a consumer
 *      that resolves as `node16`/`nodenext`: relative specifiers get the `.js`
 *      extension, and the stylesheet import (`import './nph-label.css'`) is
 *      dropped, because it says nothing about a type;
 *   4. the two public stylesheets, copied as they are: the generated tokens
 *      and the native scrollbar colour. Nothing about a token is changed here;
 *   5. the Custom Elements Manifest (`custom-elements-manifest.config.mjs`).
 *
 * Run with: npm run build:lib
 * Check the result with: npm run test:package, then npm run pack:check
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const bin = (name) => join(root, 'node_modules', '.bin', name);

function run(label, command, args) {
  console.log(`\n> ${label}`);
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

run('javascript (vite)', bin('vite'), ['build', '--config', 'vite.config.lib.ts']);
run('declarations (tsc)', bin('tsc'), ['--project', 'tsconfig.build.json']);

/** Declarations are written by `tsc` as the source imports them: no extension. */
function fixDeclarations(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) {
      fixDeclarations(path);
    } else if (entry.name.endsWith('.d.ts')) {
      const text = readFileSync(path, 'utf8')
        .replace(/^import\s+['"]\.{1,2}\/[^'"]+\.css['"];\r?\n/gm, '')
        .replace(/((?:from|import)\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (match, open, specifier, close) =>
          /\.[cm]?js$/.test(specifier) ? match : `${open}${specifier}.js${close}`,
        );
      writeFileSync(path, text);
    }
  }
}
console.log('\n> declarations: node16 resolution');
fixDeclarations(dist);

console.log('\n> stylesheets');
copyFileSync(join(root, 'src/tokens/generated/tokens.css'), join(dist, 'tokens.css'));
copyFileSync(join(root, 'src/styles/scrollbar.css'), join(dist, 'scrollbar.css'));
console.log('dist/tokens.css, dist/scrollbar.css');

run('custom elements manifest', bin('cem'), ['analyze', '--config', 'custom-elements-manifest.config.mjs']);

console.log('\nbuild:lib done: dist/');
