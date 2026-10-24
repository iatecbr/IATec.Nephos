/**
 * VALIDATION stories of `nph-textarea`.
 *
 * They prove the contract accepted in Figma (frame `1632:24`, documentation `1922:642`,
 * set `1632:22`) and P93: the `state` matrix of the set, with the placeholder and a value;
 * the footer with counter and actions, and its absence in `readonly`; the growth between
 * `layout/textarea-min-height` and `layout/textarea-max-height`; the form association
 * (name, required, submit, reset, a disabled fieldset and Enter, which writes a line);
 * the width; the field–control contract inside `nph-field`; and the three required
 * examples of the frame — "Comment", "Description in a form" and "Long text". Every story
 * shows the same pieces in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover, `foco` and `erro-foco` are interaction states: they show up by moving the mouse
 * over a field and clicking it, as in `nph-input`; the component test measures them. Each
 * page opens with what it proves, from the dictionary (`validationPages.claims`). The
 * example text and the captions come from the language dictionary, under the key
 * `textareaValidation` (`docs/i18n.md`, "Storybook"); the row names of the matrices are
 * the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import '../nph-button/nph-button';
import '../nph-field/nph-field';
import './nph-textarea';
import { comment, inForm, inScheme, longText } from './nph-textarea.demo';
import type { CounterText, Scheme } from './nph-textarea.demo';

const meta: Meta = {
  title: 'Components/nph-textarea/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).textareaValidation;
}

/** The counter text in the chosen language: the consumer's job (P93). */
function counterOf(context: GlobalsContext | undefined): CounterText {
  const v = t(context);
  return (length, limit) => format(v.counterText, { length: String(length), limit: String(limit) });
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const tight = 'display: flex; flex-direction: column; align-items: flex-start; gap: var(--nph-space-stack-tight);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

/** The limit of the examples, the one the frame shows (`0/280`). */
const LIMIT = 280;

const page = (storyId: string) => ({
  piece: 'nph-textarea',
  storyId: `components-nph-textarea-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-textarea', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

interface State {
  value?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

/** `state` of the set: placeholder and value, error, read-only, disabled and the precedence. Move the mouse for hover, click for focus. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const cell = (state: State): TemplateResult =>
      html`<nph-textarea
        label=${v.notesLabel}
        placeholder=${v.notesPlaceholder}
        value=${state.value ? v.notesValue : ''}
        ?invalid=${state.invalid ?? false}
        ?readonly=${state.readOnly ?? false}
        ?disabled=${state.disabled ?? false}
      ></nph-textarea>`;
    const rows: Array<[string, State]> = [
      ['placeholder', {}],
      ['value', { value: true }],
      ['invalid', { value: true, invalid: true }],
      ['readonly', { value: true, readOnly: true }],
      ['readonly · invalid', { value: true, readOnly: true, invalid: true }],
      ['disabled', { value: true, disabled: true }],
      ['disabled · invalid', { value: true, disabled: true, invalid: true }],
    ];
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) => matrix(label, [], rows.map(([name, state]) => ({ label: name, cells: [cell(state)] })))),
    );
  },
};

/** The footer: on with a counter or an action, counter at the start and actions at the end; never in readonly; disabled reaches the actions. */
export const Footer: Story = {
  name: 'Footer',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const count = counterOf(context);
    const actions = (): TemplateResult =>
      html`<nph-button slot="actions" emphasis="ghost" text=${v.attachText}></nph-button>
        <nph-button slot="actions" text=${v.sendText}></nph-button>`;
    const piece = (options: { counter?: boolean; actions?: boolean; readOnly?: boolean; disabled?: boolean }): TemplateResult =>
      html`<nph-textarea
        label=${v.commentLabel}
        placeholder=${v.commentPlaceholder}
        value=${v.commentValue}
        counter=${options.counter ? count(v.commentValue.length, LIMIT) : ''}
        ?readonly=${options.readOnly ?? false}
        ?disabled=${options.disabled ?? false}
        >${options.actions ? actions() : ''}</nph-textarea
      >`;
    return validationPage(
      context,
      page('footer'),
      inBothModes(context, 'footer', (label) =>
        matrix(label, [], [
          { label: 'counter', cells: [piece({ counter: true })] },
          { label: 'actions', cells: [piece({ actions: true })] },
          { label: 'counter · actions', cells: [piece({ counter: true, actions: true })] },
          { label: 'disabled', cells: [piece({ counter: true, actions: true, disabled: true })] },
          { label: 'readonly', cells: [piece({ counter: true, actions: true, readOnly: true })] },
        ]),
      ),
    );
  },
};

/** The height: layout/textarea-min-height empty, it grows with the text and stops at layout/textarea-max-height, where the text scrolls inside. */
export const Height: Story = {
  name: 'Height',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('height'),
      inBothModes(context, 'height', (label) =>
        matrix(label, [], [
          { label: 'layout/textarea-min-height', cells: [html`<nph-textarea label=${v.notesLabel} placeholder=${v.notesPlaceholder}></nph-textarea>`] },
          { label: 'value', cells: [html`<nph-textarea label=${v.notesLabel} value=${v.notesValue}></nph-textarea>`] },
          { label: 'layout/textarea-max-height', cells: [longText({ label: v.notesLabel, value: v.longValue })] },
        ]),
      ),
    );
  },
};

/** A form with `name`, `required`, submit and reset; Enter writes a line and does not submit; the form data shows below. */
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
    show(target, format(v.statusSubmitted, { data: JSON.stringify(Object.fromEntries(new FormData(target))) }));
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
      <nph-textarea label=${v.notesLabel} name="notes" required value=${v.notesValue}></nph-textarea>
    </fieldset>
    <div style=${row}>
      <nph-button text=${v.submitText} @click=${submit}></nph-button>
      <nph-button text=${v.resetText} emphasis="outline" severity="secondary" @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </form>`;
}

/** The host takes part in the form: submit sends `name=value` with its line breaks, reset restores the value attribute, a disabled fieldset leaves it out. */
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

/** Inside nph-field: the field gives the label, the help, the error and the support-line counter; the footer stays off. */
export const InField: Story = {
  name: 'In nph-field',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const count = counterOf(context);
    const text = { label: v.descriptionLabel, help: v.descriptionHelp, placeholder: v.descriptionPlaceholder, counter: count, limit: LIMIT };
    return validationPage(
      context,
      page('in-field'),
      inBothModes(context, 'in-field', (label) =>
        matrix(label, [], [
          { label: 'help · counter', cells: [inForm({ ...text, value: v.descriptionValue, required: true })] },
          { label: 'error · counter', cells: [inForm({ ...text, value: v.descriptionValue, error: v.descriptionError })] },
        ]),
      ),
    );
  },
};

/** The width: `layout/input-width` by default; it stretches to the parent, with no minimum. */
export const Width: Story = {
  name: 'Width',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const piece = (style = ''): TemplateResult => html`<nph-textarea label=${v.notesLabel} value=${v.notesValue} style=${style}></nph-textarea>`;
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

/** The three required examples of the accepted frame, each in light and dark mode. */
export const Examples: Story = {
  name: 'Examples',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const count = counterOf(context);
    return validationPage(
      context,
      page('examples'),
      html`<div style=${stack}>
        ${inBothModes(
          context,
          'examples',
          () =>
            comment({
              label: v.commentLabel,
              placeholder: v.commentPlaceholder,
              attachText: v.attachText,
              sendText: v.sendText,
              counter: count,
              limit: LIMIT,
            }),
          v.exampleComment,
        )}
        ${inBothModes(
          context,
          'examples',
          () =>
            inForm({
              label: v.descriptionLabel,
              help: v.descriptionHelp,
              placeholder: v.descriptionPlaceholder,
              counter: count,
              limit: LIMIT,
              name: 'description',
            }),
          v.exampleForm,
        )}
        ${inBothModes(context, 'examples', () => longText({ label: v.notesLabel, value: v.longValue }), v.exampleLong)}
      </div>`,
    );
  },
};
