/**
 * VALIDATION stories of `nph-multi-combobox` and of its chip.
 *
 * They prove the contract accepted in Figma (board `1467:25660`, set `1467:25652`, chip
 * `1467:24879`, the `nph-combobox` list `1359:141`, option `1357:136`), D1 to D3, the pending
 * decisions D-1 to D-4 in their default and P96: the `size` × `state` matrix of the set,
 * with the placeholder, the chips, several lines and the counter; the chip with its start
 * icon and a long label; the counter; the list with checkboxes, groups and the empty state;
 * the form association and the events (P80, P83); the invalid input; and the three required
 * examples of the board — "Two options chosen, at rest", "In focus, with typed text and the
 * list open" and "Many options". Every story shows the same pieces in light and in dark
 * mode, in the same story, through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover, `foco` and `foco-remover` are interaction states: they show up by moving the mouse
 * over a field and pressing Tab to its remove buttons and to its text; the component test
 * measures them, and the keyboard. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The example text and the captions come from the language
 * dictionary, under the key `multiComboboxValidation` (`docs/i18n.md`, "Storybook"); the row
 * and column names of the matrices are the technical attributes, the same in any language.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame with `data-nph-brand` and
 * `data-nph-color-scheme` on the same element (DSA-36).
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { brandFrames } from '../../shared/docs/brands';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import type { NphComboboxEntry } from '../nph-combobox/nph-combobox';
import './nph-multi-combobox';
import type { NphMultiCombobox } from './nph-multi-combobox';
import { entriesOf, firstValues, inScheme, many, resting, typing } from './nph-multi-combobox.demo';
import type { Scheme } from './nph-multi-combobox.demo';

const meta: Meta = {
  title: 'Components/nph-multi-combobox/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).multiComboboxValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const tight = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

/** A region of the dictionary. */
interface Region {
  name: string;
  countries: string[];
}

/** A kind of tag of the dictionary, with its icon. */
interface Kind {
  text: string;
  icon: string;
}

const page = (storyId: string) => ({
  piece: 'nph-multi-combobox',
  storyId: `components-nph-multi-combobox-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string, room = false): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-multi-combobox', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`), room);
    })}
  </div>`;
}

function countries(context: GlobalsContext | undefined): NphComboboxEntry[] {
  return entriesOf(t(context).countries, 'c');
}

/** The regions of the dictionary: a label per region and a separator between them. */
function regions(context: GlobalsContext | undefined): NphComboboxEntry[] {
  const entries: NphComboboxEntry[] = [];
  t(context).regions.forEach((region: Region, position: number) => {
    if (position > 0) {
      entries.push({ type: 'separator' });
    }
    entries.push({ type: 'label', text: region.name });
    region.countries.forEach((text, index) => entries.push({ value: `r${position + 1}-${index + 1}`, text }));
  });
  return entries;
}

/** Tags of different kinds: each kind with its icon, the last with none, so its chip shows `tag` (D-3). */
function kinds(context: GlobalsContext | undefined): NphComboboxEntry[] {
  return t(context).kinds.map((kind: Kind, index: number) =>
    kind.icon === '' ? { value: `k${index + 1}`, text: kind.text } : { value: `k${index + 1}`, text: kind.text, start: 'icon' as const, icon: kind.icon },
  );
}

const SIZE_COLUMNS = ['size: default', 'size: large'];

interface Cell {
  values?: number;
  counter?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

/** `size` × `state`: placeholder, chips, several lines, counter, error, disabled and both. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const cell = (size: string, state: Cell): TemplateResult =>
      html`<nph-multi-combobox
        size=${size}
        label=${v.countriesLabel}
        placeholder=${v.placeholder}
        remove-label=${v.removeLabel}
        subject=${v.subject}
        ?counter=${state.counter ?? false}
        ?invalid=${state.invalid ?? false}
        ?disabled=${state.disabled ?? false}
        .options=${countries(context)}
        .defaultValue=${firstValues('c', state.values ?? 0)}
      ></nph-multi-combobox>`;
    const rows: Array<[string, Cell]> = [
      ['placeholder', {}],
      ['items', { values: 2 }],
      ['several lines', { values: 7 }],
      ['counter', { values: 7, counter: true }],
      ['invalid', { values: 2, invalid: true }],
      ['disabled', { values: 2, disabled: true }],
      ['disabled · invalid', { values: 2, disabled: true, invalid: true }],
    ];
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(
          label,
          SIZE_COLUMNS,
          rows.map(([name, state]) => ({ label: name, cells: [cell('default', state), cell('large', state)] })),
        ),
      ),
    );
  },
};

/** The chip: the pill, the start icon of each kind and `tag` for an option with none, and a long label with an ellipsis. */
export const Chip: Story = {
  name: 'Chip',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const tags = kinds(context);
    const long: NphComboboxEntry[] = [{ value: 'l1', text: v.longCountry }, ...countries(context)];
    const piece = (attributes: { chipIcon?: boolean; options: NphComboboxEntry[]; value: string[]; label: string; disabled?: boolean }): TemplateResult =>
      html`<nph-multi-combobox
        label=${attributes.label}
        remove-label=${v.removeLabel}
        ?chip-icon=${attributes.chipIcon ?? false}
        ?disabled=${attributes.disabled ?? false}
        .options=${attributes.options}
        .defaultValue=${attributes.value}
      ></nph-multi-combobox>`;
    return validationPage(
      context,
      page('chip'),
      inBothModes(context, 'chip', (label) =>
        matrix(label, [], [
          { label: 'default', cells: [piece({ label: v.tagsLabel, options: tags, value: firstValues('k', tags.length) })] },
          { label: 'chip-icon', cells: [piece({ label: v.tagsLabel, chipIcon: true, options: tags, value: firstValues('k', tags.length) })] },
          { label: 'chip-icon · disabled', cells: [piece({ label: v.tagsLabel, chipIcon: true, disabled: true, options: tags, value: firstValues('k', tags.length) })] },
          { label: 'long label (D3)', cells: [piece({ label: v.countriesLabel, options: long, value: ['l1', 'c1'] })] },
        ]),
      ),
    );
  },
};

/** The list: options with checkboxes, the typed stretch highlighted, groups and the empty state. */
export const ListStates: Story = {
  name: 'List states',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const open = (options: NphComboboxEntry[], value: string[], query = ''): TemplateResult =>
      html`<nph-multi-combobox
        label=${v.countriesLabel}
        placeholder=${v.placeholder}
        remove-label=${v.removeLabel}
        empty-heading=${v.emptyHeading}
        empty-description=${v.emptyDescription}
        .options=${options}
        .defaultValue=${value}
        .query=${query}
        open
      ></nph-multi-combobox>`;
    const states: Array<[string, () => TemplateResult]> = [
      ['results', () => open(countries(context), ['c2', 'c4'])],
      ['search', () => open(countries(context), ['c2'], v.searchQuery)],
      ['groups', () => open(regions(context), ['r1-1'])],
      ['empty', () => open(countries(context), [], v.emptyQuery)],
    ];
    return validationPage(
      context,
      page('list-states'),
      html`<div style=${stack}>${states.map(([name, draw]) => inBothModes(context, 'list-states', () => draw(), `list: ${name}`, true))}</div>`,
    );
  },
};

/** The status text under a field: it is replaced by the listeners, and re-rendered only when the language changes. */
function form(context: GlobalsContext | undefined, disabled: boolean): TemplateResult {
  const v = t(context);
  const show = (target: HTMLFormElement, text: string): void => {
    const status = target.querySelector('output');
    if (status) {
      status.textContent = text;
    }
  };
  const report = (event: Event): void => {
    const target = event.currentTarget as HTMLFormElement;
    const field = target.querySelector('nph-multi-combobox') as NphMultiCombobox;
    const events = target.querySelector('output[data-events]');
    if (events) {
      events.textContent = format(v.statusEvent, { event: event.type, value: field.value.join(', ') });
    }
  };
  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const data = new FormData(target);
    show(target, format(v.statusSubmitted, { data: JSON.stringify({ countries: data.getAll('countries') }) }));
  };
  const submit = (event: Event): void => {
    const target = (event.currentTarget as HTMLElement).closest('form');
    if (target && target.reportValidity()) {
      target.requestSubmit();
    }
  };
  const reset = (event: Event): void => {
    const target = (event.currentTarget as HTMLElement).closest('form');
    target?.reset();
    if (target) {
      show(target, v.statusReset);
    }
  };
  return html`<form style=${tight} novalidate @submit=${onSubmit} @input=${report} @change=${report}>
    <fieldset ?disabled=${disabled} style="margin: 0; padding: 0; border: 0; ${tight}">
      ${resting({ label: v.countriesLabel, help: v.countriesHelp, placeholder: v.placeholder, removeLabel: v.removeLabel, options: countries(context), value: ['c2', 'c4'] })}
    </fieldset>
    <div style=${row}>
      <nph-button text=${v.submitText} @click=${submit}></nph-button>
      <nph-button text=${v.resetText} emphasis="outline" severity="secondary" @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
    <output data-events aria-live="polite" style=${statusStyle} .textContent=${v.statusNoEvent}></output>
  </form>`;
}

/** The host takes part in the form: submit sends one entry per chosen option, reset restores the default values, a change fires input and change. */
export const FormAssociation: Story = {
  name: 'Form association',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('form-association'),
      html`<div style=${stack}>
        ${inBothModes(context, 'form-association', () => form(context, false))}
        ${inBothModes(context, 'form-association', () => form(context, true), v.fieldsetDisabled)}
      </div>`,
    );
  },
};

/** Invalid input: a size that does not exist draws nothing; chips without remove-label and a counter without subject draw with one error each. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const options = countries(context);
    const value = ['c1', 'c2'];
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, [], [
          { label: 'size: small', cells: [html`<nph-multi-combobox size="small" label=${v.countriesLabel} remove-label=${v.removeLabel} .options=${options} .defaultValue=${value}></nph-multi-combobox>`] },
          { label: 'remove-label: —', cells: [html`<nph-multi-combobox label=${v.countriesLabel} .options=${options} .defaultValue=${value}></nph-multi-combobox>`] },
          { label: 'counter · subject: —', cells: [html`<nph-multi-combobox counter label=${v.countriesLabel} remove-label=${v.removeLabel} .options=${options} .defaultValue=${value}></nph-multi-combobox>`] },
        ]),
      ),
    );
  },
};

/** The three required examples of the accepted board, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = { label: v.countriesLabel, help: v.countriesHelp, placeholder: v.placeholder, removeLabel: v.removeLabel, options: countries(context) };
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(context, 'examples', () => resting({ ...text, value: ['c2', 'c4'] }), v.exampleResting)}
        ${inBothModes(context, 'examples', () => typing({ ...text, value: ['c2'], query: v.searchQuery }), v.exampleTyping, true)}
        ${inBothModes(context, 'examples', () => many({ ...text, value: firstValues('c', 9) }), v.exampleMany)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the chips take the primary surface of the brand, and the focus border and halo follow it on Tab. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-multi-combobox', page('brands').storyId),
        () => html`<nph-multi-combobox
          label=${v.countriesLabel}
          placeholder=${v.placeholder}
          remove-label=${v.removeLabel}
          subject=${v.subject}
          .options=${countries(context)}
          .defaultValue=${firstValues('c', 2)}
        ></nph-multi-combobox>`,
      ),
    );
  },
};
