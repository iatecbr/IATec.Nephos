/**
 * Demonstration frame shared by the `nph-breadcrumb` Validation and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it. The
 * scenery here — the framed figure, the room kept below a collapsed trail for its open menu, the
 * widths — is NOT a precedent for component CSS: the piece takes its measures from the
 * `breadcrumb/*` tokens, and the menu its place from the ellipsis button, in the top layer.
 *
 * The three examples are the required ones of the accepted documentation (frame `4512:4741`): two
 * levels with text only, four levels with icons, and a long collapsed trail with the menu open.
 * Every visible text comes from the dictionary, passed in by the page that calls this file.
 */
import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import './nph-breadcrumb';
import type { NphBreadcrumb, NphBreadcrumbLevel } from './nph-breadcrumb';

export type Scheme = 'light' | 'dark';

/** The texts of the examples, from the `breadcrumbValidation` dictionary. */
export interface ExampleTexts {
  navLabel: string;
  ellipsisLabel: string;
  home: string;
  projects: string;
  nephos: string;
  designSystem: string;
  navigation: string;
  breadcrumb: string;
}

/**
 * The same example in a color scheme of its own, on the same element that resolves the tokens
 * (P67). A story is never duplicated per mode. The open menu is a descendant of the figure, so it
 * takes the scheme too.
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

/** The icon of each level, when the trail uses icons: the same on the link and on the current page. */
const ICONS = { home: 'house', projects: 'folder', nephos: 'star', designSystem: 'gear', navigation: 'tag', breadcrumb: 'file' } as const;

type LevelKey = keyof typeof ICONS;

function level(texts: ExampleTexts, key: LevelKey, icons: boolean, current: boolean): NphBreadcrumbLevel {
  return {
    label: texts[key],
    ...(current ? {} : { href: `#${key}` }),
    ...(icons ? { icon: ICONS[key] } : {}),
  };
}

/** The path of a trail of 2, 3 or 4 levels: it always starts at Home and ends at the current page. */
export function levelsOf(texts: ExampleTexts, count: 2 | 3 | 4, icons = false): NphBreadcrumbLevel[] {
  const keys: LevelKey[] =
    count === 2
      ? ['home', 'breadcrumb']
      : count === 3
        ? ['home', 'projects', 'breadcrumb']
        : ['home', 'projects', 'designSystem', 'breadcrumb'];
  return keys.map((key, index) => level(texts, key, icons, index === keys.length - 1));
}

/** The six-level path the collapsed trail hides three of. */
export function longLevelsOf(texts: ExampleTexts, icons = false): NphBreadcrumbLevel[] {
  const keys: LevelKey[] = ['home', 'projects', 'nephos', 'designSystem', 'navigation', 'breadcrumb'];
  return keys.map((key, index) => level(texts, key, icons, index === keys.length - 1));
}

/** A trail of 2, 3 or 4 levels, with or without icons. */
export function trail(texts: ExampleTexts, count: 2 | 3 | 4, icons = false): TemplateResult {
  return html`<nph-breadcrumb .levels=${levelsOf(texts, count, icons)} label=${texts.navLabel}></nph-breadcrumb>`;
}

/** Opens the menu of a collapsed trail once it has rendered: it fires no event, so the page asks for it. */
async function openHiddenLevels(element: Element | undefined): Promise<void> {
  const breadcrumb = element as NphBreadcrumb | undefined;
  if (breadcrumb === undefined) return;
  await breadcrumb.updateComplete;
  const menu = breadcrumb.shadowRoot?.querySelector('nph-dropdown-menu');
  if (menu === null || menu === undefined) return;
  await menu.updateComplete;
  /* The menu looks its button up one frame after it connects. */
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  /* The page may have been left in the meantime: a menu that is no longer in the page stays closed. */
  if (!breadcrumb.isConnected) return;
  menu.open = true;
}

export interface CollapsedOptions {
  icons?: boolean;
  /** Draws the menu open. Closed, the trail takes no extra room. */
  open?: boolean;
  /** The path to collapse, 4 levels or more. */
  levels?: NphBreadcrumbLevel[];
  /** How many options the open menu has, to keep the room below the trail. */
  rows?: number;
}

/**
 * A collapsed trail. The room below it holds the open menu, so the menu does not cover the next
 * example: one row per option, plus the padding of the panel.
 */
export function collapsedTrail(texts: ExampleTexts, { icons = false, open = false, levels, rows = 3 }: CollapsedOptions = {}): TemplateResult {
  const room = open
    ? `calc(var(--nph-breadcrumb-ellipsis-target-size) + ${rows} * (var(--nph-icon-size-md) + 2 * var(--nph-space-inline)) + var(--nph-space-section))`
    : 'auto';
  return html`<div style="min-block-size: ${room};">
    <nph-breadcrumb
      .levels=${levels ?? longLevelsOf(texts, icons)}
      collapsed
      label=${texts.navLabel}
      ellipsis-label=${texts.ellipsisLabel}
      ${ref(open ? openHiddenLevels : undefined)}
    ></nph-breadcrumb>
  </div>`;
}

/** The three required examples, one under the other, in the frame of a scheme. */
export function examples(texts: ExampleTexts): TemplateResult {
  return html`<div style="display: flex; flex-direction: column; gap: var(--nph-space-stack);">
    ${trail(texts, 2)} ${trail(texts, 4, true)} ${collapsedTrail(texts, { icons: true, open: true })}
  </div>`;
}
