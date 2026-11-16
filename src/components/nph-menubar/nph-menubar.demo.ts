/**
 * Demonstration frame shared by the `nph-menubar` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the framed figure, the room kept under the bar for an open panel and the box
 * that gives the bar a width to overflow in — is NOT a precedent for component CSS: the bar takes
 * its measures from the `menubar/*` tokens and the panels, in the top layer, take theirs from the
 * `dropdown/*` tokens.
 *
 * A panel on a page that is not opened by a click is opened from code (`open-menu`, and
 * `open-submenu` for the submenu), as the required examples of the accepted documentation
 * (`6432:8686`) show it: the panel sits below its top item, aligned to the start edge. A panel opened
 * from code takes no focus, so the top item in focus is shown by giving it the focus once the bar has
 * rendered (`focused`). The functions take the visible text as arguments: this file holds none,
 * because every visible text, the file names and the shortcuts included, comes from the language
 * dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import './nph-menubar';
import type { NphMenubar, NphMenubarMenu } from './nph-menubar';

export type Scheme = 'light' | 'dark';

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). The open panel is a descendant of the figure, so it takes its scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult, wide = false): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: ${wide ? '100%' : 'fit-content'}; min-inline-size: min(100%, calc(2 * var(--nph-layout-input-width))); max-inline-size: 100%; box-sizing: border-box;"
  >
    ${content}
    <figcaption style="color: var(--nph-color-muted-foreground);">${caption}</figcaption>
  </figure>`;
}

/** The same example in light and in dark mode, side by side, or one above the other, each across the window, with `stacked`. */
export function bothModes(captions: { light: string; dark: string }, content: (scheme: Scheme) => TemplateResult, stacked = false): TemplateResult {
  const direction = stacked ? 'flex-direction: column; inline-size: 100%;' : 'flex-wrap: wrap;';
  return html`<div style="display: flex; ${direction} align-items: flex-start; gap: var(--nph-space-stack);">
    ${inScheme('light', captions.light, content('light'), stacked)} ${inScheme('dark', captions.dark, content('dark'), stacked)}
  </div>`;
}

/** The texts of the demonstration, from the dictionary. */
export interface MenubarTexts {
  barLabel: string;
  moreLabel: string;
  menuLabel: string;
  menuFile: string;
  menuEdit: string;
  menuView: string;
  menuHelp: string;
  menuAdvanced: string;
  new: string;
  open: string;
  recent: string;
  recentOne: string;
  recentTwo: string;
  recentThree: string;
  delete: string;
  undo: string;
  redo: string;
  cut: string;
  copy: string;
  paste: string;
  viewShow: string;
  ruler: string;
  grid: string;
  viewDensity: string;
  comfortable: string;
  compact: string;
  minimap: string;
  resetView: string;
  shortcutsItem: string;
  about: string;
  preferences: string;
  shortcutNew: string;
  shortcutOpen: string;
  shortcutDelete: string;
  shortcutUndo: string;
  shortcutRedo: string;
  shortcutCut: string;
  shortcutCopy: string;
  shortcutPaste: string;
}

/** The File menu: shortcuts, an item with a submenu of recent files and the destructive item last, after a separator. */
export function fileMenu(t: MenubarTexts): NphMenubarMenu {
  return {
    value: 'file',
    label: t.menuFile,
    items: [
      { value: 'new', text: t.new, icon: 'file', shortcut: t.shortcutNew },
      { value: 'open', text: t.open, icon: 'folder-open', shortcut: t.shortcutOpen },
      {
        value: 'recent',
        text: t.recent,
        submenu: [
          { value: 'recent-one', text: t.recentOne },
          { value: 'recent-two', text: t.recentTwo },
          { value: 'recent-three', text: t.recentThree },
        ],
      },
      { type: 'separator' },
      { value: 'delete', text: t.delete, icon: 'trash', severity: 'destructive', shortcut: t.shortcutDelete },
    ],
  };
}

/** The Edit menu: commands with shortcuts in two groups. */
export function editMenu(t: MenubarTexts): NphMenubarMenu {
  return {
    value: 'edit',
    label: t.menuEdit,
    items: [
      { value: 'undo', text: t.undo, shortcut: t.shortcutUndo },
      { value: 'redo', text: t.redo, shortcut: t.shortcutRedo },
      { type: 'separator' },
      { value: 'cut', text: t.cut, shortcut: t.shortcutCut },
      { value: 'copy', text: t.copy, shortcut: t.shortcutCopy },
      { value: 'paste', text: t.paste, shortcut: t.shortcutPaste },
    ],
  };
}

/**
 * The View menu: a group label, two checkboxes, a second group with two radios. With `states`, the
 * minimap, checked and disabled (the mark stays under the disabled opacity), and a command that does not
 * apply now, disabled, come last.
 */
export function viewMenu(t: MenubarTexts, states = false): NphMenubarMenu {
  return {
    value: 'view',
    label: t.menuView,
    items: [
      { type: 'label', text: t.viewShow },
      { value: 'ruler', text: t.ruler, selection: 'multiple', checked: true },
      { value: 'grid', text: t.grid, selection: 'multiple' },
      { type: 'separator' },
      { type: 'label', text: t.viewDensity },
      { value: 'comfortable', text: t.comfortable, selection: 'single', checked: true },
      { value: 'compact', text: t.compact, selection: 'single' },
      ...(states
        ? ([
            { type: 'separator' },
            { value: 'minimap', text: t.minimap, selection: 'multiple', checked: true, disabled: true },
            { value: 'reset-view', text: t.resetView, disabled: true },
          ] as const)
        : []),
    ],
  };
}

/** The Help menu. `disabled` makes the top item disabled. */
export function helpMenu(t: MenubarTexts, disabled = false): NphMenubarMenu {
  return {
    value: 'help',
    label: t.menuHelp,
    disabled,
    items: [
      { value: 'shortcuts', text: t.shortcutsItem, icon: 'circle-question' },
      { value: 'about', text: t.about, icon: 'circle-info' },
    ],
  };
}

/** A top item with a long label: the width hugs the label. */
export function advancedMenu(t: MenubarTexts): NphMenubarMenu {
  return {
    value: 'advanced',
    label: t.menuAdvanced,
    items: [{ value: 'preferences', text: t.preferences, icon: 'gear' }],
  };
}

/** The four menus of the editor: File, Edit, View and Help. */
export function editorMenus(t: MenubarTexts, options: { states?: boolean; disabledHelp?: boolean } = {}): NphMenubarMenu[] {
  return [fileMenu(t), editMenu(t), viewMenu(t, options.states), helpMenu(t, options.disabledHelp)];
}

export interface BarOptions {
  menus: NphMenubarMenu[];
  /** The `value` of the menu whose panel is shown open. */
  open?: string;
  /** The `value` of the item whose submenu is shown open. */
  submenu?: string;
  /** The rows of the panel that is or may be open, to keep the room under the bar. */
  rows?: number;
  /** The width the bar has to hold its top items; narrower than they need, the last ones go into the overflow item. */
  width?: string;
  /** The bar is swapped for the button with the `bars` icon. */
  narrow?: boolean;
  /** The first top item takes the keyboard focus once the bar has rendered. */
  focused?: boolean;
}

/** Gives the first top item the focus once the bar has rendered: the focus ring is keyboard-only, and script focus counts. */
function focusFirst(element?: Element): void {
  if (element === undefined) return;
  const bar = element as NphMenubar;
  void bar.updateComplete.then(() => {
    requestAnimationFrame(() => {
      bar.shadowRoot?.querySelector<HTMLElement>('.bar [role="menuitem"][tabindex="0"]')?.focus({ preventScroll: true });
    });
  });
}

/**
 * A bar and the room under it for the open panel, so it does not cover the next example: one row per
 * entry, and the 40 of the checkbox row counted in the section space.
 */
export function barWith(t: MenubarTexts, { menus, open = '', submenu = '', rows = 0, width = '', narrow = false, focused = false }: BarOptions): TemplateResult {
  const room =
    rows === 0
      ? 'var(--nph-menubar-trigger-height)'
      : `calc(var(--nph-menubar-trigger-height) + var(--nph-menubar-panel-offset) + ${rows} * (var(--nph-icon-size-md) + 2 * var(--nph-space-inline)) + 2 * var(--nph-space-section))`;
  return html`<div style="display: flex; flex-direction: column; box-sizing: border-box; min-block-size: ${room}; ${width === '' ? 'inline-size: 100%;' : `inline-size: ${width}; max-inline-size: 100%;`}">
    <nph-menubar
      label=${t.barLabel}
      more-label=${t.moreLabel}
      menu-label=${t.menuLabel}
      open-menu=${open}
      open-submenu=${submenu}
      ?narrow=${narrow}
      .menus=${menus}
      ${ref(focused ? focusFirst : undefined)}
    ></nph-menubar>
  </div>`;
}

/** Required example 1: the editor with the File menu open, with shortcuts; with `submenu`, the Recent submenu open too. */
export function fileExample(t: MenubarTexts, options: { submenu?: string; focused?: boolean } = {}): TemplateResult {
  return barWith(t, { menus: editorMenus(t), open: 'file', rows: 5, ...options });
}

/** Required example 2: the View menu with the ruler and the grid as checkboxes and the density as radios. */
export function viewExample(t: MenubarTexts): TemplateResult {
  return barWith(t, { menus: editorMenus(t), open: 'view', rows: 8 });
}

/** Required example 3: checked and disabled, where the mark stays under the disabled opacity, and a disabled command. */
export function statesExample(t: MenubarTexts): TemplateResult {
  return barWith(t, { menus: editorMenus(t, { states: true }), open: 'view', rows: 11 });
}

/** Required example 4: the Recent submenu, with the files opened a short while ago. */
export function recentExample(t: MenubarTexts): TemplateResult {
  return fileExample(t, { submenu: 'recent' });
}

/** The closed bar: File, Edit, View and Help. */
export function closedBar(t: MenubarTexts): TemplateResult {
  return barWith(t, { menus: editorMenus(t) });
}

/** The bar with the Help top item disabled and a top item with a long label: the width hugs the label. */
export function topItemsBar(t: MenubarTexts): TemplateResult {
  return barWith(t, { menus: [fileMenu(t), editMenu(t), viewMenu(t), helpMenu(t, true), advancedMenu(t)] });
}

/**
 * The bar in a box that is too narrow for its top items: the ones that do not fit go into the last top
 * item. The box has a width of its own because the frame hugs its content, and a bar that hugs it
 * never overflows.
 */
export function overflowBar(t: MenubarTexts): TemplateResult {
  return barWith(t, { menus: [...editorMenus(t), advancedMenu(t)], width: 'var(--nph-layout-input-width)' });
}

/** The bar swapped for the button with the `bars` icon, as the application does on a narrow screen. */
export function narrowBar(t: MenubarTexts): TemplateResult {
  return barWith(t, { menus: [...editorMenus(t), advancedMenu(t)], narrow: true });
}

/**
 * Accessibility exception (P72, `docs/stories.md` §2.3), as in `nph-dropdown-menu` and `nph-context-menu`:
 * the gate leaves out the axe rule `label-content-name-mismatch` in the stories that show a shortcut.
 * Reason: the name of an item is its text (`aria-labelledby`) and the shortcut goes in `aria-keyshortcuts`
 * (P126); axe compares the name with the whole visible text of the item and cannot tell the two apart.
 * Understanding WCAG 2.5.3 counts such text as supplementary, not part of the label, so "New" does not
 * have to be named "New Ctrl+N". Alternative discarded: putting the shortcut in the name, which would make
 * every item read its shortcut as its name. The same decision Elvys took for `nph-dropdown-menu` on
 * 27-10-2026; the extension to this piece (DSA-83) is for him to confirm in the pull request.
 */
export const SUPPLEMENTARY_TEXT_EXCEPTION = {
  a11y: { options: { rules: { 'label-content-name-mismatch': { enabled: false } } } },
};
