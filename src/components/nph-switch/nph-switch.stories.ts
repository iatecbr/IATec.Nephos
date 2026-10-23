/**
 * VALIDATION stories of `nph-switch`.
 *
 * They prove the contract accepted in Figma (frame `1549:2`, set `1548:56`), the answers
 * D1 to D4 of the task DSA-27 and P79: off and on, valid, invalid and disabled; the label
 * after the track, its absence (`label` as the accessible name) and a long label that
 * wraps with the track at the top; the disabled piece, which wins over invalid; the
 * invalid piece, on or off; the click that toggles the piece and fires the native `input`
 * and `change`; and the three required examples of the frame — "Single setting",
 * "Preferences" and "Unavailable setting". Every story shows the same pieces in light and
 * in dark mode, in the same story, through `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a piece
 * and by navigating with Tab, as in `nph-togglebutton`; the component test measures both.
 * Each page opens with what it proves, from the dictionary (`validationPages.claims`).
 * The example text of the pieces and the captions come from the language dictionary,
 * under the key `switchValidation` (`docs/i18n.md`, "Storybook"); the row and column
 * names of the matrices are the technical attributes, the same in any language.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-switch';
import type { NphSwitch } from './nph-switch';
import { inScheme, narrow, preferences, singleSetting, unavailableSetting } from './nph-switch.demo';
import type { Scheme } from './nph-switch.demo';

const meta: Meta = {
  title: 'Components/nph-switch/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).switchValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-switch',
  storyId: `components-nph-switch-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-switch', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** Off and on side by side: the two columns of every matrix. */
const CHECKED_COLUMNS = ['checked: false', 'checked: true'];

interface Attributes {
  invalid?: boolean;
  disabled?: boolean;
}

/** One row of a matrix: the same piece off and on. */
function offAndOn(label: string, text: string, attributes: Attributes = {}): { label: string; cells: TemplateResult[] } {
  const piece = (checked: boolean): TemplateResult =>
    html`<nph-switch
      text=${text}
      ?checked=${checked}
      ?invalid=${attributes.invalid ?? false}
      ?disabled=${attributes.disabled ?? false}
    ></nph-switch>`;
  return { label, cells: [piece(false), piece(true)] };
}

/** Off and on, valid, invalid and disabled, with a label. Move the mouse for hover and press Tab for focus. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(label, CHECKED_COLUMNS, [
          offAndOn('default', v.wifi),
          offAndOn('invalid', v.wifi, { invalid: true }),
          offAndOn('disabled', v.wifi, { disabled: true }),
        ]),
      ),
    );
  },
};

/** The label after the track; without text, only the track with `label`; a long label wraps with the track at the top. */
export const Label: Story = {
  name: 'Label',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const bare = (checked: boolean): TemplateResult => html`<nph-switch label=${v.wifi} ?checked=${checked}></nph-switch>`;
    const long = (checked: boolean): TemplateResult => narrow(html`<nph-switch text=${v.longLabel} ?checked=${checked}></nph-switch>`);
    return validationPage(
      context,
      page('label'),
      inBothModes(context, 'label', (label) =>
        matrix(label, CHECKED_COLUMNS, [
          offAndOn('text', v.wifi),
          { label: 'label', cells: [bare(false), bare(true)] },
          { label: `text · ${v.twoLines}`, cells: [long(false), long(true)] },
        ]),
      ),
    );
  },
};

/** Disabled: the whole piece at `state/disabled-opacity`, out of the Tab order; it wins over invalid. */
export const Disabled: Story = {
  name: 'Disabled',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('disabled'),
      inBothModes(context, 'disabled', (label) =>
        matrix(label, CHECKED_COLUMNS, [
          offAndOn('disabled', v.backup, { disabled: true }),
          offAndOn('disabled · invalid', v.backup, { disabled: true, invalid: true }),
        ]),
      ),
    );
  },
};

/** Invalid: the track outline is `status/error`, on or off; the error sentence stays outside the piece. */
export const Invalid: Story = {
  name: 'Invalid',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const bare = (checked: boolean): TemplateResult => html`<nph-switch label=${v.wifi} ?checked=${checked} invalid></nph-switch>`;
    return validationPage(
      context,
      page('invalid'),
      inBothModes(context, 'invalid', (label) =>
        matrix(label, CHECKED_COLUMNS, [offAndOn('text · invalid', v.wifi, { invalid: true }), { label: 'label · invalid', cells: [bare(false), bare(true)] }]),
      ),
    );
  },
};

/** The status text under a piece: it is replaced by a listener, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onChange = (event: Event): void => {
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { checked: String((event.target as NphSwitch).checked) });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @change=${onChange}>
    <nph-switch text=${v.wifi}></nph-switch>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** A click toggles the piece and fires `input` and `change`; `checked` is read from the target and shown below. */
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
        ${inBothModes(context, 'examples', () => singleSetting(v.wifi), v.exampleSingle)}
        ${inBothModes(
          context,
          'examples',
          () =>
            preferences([
              { text: v.emailNotifications, checked: true },
              { text: v.pushNotifications },
              { text: v.weeklySummary, checked: true },
            ]),
          v.examplePreferences,
        )}
        ${inBothModes(context, 'examples', () => unavailableSetting(v.backup), v.exampleUnavailable)}
      </div>`,
    );
  },
};
