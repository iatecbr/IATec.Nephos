/**
 * VALIDATION stories of `nph-rich-option`.
 *
 * They prove the contract accepted in Figma (documentation frame `6935:11785`, card set
 * `6910:6828`, rich option set `6910:7093`) and P134: the card with each control, checked and
 * unchecked, in the default, error and disabled states; the parts — the second line, the icon,
 * the shortcut and the title that wraps; the groups by control, with the arrow keys of the radio
 * group and the native events; the form, which receives only the checked checkbox and radio
 * cards and returns to the initial state on reset; the rich option of the list in each state,
 * start and marker, with the focus border and the halo only on the option active by the
 * keyboard; the rich option inside the open `nph-select`, `nph-combobox` and
 * `nph-multi-combobox` lists, next to a plain option; and the three required examples of the
 * frame. Every story shows the same content in light and in dark mode, in the same story,
 * through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction: they show up by moving the mouse over a card and by
 * navigating with Tab and the arrow keys; the component test measures them. The rich option
 * static in the matrix is written the way the list writes it (`active`, `keyboard`, `selected`),
 * since a list in the top layer cannot hold every state at once. A group is an `nph-field`
 * around the cards of one control (P83; see `nph-rich-option.demo.ts`), and the `nph-button` of
 * the Form story is scenery that asks the form to submit and reset, not a relation of the piece.
 * Each page opens with what it proves, from the dictionary (`validationPages.claims`). The
 * example text and the captions come from the language dictionary, under the key
 * `richOptionValidation` (`docs/i18n.md`, "Storybook"); the row and column names of the matrix
 * are the technical attributes, the same in any language.
 *
 * The `Brands` page proves the seven brands of P20 in light and dark, each frame carrying
 * `data-nph-brand` and `data-nph-color-scheme` on the same element (DSA-36).
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
import './nph-rich-option';
import type { NphRichOption } from './nph-rich-option';
import { assignOne, assignPeople, bothModes, card, cardGroup, extras, notices, planSelect, plans, richOptions } from './nph-rich-option.demo';
import type { Scheme } from './nph-rich-option.demo';

const meta: Meta = {
  title: 'Components/nph-rich-option/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).richOptionValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-rich-option',
  storyId: `components-nph-rich-option-validation--${storyId}`,
});

/** What a story draws in one mode; the scheme keeps the names of each mode apart, so the two copies are two groups. */
type ModeContent = (title: string, scheme: Scheme) => TemplateResult;

/** The same demonstration in both modes, each with its caption. */
function inBothModes(context: GlobalsContext | undefined, storyId: string, content: ModeContent, room = false): TemplateResult {
  const v = t(context);
  const title = validationTitle(context, 'nph-rich-option', page(storyId).storyId);
  return bothModes(
    { light: v.lightCaption, dark: v.darkCaption },
    (scheme) => content(`${title} · ${scheme === 'light' ? v.lightCaption : v.darkCaption}`, scheme),
    room,
  );
}

/** The card with each control, checked and unchecked, in the default, error and disabled states: the Figma `controle`, `marcado` and `state`. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    /* Each radio card is its own group, so a checked one never unchecks another. */
    const cell = (control: 'checkbox' | 'radio' | 'switch', checked: boolean, flags: { invalid?: boolean; disabled?: boolean }, scheme: Scheme, key: string): TemplateResult =>
      card({
        control,
        name: `matrix-${scheme}-${key}-${control}-${String(checked)}`,
        text: v.cardTitle,
        description: v.cardText,
        checked,
        ...flags,
      });
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label, scheme) =>
        matrix(
          label,
          ['state: default', 'state: invalid', 'state: disabled'],
          (['checkbox', 'radio', 'switch'] as const).flatMap((control) =>
            [false, true].map((checked) => ({
              label: `control: ${control} · checked: ${String(checked)}`,
              cells: [
                cell(control, checked, {}, scheme, 'default'),
                cell(control, checked, { invalid: true }, scheme, 'invalid'),
                cell(control, checked, { disabled: true }, scheme, 'disabled'),
              ],
            })),
          ),
        ),
      ),
    );
  },
};

/** The parts: only the title, the second line, the icon, the shortcut, all of them, and a title that wraps in a narrow container. */
export const Content: Story = {
  name: 'Content',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const narrow = 'inline-size: calc(var(--nph-layout-rich-option-width) * 0.75); max-inline-size: 100%;';
    return validationPage(
      context,
      page('content'),
      inBothModes(context, 'content', (label, scheme) =>
        matrix(label, [], [
          { label: 'description: no', cells: [card({ control: 'radio', name: `content-${scheme}-a`, text: v.cardTitle })] },
          { label: 'description: yes', cells: [card({ control: 'radio', name: `content-${scheme}-b`, text: v.cardTitle, description: v.cardText })] },
          { label: 'icon: bell', cells: [card({ control: 'radio', name: `content-${scheme}-c`, text: v.cardTitle, description: v.cardText, icon: 'bell' })] },
          { label: 'shortcut: ⌘ K', cells: [card({ control: 'checkbox', text: v.cardTitle, description: v.cardText, shortcut: '⌘ K', keyShortcuts: 'Meta+K' })] },
          { label: 'icon · shortcut', cells: [card({ control: 'checkbox', text: v.cardTitle, description: v.cardText, icon: 'bell', shortcut: '⌘ K' })] },
          { label: 'control: switch', cells: [card({ control: 'switch', text: v.cardTitle, description: v.cardText, icon: 'bell' })] },
          { label: 'long text', cells: [html`<div style=${narrow}>${card({ control: 'checkbox', text: v.longTitle, description: v.longText })}</div>`] },
        ]),
      ),
    );
  },
};

/** The status text under a group: it is replaced by a listener, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined, scheme: Scheme): TemplateResult {
  const v = t(context);
  const onChange = (event: Event): void => {
    const target = event.target as NphRichOption;
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { control: target.control, value: target.value, checked: String(target.checked) });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @change=${onChange}>
    ${plans(v, `interactive-plan-${scheme}`)} ${notices(v, `interactive-notices-${scheme}`)} ${extras(v, `interactive-extras-${scheme}`)}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** One group of each control: the radio group has one Tab stop and the arrow keys check; the checkbox and switch cards are a stop each and Space toggles. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(
      context,
      page('interactive'),
      inBothModes(context, 'interactive', (_label, scheme) => interactive(context, scheme)),
    ),
};

/** A form around the cards: submitting shows the FormData, and reset returns to the initial state. */
function form(context: GlobalsContext | undefined, scheme: Scheme): TemplateResult {
  const v = t(context);
  const show = (element: HTMLFormElement): void => {
    const status = element.querySelector('output');
    if (status) {
      const entries = [...new FormData(element).entries()].map(([key, value]) => `${key}=${String(value)}`);
      status.textContent = format(v.formSent, { data: entries.join(' & ') || v.formEmpty });
    }
  };
  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    show(event.currentTarget as HTMLFormElement);
  };
  /* `nph-button` is not a submit button (P68): the frame asks the form itself. */
  const formOf = (event: Event): HTMLFormElement => (event.currentTarget as HTMLElement).closest('form') as HTMLFormElement;
  const submit = (event: Event): void => formOf(event).requestSubmit();
  const reset = (event: Event): void => {
    const element = formOf(event);
    element.reset();
    show(element);
  };
  return html`<form style="${stack} align-items: flex-start;" @submit=${onSubmit}>
    ${plans(v, `form-plan-${scheme}`)} ${extras(v, `form-extras-${scheme}`)}
    <div style="display: flex; gap: var(--nph-space-inline);">
      <nph-button text=${v.formSubmit} @click=${submit}></nph-button>
      <nph-button emphasis="outline" text=${v.formReset} @click=${reset}></nph-button>
    </div>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.formIdle}></output>
  </form>`;
}

/** The form receives only the checked checkbox and radio cards, under their names; the switch is not a form member; reset returns to the checked attribute. */
export const Form: Story = {
  name: 'Form',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('form'), inBothModes(context, 'form', (_label, scheme) => form(context, scheme))),
};

/** The group in error, with the message of the field, and the disabled group: the cards follow the field. */
export const Group: Story = {
  name: 'Group',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('group'),
      inBothModes(context, 'group', (label, scheme) =>
        matrix(label, [], [
          { label: 'field: error', cells: [plans(v, `group-error-${scheme}`, 'annual', { error: v.planError })] },
          { label: 'field: disabled', cells: [plans(v, `group-disabled-${scheme}`, 'annual', { disabled: true, error: v.planError })] },
          { label: 'field: help', cells: [plans(v, `group-help-${scheme}`, 'annual', { help: v.planHelp })] },
        ]),
      ),
    );
  },
};

/** The rich option of the list in each state, start and marker, written the way a list writes it; the focus border and the halo only on the option active by the keyboard. */
export const RichOption: Story = {
  name: 'Rich option',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('rich-option'),
      inBothModes(context, 'rich-option', (label) =>
        matrix(label, ['marker: check', 'marker: checkbox'], [
          { label: 'state: default', cells: [richOptions(v, {}, 'check'), richOptions(v, {}, 'checkbox')] },
          { label: 'state: hover', cells: [richOptions(v, { active: true }, 'check'), richOptions(v, { active: true }, 'checkbox')] },
          { label: 'state: active (keyboard)', cells: [richOptions(v, { active: true, keyboard: true }, 'check'), richOptions(v, { active: true, keyboard: true }, 'checkbox')] },
          { label: 'state: selected', cells: [richOptions(v, { selected: true }, 'check'), richOptions(v, { selected: true }, 'checkbox')] },
          {
            label: 'state: selected · active (keyboard)',
            cells: [richOptions(v, { selected: true, active: true, keyboard: true }, 'check'), richOptions(v, { selected: true, active: true, keyboard: true }, 'checkbox')],
          },
          { label: 'state: disabled', cells: [richOptions(v, { disabled: true }, 'check'), richOptions(v, { disabled: true }, 'checkbox')] },
          { label: 'state: disabled · selected', cells: [richOptions(v, { disabled: true, selected: true }, 'check'), richOptions(v, { disabled: true, selected: true }, 'checkbox')] },
        ]),
      ),
    );
  },
};

/** The rich option inside the open lists of the select, the combobox and the multiple combobox, next to a plain option; the create row stays plain. */
export const Lists: Story = {
  name: 'Lists',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('lists'),
      html`<div style=${stack}>
        ${inBothModes(context, 'lists', () => planSelect(v, true), true)} ${inBothModes(context, 'lists', () => assignOne(v, true), true)}
        ${inBothModes(context, 'lists', () => assignPeople(v, true), true)}
      </div>`,
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
        ${bothModes({ light: `${v.examplePlan} · ${v.lightCaption}`, dark: `${v.examplePlan} · ${v.darkCaption}` }, (scheme) => plans(v, `example-plan-${scheme}`))}
        ${bothModes({ light: `${v.exampleNotices} · ${v.lightCaption}`, dark: `${v.exampleNotices} · ${v.darkCaption}` }, (scheme) => notices(v, `example-notices-${scheme}`))}
        ${bothModes({ light: `${v.examplePeople} · ${v.lightCaption}`, dark: `${v.examplePeople} · ${v.darkCaption}` }, () => assignPeople(v), true)}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the checked control takes the primary of the frame, and the focus follows it. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(validationTitle(context, 'nph-rich-option', page('brands').storyId), ({ id }) =>
        /* One group per frame: the name carries the frame, so the fourteen groups stay apart. */
        cardGroup({
          title: v.planGroup,
          control: 'radio',
          name: `brands-${id}`,
          cards: [
            { value: 'monthly', text: v.planMonthlyTitle, description: v.planMonthlyText },
            { value: 'annual', text: v.planAnnualTitle, description: v.planAnnualText, checked: true },
          ],
        }),
      ),
    );
  },
};
