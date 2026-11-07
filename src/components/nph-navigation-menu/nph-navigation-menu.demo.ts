/**
 * Demonstration frame shared by the `nph-navigation-menu` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the room kept below an open bar for its open panel, the widths —
 * is NOT a precedent for component CSS: the piece takes its measures from the `navigation-menu/*`
 * tokens, and its panel its place from the trigger, in the top layer.
 *
 * The three examples are the required ones of the accepted documentation (frame `3977:7913`): the
 * closed bar with two triggers and the link of the current page, an open trigger with a panel of two
 * groups, and the narrow width with the Menu button open. Every visible text comes from the
 * dictionary, passed in by the page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import './nph-navigation-menu';
import type { NphNavigationMenu, NphNavigationMenuItem } from './nph-navigation-menu';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `navigationMenuValidation` dictionary. */
export interface ExampleTexts {
  navLabel: string;
  menuLabel: string;
  products: string;
  resources: string;
  pricing: string;
  groupBuild: string;
  groupManage: string;
  components: string;
  componentsDescription: string;
  tokens: string;
  tokensDescription: string;
  icons: string;
  iconsDescription: string;
  guides: string;
  guidesDescription: string;
  changelog: string;
  changelogDescription: string;
  status: string;
  statusDescription: string;
  docs: string;
  blog: string;
  support: string;
  supportDescription: string;
  longTitle: string;
  longDescription: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens (P67).
 * A story is never duplicated per mode. The open panel is a descendant of the figure, so it takes the
 * scheme too.
 */
export function inScheme(scheme: Scheme, caption: string, content: TemplateResult): TemplateResult {
  return html`<figure
    data-nph-color-scheme=${scheme}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); padding: var(--nph-space-section); background: var(--nph-color-background); color: var(--nph-color-foreground); border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); inline-size: fit-content; min-inline-size: calc(2 * var(--nph-navigation-menu-panel-width) + 2 * var(--nph-space-section)); max-inline-size: 100%; box-sizing: border-box;"
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

/** The panel of a trigger: two groups, each with a label and links that carry title, description and icon. */
export function productsGroups(texts: ExampleTexts, current?: 'components' | 'tokens' | 'icons' | 'guides' | 'changelog'): NphNavigationMenuItem & { type: 'trigger' } {
  return {
    type: 'trigger',
    label: texts.products,
    value: 'products',
    groups: [
      {
        label: texts.groupBuild,
        links: [
          { title: texts.components, href: '#components', description: texts.componentsDescription, icon: 'file', current: current === 'components' },
          { title: texts.tokens, href: '#tokens', description: texts.tokensDescription, icon: 'tag', current: current === 'tokens' },
          { title: texts.icons, href: '#icons', description: texts.iconsDescription, icon: 'star', current: current === 'icons' },
        ],
      },
      {
        label: texts.groupManage,
        links: [
          { title: texts.guides, href: '#guides', description: texts.guidesDescription, icon: 'folder', current: current === 'guides' },
          { title: texts.changelog, href: '#changelog', description: texts.changelogDescription, icon: 'gear', current: current === 'changelog' },
        ],
      },
    ],
  };
}

/** The second trigger: a single group of links, no description. */
function resourcesTrigger(texts: ExampleTexts): NphNavigationMenuItem {
  return {
    type: 'trigger',
    label: texts.resources,
    value: 'resources',
    groups: [
      {
        links: [
          { title: texts.docs, href: '#docs' },
          { title: texts.blog, href: '#blog' },
          { title: texts.support, href: '#support', description: texts.supportDescription },
        ],
      },
    ],
  };
}

/** The bar of the required examples: two triggers and the link of the current page. */
export function itemsOf(texts: ExampleTexts, options: { current?: 'pricing' | 'components'; disabled?: boolean } = {}): NphNavigationMenuItem[] {
  return [
    productsGroups(texts, options.current === 'components' ? 'components' : undefined),
    resourcesTrigger(texts),
    { label: texts.pricing, href: '#pricing', current: options.current === 'pricing' },
    ...(options.disabled === true ? [{ label: texts.status, href: '#status', disabled: true }] : []),
  ];
}

/** Opens a panel once the bar has rendered: it fires no event, so the page asks for it by `open`. */
async function openWhenReady(element: Element | undefined, active?: string): Promise<void> {
  const menu = element as NphNavigationMenu | undefined;
  if (menu === undefined) return;
  await menu.updateComplete;
  if (!menu.isConnected) return;
  if (active !== undefined) menu.active = active;
  menu.open = true;
}

export interface BarOptions {
  /** The page the person is on. */
  current?: 'pricing' | 'components';
  /** A disabled top item at the end. */
  disabled?: boolean;
  /** Draws the panel of this trigger open. Closed, the bar takes no extra room. */
  open?: 'products' | 'resources';
  /** Draws the Menu button instead of the bar. */
  narrow?: boolean;
  /** Draws the vertical list open (narrow only). */
  listOpen?: boolean;
  /** How many panel rows the open panel has, to keep the room below the bar. */
  rows?: number;
}

/**
 * A bar. The room below it holds the open panel, so the panel does not cover the next example: one
 * row per link, plus the paddings of the panel.
 */
export function bar(texts: ExampleTexts, { current, disabled, open, narrow = false, listOpen = false, rows = 3 }: BarOptions = {}): TemplateResult {
  const isOpen = open !== undefined || listOpen;
  const room = isOpen
    ? `calc(var(--nph-control-height-default) + var(--nph-text-label-sm-line-height) + ${rows} * (var(--nph-text-label-md-line-height) + var(--nph-text-body-sm-line-height) + var(--nph-navigation-menu-item-text-gap) + 2 * var(--nph-navigation-menu-item-padding) + var(--nph-navigation-menu-group-gap)) + 2 * var(--nph-navigation-menu-panel-padding) + var(--nph-space-section))`
    : 'auto';
  const itemOptions = { ...(current === undefined ? {} : { current }), ...(disabled === undefined ? {} : { disabled }) };
  return html`<div style="min-block-size: ${room};">
    <nph-navigation-menu
      .items=${itemsOf(texts, itemOptions)}
      ?narrow=${narrow}
      label=${texts.navLabel}
      menu-label=${texts.menuLabel}
      ${ref(open !== undefined ? (element?: Element) => void openWhenReady(element, open) : listOpen ? (element?: Element) => void openWhenReady(element) : undefined)}
    ></nph-navigation-menu>
  </div>`;
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${bar(texts, { current: 'pricing' })} ${bar(texts, { current: 'components', open: 'products', rows: 3 })}
    ${bar(texts, { narrow: true, current: 'components', listOpen: true, rows: 9 })}
  </div>`;
}
