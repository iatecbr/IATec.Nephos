/**
 * Demonstration frame shared by the `nph-notification` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the framed figure, the surfaces and the toast region frame — is NOT a
 * precedent for component CSS: the piece takes its measures from its own tokens.
 *
 * THE TOAST REGION is not a piece (P108). `toastRegion` is the frame a consuming application
 * builds: a column at the corner, `notification/stack-gap` between the toasts, the newest next to
 * the corner. Here it is drawn in the flow of the page, so a page can show it next to other
 * examples; an application fixes it to the bottom-right corner of the window.
 *
 * The functions take the visible text as arguments: this file holds none, because every visible
 * text comes from the language dictionary of the page that calls them.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-notification';
import type {
  NphNotificationEmphasis,
  NphNotificationLayout,
  NphNotificationPlacement,
  NphNotificationSeverity,
} from './nph-notification';

export type Scheme = 'light' | 'dark';

/** The two surfaces a notification sits on in the contract: the page and a popover. */
export const SURFACES = ['--nph-color-background', '--nph-color-popover'] as const;

export type Surface = (typeof SURFACES)[number];

/** The severities, in the order of the contract. */
export const SEVERITIES: readonly NphNotificationSeverity[] = ['info', 'success', 'warning', 'error', 'help', 'neutral', 'loading'];

/** The severities with a drawing of their own, so the loading toast is left out of the inline examples. */
export const STATIC_SEVERITIES: readonly NphNotificationSeverity[] = ['info', 'success', 'warning', 'error', 'help', 'neutral'];

export interface NotificationText {
  heading?: string;
  description: string;
  action?: string;
  secondaryAction?: string;
  closeLabel?: string;
}

export interface NotificationOptions extends NotificationText {
  placement?: NphNotificationPlacement;
  severity?: NphNotificationSeverity;
  emphasis?: NphNotificationEmphasis;
  layout?: NphNotificationLayout;
  hideClose?: boolean;
  duration?: number;
  timeBar?: boolean;
}

/** One `nph-notification` with the given options; an option that is not given stays out of the markup. */
export function notification(options: NotificationOptions): TemplateResult {
  return html`<nph-notification
    placement=${options.placement ?? nothing}
    severity=${options.severity ?? nothing}
    emphasis=${options.emphasis ?? nothing}
    layout=${options.layout ?? nothing}
    heading=${options.heading ?? nothing}
    description=${options.description}
    action=${options.action ?? nothing}
    secondary-action=${options.secondaryAction ?? nothing}
    close-label=${options.closeLabel ?? nothing}
    duration=${options.duration === undefined ? nothing : String(options.duration)}
    ?hide-close=${options.hideClose ?? false}
    ?time-bar=${options.timeBar ?? false}
  ></nph-notification>`;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, surface: Surface = '--nph-color-background'): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(${surface}); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); box-sizing: border-box; flex: 1 1 var(--nph-layout-input-width); min-inline-size: 0;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult, surface?: Surface): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content(), surface)} ${inScheme('dark', captions.dark, content(), surface)}
  </div>`;
}

/** A column of examples, with the space of a stack of notifications. */
export function column(items: TemplateResult[]): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-snug);">${items}</div>`;
}

/**
 * The toast region frame (P108): what a consuming application builds. A column that ends at the
 * corner, with `notification/stack-gap` between the toasts. The newest toast comes first, next to
 * the corner, and at most three show.
 */
export function toastRegion(toasts: TemplateResult[], label: string): TemplateResult {
  return html`<div
    role="group"
    aria-label=${label}
    style="display: flex; flex-direction: column; align-items: flex-end; gap: var(--nph-notification-stack-gap); padding: var(--nph-space-container-padding); background: var(--nph-color-background-subtle); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control);"
  >
    ${toasts.slice(0, 3)}
  </div>`;
}

/** A form area with a notification on top of its fields, for the example of an inline error. */
export function formArea(content: TemplateResult, fields: string[]): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${content}
    <div style="display: flex; flex-direction: column; gap: var(--nph-space-stack-snug);">
      ${fields.map(
        (label) => html`<label
          style="display: flex; flex-direction: column; gap: var(--nph-space-stack-tight); font-family: var(--nph-text-label-md-font-family); font-size: var(--nph-text-label-md-font-size); line-height: var(--nph-text-label-md-line-height); color: var(--nph-color-foreground);"
          >${label}<input
            type="text"
            style="box-sizing: border-box; block-size: var(--nph-control-height-default); padding-inline: var(--nph-space-control-padding); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); background: var(--nph-color-background); color: var(--nph-color-foreground); font: inherit;"
        /></label>`,
      )}
    </div>
  </div>`;
}
