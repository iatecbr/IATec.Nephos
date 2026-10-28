/**
 * VALIDATION stories of `nph-select` and of its option, `nph-option`.
 *
 * They prove the contract accepted in Figma (frame `1357:160`, set `1357:115`, option
 * `1357:136`, list `1357:137`), D1 to D9 and P91: the `size` × `state` matrix of the
 * set, with the placeholder and a value; the start of the trigger (D4); the option in
 * its four starts, its states and the dot in every state (D5, D6); the open list
 * (D1, D2); the height of the list (D9); the one-line text (D3); the form association
 * and the events (P80, P83); the invalid input; and the three required examples of
 * the frame — "Department", "Owner" and "Required with no choice". Every story shows
 * the same pieces in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and `foco` are interaction states: they show up by moving the mouse over a
 * trigger and pressing Tab to it; the component test measures both, and the keyboard.
 * The `Option` story draws options outside a list, with `selected` and `active` set
 * by property, only to show their looks side by side: in use, the list sets them.
 * Each page opens with what it proves, from the dictionary (`validationPages.claims`).
 * The example text and the captions come from the language dictionary, under the key
 * `selectValidation` (`docs/i18n.md`, "Storybook"); the row and column names of the
 * matrices are the technical attributes, the same in any language.
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
import '../nph-option/nph-option';
import './nph-select';
import type { NphSelect } from './nph-select';
import { department, inScheme, owner, requiredWithNoChoice } from './nph-select.demo';
import type { Choice, Scheme } from './nph-select.demo';

const meta: Meta = {
  title: 'Components/nph-select/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).selectValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const tight = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';
/* A stand-in of the list surface, so options show their looks outside a select. */
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

const page = (storyId: string) => ({
  piece: 'nph-select',
  storyId: `components-nph-select-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-select', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`), room);
    })}
  </div>`;
}

/** The department options of the dictionary, with technical values. */
function departments(context: GlobalsContext | undefined): Choice[] {
  return t(context).departments.map((label: string, index: number) => ({ value: `d${index + 1}`, label }));
}

/** The people of the dictionary, each with a photo but the last, which shows the empty avatar. */
function people(context: GlobalsContext | undefined): Choice[] {
  const list = t(context).people;
  return list.map((person: Person, index: number) => ({
    value: `p${index + 1}`,
    label: person.name,
    secondary: person.role,
    src: index < list.length - 1 ? PHOTOS[index % PHOTOS.length] : '',
  }));
}

function departmentOptions(context: GlobalsContext | undefined): TemplateResult[] {
  return departments(context).map((choice) => html`<nph-option value=${choice.value}>${choice.label}</nph-option>`);
}

const SIZE_COLUMNS = ['size: default', 'size: large'];

/** `size` × `state`: placeholder and value, error, disabled and both. Move the mouse for hover, press Tab for focus. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const cell = (size: string, state: { value?: boolean; invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-select
        size=${size}
        label=${v.departmentLabel}
        placeholder=${v.placeholder}
        value=${state.value ? 'd2' : ''}
        ?invalid=${state.invalid ?? false}
        ?disabled=${state.disabled ?? false}
        >${departmentOptions(context)}</nph-select
      >`;
    const rows: Array<[string, { value?: boolean; invalid?: boolean; disabled?: boolean }]> = [
      ['placeholder', {}],
      ['value', { value: true }],
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

/** The start of the trigger (D4): none, icon and avatar, before a choice and with the start of the chosen option. */
export const Start: Story = {
  name: 'Start',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const icons = ['house', 'suitcase', 'globe'];
    const locations: Array<{ value: string; label: string; icon: string }> = v.locations.map((label: string, index: number) => ({
      value: `l${index + 1}`,
      label,
      icon: icons[index % icons.length] as string,
    }));
    const located = (value: string): TemplateResult =>
      html`<nph-select start="icon" label=${v.locationLabel} placeholder=${v.placeholder} value=${value}>
        ${locations.map((choice) => html`<nph-option value=${choice.value} start="icon" icon=${choice.icon}>${choice.label}</nph-option>`)}
      </nph-select>`;
    const person = (value: string): TemplateResult =>
      html`<nph-select start="avatar" label=${v.ownerLabel} placeholder=${v.placeholder} value=${value}>
        ${people(context).map(
          (choice) => html`<nph-option value=${choice.value} start="avatar" src=${choice.src ?? ''}>${choice.label}</nph-option>`,
        )}
      </nph-select>`;
    const statusSelect = html`<nph-select label=${v.statusLabel} value="s1">
      ${v.statuses.map((status: Status, index: number) => html`<nph-option value=${`s${index + 1}`} start="dot" status=${status.status}>${status.label}</nph-option>`)}
    </nph-select>`;
    return validationPage(
      context,
      page('start'),
      inBothModes(context, 'start', (label) =>
        matrix(label, ['placeholder', 'value'], [
          { label: 'start: none', cells: [html`<nph-select label=${v.departmentLabel} placeholder=${v.placeholder}>${departmentOptions(context)}</nph-select>`, html`<nph-select label=${v.departmentLabel} value="d1">${departmentOptions(context)}</nph-select>`] },
          { label: 'start: icon', cells: [located(''), located('l1')] },
          { label: 'start: avatar', cells: [person(''), person('p1')] },
          { label: 'option start: dot', cells: [html`<span></span>`, statusSelect] },
        ]),
      ),
    );
  },
};

/** The option: the four starts, secondary text, the states (active is the hover look, selected wins) and the dot in every state. */
export const Option: Story = {
  name: 'Option',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const person = people(context)[0] as Choice;
    const starts = (state: { active?: boolean; selected?: boolean; disabled?: boolean }): TemplateResult =>
      html`<div style=${listSurface}>
        <nph-option .active=${state.active ?? false} .selected=${state.selected ?? false} ?disabled=${state.disabled ?? false}
          >${v.departments[0]}</nph-option
        >
        <nph-option start="icon" icon="house" .active=${state.active ?? false} .selected=${state.selected ?? false} ?disabled=${state.disabled ?? false}
          >${v.locations[0]}</nph-option
        >
        <nph-option
          start="avatar"
          src=${person.src ?? ''}
          secondary=${person.secondary ?? ''}
          .active=${state.active ?? false}
          .selected=${state.selected ?? false}
          ?disabled=${state.disabled ?? false}
          >${person.label}</nph-option
        >
        <nph-option start="dot" status="success" .active=${state.active ?? false} .selected=${state.selected ?? false} ?disabled=${state.disabled ?? false}
          >${v.statuses[0]?.label}</nph-option
        >
      </div>`;
    const dots = html`<div style=${listSurface}>
      ${v.statuses.map((status: Status) => html`<nph-option start="dot" status=${status.status}>${status.label}</nph-option>`)}
      <nph-option start="dot">${v.noStatus}</nph-option>
    </div>`;
    return validationPage(
      context,
      page('option'),
      inBothModes(context, 'option', (label) =>
        matrix(label, [], [
          { label: 'default', cells: [starts({})] },
          { label: 'active', cells: [starts({ active: true })] },
          { label: 'selected', cells: [starts({ selected: true })] },
          { label: 'selected · active', cells: [starts({ selected: true, active: true })] },
          { label: 'disabled', cells: [starts({ disabled: true })] },
          { label: 'disabled · selected', cells: [starts({ disabled: true, selected: true })] },
          { label: 'status', cells: [dots] },
        ]),
      ),
    );
  },
};

/** The open list: `space/inline-tight` below the trigger, with its width, the arrow up and the chosen option with the check. */
export const Open: Story = {
  name: 'Open',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('open'),
      inBothModes(
        context,
        'open',
        () => html`<nph-select label=${v.departmentLabel} value="d3" open>${departmentOptions(context)}</nph-select>`,
        undefined,
        true,
      ),
    );
  },
};

/** The height of the list (D9): 8 whole options of 36 px; with avatars, 7 whole options and 8 px of the 8th; scroll above that. */
export const ListHeight: Story = {
  name: 'List height',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const many = [...v.departments, ...v.moreDepartments];
    const crowd = [...people(context), ...people(context)].map((choice, index) => ({ ...choice, value: `c${index + 1}` }));
    return validationPage(
      context,
      page('list-height'),
      html`<div style=${modesFrame}>
        ${inBothModes(
          context,
          'list-height',
          () => html`<nph-select label=${v.departmentLabel} placeholder=${v.placeholder} open>
            ${many.map((label: string, index: number) => html`<nph-option value=${`m${index + 1}`}>${label}</nph-option>`)}
          </nph-select>`,
          'start: none',
          true,
        )}
        ${inBothModes(
          context,
          'list-height',
          () => html`<nph-select label=${v.ownerLabel} placeholder=${v.placeholder} start="avatar" open>
            ${crowd.map((choice) => html`<nph-option value=${choice.value} start="avatar" src=${choice.src ?? ''}>${choice.label}</nph-option>`)}
          </nph-select>`,
          'start: avatar',
          true,
        )}
      </div>`,
    );
  },
};

/** Trigger value, option label and secondary text stay on one line with an ellipsis (D3). */
export const TextOverflow: Story = {
  name: 'Text overflow',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('text-overflow'),
      inBothModes(
        context,
        'text-overflow',
        () => html`<nph-select label=${v.departmentLabel} value="long" open>
          <nph-option value="long" secondary=${v.longSecondary}>${v.longLabel}</nph-option>
          ${departmentOptions(context)}
        </nph-select>`,
        undefined,
        true,
      ),
    );
  },
};

/** The status text under a select: it is replaced by the listeners, and re-rendered only when the language changes. */
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
    const select = target.querySelector('nph-select') as NphSelect;
    const events = target.querySelector('output[data-events]');
    if (events) {
      events.textContent = format(v.statusEvent, { event: event.type, value: select.value });
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
      ${department({ label: v.departmentLabel, help: v.departmentHelp, placeholder: v.placeholder, options: departments(context), value: 'd2' })}
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

/** Invalid input draws nothing: a size that does not exist, a start that does not exist and an icon outside the core. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, [], [
          { label: 'size: small', cells: [html`<nph-select size="small" label=${v.departmentLabel}>${departmentOptions(context)}</nph-select>`] },
          { label: 'start: dot', cells: [html`<nph-select start="dot" label=${v.departmentLabel}>${departmentOptions(context)}</nph-select>`] },
          { label: 'icon: not-an-icon', cells: [html`<nph-select start="icon" icon="not-an-icon" label=${v.departmentLabel}>${departmentOptions(context)}</nph-select>`] },
        ]),
      ),
    );
  },
};

/** The three required examples of the accepted frame, each in light and dark mode. */
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
          () => department({ label: v.departmentLabel, help: v.departmentHelp, placeholder: v.placeholder, options: departments(context) }),
          v.exampleDepartment,
        )}
        ${inBothModes(
          context,
          'examples',
          () => owner({ label: v.ownerLabel, placeholder: v.placeholder, options: people(context), value: 'p1', open: true }),
          v.exampleOwner,
          true,
        )}
        ${inBothModes(
          context,
          'examples',
          () => requiredWithNoChoice({ label: v.departmentLabel, placeholder: v.placeholder, error: v.errorMessage, options: departments(context) }),
          v.exampleRequired,
        )}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the focus border and halo of the trigger, and the selected option with its check, follow the brand. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-select', page('brands').storyId),
        () => html`<nph-select label=${v.departmentLabel} value="d2">${departmentOptions(context)}</nph-select>
          <div style=${listSurface}>
            <nph-option .selected=${true}>${v.departments[1]}</nph-option>
          </div>`,
      ),
    );
  },
};
