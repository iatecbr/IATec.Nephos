#!/usr/bin/env node
/**
 * Prova da P64: nome tecnico em portugues reprova.
 *
 * Confere, em src/, stories/, .storybook/ e scripts/:
 *   - todo identificador do codigo (.ts, .js, .mjs, .cjs), pelo AST do TypeScript;
 *   - todo literal sem espaco (valor tecnico: id, chave, estado, caminho);
 *   - dentro de literal com espaco (template html/css, estilo em string):
 *     valores de class, part, id, for, slot, name e aria-*, atributos data-*,
 *     seletores e custom properties;
 *   - os .css e .html, sem comentario, pelos mesmos seletores e atributos;
 *   - o nome de cada pasta e arquivo, de qualquer extensao;
 *   - os nomes de script do package.json.
 *
 * Fica fora, pela P64: comentario, mensagem (console, throw, Error, saida do
 * processo), descricao de teste, o texto dos dicionarios de .storybook/i18n/,
 * title e name de story e texto corrido (literal com espaco).
 *
 * Contrato que continua em portugues entra em scripts/naming-exceptions.json,
 * com uma classe da lista fechada CLASSES. Excecao sem uso tambem reprova, para
 * a lista nao guardar nome que ja saiu do codigo.
 *
 * Rode com: npm run test:naming
 * Listar tudo o que a regra ve, com ou sem excecao: npm run test:naming -- --list
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOTS = ['src', 'stories', '.storybook', 'scripts'];
/** Gerados: o nome sai de outra fonte, que ja e conferida (tokens JSON, ficha). */
const SKIPPED_DIRS = new Set(['node_modules', 'storybook-static', 'src/tokens/generated', 'src/shared/metadata']);
/** Diretorios do contrato do verificador (V28, V30, V31), dentro e fora dos fixtures. */
const CONTRACT_DIRS = new Set(['tarefas', 'evidencias', 'contextos', 'fichas']);
/** Nome de evidencia: <gate>-<AAAA-MM-DD>.md (docs/operacao/README.md). */
const EVIDENCE_NAME = /^[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.md$/;
const DICTIONARIES = new Set(['.storybook/i18n/pt-BR.js', '.storybook/i18n/en.js', '.storybook/i18n/es.js']);
const EXCEPTIONS_FILE = 'scripts/naming-exceptions.json';

const CLASSES = {
  'story-export': 'exportacao de story: gera o ID e o permalink',
  'storybook-id': 'ID, titulo ou chave de navegacao do Storybook',
  anchor: 'id de secao usado como ancora de URL',
  'operation-schema': 'chave ou valor do schema de docs/operacao (P64, fora da regra)',
  'token-schema': 'chave, modo ou marca do JSON dos tokens (P20, P64)',
  'spec-schema': 'chave ou valor do YAML da ficha e da Metadata (P63, P64)',
  'design-md': 'chave lida do design.md',
  'i18n-header': 'formato do cabecalho das traducoes (test-i18n)',
  cli: 'nome de script npm, bandeira ou arquivo citado em comando gravado em docs/operacao/',
  'contract-path': 'diretorio do contrato do verificador, citado pelo proprio verificador',
  'output-text': 'palavra impressa na saida de um script',
  'ui-text': 'texto exibido ou de exemplo, numa palavra so',
};

/*
 * Vocabulario PT. Ficam FORA, porque tambem sao palavras ou abreviacoes comuns
 * em ingles e dariam falso positivo: data, base, total, normal, final, local,
 * real, sem, do, de, um, os, ou, ao, em, so, el, com, use, area, item, ir, eh,
 * da, das, para, seg, grade, canal, peso, principal, sim (SIM), valor (valor),
 * pasta, boas, cor. Palavra que nao esta neste
 * vocabulario nem tem fim tipico (PT_ENDING) passa: quando a revisao achar uma,
 * ela entra aqui.
 */
const PT_WORDS = new Set(`
aberta acao aceita acessibilidade achados aguarda aguardando altura alvo alvos
ambigua ambiguo aplicar aqui arte aspa associacao asterisco atributo atributos
atual atualizado ausente autoria aviso barra bate bloco bloqueada bloqueio
bloqueios borda botao busca buscar cabecalho cabecalhos caixa camada caminho
campo carregar carregando cartao casos categoria categorias celula celulas chave chaves
ciclica ciclo cinza citar claro classificacao codigo comece como componente
componentes comum concluida concluido configurar contador contagem conteudo
contexto contextos contrato controle convertida corpo correspondentes decisao
decisoes declaradas decorativo demonstracao dependencia dependencias derivada
desatualizada desconhecida descricao desenhar desenho desenvolvimento destino
dicionario dicionarios diferente diferentes diretorio distintos documentacao
documento dois dono duplicada elemento encontrados endereco entrada erro erros
escuro esperada esperado esquema estado estilo estilos evento evidencia evidencias
exemplo exemplos explicito externa falhou faltando familia fase faz fazer ficha
fichas fim focada foco fonte fora fundacoes fundamentos galeria garantir geral
gerar heranca icone icones identificador idioma idiomas igual imagem indice
inexistente inicial inicio interna invalida invalido invalidos invariante largura
lateral legenda leitura letras limpar linha linhas lista listas logotipo mapa
marca matriz medida meio mensagem mesmo modo modos montar muda nao navegar nesta
nome nomeado nomeavel nomes nota nucleo objetivo objeto objetos obrigatorio
ocultacao ordem origem padrao padroes pagina papel parte passo passos passou peca
pendente pendentes pergunta permitida ponteiro preto prioridade procedencia
procurado proibida pronta propriedade propriedades prosa proxima publica publico
quadro quando que quem rascunho recuo referencias regra registrado registro
renderizado renderizar resolver responsavel restrita resultado resumo revisado
revisao rotulo salvar secao secoes seletor selo semantica sistemas soma
subconjunto tabela tamanho tamanhos tarefa tarefas temas termo texto textos tipo
tipografia titulo transbordo trava trecho trocada uso usar valida validacao valido
validos valores variante variantes vazio verificado vigente vindas visao
caso novo nova novos novas editar excluir remover adicionar criar enviar abrir
fechar mostrar esconder selecionar selecionado filtro filtrar ordenar usuario senha
hora dia mes ano numero quantidade preco ativo inativo aberto fechado sucesso
alerta cancelar confirmar voltar proximo anterior primeiro ultimo grupo lado
esquerda direita cima baixo topo rodape tela janela pai filho filhos itens ajuda
dados arquivo arquivos pastas cores fundo sombra raio espaco espacamento
negrito secundario desabilitado habilitado obrigatoria opcional rotulos saida
`.split(/\s+/).filter(Boolean));

/** Morfologia: acento, ou fim tipico do portugues. Palavras inglesas com o mesmo fim. */
const PT_ENDING = /(oes|ao|ando|endo|indo)$/;
const EN_SAME_ENDING = new Set(`canoes heroes zeroes potatoes tomatoes echoes vetoes
oboes mangoes volcanoes tornadoes torpedoes ciao cacao tao commando crescendo
innuendo nintendo`.split(/\s+/).filter(Boolean));
/** Fim ingles que tambem casa com PT_ENDING: shoes, horseshoes, does, undoes, goes, toes, foes, woes. */
const EN_SAME_SUFFIX = /(shoes|does|goes|toes|foes|woes|hoes|roes)$/;

function isPtWord(word) {
  const w = word.toLowerCase();
  if (w.length < 2) return false;
  if (/[à-ÿ]/.test(w)) return true;
  if (PT_WORDS.has(w)) return true;
  return w.length > 3 && PT_ENDING.test(w) && !EN_SAME_ENDING.has(w) && !EN_SAME_SUFFIX.test(w);
}

function words(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^A-Za-zÀ-ÿ]+/)
    .filter(Boolean);
}
const hasPt = (name) => words(name).some(isPtWord);

/** Tokens tecnicos dentro de texto com espaco (template html/css, estilo). */
function technicalTokens(text) {
  const out = [];
  /* Valor com aspa ou sem aspa. O template do Lit chega inteiro, com cada ${...} trocado por um marcador.
   * aria-label e aria-description ficam fora: sao texto exibido. */
  const attr = /\b(?:class|part|id|for|slot|name|aria-(?:labelledby|describedby|controls|owns|activedescendant|details|errormessage))\s*=\s*(?:"([^"]*)"?|'([^']*)'?|([^\s>"'`]+))/g;
  for (const m of text.matchAll(attr)) for (const v of (m[1] ?? m[2] ?? m[3] ?? '').split(/\s+/)) if (v) out.push(v);
  for (const m of text.matchAll(/::part\(([^)]*)\)/g)) for (const v of m[1].split(/\s+/)) if (v) out.push(v);
  for (const m of text.matchAll(/\[([\w-]+)\s*[~|^$*]?=\s*["']?([^"'\]]+)/g)) out.push(m[1], ...m[2].split(/\s+/).filter(Boolean));
  for (const m of text.matchAll(/\b(data-[a-z][\w-]*)/g)) out.push(m[1]);
  for (const m of text.matchAll(/(--[a-z][\w-]*)/g)) out.push(m[1]);
  for (const m of text.matchAll(/(?:^|[\s,{}>+~(])\.([a-zA-Z_][\w-]*)/g)) out.push('.' + m[1]);
  for (const m of text.matchAll(/(?:^|[\s,{}>+~(])#([a-zA-Z][\w-]*)/g)) {
    if (!/^[0-9a-f]{3,8}$/i.test(m[1])) out.push('#' + m[1]);
  }
  return out;
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name);
    if (SKIPPED_DIRS.has(entry.name) || SKIPPED_DIRS.has(rel)) continue;
    if (entry.isDirectory()) walk(rel, acc);
    else acc.push(rel);
  }
  return acc;
}

const MESSAGE_CALLEE = /^(console\.\w+|process\.(stdout|stderr)\.write|describe|it|test|fail|warn)$/;

/**
 * Mensagem e so o argumento DIRETO de console, throw, Error, saida do processo
 * ou descricao de teste — inclusive montado por template ou concatenacao. Literal
 * dentro de objeto, array ou funcao passada como argumento nao e mensagem.
 */
function isInsideMessage(node) {
  let child = node;
  for (let p = node.parent; p; child = p, p = p.parent) {
    if (ts.isThrowStatement(p)) return true;
    if (ts.isNewExpression(p) && /Error$/.test(p.expression.getText())) return (p.arguments ?? []).includes(child);
    if (ts.isCallExpression(p)) return MESSAGE_CALLEE.test(p.expression.getText()) && p.arguments.includes(child);
    const passThrough =
      ts.isTemplateSpan(p) || ts.isTemplateExpression(p) || ts.isParenthesizedExpression(p) ||
      (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.PlusToken) || ts.isConditionalExpression(p);
    if (!passThrough) return false;
  }
  return false;
}

/** Literal com espaco que vira lista de classe, part ou id: el.className = '...', setAttribute('class', '...'). */
function isClassList(start) {
  let node = start;
  while (
    node.parent &&
    (ts.isParenthesizedExpression(node.parent) ||
      ts.isConditionalExpression(node.parent) ||
      (ts.isBinaryExpression(node.parent) && node.parent.operatorToken.kind === ts.SyntaxKind.PlusToken))
  ) node = node.parent;
  const p = node.parent;
  if (p && ts.isBinaryExpression(p) && p.right === node && /\.(className|id|slot)$/.test(p.left.getText())) return true;
  if (p && ts.isCallExpression(p) && p.arguments.includes(node)) {
    const callee = p.expression.getText();
    if (/\.classList\.(add|remove|toggle|contains)$/.test(callee)) return true;
    if (/\.(setAttribute|toggleAttribute)$/.test(callee) && p.arguments[1] === node) {
      const attrName = p.arguments[0];
      return ts.isStringLiteralLike(attrName) && /^(class|part|id|slot|name|for)$|^data-/.test(attrName.text);
    }
  }
  return false;
}

function propertyName(node) {
  const p = node.parent;
  return p && ts.isPropertyAssignment(p) && p.name !== node ? p.name.getText() : null;
}

function insideProperty(node, names) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isPropertyAssignment(p) && names.includes(p.name.getText().replace(/['"]/g, ''))) return true;
  }
  return false;
}

function scan(root = '.') {
  const prev = process.cwd();
  process.chdir(root);
  try {
    const hits = [];
    const add = (file, line, name, role) => { if (hasPt(name)) hits.push({ file, line, name, role }); };
    const files = ROOTS.filter((r) => fs.existsSync(r)).flatMap((r) => walk(r, []));

    for (const file of files) {
      const parts = file.split('/');
      parts.forEach((seg, i) => {
        const isLast = i === parts.length - 1;
        if (!isLast && CONTRACT_DIRS.has(seg)) return;
        const underEvidence = parts.slice(0, i).includes('evidencias');
        if (isLast && EVIDENCE_NAME.test(seg) && (underEvidence || file.startsWith('scripts/fixtures/'))) return;
        add(file, 0, isLast ? seg.replace(/\.[^.]+$/, '') : seg, isLast ? 'file' : 'folder');
      });
    }

    for (const file of files.filter((f) => /\.(css|html)$/.test(f))) {
      const src = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '));
      src.split('\n').forEach((ln, i) => { for (const t of technicalTokens(ln)) add(file, i + 1, t, 'css-html'); });
    }

    for (const file of files.filter((f) => /\.(ts|js|mjs|cjs)$/.test(f))) {
      const src = fs.readFileSync(file, 'utf8');
      const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS);
      const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
      const isDictionary = DICTIONARIES.has(file);
      const isStory = /\.stories\.(ts|js)$/.test(file);
      const visit = (node) => {
        if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) {
          if (!(isDictionary && insideProperty(node, ['sidebar']))) add(file, line(node), node.text, 'identifier');
        } else if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node)) {
          /* Template com ${...}: o texto inteiro, com cada interpolacao trocada por um marcador
           * que nao e espaco. Assim um caminho montado continua sendo valor tecnico, e um
           * atributo cortado por ${...} continua inteiro. */
          const text = ts.isTemplateExpression(node)
            ? node.head.text + node.templateSpans.map((span) => '\u0001' + span.literal.text).join('')
            : (node.text ?? '');
          const p = node.parent;
          const isKey = p && (ts.isPropertyAssignment(p) || ts.isPropertySignature(p)) && p.name === node;
          const skip =
            isInsideMessage(node) ||
            (isDictionary && (!isKey || insideProperty(node, ['sidebar']))) ||
            (isStory && ['title', 'name'].includes(propertyName(node)));
          if (!skip) {
            if (text && !/\s/.test(text)) add(file, line(node), text.replace(/\u0001/g, '${}'), isKey ? 'key' : 'literal');
            else if (isClassList(node)) for (const t of text.split(/\s+/).filter(Boolean)) add(file, line(node), t, 'class-list');
            else for (const t of technicalTokens(text)) add(file, line(node), t, 'template');
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    for (const name of Object.keys(pkg.scripts || {})) add('package.json', 0, name, 'npm-script');
    return hits;
  } finally {
    process.chdir(prev);
  }
}

function loadExceptions() {
  const list = JSON.parse(fs.readFileSync(EXCEPTIONS_FILE, 'utf8'));
  const problems = [];
  for (const [i, e] of list.entries()) {
    if (!e.file || !Array.isArray(e.names) || !e.names.length) problems.push(`entrada ${i}: precisa de "file" e "names"`);
    else if (e.file.endsWith('/')) problems.push(`entrada ${i} (${e.file}): excecao vale para um arquivo, nao para uma pasta`);
    if (!Object.hasOwn(CLASSES, e.class)) problems.push(`entrada ${i} (${e.file}): classe desconhecida "${e.class}"`);
  }
  return { list, problems };
}

const covers = (e, hit) => hit.file === e.file && Array.isArray(e.names) && e.names.includes(hit.name);

function main() {
  const listAll = process.argv.includes('--list');
  const hits = scan('.');
  const { list, problems } = loadExceptions();
  const used = new Set();
  const failures = [];
  for (const h of hits) {
    const idx = list.findIndex((e) => covers(e, h));
    if (idx >= 0) used.add(`${idx}|${h.name}`);
    else failures.push(h);
    if (listAll) console.log(`${idx >= 0 ? 'EXCECAO' : 'FALHOU '} ${h.file}:${h.line} ${h.name} (${h.role})${idx >= 0 ? ' [' + list[idx].class + ']' : ''}`);
  }
  const unused = [];
  list.forEach((e, i) => { for (const n of Array.isArray(e.names) ? e.names : []) if (!used.has(`${i}|${n}`)) unused.push(`${e.file} ${n}`); });

  if (!listAll) for (const f of failures) console.log(`FALHOU ${f.file}:${f.line} ${f.name} (${f.role})`);
  for (const u of unused) console.log(`EXCECAO SEM USO ${u}`);
  for (const p of problems) console.log(`EXCECAO INVALIDA ${p}`);

  const ok = failures.length === 0 && unused.length === 0 && problems.length === 0;
  console.log(
    ok
      ? `\nRESULTADO: nenhum nome tecnico em portugues fora de ${EXCEPTIONS_FILE}.`
      : `\nRESULTADO: ${failures.length} nome(s) em portugues sem excecao, ${unused.length} excecao(oes) sem uso, ${problems.length} excecao(oes) invalida(s).\n` +
        `Renomeie para ingles. Se for contrato, registre em ${EXCEPTIONS_FILE} com a classe, para revisao no PR.`,
  );
  process.exit(ok ? 0 : 1);
}

/* Sempre roda: nada importa este arquivo. Comparar caminhos falha por junction ou symlink, e a prova sairia 0 calada. */
main();
