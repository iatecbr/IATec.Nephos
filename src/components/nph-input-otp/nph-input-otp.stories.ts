/**
 * VALIDATION stories of `nph-input-otp`.
 *
 * They prove the contract accepted in Figma (board `1633:122`, set `1633:120`, cell set
 * `1633:29`) and P85: six and four cells in both sizes; the states default, invalid and
 * disabled, with disabled winning over invalid; numeric, alphanumeric, partial and masked
 * codes; typing, paste and the native events; and the three required examples — a code sent
 * by e-mail and a wrong code, inside the `nph-field`, and the touch screen. Every story
 * shows the same field in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction: they show up by moving the mouse over a field and by
 * entering it with Tab; the Interactive story focuses its first field when it opens, and
 * the component test measures both. Each page opens with what it proves, from the
 * dictionary (`validationPages.claims`). The accessible names, the codes and the captions
 * come from the language dictionary, under the key `inputOtpValidation` (`docs/i18n.md`,
 * "Storybook"); the row and column names of the matrices are the technical attributes,
 * the same in any language. The resend action waits for D4 of DSA-41.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { format, translations } from '../../../.storybook/i18n/index.js';
import { matrix } from '../../shared/docs/page';
import { localeOf, validationPage, validationTitle } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-input-otp';
import type { NphInputOtp } from './nph-input-otp';
import { field, inField, inScheme } from './nph-input-otp.demo';
import type { Scheme } from './nph-input-otp.demo';

const meta: Meta = {
  title: 'Components/nph-input-otp/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).inputOtpValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-input-otp',
  storyId: `components-nph-input-otp-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-input-otp', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** Six and four cells, in default and large: the Figma properties `digitos` and `size`. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(label, ['size: default', 'size: large'], [
          {
            label: 'length: 6',
            cells: [field({ label: v.fieldLabel, value: v.numericCode }), field({ label: v.fieldLabel, value: v.numericCode, size: 'large' })],
          },
          {
            label: 'length: 4',
            cells: [
              field({ label: v.fieldLabel, value: v.shortCode, length: 4 }),
              field({ label: v.fieldLabel, value: v.shortCode, length: 4, size: 'large' }),
            ],
          },
        ]),
      ),
    );
  },
};

/** Default, invalid and disabled on every cell; disabled wins over invalid. */
export const States: Story = {
  name: 'States',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('states'),
      inBothModes(context, 'states', (label) =>
        matrix(label, [], [
          { label: 'no attribute', cells: [field({ label: v.fieldLabel, value: v.partialCode })] },
          { label: 'invalid', cells: [field({ label: v.fieldLabel, value: v.numericCode, invalid: true })] },
          { label: 'disabled', cells: [field({ label: v.fieldLabel, value: v.partialCode, disabled: true })] },
          { label: 'disabled invalid', cells: [field({ label: v.fieldLabel, value: v.partialCode, disabled: true, invalid: true })] },
        ]),
      ),
    );
  },
};

/** A numeric code, a code with letters and numbers, a partial code and the masked code. */
export const Characters: Story = {
  name: 'Characters',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('characters'),
      inBothModes(context, 'characters', (label) =>
        matrix(label, [], [
          { label: `value: ${v.numericCode}`, cells: [field({ label: v.fieldLabel, value: v.numericCode })] },
          { label: `value: ${v.alphanumericCode}`, cells: [field({ label: v.fieldLabel, value: v.alphanumericCode })] },
          { label: `value: ${v.partialCode}`, cells: [field({ label: v.fieldLabel, value: v.partialCode })] },
          { label: `masked · value: ${v.alphanumericCode}`, cells: [field({ label: v.fieldLabel, value: v.alphanumericCode, masked: true })] },
        ]),
      ),
    );
  },
};

/** The status text under a field: it is replaced by the listeners, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const show = (template: string) => (event: Event): void => {
    const target = event.currentTarget as HTMLElement;
    const status = target.querySelector('output');
    const value = (target.querySelector('nph-input-otp') as NphInputOtp | null)?.value ?? '';
    if (status) {
      status.textContent = format(template, { value });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @input=${show(v.statusInput)} @change=${show(v.statusChange)}>
    ${field({ label: v.fieldLabel })}
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** Typing and paste: the active cell follows the caret, and input and change are shown below the field. */
export const Interactive: Story = {
  name: 'Interactive',
  render: (_args, context: GlobalsContext) =>
    validationPage(context, page('interactive'), inBothModes(context, 'interactive', () => interactive(context))),
  play: async ({ canvasElement }) => {
    const first = canvasElement.querySelector<NphInputOtp>('nph-input-otp');
    await first?.updateComplete;
    first?.focus();
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
        ${inBothModes(context, 'examples', () => inField({ label: v.fieldLabel, help: v.emailHelp }), v.exampleEmail)}
        ${inBothModes(
          context,
          'examples',
          () => inField({ label: v.fieldLabel, error: v.wrongError, value: v.numericCode }),
          v.exampleWrong,
        )}
        ${inBothModes(context, 'examples', () => field({ label: v.fieldLabel, size: 'large' }), v.exampleTouch)}
      </div>`,
    );
  },
};
