/**
 * Demonstration frame shared by the `nph-dropdown-menu` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the framed figure, the trigger and the room kept below it
 * for the open menu — is NOT a precedent for component CSS: the menu takes its measures
 * from its own tokens and its place from the trigger, in the top layer.
 *
 * The three examples are the required ones of the accepted board (`1365:118`): the
 * account menu with the profile header, single choice with a counter, and tag, switch and
 * destructive. The functions take the visible text as arguments: this file holds none,
 * because every visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-dropdown-menu';
import type { NphDropdownMenuEntry, NphDropdownMenuHeader, NphDropdownMenuSize } from './nph-dropdown-menu';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the
 * tokens (P67). The open menu is a descendant of the figure, so it takes its scheme too.
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

/** The same example in light and in dark mode, side by side. */
export function bothModes(captions: { light: string; dark: string }, content: () => TemplateResult): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content())} ${inScheme('dark', captions.dark, content())}
  </div>`;
}

export interface MenuOptions {
  /** The text of the trigger button. */
  trigger: string;
  items: NphDropdownMenuEntry[];
  header?: NphDropdownMenuHeader | null;
  size?: NphDropdownMenuSize;
  open?: boolean;
}

let nextId = 0;

/**
 * An `nph-button` and its menu. The room below the trigger holds the open menu, so it
 * does not cover the next example: one row per entry, plus the header.
 */
export function menuWith({ trigger, items, header = null, size = 'default', open = false }: MenuOptions): TemplateResult {
  const id = `nph-dropdown-menu-demo-${++nextId}`;
  const rows = items.length + (header === null ? 0 : 2);
  const room = open
    ? `calc(var(--nph-control-height-default) + ${rows} * (var(--nph-icon-size-md) + 2 * var(--nph-space-inline)) + var(--nph-space-section))`
    : 'auto';
  return html`<div style="display: flex; flex-direction: column; align-items: flex-start; min-block-size: ${room}; inline-size: var(--nph-layout-input-width); max-inline-size: 100%;">
    <nph-button id=${id} severity="primary" emphasis="outline" icon-end="chevron-down" text=${trigger}></nph-button>
    <nph-dropdown-menu for=${id} size=${size} ?open=${open} .items=${items} .header=${header}></nph-dropdown-menu>
  </div>`;
}

/** The texts of the account menu, from the dictionary. */
export interface AccountTexts {
  accountTrigger: string;
  name: string;
  status: string;
  accountGroup: string;
  profile: string;
  settings: string;
  signOut: string;
}

/** Account menu: the profile header, a group and the destructive sign out. */
export function accountMenu(t: AccountTexts, open = true): TemplateResult {
  return menuWith({
    trigger: t.accountTrigger,
    open,
    header: { name: t.name, status: t.status },
    items: [
      { type: 'label', text: t.accountGroup },
      { value: 'profile', text: t.profile, icon: 'user' },
      { value: 'settings', text: t.settings, icon: 'gear' },
      { type: 'separator' },
      { value: 'sign-out', text: t.signOut, icon: 'right-from-bracket', severity: 'destructive' },
    ],
  });
}

/** The texts of the view menu, from the dictionary. */
export interface ViewTexts {
  viewTrigger: string;
  viewGroup: string;
  list: string;
  grid: string;
  unread: string;
}

/** Single choice with a counter: the check at the end of the checked item. */
export function viewMenu(t: ViewTexts, open = true): TemplateResult {
  return menuWith({
    trigger: t.viewTrigger,
    open,
    items: [
      { type: 'label', text: t.viewGroup },
      { value: 'list', text: t.list, icon: 'list', selection: 'single', checked: true },
      { value: 'grid', text: t.grid, icon: 'grid-2', selection: 'single' },
      { type: 'separator' },
      { value: 'unread', text: t.unread, icon: 'paper-plane', count: 12 },
    ],
  });
}

/** The texts of the options menu, from the dictionary. */
export interface OptionsTexts {
  trigger: string;
  share: string;
  newTag: string;
  sync: string;
  delete: string;
}

/** Tag, switch and destructive. */
export function optionsMenu(t: OptionsTexts, open = true): TemplateResult {
  return menuWith({
    trigger: t.trigger,
    open,
    items: [
      { value: 'share', text: t.share, icon: 'share', tag: t.newTag },
      { value: 'sync', text: t.sync, icon: 'rotate-right', switch: true, checked: true },
      { type: 'separator' },
      { value: 'delete', text: t.delete, icon: 'trash', severity: 'destructive' },
    ],
  });
}
