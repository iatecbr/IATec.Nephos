/*
 * Storybook entry page.
 *
 * The text comes from the language dictionary, in `../.storybook/i18n/`. The
 * story is SINGLE: it reads `globals.locale` and looks up the translation.
 * There is no copy of this page per language — tripling it would require
 * fixing every change three times.
 *
 * Built with the blocks of `src/shared/docs/page.ts`: every text uses a text
 * role and every value is a `--nph-*` token. The cover title is
 * `text/heading-xl`, which design.md reserves for the documentation cover.
 * A step whose destination is a story links to it; the step that points
 * outside Storybook only names the destination.
 */
import { html } from 'lit';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../.storybook/i18n/index.js';
import { PAGE_FOCUS, body, section, textRole } from '../src/shared/docs/page';
import { goToStory, storyHref } from '../src/shared/docs/story-link';
import '../src/components/nph-icon/nph-icon';

export default {
  title: 'Start here/Welcome',
  parameters: {
    layout: 'fullscreen',
  },
};

/** Destination of each step, by the step `id` in the dictionary. */
const DESTINATIONS = {
  foundations: 'foundations-overview--overview',
  components: 'components-nph-icon-docs--documentation',
};

const content = `
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-section);
  inline-size: 100%;
  max-inline-size: var(--nph-layout-max-app);
  margin-inline: auto;
`;

const cover = `
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack);
  padding: var(--nph-space-section) var(--nph-space-container-padding);
  border-radius: var(--nph-radius-control);
  background: var(--nph-color-primary);
  color: var(--nph-color-primary-foreground);
`;

const card = `
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-stack-tight);
  padding: var(--nph-space-stack) var(--nph-space-container-padding);
  border: var(--nph-border-width) solid var(--nph-color-border);
  border-radius: var(--nph-radius-control);
  background: var(--nph-color-card);
  color: var(--nph-color-card-foreground);
`;

const destination = `
  ${textRole('label-md')}
  display: inline-flex;
  align-items: center;
  gap: var(--nph-space-inline-tight);
  margin-block-start: auto;
  padding-block-start: var(--nph-space-stack-tight);
  color: var(--nph-color-card-foreground);
`;

function stepDestination(step) {
  const storyId = DESTINATIONS[step.id];
  if (!storyId) return html`<span style=${destination}>${step.destination}</span>`;
  return html`
    <a
      href=${storyHref(storyId)}
      @click=${(event) => goToStory(event, storyId)}
      style="${destination} text-decoration: underline; text-underline-offset: var(--nph-space-inline-tight);"
    >
      ${step.destination}
      <nph-icon name="arrow-right" size="sm"></nph-icon>
    </a>
  `;
}

/** Where to start: the three steps of the reading, each with its destination. */
export const Welcome = {
  name: 'Welcome',
  render: (_args, context) => {
    const t = translations(context?.globals?.[LOCALE_GLOBAL] ?? DEFAULT_LOCALE).welcome;

    return html`
      ${PAGE_FOCUS}
      <main style="${body} min-height: 100vh;">
        <div style=${content}>
          <header style=${cover}>
            <h1 style="margin: 0; ${textRole('heading-xl')}">Nephos</h1>
            <p style="margin: 0; ${textRole('body-md')} max-width: var(--nph-layout-max-reading);">${t.summary}</p>
          </header>

          ${section(
            'how-to-navigate',
            t.howToNavigate,
            html`
              <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
                ${t.steps.map(
                  (step) => html`
                    <article style=${card}>
                      <h3 style="margin: 0; ${textRole('heading-xs')}">${step.title}</h3>
                      <p style="margin: 0; ${textRole('body-md')}">${step.text}</p>
                      ${stepDestination(step)}
                    </article>
                  `,
                )}
              </div>
            `,
          )}
        </div>
      </main>
    `;
  },
};
