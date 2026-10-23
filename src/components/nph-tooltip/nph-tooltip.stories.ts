/**
 * VALIDATION stories of `nph-tooltip`.
 *
 * Each story proves a part of the contract accepted in Figma (frame `1237:5`,
 * board `1241:3`) and of P77 with its amendment of 22/10/2026: the balloon with one
 * line and with two lines, the four sides, the flip when it does not fit, opening on
 * hover after a wait and on keyboard focus at once, Esc, the balloon as the
 * accessible name of an icon-only button, and no balloon on an element without focus. The balloon text is content and arrives ready from the
 * application. It comes from the language dictionary, under the
 * `tooltipValidation` key (`docs/i18n.md`, "Storybook"), and in every language the
 * two-line text takes up two lines. The page of each story says what it proves.
 *
 * The color scheme comes from the Storybook global selector, applied at the page
 * root; the sides are shown in both schemes in the same story.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { userEvent } from 'storybook/test';

import { translations } from '../../../.storybook/i18n/index.js';
import { localeOf, validationPage } from '../../shared/docs/validation';
import type { GlobalsContext } from '../../shared/docs/validation';
import './nph-tooltip';
import { anchored, bothModes, namedIconButton } from './nph-tooltip.demo';

const meta: Meta = {
  title: 'Components/nph-tooltip/Validation',
};

export default meta;

type Story = StoryObj;

/** Shortcut: the dictionary of these stories in the chosen language. */
function t(context: GlobalsContext | undefined) {
  return translations(localeOf(context)).tooltipValidation;
}

const room = 'padding-block: calc(var(--nph-space-section) * 2); display: flex; justify-content: center;';

function frame(context: GlobalsContext | undefined, storyId: string, content: TemplateResult): TemplateResult {
  return validationPage(context, { piece: 'nph-tooltip', storyId: `components-nph-tooltip-validation--${storyId}` }, content);
}

function caption(text: string): TemplateResult {
  return html`<p
    style="margin: 0; font-family: var(--nph-text-body-sm-font-family); font-size: var(--nph-text-body-sm-font-size); line-height: var(--nph-text-body-sm-line-height); color: var(--nph-color-muted-foreground);"
  >
    ${text}
  </p>`;
}

/** The open balloon above an element, with a one-line text. */
export const OneLine: Story = {
  name: 'One line',
  render: (_args, context: GlobalsContext) =>
    frame(
      context,
      'one-line',
      html`<div style=${room}>
        ${anchored((id) => html`<button id=${id} type="button">${t(context).target}</button>`, { text: t(context).oneLine, open: true })}
      </div>`,
    ),
};

/** The open balloon with a two-line text: two lines in every language. */
export const TwoLines: Story = {
  name: 'Two lines',
  render: (_args, context: GlobalsContext) =>
    frame(
      context,
      'two-lines',
      html`<div style=${room}>
        ${anchored((id) => html`<button id=${id} type="button">${t(context).target}</button>`, { text: t(context).twoLines, open: true })}
      </div>`,
    ),
};

/** The four sides, top by default, in light and in dark. */
export const Sides: Story = {
  name: 'Sides',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'sides',
      html`${caption(v.sidesCaption)}
        ${bothModes({ light: v.lightCaption, dark: v.darkCaption }, () =>
          html`<div style="display: flex; flex-wrap: wrap; gap: calc(var(--nph-space-section) * 3); justify-content: center;">
            ${(['top', 'bottom', 'left', 'right'] as const).map(
              (side) => html`<span style="display: inline-flex;">${namedIconButton({ text: v.delete, side, open: true })}</span>`,
            )}
          </div>`,
        )}`,
    );
  },
};

/** The balloon flips to the opposite side when it does not fit: here it prefers top and sits below. */
export const Flip: Story = {
  name: 'Flip',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'flip',
      html`${caption(v.flipCaption)}
        <div style="position: fixed; inset-block-start: var(--nph-space-inline); inset-inline-end: var(--nph-space-section);">
          ${namedIconButton({ text: v.delete, open: true })}
        </div>`,
    );
  },
};

/** Keyboard focus opens the balloon and Esc closes it; the focus stays on the element. */
export const FocusAndEscape: Story = {
  name: 'Focus and Esc',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'focus-and-escape',
      html`${caption(v.focusCaption)}
        <div style=${room}>${namedIconButton({ text: v.delete })}</div>`,
    );
  },
  play: async () => {
    await userEvent.tab();
  },
};

/** Hover after a wait and keyboard focus at once open it on any element that receives focus: a button, a link and a field. */
export const HoverAndFocus: Story = {
  name: 'Hover and focus',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'hover-and-focus',
      html`${caption(v.hoverCaption)}
        <div style="${room} gap: calc(var(--nph-space-section) * 2); align-items: center;">
          ${anchored((id) => html`<button id=${id} type="button">${v.target}</button>`, { text: v.oneLine })}
          ${anchored((id) => html`<a id=${id} href="#hover-and-focus">${v.link}</a>`, { text: v.oneLine })}
          ${anchored((id) => html`<input id=${id} aria-label=${v.field} />`, { text: v.oneLine, side: 'bottom' })}
        </div>`,
    );
  },
};

/** On an icon-only button the balloon text is the accessible name of the action, announced once. */
export const AccessibleName: Story = {
  name: 'Accessible name',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'accessible-name',
      html`${caption(v.nameCaption)}
        <div style=${room}>${namedIconButton({ text: v.delete, open: true })}</div>`,
    );
  },
};

/** The balloon goes only on an element that receives focus: the disabled button gets none. */
export const FocusableOnly: Story = {
  name: 'Focusable only',
  render: (_args, context: GlobalsContext) => {
    const v = t(context);
    return frame(
      context,
      'focusable-only',
      html`${caption(v.focusableCaption)}
        <div style="${room} gap: calc(var(--nph-space-section) * 3); align-items: center;">
          ${anchored((id) => html`<button id=${id} type="button">${v.target}</button>`, { text: v.oneLine, open: true })}
          ${anchored((id) => html`<button id=${id} type="button" disabled>${v.disabledTarget}</button>`, { text: v.oneLine, open: true })}
        </div>`,
    );
  },
};
