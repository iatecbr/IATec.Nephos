/*
 * Overview of the foundations.
 *
 * The text comes from the language dictionary, in `../.storybook/i18n/`. The
 * story is SINGLE: it reads `globals.locale` and looks up the translation.
 */
import { html } from 'lit';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../.storybook/i18n/index.js';

export default {
  title: 'Foundations/Overview',
  parameters: {
    layout: 'fullscreen',
  },
};

const page = `
  color: var(--nph-color-foreground);
  background: var(--nph-color-background);
  font-family: var(--nph-core-font-sans);
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

export const Overview = {
  name: 'Overview',
  render: (_args, context) => {
    const t = translations(context?.globals?.[LOCALE_GLOBAL] ?? DEFAULT_LOCALE).foundations;

    return html`
      <main style=${page}>
        <section style=${content}>
          <header>
            <p style="color: var(--nph-color-primary); font-weight: 700; margin: 0 0 var(--nph-space-stack-tight);">
              ${t.badge}
            </p>
            <h1 style="font-size: 2rem; margin: 0;">${t.title}</h1>
            <p style="color: var(--nph-color-muted-foreground); line-height: 1.6; margin: var(--nph-space-stack) 0 0; max-width: 44rem;">
              ${t.summary}
            </p>
          </header>

          <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
            ${t.items.map(
              ([title, description]) => html`
                <article style=${card}>
                  <h2 style="font-size: 1rem; margin: 0 0 var(--nph-space-stack-tight);">${title}</h2>
                  <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: 0;">
                    ${description}
                  </p>
                </article>
              `,
            )}
          </div>

          <aside style="${card} border-left: 4px solid var(--nph-color-primary);">
            <strong>${t.noticeTitle}</strong>
            <p style="color: var(--nph-color-muted-foreground); line-height: 1.5; margin: var(--nph-space-stack-tight) 0 0;">
              ${t.noticeText1} <code>design.md</code> ${t.noticeText2}
            </p>
          </aside>
        </section>
      </main>
    `;
  },
};
