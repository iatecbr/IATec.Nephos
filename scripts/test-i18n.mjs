/**
 * Prova das versoes de idioma.
 *
 * O ponto central: uma traducao desatualizada nao pode PARECER vigente. Cada
 * traducao declara o hash do conteudo da fonte que traduziu; se a fonte mudou,
 * o hash deixa de bater e este script reprova.
 *
 * Usamos hash do CONTEUDO, nao do commit: o commit que publica a fonte e o
 * mesmo que publica a traducao, entao referenciar commit seria circular.
 *
 * Rode com: npm run test:i18n
 * Depois de traduzir uma alteracao: npm run i18n:update
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const IDIOMAS = ['en', 'es'];
const PASTAS = ['.', 'docs'];
const ATUALIZAR = process.argv.includes('--update');

/**
 * Identificadores que NUNCA sao traduzidos. Se um deles aparece na fonte e
 * some de uma traducao, alguem traduziu nome tecnico.
 */
const PROTEGIDOS = [
  'nph-',
  'data-nph-brand',
  'data-nph-color-scheme',
  'com.iatec.nephos',
  'npm run build:tokens',
  'design.md',
  'src/tokens/source',
  'src/tokens/generated',
];

/** Normaliza fim de linha para que CRLF e LF produzam o mesmo hash. */
function hashDe(texto) {
  return createHash('sha256').update(texto.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

function ler(caminho) {
  return readFileSync(caminho, 'utf8');
}

const CABECALHO =
  /^<!-- i18n: lang=([a-z-]+) \| source=(\S+) \| source-sha256=(\S+) \| status=(\S+) -->/;

/**
 * Uma traducao so vale como versao publicada depois de lida por uma pessoa.
 * Ate la ela e `rascunho`, e diz isso em voz alta no proprio arquivo.
 */
const ESTADOS = ['rascunho', 'revisado'];

const falhas = [];
const avisos = [];
const rascunhos = [];
let conferidos = 0;
let atualizados = 0;

/** Encontra os pares fonte -> traducoes pela convencao de sufixo. */
function paresDe(pasta) {
  const pares = new Map();
  for (const nome of readdirSync(pasta)) {
    const m = nome.match(/^(.+)\.(en|es)\.md$/);
    if (!m) continue;
    const [, base, idioma] = m;
    const fonte = join(pasta, `${base}.md`).replace(/\\/g, '/');
    if (!pares.has(fonte)) pares.set(fonte, []);
    pares.get(fonte).push({ idioma, caminho: join(pasta, nome).replace(/\\/g, '/') });
  }
  return pares;
}

for (const pasta of PASTAS) {
  for (const [fonte, traducoes] of paresDe(pasta)) {
    let textoFonte;
    try {
      textoFonte = ler(fonte);
    } catch {
      falhas.push(`${fonte}: existe traducao, mas a fonte nao existe`);
      continue;
    }

    const esperado = hashDe(textoFonte);
    const presentes = traducoes.map((t) => t.idioma);
    for (const idioma of IDIOMAS) {
      if (!presentes.includes(idioma)) {
        falhas.push(`${fonte}: falta a versao "${idioma}"`);
      }
    }

    /* O seletor de idioma precisa existir nos tres arquivos. */
    if (!textoFonte.includes('**Português (BR)**')) {
      falhas.push(`${fonte}: sem o seletor de idioma no topo`);
    }

    for (const { idioma, caminho } of traducoes) {
      conferidos += 1;
      const texto = ler(caminho);
      const cabecalho = texto.match(CABECALHO);

      if (cabecalho === null) {
        falhas.push(`${caminho}: sem o comentario de rastreio na primeira linha`);
        continue;
      }

      const [linhaInteira, idiomaDeclarado, fonteDeclarada, hashDeclarado, estado] = cabecalho;

      if (!ESTADOS.includes(estado)) {
        falhas.push(`${caminho}: status=${estado} nao existe — use ${ESTADOS.join(" ou ")}`);
      } else if (estado === "rascunho") {
        rascunhos.push(caminho);
      }

      if (idiomaDeclarado !== idioma) {
        falhas.push(`${caminho}: declara lang=${idiomaDeclarado}, mas o nome do arquivo diz ${idioma}`);
      }
      if (fonteDeclarada !== fonte) {
        falhas.push(`${caminho}: declara source=${fonteDeclarada}, mas a fonte e ${fonte}`);
      }

      if (hashDeclarado !== esperado) {
        if (ATUALIZAR) {
          const novo = texto.replace(
            linhaInteira,
            `<!-- i18n: lang=${idioma} | source=${fonte} | source-sha256=${esperado} | status=${estado} -->`,
          );
          writeFileSync(caminho, novo, 'utf8');
          atualizados += 1;
          console.log(`atualizado: ${caminho}`);
        } else if (hashDeclarado === 'PENDING') {
          falhas.push(`${caminho}: hash da fonte nao gravado — rode npm run i18n:update`);
        } else {
          falhas.push(
            `${caminho}: DESATUALIZADO — a fonte ${fonte} mudou depois desta traducao`,
          );
        }
      }

      /* Ninguem pode ter traduzido identificador tecnico. */
      for (const termo of PROTEGIDOS) {
        if (textoFonte.includes(termo) && !texto.includes(termo)) {
          falhas.push(`${caminho}: o identificador tecnico "${termo}" sumiu da traducao`);
        }
      }

      /* Os links entre idiomas precisam apontar para arquivos que existem. */
      for (const alvo of texto.matchAll(/\]\(([A-Za-z0-9._-]+\.(?:en|es)?\.?md)\)/g)) {
        const destino = join(pasta, alvo[1]).replace(/\\/g, '/');
        try {
          ler(destino);
        } catch {
          avisos.push(`${caminho}: link de idioma aponta para ${destino}, que nao existe`);
        }
      }
    }
  }
}

if (ATUALIZAR) {
  console.log(`\n${atualizados} hash(es) gravado(s).`);
}

console.log(`\n${conferidos} traducao(oes) conferida(s).`);

if (rascunhos.length > 0) {
  console.log(`${rascunhos.length} em RASCUNHO, aguardando revisao humana:`);
  for (const caminho of rascunhos) {
    console.log(`  - ${caminho}`);
  }
}

for (const aviso of avisos) {
  console.log(`AVISO   ${aviso}`);
}

if (falhas.length > 0) {
  console.error('\nFALHOU:');
  for (const falha of falhas) {
    console.error(`  - ${falha}`);
  }
  process.exit(1);
}

console.log('OK: idioma, fonte, hash, seletor e identificadores tecnicos conferem.');
