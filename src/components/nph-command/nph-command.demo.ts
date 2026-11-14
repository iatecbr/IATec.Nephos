/**
 * Demonstration frame shared by the `nph-command` Validation, Fixtures and Docs pages.
 *
 * It lives in a file that does not end in `.stories.ts`, so Storybook's glob does not index it.
 * The scenery here — the frames, the sizes of each frame, the commands of the examples — is NOT a
 * precedent for component CSS: the palette takes its measures from its own tokens.
 *
 * WHY FRAMES (P123, as P87 for the dialog). The palette is a modal dialog: it sits in the top layer
 * and covers the whole window it opens in, with its veil. A page that shows several examples, each in
 * light and dark mode (`docs/stories.md`, §4.6), cannot open them all at once over itself. Each
 * example is the real component, open, in a story of its own (`Components/nph-command/Fixtures`,
 * hidden from the sidebar), and the pages embed that story in an `<iframe>`, one per mode: each frame
 * is a window of its own, with its own veil.
 *
 * The functions take the visible text as arguments or read it from the dictionary of the page that
 * calls them: this file holds none.
 */
import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';

import '../nph-button/nph-button';
import './nph-command';
import type { NphCommandEntry } from './nph-command';

export type Scheme = 'light' | 'dark';

/**
 * The examples a frame can show. Identifiers, the same in every language. The first five are the
 * contents of the Figma set (`conteudo`); the last two show the states of one command.
 */
export const EXAMPLES = ['results', 'groups', 'search', 'empty', 'loading', 'disabled', 'destructive'] as const;

export type Example = (typeof EXAMPLES)[number];

/** The texts of the examples, in the language of the page: the `commandValidation` key. */
export interface ExampleTexts {
  label: string;
  placeholder: string;
  loadingLabel: string;
  emptyHeading: string;
  emptyDescription: string;
  resultsLabel: string;
  hintNavigate: string;
  hintOpen: string;
  hintClose: string;
  groupRecent: string;
  groupActions: string;
  groupGoTo: string;
  openInvoice: string;
  editProfile: string;
  newDocument: string;
  newDocumentShortcut: string;
  openSettings: string;
  openSettingsDescription: string;
  inviteMember: string;
  exportReport: string;
  deleteDraft: string;
  goHome: string;
  goTeam: string;
  goReports: string;
  goBilling: string;
  goHelp: string;
  searchQuery: string;
  noMatchQuery: string;
  openPalette: string;
}

/** What an example asks of the palette: the commands, the typed text, and the content state. */
interface Setup {
  commands: (t: ExampleTexts) => NphCommandEntry[];
  /** The text typed in the field once the palette is open. */
  query: (t: ExampleTexts) => string;
  loading: boolean;
}

/** The commands without groups, the first one active (`resultados`). */
function plain(t: ExampleTexts): NphCommandEntry[] {
  return [
    { value: 'new', text: t.newDocument, icon: 'plus', shortcut: t.newDocumentShortcut },
    { value: 'settings', text: t.openSettings, icon: 'gear' },
    { value: 'home', text: t.goHome, icon: 'house' },
    { value: 'invoice', text: t.openInvoice, icon: 'file-lines' },
  ];
}

/** The groups and enough commands to pass the ceiling of the list (`grupos`). */
function grouped(t: ExampleTexts): NphCommandEntry[] {
  return [
    { type: 'label', text: t.groupRecent },
    { value: 'invoice', text: t.openInvoice, icon: 'file-lines' },
    { value: 'profile', text: t.editProfile, icon: 'user' },
    { type: 'label', text: t.groupActions },
    { value: 'new', text: t.newDocument, icon: 'plus', shortcut: t.newDocumentShortcut },
    { value: 'settings', text: t.openSettings, icon: 'gear', description: t.openSettingsDescription },
    { value: 'invite', text: t.inviteMember, icon: 'user' },
    { value: 'export', text: t.exportReport, icon: 'arrow-right' },
    { type: 'label', text: t.groupGoTo },
    { value: 'home', text: t.goHome, icon: 'house' },
    { value: 'team', text: t.goTeam, icon: 'folder' },
    { value: 'reports', text: t.goReports, icon: 'folder' },
    { value: 'billing', text: t.goBilling, icon: 'folder' },
    { value: 'help', text: t.goHelp, icon: 'circle-question' },
  ];
}

/** The groups with an unavailable command (`state=disabled`). */
function withDisabled(t: ExampleTexts): NphCommandEntry[] {
  return [
    { type: 'label', text: t.groupActions },
    { value: 'new', text: t.newDocument, icon: 'plus', shortcut: t.newDocumentShortcut },
    { value: 'export', text: t.exportReport, icon: 'arrow-right', disabled: true },
    { value: 'settings', text: t.openSettings, icon: 'gear' },
  ];
}

/** The groups with a command of the destructive type (`tipo=destructive`). */
function withDestructive(t: ExampleTexts): NphCommandEntry[] {
  return [
    { type: 'label', text: t.groupActions },
    { value: 'new', text: t.newDocument, icon: 'plus', shortcut: t.newDocumentShortcut },
    { value: 'settings', text: t.openSettings, icon: 'gear' },
    { value: 'delete', text: t.deleteDraft, icon: 'trash', severity: 'destructive' },
  ];
}

const SETUP: Record<Example, Setup> = {
  results: { commands: plain, query: () => '', loading: false },
  groups: { commands: grouped, query: () => '', loading: false },
  search: { commands: grouped, query: (t) => t.searchQuery, loading: false },
  empty: { commands: grouped, query: (t) => t.noMatchQuery, loading: false },
  loading: { commands: grouped, query: () => '', loading: true },
  disabled: { commands: withDisabled, query: () => '', loading: false },
  destructive: { commands: withDestructive, query: () => '', loading: false },
};

/** The commands of an example, for the tests. */
export function commandsOf(name: Example, t: ExampleTexts): NphCommandEntry[] {
  return SETUP[name].commands(t);
}

/** The text an example types in the field. */
export function queryOf(name: Example, t: ExampleTexts): string {
  return SETUP[name].query(t);
}

/** A variant of an example for the matrix: the footer of hints off. */
export interface Variant {
  footer?: 'on' | 'off';
}

/**
 * The real palette of an example, open unless the page opens it itself. The typed text of the
 * example is carried by `data-nph-demo-query`: the fixture sets it as `query` after the palette
 * opens, because opening empties the field.
 */
export function example(name: Example, t: ExampleTexts, variant: Variant = {}, open = true): TemplateResult {
  const setup = SETUP[name];
  const query = setup.query(t);
  return html`<nph-command
    label=${t.label}
    placeholder=${t.placeholder}
    loading-label=${t.loadingLabel}
    empty-heading=${t.emptyHeading}
    empty-description=${t.emptyDescription}
    results-label=${t.resultsLabel}
    hint-navigate=${t.hintNavigate}
    hint-open=${t.hintOpen}
    hint-close=${t.hintClose}
    data-nph-demo-query=${query === '' ? nothing : query}
    ?hide-footer=${variant.footer === 'off'}
    ?loading=${setup.loading}
    ?open=${open}
    .items=${setup.commands(t)}
  ></nph-command>`;
}

/** Sets the typed text of the palette in `root`, once it has drawn; nothing when the example types none. */
export async function typeQuery(root: ParentNode): Promise<void> {
  const palette = root.querySelector<HTMLElement & { query: string; updateComplete: Promise<unknown> }>('nph-command[data-nph-demo-query]');
  if (palette === null) {
    return;
  }
  await palette.updateComplete;
  palette.query = palette.getAttribute('data-nph-demo-query') ?? '';
  await palette.updateComplete;
}

/** Story id of the hidden page that shows one example, open, in the window of a frame. */
export const FIXTURE_STORY = 'components-nph-command-fixtures--example';

/** The address of the frame of an example, in a mode and a language. */
export function fixtureSrc(name: Example, scheme: Scheme, locale: string, variant: Variant = {}): string {
  const args = [`example:${name}`, ...Object.entries(variant).map(([key, value]) => `${key}:${value}`)].join(';');
  const globals = `colorScheme:${scheme};locale:${locale}`;
  return `iframe.html?id=${FIXTURE_STORY}&viewMode=story&args=${encodeURIComponent(args)}&globals=${encodeURIComponent(globals)}`;
}

/*
 * The size of each frame, only from tokens. The width leaves the palette its ceiling and the edge of
 * the window; the height is a share of `layout/dialog-max-height`, enough for the list at its ceiling.
 */
const FRAME_WIDTH = 'calc(var(--nph-command-max-width) + 2 * var(--nph-layout-margin-compact))';
const FRAME_HEIGHT = 'var(--nph-layout-dialog-max-height)';

/**
 * One example in a mode, in a window of its own, with a caption below. The mode is pinned on the
 * window, not on the figure: the caption sits on the page and is read in the page's mode.
 */
export function framed(
  name: Example,
  scheme: Scheme,
  locale: string,
  title: string,
  caption: string,
  variant: Variant = {},
): TemplateResult {
  return html`<figure
    data-nph-command-example=${name}
    data-nph-command-footer=${variant.footer ?? 'on'}
    style="margin: 0; display: flex; flex-direction: column; gap: var(--nph-space-inline); max-inline-size: 100%;"
  >
    <iframe
      data-nph-color-scheme=${scheme}
      title=${title}
      src=${fixtureSrc(name, scheme, locale, variant)}
      loading="lazy"
      style="display: block; inline-size: ${FRAME_WIDTH}; max-inline-size: 100%; block-size: ${FRAME_HEIGHT}; border: var(--nph-border-width) solid var(--nph-color-border); border-radius: var(--nph-radius-control); background: var(--nph-color-background);"
    ></iframe>
    ${caption !== ''
      ? html`<figcaption style="color: var(--nph-color-muted-foreground); font-family: var(--nph-text-caption-font-family); font-size: var(--nph-text-caption-font-size); line-height: var(--nph-text-caption-line-height);">${caption}</figcaption>`
      : nothing}
  </figure>`;
}

/** The same example in light and in dark mode, side by side. */
export function bothModes(
  name: Example,
  locale: string,
  title: string,
  captions: { light: string; dark: string },
  variant: Variant = {},
): TemplateResult {
  return html`<div style="display: flex; flex-wrap: wrap; gap: var(--nph-space-stack);">
    ${framed(name, 'light', locale, title, captions.light, variant)} ${framed(name, 'dark', locale, title, captions.dark, variant)}
  </div>`;
}
