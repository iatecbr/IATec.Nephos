/**
 * Revalida o `nph-icon` contra o Figma aceito, para o Lote A (DSA-09).
 *
 * Fonte Figma: conjunto `nph-icon` (`248:143`) do arquivo `DS-IA-NEPHOS 5.0`,
 * lido em 05-10-2026 pela propriedade `nome` (93 opcoes) e `estilo`
 * (`regular`, `solid`). A lista esta copiada abaixo, na ordem do Figma.
 *
 * Confere:
 * - os nomes do mapa `src/components/nph-icon/nph-icon.icons.ts` (entradas
 *   `glyph(...)`) contra os nomes do Figma, nos dois sentidos;
 * - os estilos do Figma contra as variantes aceitas no codigo.
 *
 * Rode da raiz do repositorio: node docs/operacao/evidencias/DSA-09/conferir-nph-icon-figma.cjs
 */
const fs = require('node:fs');

const FIGMA_NAMES = [
  'bars', 'chevron-down', 'chevron-up', 'chevron-right', 'chevron-left', 'arrow-left', 'eye',
  'eye-slash', 'ellipsis', 'arrow-right', 'xmark', 'check', 'plus', 'magnifying-glass',
  'ellipsis-vertical', 'arrow-up-arrow-down', 'grip-vertical', 'pen-to-square', 'trash-can',
  'arrow-up-from-bracket', 'download', 'gear', 'filter', 'filter-slash', 'minus', 'circle-info',
  'triangle-exclamation', 'circle-xmark', 'circle-check', 'circle-question', 'star',
  'circle-notch', 'calendar-days', 'user', 'alarm-clock', 'arrow-down-to-line', 'arrow-up',
  'badge-check', 'bell', 'calendar', 'caret-up', 'circle-down', 'circle-half-stroke',
  'circle-up', 'circle-user', 'clipboard', 'clock', 'cloud-arrow-up', 'comment', 'envelope',
  'file', 'files', 'folder', 'folder-open', 'font-awesome', 'globe', 'grid-2', 'heart', 'house',
  'inbox', 'key', 'link', 'list', 'location-dot', 'lock', 'paper-plane', 'paperclip', 'pen',
  'print', 'question', 'right-to-bracket', 'rotate-right', 'share', 'share-from-square',
  'suitcase', 'tag', 'thumbs-down', 'thumbs-up', 'thumbtack', 'trash', 'trophy', 'user-minus',
  'user-circle-plus', 'user-circle-minus', 'thumbtack-slash', 'arrow-down-arrow-up',
  'circle-chevron-down', 'chevrons-down', 'angle-left', 'circle-chevron-left', 'chevrons-left',
  'triple-chevrons-left', 'square-chevron-left',
];
const FIGMA_STYLES = ['regular', 'solid'];

const source = fs.readFileSync('src/components/nph-icon/nph-icon.icons.ts', 'utf8');
const codeNames = [...source.matchAll(/^\s+'?([a-z0-9-]+)'?:\s*glyph\(/gm)].map((m) => m[1]);

const onlyFigma = FIGMA_NAMES.filter((n) => !codeNames.includes(n));
const onlyCode = codeNames.filter((n) => !FIGMA_NAMES.includes(n));
const repeated = codeNames.filter((n, i) => codeNames.indexOf(n) !== i);
const missingStyles = FIGMA_STYLES.filter((s) => !new RegExp("'" + s + "'").test(source));

console.log('figma: ' + FIGMA_NAMES.length + ' nomes | codigo: ' + codeNames.length + ' entradas glyph()');
console.log('so no figma: ' + (onlyFigma.join(', ') || 'nenhum'));
console.log('so no codigo: ' + (onlyCode.join(', ') || 'nenhum'));
console.log('repetidos no codigo: ' + (repeated.join(', ') || 'nenhum'));
console.log('estilos do figma ausentes no codigo: ' + (missingStyles.join(', ') || 'nenhum'));

const failed = onlyFigma.length + onlyCode.length + repeated.length + missingStyles.length;
process.exit(failed === 0 ? 0 : 1);
