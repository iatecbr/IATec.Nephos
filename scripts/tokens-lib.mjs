/**
 * Funcoes puras compartilhadas por build-tokens.mjs e test-invariance.mjs.
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
export const HANDLED_TYPES = new Set([
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
export function aliasOf(v) {
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
export function leaves(node, base = []) {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push([base.concat(k), v]);
    else if (v && typeof v === 'object') out.push(...leaves(v, base.concat(k)));
  }
  return out;
}

/** Valor bruto de um token num modo: o valor do modo, ou o $value quando invariante. */
export function valueInMode(token, mode) {
  const m = token.$extensions && token.$extensions[NS] && token.$extensions[NS].modes;
  return m && mode in m ? m[mode] : token.$value;
}

/** Indexa todos os tokens de varias fontes por caminho pontuado. */
export function buildIndex(sources) {
  const idx = new Map();
  for (const f of sources) for (const [p, t] of leaves(f)) idx.set(p.join('.'), t);
  return idx;
}

/**
 * Resolve a cadeia de referencias ate o literal.
 * Quando o alvo tem modos proprios (a camada de marca tem sete), usa o modo
 * padrao daquela camada — o mesmo criterio da leitura do Figma.
 */
export function finalValue(value, idx, defaultsByPrefix, depth = 0) {
  if (depth > 12) return 'CYCLE';
  const a = aliasOf(value);
  if (!a) return canon(value);
  const target = idx.get(a);
  if (!target) return 'MISSING:' + a;
  const prefix = a.split('.')[0];
  const defaultMode = defaultsByPrefix[prefix];
  return finalValue(valueInMode(target, defaultMode), idx, defaultsByPrefix, depth + 1);
}

/**
 * Classifica cada token de uma fonte como invariante ou variante entre modos.
 *
 * Criterio: invariante somente quando ALIAS e VALOR FINAL sao equivalentes em
 * todos os modos. A comparacao usa a forma canonica — nunca identidade de
 * objeto, nunca ordem de chave, nunca o $type.
 */
export function classify(source, modes, idx, defaultsByPrefix) {
  const invariants = new Set();
  const variants = new Set();
  const detail = new Map();
  for (const [p, t] of leaves(source)) {
    const name = p.join('.');
    const keys = modes.map((m) => {
      const raw = valueInMode(t, m);
      return canon(aliasOf(raw)) + '::' + finalValue(raw, idx, defaultsByPrefix);
    });
    const equal = keys.every((c) => c === keys[0]);
    (equal ? invariants : variants).add(name);
    detail.set(name, { equal, keys });
  }
  return { invariants, variants, detail };
}

/**
 * Invariantes que DEPENDEM de marca ou de esquema (P67).
 *
 * Um invariante e dependente quando alguma referencia dele aponta para
 * `theme.*`, para um variante ou para outro invariante dependente. O conjunto
 * sai por ponto fixo, para pegar a cadeia invariante -> invariante -> theme.
 *
 * Por que importa: custom property com `var()` resolve no elemento que a
 * declara, e o filho herda o valor ja resolvido. Um dependente declarado so em
 * `:root` fica com a marca e o esquema da raiz numa subarvore que troca os dois.
 */
export function dependents(source, invariants, variants) {
  const tokens = new Map(leaves(source).map(([p, t]) => [p.join('.'), t]));
  const references = (name) => {
    const t = tokens.get(name);
    const m = (t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes) || {};
    return refs(t.$value).concat(Object.values(m).flatMap(refs));
  };
  const out = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const name of invariants) {
      if (out.has(name)) continue;
      const hit = references(name).some((r) => r.startsWith('theme.') || variants.has(r) || out.has(r));
      if (hit) {
        out.add(name);
        changed = true;
      }
    }
  }
  return out;
}
