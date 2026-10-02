/**
 * Verificador da estrutura operacional do Nephos.
 *
 * O ponto central: uma tarefa nao pode PARECER pronta. Estado se prova no
 * artefato — gate com evidencia que existe em disco, dependencia que existe na
 * arvore, ponteiro de ficha que resolve. O verificador abre o arquivo em vez de
 * acreditar no campo.
 *
 * A metade de maquina de tarefa, contexto e evidencia e um bloco JSON cercado,
 * o primeiro do arquivo Markdown. JSON e nao YAML por decisao de Indiane em
 * 02-09-2026: adotar um leitor de YAML completo custaria uma dependencia nova, e
 * o `JSON.parse` ja vem no Node. A ficha e a excecao: o YAML dela e lido por
 * `spec-lib.mjs`, que cobre so um subconjunto fechado e nao traz dependencia.
 * Tarefa continua em JSON.
 *
 * Contrato completo em docs/operacao/README.md.
 *
 * Uso:
 *   node scripts/verificar-operacao.mjs              valida docs/operacao/
 *   node scripts/verificar-operacao.mjs --proxima    valida e mostra a fila
 *   node scripts/verificar-operacao.mjs --exemplos   autoteste sobre os fixtures
 *   node scripts/verificar-operacao.mjs --gerar-metadata
 *                                                    grava a Metadata a partir
 *                                                    das fichas e valida
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { SpecError, readSpec } from './spec-lib.mjs';

const OPERATIONS_ROOT = 'docs/operacao';
const FIXTURES_ROOT = 'scripts/fixtures/operations';
const COMPONENTS_ROOT = 'src/components';
const SPECS_ROOT = 'fichas';
/** A Metadata e gerada: so `--gerar-metadata` grava aqui. Nunca edite a mao. */
const METADATA_ROOT = 'src/shared/metadata';

const STATES = ['pronta', 'em-andamento', 'aguardando-decisao', 'bloqueada', 'em-revisao', 'concluida'];
const OWNERS = ['indiane', 'claude-codigo', 'claude-figma', 'copilot', 'elvys'];
const PHASES = ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
const CLASSIFICATIONS = ['publica', 'interna-permitida', 'interna-restrita', 'desconhecida'];
const GATE_RESULTS = ['pendente', 'passou', 'falhou'];

/**
 * A trava documental. A documentacao Figma aceita vem ANTES do codigo de
 * componente; a ficha canonica vem DEPOIS dele, antes da revisao. Por isso os
 * dois conjuntos de estado sao diferentes: codigo local sem ficha e trabalho em
 * curso, nao violacao.
 */
const FIGMA_DOCS_GATE = 'documentacao-figma-aceita';
const STATES_REQUIRING_FIGMA_GATE = ['pronta', 'em-andamento', 'em-revisao', 'concluida'];
const STATES_REQUIRING_SPEC = ['em-revisao', 'concluida'];

/** Schema fechado: chave de topo fora desta lista reprova em V03. */
const FIELDS = [
  'id', 'objetivo', 'fase', 'ordem_aprovada', 'responsavel', 'estado', 'peca',
  'dependencias', 'gates', 'bloqueios', 'decisoes_pendentes', 'evidencias',
  'referencias_de_decisao', 'origem_externa', 'revisao_git', 'contexto', 'atualizado_em',
];
const TEXT_FIELDS = ['id', 'objetivo', 'fase', 'responsavel', 'estado', 'atualizado_em'];
const LIST_FIELDS = ['dependencias', 'gates', 'bloqueios', 'decisoes_pendentes', 'evidencias', 'referencias_de_decisao'];

/** O contexto nao decide: estas seis chaves sao proibidas nele (V23). */
const CONTEXT_KEYS = ['tarefa', 'worktree', 'sha_inicial', 'sha_final'];
const FORBIDDEN_CONTEXT_KEYS = ['estado', 'fase', 'ordem_aprovada', 'prioridade', 'escopo', 'decisao'];
const CONTEXT_LINE_LIMIT = 60;

const ID_PATTERN = /^[A-Z][A-Z0-9]{1,3}-[A-Z0-9]{1,6}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Varredura de segredo. Automatiza a regra de retomada segura da PO-001: a
 * configuracao local de credencial fica fora do Git. O padrao do token do Font
 * Awesome e montado em duas partes de proposito, para que este proprio arquivo
 * nao contenha a string que ele procura.
 */
const SECRETS = [
  { name: 'token pessoal do GitHub', re: /ghp_[A-Za-z0-9]{16,}/ },
  { name: 'token pessoal do GitHub (fine-grained)', re: /github_pat_[A-Za-z0-9_]{16,}/ },
  { name: 'credencial de registro npm', re: /\/\/registry\.npmjs\.org\/:_authToken/ },
  { name: 'token do Font Awesome com valor', re: new RegExp('FONTAWESOME_NPM' + '_AUTH_TOKEN\\s*=\\s*\\S+') },
  { name: 'chave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

// ---------------------------------------------------------------
// LEITURA
// ---------------------------------------------------------------

const read = (filePath) => readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const listMarkdown = (dir) => (existsSync(dir) && statSync(dir).isDirectory()
  ? readdirSync(dir).filter((n) => n.endsWith('.md') && statSync(join(dir, n)).isFile()).sort()
  : []);

/** Extrai e faz parse do PRIMEIRO bloco ```json do arquivo. */
function jsonBlock(text) {
  const m = text.match(/```json\n([\s\S]*?)\n```/);
  if (m === null) return { error: 'nao ha bloco json cercado no arquivo' };
  try {
    const data = JSON.parse(m[1]);
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return { error: 'o bloco json nao e um objeto' };
    }
    return { data };
  } catch (e) {
    return { error: 'o bloco json nao faz parse: ' + e.message };
  }
}

const isEmpty = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

// ---------------------------------------------------------------
// VALIDACAO
// ---------------------------------------------------------------

/**
 * V31 — a procedencia da evidencia do gate documental.
 *
 * A trava so vale se a prova disser DE ONDE a documentacao veio e QUEM a
 * aceitou. Um gate "passou" sem procedencia e uma palavra: nao da para
 * auditar depois, e e exatamente o que a V30 tenta impedir. A evidencia fica
 * em `evidencias/<ID>/` da propria arvore, e nao carrega conteudo restrito do
 * Figma — so a decisao convertida, com o frame e o COMPONENT_SET que a
 * originaram.
 *
 * V15, V16 e V17 ja cobrem gate sem evidencia, ponteiro quebrado e bloco JSON
 * invalido. Esta funcao so olha o que sobra: a procedencia.
 */
function validateDocumentEvidence(taskId, gate, fail) {
  const ev = gate.evidencia;
  if (typeof ev !== 'string' || isEmpty(ev) || !existsSync(ev)) return;
  const filePath = ev.replace(/\\/g, '/');

  if (!new RegExp(`(^|/)evidencias/${taskId}/[^/]+\\.md$`).test(filePath)) {
    fail('V31', filePath, `a evidencia documental de "${taskId}" tem de ficar em evidencias/${taskId}/`);
  }

  const { data, error } = jsonBlock(read(filePath));
  if (error) return;

  if (data.gate !== FIGMA_DOCS_GATE) {
    fail('V31', filePath, `o campo "gate" e "${data.gate}", e nao "${FIGMA_DOCS_GATE}"`);
  }
  if (data.responsavel !== 'indiane') {
    fail('V31', filePath, `quem aceita a documentacao e indiane, e "responsavel" declara "${data.responsavel}"`);
  }

  const origin = data.origem_externa;
  if (origin === undefined || origin === null || typeof origin !== 'object' || Array.isArray(origin)) {
    fail('V31', filePath, 'a evidencia documental nao declara "origem_externa" como objeto');
    return;
  }
  if (origin.classificacao !== 'interna-permitida') {
    fail('V31', filePath, `origem_externa.classificacao e "${origin.classificacao}" — a documentacao Figma e "interna-permitida"`);
  }
  if (isEmpty(origin.url_ou_id)) {
    fail('V31', filePath, 'origem_externa nao declara "url_ou_id" — falta a URL ou o ID do Figma');
  } else if (!/figma/i.test(origin.url_ou_id)) {
    fail('V31', filePath, `origem_externa.url_ou_id "${origin.url_ou_id}" nao aponta para o Figma`);
  }
  if (isEmpty(origin.data)) {
    fail('V31', filePath, 'origem_externa nao declara "data"');
  } else if (!DATE_PATTERN.test(origin.data)) {
    fail('V31', filePath, `origem_externa.data "${origin.data}" nao esta em AAAA-MM-DD`);
  }
  if (isEmpty(origin.autoria)) {
    fail('V31', filePath, 'origem_externa nao declara "autoria" — falta quem registrou');
  }
  if (isEmpty(origin.decisao_convertida)) {
    fail('V31', filePath, 'origem_externa nao declara "decisao_convertida"');
    return;
  }
  if (!/frame/i.test(origin.decisao_convertida)) {
    fail('V31', filePath, 'origem_externa.decisao_convertida nao nomeia o frame de origem');
  }
  if (!origin.decisao_convertida.includes('COMPONENT_SET')) {
    fail('V31', filePath, 'origem_externa.decisao_convertida nao nomeia o COMPONENT_SET');
  }
}

/**
 * Valida uma arvore operacional inteira.
 * `root` e o diretorio que contem tarefas/, contextos/ e evidencias/.
 * Caminhos declarados em evidencias[] sao sempre a partir da raiz do
 * repositorio, e precisam existir la.
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

  /* ---- carga ---- */
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
        fail('V03', filePath, `chave de topo desconhecida "${key}" — o schema e fechado`);
      }
    }

    tasks.set(fileId, { filePath, fileId, data, text });
  }

  /* Indice por id declarado, usado por dependencias e contextos. */
  const byId = new Map();
  for (const t of tasks.values()) {
    const id = typeof t.data.id === 'string' ? t.data.id : null;
    if (id === null) continue;
    if (byId.has(id)) {
      fail('V02', t.filePath, `id "${id}" duplicado — ja declarado em ${byId.get(id).filePath}`);
    } else {
      byId.set(id, t);
    }
  }

  /* ---- por tarefa ---- */
  for (const t of [...tasks.values()].sort((a, b) => a.filePath.localeCompare(b.filePath))) {
    const { filePath, fileId, data } = t;

    // V04 — campo obrigatorio presente e nao vazio
    for (const field of FIELDS) {
      if (!(field in data)) {
        fail('V04', filePath, `falta o campo obrigatorio "${field}"`);
        continue;
      }
      if (TEXT_FIELDS.includes(field) && isEmpty(data[field])) {
        fail('V04', filePath, `o campo "${field}" esta vazio`);
      }
      if (LIST_FIELDS.includes(field) && !Array.isArray(data[field])) {
        fail('V04', filePath, `o campo "${field}" tem de ser uma lista`);
      }
    }

    // V01 — nome do arquivo igual ao id
    if (data.id !== fileId) {
      fail('V01', filePath, `o id declarado e "${data.id}", mas o arquivo se chama "${fileId}.md"`);
    }

    // V02 — id casa o padrao
    if (typeof data.id === 'string' && !ID_PATTERN.test(data.id)) {
      fail('V02', filePath, `o id "${data.id}" nao casa com ${ID_PATTERN}`);
    }

    if (typeof data.fase === 'string' && !PHASES.includes(data.fase)) {
      fail('V04', filePath, `fase "${data.fase}" fora de ${PHASES.join(', ')}`);
    }
    if (typeof data.responsavel === 'string' && !OWNERS.includes(data.responsavel)) {
      fail('V04', filePath, `responsavel "${data.responsavel}" fora de ${OWNERS.join(', ')}`);
    }
    if (typeof data.atualizado_em === 'string' && !DATE_PATTERN.test(data.atualizado_em)) {
      fail('V04', filePath, `atualizado_em "${data.atualizado_em}" nao esta em AAAA-MM-DD`);
    }
    if (data.revisao_git === undefined || data.revisao_git === null || typeof data.revisao_git !== 'object') {
      fail('V04', filePath, 'revisao_git tem de ser um objeto com branch, commit e pr');
    } else {
      for (const key of ['branch', 'commit', 'pr']) {
        if (!(key in data.revisao_git)) {
          fail('V04', filePath, `revisao_git nao declara "${key}"`);
        }
      }
    }

    // V05 — estado e um dos seis
    const state = data.estado;
    if (!STATES.includes(state)) {
      fail('V05', filePath, `estado "${state}" nao existe — use ${STATES.join(', ')}`);
    }

    const gates = Array.isArray(data.gates) ? data.gates : [];
    if (Array.isArray(data.gates) && gates.length === 0) {
      fail('V14', filePath, 'a tarefa nao declara nenhum gate');
    }

    // V14 / V15 — forma do gate
    gates.forEach((g, i) => {
      const where = `gate #${i + 1}`;
      if (g === null || typeof g !== 'object') {
        fail('V14', filePath, `${where} nao e um objeto`);
        return;
      }
      for (const key of ['id', 'descricao', 'resultado']) {
        if (isEmpty(g[key])) fail('V14', filePath, `${where} nao declara "${key}"`);
      }
      if (g.resultado !== undefined && !GATE_RESULTS.includes(g.resultado)) {
        fail('V14', filePath, `${where} tem resultado "${g.resultado}" — use ${GATE_RESULTS.join(', ')}`);
      }
      if (g.resultado === 'passou') {
        for (const key of ['evidencia', 'verificado_em', 'verificado_por']) {
          if (isEmpty(g[key])) fail('V15', filePath, `${where} passou mas nao declara "${key}"`);
        }
      }
    });

    // V06 — concluida com todo gate passou e evidencia existente
    if (state === 'concluida') {
      for (const [i, g] of gates.entries()) {
        if (g === null || typeof g !== 'object') continue;
        if (g.resultado !== 'passou') {
          fail('V06', filePath, `estado concluida, mas o gate #${i + 1} esta "${g.resultado}"`);
        } else if (isEmpty(g.evidencia) || !existsSync(g.evidencia)) {
          fail('V06', filePath, `estado concluida, mas a evidencia do gate #${i + 1} nao existe em disco`);
        }
      }
    }

    // V07 — bloqueada com bloqueio aberto
    if (state === 'bloqueada') {
      const blockers = Array.isArray(data.bloqueios) ? data.bloqueios : [];
      const validBlockers = blockers.filter((b) => b && typeof b === 'object' && !isEmpty(b.dono) && !isEmpty(b.o_que_resolve));
      if (validBlockers.length === 0) {
        fail('V07', filePath, 'estado bloqueada exige ao menos um bloqueio com "dono" e "o_que_resolve"');
      }
    }

    // V08 — aguardando-decisao com pergunta e quem_decide
    if (state === 'aguardando-decisao') {
      const pending = Array.isArray(data.decisoes_pendentes) ? data.decisoes_pendentes : [];
      const validDecisions = pending.filter((d) => d && typeof d === 'object' && !isEmpty(d.pergunta) && !isEmpty(d.quem_decide));
      if (validDecisions.length === 0) {
        fail('V08', filePath, 'estado aguardando-decisao exige uma decisao pendente com "pergunta" e "quem_decide"');
      }
    }

    // V10 — em-revisao com revisao_git.pr
    if (state === 'em-revisao') {
      const pr = data.revisao_git && data.revisao_git.pr;
      if (isEmpty(pr)) fail('V10', filePath, 'estado em-revisao exige revisao_git.pr preenchido');
    }

    const deps = Array.isArray(data.dependencias) ? data.dependencias : [];

    // V13 — sem autodependencia
    if (deps.includes(data.id)) {
      fail('V13', filePath, `a tarefa depende de si mesma`);
    }

    // V11 — todo id citado existe
    for (const dep of deps) {
      if (!byId.has(dep)) {
        fail('V11', filePath, `depende de "${dep}", que nao existe nesta arvore`);
      }
    }

    // V09 — pronta com todas as dependencias concluidas
    if (state === 'pronta') {
      for (const dep of deps) {
        const target = byId.get(dep);
        const depState = target ? target.data.estado : '(inexistente)';
        if (depState !== 'concluida') {
          fail('V09', filePath, `estado pronta, mas a dependencia "${dep}" esta "${depState}"`);
        }
      }
    }

    // V16 / V17 — evidencias declaradas
    const evidencePaths = [
      ...(Array.isArray(data.evidencias) ? data.evidencias : []),
      ...gates.map((g) => (g && typeof g === 'object' ? g.evidencia : null)).filter((c) => !isEmpty(c)),
    ];
    for (const ev of [...new Set(evidencePaths)].sort()) {
      if (typeof ev !== 'string' || !existsSync(ev)) {
        fail('V16', filePath, `a evidencia "${ev}" nao existe em disco`);
        continue;
      }
      const { data: evidenceData, error } = jsonBlock(read(ev));
      if (error) {
        fail('V17', ev, `evidencia sem bloco json valido: ${error}`);
      } else if (evidenceData.tarefa !== data.id) {
        fail('V17', ev, `a evidencia declara tarefa "${evidenceData.tarefa}", mas esta referenciada por "${data.id}"`);
      }
    }

    // V18 / V19 / V20 — origem externa
    const origin = data.origem_externa;
    if (origin !== undefined && origin !== null) {
      if (typeof origin !== 'object' || Array.isArray(origin)) {
        fail('V18', filePath, 'origem_externa tem de ser um objeto ou null');
      } else if (!CLASSIFICATIONS.includes(origin.classificacao)) {
        fail('V18', filePath, `classificacao "${origin.classificacao}" fora de ${CLASSIFICATIONS.join(', ')}`);
      } else {
        const c = origin.classificacao;
        if (c === 'publica') {
          for (const key of ['url_ou_id', 'data']) {
            if (isEmpty(origin[key])) fail('V20', filePath, `origem publica exige "${key}"`);
          }
        }
        if (c === 'interna-permitida') {
          for (const key of ['url_ou_id', 'data', 'autoria', 'decisao_convertida']) {
            if (isEmpty(origin[key])) fail('V20', filePath, `origem interna-permitida exige "${key}"`);
          }
        }
        if (c === 'interna-restrita' || c === 'desconhecida') {
          if (!isEmpty(origin.trecho)) {
            fail('V19', filePath, `origem ${c} nao pode carregar "trecho" — o conteudo nao e copiado`);
          }
          if (state !== 'bloqueada' && state !== 'aguardando-decisao') {
            fail('V19', filePath, `origem ${c} exige a tarefa em bloqueada ou aguardando-decisao, e ela esta "${state}"`);
          }
        }
      }
    }

    // V28 — a ficha canonica e cobrada no fim, nao no comeco. Codigo local sem
    // ficha e permitido enquanto a tarefa esta pronta ou em andamento.
    if (!isEmpty(data.peca) && STATES_REQUIRING_SPEC.includes(state)) {
      const spec = join(SPECS_ROOT, `${data.peca}.md`).replace(/\\/g, '/');
      if (!existsSync(spec)) {
        fail('V28', filePath, `estado ${state} com peca "${data.peca}", mas ${spec} nao existe`);
      }
    }

    // V30 — nenhum codigo de componente antes da documentacao Figma aceita.
    const isComponentTask = data.responsavel === 'claude-codigo' && !isEmpty(data.peca);
    const figmaGate = gates.find((g) => g !== null && typeof g === 'object' && g.id === FIGMA_DOCS_GATE);
    if (isComponentTask && STATES_REQUIRING_FIGMA_GATE.includes(state)) {
      if (figmaGate === undefined) {
        fail('V30', filePath, `tarefa de componente em "${state}" nao declara o gate "${FIGMA_DOCS_GATE}"`);
      } else if (figmaGate.resultado !== 'passou') {
        fail('V30', filePath, `tarefa de componente em "${state}" tem "${FIGMA_DOCS_GATE}" em "${figmaGate.resultado}" — exige "passou"`);
      }
    }

    // V31 — o gate documental aprovado prova de onde a documentacao veio.
    for (const g of gates) {
      if (g === null || typeof g !== 'object') continue;
      if (g.id !== FIGMA_DOCS_GATE || g.resultado !== 'passou') continue;
      validateDocumentEvidence(data.id, g, fail);
    }
  }

  // V12 — sem ciclo
  const inCycle = new Set();
  const color = new Map();
  const visit = (id, stack) => {
    if (color.get(id) === 'preto') return;
    if (color.get(id) === 'cinza') {
      for (const n of stack.slice(stack.indexOf(id))) inCycle.add(n);
      return;
    }
    color.set(id, 'cinza');
    const t = byId.get(id);
    const deps = t && Array.isArray(t.data.dependencias) ? t.data.dependencias : [];
    for (const d of deps) if (byId.has(d)) visit(d, [...stack, id]);
    color.set(id, 'preto');
  };
  for (const id of [...byId.keys()].sort()) visit(id, []);
  for (const id of [...inCycle].sort()) {
    fail('V12', byId.get(id).filePath, `"${id}" participa de um ciclo de dependencias`);
  }

  // V29 — ordem_aprovada inteira, >= 1, unica entre as nao concluidas
  const orders = new Map();
  for (const t of [...tasks.values()].sort((a, b) => a.filePath.localeCompare(b.filePath))) {
    const o = t.data.ordem_aprovada;
    if (!Number.isInteger(o) || o < 1) {
      fail('V29', t.filePath, `ordem_aprovada "${o}" tem de ser inteiro >= 1`);
      continue;
    }
    if (t.data.estado === 'concluida') continue;
    if (orders.has(o)) {
      fail('V29', t.filePath, `ordem_aprovada ${o} ja e usada por ${orders.get(o)}`);
    } else {
      orders.set(o, t.filePath);
    }
  }

  /* ---- contextos ---- */
  const contexts = new Map();
  for (const name of listMarkdown(contextsDir)) {
    const filePath = join(contextsDir, name).replace(/\\/g, '/');
    const text = read(filePath);
    const { data, error } = jsonBlock(text);
    if (error) {
      fail('V22', filePath, `contexto sem bloco json valido: ${error}`);
      continue;
    }
    contexts.set(basename(name, '.md'), { filePath, data });

    // V22 — aponta para tarefa existente
    if (isEmpty(data.tarefa) || !byId.has(data.tarefa)) {
      fail('V22', filePath, `o contexto aponta para a tarefa "${data.tarefa}", que nao existe nesta arvore`);
    }

    // V23 — conjunto de chaves fechado, sem as seis proibidas
    for (const key of Object.keys(data)) {
      if (FORBIDDEN_CONTEXT_KEYS.includes(key)) {
        fail('V23', filePath, `o contexto nao decide: a chave "${key}" e proibida`);
      } else if (!CONTEXT_KEYS.includes(key)) {
        fail('V23', filePath, `chave "${key}" fora do conjunto ${CONTEXT_KEYS.join(', ')}`);
      }
    }

    // V24 — teto de linhas
    const lines = text.replace(/\n+$/, '').split('\n').length;
    if (lines > CONTEXT_LINE_LIMIT) {
      fail('V24', filePath, `${lines} linhas — o teto e ${CONTEXT_LINE_LIMIT}. Contexto que cresce virou diario`);
    }
  }

  // V25 / V26 — presenca do contexto conforme o estado
  for (const t of [...byId.values()].sort((a, b) => a.filePath.localeCompare(b.filePath))) {
    const ctx = contexts.get(t.data.id);
    if (t.data.estado === 'concluida' && ctx) {
      fail('V25', ctx.filePath, `a tarefa "${t.data.id}" esta concluida e nao pode ter contexto ativo`);
    }
    if (t.data.estado === 'em-andamento') {
      if (!ctx) {
        fail('V26', t.filePath, 'estado em-andamento exige um contexto em contextos/<ID>.md');
      } else {
        for (const key of ['worktree', 'sha_inicial']) {
          if (isEmpty(ctx.data[key])) fail('V26', ctx.filePath, `o contexto nao declara "${key}"`);
        }
      }
    }
  }

  // V21 — varredura de segredo em tarefas/, contextos/ e evidencias/
  const scan = (dir) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      const filePath = join(dir, name).replace(/\\/g, '/');
      if (statSync(filePath).isDirectory()) { scan(filePath); continue; }
      if (!name.endsWith('.md')) continue;
      const text = read(filePath);
      for (const { name: label, re } of SECRETS) {
        if (re.test(text)) fail('V21', filePath, `padrao de ${label} encontrado — segredo nunca entra no repositorio`);
      }
    }
  };
  scan(tasksDir);
  scan(contextsDir);
  scan(evidenceDir);

  // V27 — nenhum contrato concorrente ao lado do componente
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
    fail('V27', p, 'contrato concorrente: a ficha em fichas/<nome>.md e a fonte, e a Metadata deriva dela (PI-01)');
  }

  // V32 — a Metadata e copia fiel da ficha vigente
  validateMetadata(specsDir, metadataDir, metadataRequired, fail);

  errors.sort((a, b) => (a.code + a.filePath + a.msg).localeCompare(b.code + b.filePath + b.msg));
  return { errors, tasks: byId, contexts, checked: tasks.size };
}

// ---------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------

/**
 * Le as fichas do primeiro nivel de `specsDir` e calcula a Metadata que cada
 * ficha vigente produz. Arquivo sem `---` na linha 1 nao e ficha e fica de
 * fora. Ficha que nao cabe na gramatica vira erro, com a linha.
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
      readErrors.push({ filePath: `${filePath}:${e.line}`, msg: `a ficha nao cabe na gramatica: ${e.message}` });
    }
  }
  return { expectedByName, readErrors };
}

/**
 * V32. A Metadata so vale se for a copia exata do que a ficha produz: um
 * arquivo derivado que diverge da fonte e o ponteiro que quebra em silencio.
 * A comparacao normaliza o fim de linha (`read`), porque com `core.autocrlf` o
 * mesmo arquivo chega em CRLF no Windows e em LF no resto.
 *
 * No uso real as duas pastas sao obrigatorias. No autoteste, um caso sem
 * `fichas/` e sem `metadata/` nao tem o que conferir.
 */
function validateMetadata(specsDir, metadataDir, required, fail) {
  const hasSpecs = existsSync(specsDir);
  const hasMetadata = existsSync(metadataDir);
  if (!required && !hasSpecs && !hasMetadata) return;
  if (required && !hasSpecs) {
    fail('V32', specsDir, 'a pasta de fichas nao existe');
    return;
  }

  const { expectedByName, readErrors } = hasSpecs ? computeMetadata(specsDir) : { expectedByName: new Map(), readErrors: [] };
  for (const e of readErrors) fail('V32', e.filePath, e.msg);

  if (required && !hasMetadata && expectedByName.size > 0) {
    fail('V32', metadataDir, 'a pasta da Metadata nao existe — rode node scripts/verificar-operacao.mjs --gerar-metadata');
    return;
  }

  for (const [name, json] of expectedByName) {
    const filePath = join(metadataDir, name).replace(/\\/g, '/');
    if (!existsSync(filePath)) {
      fail('V32', filePath, 'falta a Metadata desta ficha vigente — rode --gerar-metadata');
    } else if (read(filePath) !== json) {
      fail('V32', filePath, 'a Metadata nao bate com a ficha: ela foi editada a mao ou a ficha mudou depois — rode --gerar-metadata');
    }
  }

  const existing = hasMetadata ? readdirSync(metadataDir).filter((n) => n.endsWith('.json')).sort() : [];
  for (const name of existing) {
    if (!expectedByName.has(name)) {
      fail('V32', join(metadataDir, name).replace(/\\/g, '/'), 'Metadata sem ficha vigente correspondente');
    }
  }
}

/**
 * Grava a Metadata de todas as fichas vigentes, ou de nenhuma: se uma ficha
 * nao cabe na gramatica, nada e gravado. JSON orfao nao e apagado — a V32 o
 * acusa, e quem decide o que fazer com ele e uma pessoa.
 */
function generateMetadata() {
  const { expectedByName, readErrors } = computeMetadata(SPECS_ROOT);
  if (readErrors.length > 0) {
    console.error('FALHOU: nenhuma Metadata foi gravada.');
    for (const e of readErrors) console.error(`  - V32 ${e.filePath}: ${e.msg}`);
    return 1;
  }
  mkdirSync(METADATA_ROOT, { recursive: true });
  for (const [name, json] of expectedByName) {
    const filePath = join(METADATA_ROOT, name);
    /* Conteudo igual nao se regrava: com `core.autocrlf`, regravar em LF um
     * arquivo que o checkout trouxe em CRLF sujaria o `git status` sem mudanca. */
    if (existsSync(filePath) && read(filePath) === json) {
      console.log(`inalterado: ${METADATA_ROOT}/${name}`);
      continue;
    }
    writeFileSync(filePath, json, 'utf8');
    console.log(`gravado: ${METADATA_ROOT}/${name}`);
  }
  console.log('');
  return 0;
}

// ---------------------------------------------------------------
// FILA
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
        return { id: d.id, label: 'bloqueada', reason: `${b.o_que_trava || 'sem descricao'} — dono: ${b.dono || '?'}` };
      }
      if (d.estado === 'em-andamento') {
        return { id: d.id, label: 'em-andamento', reason: `contexto ativo em ${OPERATIONS_ROOT}/contextos/${d.id}.md` };
      }
      if (d.estado === 'aguardando-decisao') {
        const p = (d.decisoes_pendentes || [])[0] || {};
        return { id: d.id, label: 'aguarda-decisao', reason: `${p.pergunta || 'sem pergunta'} — decide: ${p.quem_decide || '?'}` };
      }
      if (d.estado === 'em-revisao') {
        return { id: d.id, label: 'em-revisao', reason: `PR ${d.revisao_git && d.revisao_git.pr}` };
      }
      return { id: d.id, label: 'concluida', reason: 'ja entregue, com evidencia' };
    });

  return { eligible, excluded };
}

function printQueue(tasks) {
  const { eligible, excluded } = queue(tasks);
  const lines = [];

  if (eligible.length === 0) {
    lines.push('PROXIMA: (nenhuma tarefa elegivel)');
  } else {
    const p = eligible[0];
    lines.push(`PROXIMA: ${p.d.id}  (ordem_aprovada=${p.d.ordem_aprovada}, fase=${p.d.fase}, destrava ${p.unblocks})`);
  }

  lines.push('', 'Fila de elegiveis:');
  if (eligible.length === 0) lines.push('  (vazia)');
  eligible.forEach((e, i) => {
    lines.push(`  ${i + 1}. ${e.d.id.padEnd(8)} ordem ${String(e.d.ordem_aprovada).padEnd(4)} ${e.d.fase}  destrava ${e.unblocks}`);
  });

  lines.push('', 'Fora da fila:');
  if (excluded.length === 0) lines.push('  (vazia)');
  for (const f of excluded) lines.push(`  ${f.id.padEnd(8)} ${f.label.padEnd(16)} ${f.reason}`);

  console.log(lines.join('\n'));
}

// ---------------------------------------------------------------
// AUTOTESTE
// ---------------------------------------------------------------

/** Um diretorio por caso, e o codigo que ele TEM de disparar. */
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
 * Cada caso confere as proprias fichas e a propria Metadata, nunca as do
 * repositorio: senao uma Metadata desatualizada na arvore real apareceria como
 * codigo extra em todos os casos.
 */
function caseOptions(dir) {
  return { specs: join(dir, 'fichas'), metadata: join(dir, 'metadata'), metadataRequired: false };
}

function selfTest() {
  let failures = 0;

  console.log('=== VALIDOS ===');
  const validDir = join(FIXTURES_ROOT, 'valid');
  const { errors: validErrors, checked } = validate(validDir, caseOptions(validDir));
  if (validErrors.length === 0) {
    console.log(`PASSOU  valid                          ${checked} tarefa(s), nenhum erro`);
  } else {
    failures += 1;
    console.log('FALHOU  valid                          deveria passar limpo:');
    for (const e of validErrors) console.log(`          ${e.code} ${e.filePath}: ${e.msg}`);
  }

  /* O mesmo texto em LF e em CRLF tem de gerar a mesma Metadata. Sem
   * .gitattributes, e o unico jeito de provar os dois fins de linha em
   * qualquer maquina. */
  const caseSpec = read(join(validDir, 'fichas', 'nph-example.md'));
  const lfJson = readSpec(caseSpec).json;
  const crlfJson = readSpec(caseSpec.replace(/\n/g, '\r\n')).json;
  if (lfJson === crlfJson) {
    console.log('PASSOU  fim de linha                   LF e CRLF geram a mesma Metadata');
  } else {
    failures += 1;
    console.log('FALHOU  fim de linha                   LF e CRLF geram Metadata diferente');
  }

  console.log('\n=== INVALIDOS: cada um tem de falhar PELO CODIGO PREVISTO ===');
  for (const [caseName, expected] of Object.entries(INVALID_CASES)) {
    const dir = join(FIXTURES_ROOT, 'invalid', caseName);
    if (!existsSync(dir)) {
      failures += 1;
      console.log(`FALHOU  ${caseName.padEnd(30)} esperado=${expected} obtido=(fixture ausente)`);
      continue;
    }
    const { errors } = validate(dir, caseOptions(dir));
    const codes = [...new Set(errors.map((e) => e.code))].sort();
    const ok = codes.length === 1 && codes[0] === expected;
    if (!ok) failures += 1;
    console.log(
      `${ok ? 'PASSOU' : 'FALHOU'}  ${caseName.padEnd(30)} esperado=${expected} obtido=${codes.join(',') || '(nenhum erro)'}`,
    );
    if (!ok) for (const e of errors) console.log(`          ${e.code} ${e.filePath}: ${e.msg}`);
  }

  const total = Object.keys(INVALID_CASES).length;
  console.log(
    '\n' + (failures === 0
      ? `RESULTADO: 1 arvore valida + ${total} de ${total} casos invalidos, cada um pelo codigo previsto.`
      : `RESULTADO: ${failures} falha(s).`),
  );
  return failures === 0 ? 0 : 1;
}

// ---------------------------------------------------------------
// CLI
// ---------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes('--gerar-metadata') && (args.includes('--exemplos') || args.includes('--proxima'))) {
  console.error('--gerar-metadata nao se combina com --exemplos nem com --proxima.');
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
  console.error(`FALHOU: ${errors.length} erro(s)`);
  for (const e of errors) console.error(`  - ${e.code} ${e.filePath}: ${e.msg}`);
  if (args.includes('--proxima')) {
    console.error('\nA fila NAO foi calculada: fila sobre arvore invalida e pior que fila nenhuma.');
  }
  process.exit(1);
}

console.log(`${checked} tarefa(s) conferida(s).`);

if (args.includes('--proxima')) {
  console.log('');
  printQueue(tasks);
} else {
  console.log('OK: schema, estados, dependencias, gates, evidencias, contexto e ficha conferem.');
}

process.exit(0);
