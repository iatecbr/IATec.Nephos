/**
 * Leitura da ficha e geracao da Metadata.
 *
 * A ficha em `fichas/<nome>.md` e a fonte do contrato da peca; a Metadata e
 * uma copia derivada, em JSON, para quem le por maquina. Este arquivo so tem
 * funcoes puras: nao le nem grava disco.
 *
 * O repositorio nao tem leitor de YAML, e adotar um custaria uma dependencia
 * nova. Por isso o leitor aqui cobre so o SUBCONJUNTO que o gabarito usa, e
 * recusa com o numero da linha tudo o que nao reconhece. Recusar e melhor que
 * adivinhar: um valor lido errado vira Metadata errada, em silencio.
 *
 * O que entra:
 *   - so o primeiro par `---` do arquivo, com o primeiro `---` na linha 1;
 *   - mapa por recuo de 2 espacos; chave feita de letra, numero, `_`, `-`,
 *     `.` e `/`;
 *   - lista com `- `, cujos itens sao escalares;
 *   - lista em linha `[...]`, que respeita aspas duplas; `[]`;
 *   - bloco dobrado `>-`, que vira uma linha so;
 *   - linha em branco entre chaves.
 *
 * Escalares: entre aspas duplas vira texto; `true` e `false` viram booleano;
 * so digitos vira numero; o resto vira texto, inclusive data e `nulo`.
 *
 * O que se recusa: `|`, ancora, etiqueta, `#` de comentario fora de aspas,
 * tabulacao, lista de listas, mapa dentro de lista, aspas simples, barra
 * invertida dentro de aspas, chave repetida no mesmo mapa e chave numerica
 * (o JSON reordenaria chave numerica e quebraria a ordem da ficha).
 */

/** Erro de leitura com a linha do arquivo onde ele aconteceu. */
export class ErroDeFicha extends Error {
  constructor(linha, mensagem) {
    super(mensagem);
    this.linha = linha;
  }
}

const CHAVE = /^([A-Za-z0-9_./-]+):(?: (.*))?$/;
const CHAVE_NUMERICA = /^\d+$/;

/**
 * Separa o frontmatter. Devolve `null` quando o arquivo nao comeca com `---`
 * na linha 1: esse arquivo nao e ficha, e fica de fora sem reprovar.
 */
export function extrairFrontmatter(texto) {
  const linhas = texto.replace(/\r\n/g, '\n').split('\n');
  if (linhas[0] !== '---') return null;
  const fim = linhas.indexOf('---', 1);
  if (fim === -1) throw new ErroDeFicha(1, 'o frontmatter abre com `---` e nao fecha');
  return linhas.slice(1, fim).map((conteudo, i) => ({ numero: i + 2, conteudo }));
}

/** Le o subconjunto de YAML. `linhas` vem de `extrairFrontmatter`. */
export function lerYaml(linhas) {
  const uteis = [];
  for (const { numero, conteudo } of linhas) {
    if (conteudo.includes('\t')) throw new ErroDeFicha(numero, 'tabulacao nao e aceita');
    if (conteudo.trim() === '') {
      uteis.push({ numero, recuo: -1, texto: '' });
      continue;
    }
    const recuo = conteudo.length - conteudo.trimStart().length;
    const texto = conteudo.trim();
    if (texto.startsWith('#')) throw new ErroDeFicha(numero, 'comentario `#` nao e aceito');
    uteis.push({ numero, recuo, texto });
  }

  const estado = { i: 0, linhas: uteis };
  pularBrancas(estado);
  if (estado.i >= uteis.length) return {};
  if (uteis[estado.i].recuo !== 0) {
    throw new ErroDeFicha(uteis[estado.i].numero, 'a primeira chave precisa comecar na coluna 1');
  }
  const raiz = lerMapa(estado, 0);
  pularBrancas(estado);
  if (estado.i < uteis.length) {
    throw new ErroDeFicha(uteis[estado.i].numero, 'recuo fora do esperado');
  }
  return raiz;
}

function pularBrancas(estado) {
  while (estado.i < estado.linhas.length && estado.linhas[estado.i].recuo === -1) estado.i += 1;
}

function proxima(estado) {
  pularBrancas(estado);
  return estado.linhas[estado.i];
}

function lerMapa(estado, recuo) {
  const mapa = {};
  for (let linha = proxima(estado); linha !== undefined && linha.recuo === recuo; linha = proxima(estado)) {
    if (linha.texto.startsWith('-')) {
      throw new ErroDeFicha(linha.numero, 'item de lista onde se esperava uma chave');
    }
    const m = linha.texto.match(CHAVE);
    if (m === null) throw new ErroDeFicha(linha.numero, 'chave fora do formato `nome: valor`');
    const [, chave, bruto] = m;
    if (CHAVE_NUMERICA.test(chave)) throw new ErroDeFicha(linha.numero, `chave numerica "${chave}" nao e aceita`);
    if (Object.hasOwn(mapa, chave)) throw new ErroDeFicha(linha.numero, `chave "${chave}" repetida no mesmo mapa`);
    estado.i += 1;
    const valor = bruto === undefined ? '' : bruto.trim();

    if (valor === '') {
      const filho = proxima(estado);
      if (filho === undefined || filho.recuo <= recuo) {
        throw new ErroDeFicha(linha.numero, `a chave "${chave}" nao tem valor`);
      }
      if (filho.recuo !== recuo + 2) throw new ErroDeFicha(filho.numero, 'o recuo e de 2 espacos por nivel');
      mapa[chave] = filho.texto.startsWith('- ') || filho.texto === '-'
        ? lerLista(estado, recuo + 2)
        : lerMapa(estado, recuo + 2);
      continue;
    }

    if (valor === '>-') {
      mapa[chave] = lerBlocoDobrado(estado, recuo, linha.numero);
      continue;
    }
    if (/^[|>]/.test(valor)) throw new ErroDeFicha(linha.numero, `bloco "${valor}" nao e aceito; so \`>-\``);

    mapa[chave] = lerValor(valor, linha.numero);
    const depois = proxima(estado);
    if (depois !== undefined && depois.recuo > recuo) {
      throw new ErroDeFicha(depois.numero, 'valor em mais de uma linha so e aceito com `>-`');
    }
  }
  return mapa;
}

function lerLista(estado, recuo) {
  const lista = [];
  for (let linha = proxima(estado); linha !== undefined && linha.recuo === recuo; linha = proxima(estado)) {
    if (!(linha.texto.startsWith('- ') || linha.texto === '-')) {
      throw new ErroDeFicha(linha.numero, 'chave misturada com itens de lista');
    }
    const item = linha.texto.slice(1).trim();
    if (item === '') throw new ErroDeFicha(linha.numero, 'item de lista vazio ou aninhado');
    if (item.startsWith('[') || item.startsWith('- ')) throw new ErroDeFicha(linha.numero, 'lista de listas nao e aceita');
    if (!item.startsWith('"') && CHAVE.test(item)) throw new ErroDeFicha(linha.numero, 'mapa dentro de lista nao e aceito');
    lista.push(lerEscalar(item, linha.numero));
    estado.i += 1;
    const depois = proxima(estado);
    if (depois !== undefined && depois.recuo > recuo) {
      throw new ErroDeFicha(depois.numero, 'item de lista em mais de uma linha nao e aceito');
    }
  }
  return lista;
}

function lerBlocoDobrado(estado, recuo, numeroDaChave) {
  const partes = [];
  while (estado.i < estado.linhas.length) {
    const linha = estado.linhas[estado.i];
    if (linha.recuo === -1) {
      const seguinte = estado.linhas.slice(estado.i + 1).find((l) => l.recuo !== -1);
      if (seguinte !== undefined && seguinte.recuo > recuo) {
        throw new ErroDeFicha(linha.numero, 'linha em branco dentro de bloco `>-` nao e aceita');
      }
      break;
    }
    if (linha.recuo <= recuo) break;
    partes.push(linha.texto);
    estado.i += 1;
  }
  if (partes.length === 0) throw new ErroDeFicha(numeroDaChave, 'bloco `>-` vazio');
  return partes.join(' ');
}

function lerValor(valor, numero) {
  if (valor.startsWith('[')) return lerListaEmLinha(valor, numero);
  if (valor.startsWith('{')) throw new ErroDeFicha(numero, 'mapa em linha `{...}` nao e aceito');
  return lerEscalar(valor, numero);
}

function lerListaEmLinha(valor, numero) {
  if (!valor.endsWith(']')) throw new ErroDeFicha(numero, 'lista em linha sem `]` no fim');
  const miolo = valor.slice(1, -1);
  if (miolo.trim() === '') return [];
  const itens = [];
  let atual = '';
  let emAspas = false;
  for (const c of miolo) {
    if (c === '"') emAspas = !emAspas;
    if (!emAspas && (c === '[' || c === ']')) throw new ErroDeFicha(numero, 'lista de listas nao e aceita');
    if (!emAspas && c === ',') {
      itens.push(atual);
      atual = '';
      continue;
    }
    atual += c;
  }
  if (emAspas) throw new ErroDeFicha(numero, 'aspas abertas e nao fechadas');
  itens.push(atual);
  return itens.map((item) => {
    const limpo = item.trim();
    if (limpo === '') throw new ErroDeFicha(numero, 'item vazio em lista em linha');
    return lerEscalar(limpo, numero);
  });
}

function lerEscalar(valor, numero) {
  if (valor.startsWith('"')) {
    if (valor.length < 2 || !valor.endsWith('"')) throw new ErroDeFicha(numero, 'aspas abertas e nao fechadas');
    const miolo = valor.slice(1, -1);
    if (miolo.includes('\\')) throw new ErroDeFicha(numero, 'barra invertida dentro de aspas nao e aceita');
    if (miolo.includes('"')) throw new ErroDeFicha(numero, 'aspas dentro de aspas nao sao aceitas');
    return miolo;
  }
  if (valor.startsWith("'")) throw new ErroDeFicha(numero, 'aspas simples nao sao aceitas; use aspas duplas');
  if (/^[&*!]/.test(valor)) throw new ErroDeFicha(numero, 'ancora, alias e etiqueta nao sao aceitos');
  if (/(^|\s)#/.test(valor)) throw new ErroDeFicha(numero, 'comentario `#` fora de aspas nao e aceito');
  if (/: /.test(valor) || valor.endsWith(':')) {
    throw new ErroDeFicha(numero, 'texto sem aspas com `: ` e ambiguo; use aspas duplas');
  }
  if (valor === 'true') return true;
  if (valor === 'false') return false;
  if (/^\d+$/.test(valor)) return Number(valor);
  return valor;
}

/**
 * Le uma ficha inteira. Devolve `null` quando o arquivo nao e ficha (sem `---`
 * na linha 1); senao `{ dados, vigente, json }`. Lanca `ErroDeFicha`.
 *
 * O fim de linha e normalizado aqui mesmo: com `core.autocrlf`, a ficha chega
 * em CRLF no Windows e em LF no resto, e a Metadata tem de sair igual.
 */
export function lerFicha(texto) {
  const linhas = extrairFrontmatter(texto);
  if (linhas === null) return null;
  const dados = lerYaml(linhas);
  return {
    dados,
    vigente: dados.status === 'vigente',
    json: JSON.stringify(dados, null, 2) + '\n',
  };
}
