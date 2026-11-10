/**
 * Demonstration frame shared by the `nph-tabs` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the card around a segmented list, the widths that force the
 * scroll and the cut label — is NOT a precedent for component CSS: the piece takes its measures from
 * the `tabs/*` tokens.
 *
 * The three examples are the required ones of the accepted documentation (frame `3483:11200`):
 * requests by step with icon, counter and tag; the request detail inside a panel; and the arrows at
 * both ends when the tabs do not fit. Every visible text comes from the dictionary, passed in by the
 * page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import { format } from '../../../.storybook/i18n/index.js';
import './nph-tabs';
import type { NphTab, NphTabs } from './nph-tabs';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `tabsValidation` dictionary. */
export interface ExampleTexts {
  navLabel: string;
  scrollPreviousLabel: string;
  scrollNextLabel: string;
  all: string;
  pending: string;
  review: string;
  done: string;
  newTag: string;
  items: string;
  stateActive: string;
  stateRest: string;
  stateDisabled: string;
  longLabels: string[];
  sections: string[];
  panels: Record<string, string>;
  detailTitle: string;
  detailText: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: 100%; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, one under the other. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

/** The icon of each tab, when the list uses icons: the same on every tab. */
const ICONS = ['folder', 'star', 'tag', 'gear', 'file'] as const;

export interface ContentOptions {
  /** An icon on every tab. */
  icons?: boolean;
  /** A counter on every tab but the first. */
  counters?: boolean;
  /** A tag on the last tab. */
  tag?: boolean;
}

/** The requests, by step: the four tabs of the examples, with the content a list may turn on. */
export function requestTabs(texts: ExampleTexts, { icons = false, counters = false, tag = false }: ContentOptions = {}): NphTab[] {
  const steps: Array<[string, string, number]> = [
    ['all', texts.all, 0],
    ['pending', texts.pending, 12],
    ['review', texts.review, 5],
    ['done', texts.done, 3],
  ];
  return steps.map(([value, text, count], index) => ({
    value,
    text,
    ...(icons ? { icon: ICONS[index] as string } : {}),
    ...(counters && index > 0 ? { counter: count, counterLabel: format(texts.items, { count: String(count) }) } : {}),
    ...(tag && index === steps.length - 1 ? { tag: texts.newTag } : {}),
  }));
}

/** The panels of the requests: plain text the consumer owns, slotted by the value of each tab. */
export function requestPanels(texts: ExampleTexts, tabs: readonly NphTab[]): TemplateResult[] {
  return tabs.map((tab) => html`<p slot=${tab.value} style="margin: 0; padding-block: var(--nph-space-stack);">${texts.panels[tab.value] ?? ''}</p>`);
}

export interface ListOptions extends ContentOptions {
  variant?: NphTabs['variant'];
  /** The `value` of the active tab. */
  value?: string;
  activation?: NphTabs['activation'];
  /** Draws the panels under the list. */
  panels?: boolean;
  /** The width of the frame, to force the scroll or the cut label. */
  width?: string;
  tabs?: NphTab[];
}

/** A list of the requests, in a style, with the content and the width asked for. */
export function list(texts: ExampleTexts, options: ListOptions = {}): TemplateResult {
  const { variant = 'segmented', value, activation = 'automatic', panels = false, width, tabs } = options;
  const own = tabs ?? requestTabs(texts, options);
  const tag = html`<nph-tabs
    .tabs=${own}
    variant=${variant}
    activation=${activation}
    value=${value ?? own[1]?.value ?? ''}
    label=${texts.navLabel}
    scroll-previous-label=${texts.scrollPreviousLabel}
    scroll-next-label=${texts.scrollNextLabel}
    >${panels ? requestPanels(texts, own) : ''}</nph-tabs
  >`;
  return width === undefined ? tag : html`<div style="inline-size: ${width}; max-inline-size: 100%;">${tag}</div>`;
}

/** The tabs that do not fit in a narrow list: twelve sections, each with its own width. */
export function sectionTabs(texts: ExampleTexts): NphTab[] {
  return texts.sections.map((text, index) => ({ value: `section-${String(index)}`, text }));
}

/** The tabs with a label too long for a narrow list: the label is cut and the balloon holds it all. */
export function longTabs(texts: ExampleTexts): NphTab[] {
  return texts.longLabels.map((text, index) => ({ value: `long-${String(index)}`, text }));
}

/** The three states a tab can be in without the pointer or the keyboard: active, rest and disabled. */
export function stateTabs(texts: ExampleTexts, activeAndDisabled = false): NphTab[] {
  return [
    { value: 'active', text: texts.stateActive, ...(activeAndDisabled ? { disabled: true } : {}) },
    { value: 'rest', text: texts.stateRest },
    { value: 'disabled', text: texts.stateDisabled, disabled: true },
  ];
}

/** A list of the three states, optionally with the active tab disabled too (rule T11). */
export function stateList(texts: ExampleTexts, variant: NphTabs['variant'], activeAndDisabled: boolean): TemplateResult {
  return list(texts, { variant, tabs: stateTabs(texts, activeAndDisabled), value: 'active' });
}

/** The first required example: requests by step, with icon, counter and tag. */
export function requestsExample(texts: ExampleTexts): TemplateResult {
  return list(texts, { variant: 'underline', icons: true, counters: true, tag: true, value: 'pending', panels: true });
}

/** The second required example: the detail of a request inside a panel (a card), with a segmented list on top. */
export function detailExample(texts: ExampleTexts): TemplateResult {
  const tabs: NphTab[] = [
    { value: 'all', text: texts.detailTitle },
    { value: 'pending', text: texts.pending },
    { value: 'review', text: texts.review },
  ];
  return html`<div
    style="display: flex; flex-direction: column; gap: var(--nph-space-stack); padding: var(--nph-space-section); background: var(--nph-color-background); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control);"
  >
    ${list(texts, {
      variant: 'segmented',
      tabs,
      value: 'all',
      panels: false,
    })}
    <p style="margin: 0;">${texts.detailText}</p>
  </div>`;
}

/** The third required example: the arrows at both ends, when the tabs do not fit. */
export function scrollExample(texts: ExampleTexts): TemplateResult {
  return list(texts, { variant: 'underline', tabs: sectionTabs(texts), value: 'section-2', width: 'calc(var(--nph-layout-field-width) * 1.25)' });
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-section);">
    ${requestsExample(texts)} ${detailExample(texts)} ${scrollExample(texts)}
  </div>`;
}
