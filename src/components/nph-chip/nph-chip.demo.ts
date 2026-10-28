/**
 * Demonstration frame shared by the `nph-chip` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the line, the box of the field, the gaps — is NOT a precedent for
 * component CSS: the piece takes every measure from tokens.
 *
 * The three examples are the mandatory ones of the accepted documentation (frame `3077:2240`):
 * the applied filters in the line of the toolbar, with "Clear filters" after the last chip;
 * the values chosen in a field, one of them invalid; and the quick filters that the person
 * checks and unchecks. The functions take the visible text as arguments: this file holds none,
 * because every visible text comes from the language dictionary of the page that calls it.
 * The avatar has no photo (`avatar-src` empty), so the frame needs no network.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-chip';
import type { NphChipSeverity, NphChipSize, NphChipType } from './nph-chip';

export type Scheme = 'light' | 'dark';

/** What a demonstration chip shows. Only `text` is required. */
export interface ChipOptions {
  type?: NphChipType;
  severity?: NphChipSeverity;
  size?: NphChipSize;
  /** A core name of `nph-icon`, before the text. */
  icon?: string;
  avatar?: boolean;
  counter?: number;
  selected?: boolean;
  marked?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** Overrides, for the invalid input demonstrations. */
  raw?: Record<string, unknown>;
}

/** The text of the three examples, already localized. */
export interface ExampleText {
  removeLabel: string;
  filters: { period: string; status: string; person: string; clear: string };
  field: string[];
  quick: string[];
}

/** The counters of the quick filters, in the order of `ExampleText.quick`. */
export const QUICK_COUNTS = [12, 8, 3];

/** One chip, with the text of the dictionary: the label it shows and the word its X says. */
export function chip(removeLabel: string, text: string, options: ChipOptions = {}): TemplateResult {
  const props = {
    type: options.type ?? 'removable',
    severity: options.severity ?? 'default',
    size: options.size ?? 'compact',
    text,
    icon: options.icon ?? '',
    avatar: options.avatar ?? false,
    avatarSrc: '',
    counter: options.counter ?? null,
    removeLabel,
    selected: options.selected ?? false,
    marked: options.marked ?? false,
    readonly: options.readonly ?? false,
    invalid: options.invalid ?? false,
    disabled: options.disabled ?? false,
    ...options.raw,
  };
  return html`<nph-chip
    .type=${props.type}
    .severity=${props.severity}
    .size=${props.size}
    .text=${props.text}
    .icon=${props.icon}
    .avatar=${props.avatar}
    .avatarSrc=${props.avatarSrc}
    .counter=${props.counter}
    .removeLabel=${props.removeLabel}
    .selected=${props.selected}
    .marked=${props.marked}
    .readonly=${props.readonly}
    .invalid=${props.invalid}
    .disabled=${props.disabled}
  ></nph-chip>`;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). A story is never duplicated per mode.
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

/** The same example in light and dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}
  </div>`;
}

/** The chips of a line wrap to the next line when there is no room: `space/inline` between them. */
export const LINE = 'display: flex; flex-wrap: wrap; align-items: center; gap: var(--nph-space-inline);';

/** Applied filters in the toolbar: a line below the bar, with "Clear filters" after the last chip. */
export function appliedFilters(text: ExampleText): TemplateResult {
  const { filters, removeLabel } = text;
  return html`<div style=${LINE}>
    ${chip(removeLabel, filters.period, { icon: 'calendar-days' })}
    ${chip(removeLabel, filters.status, { severity: 'error' })}
    ${chip(removeLabel, filters.person, { avatar: true })}
    <nph-button severity="secondary" emphasis="ghost" size="compact" text=${filters.clear}></nph-button>
  </div>`;
}

/** Values chosen in a field, the last one invalid. The field draws the border and the message. */
export function chosenValues(text: ExampleText): TemplateResult {
  const last = text.field.length - 1;
  return html`<div
    style="${LINE} padding: var(--nph-space-inline); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control);"
  >
    ${text.field.map((value, position) => chip(text.removeLabel, value, { invalid: position === last }))}
  </div>`;
}

/** Quick filters that the person checks and unchecks: counters, the first and the last checked. */
export function quickFilters(text: ExampleText): TemplateResult {
  const last = text.quick.length - 1;
  return html`<div style=${LINE}>
    ${text.quick.map((value, position) =>
      chip(text.removeLabel, value, {
        type: 'selectable',
        counter: QUICK_COUNTS[position] ?? 0,
        selected: position === 0 || position === last,
      }),
    )}
  </div>`;
}
