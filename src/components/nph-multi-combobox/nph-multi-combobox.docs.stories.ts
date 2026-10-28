/**
 * Reading page of `nph-multi-combobox` and of its chip.
 *
 * It does not prove the contract — that is the role of
 * `Components/nph-multi-combobox/Validation` and of the tests. The content is transcribed
 * from the board accepted in Figma (`1467:25660`, set `1467:25652`, chip `1467:24879`, the
 * `nph-combobox` list `1359:141`, option `1357:136`), from the spec sheet
 * (`fichas/nph-multi-combobox.md`) and from P96; nothing is decided here. The page follows
 * the order of the `nph-badge` page: it opens with the labelled matrix, and the two lists of
 * "When to use" are the ones of the sheet. The set has one variant axis, `size`, so there is
 * no Variants section: Sizes and States come first, then the sections of the piece itself —
 * Chip, Counter and List. The three required examples of the board close it, each in light
 * and dark mode, inside `nph-field`.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - the Usage section (P70) enters every Docs page, after API, in DSA-35, which also gives
 *   `package.json` the `exports` for the import line;
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `multiComboboxDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import type { NphComboboxEntry } from '../nph-combobox/nph-combobox';
import './nph-multi-combobox';
import { bothModes, entriesOf, firstValues, many, resting, typing } from './nph-multi-combobox.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-multi-combobox.json';

const meta: Meta = {
  title: 'Components/nph-multi-combobox/Docs',
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
  sizes: 'sizes',
  states: 'states',
  chip: 'chip',
  counter: 'counter',
  list: 'list',
  anatomy: 'anatomy',
  accessibility: 'accessibility',
  examples: 'required-examples',
  references: 'references',
} as const;

/* Demo frame. Not a precedent for component CSS. */
const column = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
/* Room below an open list, so it does not cover the next block. */
const room = 'padding-block-end: calc(var(--nph-layout-max-list-height) + var(--nph-space-section));';

/** A region and a kind of tag of the dictionary. */
interface Region {
  name: string;
  countries: string[];
}

interface Kind {
  text: string;
  icon: string;
}

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).multiComboboxDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const countries = entriesOf(d.countries, 'c');
    const tags: NphComboboxEntry[] = d.kinds.map((kind: Kind, position: number) =>
      kind.icon === '' ? { value: `k${position + 1}`, text: kind.text } : { value: `k${position + 1}`, text: kind.text, start: 'icon' as const, icon: kind.icon },
    );
    const regions: NphComboboxEntry[] = d.regions.flatMap((region: Region, position: number) => [
      ...(position > 0 ? [{ type: 'separator' as const }] : []),
      { type: 'label' as const, text: region.name },
      ...region.countries.map((name: string, at: number) => ({ value: `r${position + 1}-${at + 1}`, text: name })),
    ]);
    const piece = (attributes: { size?: string; values?: number; counter?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-multi-combobox
        size=${attributes.size ?? 'default'}
        label=${d.countriesLabel}
        placeholder=${d.placeholder}
        remove-label=${d.removeLabel}
        subject=${d.subject}
        ?counter=${attributes.counter ?? false}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
        .options=${countries}
        .defaultValue=${firstValues('c', attributes.values ?? 0)}
      ></nph-multi-combobox>`;
    const openList = (options: NphComboboxEntry[], value: string[], query = ''): TemplateResult =>
      html`<div style=${room}>
        <nph-multi-combobox
          label=${d.countriesLabel}
          placeholder=${d.placeholder}
          remove-label=${d.removeLabel}
          empty-heading=${d.emptyHeading}
          empty-description=${d.emptyDescription}
          .options=${options}
          .defaultValue=${value}
          .query=${query}
          open
        ></nph-multi-combobox>
      </div>`;
    const example = { label: d.countriesLabel, help: d.countriesHelp, placeholder: d.placeholder, removeLabel: d.removeLabel, options: countries };

    return html`
      <main style=${body}>
        ${header('nph-multi-combobox', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['size: default', 'size: large'],
          [
            { label: 'placeholder', cells: [piece({}), piece({ size: 'large' })] },
            { label: 'items', cells: [piece({ values: 2 }), piece({ size: 'large', values: 2 })] },
            { label: 'counter', cells: [piece({ values: 5, counter: true }), piece({ size: 'large', values: 5, counter: true })] },
            { label: 'invalid', cells: [piece({ values: 2, invalid: true }), piece({ size: 'large', values: 2, invalid: true })] },
            { label: 'disabled', cells: [piece({ values: 2, disabled: true }), piece({ size: 'large', values: 2, disabled: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.chip, title: d.chipTitle },
          { id: SECTIONS.counter, title: d.counterTitle },
          { id: SECTIONS.list, title: d.listTitle },
          { id: SECTIONS.anatomy, title: d.anatomyTitle },
          { id: SECTIONS.accessibility, title: d.accessibilityTitle },
          { id: SECTIONS.examples, title: d.examplesTitle },
          { id: SECTIONS.references, title: d.referencesTitle },
        ])}

        ${section(
          SECTIONS.whenToUse,
          d.whenToUseTitle,
          html`
            ${text(d.description)}
            ${sheetUseDontUse(metadata, localeOf(context), d)}
            ${text(d.relationsText)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.api,
          d.apiTitle,
          html`${table(d.apiHeader, d.api.map(pair))} ${table(d.entryHeader, d.entries.map(pair))}
          ${note('warning', d.invalidTitle, d.invalidText)} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(html`<div style=${column}>${piece({ values: 2 })} ${piece({ size: 'large', values: 2 })}</div>`, d.sizesCaption)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${column}>${piece({})} ${piece({ values: 2 })} ${piece({ values: 2, invalid: true })} ${piece({ values: 2, disabled: true })}</div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.chip,
          d.chipTitle,
          html`
            ${text(d.chipText)}
            ${table(d.chipHeader, d.chipStates.map(pair))}
            ${demo(
              html`<div style=${column}>
                <nph-multi-combobox label=${d.tagsLabel} remove-label=${d.removeLabel} .options=${tags} .defaultValue=${firstValues('k', tags.length)}></nph-multi-combobox>
                <nph-multi-combobox label=${d.tagsLabel} remove-label=${d.removeLabel} chip-icon .options=${tags} .defaultValue=${firstValues('k', tags.length)}></nph-multi-combobox>
              </div>`,
              d.chipCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.counter,
          d.counterTitle,
          html`
            ${text(d.counterText)}
            ${demo(piece({ values: 5, counter: true }), d.counterCaption)}
            ${source(d.sourceLabel, d.sourceDecisions)}
          `,
        )}

        ${section(
          SECTIONS.list,
          d.listTitle,
          html`
            ${text(d.listText)}
            ${table(d.listStatesHeader, d.listStates.map(pair))}
            ${demo(openList(countries, ['c2', 'c4'], d.searchQuery), d.searchCaption)}
            ${demo(openList(regions, ['r1-1']), d.groupsCaption)}
            ${demo(openList(countries, [], d.emptyQuery), d.emptyCaption)}
            ${table(d.keyboardHeader, d.keyboard.map(pair))}
            ${source(d.sourceLabel, d.sourceDecisions)}
          `,
        )}

        ${section(
          SECTIONS.anatomy,
          d.anatomyTitle,
          html`${table(d.anatomyHeader, d.anatomy.map(pair), 'text')} ${source(d.sourceLabel, d.sourceFrame)}`,
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
            ${demo(bothModes(captions, () => resting({ ...example, value: ['c2', 'c4'] })), d.exampleResting)}
            ${demo(bothModes(captions, () => typing({ ...example, value: ['c2'], query: d.searchQuery }), true), d.exampleTyping)}
            ${demo(bothModes(captions, () => many({ ...example, value: firstValues('c', 9) })), d.exampleMany)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
