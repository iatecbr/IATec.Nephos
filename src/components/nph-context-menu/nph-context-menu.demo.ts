/**
 * Demonstration frame shared by the `nph-context-menu` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the framed figure, the object that takes the right click and the room kept
 * under its top start corner for the open menu — is NOT a precedent for component CSS: the menu
 * takes its measures from the `dropdown/*` tokens and its place from the point, in the top layer.
 *
 * A menu on a page that is not opened by a right click is opened from code (`open`): it sits at
 * the start top corner of its object, as the three required examples of the accepted
 * documentation (`4838:27591`) show it. The submenu is shown open with `open-submenu`. The
 * functions take the visible text as arguments: this file holds none, because every visible text
 * comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-icon/nph-icon';
import './nph-context-menu';
import type { NphContextMenuEntry, NphContextMenuSize } from './nph-context-menu';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). The open menu is a descendant of the figure, so it takes its scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: calc(2 * var(--nph-layout-input-width)); max-inline-size: 100%; box-sizing: border-box;"
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
  /** The text that names the object under the pointer. */
  object: string;
  items: NphContextMenuEntry[];
  size?: NphContextMenuSize;
  /** Shows the menu open at the start top corner of the object. */
  open?: boolean;
  /** The `value` of the item whose submenu is shown open. */
  submenu?: string;
  /** Pins the object to the end of the line, so there is no room for the submenu on that side. */
  pinned?: boolean;
  /** The rows of the open menu, to keep the room under the object. */
  rows?: number;
}

let nextId = 0;

/** The rows of an entry list, counting a submenu as the rows of its own list too. */
export function rowsOf(entries: readonly NphContextMenuEntry[]): number {
  return entries.length;
}

/**
 * An object that takes the right click and its menu. The room under the object holds the open
 * menu, so it does not cover the next example: one row per entry.
 */
export function menuWith({ object, items, size = 'default', open = false, submenu = '', pinned = false, rows = rowsOf(items) }: MenuOptions): TemplateResult {
  const id = `nph-context-menu-demo-${++nextId}`;
  const room = open
    ? `calc(${rows} * (var(--nph-icon-size-md) + 2 * var(--nph-space-inline)) + 2 * var(--nph-space-section))`
    : 'var(--nph-control-height-large)';
  const side = pinned ? 'margin-inline-start: auto;' : '';
  return html`<div style="display: flex; flex-direction: column; inline-size: 100%;">
    <div
      id=${id}
      tabindex="0"
      style="box-sizing: border-box; inline-size: var(--nph-layout-input-width); max-inline-size: 100%; min-block-size: ${room}; ${side} padding: var(--nph-space-inline); display: flex; align-items: flex-end; justify-content: flex-end; border: var(--nph-border-width) dashed var(--nph-color-border); border-radius: var(--nph-radius-control); color: var(--nph-color-muted-foreground);"
    >
      ${object}
    </div>
    <nph-context-menu for=${id} size=${size} ?open=${open} open-submenu=${submenu} .items=${items}></nph-context-menu>
  </div>`;
}

/** The texts of the file menu, from the dictionary. */
export interface FileTexts {
  object: string;
  back: string;
  reload: string;
  copyLink: string;
  edit: string;
  share: string;
  delete: string;
  downloadFile: string;
  moreOptions: string;
  shortcutBack: string;
  shortcutReload: string;
  shortcutCopyLink: string;
  shortcutEdit: string;
  shortcutDelete: string;
}

/** The actions of a file: shortcuts, an item with a submenu and the destructive item last, after a separator. */
export function fileItems(t: FileTexts): NphContextMenuEntry[] {
  return [
    { value: 'back', text: t.back, icon: 'arrow-left', shortcut: t.shortcutBack },
    { value: 'reload', text: t.reload, icon: 'rotate-right', shortcut: t.shortcutReload },
    { value: 'copy-link', text: t.copyLink, icon: 'link', shortcut: t.shortcutCopyLink },
    { value: 'edit', text: t.edit, icon: 'pen', shortcut: t.shortcutEdit },
    {
      value: 'share',
      text: t.share,
      icon: 'share',
      submenu: [
        { value: 'share-copy-link', text: t.copyLink, icon: 'link' },
        { value: 'share-download', text: t.downloadFile, icon: 'download' },
        { value: 'share-more', text: t.moreOptions, icon: 'ellipsis' },
      ],
    },
    { type: 'separator' },
    { value: 'delete', text: t.delete, icon: 'trash', severity: 'destructive', shortcut: t.shortcutDelete },
  ];
}

/** Required example 1: the closed menu — actions with shortcuts, an item with a submenu and the destructive item last. */
export function fileMenu(t: FileTexts, options: { size?: NphContextMenuSize; submenu?: string; pinned?: boolean } = {}): TemplateResult {
  return menuWith({ object: t.object, items: fileItems(t), open: true, rows: 8, ...options });
}

/** The texts of the choices menu, from the dictionary. */
export interface ChoiceTexts {
  object: string;
  viewGroup: string;
  list: string;
  grid: string;
  archived: string;
  shared: string;
  off: string;
}

/** Single choice with the check, multiple choice with the box, a group label and a disabled item. */
export function choiceMenu(t: ChoiceTexts): TemplateResult {
  return menuWith({
    object: t.object,
    open: true,
    rows: 8,
    items: [
      { type: 'label', text: t.viewGroup },
      { value: 'list', text: t.list, icon: 'list', selection: 'single', checked: true },
      { value: 'grid', text: t.grid, icon: 'grid-2', selection: 'single' },
      { type: 'separator' },
      { value: 'archived', text: t.archived, selection: 'multiple', checked: true },
      { value: 'shared', text: t.shared, selection: 'multiple' },
      { type: 'separator' },
      { value: 'off', text: t.off, icon: 'lock', disabled: true },
    ],
  });
}

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), as in `nph-dropdown-menu`: the gate leaves out
 * the axe rule `label-content-name-mismatch` in the stories that show a shortcut. Reason: the name of
 * an item is its text (`aria-labelledby`) and the shortcut goes in `aria-keyshortcuts` (P113); axe compares
 * the name with the whole visible text of the item and cannot tell the two apart. Understanding WCAG
 * 2.5.3 counts such text as supplementary, not part of the label, so "Reload" does not have to be named
 * "Reload Ctrl+R". Alternative discarded: putting the shortcut in the name, which would make every item
 * read its shortcut as its name. The same decision Elvys took for `nph-dropdown-menu` on 27-10-2026;
 * the extension to this piece (DSA-69) is for him to confirm in the pull request.
 */
export const SUPPLEMENTARY_TEXT_EXCEPTION = {
  a11y: { options: { rules: { 'label-content-name-mismatch': { enabled: false } } } },
};
