/*
 * Preview do Storybook do Nephos. Sem tema e sem decorators.
 *
 * O CSS gerado a partir do JSON (P17) e carregado aqui porque os componentes
 * consomem `--nph-*` de fora do Shadow DOM: sem ele, `var(--nph-icon-size-sm)`
 * resolveria vazio e nenhuma caixa teria tamanho. O arquivo e GERADO — nunca
 * edite `src/tokens/generated/tokens.css` a mao.
 */
import '../src/tokens/generated/tokens.css';

/** @type {import('@storybook/web-components').Preview} */
const preview = {
  parameters: {},
};

export default preview;
