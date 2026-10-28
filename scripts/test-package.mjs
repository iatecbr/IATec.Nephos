/**
 * Proof of the `@iatec/nephos` package (P70, amended by P75).
 *
 * Reads `package.json` and the `dist/` that `npm run build:lib` wrote, and
 * checks that what a consumer imports is really there:
 *   - the package contract: scoped name, public, release candidate on the
 *     `rc` tag, `lit` and Font Awesome as peers;
 *   - every component folder has an `exports` entry that resolves, in
 *     JavaScript and in declarations, declares its tag in
 *     `HTMLElementTagNameMap` and is described by the manifest;
 *   - every import line the documentation shows (`import '@iatec/nephos/...'`)
 *     resolves through `exports`, and no line uses the old, unscoped name
 *     (the decision log keeps P70 as it was written, and `docs/operacao/`
 *     is the record of past tasks; neither is read);
 *   - `dist/` carries no story, test, local path, `import.meta.env` or
 *     `?inline`, imports nothing but `lit`, `@fortawesome/*` and itself, and
 *     defines each custom element once;
 *   - the tokens in `dist/tokens.css` are byte for byte the generated ones.
 *
 * When these checks pass, a real Chromium imports each component through the package,
 * `import '@iatec/nephos/nph-<name>'`, and finds it registered with its CSS, `nph-label`
 * included (`vitest.package.config.ts` and `scripts/test-package.browser.test.mjs`; DSA-35).
 *
 * Run with: npm run build:lib && npm run test:package
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function walk(folder) {
  const files = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      files.push(...walk(path));
    } else {
      files.push(path);
    }
  }
  return files;
}

/** Resolves `./nph-badge` through the `exports` map, with its single `*` pattern. */
function resolveExport(subpath, condition) {
  const exportsMap = pkg.exports ?? {};
  let target = exportsMap[subpath];
  let star = null;
  if (target === undefined) {
    for (const [key, value] of Object.entries(exportsMap)) {
      const [prefix, suffix] = key.split('*');
      if (suffix === undefined) continue;
      if (subpath.startsWith(prefix) && subpath.endsWith(suffix) && subpath.length >= key.length - 1) {
        star = subpath.slice(prefix.length, subpath.length - suffix.length);
        target = value;
        break;
      }
    }
  }
  if (target === undefined) return null;
  const file = typeof target === 'string' ? target : target[condition];
  if (file === undefined) return null;
  return star === null ? file : file.replaceAll('*', star);
}

/* 1. Package contract. */
check(pkg.name === '@iatec/nephos', `name is ${pkg.name}, expected @iatec/nephos`);
check(pkg.private !== true, 'package.json is still private');
check(/^\d+\.\d+\.\d+-rc\.\d+$/.test(pkg.version), `version ${pkg.version} is not a release candidate (x.y.z-rc.N)`);
check(pkg.publishConfig?.tag === 'rc', 'publishConfig.tag must be "rc": a release candidate never takes the latest tag');
check(
  typeof pkg.publishConfig?.registry === 'string' && pkg.publishConfig.registry.endsWith('/_packaging/IATec.Community/npm/registry/'),
  'publishConfig.registry must be the IATec.Community feed',
);
check(pkg.type === 'module', 'type must be module');
for (const peer of ['lit', '@fortawesome/pro-light-svg-icons', '@fortawesome/pro-solid-svg-icons']) {
  check(pkg.peerDependencies?.[peer] !== undefined, `${peer} must be a peerDependency`);
  check(pkg.dependencies?.[peer] === undefined, `${peer} must not be a dependency`);
}
check(
  pkg.sideEffects === true,
  'sideEffects must be true: importing a component registers it and importing tokens.css loads it. A list that misses src/ makes every bundler of this repository, Storybook included, drop `import ../nph-icon/nph-icon`',
);

check(existsSync(dist), 'dist/ does not exist: run npm run build:lib first');
if (!existsSync(dist)) {
  console.error('test:package FAILED\n- dist/ does not exist: run npm run build:lib first');
  process.exit(1);
}

/* 2. Every component folder is reachable. */
const componentsDir = join(root, 'src/components');
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('nph-'))
  .map((entry) => entry.name)
  .sort();
const manifest = existsSync(join(dist, 'custom-elements.json'))
  ? JSON.parse(readFileSync(join(dist, 'custom-elements.json'), 'utf8'))
  : null;
check(manifest !== null, 'dist/custom-elements.json does not exist');
const manifestTags = new Set(
  (manifest?.modules ?? []).flatMap((module) =>
    (module.declarations ?? []).filter((declaration) => declaration.customElement === true).map((declaration) => declaration.tagName),
  ),
);

for (const name of components) {
  const js = resolveExport(`./${name}`, 'import');
  const types = resolveExport(`./${name}`, 'types');
  check(js !== null && existsSync(join(root, js)), `${name}: "import" does not resolve to a file (${js})`);
  check(types !== null && existsSync(join(root, types)), `${name}: "types" does not resolve to a file (${types})`);
  if (types !== null && existsSync(join(root, types))) {
    const declarations = readFileSync(join(root, types), 'utf8');
    check(
      new RegExp(`['"]${name}['"]\\s*:`).test(declarations),
      `${name}: the declaration file does not add the tag to HTMLElementTagNameMap`,
    );
  }
  check(manifestTags.has(name), `${name}: not described in custom-elements.json`);
}
check(components.length > 0, 'no component folder found');
/*
 * Every path the manifest names is a file the package ships, relative to the
 * package root (`dist/` is in `files`), and no tag name is left as the constant
 * `TAG`. A manifest that points at `src/` describes files nobody receives.
 */
const manifestModules = new Set((manifest?.modules ?? []).map((module) => module.path));
const manifestReferences = [];
(function collect(node) {
  if (Array.isArray(node)) node.forEach(collect);
  else if (node !== null && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'module' && typeof value === 'string') manifestReferences.push(value);
      else collect(value);
    }
  }
})(manifest?.modules ?? []);
for (const path of [...manifestModules, ...manifestReferences]) {
  check(
    path.startsWith('dist/') && existsSync(join(root, path)) && (pkg.files ?? []).includes('dist'),
    `custom-elements.json names ${path}, which is not a file of the package`,
  );
}
for (const reference of manifestReferences) {
  check(manifestModules.has(reference), `custom-elements.json refers to module ${reference}, which it does not describe`);
}
check(!manifestTags.has('TAG'), 'custom-elements.json still has the constant TAG as a tag name');

for (const tag of manifestTags) {
  check(components.includes(tag), `custom-elements.json describes ${tag}, which is not a component folder`);
}

for (const subpath of ['./tokens.css', './scrollbar.css', './custom-elements.json', './package.json']) {
  const target = resolveExport(subpath, 'import') ?? resolveExport(subpath, 'default');
  check(target !== null && existsSync(join(root, target)), `exports ${subpath} does not resolve to a file (${target})`);
}
check(
  existsSync(join(dist, 'tokens.css')) &&
    readFileSync(join(dist, 'tokens.css'), 'utf8') === readFileSync(join(root, 'src/tokens/generated/tokens.css'), 'utf8'),
  'dist/tokens.css is not identical to src/tokens/generated/tokens.css',
);

/* 3. The import lines the documentation shows resolve. */
const scoped = /@iatec\/nephos(\/[^'"\s;`,)]*)/g;
const importLine = /import\s+(?:[^'"\n]*?from\s+)?['"]([^'"]+)['"]/g;
const documentFiles = [
  ...walk(join(root, 'src')),
  ...walk(join(root, '.storybook')),
  ...walk(join(root, 'docs')).filter((file) => {
    /* Compared as a posix path, so the filter is the same on Windows. */
    const posixPath = relative(root, file).split(sep).join('/');
    return posixPath !== 'docs/decisoes-tecnicas.md' && !posixPath.startsWith('docs/operacao/');
  }),
  ...walk(join(root, 'fichas')),
  join(root, 'README.md'),
  join(root, 'README.pt-BR.md'),
  join(root, 'README.es.md'),
].filter((file) => /\.(ts|js|json|md)$/.test(file) && !/\.test\.ts$/.test(file) && existsSync(file));

let documentedLines = 0;
for (const file of documentFiles) {
  const text = readFileSync(file, 'utf8');
  const where = relative(root, file);
  for (const match of text.matchAll(importLine)) {
    const specifier = match[1];
    /* The unscoped name is the one P70 had before P75. */
    if (/^nephos(\/|$)/.test(specifier)) {
      check(false, `${where}: import of "${specifier}" uses the old, unscoped package name; use @iatec/nephos`);
    }
    if (!specifier.startsWith('@iatec/nephos')) continue;
    documentedLines += 1;
    const subpath = `.${specifier.slice('@iatec/nephos'.length)}`.replace('nph-<name>', `${components[0]}`);
    const js = resolveExport(subpath, 'import') ?? resolveExport(subpath, 'default');
    check(js !== null && existsSync(join(root, js)), `${where}: "${specifier}" does not resolve through exports`);
  }
  for (const match of text.matchAll(scoped)) {
    const subpath = `.${match[1]}`.replace('nph-<name>', `${components[0]}`).replace('nph-*', `${components[0]}`).replace(/[.:]$/, '');
    /* A path inside the installed package (`node_modules/@iatec/nephos/dist/...`), not an import specifier. */
    if (subpath === './' || subpath.startsWith('./dist/')) continue;
    const js = resolveExport(subpath, 'import') ?? resolveExport(subpath, 'default');
    check(js !== null && existsSync(join(root, js)), `${where}: "@iatec/nephos${match[1]}" does not resolve through exports`);
  }
}

/* 4. What is inside dist/. */
const distFiles = walk(dist);
const javascript = distFiles.filter((file) => file.endsWith('.js'));
for (const file of distFiles) {
  const where = relative(root, file);
  check(!/\.(test|stories|demo)\./.test(where), `${where}: a story, test or demo reached the package`);
  check(statSync(file).size > 0, `${where}: empty file`);
}
const definitions = new Map();
for (const file of javascript) {
  const where = relative(root, file);
  const text = readFileSync(file, 'utf8');
  check(!/import\.meta\.env/.test(text), `${where}: still reads import.meta.env, which only a Vite consumer defines`);
  check(!/(?:from|import)\s*["'][^"']*\?inline/.test(text), `${where}: still imports a stylesheet with ?inline`);
  check(!/\/Users\/|[A-Za-z]:\\\\/.test(text), `${where}: carries a local path`);
  for (const match of text.matchAll(/(?:from|import)\s*["']([^"']+)["']/g)) {
    const specifier = match[1];
    const allowed = specifier.startsWith('.') || /^lit(\/|$)/.test(specifier) || specifier.startsWith('@fortawesome/');
    check(allowed, `${where}: imports "${specifier}", which is neither relative, lit nor @fortawesome`);
    if (specifier.startsWith('.')) {
      check(existsSync(join(dirname(file), specifier)), `${where}: relative import "${specifier}" does not exist`);
    }
  }
  for (const match of text.matchAll(/customElements\.define\(\s*([A-Za-z_$][\w$]*)\s*,/g)) {
    definitions.set(`${where}:${match[1]}`, (definitions.get(`${where}:${match[1]}`) ?? 0) + 1);
  }
}
check(definitions.size === components.length, `expected ${components.length} customElements.define calls in dist, found ${definitions.size}`);
for (const [key, count] of definitions) {
  check(count === 1, `${key}: defined ${count} times`);
}

/*
 * 5. Importing a component registers every component it renders. `nph-button`
 * renders `nph-icon` and `nph-spinner`: from its entry file, through the
 * relative imports, the build must still reach the modules that define them.
 * A bundler that drops a bare import leaves the button without its icon, and
 * nothing else would notice.
 */
const tagOfFile = new Map();
for (const file of javascript) {
  const text = readFileSync(file, 'utf8');
  const tag = text.match(/(?:const|var|let)\s+TAG\s*=\s*["'](nph-[a-z]+(?:-[a-z]+)*)["']/)?.[1];
  if (tag !== undefined && /customElements\.define\(\s*TAG\s*,/.test(text)) tagOfFile.set(file, tag);
}

function reachableTags(entry, seen = new Set()) {
  if (seen.has(entry)) return new Set();
  seen.add(entry);
  const tags = new Set();
  if (tagOfFile.has(entry)) tags.add(tagOfFile.get(entry));
  const text = readFileSync(entry, 'utf8');
  for (const match of text.matchAll(/(?:from|import)\s*["'](\.[^"']+)["']/g)) {
    for (const tag of reachableTags(join(dirname(entry), match[1]), seen)) tags.add(tag);
  }
  return tags;
}

for (const name of components) {
  const source = readFileSync(join(componentsDir, name, `${name}.ts`), 'utf8');
  const expected = new Set([name]);
  for (const match of source.matchAll(/import\s+['"]\.\.\/(nph-[a-z]+(?:-[a-z]+)*)\/\1['"]/g)) expected.add(match[1]);
  const entry = join(root, resolveExport(`./${name}`, 'import') ?? `dist/${name}/${name}.js`);
  if (!existsSync(entry)) continue;
  const reached = reachableTags(entry);
  for (const tag of expected) {
    check(reached.has(tag), `${name}: importing it does not register ${tag}; the build dropped a bare import`);
  }
}

if (failures.length > 0) {
  console.error(`test:package FAILED (${failures.length} of ${checks} checks)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(
  `test:package: ${checks} checks passed, ${components.length} components, ${documentedLines} documented import lines resolve.`,
);

/*
 * 6. In a browser, the import line registers the component with its CSS. Vitest runs with the
 * same Node that runs this script, from the `bin` of its package, so no `node_modules/.bin`
 * shim is executed (the same way as `scripts/build-lib.mjs`).
 */
const require = createRequire(join(root, 'package.json'));
const vitestManifest = require.resolve('vitest/package.json');
const vitestBin = require(vitestManifest).bin;
const vitest = join(dirname(vitestManifest), typeof vitestBin === 'string' ? vitestBin : vitestBin.vitest);
console.log('\n> import in a browser (vitest.package.config.ts)');
try {
  execFileSync(process.execPath, [vitest, 'run', '--config', 'vitest.package.config.ts'], { cwd: root, stdio: 'inherit' });
} catch (error) {
  console.error('test:package FAILED: importing a component through the package does not register it with its CSS');
  process.exit(typeof error.status === 'number' && error.status !== 0 ? error.status : 1);
}
console.log('test:package passed.');
