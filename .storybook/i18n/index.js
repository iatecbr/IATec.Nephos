/**
 * Idiomas do Storybook do Nephos.
 *
 * Uma story NUNCA e duplicada por idioma: ela le o idioma escolhido e busca o
 * texto no dicionario. Triplicar story significaria corrigir tres vezes toda
 * alteracao, e uma hora alguem esqueceria uma.
 *
 * `pt-BR` e a fonte. `en` e `es` sao traducoes. Identificadores tecnicos —
 * `nph-icon`, tokens, atributos, comandos, caminhos — nao passam por aqui:
 * aparecem literais na story, iguais em qualquer idioma.
 *
 * Ver `docs/i18n.md`.
 */
import ptBR from './pt-BR.js';
import en from './en.js';
import es from './es.js';

/** O identificador do global e `locale`, em ingles, como todo nome tecnico. */
export const CHAVE = 'locale';

export const IDIOMA_PADRAO = 'pt-BR';

/** Ordem de exibicao no seletor. A fonte vem primeiro. */
export const IDIOMAS = [
  { value: 'pt-BR', title: 'Português (BR)', right: '🇧🇷' },
  { value: 'en', title: 'English', right: '🇺🇸' },
  { value: 'es', title: 'Español', right: '🇪🇸' },
];

const DICIONARIOS = { 'pt-BR': ptBR, en, es };

/**
 * Devolve o dicionario do idioma pedido. Idioma desconhecido cai na fonte, em
 * vez de quebrar a pagina: texto em portugues e um defeito visivel e pequeno;
 * uma story em branco e um defeito grande.
 */
export function textos(idioma) {
  return DICIONARIOS[idioma] ?? DICIONARIOS[IDIOMA_PADRAO];
}

/**
 * Rotulo traduzido de uma entrada da barra lateral, ou `undefined` quando nao
 * ha traducao — e o caso de `nph-icon`, que e nome tecnico e nunca muda.
 */
export function rotuloDaBarra(id, idioma) {
  return textos(idioma).barraLateral[id];
}
