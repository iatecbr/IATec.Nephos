/**
 * Reading page of `nph-select` and of its option, `nph-option`.
 *
 * It does not prove the contract — that is the role of `Components/nph-select/Validation` and of
 * the tests. The content is transcribed from the frame accepted in Figma (`1357:160`, set
 * `1357:115`, option `1357:136`, list `1357:137`), from the spec sheets (`fichas/nph-select.md`
 * and `fichas/nph-option.md`) and from P91; nothing is decided here. The page follows the order
 * of the `nph-badge` page: it opens with the labelled matrix, and the two lists of "When to use"
 * are the ones of the sheet. The set has one variant axis, `size`, so there is no Variants
 * section: Sizes and States come first, then the sections of the piece itself — Start, Option and
 * List. The three required examples of the frame close it, each in light and dark mode, inside
 * `nph-field`. The option has no page of its own: it never stands alone, and this page is its
 * reading page.
 *
 * Deferred, not fulfilled here, as on every Docs page:
 * - `text/body-lg` in `text` and `list` (DSA-33).
 *
 * The text comes from the language dictionary, in `.storybook/i18n/`, under the `selectDocs` key.
 * The story is SINGLE: it reads `globals.locale` and looks up the translation. Technical
 * identifiers appear literally and are the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { LOCALE_GLOBAL, DEFAULT_LOCALE, translations } from '../../../.storybook/i18n/index.js';
import { PHOTO_A, PHOTO_B, PHOTO_C } from '../nph-avatar/nph-avatar.demo';
import '../nph-option/nph-option';
import './nph-select';
import { bothModes, department, owner, requiredWithNoChoice } from './nph-select.demo';
import type { Choice } from './nph-select.demo';
import { body, demo, header, index, list, matrix, note, section, source, table, text, usage } from '../../shared/docs/page';
import { sheetUseDontUse } from '../../shared/docs/sheet-lists';
import metadata from '../../shared/metadata/nph-select.json';

const meta: Meta = {
  title: 'Components/nph-select/Docs',
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
  option: 'option',
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
/* A stand-in of the list surface, so the options show their looks outside a select. */
const listSurface =
  'display: flex; flex-direction: column; box-sizing: border-box; inline-size: var(--nph-layout-input-width); padding: var(--nph-space-inline-tight); background: var(--nph-color-popover); border: var(--nph-border-width) solid var(--nph-color-input); border-radius: var(--nph-radius-container);';

const PHOTOS = [PHOTO_A, PHOTO_B, PHOTO_C];

/** A person of the dictionary and a state of the dictionary. */
interface Person {
  name: string;
  role: string;
}

interface Status {
  status: string;
  label: string;
}

/** Reading page, assembled with the blocks from `src/shared/docs/page.ts`. */
export const Documentation: Story = {
  name: 'Documentation',
  render: (_args, context: GlobalsContext) => {
    const d = translations(localeOf(context)).selectDocs;
    const pair = ([term, rule]: [string, string]) => [term, rule] as const;
    const captions = { light: d.lightCaption, dark: d.darkCaption };
    const departments: Choice[] = d.departments.map((label: string, index: number) => ({ value: `d${index + 1}`, label }));
    const people: Choice[] = d.people.map((person: Person, index: number) => ({
      value: `p${index + 1}`,
      label: person.name,
      secondary: person.role,
      src: index < d.people.length - 1 ? PHOTOS[index % PHOTOS.length] : '',
    }));
    const options = (): TemplateResult[] => departments.map((choice) => html`<nph-option value=${choice.value}>${choice.label}</nph-option>`);
    const piece = (attributes: { size?: string; value?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-select
        size=${attributes.size ?? 'default'}
        label=${d.departmentLabel}
        placeholder=${d.placeholder}
        value=${attributes.value ? 'd2' : ''}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
        >${options()}</nph-select
      >`;
    const located = (value: string): TemplateResult =>
      html`<nph-select start="icon" label=${d.locationLabel} placeholder=${d.placeholder} value=${value}>
        ${d.locations.map(
          (label: string, index: number) => html`<nph-option value=${`l${index + 1}`} start="icon" icon=${['house', 'suitcase', 'globe'][index % 3]}>${label}</nph-option>`,
        )}
      </nph-select>`;
    const person = (value: string): TemplateResult =>
      html`<nph-select start="avatar" label=${d.ownerLabel} placeholder=${d.placeholder} value=${value}>
        ${people.map((choice) => html`<nph-option value=${choice.value} start="avatar" src=${choice.src ?? ''}>${choice.label}</nph-option>`)}
      </nph-select>`;
    const first = people[0] as Choice;

    return html`
      <main style=${body}>
        ${header('nph-select', d.summary)}
        ${matrix(
          d.matrixLabel,
          ['size: default', 'size: large'],
          [
            { label: 'placeholder', cells: [piece({}), piece({ size: 'large' })] },
            { label: 'value', cells: [piece({ value: true }), piece({ size: 'large', value: true })] },
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
          { id: SECTIONS.option, title: d.optionTitle },
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
          html`${table(d.apiHeader, d.api.map(pair))} ${note('warning', d.invalidTitle, d.invalidText)} ${source(d.sourceLabel, d.sourceApi)}`,
        )}

        ${section(
          SECTIONS.usage,
          d.usageTitle,
          html`${usage(d.usageHeader, d.usageMarkup, d.usageTag, ['nph-select', 'nph-option'], d.usageImport)}
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
                ${piece({})} ${piece({ value: true })} ${piece({ invalid: true })} ${piece({ value: true, disabled: true })}
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
            ${demo(html`<div style=${column}>${located('')} ${located('l1')} ${person('')} ${person('p1')}</div>`, d.startCaption)}
            ${source(d.sourceLabel, d.sourceDecisions)}
          `,
        )}

        ${section(
          SECTIONS.option,
          d.optionTitle,
          html`
            ${text(d.optionText)}
            ${demo(
              html`<div style=${listSurface}>
                <nph-option>${d.departments[0]}</nph-option>
                <nph-option start="icon" icon="house" .active=${true}>${d.locations[0]}</nph-option>
                <nph-option start="avatar" src=${first.src ?? ''} secondary=${first.secondary ?? ''} .selected=${true}>${first.label}</nph-option>
                ${d.statuses.map((status: Status) => html`<nph-option start="dot" status=${status.status}>${status.label}</nph-option>`)}
                <nph-option disabled>${d.departments[1]}</nph-option>
              </div>`,
              d.optionCaption,
            )}
            ${table(d.optionApiHeader, d.optionApi.map(pair))}
            ${table(d.optionStatesHeader, d.optionStates.map(pair))}
            ${source(d.sourceLabel, d.sourceOption)}
          `,
        )}

        ${section(
          SECTIONS.list,
          d.listTitle,
          html`
            ${text(d.listText)}
            ${demo(
              html`<div style=${room}><nph-select label=${d.departmentLabel} value="d3" open>${options()}</nph-select></div>`,
              d.listCaption,
            )}
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
              bothModes(captions, () => department({ label: d.departmentLabel, help: d.departmentHelp, placeholder: d.placeholder, options: departments })),
              d.exampleDepartment,
            )}
            ${demo(
              bothModes(captions, () => owner({ label: d.ownerLabel, placeholder: d.placeholder, options: people, value: 'p1', open: true }), true),
              d.exampleOwner,
            )}
            ${demo(
              bothModes(captions, () =>
                requiredWithNoChoice({ label: d.departmentLabel, placeholder: d.placeholder, error: d.errorMessage, options: departments }),
              ),
              d.exampleRequired,
            )}
            ${source(d.sourceLabel, d.sourceFrame)}
          `,
        )}

        ${section(SECTIONS.references, d.referencesTitle, list(d.references))}
      </main>
    `;
  },
};
