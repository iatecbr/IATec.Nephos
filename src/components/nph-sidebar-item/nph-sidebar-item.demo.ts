/**
 * Demonstration frame shared by the `nph-sidebar-item` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not
 * index it. The scenery here — the panel around the lines, its width, the gaps — is NOT a
 * precedent for component CSS: the pieces take every measure from tokens, and the panel is
 * `nph-sidebar`, which is not built here. The frame paints `sidebar/panel-background`,
 * the background the evidence measures the contrast of the lines against.
 *
 * The three examples are the required ones of the accepted board (`2723:460`): "main menu
 * with current page and counter", "group open with subitems" and "collapsed menu with rail
 * buttons". The functions take the visible text as arguments: this file holds none,
 * because every visible text comes from the language dictionary of the page that calls it.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-sidebar-rail-button/nph-sidebar-rail-button';
import '../nph-sidebar-subitem/nph-sidebar-subitem';
import './nph-sidebar-item';
import type { NphSidebarItemToggleDetail } from './nph-sidebar-item';

export type Scheme = 'light' | 'dark';

/** The panel the lines live in: expanded or collapsed width. */
export function panel(content: TemplateResult, collapsed = false): TemplateResult {
  return html`<div
    style="display: flex; flex-direction: column; align-items: ${collapsed ? 'center' : 'stretch'}; gap: var(--nph-space-inline-tight); box-sizing: border-box; inline-size: var(${collapsed
      ? '--nph-layout-sidebar-collapsed'
      : '--nph-layout-sidebar-expanded'}); padding: var(--nph-space-inline); background: var(--nph-sidebar-panel-background); border-radius: var(--nph-radius-container);"
  >
    ${content}
  </div>`;
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

/** One page of the menu: its name and icon, already localized by the page that calls. */
export interface MenuPage {
  label: string;
  icon: string;
}

/** The text the three examples take. */
export interface MenuText {
  /** Five pages: the first is the current one, the second has the counter. */
  pages: readonly MenuPage[];
  /** The group and its three subitems: the first is the current one, the last has options. */
  group: MenuPage;
  subitems: readonly string[];
}

/** Main menu with the current page and a counter. */
export function mainMenu(text: MenuText): TemplateResult {
  return panel(html`${text.pages.map(
    (page, index) =>
      html`<nph-sidebar-item
        label=${page.label}
        icon=${page.icon}
        href=${`#page-${index + 1}`}
        ?active=${index === 0}
        .counter=${index === 1 ? 12 : null}
      ></nph-sidebar-item>`,
  )}`);
}

/**
 * The scenery's stand-in for `nph-sidebar`: the subitems show while the group is open and
 * leave the page, and the Tab order, when the person closes it (`nph-toggle`).
 */
export function followGroup(event: CustomEvent<NphSidebarItemToggleDetail>): void {
  const subitems = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null;
  if (subitems !== null) {
    subitems.style.display = event.detail.expanded ? 'flex' : 'none';
  }
}

/** A group open, with its subitems right below it. */
export function openGroup(text: MenuText): TemplateResult {
  const [home] = text.pages;
  return panel(html`<nph-sidebar-item label=${home?.label ?? ''} icon=${home?.icon ?? ''} href="#page-1"></nph-sidebar-item>
    <nph-sidebar-item
      type="group"
      label=${text.group.label}
      icon=${text.group.icon}
      expanded
      @nph-toggle=${followGroup}
    ></nph-sidebar-item>
    <div data-subitems style="display: flex; flex-direction: column; gap: var(--nph-space-inline-tight);">
      ${text.subitems.map(
        (label, index) =>
          html`<nph-sidebar-subitem
            label=${label}
            href=${`#sub-${index + 1}`}
            ?active=${index === 0}
            ?options=${index === text.subitems.length - 1}
          ></nph-sidebar-subitem>`,
      )}
    </div>`);
}

/** The collapsed menu: one rail button per page, the name in the balloon. */
export function collapsedMenu(text: MenuText): TemplateResult {
  return panel(
    html`${text.pages.map(
      (page, index) =>
        html`<nph-sidebar-rail-button
          label=${page.label}
          icon=${page.icon}
          href=${`#page-${index + 1}`}
          ?active=${index === 0}
          .counter=${index === 1 ? 3 : null}
        ></nph-sidebar-rail-button>`,
    )}`,
    true,
  );
}
