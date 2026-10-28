/**
 * Reading page of `nph-togglebutton`.
 *
 * It does not prove the contract — that is the role of `Components/nph-togglebutton/Validation` and
 * of the tests. The content is transcribed from the frame accepted in Figma (`1512:27498`), from
 * the spec sheet (`ficha`) and from P73; nothing is decided here. The page follows the order of
 * the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use" are
 * the ones of the sheet. The three required examples of the frame close it, each in light and dark
 * mode.
 *
 * Deferred, not fulfilled here:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `togglebuttonDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import './nph-togglebutton';
import { iconSet, inScheme, optionOff, optionOn } from './nph-togglebutton.demo';
import type { Scheme } from './nph-togglebutton.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-togglebutton.json';

const meta: Meta = {
  title: 'Components/nph-togglebutton/Docs',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

interface GlobalsContext {
  globals?: Record<string, unknown>;
}

function localeOf(context: GlobalsContext | undefined): string {
  return (context?.globals?.[LOCALE_GLOBAL] as string | undefined) ?? DEFAULT_LOCALE;
}

/** Section ids: technical identifiers, the same in any language. */
const SECTIONS = {
  whenToUse: 'when-to-use',
  api: 'api',
  usage: 'usage',
  states: 'states',
  icons: 'icons',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modes = 'display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);';

/** The same example in light and in dark mode, side by side. */
function bothModes(d: Record<string, string>, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', d.lightCaption as string],
    ['dark', d.darkCaption as string],
  ];
  return html`<div style=${modes}>${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}</div>`;
}

/** The icon pairs of the Icons section: the two icon attributes of one row. */
const ICON_ROWS: ReadonlyArray<readonly [string, string]> = [
  ['auto', 'auto'],
  ['none', 'none'],
  ['star', 'star'],
  ['auto', 'none'],
  ['none', 'auto'],
];

/** Reading page, built with the blocks of `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).togglebuttonDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const set = [
      { icon: 'grid-2', label: d.gridView },
      { icon: 'list', label: d.listView, pressed: true },
      { icon: 'star', label: d.favorites },
    ];
    const piece = (attributes: { pressed?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-togglebutton
        text=${d.showGrid}
        ?pressed=${attributes.pressed ?? false}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
      ></nph-togglebutton>`;
    const iconOnly = (pressed: boolean, invalid = false): TemplateResult =>
      html`<nph-togglebutton icon-start="star" label=${d.favorites} ?pressed=${pressed} ?invalid=${invalid}></nph-togglebutton>`;

    return html`
      <main style=${body}>
        ${header('nph-togglebutton', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['pressed: false', 'pressed: true'],
          [
            { label: 'text', cells: [piece({}), piece({ pressed: true })] },
            { label: 'text · invalid', cells: [piece({ invalid: true }), piece({ invalid: true, pressed: true })] },
            { label: 'label · icon-start: star', cells: [iconOnly(false), iconOnly(true)] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.icons, title: d.iconsTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${text(d.relationsText)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-togglebutton'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${row}>
                ${piece({})} ${piece({ pressed: true })} ${piece({ invalid: true })} ${piece({ disabled: true })}
                <nph-togglebutton text=${d.showGrid} disabled invalid pressed></nph-togglebutton>
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceStates)}
          `,
        )}

        ${section(
          SECTIONS.icons,
          d.iconsTitle,
          html`
            ${text(d.iconsText)}
            ${demo(
              html`<div style=${column}>
                ${ICON_ROWS.map(
                  ([start, end]) => html`<div style=${row}>
                    <nph-togglebutton text=${d.showGrid} icon-start=${start} icon-end=${end}></nph-togglebutton>
                    <nph-togglebutton text=${d.showGrid} icon-start=${start} icon-end=${end} pressed></nph-togglebutton>
                  </div>`,
                )}
                <div style=${row}>${iconOnly(false)} ${iconOnly(true)}</div>
              </div>`,
              d.iconsCaption,
            )}
            ${table(d.iconsHeader, d.icons.map(pair))} ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAnatomy)}`,
        )}

        ${section(
          SECTIONS.accessibility,
          d.accessibilityTitle,
          html`${table(d.accessibilityHeader, d.accessibility.map(pair), 'text')} ${source(d.sourceLabel, d.sourceAccessibility)}`,
        )}

        ${section(
          SECTIONS.examples,
          d.examplesTitle,
          html`
            ${demo(bothModes(d, () => optionOff(d.showGrid)), d.exampleOff)}
            ${demo(bothModes(d, () => optionOn(d.showGrid)), d.exampleOn)}
            ${demo(bothModes(d, () => iconSet(set)), d.exampleIconSet)}
            ${source(d.sourceLabel, d.sourceSpec)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
