/**
 * Demonstration frame shared by the `nph-resizable` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the framed figure, the size of the frame, the skeleton content of the
 * panels — is NOT a precedent for component CSS: the group takes its handle from the
 * `resizable/*` tokens and the panel padding from `space/container-padding`, and the size of the
 * frame is the consumer's to give. The panel content is `nph-skeleton` only, as the accepted frame
 * draws it.
 *
 * The functions take every visible text as an argument: this file holds none, because every
 * visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import '../nph-skeleton/nph-skeleton';
import './nph-resizable';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The size of the frame the group fills: the group has no size of its own, the consumer gives it. */
export function frame(content: TemplateResult, size: 'default' | 'wide' | 'tall' = 'default'): TemplateResult {
  const width = size === 'wide' ? 12 : 8;
  const height = size === 'tall' ? 7 : 5;
  return html`<div
    style="inline-size: calc(var(--nph-control-height-large) * ${width}); block-size: calc(var(--nph-control-height-large) * ${height}); max-inline-size: 100%;"
  >
    ${content}
  </div>`;
}

const STACK = 'display: flex; flex-direction: column; gap: var(--nph-space-stack);';
const ROW = 'display: flex; align-items: center; gap: var(--nph-space-inline);';
const FILL = 'flex: 1 1 0; min-inline-size: 0; display: flex; flex-direction: column; gap: var(--nph-space-stack-tight);';

/** A list of people loading: an avatar and two lines each. The shape of the "list" panel of the accepted frame. */
export function listContent(rows = 4): TemplateResult {
  return html`<div style=${STACK} aria-hidden="true">
    ${Array.from(
      { length: rows },
      () => html`<div style=${ROW}>
        <nph-skeleton shape="avatar-sm"></nph-skeleton>
        <div style=${FILL}><nph-skeleton shape="line"></nph-skeleton><nph-skeleton shape="line"></nph-skeleton></div>
      </div>`,
    )}
  </div>`;
}

/** A page loading: a title line, a block and lines. The shape of the "reading pane". */
export function readingContent(): TemplateResult {
  return html`<div style=${STACK} aria-hidden="true">
    <nph-skeleton shape="line"></nph-skeleton>
    <nph-skeleton shape="block" style="block-size: calc(var(--nph-control-height-large) * 2);"></nph-skeleton>
    <nph-skeleton shape="line"></nph-skeleton>
    <nph-skeleton shape="line"></nph-skeleton>
  </div>`;
}

/** A few lines loading: the shape of a short panel. */
export function linesContent(lines = 3): TemplateResult {
  return html`<div style=${STACK} aria-hidden="true">
    ${Array.from({ length: lines }, () => html`<nph-skeleton shape="line"></nph-skeleton>`)}
  </div>`;
}

export interface PanelItem {
  /** The name of the panel: the handle that controls it takes it. */
  name: string;
  content: TemplateResult;
  defaultSize?: string;
  minSize?: string;
  maxSize?: string;
  collapsedSize?: string;
  collapseLabel?: string;
  expandLabel?: string;
}

export interface GroupOptions {
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
  hideCollapseButton?: boolean;
  /** The names of the collapse button in each state. */
  collapseLabel: string;
  expandLabel: string;
  /** The size of each panel in percent. */
  sizes?: readonly number[];
  panels: readonly PanelItem[];
}

/** A group with its panels. The tags and attributes are the contract; the text comes in. */
export function group(options: GroupOptions): TemplateResult {
  const { direction = 'horizontal', disabled = false, hideCollapseButton = false, sizes, panels } = options;
  return html`<nph-resizable
    direction=${direction}
    collapse-label=${options.collapseLabel}
    expand-label=${options.expandLabel}
    sizes=${ifDefined(sizes === undefined ? undefined : sizes.join(' '))}
    ?disabled=${disabled}
    ?hide-collapse-button=${hideCollapseButton}
  >
    ${panels.map(
      (panel) => html`<div
        role="group"
        aria-label=${panel.name}
        default-size=${ifDefined(panel.defaultSize)}
        min-size=${ifDefined(panel.minSize)}
        max-size=${ifDefined(panel.maxSize)}
        collapsed-size=${ifDefined(panel.collapsedSize)}
        collapse-label=${ifDefined(panel.collapseLabel)}
        expand-label=${ifDefined(panel.expandLabel)}
      >
        ${panel.content}
      </div>`,
    )}
  </nph-resizable>`;
}

export interface PanelsText {
  collapse: string;
  expand: string;
  collapseList: string;
  expandList: string;
  list: string;
  reading: string;
  navigation: string;
  editor: string;
  console: string;
  preview: string;
  details: string;
}

/** Two panels, or three: the Figma property `paineis`. */
export function sample(
  d: PanelsText,
  options: { direction?: 'horizontal' | 'vertical'; count?: 2 | 3; disabled?: boolean; hideCollapseButton?: boolean; sizes?: readonly number[] } = {},
): TemplateResult {
  const { direction = 'horizontal', count = 2, ...rest } = options;
  const vertical = direction === 'vertical';
  const names = vertical ? [d.editor, d.console, d.preview] : [d.navigation, d.list, d.reading];
  const contents = vertical ? [readingContent(), linesContent(), linesContent(2)] : [linesContent(4), listContent(), readingContent()];
  const two = vertical ? [0, 1] : [1, 2];
  const picked = count === 2 ? two : [0, 1, 2];
  return frame(
    group({
      direction,
      collapseLabel: d.collapse,
      expandLabel: d.expand,
      ...rest,
      panels: picked.map((index) => ({ name: names[index] as string, content: contents[index] as TemplateResult })),
    }),
  );
}

/** List and reading pane: horizontal, two panels, the list with its own collapse names. */
export function listAndReading(d: PanelsText, options: { sizes?: readonly number[] } = {}): TemplateResult {
  return frame(
    group({
      collapseLabel: d.collapse,
      expandLabel: d.expand,
      ...options,
      panels: [
        { name: d.list, content: listContent(), defaultSize: '35', minSize: '20', collapseLabel: d.collapseList, expandLabel: d.expandList },
        { name: d.reading, content: readingContent(), minSize: '30' },
      ],
    }),
    'wide',
  );
}

/** Nested: the right panel of a horizontal group takes a vertical group. */
export function nested(d: PanelsText): TemplateResult {
  const inner = group({
    direction: 'vertical',
    collapseLabel: d.collapse,
    expandLabel: d.expand,
    panels: [
      { name: d.editor, content: readingContent(), defaultSize: '60' },
      { name: d.console, content: linesContent() },
    ],
  });
  return frame(
    group({
      collapseLabel: d.collapse,
      expandLabel: d.expand,
      panels: [
        { name: d.list, content: listContent(), defaultSize: '35', collapseLabel: d.collapseList, expandLabel: d.expandList },
        { name: d.details, content: inner },
      ],
    }),
    'wide',
  );
}

/** Collapsed: the left panel is collapsed, and the button, with the chevron flipped, restores it. */
export function collapsed(d: PanelsText): TemplateResult {
  return frame(
    group({
      collapseLabel: d.collapse,
      expandLabel: d.expand,
      sizes: [0, 100],
      panels: [
        { name: d.list, content: listContent(), defaultSize: '35', collapseLabel: d.collapseList, expandLabel: d.expandList },
        { name: d.reading, content: readingContent() },
      ],
    }),
    'wide',
  );
}

/** The first panel with a minimum and a maximum, shown at the size given: the handle stops at them. */
export function limited(d: PanelsText, sizes: readonly number[], min: string, max: string): TemplateResult {
  return frame(
    group({
      collapseLabel: d.collapse,
      expandLabel: d.expand,
      sizes,
      panels: [
        { name: d.list, content: listContent(), minSize: min, maxSize: max },
        { name: d.reading, content: readingContent() },
      ],
    }),
    'wide',
  );
}

/** A panel collapsed to a size of its own: it stays visible and clips what does not fit. */
export function collapsedRail(d: PanelsText): TemplateResult {
  return frame(
    group({
      collapseLabel: d.collapse,
      expandLabel: d.expand,
      sizes: [5, 95],
      panels: [
        { name: d.navigation, content: linesContent(), collapsedSize: '5', defaultSize: '30' },
        { name: d.reading, content: readingContent() },
      ],
    }),
    'wide',
  );
}
