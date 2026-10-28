/**
 * Reading page of `nph-combobox` and of its list.
 *
 * It does not prove the contract — that is the role of `Components/nph-combobox/Validation`
 * and of the tests. The content is transcribed from the board accepted in Figma (`1359:142`,
 * documentation `1766:2400`, set `1359:115`, list `1359:141`, option `1357:136`), from the
 * spec sheet (`fichas/nph-combobox.md`) and from P95; nothing is decided here. The page
 * follows the order of the `nph-badge` page: it opens with the labelled matrix, and the two
 * lists of "When to use" are the ones of the sheet. The set has one variant axis, `size`, so
 * there is no Variants section: Sizes and States come first, then the sections of the piece
 * itself — Start and List. The three required examples of the board close it, each in light
 * and dark mode, inside `nph-field`.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the
 * `comboboxDocs` key. The story is SINGLE: it reads `globals.locale` and looks up the
 * translation. Technical identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { PHOTO_A, PHOTO_B, PHOTO_C } from '../nph-avatar/nph-avatar.demo';
import './nph-combobox';
import type { NphComboboxEntry } from './nph-combobox';
import { bothModes, chosen, entriesOf, search, waiting } from './nph-combobox.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-combobox.json';

const meta: Meta = {
  title: 'Components/nph-combobox/Docs',
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
  sizes: 'sizes',
  states: 'states',
  start: 'start',
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

const PHOTOS = [PHOTO_A, PHOTO_B, PHOTO_C];

/** A person, a state and a region of the dictionary. */
interface Person {
  name: string;
  role: string;
}

interface Status {
  status: string;
  label: string;
}

interface Region {
  name: string;
  countries: string[];
}

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).comboboxDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const countries = entriesOf(d.countries, 'c');
    const people: NphComboboxEntry[] = d.people.map((person: Person, position: number) => ({
      value: `p${position + 1}`,
      text: person.name,
      secondary: person.role,
      start: 'avatar' as const,
      src: position < d.people.length - 1 ? PHOTOS[position % PHOTOS.length] : '',
    }));
    const statuses: NphComboboxEntry[] = d.statuses.map((status: Status, position: number) => ({
      value: `s${position + 1}`,
      text: status.label,
      start: 'dot' as const,
      status: status.status as 'success',
    }));
    const regions: NphComboboxEntry[] = d.regions.flatMap((region: Region, position: number) => [
      ...(position > 0 ? [{ type: 'separator' as const }] : []),
      { type: 'label' as const, text: region.name },
      ...region.countries.map((name: string, at: number) => ({ value: `r${position + 1}-${at + 1}`, text: name })),
    ]);
    const piece = (attributes: { size?: string; value?: boolean; clearable?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-combobox
        size=${attributes.size ?? 'default'}
        label=${d.countryLabel}
        placeholder=${d.placeholder}
        value=${attributes.value ? 'c2' : ''}
        ?clearable=${attributes.clearable ?? false}
        clear-label=${d.clearLabel}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
        .options=${countries}
      ></nph-combobox>`;
    const openList = (label: string, options: NphComboboxEntry[], query = ''): TemplateResult =>
      html`<div style=${room}>
        <nph-combobox
          label=${label}
          placeholder=${d.placeholder}
          empty-heading=${d.emptyHeading}
          empty-description=${d.emptyDescription}
          .options=${options}
          .query=${query}
          open
        ></nph-combobox>
      </div>`;

    return html`
      <main style=${body}>
        ${header('nph-combobox', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['size: default', 'size: large'],
          [
            { label: 'placeholder', cells: [piece({}), piece({ size: 'large' })] },
            { label: 'value · clearable', cells: [piece({ value: true, clearable: true }), piece({ size: 'large', value: true, clearable: true })] },
            { label: 'invalid', cells: [piece({ invalid: true }), piece({ size: 'large', invalid: true })] },
            { label: 'disabled', cells: [piece({ value: true, disabled: true }), piece({ size: 'large', value: true, disabled: true })] },
          ],
        )}
        ${note('info', d.derivedTitle, d.derivedText)}
        ${index(d.onThisPage, [
          { id: SECTIONS.whenToUse, title: d.whenToUseTitle },
          { id: SECTIONS.api, title: d.apiTitle },
          { id: SECTIONS.usage, title: d.usageTitle },
          { id: SECTIONS.sizes, title: d.sizesTitle },
          { id: SECTIONS.states, title: d.statesTitle },
          { id: SECTIONS.start, title: d.startTitle },
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
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-combobox'], d.usageImport)}
            ${source(d.sourceLabel, d.sourceUsage)}`,
        )}

        ${section(
          SECTIONS.sizes,
          d.sizesTitle,
          html`
            ${text(d.sizesText)}
            ${demo(html`<div style=${column}>${piece({ value: true })} ${piece({ size: 'large', value: true })}</div>`, d.sizesCaption)}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.states,
          d.statesTitle,
          html`
            ${table(d.statesHeader, d.states.map(pair))}
            ${demo(
              html`<div style=${column}>
                ${piece({})} ${piece({ value: true, clearable: true })} ${piece({ invalid: true })} ${piece({ value: true, disabled: true })}
              </div>`,
              d.statesCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.start,
          d.startTitle,
          html`
            ${text(d.startText)}
            ${demo(
              html`<div style=${column}>
                <nph-combobox label=${d.countryLabel} placeholder=${d.placeholder} .options=${countries}></nph-combobox>
                <nph-combobox start="icon" label=${d.countryLabel} placeholder=${d.placeholder} .options=${countries}></nph-combobox>
                <nph-combobox start="avatar" label=${d.ownerLabel} value="p1" .options=${people}></nph-combobox>
              </div>`,
              d.startCaption,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(
          SECTIONS.list,
          d.listTitle,
          html`
            ${text(d.listText)}
            ${table(d.listStatesHeader, d.listStates.map(pair))}
            ${demo(openList(d.countryLabel, countries, d.searchQuery), d.searchCaption)}
            ${demo(openList(d.statusLabel, statuses), d.statusCaption)}
            ${demo(openList(d.countryLabel, regions), d.groupsCaption)}
            ${demo(openList(d.countryLabel, countries, d.emptyQuery), d.emptyCaption)}
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
            ${demo(
              bothModes(captions, () =>
                chosen({ label: d.countryLabel, help: d.countryHelp, placeholder: d.placeholder, clearLabel: d.clearLabel, options: countries, value: 'c2' }),
              ),
              d.exampleChosen,
            )}
            ${demo(
              bothModes(
                captions,
                () => search({ label: d.countryLabel, placeholder: d.placeholder, clearLabel: d.clearLabel, options: countries, query: d.searchQuery }),
                true,
              ),
              d.exampleSearch,
            )}
            ${demo(
              bothModes(captions, () => waiting({ label: d.countryLabel, placeholder: d.placeholder, query: d.searchQuery, loadingLabel: d.loadingLabel }), true),
              d.exampleLoading,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
