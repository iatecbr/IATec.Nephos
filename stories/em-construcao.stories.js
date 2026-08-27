/*
 * Pagina de entrada do Storybook.
 *
 * O texto vem do dicionario de idioma, em `../.storybook/i18n/`. A story e
 * UNICA: ela le `globals.locale` e busca a traducao. Nao existe uma copia desta
 * pagina por idioma — triplicar exigiria corrigir tres vezes toda alteracao.
 */
import { html } from 'lit';

import { CHAVE, IDIOMA_PADRAO, textos } from '../.storybook/i18n/index.js';

export default {
  title: 'Comece aqui/Boas-vindas',
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

export const BoasVindas = {
  name: 'Boas-vindas',
  render: (_args, contexto) => {
    const t = textos(contexto?.globals?.[CHAVE] ?? IDIOMA_PADRAO).boasVindas;

    return html`
      <main style=${page}>
        <section style=${content}>
          <header
            style="${card} background: var(--nph-color-primary); border-color: var(--nph-color-primary); color: var(--nph-color-primary-foreground);"
          >
            <p style="font-size: .875rem; font-weight: 700; letter-spacing: .08em; margin: 0 0 var(--nph-space-stack-tight);">
              ${t.selo}
            </p>
            <h1 style="font-size: 2.5rem; margin: 0;">Nephos</h1>
            <p style="font-size: 1.125rem; line-height: 1.6; margin: var(--nph-space-stack) 0 0; max-width: 42rem;">
              ${t.resumo}
            </p>
          </header>

          <section>
            <h2 style="font-size: 1.25rem; margin: 0 0 var(--nph-space-stack);">${t.comoNavegar}</h2>
            <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
              ${t.passos.map(
                (passo) => html`
                  <article style=${card}>
                    <h3 style="font-size: 1rem; margin: 0 0 var(--nph-space-stack-tight);">${passo.titulo}</h3>
                    <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: 0;">
                      ${passo.texto}
                    </p>
                    <p style="color: var(--nph-color-primary); font-size: .875rem; font-weight: 700; margin: var(--nph-space-stack) 0 0;">
                      ${passo.destino}
                    </p>
                  </article>
                `,
              )}
            </div>
          </section>

          <aside style=${card}>
            <strong>${t.estadoTitulo}</strong>
            <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: var(--nph-space-stack-tight) 0 0;">
              ${t.estadoTexto}
            </p>
          </aside>
        </section>
      </main>
    `;
  },
};
