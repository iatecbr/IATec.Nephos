/**
 * Demonstration frame shared by the `nph-toolbar` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index
 * it. The scenery here — the framed figure and the column that stacks the page bar over its
 * applied filters — is NOT a precedent for component CSS: the bar takes its measures from the
 * `toolbar/*` tokens and every piece from its own.
 *
 * The bars are the ones of the accepted documentation (`2944:6528`): bulk ("2 of 6 selected",
 * Clear selection, Export, Delete), page (Search people, Filter, New person), tools (groups of
 * icon-only actions, the trash apart and More last), floating (count, actions and Close last)
 * and the applied filters strip below the page bar. The functions take the visible text as
 * arguments: this file holds none, because every visible text comes from the language
 * dictionary of the page that calls it.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import '../nph-checkbox/nph-checkbox';
import '../nph-chip/nph-chip';
import '../nph-input/nph-input';
import '../nph-separator/nph-separator';
import '../nph-toggle-group/nph-toggle-group';
import '../nph-togglebutton/nph-togglebutton';
import './nph-toolbar';
import type { NphToolbarSize } from './nph-toolbar';

export type Scheme = 'light' | 'dark';

/** The text the bars show, from the dictionary of the calling page. */
export interface ToolbarText {
  tableActions: string;
  people: string;
  editor: string;
  selection: string;
  appliedFilters: string;
  count: string;
  countExample: string;
  selectAll: string;
  clearSelection: string;
  export: string;
  delete: string;
  search: string;
  filter: string;
  newPerson: string;
  download: string;
  settings: string;
  view: string;
  list: string;
  grid: string;
  bold: string;
  italic: string;
  underline: string;
  link: string;
  print: string;
  more: string;
  close: string;
  filters: string[];
  removeFilter: string;
  clearFilters: string;
  removed: string;
  cleared: string;
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

export interface BarOptions {
  size?: NphToolbarSize;
  /** The Figma `caixa de seleção`: off when the table already has the checkbox in its header. */
  checkbox?: boolean;
  /** The Figma `centro`: the view switch in the middle. */
  center?: boolean;
  /** The Figma `limpar em ícone`: the X only, for a narrow bar. */
  clearIcon?: boolean;
  /** The count text; the default one of the documentation otherwise. */
  count?: string;
  /** The main action of the page bar is disabled or loading. */
  createState?: 'disabled' | 'loading';
}

function viewSwitch(t: ToolbarText): TemplateResult {
  return html`<nph-toggle-group slot="center" label=${t.view} value="list">
    <nph-togglebutton value="list" text=${t.list} icon-start="none"></nph-togglebutton>
    <nph-togglebutton value="grid" text=${t.grid} icon-start="none"></nph-togglebutton>
  </nph-toggle-group>`;
}

/** Bulk: checkbox, count, Clear selection, Export and, after a divider, Delete. */
export function bulkBar(t: ToolbarText, options: BarOptions = {}): TemplateResult {
  const { size = 'default', checkbox = true, center = false, clearIcon = false, count = t.count } = options;
  return html`<nph-toolbar type="bulk" size=${size} label=${t.tableActions} count-text=${count}>
    ${checkbox ? html`<nph-checkbox slot="checkbox" label=${t.selectAll} .indeterminate=${true}></nph-checkbox>` : nothing}
    ${clearIcon
      ? html`<nph-button severity="secondary" emphasis="ghost" icon-start="xmark" label=${t.clearSelection}></nph-button>`
      : html`<nph-button severity="secondary" emphasis="ghost" text=${t.clearSelection}></nph-button>`}
    ${center ? viewSwitch(t) : nothing}
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="download" text=${t.export}></nph-button>
    <nph-separator slot="end" orientation="vertical"></nph-separator>
    <nph-button slot="end" severity="danger" emphasis="ghost" icon-start="trash" text=${t.delete}></nph-button>
  </nph-toolbar>`;
}

/** Page: search and Filter at the start, download, settings and New person at the end. */
export function pageBar(t: ToolbarText, options: BarOptions & { triggerId?: string } = {}): TemplateResult {
  const { size = 'default', center = false, createState, triggerId } = options;
  return html`<nph-toolbar type="page" size=${size} label=${t.people}>
    <nph-input type="search" label=${t.search} placeholder=${t.search} icon-start="magnifying-glass"></nph-input>
    <nph-button
      id=${triggerId ?? nothing}
      severity="secondary"
      emphasis="ghost"
      icon-start="filter"
      text=${t.filter}
    ></nph-button>
    ${center ? viewSwitch(t) : nothing}
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="download" label=${t.download}></nph-button>
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="gear" label=${t.settings}></nph-button>
    <nph-button
      slot="end"
      icon-start="plus"
      text=${t.newPerson}
      ?disabled=${createState === 'disabled'}
      ?loading=${createState === 'loading'}
    ></nph-button>
  </nph-toolbar>`;
}

/** Tools: groups of icon-only actions, the trash in a group of its own and More last. */
export function toolsBar(t: ToolbarText, options: BarOptions = {}): TemplateResult {
  const { size = 'default', center = false } = options;
  const icon = (name: string, label: string, slot?: string): TemplateResult =>
    html`<nph-button slot=${slot ?? nothing} severity="secondary" emphasis="ghost" icon-start=${name} label=${label}></nph-button>`;
  return html`<nph-toolbar type="tools" size=${size} label=${t.editor}>
    ${icon('bold', t.bold)} ${icon('italic', t.italic)} ${icon('underline', t.underline)}
    <nph-separator orientation="vertical"></nph-separator>
    ${icon('link', t.link)} ${icon('print', t.print)}
    ${center ? viewSwitch(t) : nothing}
    <nph-button slot="end" severity="danger" emphasis="ghost" icon-start="trash" label=${t.delete}></nph-button>
    <nph-separator slot="end" orientation="vertical"></nph-separator>
    ${icon('ellipsis', t.more, 'end')}
  </nph-toolbar>`;
}

/** Floating: the count, the actions and Close last. */
export function floatingBar(t: ToolbarText, options: BarOptions = {}): TemplateResult {
  const { size = 'default', center = false, count = t.count } = options;
  return html`<nph-toolbar type="floating" size=${size} label=${t.selection} count-text=${count}>
    ${center ? viewSwitch(t) : nothing}
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="download" text=${t.export}></nph-button>
    <nph-separator slot="end" orientation="vertical"></nph-separator>
    <nph-button slot="end" severity="danger" emphasis="ghost" icon-start="trash" label=${t.delete}></nph-button>
    <nph-button slot="end" severity="secondary" emphasis="ghost" icon-start="xmark" label=${t.close}></nph-button>
  </nph-toolbar>`;
}

/** The person removes a filter: the demonstration takes the chip away, as a consumer would. */
function removeChip(event: Event): void {
  (event.target as Element).remove();
}

/** Clear filters: the demonstration takes every chip away. */
function clearChips(event: Event): void {
  const bar = (event.currentTarget as Element).closest('nph-toolbar');
  bar?.querySelectorAll('nph-chip').forEach((chip) => chip.remove());
}

/** Applied filters: one removable chip per filter and Clear filters after the last one. */
export function appliedFiltersStrip(t: ToolbarText, options: { size?: NphToolbarSize | undefined; triggerId: string }): TemplateResult {
  const { size = 'default', triggerId } = options;
  return html`<nph-toolbar
    type="applied-filters"
    size=${size}
    label=${t.appliedFilters}
    trigger=${triggerId}
    removed-text=${t.removed}
    cleared-text=${t.cleared}
   
    @nph-remove=${removeChip}
  >
    ${t.filters.map((filter) => html`<nph-chip text=${filter} remove-label=${t.removeFilter}></nph-chip>`)}
    <nph-button severity="secondary" emphasis="ghost" text=${t.clearFilters} @click=${clearChips}></nph-button>
  </nph-toolbar>`;
}

let nextTrigger = 0;

/** The page bar with its applied filters strip below it, the Filter button as the trigger. */
export function pageWithFilters(t: ToolbarText, options: BarOptions = {}): TemplateResult {
  nextTrigger += 1;
  const triggerId = `nph-toolbar-demo-filter-${nextTrigger}`;
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline);">
    ${pageBar(t, { ...options, triggerId })} ${appliedFiltersStrip(t, { size: options.size, triggerId })}
  </div>`;
}
