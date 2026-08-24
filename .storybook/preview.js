/**
 * Preview do Storybook do Nephos.
 *
 * Sem tema, sem tokens e sem decorators. O P17 ja decidiu o formato dos tokens
 * — JSON como fonte versionada, CSS custom properties como saida gerada — mas
 * nenhum valor entra no repositorio antes da auditoria Figma <-> documentacao.
 * Ver `docs/decisoes-tecnicas.md`.
 *
 * @type {import('@storybook/web-components').Preview}
 */
const preview = {
  parameters: {},
};

export default preview;
