/**
 * VALIDATION stories of `nph-togglebutton`.
 *
 * They prove the contract accepted in Figma (frame `1512:27498`, set `1512:719`) and
 * P73 with its amendment of 2026-10-29 (DSA-61): the pressed and unpressed pieces with
 * text, valid and invalid; the three sizes, with text and icon only; the start or end
 * icon, one at most (`auto`, `none` and a fixed core name); the icon-only piece, side
 * by side with one on; the disabled piece, which wins over invalid; the click that
 * toggles the piece and fires `nph-change`; and the three required examples of the
 * frame — "Option off", "Option on" and "Icon set". Every story shows the same
 * pieces in light and in dark mode, in the same story, through
 * `data-nph-color-scheme` on the frame (P20, P67).
 *
 * Hover and focus are interaction states: they show up by moving the mouse over a
 * button (the hover background and the solid icon) and by navigating with Tab, as in
 * `nph-button`; the component test measures both. Each page opens with what it proves, from the dictionary
 * (`validationPages.claims`). The example text of the pieces and the captions come
 * from the language dictionary, under the key `togglebuttonValidation`
 * (`docs/i18n.md`, "Storybook"); the row and column names of the matrices are the
 * technical attributes, the same in any language.
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
import './nph-togglebutton';
import type { NphTogglebuttonChangeDetail } from './nph-togglebutton';
import { iconSet, inScheme, optionOff, optionOn } from './nph-togglebutton.demo';
import type { Scheme } from './nph-togglebutton.demo';

const meta: Meta = {
  title: 'Components/nph-togglebutton/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).togglebuttonValidation;
}

/* Demonstration frame. Not a precedent for component CSS. */
const stack = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const row = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';
const modesFrame = 'display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);';
const statusStyle = 'color: var(--nph-color-muted-foreground);';

const page = (storyId: string) => ({
  piece: 'nph-togglebutton',
  storyId: `components-nph-togglebutton-validation--${storyId}`,
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
  const title = validationTitle(context, 'nph-togglebutton', page(storyId).storyId);
  return html`<div style=${modesFrame}>
    ${modes.map(([scheme, caption]) => {
      const label = name === undefined ? caption : `${name} · ${caption}`;
      return inScheme(scheme, label, content(`${title} · ${label}`));
    })}
  </div>`;
}

/** Off and on side by side: the two columns of every matrix. */
const PRESSED_COLUMNS = ['pressed: false', 'pressed: true'];

/** Pressed off and on, valid and invalid, with text. Move the mouse for hover and press Tab for focus. */
export const Matrix: Story = {
  name: 'Matrix',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('matrix'),
      inBothModes(context, 'matrix', (label) =>
        matrix(label, PRESSED_COLUMNS, [
          {
            label: 'invalid: false',
            cells: [
              html`<nph-togglebutton text=${v.showGrid}></nph-togglebutton>`,
              html`<nph-togglebutton text=${v.showGrid} pressed></nph-togglebutton>`,
            ],
          },
          {
            label: 'invalid: true',
            cells: [
              html`<nph-togglebutton text=${v.showGrid} invalid></nph-togglebutton>`,
              html`<nph-togglebutton text=${v.showGrid} invalid pressed></nph-togglebutton>`,
            ],
          },
        ]),
      ),
    );
  },
};

/** The three sizes, 28, 36 and 44 px high, with text and icon only; the icon-only icon follows the size. */
export const Sizes: Story = {
  name: 'Sizes',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const sizes = ['compact', 'default', 'large'] as const;
    return validationPage(
      context,
      page('sizes'),
      inBothModes(context, 'sizes', (label) =>
        matrix(
          label,
          PRESSED_COLUMNS,
          sizes.flatMap((size) => [
            {
              label: `size: ${size} · text`,
              cells: [
                html`<nph-togglebutton size=${size} text=${v.showGrid}></nph-togglebutton>`,
                html`<nph-togglebutton size=${size} text=${v.showGrid} pressed></nph-togglebutton>`,
              ],
            },
            {
              label: `size: ${size} · label`,
              cells: [
                html`<nph-togglebutton size=${size} icon-start="star" label=${v.favorites}></nph-togglebutton>`,
                html`<nph-togglebutton size=${size} icon-start="star" label=${v.favorites} pressed></nph-togglebutton>`,
              ],
            },
          ]),
        ),
      ),
    );
  },
};

/** One icon at most, at the start or at the end: `auto` swaps `xmark` and `check`, `none` draws nothing, a core name is one fixed icon. */
export const Icons: Story = {
  name: 'Icons',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    /* Each row: the two icon attributes, and the piece off and on. The first row is the default. */
    const rows = [
      { start: 'auto', end: 'none' },
      { start: 'none', end: 'auto' },
      { start: 'star', end: 'none' },
      { start: 'none', end: 'star' },
      { start: 'none', end: 'none' },
    ];
    const piece = (start: string, end: string, pressed: boolean): TemplateResult =>
      html`<nph-togglebutton text=${v.showGrid} icon-start=${start} icon-end=${end} ?pressed=${pressed}></nph-togglebutton>`;
    return validationPage(
      context,
      page('icons'),
      inBothModes(context, 'icons', (label) =>
        matrix(
          label,
          PRESSED_COLUMNS,
          rows.map(({ start, end }) => ({
            label: `icon-start: ${start} · icon-end: ${end}`,
            cells: [piece(start, end, false), piece(start, end, true)],
          })),
        ),
      ),
    );
  },
};

/** Icon only: one icon, a label as the accessible name, never square, side by side with one on. */
export const IconOnly: Story = {
  name: 'Icon only',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    const set = [
      { icon: 'grid-2', label: v.gridView },
      { icon: 'list', label: v.listView, pressed: true },
      { icon: 'star', label: v.favorites },
    ];
    return validationPage(
      context,
      page('icon-only'),
      inBothModes(context, 'icon-only', (label) =>
        matrix(label, [], [
          { label: 'icon-start: grid-2 · list · star', cells: [iconSet(set)] },
          {
            label: 'icon-start: auto',
            cells: [
              html`<div style=${row}>
                <nph-togglebutton label=${v.favorites}></nph-togglebutton>
                <nph-togglebutton label=${v.favorites} pressed></nph-togglebutton>
              </div>`,
            ],
          },
          {
            label: 'invalid',
            cells: [
              html`<div style=${row}>
                <nph-togglebutton icon-start="star" label=${v.favorites} invalid></nph-togglebutton>
                <nph-togglebutton icon-start="star" label=${v.favorites} invalid pressed></nph-togglebutton>
              </div>`,
            ],
          },
          {
            label: 'disabled',
            cells: [
              html`<div style=${row}>
                <nph-togglebutton icon-start="star" label=${v.favorites} disabled></nph-togglebutton>
                <nph-togglebutton icon-start="star" label=${v.favorites} disabled pressed></nph-togglebutton>
              </div>`,
            ],
          },
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
        matrix(label, PRESSED_COLUMNS, [
          {
            label: 'disabled',
            cells: [
              html`<nph-togglebutton text=${v.showGrid} disabled></nph-togglebutton>`,
              html`<nph-togglebutton text=${v.showGrid} disabled pressed></nph-togglebutton>`,
            ],
          },
          {
            label: 'disabled · invalid',
            cells: [
              html`<nph-togglebutton text=${v.showGrid} disabled invalid></nph-togglebutton>`,
              html`<nph-togglebutton text=${v.showGrid} disabled invalid pressed></nph-togglebutton>`,
            ],
          },
          {
            label: 'label · disabled',
            cells: [
              html`<nph-togglebutton icon-start="star" label=${v.favorites} disabled></nph-togglebutton>`,
              html`<nph-togglebutton icon-start="star" label=${v.favorites} disabled pressed></nph-togglebutton>`,
            ],
          },
        ]),
      ),
    );
  },
};

/** Invalid: the border of the box is `status/error`, over the background of the state; the message stays outside the piece. */
export const Invalid: Story = {
  name: 'Invalid',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('invalid'),
      inBothModes(context, 'invalid', (label) =>
        matrix(label, PRESSED_COLUMNS, [
          {
            label: 'text · invalid',
            cells: [
              html`<nph-togglebutton text=${v.wrapText} invalid></nph-togglebutton>`,
              html`<nph-togglebutton text=${v.wrapText} invalid pressed></nph-togglebutton>`,
            ],
          },
          {
            label: 'label · invalid',
            cells: [
              html`<nph-togglebutton icon-start="star" label=${v.favorites} invalid></nph-togglebutton>`,
              html`<nph-togglebutton icon-start="star" label=${v.favorites} invalid pressed></nph-togglebutton>`,
            ],
          },
        ]),
      ),
    );
  },
};

/** The status text under a button: it is replaced by a listener, and re-rendered only when the language changes. */
function interactive(context: GlobalsContext | undefined): TemplateResult {
  const v = t(context);
  const onChange = (event: CustomEvent<NphTogglebuttonChangeDetail>): void => {
    const status = (event.currentTarget as HTMLElement).querySelector('output');
    if (status) {
      status.textContent = format(v.statusChanged, { pressed: String(event.detail.pressed) });
    }
  };
  return html`<div style="${stack} align-items: flex-start;" @nph-change=${onChange}>
    <nph-togglebutton text=${v.wrapText}></nph-togglebutton>
    <output aria-live="polite" style=${statusStyle} .textContent=${v.statusIdle}></output>
  </div>`;
}

/** A click toggles the piece and fires `nph-change`; `detail.pressed` is shown below the button. */
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
        ${inBothModes(context, 'examples', () => optionOff(v.showGrid), v.exampleOff)}
        ${inBothModes(context, 'examples', () => optionOn(v.showGrid), v.exampleOn)}
        ${inBothModes(
          context,
          'examples',
          () =>
            iconSet([
              { icon: 'grid-2', label: v.gridView },
              { icon: 'list', label: v.listView, pressed: true },
              { icon: 'star', label: v.favorites },
            ]),
          v.exampleIconSet,
        )}
      </div>`,
    );
  },
};

/** The seven brands in light and dark (DSA-36): the pressed button takes the checked background of the brand of the frame. */
export const Brands: Story = {
  name: 'Brands',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return validationPage(
      context,
      page('brands'),
      brandFrames(
        validationTitle(context, 'nph-togglebutton', page('brands').storyId),
        () => html`<nph-togglebutton text=${v.showGrid}></nph-togglebutton>
          <nph-togglebutton text=${v.showGrid} pressed></nph-togglebutton>`,
      ),
    );
  },
};
