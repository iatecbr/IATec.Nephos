/**
 * VALIDATION stories of `nph-input`.
 *
 * They prove the contract accepted in Figma (frame `1195:532`, set `622:18359`), D1 to
 * D7 and P80: the `size` × `state` matrix of the set, with the placeholder and a value;
 * the five types of D1; the start and end icons; the clear button and its events; the
 * form association (label, name, required, submit, reset and a disabled fieldset);
 * the precedence of error and disabled (D5); the width (D6); the invalid input; and the
 * three required examples of the frame — "Search", "Field with a label" and "Error".
 * Every story shows the same pieces in light and in dark mode, in the same story,
 * through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover, `foco` and `foco-limpar` are interaction states: they show up by moving the
 * mouse over a field, clicking it and pressing Tab to the clear button, as in
 * `nph-button`; the component test measures all three. Each page opens with what it
 * proves, from the dictionary (`validationPages.claims`). The example text and the
 * captions come from the language dictionary, under the key `inputValidation`
 * (`docs/i18n.md`, "Storybook"); the row and column names of the matrices are the
 * technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import '../nph-label/nph-label';
import './nph-input';
import type { NphInput } from './nph-input';
import { fieldWithLabel, inScheme, search, withError } from './nph-input.demo';
import type { Scheme } from './nph-input.demo';

const meta: Meta = {
  title: 'Components/nph-input/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).inputValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const tight = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-input',
  storyId: `components-nph-input-validation--${storyId}`,
});

/** What a story draws in one mode; the caption names the mode and, when given, the example. */
type ModeContent = (title: string) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, name?: string): TemplateResult {
  const v = t(context);
  const modes: Array<[Scheme, string]> = [
    ['light', v.lightCaption],
    ['dark', v.darkCaption],
  ];
  const title = validationTitle(context, 'nph-input', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

const SIZES = ['compact', 'default', 'large'];
const SIZE_COLUMNS = SIZES.map((size) => `size: ${size}`);

/**
 * `size` × `state`: placeholder and value, the clear button, error, disabled and both. Move the
 * mouse for hover, click for focus, press Tab to the clear button for `foco-limpar`.
 */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    type State = { value?: boolean; clear?: boolean; invalid?: boolean; disabled?: boolean };
    const cell = (size: string, state: State): TemplateResult =>
      html`<nph-input
        size=${size}
        label=${v.emailLabel}
        placeholder=${v.emailPlaceholder}
        value=${state.value ? v.emailValue : ''}
        icon-end=${state.clear ? 'xmark' : 'none'}
        clear-label=${state.clear ? v.clearLabel : ''}
        ?invalid=${state.invalid ?? false}
        ?disabled=${state.disabled ?? false}
      ></nph-input>`;
    const rows: Array<[string, State]> = [
      ['placeholder', {}],
      ['value', { value: true }],
      ['value · icon-end: xmark', { value: true, clear: true }],
      ['invalid', { value: true, invalid: true }],
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
          rows.map(([name, state]) => ({ label: name, cells: SIZES.map((size) => cell(size, state)) })),
        ),
      ),
    );
  },
};

/** The five types of D1, each with a value it accepts; password, number and mask are out of v1. */
export const Types: Story = {
  name: 'Types',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const types: Array<[string, string, string]> = [
      ['text', v.nameLabel, v.nameValue],
      ['email', v.emailLabel, v.emailValue],
      ['tel', v.phoneLabel, v.phoneValue],
      ['url', v.siteLabel, v.siteValue],
      ['search', v.searchLabel, v.searchValue],
    ];
    return validationPage(
      context,
      page('types'),
      inBothModes(context, 'types', (label) =>
        matrix(
          label,
          [],
          types.map(([type, name, value]) => ({
            label: `type: ${type}`,
            cells: [html`<nph-input type=${type} label=${name} value=${value}></nph-input>`],
          })),
        ),
      ),
    );
  },
};

/** Start and end icons, light, at `icon/size-sm`: none, start, end and both; the end one only swaps the art. */
export const Icons: Story = {
  name: 'Icons',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const rows: Array<[string, string]> = [
      ['none', 'none'],
      ['magnifying-glass', 'none'],
      ['none', 'xmark'],
      ['magnifying-glass', 'xmark'],
      ['magnifying-glass', 'circle-xmark'],
    ];
    return validationPage(
      context,
      page('icons'),
      inBothModes(context, 'icons', (label) =>
        matrix(
          label,
          [],
          rows.map(([start, end]) => ({
            label: `icon-start: ${start} · icon-end: ${end}`,
            cells: [
              html`<nph-input
                type="search"
                label=${v.searchLabel}
                value=${v.searchValue}
                icon-start=${start}
                icon-end=${end}
                clear-label=${v.clearLabel}
              ></nph-input>`,
            ],
          })),
        ),
      ),
    );
  },
};

/** The status text under a field: it is replaced by the listeners, and re-rendered only when the language changes. */
function clearable(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const report = (event: Event): void => {
    const host = event.currentTarget as HTMLElement;
    const input = host.querySelector('nph-input') as NphInput;
    const status = host.querySelector('output');
    if (status) {
      status.textContent = format(v.statusEvent, { event: event.type, value: input.value });
    }
  };
  return html`<div style=${tight} @input=${report} @change=${report}>
    ${search({ label: v.searchLabel, placeholder: v.searchPlaceholder, clearLabel: v.clearLabel, value: v.searchValue })}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** The clear button shows with a value; a click, Enter or Space empties it, brings the focus back and fires input and change. */
export const Clear: Story = {
  name: 'Clear',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('clear'), inBothModes(context, 'clear', () => clearable(context))),
};

/** A form with a label, `name`, `required`, submit and reset; the form data shows below. */
function form(context: GlobalsContext | undefined, disabled: boolean): TemplateResult {
  const v = t(context);
  const show = (target: HTMLFormElement, text: string): void => {
    const status = target.querySelector('output');
    if (status) {
      status.textContent = text;
    }
  };
  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const data = new FormData(target);
    show(target, format(v.statusSubmitted, { data: JSON.stringify(Object.fromEntries(data)) }));
  };
  const submit = (event: Event): void => {
    (event.currentTarget as HTMLElement).closest('form')?.requestSubmit();
  };
  const reset = (event: Event): void => {
    const target = (event.currentTarget as HTMLElement).closest('form');
    target?.reset();
    if (target) {
      show(target, v.statusReset);
    }
  };
  return html`<form style=${tight} @submit=${onSubmit}>
    <fieldset ?disabled=${disabled} style="margin: 0; padding: 0; border: 0; ${tight}">
      ${fieldWithLabel({ label: v.emailLabel, placeholder: v.emailPlaceholder, required: true, value: v.emailValue, name: 'email' })}
    </fieldset>
    <div style=${row}>
      <nph-button text=${v.submitText} @click=${submit}></nph-button>
      <nph-button text=${v.resetText} emphasis="outline" severity="secondary" @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </form>`;
}

/** The host is labelable and takes part in the form: the label focuses it, submit sends `name=value`, reset restores the value attribute. */
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

/** The precedence of D5: error keeps its border on hover and focus; disabled wins over error. */
export const ErrorAndDisabled: Story = {
  name: 'Error and disabled',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const piece = (attributes: { invalid?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-input
        label=${v.emailLabel}
        value=${v.emailValue}
        icon-end="xmark"
        clear-label=${v.clearLabel}
        ?invalid=${attributes.invalid ?? false}
        ?disabled=${attributes.disabled ?? false}
      ></nph-input>`;
    return validationPage(
      context,
      page('error-and-disabled'),
      inBothModes(context, 'error-and-disabled', (label) =>
        matrix(label, [], [
          { label: 'invalid', cells: [piece({ invalid: true })] },
          { label: 'disabled', cells: [piece({ disabled: true })] },
          { label: 'disabled · invalid', cells: [piece({ disabled: true, invalid: true })] },
        ]),
      ),
    );
  },
};

/** The width: `layout/input-width` by default; it stretches to the parent, with no minimum (D6). */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const piece = (style = ''): TemplateResult =>
      html`<nph-input label=${v.nameLabel} value=${v.nameValue} style=${style}></nph-input>`;
    return validationPage(
      context,
      page('width'),
      inBothModes(context, 'width', (label) =>
        matrix(label, [], [
          { label: 'layout/input-width', cells: [piece()] },
          {
            label: 'inline-size: 100%',
            cells: [html`<div style="inline-size: var(--nph-layout-field-width);">${piece('inline-size: 100%;')}</div>`],
          },
        ]),
      ),
    );
  },
};

/** Invalid input draws nothing: a type out of v1, a size that does not exist and an icon outside the core. */
export const InvalidInput: Story = {
  name: 'Invalid input',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('invalid-input'),
      inBothModes(context, 'invalid-input', (label) =>
        matrix(label, [], [
          { label: 'type: password', cells: [html`<nph-input type="password" label=${v.nameLabel}></nph-input>`] },
          { label: 'size: small', cells: [html`<nph-input size="small" label=${v.nameLabel}></nph-input>`] },
          { label: 'icon-start: not-an-icon', cells: [html`<nph-input icon-start="not-an-icon" label=${v.nameLabel}></nph-input>`] },
          {
            label: 'icon-end · no clear-label',
            cells: [html`<nph-input icon-end="xmark" label=${v.searchLabel} value=${v.searchValue}></nph-input>`],
          },
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
          () => search({ label: v.searchLabel, placeholder: v.searchPlaceholder, clearLabel: v.clearLabel, value: v.searchValue }),
          v.exampleSearch,
        )}
        ${inBothModes(
          context,
          'examples',
          () => fieldWithLabel({ label: v.emailLabel, placeholder: v.emailPlaceholder, required: true }),
          v.exampleLabel,
        )}
        ${inBothModes(
          context,
          'examples',
          () => withError({ label: v.emailLabel, placeholder: v.emailPlaceholder, required: true, value: v.emailWrong, sentence: v.errorSentence }),
          v.exampleError,
        )}
      </div>`,
    );
  },
};
