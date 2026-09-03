/**
 * Funcoes puras compartilhadas por build-tokens.mjs e test-invariancia.mjs.
 * Sem efeito colateral: importar este arquivo nao le disco nem gera nada.
 */

export const NS = 'com.iatec.nephos';

/**
 * Tipos DTCG que o gerador sabe emitir. Qualquer outro e erro.
 *
 * `fontFamily` entrou em 27-08-2026, com a camada `text`. O Style Dictionary ja
 * traz o transform `fontFamily/css` no grupo `css`: ele junta a lista com
 * virgula e cita o nome que precisa de aspas.
 *
 * Peso de fonte fica como `number`, e nao como `fontWeight`: o DTCG aceita
 * palavra ou numero nesse tipo, e a fonte do Nephos sempre grava numero.
 *
 * `shadow` entrou em 03-09-2026, com os 11 estilos de efeito (PF-15). O Style
 * Dictionary ja traz `shadow/css/shorthand` no grupo `css`: ele monta a
 * shorthand e preserva a referencia de cada parte. Nao entrou dependencia
 * nova - faltava so o tipo estar nesta lista.
 */
export const TIPOS_TRATADOS = new Set([
  'color', 'dimension', 'duration', 'cubicBezier', 'number', 'fontFamily', 'shadow',
]);

/**
 * Representacao canonica de um valor, estavel e independente de identidade de
 * objeto e de ordem de chave. `{value:250,unit:'ms'}` e `{unit:'ms',value:250}`
 * produzem a MESMA string.
 */
export function canon(v) {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  if (typeof v === 'number') return String(v);
  return JSON.stringify(v);
}

/** Se o valor for uma referencia `{a.b.c}`, devolve `a.b.c`; senao, null. */
export function aliasDe(v) {
  if (typeof v !== 'string') return null;
  const m = /^\{([^}]+)\}$/.exec(v.trim());
  return m ? m[1] : null;
}

/**
 * Todas as referencias contidas num valor, em qualquer profundidade.
 *
 * Percorre array e objeto porque valor composto guarda referencia DENTRO de
 * si: um token `shadow` tem uma referencia por camada, em `offsetY`, `blur`,
 * `spread` e `color`. Enquanto esta funcao so lia string, nenhuma delas era
 * validada - nem a existencia do alvo, nem o achatamento na saida.
 */
export function refs(v) {
  if (typeof v === 'string') return [...v.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  if (Array.isArray(v)) return v.flatMap(refs);
  if (v !== null && typeof v === 'object') return Object.values(v).flatMap(refs);
  return [];
}

/** Percorre folhas ($value) devolvendo [caminho, token]. */
export function folhas(node, base = []) {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push([base.concat(k), v]);
    else if (v && typeof v === 'object') out.push(...folhas(v, base.concat(k)));
  }
  return out;
}

/** Valor bruto de um token num modo: o valor do modo, ou o $value quando invariante. */
export function valorNoModo(token, modo) {
  const m = token.$extensions && token.$extensions[NS] && token.$extensions[NS].modes;
  return m && modo in m ? m[modo] : token.$value;
}

/** Indexa todos os tokens de varias fontes por caminho pontuado. */
export function indexar(fontes) {
  const idx = new Map();
  for (const f of fontes) for (const [p, t] of folhas(f)) idx.set(p.join('.'), t);
  return idx;
}

/**
 * Resolve a cadeia de referencias ate o literal.
 * Quando o alvo tem modos proprios (a camada de marca tem sete), usa o modo
 * padrao daquela camada — o mesmo criterio da leitura do Figma.
 */
export function valorFinal(valor, idx, padroesPorPrefixo, profundidade = 0) {
  if (profundidade > 12) return 'CICLO';
  const a = aliasDe(valor);
  if (!a) return canon(valor);
  const alvo = idx.get(a);
  if (!alvo) return 'AUSENTE:' + a;
  const prefixo = a.split('.')[0];
  const modoPadrao = padroesPorPrefixo[prefixo];
  return valorFinal(valorNoModo(alvo, modoPadrao), idx, padroesPorPrefixo, profundidade + 1);
}

/**
 * Classifica cada token de uma fonte como invariante ou variante entre modos.
 *
 * Criterio: invariante somente quando ALIAS e VALOR FINAL sao equivalentes em
 * todos os modos. A comparacao usa a forma canonica — nunca identidade de
 * objeto, nunca ordem de chave, nunca o $type.
 */
export function classifica(fonte, modos, idx, padroesPorPrefixo) {
  const invariantes = new Set();
  const variantes = new Set();
  const detalhe = new Map();
  for (const [p, t] of folhas(fonte)) {
    const nome = p.join('.');
    const chaves = modos.map((m) => {
      const bruto = valorNoModo(t, m);
      return canon(aliasDe(bruto)) + '::' + valorFinal(bruto, idx, padroesPorPrefixo);
    });
    const igual = chaves.every((c) => c === chaves[0]);
    (igual ? invariantes : variantes).add(nome);
    detalhe.set(nome, { igual, chaves });
  }
  return { invariantes, variantes, detalhe };
}
