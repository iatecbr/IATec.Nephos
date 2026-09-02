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
 * 02-09-2026: nenhum script deste repositorio le YAML, e adotar YAML custaria
 * uma dependencia nova. O `JSON.parse` ja vem no Node.
 *
 * Contrato completo em docs/operacao/README.md.
 *
 * Uso:
 *   node scripts/verificar-operacao.mjs              valida docs/operacao/
 *   node scripts/verificar-operacao.mjs --proxima    valida e mostra a fila
 *   node scripts/verificar-operacao.mjs --exemplos   autoteste sobre os fixtures
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const RAIZ_OPERACAO = 'docs/operacao';
const RAIZ_FIXTURES = 'scripts/fixtures/operacao';
const RAIZ_COMPONENTES = 'src/components';
const RAIZ_FICHAS = 'fichas';

const ESTADOS = ['pronta', 'em-andamento', 'aguardando-decisao', 'bloqueada', 'em-revisao', 'concluida'];
const RESPONSAVEIS = ['indiane', 'claude-codigo', 'claude-figma', 'copilot', 'elvys'];
const FASES = ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
const CLASSIFICACOES = ['publica', 'interna-permitida', 'interna-restrita', 'desconhecida'];
const RESULTADOS_GATE = ['pendente', 'passou', 'falhou'];

/** Schema fechado: chave de topo fora desta lista reprova em V03. */
const CAMPOS = [
  'id', 'objetivo', 'fase', 'ordem_aprovada', 'responsavel', 'estado', 'peca',
  'dependencias', 'gates', 'bloqueios', 'decisoes_pendentes', 'evidencias',
  'referencias_de_decisao', 'origem_externa', 'revisao_git', 'contexto', 'atualizado_em',
];
const CAMPOS_TEXTO = ['id', 'objetivo', 'fase', 'responsavel', 'estado', 'atualizado_em'];
const CAMPOS_LISTA = ['dependencias', 'gates', 'bloqueios', 'decisoes_pendentes', 'evidencias', 'referencias_de_decisao'];

/** O contexto nao decide: estas seis chaves sao proibidas nele (V23). */
const CHAVES_CONTEXTO = ['tarefa', 'worktree', 'sha_inicial', 'sha_final'];
const CHAVES_PROIBIDAS_CONTEXTO = ['estado', 'fase', 'ordem_aprovada', 'prioridade', 'escopo', 'decisao'];
const TETO_LINHAS_CONTEXTO = 60;

const PADRAO_ID = /^[A-Z][A-Z0-9]{1,3}-[A-Z0-9]{1,6}$/;
const PADRAO_DATA = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Varredura de segredo. Automatiza a regra de retomada segura da PO-001: a
 * configuracao local de credencial fica fora do Git. O padrao do token do Font
 * Awesome e montado em duas partes de proposito, para que este proprio arquivo
 * nao contenha a string que ele procura.
 */
const SEGREDOS = [
  { nome: 'token pessoal do GitHub', re: /ghp_[A-Za-z0-9]{16,}/ },
  { nome: 'token pessoal do GitHub (fine-grained)', re: /github_pat_[A-Za-z0-9_]{16,}/ },
  { nome: 'credencial de registro npm', re: /\/\/registry\.npmjs\.org\/:_authToken/ },
  { nome: 'token do Font Awesome com valor', re: new RegExp('FONTAWESOME_NPM' + '_AUTH_TOKEN\\s*=\\s*\\S+') },
  { nome: 'chave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
];

// ---------------------------------------------------------------
// LEITURA
// ---------------------------------------------------------------

const ler = (caminho) => readFileSync(caminho, 'utf8').replace(/\r\n/g, '\n');

const listarMd = (dir) => (existsSync(dir) && statSync(dir).isDirectory()
  ? readdirSync(dir).filter((n) => n.endsWith('.md')).sort()
  : []);

/** Extrai e faz parse do PRIMEIRO bloco ```json do arquivo. */
function blocoJson(texto) {
  const m = texto.match(/```json\n([\s\S]*?)\n```/);
  if (m === null) return { erro: 'nao ha bloco json cercado no arquivo' };
  try {
    const dados = JSON.parse(m[1]);
    if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
      return { erro: 'o bloco json nao e um objeto' };
    }
    return { dados };
  } catch (e) {
    return { erro: 'o bloco json nao faz parse: ' + e.message };
  }
}

const vazio = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

// ---------------------------------------------------------------
// VALIDACAO
// ---------------------------------------------------------------

/**
 * Valida uma arvore operacional inteira.
 * `raiz` e o diretorio que contem tarefas/, contextos/ e evidencias/.
 * Caminhos declarados em evidencias[] sao sempre a partir da raiz do
 * repositorio, e precisam existir la.
 */
export function validar(raiz) {
  const erros = [];
  const falha = (codigo, caminho, msg) => erros.push({ codigo, caminho, msg });

  const dirTarefas = join(raiz, 'tarefas');
  const dirContextos = join(raiz, 'contextos');
  const dirEvidencias = join(raiz, 'evidencias');

  /* ---- carga ---- */
  const tarefas = new Map();
  const arquivosQuebrados = [];

  for (const nome of listarMd(dirTarefas)) {
    const caminho = join(dirTarefas, nome).replace(/\\/g, '/');
    const idDoArquivo = basename(nome, '.md');
    const texto = ler(caminho);
    const { dados, erro } = blocoJson(texto);

    if (erro) {
      falha('V03', caminho, erro);
      arquivosQuebrados.push(caminho);
      continue;
    }

    for (const chave of Object.keys(dados)) {
      if (!CAMPOS.includes(chave)) {
        falha('V03', caminho, `chave de topo desconhecida "${chave}" — o schema e fechado`);
      }
    }

    tarefas.set(idDoArquivo, { caminho, idDoArquivo, dados, texto });
  }

  /* Indice por id declarado, usado por dependencias e contextos. */
  const porId = new Map();
  for (const t of tarefas.values()) {
    const id = typeof t.dados.id === 'string' ? t.dados.id : null;
    if (id === null) continue;
    if (porId.has(id)) {
      falha('V02', t.caminho, `id "${id}" duplicado — ja declarado em ${porId.get(id).caminho}`);
    } else {
      porId.set(id, t);
    }
  }

  /* ---- por tarefa ---- */
  for (const t of [...tarefas.values()].sort((a, b) => a.caminho.localeCompare(b.caminho))) {
    const { caminho, idDoArquivo, dados } = t;

    // V04 — campo obrigatorio presente e nao vazio
    for (const campo of CAMPOS) {
      if (!(campo in dados)) {
        falha('V04', caminho, `falta o campo obrigatorio "${campo}"`);
        continue;
      }
      if (CAMPOS_TEXTO.includes(campo) && vazio(dados[campo])) {
        falha('V04', caminho, `o campo "${campo}" esta vazio`);
      }
      if (CAMPOS_LISTA.includes(campo) && !Array.isArray(dados[campo])) {
        falha('V04', caminho, `o campo "${campo}" tem de ser uma lista`);
      }
    }

    // V01 — nome do arquivo igual ao id
    if (dados.id !== idDoArquivo) {
      falha('V01', caminho, `o id declarado e "${dados.id}", mas o arquivo se chama "${idDoArquivo}.md"`);
    }

    // V02 — id casa o padrao
    if (typeof dados.id === 'string' && !PADRAO_ID.test(dados.id)) {
      falha('V02', caminho, `o id "${dados.id}" nao casa com ${PADRAO_ID}`);
    }

    if (typeof dados.fase === 'string' && !FASES.includes(dados.fase)) {
      falha('V04', caminho, `fase "${dados.fase}" fora de ${FASES.join(', ')}`);
    }
    if (typeof dados.responsavel === 'string' && !RESPONSAVEIS.includes(dados.responsavel)) {
      falha('V04', caminho, `responsavel "${dados.responsavel}" fora de ${RESPONSAVEIS.join(', ')}`);
    }
    if (typeof dados.atualizado_em === 'string' && !PADRAO_DATA.test(dados.atualizado_em)) {
      falha('V04', caminho, `atualizado_em "${dados.atualizado_em}" nao esta em AAAA-MM-DD`);
    }
    if (dados.revisao_git === undefined || dados.revisao_git === null || typeof dados.revisao_git !== 'object') {
      falha('V04', caminho, 'revisao_git tem de ser um objeto com branch, commit e pr');
    } else {
      for (const chave of ['branch', 'commit', 'pr']) {
        if (!(chave in dados.revisao_git)) {
          falha('V04', caminho, `revisao_git nao declara "${chave}"`);
        }
      }
    }

    // V05 — estado e um dos seis
    const estado = dados.estado;
    if (!ESTADOS.includes(estado)) {
      falha('V05', caminho, `estado "${estado}" nao existe — use ${ESTADOS.join(', ')}`);
    }

    const gates = Array.isArray(dados.gates) ? dados.gates : [];
    if (Array.isArray(dados.gates) && gates.length === 0) {
      falha('V14', caminho, 'a tarefa nao declara nenhum gate');
    }

    // V14 / V15 — forma do gate
    gates.forEach((g, i) => {
      const onde = `gate #${i + 1}`;
      if (g === null || typeof g !== 'object') {
        falha('V14', caminho, `${onde} nao e um objeto`);
        return;
      }
      for (const chave of ['id', 'descricao', 'resultado']) {
        if (vazio(g[chave])) falha('V14', caminho, `${onde} nao declara "${chave}"`);
      }
      if (g.resultado !== undefined && !RESULTADOS_GATE.includes(g.resultado)) {
        falha('V14', caminho, `${onde} tem resultado "${g.resultado}" — use ${RESULTADOS_GATE.join(', ')}`);
      }
      if (g.resultado === 'passou') {
        for (const chave of ['evidencia', 'verificado_em', 'verificado_por']) {
          if (vazio(g[chave])) falha('V15', caminho, `${onde} passou mas nao declara "${chave}"`);
        }
      }
    });

    // V06 — concluida com todo gate passou e evidencia existente
    if (estado === 'concluida') {
      for (const [i, g] of gates.entries()) {
        if (g === null || typeof g !== 'object') continue;
        if (g.resultado !== 'passou') {
          falha('V06', caminho, `estado concluida, mas o gate #${i + 1} esta "${g.resultado}"`);
        } else if (vazio(g.evidencia) || !existsSync(g.evidencia)) {
          falha('V06', caminho, `estado concluida, mas a evidencia do gate #${i + 1} nao existe em disco`);
        }
      }
    }

    // V07 — bloqueada com bloqueio aberto
    if (estado === 'bloqueada') {
      const bloqueios = Array.isArray(dados.bloqueios) ? dados.bloqueios : [];
      const validos = bloqueios.filter((b) => b && typeof b === 'object' && !vazio(b.dono) && !vazio(b.o_que_resolve));
      if (validos.length === 0) {
        falha('V07', caminho, 'estado bloqueada exige ao menos um bloqueio com "dono" e "o_que_resolve"');
      }
    }

    // V08 — aguardando-decisao com pergunta e quem_decide
    if (estado === 'aguardando-decisao') {
      const pend = Array.isArray(dados.decisoes_pendentes) ? dados.decisoes_pendentes : [];
      const validas = pend.filter((d) => d && typeof d === 'object' && !vazio(d.pergunta) && !vazio(d.quem_decide));
      if (validas.length === 0) {
        falha('V08', caminho, 'estado aguardando-decisao exige uma decisao pendente com "pergunta" e "quem_decide"');
      }
    }

    // V10 — em-revisao com revisao_git.pr
    if (estado === 'em-revisao') {
      const pr = dados.revisao_git && dados.revisao_git.pr;
      if (vazio(pr)) falha('V10', caminho, 'estado em-revisao exige revisao_git.pr preenchido');
    }

    const deps = Array.isArray(dados.dependencias) ? dados.dependencias : [];

    // V13 — sem autodependencia
    if (deps.includes(dados.id)) {
      falha('V13', caminho, `a tarefa depende de si mesma`);
    }

    // V11 — todo id citado existe
    for (const dep of deps) {
      if (!porId.has(dep)) {
        falha('V11', caminho, `depende de "${dep}", que nao existe nesta arvore`);
      }
    }

    // V09 — pronta com todas as dependencias concluidas
    if (estado === 'pronta') {
      for (const dep of deps) {
        const alvo = porId.get(dep);
        const estadoDep = alvo ? alvo.dados.estado : '(inexistente)';
        if (estadoDep !== 'concluida') {
          falha('V09', caminho, `estado pronta, mas a dependencia "${dep}" esta "${estadoDep}"`);
        }
      }
    }

    // V16 / V17 — evidencias declaradas
    const caminhosEvidencia = [
      ...(Array.isArray(dados.evidencias) ? dados.evidencias : []),
      ...gates.map((g) => (g && typeof g === 'object' ? g.evidencia : null)).filter((c) => !vazio(c)),
    ];
    for (const ev of [...new Set(caminhosEvidencia)].sort()) {
      if (typeof ev !== 'string' || !existsSync(ev)) {
        falha('V16', caminho, `a evidencia "${ev}" nao existe em disco`);
        continue;
      }
      const { dados: dadosEv, erro } = blocoJson(ler(ev));
      if (erro) {
        falha('V17', ev, `evidencia sem bloco json valido: ${erro}`);
      } else if (dadosEv.tarefa !== dados.id) {
        falha('V17', ev, `a evidencia declara tarefa "${dadosEv.tarefa}", mas esta referenciada por "${dados.id}"`);
      }
    }

    // V18 / V19 / V20 — origem externa
    const oe = dados.origem_externa;
    if (oe !== undefined && oe !== null) {
      if (typeof oe !== 'object' || Array.isArray(oe)) {
        falha('V18', caminho, 'origem_externa tem de ser um objeto ou null');
      } else if (!CLASSIFICACOES.includes(oe.classificacao)) {
        falha('V18', caminho, `classificacao "${oe.classificacao}" fora de ${CLASSIFICACOES.join(', ')}`);
      } else {
        const c = oe.classificacao;
        if (c === 'publica') {
          for (const chave of ['url_ou_id', 'data']) {
            if (vazio(oe[chave])) falha('V20', caminho, `origem publica exige "${chave}"`);
          }
        }
        if (c === 'interna-permitida') {
          for (const chave of ['url_ou_id', 'data', 'autoria', 'decisao_convertida']) {
            if (vazio(oe[chave])) falha('V20', caminho, `origem interna-permitida exige "${chave}"`);
          }
        }
        if (c === 'interna-restrita' || c === 'desconhecida') {
          if (!vazio(oe.trecho)) {
            falha('V19', caminho, `origem ${c} nao pode carregar "trecho" — o conteudo nao e copiado`);
          }
          if (estado !== 'bloqueada' && estado !== 'aguardando-decisao') {
            falha('V19', caminho, `origem ${c} exige a tarefa em bloqueada ou aguardando-decisao, e ela esta "${estado}"`);
          }
        }
      }
    }

    // V28 — peca preenchida exige a ficha
    if (!vazio(dados.peca)) {
      const ficha = join(RAIZ_FICHAS, `${dados.peca}.md`).replace(/\\/g, '/');
      if (!existsSync(ficha)) {
        falha('V28', caminho, `declara peca "${dados.peca}", mas ${ficha} nao existe`);
      }
    }
  }

  // V12 — sem ciclo
  const emCiclo = new Set();
  const cor = new Map();
  const visita = (id, pilha) => {
    if (cor.get(id) === 'preto') return;
    if (cor.get(id) === 'cinza') {
      for (const n of pilha.slice(pilha.indexOf(id))) emCiclo.add(n);
      return;
    }
    cor.set(id, 'cinza');
    const t = porId.get(id);
    const deps = t && Array.isArray(t.dados.dependencias) ? t.dados.dependencias : [];
    for (const d of deps) if (porId.has(d)) visita(d, [...pilha, id]);
    cor.set(id, 'preto');
  };
  for (const id of [...porId.keys()].sort()) visita(id, []);
  for (const id of [...emCiclo].sort()) {
    falha('V12', porId.get(id).caminho, `"${id}" participa de um ciclo de dependencias`);
  }

  // V29 — ordem_aprovada inteira, >= 1, unica entre as nao concluidas
  const ordens = new Map();
  for (const t of [...tarefas.values()].sort((a, b) => a.caminho.localeCompare(b.caminho))) {
    const o = t.dados.ordem_aprovada;
    if (!Number.isInteger(o) || o < 1) {
      falha('V29', t.caminho, `ordem_aprovada "${o}" tem de ser inteiro >= 1`);
      continue;
    }
    if (t.dados.estado === 'concluida') continue;
    if (ordens.has(o)) {
      falha('V29', t.caminho, `ordem_aprovada ${o} ja e usada por ${ordens.get(o)}`);
    } else {
      ordens.set(o, t.caminho);
    }
  }

  /* ---- contextos ---- */
  const contextos = new Map();
  for (const nome of listarMd(dirContextos)) {
    const caminho = join(dirContextos, nome).replace(/\\/g, '/');
    const texto = ler(caminho);
    const { dados, erro } = blocoJson(texto);
    if (erro) {
      falha('V22', caminho, `contexto sem bloco json valido: ${erro}`);
      continue;
    }
    contextos.set(basename(nome, '.md'), { caminho, dados });

    // V22 — aponta para tarefa existente
    if (vazio(dados.tarefa) || !porId.has(dados.tarefa)) {
      falha('V22', caminho, `o contexto aponta para a tarefa "${dados.tarefa}", que nao existe nesta arvore`);
    }

    // V23 — conjunto de chaves fechado, sem as seis proibidas
    for (const chave of Object.keys(dados)) {
      if (CHAVES_PROIBIDAS_CONTEXTO.includes(chave)) {
        falha('V23', caminho, `o contexto nao decide: a chave "${chave}" e proibida`);
      } else if (!CHAVES_CONTEXTO.includes(chave)) {
        falha('V23', caminho, `chave "${chave}" fora do conjunto ${CHAVES_CONTEXTO.join(', ')}`);
      }
    }

    // V24 — teto de linhas
    const linhas = texto.replace(/\n+$/, '').split('\n').length;
    if (linhas > TETO_LINHAS_CONTEXTO) {
      falha('V24', caminho, `${linhas} linhas — o teto e ${TETO_LINHAS_CONTEXTO}. Contexto que cresce virou diario`);
    }
  }

  // V25 / V26 — presenca do contexto conforme o estado
  for (const t of [...porId.values()].sort((a, b) => a.caminho.localeCompare(b.caminho))) {
    const ctx = contextos.get(t.dados.id);
    if (t.dados.estado === 'concluida' && ctx) {
      falha('V25', ctx.caminho, `a tarefa "${t.dados.id}" esta concluida e nao pode ter contexto ativo`);
    }
    if (t.dados.estado === 'em-andamento') {
      if (!ctx) {
        falha('V26', t.caminho, 'estado em-andamento exige um contexto em contextos/<ID>.md');
      } else {
        for (const chave of ['worktree', 'sha_inicial']) {
          if (vazio(ctx.dados[chave])) falha('V26', ctx.caminho, `o contexto nao declara "${chave}"`);
        }
      }
    }
  }

  // V21 — varredura de segredo em tarefas/, contextos/ e evidencias/
  const varrer = (dir) => {
    if (!existsSync(dir)) return;
    for (const nome of readdirSync(dir).sort()) {
      const caminho = join(dir, nome).replace(/\\/g, '/');
      if (statSync(caminho).isDirectory()) { varrer(caminho); continue; }
      if (!nome.endsWith('.md')) continue;
      const texto = ler(caminho);
      for (const { nome: rotulo, re } of SEGREDOS) {
        if (re.test(texto)) falha('V21', caminho, `padrao de ${rotulo} encontrado — segredo nunca entra no repositorio`);
      }
    }
  };
  varrer(dirTarefas);
  varrer(dirContextos);
  varrer(dirEvidencias);

  // V27 — nenhum contrato concorrente ao lado do componente
  const proibidos = [];
  const varrerComponentes = (dir) => {
    if (!existsSync(dir)) return;
    for (const nome of readdirSync(dir).sort()) {
      const caminho = join(dir, nome).replace(/\\/g, '/');
      if (statSync(caminho).isDirectory()) varrerComponentes(caminho);
      else if (nome === 'meta.ts' || nome === 'metadata.ts') proibidos.push(caminho);
    }
  };
  varrerComponentes(RAIZ_COMPONENTES);
  for (const p of proibidos) {
    falha('V27', p, 'contrato concorrente: a ficha em fichas/<nome>.md e a fonte, e a Metadata deriva dela (PI-01)');
  }

  erros.sort((a, b) => (a.codigo + a.caminho + a.msg).localeCompare(b.codigo + b.caminho + b.msg));
  return { erros, tarefas: porId, contextos, conferidas: tarefas.size };
}

// ---------------------------------------------------------------
// FILA
// ---------------------------------------------------------------

function fila(tarefas) {
  const todas = [...tarefas.values()].map((t) => t.dados);
  const destrava = (id) => todas.filter((d) => (d.dependencias || []).includes(id)).length;

  const elegiveis = todas
    .filter((d) => d.estado === 'pronta')
    .map((d) => ({ d, destrava: destrava(d.id) }))
    .sort((a, b) =>
      a.d.ordem_aprovada - b.d.ordem_aprovada ||
      a.d.fase.localeCompare(b.d.fase) ||
      b.destrava - a.destrava ||
      a.d.id.localeCompare(b.d.id));

  const fora = todas
    .filter((d) => d.estado !== 'pronta')
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((d) => {
      if (d.estado === 'bloqueada') {
        const b = (d.bloqueios || [])[0] || {};
        return { id: d.id, rotulo: 'bloqueada', motivo: `${b.o_que_trava || 'sem descricao'} — dono: ${b.dono || '?'}` };
      }
      if (d.estado === 'em-andamento') {
        return { id: d.id, rotulo: 'em-andamento', motivo: `contexto ativo em ${RAIZ_OPERACAO}/contextos/${d.id}.md` };
      }
      if (d.estado === 'aguardando-decisao') {
        const p = (d.decisoes_pendentes || [])[0] || {};
        return { id: d.id, rotulo: 'aguarda-decisao', motivo: `${p.pergunta || 'sem pergunta'} — decide: ${p.quem_decide || '?'}` };
      }
      if (d.estado === 'em-revisao') {
        return { id: d.id, rotulo: 'em-revisao', motivo: `PR ${d.revisao_git && d.revisao_git.pr}` };
      }
      return { id: d.id, rotulo: 'concluida', motivo: 'ja entregue, com evidencia' };
    });

  return { elegiveis, fora };
}

function imprimirFila(tarefas) {
  const { elegiveis, fora } = fila(tarefas);
  const linhas = [];

  if (elegiveis.length === 0) {
    linhas.push('PROXIMA: (nenhuma tarefa elegivel)');
  } else {
    const p = elegiveis[0];
    linhas.push(`PROXIMA: ${p.d.id}  (ordem_aprovada=${p.d.ordem_aprovada}, fase=${p.d.fase}, destrava ${p.destrava})`);
  }

  linhas.push('', 'Fila de elegiveis:');
  if (elegiveis.length === 0) linhas.push('  (vazia)');
  elegiveis.forEach((e, i) => {
    linhas.push(`  ${i + 1}. ${e.d.id.padEnd(8)} ordem ${String(e.d.ordem_aprovada).padEnd(4)} ${e.d.fase}  destrava ${e.destrava}`);
  });

  linhas.push('', 'Fora da fila:');
  if (fora.length === 0) linhas.push('  (vazia)');
  for (const f of fora) linhas.push(`  ${f.id.padEnd(8)} ${f.rotulo.padEnd(16)} ${f.motivo}`);

  console.log(linhas.join('\n'));
}

// ---------------------------------------------------------------
// AUTOTESTE
// ---------------------------------------------------------------

/** Um diretorio por caso, e o codigo que ele TEM de disparar. */
const CASOS_INVALIDOS = {
  'aguardando-sem-pergunta': 'V08',
  'bloqueada-sem-bloqueio': 'V07',
  'campo-faltando': 'V04',
  'chave-desconhecida': 'V03',
  'concluida-sem-evidencia': 'V06',
  'contexto-muda-estado': 'V23',
  'dependencia-ciclica': 'V12',
  'dependencia-inexistente': 'V11',
  'estado-invalido': 'V05',
  'evidencia-inexistente': 'V16',
  'id-fora-do-padrao': 'V02',
  'id-nao-bate': 'V01',
  'ordem-duplicada': 'V29',
  'peca-sem-ficha': 'V28',
  'pronta-com-dependencia-aberta': 'V09',
  'restrita-com-trecho': 'V19',
};

function autoteste() {
  let falhas = 0;

  console.log('=== VALIDOS ===');
  const dirValidos = join(RAIZ_FIXTURES, 'validos');
  const { erros: errosValidos, conferidas } = validar(dirValidos);
  if (errosValidos.length === 0) {
    console.log(`PASSOU  validos                        ${conferidas} tarefa(s), nenhum erro`);
  } else {
    falhas += 1;
    console.log('FALHOU  validos                        deveria passar limpo:');
    for (const e of errosValidos) console.log(`          ${e.codigo} ${e.caminho}: ${e.msg}`);
  }

  console.log('\n=== INVALIDOS: cada um tem de falhar PELO CODIGO PREVISTO ===');
  for (const [caso, esperado] of Object.entries(CASOS_INVALIDOS)) {
    const dir = join(RAIZ_FIXTURES, 'invalidos', caso);
    if (!existsSync(dir)) {
      falhas += 1;
      console.log(`FALHOU  ${caso.padEnd(30)} esperado=${esperado} obtido=(fixture ausente)`);
      continue;
    }
    const { erros } = validar(dir);
    const codigos = [...new Set(erros.map((e) => e.codigo))].sort();
    const ok = codigos.length === 1 && codigos[0] === esperado;
    if (!ok) falhas += 1;
    console.log(
      `${ok ? 'PASSOU' : 'FALHOU'}  ${caso.padEnd(30)} esperado=${esperado} obtido=${codigos.join(',') || '(nenhum erro)'}`,
    );
    if (!ok) for (const e of erros) console.log(`          ${e.codigo} ${e.caminho}: ${e.msg}`);
  }

  const total = Object.keys(CASOS_INVALIDOS).length;
  console.log(
    '\n' + (falhas === 0
      ? `RESULTADO: 1 arvore valida + ${total} de ${total} casos invalidos, cada um pelo codigo previsto.`
      : `RESULTADO: ${falhas} falha(s).`),
  );
  return falhas === 0 ? 0 : 1;
}

// ---------------------------------------------------------------
// CLI
// ---------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes('--exemplos')) {
  process.exit(autoteste());
}

const { erros, tarefas, conferidas } = validar(RAIZ_OPERACAO);

if (erros.length > 0) {
  console.error(`FALHOU: ${erros.length} erro(s) em ${RAIZ_OPERACAO}/`);
  for (const e of erros) console.error(`  - ${e.codigo} ${e.caminho}: ${e.msg}`);
  if (args.includes('--proxima')) {
    console.error('\nA fila NAO foi calculada: fila sobre arvore invalida e pior que fila nenhuma.');
  }
  process.exit(1);
}

console.log(`${conferidas} tarefa(s) conferida(s).`);

if (args.includes('--proxima')) {
  console.log('');
  imprimirFila(tarefas);
} else {
  console.log('OK: schema, estados, dependencias, gates, evidencias, contexto e ficha conferem.');
}

process.exit(0);
