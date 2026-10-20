/**
 * Demonstration frame shared by the `nph-toggle-group` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does
 * not index it. The scenery here — the framed figure — is NOT a precedent for
 * component CSS: the group takes its only measure, the space between buttons, from
 * `space/inline`, and each button takes the rest from its own tokens.
 *
 * The three examples are the required ones of the accepted frame (`1580:61`):
 * "Alignment" (icon only, single selection), "Formatting" (icon only, multiple
 * selection) and "View" (with text, single selection). The functions take the
 * visible text as arguments: this file holds none, because every visible text comes
 * from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-togglebutton/nph-togglebutton';
import './nph-toggle-group';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that
 * resolves the tokens (P67). A story is never duplicated per mode.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: var(--nph-layout-field-width); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

export interface GroupItem {
  /** What the group reads from the `value` attribute of the button. */
  value: string;
  /** The label of an option with text. Without it, the button is icon only. */
  text?: string;
  /** The accessible name of an icon-only button. */
  label?: string;
  /** A core icon name: one fixed icon. Without it, the default icons. */
  icon?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export interface GroupOptions {
  /** The name of the group: the subject. */
  label: string;
  selection?: 'single' | 'multiple';
  /** The checked buttons. */
  value?: readonly string[];
  items: readonly GroupItem[];
}

/** A group with its buttons. The tags and attributes are the contract; the text comes in. */
export function group(options: GroupOptions): TemplateResult {
  const { label, selection = 'single', value = [], items } = options;
  return html`<nph-toggle-group label=${label} selection=${selection} value=${value.join(' ')}>
    ${items.map(
      (item) => html`<nph-togglebutton
        value=${item.value}
        text=${item.text ?? ''}
        label=${item.label ?? ''}
        icon-start=${item.icon ?? 'auto'}
        ?disabled=${item.disabled ?? false}
        ?invalid=${item.invalid ?? false}
      ></nph-togglebutton>`,
    )}
  </nph-toggle-group>`;
}

export interface AlignmentText {
  group: string;
  left: string;
  center: string;
  right: string;
}

/** Alignment: icon only, single selection. */
export function alignment(d: AlignmentText, value: readonly string[] = ['left']): TemplateResult {
  return group({
    label: d.group,
    value,
    items: [
      { value: 'left', label: d.left, icon: 'align-left' },
      { value: 'center', label: d.center, icon: 'align-center' },
      { value: 'right', label: d.right, icon: 'align-right' },
    ],
  });
}

export interface FormattingText {
  group: string;
  bold: string;
  italic: string;
  underline: string;
}

/** Formatting: icon only, multiple selection. */
export function formatting(d: FormattingText, value: readonly string[] = ['bold']): TemplateResult {
  return group({
    label: d.group,
    selection: 'multiple',
    value,
    items: [
      { value: 'bold', label: d.bold, icon: 'bold' },
      { value: 'italic', label: d.italic, icon: 'italic' },
      { value: 'underline', label: d.underline, icon: 'underline' },
    ],
  });
}

export interface ViewText {
  group: string;
  list: string;
  grid: string;
  table: string;
}

/** View: with text, single selection. */
export function view(d: ViewText, value: readonly string[] = ['list']): TemplateResult {
  return group({
    label: d.group,
    value,
    items: [
      { value: 'list', text: d.list },
      { value: 'grid', text: d.grid },
      { value: 'table', text: d.table },
    ],
  });
}
