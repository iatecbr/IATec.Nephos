/**
 * Demonstration frame shared by the `nph-tooltip` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the framed figure and the room around the
 * element — is NOT a precedent for component CSS: the balloon takes its measures
 * from its own tokens and its place from the element it describes.
 *
 * The functions take the visible text as arguments: this file holds none, because
 * every visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-tooltip';
import type { NphTooltipSide } from './nph-tooltip';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that
 * resolves the tokens (P67). A story is never duplicated per mode. The padding
 * leaves room for a balloon on any side.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; align-items: center; gap: var(--nph-space-inline); padding: calc(var(--nph-space-section) * 2); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="margin-block-start: calc(var(--nph-space-section) * 2); color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

export interface BalloonOptions {
  /** The balloon text: the action name, already localized. */
  text: string;
  side?: NphTooltipSide;
  open?: boolean;
}

let nextId = 0;

/**
 * The icon-only ghost button with the balloon that names its action: the example
 * of the accepted board. The button is the element (`for` points at it); the
 * tooltip is its sibling in the same root.
 */
export function iconButton({ text, side, open = false }: BalloonOptions): TemplateResult {
  const id = `nph-tooltip-demo-${++nextId}`;
  return html`<nph-button id=${id} emphasis="ghost" severity="secondary" icon-start="trash-can" label=${text}></nph-button
    ><nph-tooltip for=${id} text=${text} side=${side ?? 'top'} ?open=${open}></nph-tooltip>`;
}

/** A native element and its balloon: the tooltip serves any element. */
export function anchored(element: (id: string) => TemplateResult, { text, side, open = false }: BalloonOptions): TemplateResult {
  const id = `nph-tooltip-demo-${++nextId}`;
  return html`${element(id)}<nph-tooltip for=${id} text=${text} side=${side ?? 'top'} ?open=${open}></nph-tooltip>`;
}

/**
 * A label with the information icon and its balloon open, for the pages that cannot
 * run a `play` function. The `nph-label` has no way to open its balloon, so the demo
 * turns on `open` of the `nph-tooltip` the label renders in its own light DOM: that is
 * the public API of a reachable element, and the closing rules of the balloon still hold.
 */
export function openOnRender(label: Element | undefined): void {
  if (!label) {
    return;
  }
  void (label as Element & { updateComplete: Promise<unknown> }).updateComplete.then(() => {
    const balloon = label.querySelector('nph-tooltip');
    if (balloon) {
      balloon.open = true;
    }
  });
}
