/**
 * Verifier for the Nephos operational structure.
 *
 * The central point: a task must not LOOK done. State is proven in the
 * artifact: a gate with evidence that exists on disk, a dependency that exists
 * in the tree, a spec pointer that resolves. The verifier opens the file
 * instead of believing the field.
 *
 * The machine half of a task, context and evidence is a fenced JSON block,
 * the first one in the Markdown file. JSON and not YAML by decision of Indiane
 * on 2026-09-02: adopting a full YAML reader would cost a new dependency, and
 * `JSON.parse` already ships with Node. The spec is the exception: its YAML is
 * read by `spec-lib.mjs`, which covers only a closed subset and brings no
 * dependency. The task stays in JSON.
 *
 * Full contract in docs/operacao/README.md.
 *
 * Usage:
 *   node scripts/verificar-operacao.mjs              validates docs/operacao/
 *   node scripts/verificar-operacao.mjs `--proxima`  validates and shows the queue
 *   node scripts/verificar-operacao.mjs `--exemplos` self-test over the fixtures
 *   node scripts/verificar-operacao.mjs `--gerar-metadata`
 *                                                    writes the Metadata from
 *                                                    the specs and validates
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { SpecError, readSpec } from './spec-lib.mjs';

const OPERATIONS_ROOT = 'docs/operacao';
const FIXTURES_ROOT = 'scripts/fixtures/operations';
const COMPONENTS_ROOT = 'src/components';
const SPECS_ROOT = 'fichas';
/** The Metadata is generated: only `--gerar-metadata` writes here. Never edit by hand. */
const METADATA_ROOT = 'src/shared/metadata';

const STATES = ['pronta', 'em-andamento', 'aguardando-decisao', 'bloqueada', 'em-revisao', 'concluida'];
const OWNERS = ['indiane', 'claude-codigo', 'claude-figma', 'copilot', 'elvys'];
const PHASES = ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
const CLASSIFICATIONS = ['publica', 'interna-permitida', 'interna-restrita', 'desconhecida'];
const GATE_RESULTS = ['pendente', 'passou', 'falhou'];

/**
 * The documentation lock. The accepted Figma documentation comes BEFORE the
 * component code; the canonical spec comes AFTER it, before review. That is
 * why the two sets of states differ: local code without a spec is work in
 * progress, not a violation.
 */
const FIGMA_DOCS_GATE = 'documentacao-figma-aceita';
const STATES_REQUIRING_FIGMA_GATE = ['pronta', 'em-andamento', 'em-revisao', 'concluida'];
const STATES_REQUIRING_SPEC = ['em-revisao', 'concluida'];

/** Closed schema: a top-level key outside this list fails in V03. */
const FIELDS = [
  'id', 'objetivo', 'fase', 'ordem_aprovada', 'responsavel', 'estado', 'peca',
  'dependencias', 'gates', 'bloqueios', 'decisoes_pendentes', 'evidencias',
  'referencias_de_decisao', 'origem_externa', 'revisao_git', 'contexto', 'atualizado_em',
];
const TEXT_FIELDS = ['id', 'objetivo', 'fase', 'responsavel', 'estado', 'atualizado_em'];
const LIST_FIELDS = ['dependencias', 'gates', 'bloqueios', 'decisoes_pendentes', 'evidencias', 'referencias_de_decisao'];

/** The context does not decide: these six keys are forbidden in it (V23). */
const CONTEXT_KEYS = ['tarefa', 'worktree', 'sha_inicial', 'sha_final'];
const FORBIDDEN_CONTEXT_KEYS = ['estado', 'fase', 'ordem_aprovada', 'prioridade', 'escopo', 'decisao'];
const CONTEXT_LINE_LIMIT = 60;

const ID_PATTERN = /^[A-Z][A-Z0-9]{1,3}-[A-Z0-9]{1,6}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Secret scan. Automates the safe-resume rule of PO-001: the local credential
 * configuration stays out of Git. The Font Awesome token pattern is built in
 * two parts on purpose, so that this very file does not contain the string it
 * searches for.
 */
const SECRETS = [
  { name: 'GitHub personal token', re: /ghp_[A-Za-z0-9]{16,}/ },
  { name: 'GitHub personal token (fine-grained)', re: /github_pat_[A-Za-z0-9_]{16,}/ },
  { name: 'npm registry credential', re: /\/\/registry\.npmjs\.org\/:_authToken/ },
  { name: 'Font Awesome token with value', re: new RegExp('FONTAWESOME_NPM' + '_AUTH_TOKEN\\s*=\\s*\\S+') },
  { name: 'private key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

// ---------------------------------------------------------------
// READING
// ---------------------------------------------------------------

const read = (filePath) => readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const listMarkdown = (dir) => (existsSync(dir) && statSync(dir).isDirectory()
  ? readdirSync(dir).filter((n) => n.endsWith('.md') && statSync(join(dir, n)).isFile()).sort()
  : []);

/** Extracts and parses the FIRST ```json block of the file. */
function jsonBlock(text) {
  const m = text.match(/```json\n([\s\S]*?)\n```/);
  if (m === null) return { error: 'there is no fenced json block in the file' };
  try {
    const data = JSON.parse(m[1]);
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return { error: 'the json block is not an object' };
    }
    return { data };
  } catch (e) {
    return { error: 'the json block does not parse: ' + e.message };
  }
}

const isEmpty = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

// ---------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------

/**
 * V31 — the provenance of the documentation gate evidence.
 *
 * The lock only holds if the proof says WHERE the documentation came from and
 * WHO accepted it. A "passed" gate without provenance is just a word: it
 * cannot be audited later, and that is exactly what V30 tries to prevent. The
 * evidence lives in `evidencias/<ID>/` of the tree itself, and does not carry
 * restricted Figma content, only the converted decision, with the frame and
 * the COMPONENT_SET that originated it.
 *
 * V15, V16 and V17 already cover gate without evidence, broken pointer and
 * invalid JSON block. This function only looks at what is left: provenance.
 */
function validateDocumentEvidence(taskId, gate, fail) {
  const ev = gate.evidencia;
  if (typeof ev !== 'string' || isEmpty(ev) || !existsSync(ev)) return;
  const filePath = ev.replace(/\\/g, '/');

  if (!new RegExp(`(^|/)evidencias/${taskId}/[^/]+\\.md$`).test(filePath)) {
    fail('V31', filePath, `the documentation evidence of "${taskId}" must live in \`evidencias/${taskId}/\``);
  }

  const { data, error } = jsonBlock(read(filePath));
  if (error) return;

  if (data.gate !== FIGMA_DOCS_GATE) {
    fail('V31', filePath, `the \`gate\` field is "${data.gate}", not "${FIGMA_DOCS_GATE}"`);
  }
  if (data.responsavel !== 'indiane') {
    fail('V31', filePath, `whoever accepts the documentation is indiane, and \`responsavel\` declares "${data.responsavel}"`);
  }

  const origin = data.origem_externa;
  if (origin === undefined || origin === null || typeof origin !== 'object' || Array.isArray(origin)) {
    fail('V31', filePath, 'the documentation evidence does not declare `origem_externa` as an object');
    return;
  }
  if (origin.classificacao !== 'interna-permitida') {
    fail('V31', filePath, `origem_externa.classificacao is "${origin.classificacao}"; the Figma documentation is \`interna-permitida\``);
  }
  if (isEmpty(origin.url_ou_id)) {
    fail('V31', filePath, '`origem_externa` does not declare `url_ou_id`; the Figma URL or ID is missing');
  } else if (!/figma/i.test(origin.url_ou_id)) {
    fail('V31', filePath, `origem_externa.url_ou_id "${origin.url_ou_id}" does not point to Figma`);
  }
  if (isEmpty(origin.data)) {
    fail('V31', filePath, '`origem_externa` does not declare `data`');
  } else if (!DATE_PATTERN.test(origin.data)) {
    fail('V31', filePath, `origem_externa.data "${origin.data}" is not in YYYY-MM-DD`);
  }
  if (isEmpty(origin.autoria)) {
    fail('V31', filePath, '`origem_externa` does not declare `autoria`; who registered it is missing');
  }
  if (isEmpty(origin.decisao_convertida)) {
    fail('V31', filePath, '`origem_externa` does not declare `decisao_convertida`');
    return;
  }
  if (!/frame/i.test(origin.decisao_convertida)) {
    fail('V31', filePath, 'origem_externa.decisao_convertida does not name the source frame');
  }
  if (!origin.decisao_convertida.includes('COMPONENT_SET')) {
    fail('V31', filePath, 'origem_externa.decisao_convertida does not name the COMPONENT_SET');
  }
}

/**
 * Validates a whole operational tree.
 * `root` is the directory that contains `tarefas/`, `contextos/` and `evidencias/`.
 * Paths declared in `evidencias[]` are always from the repository root,
 * and must exist there.
 */
export function validate(root, options = {}) {
  const {
    specs: specsDir = SPECS_ROOT,
    metadata: metadataDir = METADATA_ROOT,
    metadataRequired = true,
  } = options;
  const errors = [];
  const fail = (code, filePath, msg) => errors.push({ code, filePath, msg });

  const tasksDir = join(root, 'tarefas');
  const contextsDir = join(root, 'contextos');
  const evidenceDir = join(root, 'evidencias');

  /* ---- loading ---- */
  const tasks = new Map();
  const brokenFiles = [];

  for (const name of listMarkdown(tasksDir)) {
    const filePath = join(tasksDir, name).replace(/\\/g, '/');
    const fileId = basename(name, '.md');
    const text = read(filePath);
    const { data, error } = jsonBlock(text);

    if (error) {
      fail('V03', filePath, error);
      brokenFiles.push(filePath);
      continue;
    }

    for (const key of Object.keys(data)) {
      if (!FIELDS.includes(key)) {
        fail('V03', filePath, `unknown top-level key "${key}"; the schema is closed`);
      }
    }

    tasks.set(fileId, { filePath, fileId, data, text });
  }

  /* Index by declared id, used by dependencies and contexts. */
  const byId = new Map();
  for (const t of tasks.values()) {
    const id = typeof t.data.id === 'string' ? t.data.id : null;
    if (id === null) continue;
    if (byId.has(id)) {
      fail('V02', t.filePath, `duplicate id "${id}"; already declared in ${byId.get(id).filePath}`);
    } else {
      byId.set(id, t);
    }
  }

  /* ---- per task ---- */
  for (const t of [...tasks.values()].sort((a, b) => a.filePath.localeCompare(b.filePath))) {
    const { filePath, fileId, data } = t;

    // V04 — required field present and not empty
    for (const field of FIELDS) {
      if (!(field in data)) {
        fail('V04', filePath, `required field "${field}" is missing`);
        continue;
      }
      if (TEXT_FIELDS.includes(field) && isEmpty(data[field])) {
        fail('V04', filePath, `field "${field}" is empty`);
      }
      if (LIST_FIELDS.includes(field) && !Array.isArray(data[field])) {
        fail('V04', filePath, `field "${field}" must be a list`);
      }
    }

    // V01 — file name equal to the id
    if (data.id !== fileId) {
      fail('V01', filePath, `the declared id is "${data.id}", but the file is named "${fileId}.md"`);
    }

    // V02 — id matches the pattern
    if (typeof data.id === 'string' && !ID_PATTERN.test(data.id)) {
      fail('V02', filePath, `the id "${data.id}" does not match ${ID_PATTERN}`);
    }

    if (typeof data.fase === 'string' && !PHASES.includes(data.fase)) {
      fail('V04', filePath, `\`fase\` "${data.fase}" outside ${PHASES.join(', ')}`);
    }
    if (typeof data.responsavel === 'string' && !OWNERS.includes(data.responsavel)) {
      fail('V04', filePath, `\`responsavel\` "${data.responsavel}" outside ${OWNERS.join(', ')}`);
    }
    if (typeof data.atualizado_em === 'string' && !DATE_PATTERN.test(data.atualizado_em)) {
      fail('V04', filePath, `\`atualizado_em\` "${data.atualizado_em}" is not in YYYY-MM-DD`);
    }
    if (data.revisao_git === undefined || data.revisao_git === null || typeof data.revisao_git !== 'object') {
      fail('V04', filePath, '`revisao_git` must be an object with `branch`, `commit` and `pr`');
    } else {
      for (const key of ['branch', 'commit', 'pr']) {
        if (!(key in data.revisao_git)) {
          fail('V04', filePath, `\`revisao_git\` does not declare "${key}"`);
        }
      }
    }

    // V05 — state is one of the six
    const state = data.estado;
    if (!STATES.includes(state)) {
      fail('V05', filePath, `\`estado\` "${state}" does not exist; use ${STATES.join(', ')}`);
    }

    const gates = Array.isArray(data.gates) ? data.gates : [];
    if (Array.isArray(data.gates) && gates.length === 0) {
      fail('V14', filePath, 'the task does not declare any gate');
    }

    // V14 / V15 — gate shape
    gates.forEach((g, i) => {
      const where = `gate #${i + 1}`;
      if (g === null || typeof g !== 'object') {
        fail('V14', filePath, `${where} is not an object`);
        return;
      }
      for (const key of ['id', 'descricao', 'resultado']) {
        if (isEmpty(g[key])) fail('V14', filePath, `${where} does not declare "${key}"`);
      }
      if (g.resultado !== undefined && !GATE_RESULTS.includes(g.resultado)) {
        fail('V14', filePath, `${where} has \`resultado\` "${g.resultado}"; use ${GATE_RESULTS.join(', ')}`);
      }
      if (g.resultado === 'passou') {
        for (const key of ['evidencia', 'verificado_em', 'verificado_por']) {
          if (isEmpty(g[key])) fail('V15', filePath, `${where} passed but does not declare "${key}"`);
        }
      }
    });

    // V06 — `concluida` with every gate passed and evidence existing
    if (state === 'concluida') {
      for (const [i, g] of gates.entries()) {
        if (g === null || typeof g !== 'object') continue;
        if (g.resultado !== 'passou') {
          fail('V06', filePath, `\`estado\` \`concluida\`, but gate #${i + 1} is "${g.resultado}"`);
        } else if (isEmpty(g.evidencia) || !existsSync(g.evidencia)) {
          fail('V06', filePath, `\`estado\` \`concluida\`, but the evidence of gate #${i + 1} does not exist on disk`);
        }
      }
    }

    // V07 — `bloqueada` with an open blocker
    if (state === 'bloqueada') {
      const blockers = Array.isArray(data.bloqueios) ? data.bloqueios : [];
      const validBlockers = blockers.filter((b) => b && typeof b === 'object' && !isEmpty(b.dono) && !isEmpty(b.o_que_resolve));
      if (validBlockers.length === 0) {
        fail('V07', filePath, '`estado` `bloqueada` requires at least one blocker with `dono` and `o_que_resolve`');
      }
    }

    // V08 — `aguardando-decisao` with `pergunta` and `quem_decide`
    if (state === 'aguardando-decisao') {
      const pending = Array.isArray(data.decisoes_pendentes) ? data.decisoes_pendentes : [];
      const validDecisions = pending.filter((d) => d && typeof d === 'object' && !isEmpty(d.pergunta) && !isEmpty(d.quem_decide));
      if (validDecisions.length === 0) {
        fail('V08', filePath, '`estado` `aguardando-decisao` requires a pending decision with `pergunta` and `quem_decide`');
      }
    }

    // V10 — `em-revisao` with `revisao_git.pr`
    if (state === 'em-revisao') {
      const pr = data.revisao_git && data.revisao_git.pr;
      if (isEmpty(pr)) fail('V10', filePath, '`estado` `em-revisao` requires `revisao_git.pr` filled in');
    }

    const deps = Array.isArray(data.dependencias) ? data.dependencias : [];

    // V13 — no self-dependency
    if (deps.includes(data.id)) {
      fail('V13', filePath, `the task depends on itself`);
    }

    // V11 — every cited id exists
    for (const dep of deps) {
      if (!byId.has(dep)) {
        fail('V11', filePath, `depends on "${dep}", which does not exist in this tree`);
      }
    }

    // V09 — `pronta` with all dependencies `concluida`
    if (state === 'pronta') {
      for (const dep of deps) {
        const target = byId.get(dep);
        const depState = target ? target.data.estado : '(nonexistent)';
        if (depState !== 'concluida') {
          fail('V09', filePath, `\`estado\` \`pronta\`, but dependency "${dep}" is "${depState}"`);
        }
      }
    }

    // V16 / V17 — declared evidence
    const evidencePaths = [
      ...(Array.isArray(data.evidencias) ? data.evidencias : []),
      ...gates.map((g) => (g && typeof g === 'object' ? g.evidencia : null)).filter((c) => !isEmpty(c)),
    ];
    for (const ev of [...new Set(evidencePaths)].sort()) {
      if (typeof ev !== 'string' || !existsSync(ev)) {
        fail('V16', filePath, `the evidence "${ev}" does not exist on disk`);
        continue;
      }
      const { data: evidenceData, error } = jsonBlock(read(ev));
      if (error) {
        fail('V17', ev, `evidence without a valid json block: ${error}`);
      } else if (evidenceData.tarefa !== data.id) {
        fail('V17', ev, `the evidence declares \`tarefa\` "${evidenceData.tarefa}", but it is referenced by "${data.id}"`);
      }
    }

    // V18 / V19 / V20 — external origin
    const origin = data.origem_externa;
    if (origin !== undefined && origin !== null) {
      if (typeof origin !== 'object' || Array.isArray(origin)) {
        fail('V18', filePath, '`origem_externa` must be an object or null');
      } else if (!CLASSIFICATIONS.includes(origin.classificacao)) {
        fail('V18', filePath, `\`classificacao\` "${origin.classificacao}" outside ${CLASSIFICATIONS.join(', ')}`);
      } else {
        const c = origin.classificacao;
        if (c === 'publica') {
          for (const key of ['url_ou_id', 'data']) {
            if (isEmpty(origin[key])) fail('V20', filePath, `origin \`publica\` requires "${key}"`);
          }
        }
        if (c === 'interna-permitida') {
          for (const key of ['url_ou_id', 'data', 'autoria', 'decisao_convertida']) {
            if (isEmpty(origin[key])) fail('V20', filePath, `origin \`interna-permitida\` requires "${key}"`);
          }
        }
        if (c === 'interna-restrita' || c === 'desconhecida') {
          if (!isEmpty(origin.trecho)) {
            fail('V19', filePath, `origin ${c} cannot carry \`trecho\`; the content is not copied`);
          }
          if (state !== 'bloqueada' && state !== 'aguardando-decisao') {
            fail('V19', filePath, `origin ${c} requires the task in \`bloqueada\` or \`aguardando-decisao\`, and it is "${state}"`);
          }
        }
      }
    }

    // V28 — the canonical spec is demanded at the end, not at the start. Local
    // code without a spec is allowed while the task is `pronta` or `em-andamento`.
    if (!isEmpty(data.peca) && STATES_REQUIRING_SPEC.includes(state)) {
      const spec = join(SPECS_ROOT, `${data.peca}.md`).replace(/\\/g, '/');
      if (!existsSync(spec)) {
        fail('V28', filePath, `\`estado\` ${state} with \`peca\` "${data.peca}", but ${spec} does not exist`);
      }
    }

    // V30 — no component code before the Figma documentation is accepted.
    const isComponentTask = data.responsavel === 'claude-codigo' && !isEmpty(data.peca);
    const figmaGate = gates.find((g) => g !== null && typeof g === 'object' && g.id === FIGMA_DOCS_GATE);
    if (isComponentTask && STATES_REQUIRING_FIGMA_GATE.includes(state)) {
      if (figmaGate === undefined) {
        fail('V30', filePath, `component task in "${state}" does not declare the gate "${FIGMA_DOCS_GATE}"`);
      } else if (figmaGate.resultado !== 'passou') {
        fail('V30', filePath, `component task in "${state}" has "${FIGMA_DOCS_GATE}" in "${figmaGate.resultado}"; requires \`passou\``);
      }
    }

    // V31 — the approved documentation gate proves where the documentation came from.
    for (const g of gates) {
      if (g === null || typeof g !== 'object') continue;
      if (g.id !== FIGMA_DOCS_GATE || g.resultado !== 'passou') continue;
      validateDocumentEvidence(data.id, g, fail);
    }
  }

  // V12 — no cycle
  const inCycle = new Set();
  const color = new Map();
  const visit = (id, stack) => {
    if (color.get(id) === 'done') return;
    if (color.get(id) === 'visiting') {
      for (const n of stack.slice(stack.indexOf(id))) inCycle.add(n);
      return;
    }
    color.set(id, 'visiting');
    const t = byId.get(id);
    const deps = t && Array.isArray(t.data.dependencias) ? t.data.dependencias : [];
    for (const d of deps) if (byId.has(d)) visit(d, [...stack, id]);
    color.set(id, 'done');
  };
  for (const id of [...byId.keys()].sort()) visit(id, []);
  for (const id of [...inCycle].sort()) {
    fail('V12', byId.get(id).filePath, `"${id}" takes part in a dependency cycle`);
  }

  // V29 — `ordem_aprovada` integer, >= 1, unique among the non-`concluida`
  const orders = new Map();
  for (const t of [...tasks.values()].sort((a, b) => a.filePath.localeCompare(b.filePath))) {
    const o = t.data.ordem_aprovada;
    if (!Number.isInteger(o) || o < 1) {
      fail('V29', t.filePath, `\`ordem_aprovada\` "${o}" must be an integer >= 1`);
      continue;
    }
    if (t.data.estado === 'concluida') continue;
    if (orders.has(o)) {
      fail('V29', t.filePath, `\`ordem_aprovada\` ${o} is already used by ${orders.get(o)}`);
    } else {
      orders.set(o, t.filePath);
    }
  }

  /* ---- contexts ---- */
  const contexts = new Map();
  for (const name of listMarkdown(contextsDir)) {
    const filePath = join(contextsDir, name).replace(/\\/g, '/');
    const text = read(filePath);
    const { data, error } = jsonBlock(text);
    if (error) {
      fail('V22', filePath, `context without a valid json block: ${error}`);
      continue;
    }
    contexts.set(basename(name, '.md'), { filePath, data });

    // V22 — points to an existing task
    if (isEmpty(data.tarefa) || !byId.has(data.tarefa)) {
      fail('V22', filePath, `the context points to the task "${data.tarefa}", which does not exist in this tree`);
    }

    // V23 — closed set of keys, without the six forbidden ones
    for (const key of Object.keys(data)) {
      if (FORBIDDEN_CONTEXT_KEYS.includes(key)) {
        fail('V23', filePath, `the context does not decide: the key "${key}" is forbidden`);
      } else if (!CONTEXT_KEYS.includes(key)) {
        fail('V23', filePath, `key "${key}" outside the set ${CONTEXT_KEYS.join(', ')}`);
      }
    }

    // V24 — line ceiling
    const lines = text.replace(/\n+$/, '').split('\n').length;
    if (lines > CONTEXT_LINE_LIMIT) {
      fail('V24', filePath, `${lines} lines; the ceiling is ${CONTEXT_LINE_LIMIT}. A context that grows has become a diary`);
    }
  }

  // V25 / V26 — presence of the context according to the state
  for (const t of [...byId.values()].sort((a, b) => a.filePath.localeCompare(b.filePath))) {
    const ctx = contexts.get(t.data.id);
    if (t.data.estado === 'concluida' && ctx) {
      fail('V25', ctx.filePath, `the task "${t.data.id}" is \`concluida\` and cannot have an active context`);
    }
    if (t.data.estado === 'em-andamento') {
      if (!ctx) {
        fail('V26', t.filePath, '`estado` `em-andamento` requires a context in `contextos/<ID>.md`');
      } else {
        for (const key of ['worktree', 'sha_inicial']) {
          if (isEmpty(ctx.data[key])) fail('V26', ctx.filePath, `the context does not declare "${key}"`);
        }
      }
    }
  }

  // V21 — secret scan in `tarefas/`, `contextos/` and `evidencias/`
  const scan = (dir) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      const filePath = join(dir, name).replace(/\\/g, '/');
      if (statSync(filePath).isDirectory()) { scan(filePath); continue; }
      if (!name.endsWith('.md')) continue;
      const text = read(filePath);
      for (const { name: label, re } of SECRETS) {
        if (re.test(text)) fail('V21', filePath, `pattern of ${label} found; a secret never enters the repository`);
      }
    }
  };
  scan(tasksDir);
  scan(contextsDir);
  scan(evidenceDir);

  // V27 — no competing contract next to the component
  const forbidden = [];
  const scanComponents = (dir) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      const filePath = join(dir, name).replace(/\\/g, '/');
      if (statSync(filePath).isDirectory()) scanComponents(filePath);
      else if (name === 'meta.ts' || name === 'metadata.ts') forbidden.push(filePath);
    }
  };
  scanComponents(COMPONENTS_ROOT);
  for (const p of forbidden) {
    fail('V27', p, 'competing contract: the spec in `fichas/<name>.md` is the source, and the Metadata derives from it (PI-01)');
  }

  // V32 — the Metadata is a faithful copy of the spec in force
  validateMetadata(specsDir, metadataDir, metadataRequired, fail);

  errors.sort((a, b) => (a.code + a.filePath + a.msg).localeCompare(b.code + b.filePath + b.msg));
  return { errors, tasks: byId, contexts, checked: tasks.size };
}

// ---------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------

/**
 * Reads the specs at the first level of `specsDir` and computes the Metadata
 * that each spec in force produces. A file without `---` on line 1 is not a
 * spec and is left out. A spec that does not fit the grammar becomes an error,
 * with the line.
 */
function computeMetadata(specsDir) {
  const expectedByName = new Map();
  const readErrors = [];
  for (const name of listMarkdown(specsDir)) {
    const filePath = join(specsDir, name).replace(/\\/g, '/');
    try {
      const spec = readSpec(read(filePath));
      if (spec !== null && spec.inForce) expectedByName.set(`${basename(name, '.md')}.json`, spec.json);
    } catch (e) {
      if (!(e instanceof SpecError)) throw e;
      readErrors.push({ filePath: `${filePath}:${e.line}`, msg: `the spec does not fit the grammar: ${e.message}` });
    }
  }
  return { expectedByName, readErrors };
}

/**
 * V32. The Metadata is only valid if it is the exact copy of what the spec
 * produces: a derived file that diverges from the source is the pointer that
 * breaks silently. The comparison normalizes the line ending (`read`), because
 * with `core.autocrlf` the same file arrives as CRLF on Windows and LF elsewhere.
 *
 * In real use both folders are required. In the self-test, a case without
 * `fichas/` and without `metadata/` has nothing to check.
 */
function validateMetadata(specsDir, metadataDir, required, fail) {
  const hasSpecs = existsSync(specsDir);
  const hasMetadata = existsSync(metadataDir);
  if (!required && !hasSpecs && !hasMetadata) return;
  if (required && !hasSpecs) {
    fail('V32', specsDir, 'the specs folder does not exist');
    return;
  }

  const { expectedByName, readErrors } = hasSpecs ? computeMetadata(specsDir) : { expectedByName: new Map(), readErrors: [] };
  for (const e of readErrors) fail('V32', e.filePath, e.msg);

  if (required && !hasMetadata && expectedByName.size > 0) {
    fail('V32', metadataDir, 'the Metadata folder does not exist; run node scripts/verificar-operacao.mjs `--gerar-metadata`');
    return;
  }

  for (const [name, json] of expectedByName) {
    const filePath = join(metadataDir, name).replace(/\\/g, '/');
    if (!existsSync(filePath)) {
      fail('V32', filePath, 'the Metadata of this spec in force is missing; run `--gerar-metadata`');
    } else if (read(filePath) !== json) {
      fail('V32', filePath, 'the Metadata does not match the spec: it was edited by hand or the spec changed afterwards; run `--gerar-metadata`');
    }
  }

  const existing = hasMetadata ? readdirSync(metadataDir).filter((n) => n.endsWith('.json')).sort() : [];
  for (const name of existing) {
    if (!expectedByName.has(name)) {
      fail('V32', join(metadataDir, name).replace(/\\/g, '/'), 'Metadata without a matching spec in force');
    }
  }
}

/**
 * Writes the Metadata of all specs in force, or of none: if one spec does not
 * fit the grammar, nothing is written. An orphan JSON is not deleted; V32
 * reports it, and what to do with it is up to a person.
 */
function generateMetadata() {
  const { expectedByName, readErrors } = computeMetadata(SPECS_ROOT);
  if (readErrors.length > 0) {
    console.error('FAILED: no Metadata was written.');
    for (const e of readErrors) console.error(`  - V32 ${e.filePath}: ${e.msg}`);
    return 1;
  }
  mkdirSync(METADATA_ROOT, { recursive: true });
  for (const [name, json] of expectedByName) {
    const filePath = join(METADATA_ROOT, name);
    /* Equal content is not rewritten: with `core.autocrlf`, rewriting in LF a
     * file that checkout brought in CRLF would dirty `git status` with no change. */
    if (existsSync(filePath) && read(filePath) === json) {
      console.log(`unchanged: ${METADATA_ROOT}/${name}`);
      continue;
    }
    writeFileSync(filePath, json, 'utf8');
    console.log(`written: ${METADATA_ROOT}/${name}`);
  }
  console.log('');
  return 0;
}

// ---------------------------------------------------------------
// QUEUE
// ---------------------------------------------------------------

function queue(tasks) {
  const all = [...tasks.values()].map((t) => t.data);
  const unblocks = (id) => all.filter((d) => (d.dependencias || []).includes(id)).length;

  const eligible = all
    .filter((d) => d.estado === 'pronta')
    .map((d) => ({ d, unblocks: unblocks(d.id) }))
    .sort((a, b) =>
      a.d.ordem_aprovada - b.d.ordem_aprovada ||
      a.d.fase.localeCompare(b.d.fase) ||
      b.unblocks - a.unblocks ||
      a.d.id.localeCompare(b.d.id));

  const excluded = all
    .filter((d) => d.estado !== 'pronta')
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((d) => {
      if (d.estado === 'bloqueada') {
        const b = (d.bloqueios || [])[0] || {};
        return { id: d.id, label: 'bloqueada', reason: `${b.o_que_trava || 'no description'} — owner: ${b.dono || '?'}` };
      }
      if (d.estado === 'em-andamento') {
        return { id: d.id, label: 'em-andamento', reason: `active context in ${OPERATIONS_ROOT}/contextos/${d.id}.md` };
      }
      if (d.estado === 'aguardando-decisao') {
        const p = (d.decisoes_pendentes || [])[0] || {};
        return { id: d.id, label: 'aguarda-decisao', reason: `${p.pergunta || 'no question'} — decides: ${p.quem_decide || '?'}` };
      }
      if (d.estado === 'em-revisao') {
        return { id: d.id, label: 'em-revisao', reason: `PR ${d.revisao_git && d.revisao_git.pr}` };
      }
      return { id: d.id, label: 'concluida', reason: 'already delivered, with evidence' };
    });

  return { eligible, excluded };
}

function printQueue(tasks) {
  const { eligible, excluded } = queue(tasks);
  const lines = [];

  if (eligible.length === 0) {
    lines.push('NEXT: (no eligible task)');
  } else {
    const p = eligible[0];
    lines.push(`NEXT: ${p.d.id}  (ordem_aprovada=${p.d.ordem_aprovada}, fase=${p.d.fase}, unblocks ${p.unblocks})`);
  }

  lines.push('', 'Eligible queue:');
  if (eligible.length === 0) lines.push('  (empty)');
  eligible.forEach((e, i) => {
    lines.push(`  ${i + 1}. ${e.d.id.padEnd(8)} order ${String(e.d.ordem_aprovada).padEnd(4)} ${e.d.fase}  unblocks ${e.unblocks}`);
  });

  lines.push('', 'Outside the queue:');
  if (excluded.length === 0) lines.push('  (empty)');
  for (const f of excluded) lines.push(`  ${f.id.padEnd(8)} ${f.label.padEnd(16)} ${f.reason}`);

  console.log(lines.join('\n'));
}

// ---------------------------------------------------------------
// SELF-TEST
// ---------------------------------------------------------------

/** One directory per case, and the code it MUST trigger. */
const INVALID_CASES = {
  'awaiting-without-question': 'V08',
  'blocked-without-blocker': 'V07',
  'missing-field': 'V04',
  'unknown-key': 'V03',
  'component-without-figma-gate': 'V30',
  'done-without-evidence': 'V06',
  'context-changes-state': 'V23',
  'cyclic-dependency': 'V12',
  'missing-dependency': 'V11',
  'invalid-state': 'V05',
  'figma-evidence-outside-directory': 'V31',
  'figma-evidence-without-provenance': 'V31',
  'missing-evidence': 'V16',
  'spec-quote-in-middle': 'V32',
  'spec-block-irregular-indent': 'V32',
  'spec-ambiguous-key': 'V32',
  'spec-ambiguous-scalar': 'V32',
  'spec-outside-subset': 'V32',
  'spec-inline-map': 'V32',
  'spec-map-in-list': 'V32',
  'id-off-pattern': 'V02',
  'id-mismatch': 'V01',
  'stale-metadata': 'V32',
  'metadata-without-spec': 'V32',
  'duplicate-order': 'V29',
  'piece-without-spec': 'V28',
  'ready-with-open-dependency': 'V09',
  'restricted-with-excerpt': 'V19',
};

/**
 * Each case checks its own specs and its own Metadata, never those of the
 * repository: otherwise an outdated Metadata in the real tree would show up as
 * an extra code in every case.
 */
function caseOptions(dir) {
  return { specs: join(dir, 'fichas'), metadata: join(dir, 'metadata'), metadataRequired: false };
}

function selfTest() {
  let failures = 0;

  console.log('=== VALID ===');
  const validDir = join(FIXTURES_ROOT, 'valid');
  const { errors: validErrors, checked } = validate(validDir, caseOptions(validDir));
  if (validErrors.length === 0) {
    console.log(`PASSED  valid                          ${checked} task(s), no errors`);
  } else {
    failures += 1;
    console.log('FAILED  valid                          should pass clean:');
    for (const e of validErrors) console.log(`          ${e.code} ${e.filePath}: ${e.msg}`);
  }

  /* The same text in LF and in CRLF must generate the same Metadata. Without
   * .gitattributes, it is the only way to prove both line endings on any
   * machine. */
  const caseSpec = read(join(validDir, 'fichas', 'nph-example.md'));
  const lfJson = readSpec(caseSpec).json;
  const crlfJson = readSpec(caseSpec.replace(/\n/g, '\r\n')).json;
  if (lfJson === crlfJson) {
    console.log('PASSED  line ending                    LF and CRLF generate the same Metadata');
  } else {
    failures += 1;
    console.log('FAILED  line ending                    LF and CRLF generate different Metadata');
  }

  console.log('\n=== INVALID: each one must fail WITH THE EXPECTED CODE ===');
  for (const [caseName, expected] of Object.entries(INVALID_CASES)) {
    const dir = join(FIXTURES_ROOT, 'invalid', caseName);
    if (!existsSync(dir)) {
      failures += 1;
      console.log(`FAILED  ${caseName.padEnd(30)} expected=${expected} got=(fixture missing)`);
      continue;
    }
    const { errors } = validate(dir, caseOptions(dir));
    const codes = [...new Set(errors.map((e) => e.code))].sort();
    const ok = codes.length === 1 && codes[0] === expected;
    if (!ok) failures += 1;
    console.log(
      `${ok ? 'PASSED' : 'FAILED'}  ${caseName.padEnd(30)} expected=${expected} got=${codes.join(',') || '(no error)'}`,
    );
    if (!ok) for (const e of errors) console.log(`          ${e.code} ${e.filePath}: ${e.msg}`);
  }

  const total = Object.keys(INVALID_CASES).length;
  console.log(
    '\n' + (failures === 0
      ? `RESULT: 1 valid tree + ${total} of ${total} invalid cases, each with the expected code.`
      : `RESULT: ${failures} failure(s).`),
  );
  return failures === 0 ? 0 : 1;
}

// ---------------------------------------------------------------
// CLI
// ---------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes('--gerar-metadata') && (args.includes('--exemplos') || args.includes('--proxima'))) {
  console.error('`--gerar-metadata` cannot be combined with `--exemplos` or `--proxima`.');
  process.exit(2);
}

if (args.includes('--exemplos')) {
  process.exit(selfTest());
}

if (args.includes('--gerar-metadata') && generateMetadata() !== 0) {
  process.exit(1);
}

const { errors, tasks, checked } = validate(OPERATIONS_ROOT);

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  - ${e.code} ${e.filePath}: ${e.msg}`);
  if (args.includes('--proxima')) {
    console.error('\nThe queue was NOT computed: a queue over an invalid tree is worse than no queue.');
  }
  process.exit(1);
}

console.log(`${checked} task(s) checked.`);

if (args.includes('--proxima')) {
  console.log('');
  printQueue(tasks);
} else {
  console.log('OK: schema, states, dependencies, gates, evidence, context and spec check out.');
}

process.exit(0);
