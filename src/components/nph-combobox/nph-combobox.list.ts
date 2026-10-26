/**
 * The list of `nph-combobox` (the Figma `nph-combobox / lista`, `1359:141`), as a module
 * another field takes: `nph-multi-combobox` (DSA-31) consumes it instead of building its own
 * (P95). It is not a tag: the field that owns the list draws it in its own shadow root, with
 * the styles exported here, so the input, the listbox and the options share one root.
 *
 * What it gives:
 * - the entries of the list, the `options` of the field: an option, a group label and a
 *   separator, as the entries of `nph-dropdown-menu` (P92);
 * - the search: a text matches when it contains the typed text, with no difference of case
 *   or accent; the first match is the highlighted stretch;
 * - the groups: a label names the options that follow it, and a separator closes a group;
 * - the drawing of the options, each an `nph-option` (P91) with the typed stretch in
 *   `text/highlight-weight` and the rest in `color/muted-foreground`; of the group label and
 *   the separator, in the look of `nph-dropdown-menu`; and of the create row.
 *
 * Every option keeps the `nph-option` contract: the start, the dot, the secondary text, the
 * selected and the active looks are the option's own.
 */
import { html, nothing, unsafeCSS } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-option/nph-option';
import '../nph-separator/nph-separator';
import { isCoreName } from '../nph-icon/nph-icon.icons';
import { NPH_OPTION_STARTS, NPH_OPTION_STATUSES } from '../nph-option/nph-option';
import type { NphOptionStart, NphOptionStatus } from '../nph-option/nph-option';
import listCss from './nph-combobox.list.css?inline';

/** The style of the list: the layer, the inside, the groups, the highlight, the states and the footer. */
export const comboboxListStyles = unsafeCSS(listCss);

/** One option of the list. */
export interface NphComboboxOption {
  type?: 'option';
  /** The value the option gives the form. */
  value: string;
  /** The label, already localized by the consuming application. */
  text: string;
  /** The helper text after the label (the option `secondary`). */
  secondary?: string;
  /** The start of the option: `none` (default), `icon`, `avatar` or `dot` (P91). */
  start?: NphOptionStart;
  /** A core name of `nph-icon`, with `start: 'icon'`. Absent: `globe`. */
  icon?: string;
  /** The photo of the avatar, with `start: 'avatar'`. Absent or empty: the empty avatar. */
  src?: string;
  /** The color of the dot, with `start: 'dot'`. */
  status?: NphOptionStatus;
  disabled?: boolean;
}

/** The name of the group that follows it. */
export interface NphComboboxLabel {
  type: 'label';
  text: string;
}

/** The line that closes a group. */
export interface NphComboboxSeparator {
  type: 'separator';
}

export type NphComboboxEntry = NphComboboxOption | NphComboboxLabel | NphComboboxSeparator;

/** A group of the list: its label (empty for none), whether a line opens it, and its options. */
export interface NphComboboxGroup {
  readonly label: string;
  readonly separated: boolean;
  readonly options: readonly NphComboboxOption[];
}

/** The text with the spaces at both ends removed; anything else becomes empty. */
export function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Whether an entry is an option (an entry with no `type` is one). */
export function isOption(entry: NphComboboxEntry): entry is NphComboboxOption {
  return entry.type === undefined || entry.type === 'option';
}

/**
 * The causes that keep an entry out of the list, one sentence each. An option needs a string
 * `value` and a non-empty `text`; its `start`, `icon` and `status` follow `nph-option`.
 */
export function entryProblems(entry: unknown): string[] {
  if (typeof entry !== 'object' || entry === null) {
    return ['an entry is not an object'];
  }
  const candidate = entry as { type?: unknown; value?: unknown; text?: unknown; start?: unknown; icon?: unknown; status?: unknown };
  if (candidate.type === 'separator') {
    return [];
  }
  if (candidate.type === 'label') {
    return trimmed(candidate.text) === '' ? ['a label entry has no text'] : [];
  }
  if (candidate.type !== undefined && candidate.type !== 'option') {
    return [`an entry type "${String(candidate.type)}" does not exist. Use option, label or separator`];
  }
  const problems: string[] = [];
  if (typeof candidate.value !== 'string') {
    problems.push('an option has no string value');
  }
  if (trimmed(candidate.text) === '') {
    problems.push('an option has no text');
  }
  const start = candidate.start === undefined ? 'none' : String(candidate.start);
  if (!(NPH_OPTION_STARTS as readonly string[]).includes(start)) {
    problems.push(`an option start "${start}" does not exist. Use ${NPH_OPTION_STARTS.join(', ')}`);
  }
  if (candidate.icon !== undefined && !isCoreName(trimmed(candidate.icon))) {
    problems.push(`an option icon "${String(candidate.icon)}" is not a core name of nph-icon`);
  }
  if (candidate.status !== undefined && !(NPH_OPTION_STATUSES as readonly string[]).includes(String(candidate.status))) {
    problems.push(`an option status "${String(candidate.status)}" does not exist. Use ${NPH_OPTION_STATUSES.join(', ')}`);
  }
  return problems;
}

/**
 * The text folded for the search, with the place of each folded character in the original
 * text: no accent (the marks of the canonical decomposition) and lower case.
 */
function folded(text: string): { key: string; at: number[] } {
  let key = '';
  const at: number[] = [];
  let index = 0;
  for (const character of text) {
    const bare = character.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();
    for (const unit of bare) {
      key += unit;
      at.push(index);
    }
    index += character.length;
  }
  at.push(index);
  return { key, at };
}

/**
 * The first stretch of `text` that matches `query`, with no difference of case or accent, as
 * `[start, end]` in the original text. `null` when it does not contain it or the query is empty.
 */
export function matchRange(text: string, query: string): readonly [number, number] | null {
  const needle = folded(query.trim()).key;
  if (needle === '') {
    return null;
  }
  const { key, at } = folded(text);
  const found = key.indexOf(needle);
  if (found === -1) {
    return null;
  }
  return [at[found] ?? 0, at[found + needle.length] ?? text.length];
}

/** Whether the text contains the query, with no difference of case or accent. An empty query matches. */
export function matches(text: string, query: string): boolean {
  return query.trim() === '' || matchRange(text, query) !== null;
}

/**
 * The groups of the entries, as in `nph-dropdown-menu` (P92): a `label` opens a group and a
 * `separator` closes one. Options before the first label, or after a separator with no
 * label, form a group with no name. A separator draws a line before the next group.
 */
export function groupsOf(entries: readonly NphComboboxEntry[]): NphComboboxGroup[] {
  const groups: Array<{ label: string; separated: boolean; options: NphComboboxOption[] }> = [];
  let current: { label: string; separated: boolean; options: NphComboboxOption[] } | null = null;
  let separated = false;
  for (const entry of entries) {
    if (entry.type === 'separator') {
      current = null;
      separated = groups.length > 0;
    } else if (entry.type === 'label') {
      current = { label: trimmed(entry.text), separated, options: [] };
      separated = false;
      groups.push(current);
    } else {
      if (current === null) {
        current = { label: '', separated, options: [] };
        separated = false;
        groups.push(current);
      }
      current.options.push(entry);
    }
  }
  return dropEmpty(groups);
}

/** An empty group is dropped; the line before it goes to the next group that is drawn. */
function dropEmpty(groups: readonly NphComboboxGroup[]): NphComboboxGroup[] {
  const drawn: NphComboboxGroup[] = [];
  let carried = false;
  for (const group of groups) {
    if (group.options.length === 0) {
      carried = carried || group.separated;
      continue;
    }
    drawn.push({ ...group, separated: drawn.length > 0 && (group.separated || carried) });
    carried = false;
  }
  return drawn;
}

/** The groups with only the options whose text matches the query; a group left empty goes away. */
export function filterGroups(groups: readonly NphComboboxGroup[], query: string): NphComboboxGroup[] {
  return dropEmpty(groups.map((group) => ({ ...group, options: group.options.filter((option) => matches(option.text, query)) })));
}

/**
 * The text of an option with the typed stretch highlighted: the stretch in
 * `text/highlight-weight`, the rest in `color/muted-foreground` (the `busca` list). With no
 * query, or no match, the plain text.
 */
export function highlighted(text: string, query: string): TemplateResult | string {
  const range = matchRange(text, query);
  if (range === null) {
    return text;
  }
  const [start, end] = range;
  const before = text.slice(0, start);
  const after = text.slice(end);
  return html`${before === '' ? nothing : html`<span class="rest">${before}</span>`}<span class="match">${text.slice(start, end)}</span>${after === '' ? nothing : html`<span class="rest">${after}</span>`}`;
}

/** What the list needs to draw an option row. */
export interface NphComboboxRowState {
  readonly id: string;
  readonly query: string;
  readonly selected: boolean;
  readonly active: boolean;
}

/** One option row: an `nph-option` (P91), with the typed stretch highlighted in its label. */
export function renderOption(option: NphComboboxOption, state: NphComboboxRowState): TemplateResult {
  const start = option.start ?? 'none';
  const secondary = trimmed(option.secondary);
  return html`<nph-option
    id=${state.id}
    start=${start}
    icon=${option.icon === undefined ? nothing : trimmed(option.icon)}
    src=${start === 'avatar' ? trimmed(option.src) : nothing}
    status=${option.status === undefined ? nothing : option.status}
    secondary=${secondary === '' ? nothing : secondary}
    ?disabled=${option.disabled === true}
    .selected=${state.selected}
    .active=${state.active}
    >${highlighted(trimmed(option.text), state.query)}</nph-option
  >`;
}

/**
 * A group: the label, in the look of the `nph-dropdown-menu` group label, names the options
 * for the screen reader; the separator is the `nph-separator`, hidden from it.
 */
export function renderGroup(group: NphComboboxGroup, labelId: string, rows: TemplateResult[]): TemplateResult {
  const separator = group.separated ? html`<nph-separator class="separator" aria-hidden="true"></nph-separator>` : nothing;
  if (group.label === '') {
    return html`${separator}<div class="group" role="group">${rows}</div>`;
  }
  return html`${separator}<div class="group" role="group" aria-labelledby=${labelId}>
      <div class="group-label" id=${labelId}>${group.label}</div>
      ${rows}
    </div>`;
}

/**
 * The create row (the `criar` list): an option with the `plus` icon that offers the typed
 * text as a new item, after `label`, with the typed text in quotes and highlighted (D-1).
 */
export function renderCreate(label: string, text: string, state: Omit<NphComboboxRowState, 'query' | 'selected'>): TemplateResult {
  return html`<nph-option id=${state.id} class="create" start="icon" icon="plus" .active=${state.active}
    >${label} “<span class="match">${text}</span>”</nph-option
  >`;
}
