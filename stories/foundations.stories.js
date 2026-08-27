/*
 * Visao geral das fundacoes.
 *
 * O texto vem do dicionario de idioma, em `../.storybook/i18n/`. A story e
 * UNICA: ela le `globals.locale` e busca a traducao.
 */
import { html } from 'lit';

import { CHAVE, IDIOMA_PADRAO, textos } from '../.storybook/i18n/index.js';

export default {
  title: 'Fundações/Visão geral',
  parameters: {
    layout: 'fullscreen',
  },
};

const page = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  padding: var(--nph-space-section) var(--nph-space-container-padding);
`;

const content = `
  display: grid;
  gap: var(--nph-space-section);
  margin: 0 auto;
  max-width: 72rem;
`;

const card = `
  background: var(--nph-color-card);
  border: 1px solid var(--nph-color-border);
  border-radius: var(--nph-radius-control);
  color: var(--nph-color-card-foreground);
  padding: var(--nph-space-container-padding);
`;

export const VisaoGeral = {
  name: 'Visão geral',
  render: (_args, contexto) => {
    const t = textos(contexto?.globals?.[CHAVE] ?? IDIOMA_PADRAO).fundacoes;

    return html`
      <main style=${page}>
        <section style=${content}>
          <header>
            <p style="color: var(--nph-color-primary); font-weight: 700; margin: 0 0 var(--nph-space-stack-tight);">
              ${t.selo}
            </p>
            <h1 style="font-size: 2rem; margin: 0;">${t.titulo}</h1>
            <p style="color: var(--nph-color-muted-foreground); line-height: 1.6; margin: var(--nph-space-stack) 0 0; max-width: 44rem;">
              ${t.resumo}
            </p>
          </header>

          <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
            ${t.itens.map(
              ([titulo, descricao]) => html`
                <article style=${card}>
                  <h2 style="font-size: 1rem; margin: 0 0 var(--nph-space-stack-tight);">${titulo}</h2>
                  <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: 0;">
                    ${descricao}
                  </p>
                </article>
              `,
            )}
          </div>

          <aside style="${card} border-left: 4px solid var(--nph-color-primary);">
            <strong>${t.avisoTitulo}</strong>
            <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: var(--nph-space-stack-tight) 0 0;">
              ${t.avisoTexto1} <code>design.md</code> ${t.avisoTexto2}
            </p>
          </aside>
        </section>
      </main>
    `;
  },
};
