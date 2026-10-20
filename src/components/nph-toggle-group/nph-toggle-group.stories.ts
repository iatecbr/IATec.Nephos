/**
 * VALIDATION stories of `nph-toggle-group`.
 *
 * They prove the contract accepted in Figma (frame `1580:61`, set `1580:60`), the
 * decisions D1 to D3 of DSA-23 and P76: the group with and without text, with two and
 * three buttons; single selection, which starts empty or with a value and ignores a
 * click on the checked button; multiple selection; the disabled and invalid states,
 * which stay on each button; the event `nph-value-change`; and the three required
 * examples of the frame — "Alignment", "Formatting" and "View". Every story shows the
 * same group in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus belong to `nph-togglebutton`: they show up by moving the mouse over a
 * button and by navigating with Tab, one stop per button; the component test measures
 * the space between buttons. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The example text and the captions come from the language
 * dictionary, under the key `toggleGroupValidation` (`docs/i18n.md`, "Storybook"); the
 * row and column names of the matrices are the technical attributes, the same in any
 * language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-toggle-group';
import type { NphToggleGroupValueChangeDetail } from './nph-toggle-group';
import { alignment, formatting, group, inScheme, view } from './nph-toggle-group.demo';
import type { GroupItem, Scheme } from './nph-toggle-group.demo';

const meta: Meta = {
  title: 'Components/nph-toggle-group/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).toggleGroupValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-toggle-group',
  storyId: `components-nph-toggle-group-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-toggle-group', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** The items of a group, with text or icon only. */
function items(v: ReturnType<typeof t>, count: 2 | 3, withText: boolean): GroupItem[] {
  const all: GroupItem[] = withText
    ? [
        { value: 'list', text: v.list },
        { value: 'grid', text: v.grid },
        { value: 'table', text: v.table },
      ]
    : [
        { value: 'list', label: v.list, icon: 'list' },
        { value: 'grid', label: v.grid, icon: 'grid-2' },
        { value: 'table', label: v.table, icon: 'filter' },
      ];
  return all.slice(0, count);
}

/** Two and three buttons, with text and icon only: the Figma properties `texto` and `mostrar 3º`. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const cell = (count: 2 | 3, withText: boolean): TemplateResult =>
      group({ label: v.viewGroup, value: ['list'], items: items(v, count, withText) });
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(label, ['text: yes', 'text: no'], [
          { label: 'buttons: 2', cells: [cell(2, true), cell(2, false)] },
          { label: 'buttons: 3', cells: [cell(3, true), cell(3, false)] },
        ]),
      ),
    );
  },
};

/** Single selection: it starts empty or with a value, checking one unchecks the others, and a click on the checked button does nothing. */
export const SingleSelection: Story = {
  name: 'Single selection',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('single-selection'),
      inBothModes(context, 'single-selection', (label) =>
        matrix(label, ['value: none', 'value: center'], [
          {
            label: 'selection: single · icon only',
            cells: [alignment({ ...v, group: v.alignmentGroup }, []), alignment({ ...v, group: v.alignmentGroup }, ['center'])],
          },
          {
            label: 'selection: single · text',
            cells: [view({ ...v, group: v.viewGroup }, []), view({ ...v, group: v.viewGroup }, ['grid'])],
          },
        ]),
      ),
    );
  },
};

/** Multiple selection: each button checks and unchecks on its own, and the value gathers the checked ones. */
export const MultipleSelection: Story = {
  name: 'Multiple selection',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const text = { ...v, group: v.formattingGroup };
    return validationPage(
      context,
      page('multiple-selection'),
      inBothModes(context, 'multiple-selection', (label) =>
        matrix(label, ['value: none', 'value: bold italic'], [
          { label: 'selection: multiple · icon only', cells: [formatting(text, []), formatting(text, ['bold', 'italic'])] },
        ]),
      ),
    );
  },
};

/** Disabled and invalid stay on each button; the group adds nothing, and the error message stays outside it. */
export const ButtonStates: Story = {
  name: 'Button states',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const states = (flag: 'disabled' | 'invalid'): TemplateResult =>
      group({
        label: v.viewGroup,
        value: ['list'],
        items: [
          { value: 'list', text: v.list },
          { value: 'grid', text: v.grid, [flag]: true },
          { value: 'table', text: v.table },
        ],
      });
    return validationPage(
      context,
      page('button-states'),
      inBothModes(context, 'button-states', (label) =>
        matrix(label, [], [
          { label: 'disabled button', cells: [states('disabled')] },
          { label: 'invalid button', cells: [states('invalid')] },
        ]),
      ),
    );
  },
};

/** The status text under a group: it is replaced by a listener, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onChange = (event: CustomEvent<NphToggleGroupValueChangeDetail>): void => {
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { value: event.detail.value.join(' ') || v.statusNone });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @nph-value-change=${onChange}>
    ${alignment({ ...v, group: v.alignmentGroup }, [])}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** A click changes the selection and fires `nph-value-change`; `detail.value` is shown below the group. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('interactive'), inBothModes(context, 'interactive', () => interactive(context))),
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
        ${inBothModes(context, 'examples', () => alignment({ ...v, group: v.alignmentGroup }), v.exampleAlignment)}
        ${inBothModes(context, 'examples', () => formatting({ ...v, group: v.formattingGroup }), v.exampleFormatting)}
        ${inBothModes(context, 'examples', () => view({ ...v, group: v.viewGroup }), v.exampleView)}
      </div>`,
    );
  },
};
