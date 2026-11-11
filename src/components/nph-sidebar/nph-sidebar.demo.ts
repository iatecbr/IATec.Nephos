/**
 * Demonstration frame shared by the `nph-sidebar` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the frame around the menu, its height, the product button that opens the
 * mobile menu — is NOT a precedent for component CSS: the menu takes every measure from tokens.
 * The functions take the visible text as arguments: this file holds none, because every visible
 * text comes from the language dictionary of the page that calls it.
 *
 * The flyout panel opens on a click, so the examples that show it open press its opener after
 * they draw (`showing`), as a person would. The mobile menu is a modal `<dialog>`: a page draws
 * it closed, with the button of the product that opens it, and never opens two at once.
 *
 * The four examples are the required ones of the accepted documentation: a product with many
 * areas (expanded, with the corner button), the list arriving (expanded, loading), the phone
 * (mobile, over the screen) and the collapsed menu with the flyout next to the rail button and
 * the third level next to the option.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import './nph-sidebar';
import '../nph-button/nph-button';
import type { NphSidebar, NphSidebarEntry, NphSidebarMode } from './nph-sidebar';

export type Scheme = 'light' | 'dark';

/** The text of the demonstrations, all of it from the dictionary. */
export interface SidebarText {
  label: string;
  collapseLabel: string;
  expandLabel: string;
  closeLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  cornerLabel: string;
  openMenu: string;
  emptyText: string;
  errorText: string;
  groupMain: string;
  groupAdmin: string;
  home: string;
  inbox: string;
  calendar: string;
  files: string;
  reports: string;
  monthly: string;
  annual: string;
  byTeam: string;
  alpha: string;
  beta: string;
  settings: string;
  profile: string;
  billing: string;
  plans: string;
  invoices: string;
}

/** What a demonstration changes in the menu; the rest is the same menu. */
export interface Options {
  mode?: NphSidebarMode;
  loading?: boolean;
  open?: boolean;
  hideCollapseButton?: boolean;
  hideCornerButton?: boolean;
  /** Without the search label there is no search. */
  search?: boolean;
  /** The group of the reports starts open. On by default. */
  groupOpen?: boolean;
  items?: readonly NphSidebarEntry[];
  emptyText?: string;
  errorText?: string;
  height?: string;
}

/** The entries of the menu: two groups, a current page, a counter, a disabled page and a third level. */
export function entries(text: SidebarText, groupOpen = true): NphSidebarEntry[] {
  return [
    { type: 'label', text: text.groupMain },
    { label: text.home, icon: 'house', href: '#page-1', active: true, value: 'home' },
    { label: text.inbox, icon: 'inbox', href: '#page-2', counter: 12, value: 'inbox' },
    {
      type: 'group',
      label: text.reports,
      icon: 'clipboard',
      expanded: groupOpen,
      value: 'reports',
      children: [
        { label: text.monthly, href: '#sub-1' },
        { label: text.annual, href: '#sub-2', disabled: true },
        {
          label: text.byTeam,
          options: [
            { label: text.alpha, href: '#option-1' },
            { label: text.beta, href: '#option-2', active: true },
          ],
        },
      ],
    },
    { type: 'label', text: text.groupAdmin },
    { label: text.calendar, icon: 'calendar-days', href: '#page-3' },
    { label: text.files, icon: 'folder', disabled: true },
    {
      type: 'group',
      label: text.settings,
      icon: 'gear',
      value: 'settings',
      children: [
        { label: text.profile, href: '#sub-3' },
        {
          label: text.billing,
          options: [
            { label: text.plans, href: '#option-3' },
            { label: text.invoices, href: '#option-4' },
          ],
        },
      ],
    },
  ];
}

/** The height of the column the product gives the menu, from the width of the expanded menu. */
const HEIGHT = 'calc(var(--nph-layout-sidebar-expanded) * 2)';

/** An opener a demonstration presses after it draws, by the `data-path` of the piece or of the option. */
export interface Opener {
  kind: 'rail' | 'subitem' | 'option';
  path: string;
}

const frames = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

async function press(sidebar: NphSidebar, opener: Opener): Promise<void> {
  const root = sidebar.shadowRoot;
  const selector =
    opener.kind === 'rail'
      ? `nph-sidebar-rail-button[data-path="${opener.path}"]`
      : opener.kind === 'subitem'
        ? `nph-sidebar-subitem[data-path="${opener.path}"]`
        : `.flyout .option[data-path="${opener.path}"]`;
  let target: HTMLElement | null = null;
  for (let attempt = 0; attempt < 60 && target === null; attempt += 1) {
    await sidebar.updateComplete;
    target = root?.querySelector<HTMLElement>(selector) ?? null;
    if (target === null) await frames();
  }
  if (target === null) return;
  const piece = target as HTMLElement & { updateComplete?: Promise<unknown> };
  await piece.updateComplete;
  const control = opener.kind === 'option' ? target : (target.shadowRoot?.querySelector<HTMLElement>('.control') ?? null);
  control?.click();
  await sidebar.updateComplete;
  await frames();
}

const pressed = new WeakSet<Element>();

/** Presses the openers, in order, once the menu has drawn: the flyout panels of the example. */
function showing(openers: readonly Opener[]) {
  return ref((element) => {
    if (!(element instanceof HTMLElement) || pressed.has(element)) return;
    pressed.add(element);
    const sidebar = element as NphSidebar;
    void (async () => {
      await customElements.whenDefined('nph-sidebar');
      await sidebar.updateComplete;
      await frames();
      for (const opener of openers) {
        await press(sidebar, opener);
      }
    })();
  });
}

/** The menu in a column of fixed height, with the text of the page. */
export function sidebar(text: SidebarText, options: Options = {}, openers: readonly Opener[] = []): TemplateResult {
  const mode = options.mode ?? 'expanded';
  const items = options.items ?? entries(text, options.groupOpen ?? true);
  return html`<div style="block-size: ${options.height ?? HEIGHT}; display: flex;">
    <nph-sidebar
      ${showing(openers)}
      mode=${mode}
      label=${text.label}
      collapse-label=${text.collapseLabel}
      expand-label=${text.expandLabel}
      close-label=${text.closeLabel}
      search-label=${options.search === false ? '' : text.searchLabel}
      search-placeholder=${text.searchPlaceholder}
      corner-label=${text.cornerLabel}
      empty-text=${options.emptyText ?? ''}
      error-text=${options.errorText ?? ''}
      ?loading=${options.loading ?? false}
      ?open=${options.open ?? false}
      ?hide-collapse-button=${options.hideCollapseButton ?? false}
      ?hide-corner-button=${options.hideCornerButton ?? false}
      .items=${items}
    ></nph-sidebar>
  </div>`;
}

/** The expanded menu of a product with many areas: the current page, a counter, an open group and the corner button. */
export function mainMenu(text: SidebarText, options: Options = {}): TemplateResult {
  return sidebar(text, options);
}

/** The list still arriving: nph-skeleton rows in place of the items; the logo, the search and the corner button stay. */
export function loadingMenu(text: SidebarText): TemplateResult {
  return sidebar(text, { loading: true });
}

/**
 * The phone: the button of the product that opens the menu over the screen. The menu starts
 * closed, so a page never holds more than one modal; the person opens it, and Esc, the close
 * button or the scrim close it and give the focus back to the button.
 */
export function phone(text: SidebarText, options: Options = {}): TemplateResult {
  const open = (event: Event): void => {
    const menu = (event.currentTarget as HTMLElement).parentElement?.querySelector('nph-sidebar');
    if (menu !== null && menu !== undefined) {
      (menu as NphSidebar).open = true;
    }
  };
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-inline); align-items: flex-start;">
    <nph-button severity="primary" emphasis="outline" text=${text.openMenu} @click=${open}></nph-button>
    <nph-sidebar
      mode="mobile"
      label=${text.label}
      close-label=${text.closeLabel}
      search-label=${text.searchLabel}
      search-placeholder=${text.searchPlaceholder}
      corner-label=${text.cornerLabel}
      ?loading=${options.loading ?? false}
      .items=${entries(text)}
    ></nph-sidebar>
  </div>`;
}

/** The collapsed menu with the flyout panel next to the rail button and the third level next to the option. */
export function collapsedMenu(text: SidebarText, options: Options = {}): TemplateResult {
  const openers: Opener[] = [
    { kind: 'rail', path: '3' },
    { kind: 'option', path: '3/2' },
  ];
  /* The panels are in the top layer, so the frame leaves room for them beside the rail. */
  return html`<div style="padding-inline-end: calc(var(--nph-layout-input-width) * 2);">
    ${sidebar(text, { ...options, mode: 'collapsed' }, options.open === false ? [] : openers)}
  </div>`;
}

/** The third level of the expanded menu: the subitem with options opens its panel next to it. */
export function expandedFlyout(text: SidebarText): TemplateResult {
  return html`<div style="padding-inline-end: calc(var(--nph-layout-input-width) * 1.5);">
    ${sidebar(text, {}, [{ kind: 'subitem', path: '3/2' }])}
  </div>`;
}

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

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  const schemes: Array<[Scheme, string]> = [
    ['light', captions.light],
    ['dark', captions.dark],
  ];
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${schemes.map(([scheme, caption]) => inScheme(scheme, caption, content()))}
  </div>`;
}
