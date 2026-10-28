/**
 * VALIDATION stories of `nph-combobox` and of its list.
 *
 * They prove the contract accepted in Figma (board `1359:142`, set `1359:115`, list
 * `1359:141`, option `1357:136`), the pending decisions D-1 to D-5 in their default and
 * P95: the `size` × `state` matrix of the set, with the placeholder, a value and the clear
 * button; the start of the field (`lupa`, `ícone`, `avatar`); the seven states of the list
 * and its shortcuts footer; the form association and the events (P80, P83); the invalid
 * input; and the three required examples of the board — "Chosen option, at rest", "Search
 * with the typed stretch highlighted" and "Search waiting for the answer". Every story shows
 * the same pieces in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover, `foco` and `foco-limpar` are interaction states: they show up by moving the mouse
 * over a field and pressing Tab to it and to its clear button; the component test measures
 * them, and the keyboard. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The example text and the captions come from the language
 * dictionary, under the key `comboboxValidation` (`docs/i18n.md`, "Storybook"); the row and
 * column names of the matrices are the technical attributes, the same in any language.
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
import { PHOTO_A, PHOTO_B, PHOTO_C } from '../nph-avatar/nph-avatar.demo';
import '../nph-button/nph-button';
import '../nph-kbd/nph-kbd';
import './nph-combobox';
import type { NphCombobox, NphComboboxEntry } from './nph-combobox';
import { chosen, entriesOf, inScheme, search, waiting } from './nph-combobox.demo';
import type { Scheme } from './nph-combobox.demo';

const meta: Meta = {
  title: 'Components/nph-combobox/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).comboboxValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const tight = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

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

const page = (storyId: string) => ({
  piece: 'nph-combobox',
  storyId: `components-nph-combobox-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-combobox', page(storyId).storyId);
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

/** The people of the dictionary, each with a photo but the last, which shows the empty avatar. */
function people(context: GlobalsContext | undefined): NphComboboxEntry[] {
  const list = t(context).people;
  return list.map((person: Person, index: number) => ({
    value: `p${index + 1}`,
    text: person.name,
    secondary: person.role,
    start: 'avatar' as const,
    src: index < list.length - 1 ? PHOTOS[index % PHOTOS.length] : '',
  }));
}

function statuses(context: GlobalsContext | undefined): NphComboboxEntry[] {
  return t(context).statuses.map((status: Status, index: number) => ({
    value: `s${index + 1}`,
    text: status.label,
    start: 'dot' as const,
    status: status.status as 'success',
  }));
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

const SIZE_COLUMNS = ['size: default', 'size: large'];

/** `size` × `state`: placeholder, value, value with the clear button, error, disabled and both. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const cell = (size: string, state: { value?: boolean; clearable?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-combobox
        size=${size}
        label=${v.countryLabel}
        placeholder=${v.placeholder}
        value=${state.value ? 'c2' : ''}
        ?clearable=${state.clearable ?? false}
        clear-label=${v.clearLabel}
        ?invalid=${state.invalid ?? false}
        ?disabled=${state.disabled ?? false}
        .options=${countries(context)}
      ></nph-combobox>`;
    const rows: Array<[string, { value?: boolean; clearable?: boolean; invalid?: boolean; disabled?: boolean }]> = [
      ['placeholder', {}],
      ['value', { value: true }],
      ['value · clearable', { value: true, clearable: true }],
      ['invalid', { invalid: true }],
      ['disabled', { value: true, disabled: true }],
      ['disabled · invalid', { value: true, disabled: true, invalid: true }],
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

/** The start of the field: the magnifying glass, an icon and an avatar, before a choice and with the start of the chosen option. */
export const Start: Story = {
  name: 'Start',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const icons = ['house', 'suitcase', 'globe'];
    const locations: NphComboboxEntry[] = v.locations.map((text: string, index: number) => ({
      value: `l${index + 1}`,
      text,
      start: 'icon' as const,
      icon: icons[index % icons.length] as string,
    }));
    const piece = (start: string, label: string, options: NphComboboxEntry[], value: string): TemplateResult =>
      html`<nph-combobox start=${start} label=${label} placeholder=${v.placeholder} value=${value} .options=${options}></nph-combobox>`;
    return validationPage(
      context,
      page('start'),
      inBothModes(context, 'start', (label) =>
        matrix(label, ['placeholder', 'value'], [
          { label: 'start: search', cells: [piece('search', v.countryLabel, countries(context), ''), piece('search', v.countryLabel, countries(context), 'c1')] },
          { label: 'start: icon', cells: [piece('icon', v.locationLabel, locations, ''), piece('icon', v.locationLabel, locations, 'l1')] },
          { label: 'start: avatar', cells: [piece('avatar', v.ownerLabel, people(context), ''), piece('avatar', v.ownerLabel, people(context), 'p1')] },
        ]),
      ),
    );
  },
};

/** The seven states of the list, open, and the shortcuts footer. */
export const ListStates: Story = {
  name: 'List states',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const open = (attributes: { options: NphComboboxEntry[]; query?: string; label?: string; value?: string; extra?: TemplateResult }) =>
      html`<nph-combobox
        label=${attributes.label ?? v.countryLabel}
        placeholder=${v.placeholder}
        value=${attributes.value ?? ''}
        loading-label=${v.loadingLabel}
        create-label=${v.createLabel}
        empty-heading=${v.emptyHeading}
        empty-description=${v.emptyDescription}
        .options=${attributes.options}
        .query=${attributes.query ?? ''}
        open
        >${attributes.extra ?? ''}</nph-combobox
      >`;
    const states: Array<[string, () => TemplateResult]> = [
      ['results', () => open({ options: countries(context), value: 'c3' })],
      ['search', () => open({ options: countries(context), query: v.searchQuery })],
      ['status', () => open({ options: statuses(context), label: v.statusLabel })],
      ['groups', () => open({ options: regions(context) })],
      [
        'loading',
        () => html`<nph-combobox label=${v.countryLabel} filter="none" loading loading-label=${v.loadingLabel} .options=${[]} .query=${v.searchQuery} open></nph-combobox>`,
      ],
      [
        'create',
        () =>
          html`<nph-combobox label=${v.countryLabel} creatable create-label=${v.createLabel} .options=${countries(context)} .query=${v.createQuery} open></nph-combobox>`,
      ],
      ['empty', () => open({ options: countries(context), query: v.emptyQuery })],
      [
        'shortcuts',
        () =>
          open({
            options: countries(context),
            extra: html`<span slot="shortcuts" style=${row}>
              <span style=${row}><nph-kbd text="↑"></nph-kbd><nph-kbd text="↓"></nph-kbd>${v.shortcutMove}</span>
              <span style=${row}><nph-kbd text="Enter"></nph-kbd>${v.shortcutChoose}</span>
              <span style=${row}><nph-kbd text="Esc"></nph-kbd>${v.shortcutClose}</span>
            </span>`,
          }),
      ],
    ];
    return validationPage(
      context,
      page('list-states'),
      html`<div style=${stack}>${states.map(([name, draw]) => inBothModes(context, 'list-states', () => draw(), `list: ${name}`, true))}</div>`,
    );
  },
};

/** The status text under a combobox: it is replaced by the listeners, and re-rendered only when the language changes. */
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
    const combobox = target.querySelector('nph-combobox') as NphCombobox;
    const events = target.querySelector('output[data-events]');
    if (events) {
      events.textContent = format(v.statusEvent, { event: event.type, value: combobox.value });
    }
  };
  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    show(target, format(v.statusSubmitted, { data: JSON.stringify(Object.fromEntries(new FormData(target))) }));
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
      ${chosen({ label: v.countryLabel, help: v.countryHelp, placeholder: v.placeholder, clearLabel: v.clearLabel, options: countries(context), value: 'c2' })}
    </fieldset>
    <div style=${row}>
      <nph-button text=${v.submitText} @click=${submit}></nph-button>
      <nph-button text=${v.resetText} emphasis="outline" severity="secondary" @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
    <output data-events aria-live="polite" style=${statusStyle} .textContent=${v.statusNoEvent}></output>
  </form>`;
}

/** The host takes part in the form: submit sends `name=value`, reset restores the value attribute, a choice fires input and change. */
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

/** Invalid input draws nothing: a size, a start and a filter that do not exist, and an icon outside the core. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const options = countries(context);
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, [], [
          { label: 'size: small', cells: [html`<nph-combobox size="small" label=${v.countryLabel} .options=${options}></nph-combobox>`] },
          { label: 'start: none', cells: [html`<nph-combobox start="none" label=${v.countryLabel} .options=${options}></nph-combobox>`] },
          { label: 'icon: not-an-icon', cells: [html`<nph-combobox start="icon" icon="not-an-icon" label=${v.countryLabel} .options=${options}></nph-combobox>`] },
          { label: 'filter: startsWith', cells: [html`<nph-combobox filter="startsWith" label=${v.countryLabel} .options=${options}></nph-combobox>`] },
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
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(
          context,
          'examples',
          () => chosen({ label: v.countryLabel, help: v.countryHelp, placeholder: v.placeholder, clearLabel: v.clearLabel, options: countries(context), value: 'c2' }),
          v.exampleChosen,
        )}
        ${inBothModes(
          context,
          'examples',
          () => search({ label: v.countryLabel, placeholder: v.placeholder, clearLabel: v.clearLabel, options: countries(context), query: v.searchQuery }),
          v.exampleSearch,
          true,
        )}
        ${inBothModes(
          context,
          'examples',
          () => waiting({ label: v.countryLabel, placeholder: v.placeholder, query: v.searchQuery, loadingLabel: v.loadingLabel }),
          v.exampleLoading,
          true,
        )}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the focus border and halo of the field follow the brand on Tab. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-combobox', page('brands').storyId),
        () => html`<nph-combobox
          label=${v.countryLabel}
          placeholder=${v.placeholder}
          value="c3"
          clearable
          clear-label=${v.clearLabel}
          .options=${countries(context)}
        ></nph-combobox>`,
      ),
    );
  },
};
