/*
 * Overview of the foundations.
 *
 * The text comes from the language dictionary, in `../.storybook/i18n/`. The
 * story is SINGLE: it reads `globals.locale` and looks up the translation.
 *
 * Built with the blocks of `src/shared/docs/page.ts`: every text uses a text
 * role and every value is a `--nph-*` token. A foundation links only where a
 * page about it already exists in Storybook — today, the icon catalog. The
 * link text is the destination's own sidebar label, in the chosen language.
 */
import { html } from 'lit';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, sidebarLabel, translations } from '../.storybook/i18n/index.js';
import { PAGE_FOCUS, body, header, note, textRole } from '../src/shared/docs/page';
import { goToStory, storyHref } from '../src/shared/docs/story-link';
import '../src/components/nph-icon/nph-icon';

export default {
  title: 'Foundations/Overview',
  parameters: {
    layout: 'fullscreen',
  },
};

/** Story that shows each foundation, by the item `id` in the dictionary. */
const DESTINATIONS = {
  icons: 'components-nph-icon-docs--icons-overview',
};

const content = `
  display: flex;
  flex-direction: column;
  gap: var(--nph-space-section);
  inline-size: 100%;
  max-inline-size: var(--nph-layout-max-app);
  margin-inline: auto;
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

function itemDestination(item, locale) {
  const storyId = DESTINATIONS[item.id];
  if (!storyId) return '';
  return html`
    <a
      href=${storyHref(storyId)}
      @click=${(event) => goToStory(event, storyId)}
      style="${textRole('label-md')} display: inline-flex; align-items: center; gap: var(--nph-space-inline-tight); margin-block-start: auto; padding-block-start: var(--nph-space-stack-tight); color: var(--nph-color-card-foreground); text-decoration: underline; text-underline-offset: var(--nph-space-inline-tight);"
    >
      ${sidebarLabel(storyId, locale) ?? storyId}
      <nph-icon name="arrow-right" size="sm"></nph-icon>
    </a>
  `;
}

/** The foundations the components consume, and where each one is shown. */
export const Overview = {
  name: 'Overview',
  render: (_args, context) => {
    const locale = context?.globals?.[LOCALE_GLOBAL] ?? DEFAULT_LOCALE;
    const t = translations(locale).foundations;

    return html`
      ${PAGE_FOCUS}
      <main style="${body} min-height: 100vh;">
        <div style=${content}>
          ${header(t.title, t.summary)}

          <div style="display: grid; gap: var(--nph-space-stack); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));">
            ${t.items.map(
              (item) => html`
                <article style=${card}>
                  <h2 style="margin: 0; ${textRole('heading-xs')}">${item.title}</h2>
                  <p style="margin: 0; ${textRole('body-md')}">${item.text}</p>
                  ${itemDestination(item, locale)}
                </article>
              `,
            )}
          </div>

          ${note('info', t.noticeTitle, `${t.noticeText1} design.md ${t.noticeText2}`)}
        </div>
      </main>
    `;
  },
};
