/**
 * Idiomas do Storybook do Nephos.
 *
 * Uma story NUNCA e duplicada por idioma: ela le o idioma escolhido e busca o
 * texto no dicionario. Triplicar story significaria corrigir tres vezes toda
 * alteracao, e uma hora alguem esqueceria uma.
 *
 * `pt-BR` e a fonte. `en` e `es` sao traducoes. Identificadores tecnicos —
 * `nph-icon`, tokens, atributos, comandos, caminhos — nao passam por aqui:
 * aparecem literais na story, iguais em qualquer idioma. Texto em portugues
 * escrito a mao numa story reprova no `npm run test:naming`: todo texto visivel
 * mora aqui.
 *
 * Ver `docs/i18n.md`.
 */

/*
 * Os dicionarios sao JSON, um por idioma, e JSON nao tem comentario: as regras
 * deles ficam aqui.
 *
 * - `pt-BR.json` e o idioma-fonte. Toda frase nasce nele; `en.json` e `es.json`
 *   sao traducoes e nunca decidem conteudo. Se divergirem, a fonte vence.
 * - `sidebar` traduz rotulos da barra lateral por id de entrada. O id e o da
 *   story ou do grupo, em ingles, porque titulo, nome e exportacao da story sao
 *   identificadores (P64); o rotulo em portugues vem daqui. Entrada sem
 *   chave mantem o nome original — e o caso de `nph-icon`, que e nome tecnico.
 * - `colorScheme` e o seletor de modo da barra de ferramentas. Um modo por vez:
 *   moldura e pagina trocam juntas.
 * - `categories` segue a ordem de `icones_nucleo`, no design.md.
 * - Numero entra por marcador `{nome}`, preenchido por `format()`. O marcador e
 *   o mesmo nos tres idiomas; so o texto em volta e traduzido.
 */
import ptBR from './pt-BR.json';
import en from './en.json';
import es from './es.json';

/** O identificador do global e `locale`, em ingles, como todo nome tecnico. */
export const LOCALE_GLOBAL = 'locale';

export const DEFAULT_LOCALE = 'pt-BR';

/** Ordem de exibicao no seletor. A fonte vem primeiro. */
export const LOCALES = [
  { value: 'pt-BR', title: 'Português (BR)', right: '🇧🇷' },
  { value: 'en', title: 'English', right: '🇺🇸' },
  { value: 'es', title: 'Español', right: '🇪🇸' },
];

const DICTIONARIES = { 'pt-BR': ptBR, en, es };

/**
 * Devolve o dicionario do idioma pedido. Idioma desconhecido cai na fonte, em
 * vez de quebrar a pagina: texto em portugues e um defeito visivel e pequeno;
 * uma story em branco e um defeito grande.
 */
export function translations(locale) {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

/**
 * Rotulo traduzido de uma entrada da barra lateral, ou `undefined` quando nao
 * ha traducao — e o caso de `nph-icon`, que e nome tecnico e nunca muda.
 */
export function sidebarLabel(id, locale) {
  return translations(locale).sidebar[id];
}

/**
 * Preenche os marcadores `{nome}` de um texto do dicionario. Marcador sem valor
 * fica como esta, para o defeito aparecer na pagina em vez de sumir.
 */
export function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (marker, name) =>
    Object.hasOwn(values, name) ? String(values[name]) : marker,
  );
}
