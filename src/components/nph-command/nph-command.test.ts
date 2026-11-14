/**
 * Tests of `nph-command` (P123), in a real browser (P21, item 5): the top layer, the focus, the
 * keyboard and the measures only exist where there is layout and a keyboard.
 *
 * They prove the contract accepted in Figma (documentation frame `6076:4910`, set `6068:3936`),
 * recorded in the evidence of DSA-80: the API, the dialog it mounts and the options it asks of
 * it, opening and closing with each origin, the search, the keyboard, the pointer, the states
 * of the content, the footer, the roles and the names, the global shortcut, the short window,
 * the invalid input and the token contract. Accessibility assertions are written by hand.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-command.css?raw';
import {
  NPH_COMMAND_FILTERS,
  NPH_COMMAND_RUN_EVENT,
  NPH_COMMAND_SEARCH_EVENT,
  NPH_COMMAND_SEVERITIES,
  NphCommand,
} from './nph-command';
import type { NphCommandEntry, NphCommandRunDetail, NphCommandSearchDetail } from './nph-command';
import { NphDialog } from '../nph-dialog/nph-dialog';
import type { NphDialogCloseDetail } from '../nph-dialog/nph-dialog';

const WIDE = { width: 1280, height: 800 };
const NARROW = { width: 414, height: 896 };

beforeAll(async () => {
  await page.viewport(WIDE.width, WIDE.height);
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

afterAll(async () => {
  await page.viewport(NARROW.width, NARROW.height);
});

afterEach(async () => {
  await page.viewport(WIDE.width, WIDE.height);
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

/** The palette of the examples: three groups, a shortcut, a description, a destructive and a disabled command. */
const ITEMS: NphCommandEntry[] = [
  { type: 'label', text: 'Recent' },
  { value: 'invoice', text: 'Open invoice 1042', icon: 'file-lines' },
  { type: 'label', text: 'Actions' },
  { value: 'new', text: 'New document', icon: 'plus', shortcut: '⌘N' },
  { value: 'settings', text: 'Open settings', icon: 'gear', description: 'Account and workspace' },
  { value: 'export', text: 'Export report', icon: 'arrow-right', disabled: true },
  { value: 'delete', text: 'Delete draft', icon: 'trash', severity: 'destructive' },
  { type: 'label', text: 'Go to' },
  { value: 'home', text: 'Go to the start', icon: 'house' },
  { value: 'cafe', text: 'Café menu', icon: 'folder', count: 3, tag: 'New' },
];

interface Spec {
  items?: readonly NphCommandEntry[];
  open?: boolean;
  parent?: HTMLElement;
  set?: Partial<NphCommand>;
}

/** A trigger button and the palette, with every text. Returns once it drew. */
async function mount(spec: Spec = {}): Promise<NphCommand> {
  const parent = spec.parent ?? document.body;
  const trigger = document.createElement('button');
  trigger.id = 'trigger';
  trigger.textContent = 'Open';
  const command = document.createElement('nph-command');
  command.label = 'Command palette';
  command.placeholder = 'Search a command…';
  command.loadingLabel = 'Searching…';
  command.emptyHeading = 'No command found';
  command.emptyDescription = 'Check what you typed or search another term.';
  command.resultsLabel = '{count} results';
  command.hintNavigate = 'navigate';
  command.hintOpen = 'open';
  command.hintClose = 'close';
  command.items = spec.items ?? ITEMS;
  Object.assign(command, spec.set ?? {});
  parent.append(trigger, command);
  trigger.focus();
  if (spec.open ?? true) {
    command.open = true;
  }
  await settle(command);
  return command;
}

/** The palette and every `nph-*` inside it finished drawing. */
async function settle(command: NphCommand): Promise<void> {
  await command.updateComplete;
  const dialog = command.shadowRoot?.querySelector('nph-dialog') as NphDialog | null;
  await dialog?.updateComplete;
  const pieces = [...(command.shadowRoot?.querySelectorAll('*') ?? [])].filter(
    (element): element is Element & { updateComplete: Promise<unknown> } => 'updateComplete' in element,
  );
  await Promise.all(pieces.map((piece) => piece.updateComplete));
  await command.updateComplete;
}

function part<T extends HTMLElement = HTMLElement>(command: NphCommand, selector: string): T {
  const found = command.shadowRoot?.querySelector<T>(selector);
  if (!found) throw new Error(`no ${selector}`);
  return found;
}

function all(command: NphCommand, selector: string): HTMLElement[] {
  return [...(command.shadowRoot?.querySelectorAll<HTMLElement>(selector) ?? [])];
}

function dialogOf(command: NphCommand): NphDialog {
  return part<NphDialog>(command, 'nph-dialog');
}

function windowOf(command: NphCommand): HTMLDialogElement {
  const panel = dialogOf(command).shadowRoot?.querySelector('dialog');
  if (!panel) throw new Error('no <dialog>');
  return panel;
}

function fieldOf(command: NphCommand): HTMLInputElement {
  return part<HTMLInputElement>(command, '.field');
}

/** The element that has the focus, inside shadow roots too. */
function focused(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** The text of every command drawn, in order. */
function texts(command: NphCommand): string[] {
  return all(command, '.item .text').map((element) => element.textContent?.trim() ?? '');
}

/** The drawn command with that text. */
function itemOf(command: NphCommand, text: string): HTMLElement {
  const found = all(command, '.item').find((item) => item.querySelector('.text')?.textContent?.trim() === text);
  if (!found) throw new Error(`no command ${text}`);
  return found;
}

function activeText(command: NphCommand): string | null {
  return command.shadowRoot?.querySelector('.item[data-active] .text')?.textContent?.trim() ?? null;
}

async function type(command: NphCommand, text: string): Promise<void> {
  await userEvent.keyboard(text);
  await settle(command);
}

async function press(command: NphCommand, key: string): Promise<void> {
  await userEvent.keyboard(key);
  await settle(command);
}

async function closed(command: NphCommand): Promise<void> {
  await vi.waitFor(() => expect(windowOf(command).open).toBe(false), { timeout: 2000 });
  await vi.waitFor(() => expect(command.open).toBe(false));
}

function listen<T>(target: EventTarget, name: string): Array<{ detail: T; cancelable: boolean; composed: boolean; bubbles: boolean }> {
  const seen: Array<{ detail: T; cancelable: boolean; composed: boolean; bubbles: boolean }> = [];
  target.addEventListener(name, (event) => {
    const custom = event as CustomEvent<T>;
    seen.push({ detail: custom.detail, cancelable: custom.cancelable, composed: custom.composed, bubbles: custom.bubbles });
  });
  return seen;
}

function px(value: string): number {
  return Number.parseFloat(value);
}

/** The value a token resolves to, read through a probe. */
function resolved(property: string, token: string, parent: Element = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** What the browser itself computes for an element in its accessibility tree. */
async function axNode(element: Element): Promise<{ role: string; name: string; description: string; properties: Record<string, unknown> }> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]', includeUserAgentShadowDOM: false });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    const node = nodes[0];
    const properties: Record<string, unknown> = {};
    for (const property of node?.properties ?? []) properties[property.name] = property.value?.value;
    return {
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
      description: String(node?.description?.value ?? ''),
      properties,
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-command only once', () => {
    expect(customElements.get('nph-command')).toBe(NphCommand);
  });

  it('the public API is exactly the one in P123', () => {
    const declared = [...(NphCommand as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual([
      'items',
      'open',
      'query',
      'filter',
      'loading',
      'label',
      'placeholder',
      'loadingLabel',
      'emptyHeading',
      'emptyDescription',
      'resultsLabel',
      'hintNavigate',
      'hintOpen',
      'hintClose',
      'hideFooter',
      'globalShortcut',
    ]);
    expect([...NPH_COMMAND_FILTERS]).toEqual(['contains', 'none']);
    expect([...NPH_COMMAND_SEVERITIES]).toEqual(['default', 'destructive']);
    expect(NPH_COMMAND_RUN_EVENT).toBe('nph-run');
    expect(NPH_COMMAND_SEARCH_EVENT).toBe('nph-search');
  });

  it('the defaults are closed, empty query, contains, no loading, the footer on and no global shortcut', () => {
    const command = document.createElement('nph-command');
    expect(command.open).toBe(false);
    expect(command.query).toBe('');
    expect(command.filter).toBe('contains');
    expect(command.loading).toBe(false);
    expect(command.hideFooter).toBe(false);
    expect(command.globalShortcut).toBe(false);
    expect(command.items).toEqual([]);
  });

  it('open reflects; the other options read their attributes', async () => {
    const command = await mount({ open: false });
    command.open = true;
    await settle(command);
    expect(command.hasAttribute('open')).toBe(true);
    const other = document.createElement('nph-command');
    other.setAttribute('hide-footer', '');
    other.setAttribute('global-shortcut', '');
    other.setAttribute('loading', '');
    other.setAttribute('filter', 'none');
    other.setAttribute('results-label', 'x');
    other.setAttribute('hint-navigate', 'x');
    other.setAttribute('loading-label', 'x');
    other.setAttribute('empty-heading', 'x');
    other.setAttribute('empty-description', 'x');
    other.setAttribute('hint-open', 'x');
    other.setAttribute('hint-close', 'x');
    expect(other.hideFooter && other.globalShortcut && other.loading).toBe(true);
    expect(other.filter).toBe('none');
    expect(other.resultsLabel).toBe('x');
    expect(other.loadingLabel).toBe('x');
    expect(other.emptyHeading).toBe('x');
  });

  it('has open Shadow DOM, no slot and no part', async () => {
    const command = await mount();
    expect(command.shadowRoot).not.toBeNull();
    expect(command.shadowRoot?.querySelector('slot')).toBeNull();
    expect(command.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('mounts the dialog with the options DSA-80 asked of it, named by label', async () => {
    const command = await mount();
    const dialog = dialogOf(command);
    expect(dialog.heading).toBe('Command palette');
    expect(dialog.hideHeading).toBe(true);
    expect(dialog.noPadding).toBe(true);
    expect(dialog.hideClose).toBe(true);
    expect(dialog.closeOnBackdrop).toBe(true);
    expect(dialog.size).toBe('md');
    expect(dialog.open).toBe(true);
    expect(windowOf(command).matches(':modal')).toBe(true);
  });

  it('has no status, color, variant or size property', () => {
    const declared = [...(NphCommand as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    for (const absent of ['size', 'variant', 'color', 'status', 'selection', 'shortcut', 'groups']) {
      expect(declared).not.toContain(absent);
    }
  });
});

describe('opening and closing', () => {
  it('closed, the window is not drawn', async () => {
    const command = await mount({ open: false });
    expect(windowOf(command).open).toBe(false);
    expect(getComputedStyle(windowOf(command)).display).toBe('none');
  });

  it('open, the focus is on the field, the field is empty and the first command is active', async () => {
    const command = await mount();
    expect(windowOf(command).matches(':modal')).toBe(true);
    expect(focused()).toBe(fieldOf(command));
    expect(fieldOf(command).value).toBe('');
    expect(activeText(command)).toBe('Open invoice 1042');
    expect(texts(command)).toHaveLength(7);
  });

  it('Esc closes it, reports the origin escape and gives the focus back to the trigger', async () => {
    const command = await mount();
    const seen = listen<NphDialogCloseDetail>(command, 'nph-close');
    await press(command, '{Escape}');
    await closed(command);
    expect(seen.map((event) => event.detail.source)).toEqual(['escape']);
    expect(command.open).toBe(false);
    expect(command.hasAttribute('open')).toBe(false);
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('Esc closes it with text in the field too', async () => {
    const command = await mount();
    await type(command, 'doc');
    await press(command, '{Escape}');
    await closed(command);
    expect(command.open).toBe(false);
  });

  it('a click on the veil closes it with the origin backdrop', async () => {
    const command = await mount();
    const seen = listen<NphDialogCloseDetail>(command, 'nph-close');
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true });
    await closed(command);
    expect(seen.map((event) => event.detail.source)).toEqual(['backdrop']);
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('the open key closes it, Ctrl+K and ⌘K, with the origin open-key, and the browser does not get the key', async () => {
    for (const chord of ['{Control>}k{/Control}', '{Meta>}k{/Meta}']) {
      const command = await mount();
      const seen = listen<NphDialogCloseDetail>(command, 'nph-close');
      const keys: KeyboardEvent[] = [];
      const record = (event: KeyboardEvent): void => {
        if (event.key === 'k') keys.push(event);
      };
      document.addEventListener('keydown', record);
      await press(command, chord);
      document.removeEventListener('keydown', record);
      await closed(command);
      expect(seen.map((event) => event.detail.source)).toEqual(['open-key']);
      expect(keys[0]?.defaultPrevented).toBe(true);
      expect(document.activeElement?.id).toBe('trigger');
      command.remove();
      document.getElementById('trigger')?.remove();
    }
  });

  it('a click on a command runs it and closes with the origin command-run', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    const closes = listen<NphDialogCloseDetail>(command, 'nph-close');
    itemOf(command, 'New document').click();
    await closed(command);
    expect(runs.map((event) => event.detail.value)).toEqual(['new']);
    expect(closes.map((event) => event.detail.source)).toEqual(['command-run']);
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('every origin leaves it ready to open again, empty and with the first command active', async () => {
    const command = await mount();
    await type(command, 'doc');
    await press(command, '{Escape}');
    await closed(command);
    command.open = true;
    await settle(command);
    await vi.waitFor(() => expect(windowOf(command).open).toBe(true));
    expect(fieldOf(command).value).toBe('');
    expect(command.query).toBe('');
    expect(activeText(command)).toBe('Open invoice 1042');
    expect(focused()).toBe(fieldOf(command));
    await userEvent.click(document.body, { position: { x: 2, y: 2 }, force: true });
    await closed(command);
    command.open = true;
    await settle(command);
    await vi.waitFor(() => expect(windowOf(command).open).toBe(true));
    await press(command, '{Control>}k{/Control}');
    await closed(command);
    command.open = true;
    await settle(command);
    await vi.waitFor(() => expect(windowOf(command).open).toBe(true));
    expect(command.open).toBe(true);
  });

  it('preventDefault on nph-close keeps it open', async () => {
    const command = await mount();
    command.addEventListener('nph-close', (event) => event.preventDefault());
    await press(command, '{Escape}');
    await settle(command);
    expect(command.open).toBe(true);
    expect(windowOf(command).open).toBe(true);
  });

  it('the state follows a close the dialog did by itself', async () => {
    const command = await mount();
    dialogOf(command).open = false;
    await closed(command);
    expect(command.open).toBe(false);
  });
});

describe('the search', () => {
  it('shows only the commands whose text contains what was typed, with no difference of case or accent', async () => {
    const command = await mount();
    await type(command, 'CONF');
    expect(texts(command)).toEqual([]);
    await userEvent.clear(fieldOf(command));
    await type(command, 'SET');
    expect(texts(command)).toEqual(['Open settings']);
    await userEvent.clear(fieldOf(command));
    await type(command, 'cafe');
    expect(texts(command)).toEqual(['Café menu']);
    await userEvent.clear(fieldOf(command));
    await type(command, 'caf\u00e9');
    expect(texts(command)).toEqual(['Café menu']);
  });

  it('a group left with no command goes away with its label', async () => {
    const command = await mount();
    await type(command, 'start');
    expect(all(command, '.group-label').map((label) => label.textContent?.trim())).toEqual(['Go to']);
    expect(all(command, '.group')).toHaveLength(1);
  });

  it('with no text, every group and command shows; the labels are not commands', async () => {
    const command = await mount();
    expect(all(command, '.group-label').map((label) => label.textContent?.trim())).toEqual(['Recent', 'Actions', 'Go to']);
    expect(all(command, '.item')).toHaveLength(7);
  });

  it('the typed stretch has command/highlight-weight and the rest is muted, also on the active command', async () => {
    const command = await mount();
    await type(command, 'doc');
    const label = part(command, '.item[data-active] .text');
    const match = label.querySelector('.match') as HTMLElement;
    const rest = label.querySelector('.rest') as HTMLElement;
    expect(match.textContent).toBe('doc');
    expect(getComputedStyle(match).fontWeight).toBe(resolved('font-weight', '--nph-command-highlight-weight'));
    expect(getComputedStyle(rest).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    expect(getComputedStyle(match).fontWeight).not.toBe(getComputedStyle(rest).fontWeight);
  });

  it('the first command is active while typing', async () => {
    const command = await mount();
    await type(command, 'o');
    expect(activeText(command)).toBe('Open invoice 1042');
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('New document');
    await type(command, 'p');
    expect(activeText(command)).toBe('Open invoice 1042');
  });

  it('says what was typed in nph-search, bubbling and composed, and only for the person', async () => {
    const command = await mount();
    const seen = listen<NphCommandSearchDetail>(document.body, 'nph-search');
    await type(command, 'ne');
    expect(seen.map((event) => event.detail.query)).toEqual(['n', 'ne']);
    expect(seen[0]?.bubbles && seen[0]?.composed).toBe(true);
    command.query = 'qq';
    await settle(command);
    expect(seen).toHaveLength(2);
    expect(fieldOf(command).value).toBe('qq');
    expect(texts(command)).toEqual([]);
  });

  it('filter none leaves the filtering to the consumer: every command stays, the text is not highlighted', async () => {
    const command = await mount({ set: { filter: 'none' } });
    await type(command, 'zzz');
    expect(texts(command)).toHaveLength(7);
    expect(command.shadowRoot?.querySelector('.match')).toBeNull();
  });

  it('new items from the consumer replace the list and make the first command active again', async () => {
    const command = await mount({ set: { filter: 'none' } });
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('New document');
    command.items = [
      { value: 'a', text: 'Alpha' },
      { value: 'b', text: 'Beta' },
    ];
    await settle(command);
    expect(texts(command)).toEqual(['Alpha', 'Beta']);
    expect(activeText(command)).toBe('Alpha');
  });
});

describe('the keyboard', () => {
  it('Down and Up move the active command and keep the focus on the field', async () => {
    const command = await mount();
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('New document');
    expect(focused()).toBe(fieldOf(command));
    await press(command, '{ArrowUp}');
    expect(activeText(command)).toBe('Open invoice 1042');
  });

  it('skips a disabled command, and a group label never takes the focus nor becomes active', async () => {
    const command = await mount();
    await press(command, '{ArrowDown}{ArrowDown}');
    expect(activeText(command)).toBe('Open settings');
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('Delete draft');
    expect(all(command, '.group-label').every((label) => !label.hasAttribute('data-active'))).toBe(true);
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('Go to the start');
  });

  it('stops at the ends: Down on the last stays there and Up on the first stays there', async () => {
    const command = await mount();
    await press(command, '{ArrowUp}');
    expect(activeText(command)).toBe('Open invoice 1042');
    await press(command, '{End}');
    expect(activeText(command)).toBe('Café menu');
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('Café menu');
  });

  it('Home and End go to the first and the last command, skipping a disabled one at the end', async () => {
    const command = await mount({
      items: [
        { value: 'a', text: 'Alpha' },
        { value: 'b', text: 'Beta' },
        { value: 'c', text: 'Gamma', disabled: true },
      ],
    });
    await press(command, '{End}');
    expect(activeText(command)).toBe('Beta');
    await press(command, '{Home}');
    expect(activeText(command)).toBe('Alpha');
  });

  it('Enter runs the active command, reports its value and closes with command-run', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    const closes = listen<NphDialogCloseDetail>(command, 'nph-close');
    await press(command, '{ArrowDown}');
    await press(command, '{Enter}');
    await closed(command);
    expect(runs).toHaveLength(1);
    expect(runs[0]?.detail).toEqual({ value: 'new' });
    expect(runs[0]?.bubbles && runs[0]?.composed).toBe(true);
    expect(closes.map((event) => event.detail.source)).toEqual(['command-run']);
  });

  it('Enter with the first command active runs it', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    await press(command, '{Enter}');
    await closed(command);
    expect(runs.map((event) => event.detail.value)).toEqual(['invoice']);
  });

  it('Enter with no active command does nothing: empty, loading', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    await type(command, 'xyz');
    expect(activeText(command)).toBeNull();
    await press(command, '{Enter}');
    expect(runs).toEqual([]);
    expect(command.open).toBe(true);
    command.loading = true;
    await settle(command);
    await press(command, '{Enter}');
    expect(runs).toEqual([]);
    expect(command.open).toBe(true);
  });

  it('Enter does not run a disabled command', async () => {
    const command = await mount({ items: [{ value: 'a', text: 'Alpha', disabled: true }] });
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    expect(activeText(command)).toBeNull();
    await press(command, '{Enter}');
    expect(runs).toEqual([]);
    expect(command.open).toBe(true);
  });

  it('Tab and Shift+Tab keep the focus on the field', async () => {
    const command = await mount();
    await press(command, '{Tab}');
    expect(focused()).toBe(fieldOf(command));
    await press(command, '{Shift>}{Tab}{/Shift}');
    expect(focused()).toBe(fieldOf(command));
    expect(command.open).toBe(true);
  });

  it('keys pressed during an IME composition do not move nor run', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    const field = fieldOf(command);
    field.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, composed: true }));
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true, cancelable: true }));
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true }));
    await settle(command);
    expect(activeText(command)).toBe('Open invoice 1042');
    expect(runs).toEqual([]);
    field.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true }));
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('New document');
  });

  it('the active command scrolls into view in a long list, with its group label when it is the first of the group', async () => {
    const many: NphCommandEntry[] = [
      { type: 'label', text: 'First group' },
      ...Array.from({ length: 12 }, (_, index) => ({ value: `a${index}`, text: `Alpha ${index}` })),
      { type: 'label', text: 'Second group' },
      ...Array.from({ length: 12 }, (_, index) => ({ value: `b${index}`, text: `Beta ${index}` })),
    ];
    const command = await mount({ items: many });
    const list = part(command, '.listbox');
    expect(list.scrollHeight).toBeGreaterThan(list.clientHeight);
    await press(command, '{End}');
    const last = part(command, '.item[data-active]').getBoundingClientRect();
    const box = list.getBoundingClientRect();
    expect(last.bottom).toBeLessThanOrEqual(box.bottom + 1);
    expect(list.scrollTop).toBeGreaterThan(0);
    await press(command, '{Home}');
    expect(list.scrollTop).toBe(0);
    for (let i = 0; i < 12; i += 1) await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('Beta 0');
    const label = all(command, '.group-label')[1] as HTMLElement;
    expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(box.top - 1);
    expect(label.getBoundingClientRect().bottom).toBeLessThanOrEqual(box.bottom + 1);
  });
});

describe('the pointer', () => {
  it('the pointer over a command makes it active, and the keyboard goes on from there', async () => {
    const command = await mount();
    itemOf(command, 'Delete draft').dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, pointerType: 'mouse' }));
    await settle(command);
    expect(activeText(command)).toBe('Delete draft');
    await press(command, '{ArrowDown}');
    expect(activeText(command)).toBe('Go to the start');
    expect(focused()).toBe(fieldOf(command));
  });

  it('a disabled command does not become active under the pointer', async () => {
    const command = await mount();
    const disabled = itemOf(command, 'Export report');
    disabled.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, pointerType: 'mouse' }));
    await settle(command);
    expect(activeText(command)).toBe('Open invoice 1042');
  });

  it('a touch does not move the active command', async () => {
    const command = await mount();
    itemOf(command, 'Delete draft').dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, pointerType: 'touch' }));
    await settle(command);
    expect(activeText(command)).toBe('Open invoice 1042');
  });

  it('a click on a disabled command runs nothing and keeps the palette open', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    itemOf(command, 'Export report').click();
    await settle(command);
    expect(runs).toEqual([]);
    expect(command.open).toBe(true);
  });

  it('a click on a group label runs nothing', async () => {
    const command = await mount();
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    (all(command, '.group-label')[0] as HTMLElement).click();
    await settle(command);
    expect(runs).toEqual([]);
    expect(command.open).toBe(true);
  });

  it('a press on a command keeps the focus on the field', async () => {
    const command = await mount();
    const item = itemOf(command, 'Delete draft');
    const down = new PointerEvent('pointerdown', { bubbles: true, composed: true, cancelable: true, pointerType: 'mouse' });
    item.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    expect(focused()).toBe(fieldOf(command));
  });
});

describe('the content states', () => {
  it('results: commands in groups, the first active, no status', async () => {
    const command = await mount();
    expect(command.shadowRoot?.querySelector('.status')).toBeNull();
    expect(part(command, '.listbox').hidden).toBe(false);
  });

  it('empty: the nph-empty with title and hint, no active command, the listbox out of the tree and the footer stays', async () => {
    const command = await mount();
    await type(command, 'xyz');
    const empty = part(command, 'nph-empty') as HTMLElement & { heading: string; description: string };
    expect(empty.heading).toBe('No command found');
    expect(empty.description).toBe('Check what you typed or search another term.');
    expect(activeText(command)).toBeNull();
    expect(part(command, '.listbox').hidden).toBe(true);
    expect(command.shadowRoot?.querySelector('.footer')).not.toBeNull();
    expect(fieldOf(command).hasAttribute('aria-activedescendant')).toBe(false);
    expect(fieldOf(command).getAttribute('aria-expanded')).toBe('false');
  });

  it('empty without a description draws the title only', async () => {
    const command = await mount({ set: { emptyDescription: '' } });
    await type(command, 'xyz');
    expect((part(command, 'nph-empty') as HTMLElement & { description: string }).description).toBe('');
  });

  it('loading: the spinner and the text in command/status-foreground, aria-busy on the list and no command', async () => {
    const command = await mount({ set: { loading: true } });
    const status = part(command, '.loading');
    expect(status.querySelector('nph-spinner')).not.toBeNull();
    const text = part(command, '.loading-text');
    expect(text.textContent?.trim()).toBe('Searching…');
    expect(getComputedStyle(text).color).toBe(resolved('color', '--nph-command-status-foreground'));
    expect(part(command, '.listbox').getAttribute('aria-busy')).toBe('true');
    expect(all(command, '.item')).toHaveLength(0);
    expect(command.shadowRoot?.querySelector('nph-empty')).toBeNull();
    const style = getComputedStyle(status);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-command-state-padding'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-command-status-gap'));
    expect(style.justifyContent).toBe('center');
  });

  it('when the items arrive, the loading ends, the first command is active and the count is announced', async () => {
    const command = await mount({ set: { loading: true, filter: 'none' } });
    await type(command, 'o');
    command.loading = false;
    await settle(command);
    expect(part(command, '.listbox').hasAttribute('aria-busy')).toBe(false);
    expect(activeText(command)).toBe('Open invoice 1042');
    /* filter none: the consumer filtered, so every command it gave is in the count. */
    expect(part(command, '.announce').textContent?.trim()).toBe('7 results');
  });

  it('announces the number of results in a polite status region, only after the person typed', async () => {
    const command = await mount();
    const region = part(command, '.announce');
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent?.trim()).toBe('');
    await type(command, 'o');
    expect(region.textContent?.trim()).toBe('5 results');
    await type(command, 'xyz');
    expect(region.textContent?.trim()).toBe('No command found');
  });
});

describe('the footer of hints', () => {
  it('is on by default: three hints, each a key and a word, in the tokens of the evidence', async () => {
    const command = await mount();
    const hints = all(command, '.hint');
    expect(hints.map((hint) => hint.querySelector('.hint-word')?.textContent?.trim())).toEqual(['navigate', 'open', 'close']);
    expect(hints.map((hint) => (hint.querySelector('nph-kbd') as HTMLElement & { text: string }).text)).toEqual(['↑↓', '↵', 'esc']);
    const footer = part(command, '.footer');
    const style = getComputedStyle(footer);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-command-footer-padding'));
    expect(style.columnGap).toBe(resolved('column-gap', '--nph-command-footer-gap'));
    expect(getComputedStyle(hints[0] as HTMLElement).columnGap).toBe(resolved('column-gap', '--nph-command-hint-gap'));
    expect(getComputedStyle(part(command, '.hint-word')).color).toBe(resolved('color', '--nph-command-footer-foreground'));
  });

  it('the keys are hidden from the screen reader: the words already say the action', async () => {
    const command = await mount();
    for (const kbd of all(command, '.hint nph-kbd')) {
      expect(kbd.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('hide-footer takes the second line and the hints away and changes nothing else', async () => {
    const command = await mount({ set: { hideFooter: true } });
    expect(command.shadowRoot?.querySelector('.footer')).toBeNull();
    expect(all(command, 'nph-separator')).toHaveLength(1);
    expect(texts(command)).toHaveLength(7);
  });

  it('footer on has the two lines, in command/divider', async () => {
    const command = await mount();
    const lines = all(command, 'nph-separator');
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(getComputedStyle(line).backgroundColor).toBe(resolved('background-color', '--nph-command-divider'));
    }
  });
});

describe('the commands', () => {
  it('draw the start icon light and muted at rest and solid on the active command', async () => {
    const command = await mount();
    const rest = part(command, '.item:not([data-active]) .icon') as HTMLElement & { variant: string };
    expect(rest.variant).toBe('light');
    expect(getComputedStyle(rest).color).toBe(resolved('color', '--nph-color-muted-foreground'));
    const active = part(command, '.item[data-active] .icon') as HTMLElement & { variant: string };
    expect(active.variant).toBe('solid');
    expect(getComputedStyle(active).color).toBe(resolved('color', '--nph-dropdown-item-hover-icon-foreground'));
  });

  it('the active command has color/primary-surface and the label and shortcut in color/accent-foreground', async () => {
    const command = await mount();
    await press(command, '{ArrowDown}');
    const item = part(command, '.item[data-active]');
    expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-color-primary-surface'));
    expect(getComputedStyle(part(command, '.item[data-active] .text')).color).toBe(resolved('color', '--nph-color-accent-foreground'));
    expect(getComputedStyle(part(command, '.item[data-active] .shortcut')).color).toBe(resolved('color', '--nph-color-accent-foreground'));
  });

  it('a command at rest has no fill and the label in color/popover-foreground', async () => {
    const command = await mount();
    const item = part(command, '.item:not([data-active])');
    expect(getComputedStyle(item).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(part(command, '.item:not([data-active]) .text')).color).toBe(resolved('color', '--nph-color-popover-foreground'));
  });

  it('is 36 high with an icon and one line, and the list has no gap between the items', async () => {
    const command = await mount();
    const items = all(command, '.item');
    expect(items[0]?.getBoundingClientRect().height).toBeCloseTo(36, 0);
    const first = items[0]?.getBoundingClientRect() as DOMRect;
    const second = items[1]?.getBoundingClientRect() as DOMRect;
    expect(Math.round(second.top - first.bottom)).toBeGreaterThanOrEqual(0);
  });

  it('shows the shortcut as text, hidden from the screen reader, the description, the counter and the tag', async () => {
    const command = await mount();
    expect(part(command, '.shortcut').textContent?.trim()).toBe('⌘N');
    expect(part(command, '.shortcut').getAttribute('aria-hidden')).toBe('true');
    expect(part(command, '.description').textContent?.trim()).toBe('Account and workspace');
    expect(part(command, '.count').textContent?.trim()).toBe('3');
    expect((part(command, '.tag') as HTMLElement & { text: string }).text).toBe('New');
  });

  it('a destructive command keeps its colors at rest and active', async () => {
    const command = await mount();
    const item = itemOf(command, 'Delete draft');
    expect(item.getAttribute('data-severity')).toBe('destructive');
    expect(getComputedStyle(item.querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-dropdown-item-destructive-foreground'));
    expect(getComputedStyle(item.querySelector('.icon') as HTMLElement).color).toBe(resolved('color', '--nph-dropdown-item-destructive-foreground'));
    item.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, composed: true, pointerType: 'mouse' }));
    await settle(command);
    expect(getComputedStyle(item).backgroundColor).toBe(resolved('background-color', '--nph-dropdown-item-destructive-hover-background'));
    expect(getComputedStyle(item.querySelector('.text') as HTMLElement).color).toBe(resolved('color', '--nph-dropdown-item-destructive-hover-foreground'));
  });

  it('a disabled command is dimmed by state/disabled-opacity, aria-disabled and never active', async () => {
    const command = await mount();
    const item = itemOf(command, 'Export report');
    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(item).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    await press(command, '{End}');
    await press(command, '{Home}');
    expect(item.hasAttribute('data-active')).toBe(false);
  });

  it('a destructive and disabled command is disabled: it wins and does not run (T11)', async () => {
    const command = await mount({ items: [{ value: 'x', text: 'Delete', severity: 'destructive', disabled: true }, { value: 'y', text: 'Keep' }] });
    const runs = listen<NphCommandRunDetail>(command, 'nph-run');
    const item = all(command, '.item')[0] as HTMLElement;
    expect(item.getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(item).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
    item.click();
    await settle(command);
    expect(runs).toEqual([]);
    expect(activeText(command)).toBe('Keep');
  });

  it('a long label is cut on one line with an ellipsis', async () => {
    const long = 'A command with a very long name '.repeat(8);
    const command = await mount({ items: [{ value: 'x', text: long, icon: 'plus' }] });
    const text = part(command, '.text');
    const style = getComputedStyle(text);
    expect(style.textOverflow).toBe('ellipsis');
    expect(style.whiteSpace).toBe('nowrap');
    expect(part(command, '.item').getBoundingClientRect().height).toBeCloseTo(36, 0);
  });

  it('a command with no icon draws none', async () => {
    const command = await mount({ items: [{ value: 'x', text: 'Plain' }] });
    expect(command.shadowRoot?.querySelector('.icon')).toBeNull();
  });
});

describe('the surface', () => {
  it('paints the panel with the command tokens: background, radius and the width ceiling', async () => {
    const command = await mount();
    const surface = part(command, '.surface');
    const style = getComputedStyle(surface);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-command-background'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-command-radius'));
    expect(surface.getBoundingClientRect().width).toBeCloseTo(px(resolved('inline-size', '--nph-command-max-width')), 0);
    const panel = windowOf(command);
    expect(getComputedStyle(panel).paddingTop).toBe('0px');
    expect(getComputedStyle(panel).boxShadow).toBe(resolved('box-shadow', '--nph-elevation-modal'));
    expect(getComputedStyle(panel).borderTopWidth).toBe('0px');
  });

  it('keeps the width at the ceiling while the list filters, so it does not jump', async () => {
    const command = await mount();
    const before = windowOf(command).getBoundingClientRect().width;
    await type(command, 'settings');
    expect(texts(command)).toHaveLength(1);
    expect(windowOf(command).getBoundingClientRect().width).toBeCloseTo(before, 0);
    await type(command, 'zzz');
    expect(windowOf(command).getBoundingClientRect().width).toBeCloseTo(before, 0);
  });

  it('the dark panel has no border and the field is darker than the panel', async () => {
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    const command = await mount();
    expect(getComputedStyle(windowOf(command)).borderTopWidth).toBe('0px');
    expect(getComputedStyle(part(command, '.surface')).backgroundColor).toBe(resolved('background-color', '--nph-command-background'));
    expect(getComputedStyle(part(command, '.control')).backgroundColor).toBe(resolved('background-color', '--nph-color-background'));
    expect(getComputedStyle(part(command, '.control')).backgroundColor).not.toBe(getComputedStyle(part(command, '.surface')).backgroundColor);
  });

  it('the search row has command/search-padding and the field is the nph-input large in focus', async () => {
    const command = await mount();
    const search = getComputedStyle(part(command, '.search'));
    expect(search.paddingTop).toBe(resolved('padding-top', '--nph-command-search-padding'));
    expect(search.paddingLeft).toBe(resolved('padding-left', '--nph-command-search-padding'));
    const control = part(command, '.control');
    const style = getComputedStyle(control);
    expect(control.getBoundingClientRect().height).toBeCloseTo(px(resolved('block-size', '--nph-control-height-large')), 0);
    expect(style.borderTopColor).toBe(resolved('color', '--nph-focus-border'));
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-control'));
    expect(getComputedStyle(control, '::after').borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(part(command, '.start').getAttribute('name')).toBe('magnifying-glass');
    expect(fieldOf(command).placeholder).toBe('Search a command…');
  });

  it('the list has command/list-padding and a ceiling of command/list-max-height, and then scrolls', async () => {
    const many: NphCommandEntry[] = Array.from({ length: 20 }, (_, index) => ({ value: `v${index}`, text: `Command ${index}` }));
    const command = await mount({ items: many });
    const list = part(command, '.list');
    const listbox = part(command, '.listbox');
    const style = getComputedStyle(list);
    expect(style.paddingTop).toBe(resolved('padding-top', '--nph-command-list-padding'));
    expect(list.getBoundingClientRect().height).toBeCloseTo(px(resolved('block-size', '--nph-command-list-max-height')), 0);
    /* The scroll is on the listbox itself, as in nph-combobox, so the keyboard reaches it through the field (axe: scrollable-region-focusable). */
    expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    expect(getComputedStyle(listbox).overflowY).toBe('auto');
  });

  it('in a short window the list shrinks and scrolls while the field and the footer stay', async () => {
    await page.viewport(WIDE.width, 360);
    const many: NphCommandEntry[] = Array.from({ length: 20 }, (_, index) => ({ value: `v${index}`, text: `Command ${index}` }));
    const command = await mount({ items: many });
    const panel = windowOf(command).getBoundingClientRect();
    const list = part(command, '.list');
    const listbox = part(command, '.listbox');
    expect(panel.height).toBeLessThanOrEqual(360);
    expect(list.getBoundingClientRect().height).toBeLessThan(px(resolved('block-size', '--nph-command-list-max-height')));
    expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    const control = part(command, '.control').getBoundingClientRect();
    const footer = part(command, '.footer').getBoundingClientRect();
    expect(control.top).toBeGreaterThanOrEqual(panel.top);
    expect(footer.bottom).toBeLessThanOrEqual(panel.bottom + 1);
    expect(windowOf(command).scrollHeight).toBeLessThanOrEqual(windowOf(command).clientHeight + 1);
  });

  it('in a narrow window it keeps the distance of the dialog from each edge', async () => {
    await page.viewport(NARROW.width, NARROW.height);
    const command = await mount();
    const panel = windowOf(command).getBoundingClientRect();
    expect(panel.left).toBeGreaterThanOrEqual(0);
    expect(panel.right).toBeLessThanOrEqual(NARROW.width);
    expect(part(command, '.surface').getBoundingClientRect().width).toBeLessThanOrEqual(panel.width + 1);
  });
});

describe('roles and names', () => {
  it('the window is a modal dialog named by label, with the title for the screen reader only', async () => {
    const command = await mount();
    const ax = await axNode(windowOf(command));
    expect(ax.role).toBe('dialog');
    expect(ax.name).toBe('Command palette');
    expect(ax.properties.modal).toBe(true);
    const heading = dialogOf(command).shadowRoot?.querySelector('.titles') as HTMLElement;
    expect(getComputedStyle(heading).position).toBe('absolute');
  });

  it('the field is a combobox, with a listbox it controls and the active command it points to', async () => {
    const command = await mount();
    const field = fieldOf(command);
    expect(field.getAttribute('role')).toBe('combobox');
    expect(field.getAttribute('aria-autocomplete')).toBe('list');
    expect(field.getAttribute('aria-expanded')).toBe('true');
    expect(field.getAttribute('aria-haspopup')).toBe('listbox');
    const listbox = part(command, '.listbox');
    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(field.getAttribute('aria-controls')).toBe(listbox.id);
    const active = part(command, '.item[data-active]');
    expect(field.getAttribute('aria-activedescendant')).toBe(active.id);
    await press(command, '{ArrowDown}');
    expect(field.getAttribute('aria-activedescendant')).toBe(part(command, '.item[data-active]').id);
    const ax = await axNode(field);
    expect(ax.role).toBe('combobox');
    expect(ax.name).toBe('Command palette');
  });

  it('each group is a group named by its label; each command is an option, selected when active', async () => {
    const command = await mount();
    const groups = all(command, '.group');
    expect(groups.map((group) => group.getAttribute('role'))).toEqual(['group', 'group', 'group']);
    for (const group of groups) {
      const label = command.shadowRoot?.getElementById(group.getAttribute('aria-labelledby') ?? '');
      expect(label?.classList.contains('group-label')).toBe(true);
    }
    const options = all(command, '.item');
    expect(options.every((option) => option.getAttribute('role') === 'option')).toBe(true);
    expect(options.filter((option) => option.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    expect(part(command, '.item[data-active]').getAttribute('aria-selected')).toBe('true');
    expect(itemOf(command, 'Export report').getAttribute('aria-disabled')).toBe('true');
    const ax = await axNode(itemOf(command, 'New document'));
    expect(ax.role).toBe('option');
    expect(ax.name).toBe('New document');
  });

  it('the name of a command is its content, so what is seen is in the name: the label, the description and the counter', async () => {
    const command = await mount();
    const withDescription = all(command, '.item').find((item) => item.querySelector('.description')) as HTMLElement;
    const ax = await axNode(withDescription);
    expect(ax.name).toBe('Open settings Account and workspace');
    expect(ax.description).toBe('');
    const counted = all(command, '.item').find((item) => item.querySelector('.count')) as HTMLElement;
    expect((await axNode(counted)).name).toContain('3');
    /* The shortcut is hidden from the screen reader. */
    expect((await axNode(itemOf(command, 'New document'))).name).toBe('New document');
  });

  it('while loading, the listbox is busy and the field does not point to a command', async () => {
    const command = await mount({ set: { loading: true } });
    expect(part(command, '.listbox').getAttribute('aria-busy')).toBe('true');
    expect(fieldOf(command).hasAttribute('aria-activedescendant')).toBe(false);
  });
});

describe('the global shortcut', () => {
  it('is off by default: Ctrl+K and ⌘K in the page open nothing', async () => {
    const command = await mount({ open: false });
    document.getElementById('trigger')?.focus();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await settle(command);
    expect(command.open).toBe(false);
  });

  it('on, Ctrl+K and ⌘K open it, with the browser kept out, and the same key closes it', async () => {
    const command = await mount({ open: false, set: { globalShortcut: true } });
    document.getElementById('trigger')?.focus();
    const keys: KeyboardEvent[] = [];
    const record = (event: KeyboardEvent): void => {
      if (event.key === 'k') keys.push(event);
    };
    window.addEventListener('keydown', record);
    await userEvent.keyboard('{Control>}k{/Control}');
    await settle(command);
    await vi.waitFor(() => expect(windowOf(command).open).toBe(true));
    expect(command.open).toBe(true);
    expect(keys[0]?.defaultPrevented).toBe(true);
    expect(focused()).toBe(fieldOf(command));
    const closes = listen<NphDialogCloseDetail>(command, 'nph-close');
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await closed(command);
    expect(closes.map((event) => event.detail.source)).toEqual(['open-key']);
    window.removeEventListener('keydown', record);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await settle(command);
    await vi.waitFor(() => expect(command.open).toBe(true));
  });

  it('ignores the key with Alt or Shift, and a held key', async () => {
    const command = await mount({ open: false, set: { globalShortcut: true } });
    await userEvent.keyboard('{Control>}{Alt>}k{/Alt}{/Control}');
    await userEvent.keyboard('{Control>}{Shift>}k{/Shift}{/Control}');
    await settle(command);
    expect(command.open).toBe(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, repeat: true, cancelable: true }));
    await settle(command);
    expect(command.open).toBe(false);
  });

  it('stops listening when turned off and when removed from the page', async () => {
    const command = await mount({ open: false, set: { globalShortcut: true } });
    command.globalShortcut = false;
    await settle(command);
    await userEvent.keyboard('{Control>}k{/Control}');
    await settle(command);
    expect(command.open).toBe(false);
    command.globalShortcut = true;
    await settle(command);
    command.remove();
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true, bubbles: true });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe('invalid input', () => {
  it('an empty label draws nothing and says so once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { label: '  ' } });
    expect(command.shadowRoot?.querySelector('nph-dialog')).toBeNull();
    const messages = error.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((message) => message.includes('label is required'))).toHaveLength(1);
    command.requestUpdate();
    await settle(command);
    expect(error.mock.calls.map((call) => String(call[0])).filter((message) => message.includes('label is required'))).toHaveLength(1);
  });

  it('a filter outside the two draws nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { filter: 'fuzzy' } });
    expect(command.shadowRoot?.querySelector('nph-dialog')).toBeNull();
    expect(error.mock.calls.map((call) => String(call[0])).join('\n')).toContain('filter "fuzzy" does not exist');
  });

  it('loading without loading-label draws the spinner and no text, and says so', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { loading: true, loadingLabel: '' } });
    expect(part(command, '.loading nph-spinner')).not.toBeNull();
    expect(command.shadowRoot?.querySelector('.loading-text')).toBeNull();
    expect(error.mock.calls.map((call) => String(call[0])).join('\n')).toContain('loading-label is required');
  });

  it('an empty empty-heading does not draw the empty state and says so', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { emptyHeading: '' } });
    await type(command, 'xyz');
    expect(command.shadowRoot?.querySelector('nph-empty')).toBeNull();
    expect(error.mock.calls.map((call) => String(call[0])).join('\n')).toContain('empty-heading is required');
  });

  it('an empty results-label announces nothing and says so; the palette still draws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { resultsLabel: '' } });
    await type(command, 'o');
    expect(part(command, '.announce').textContent?.trim()).toBe('');
    expect(texts(command).length).toBeGreaterThan(0);
    expect(error.mock.calls.map((call) => String(call[0])).join('\n')).toContain('results-label is required');
  });

  it('a hint without its word is not drawn, and says which', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { hintOpen: '' } });
    expect(all(command, '.hint-word').map((word) => word.textContent?.trim())).toEqual(['navigate', 'close']);
    expect(error.mock.calls.map((call) => String(call[0])).join('\n')).toContain('hint-open is required');
  });

  it('with no hint word at all the footer and its line are not drawn', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ set: { hintNavigate: '', hintOpen: '', hintClose: '' } });
    expect(command.shadowRoot?.querySelector('.footer')).toBeNull();
    expect(all(command, 'nph-separator')).toHaveLength(1);
  });

  it('hide-footer does not ask for the hint words', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await mount({ set: { hideFooter: true, hintNavigate: '', hintOpen: '', hintClose: '' } });
    expect(error.mock.calls.map((call) => String(call[0])).join('\n')).not.toContain('hint-');
  });

  it('an invalid entry is left out, with one error per cause, and the rest draws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const entries = [
      { value: 'ok', text: 'Fine' },
      { value: 'a', text: '' },
      { text: 'No value' },
      { value: 'b', text: 'Bad icon', icon: 'not-an-icon' },
      { value: 'c', text: 'Bad severity', severity: 'loud' },
      { value: 'd', text: 'Has submenu', submenu: true },
      { value: 'e', text: 'Has switch', switch: true },
      { value: 'f', text: 'Selectable', selection: 'single' },
      { type: 'separator' },
      { type: 'label', text: '' },
      { type: 'other' },
      null,
      { value: 'g', text: 'Another', submenu: true },
    ] as unknown as NphCommandEntry[];
    const command = await mount({ items: entries });
    expect(texts(command)).toEqual(['Fine']);
    const messages = error.mock.calls.map((call) => String(call[0]));
    for (const cause of [
      'a command has no text',
      'a command has no string value',
      'is not a core name of nph-icon',
      'severity "loud" does not exist',
      '"submenu" does not exist in the palette',
      '"switch" does not exist in the palette',
      '"selection" does not exist in the palette',
      'a separator entry does not exist here',
      'a label entry has no text',
      'an entry type "other" does not exist',
      'an entry is not an object',
    ]) {
      expect(messages.filter((message) => message.includes(cause)), cause).toHaveLength(1);
    }
  });

  it('a duplicated list is not read again: the same items give no new error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const command = await mount({ items: [{ value: 'a', text: '' } as NphCommandEntry] });
    const before = error.mock.calls.length;
    command.requestUpdate();
    await settle(command);
    expect(error.mock.calls.length).toBe(before);
  });
});

describe('what the palette does not have', () => {
  it('no separator between groups, no submenu, no multiple choice, no sizes', async () => {
    const command = await mount();
    expect(command.shadowRoot?.querySelector('.group nph-separator, .listbox nph-separator')).toBeNull();
    expect(command.shadowRoot?.querySelector('nph-checkbox, nph-switch')).toBeNull();
    expect(command.getAttribute('size')).toBeNull();
  });

  it('writes no attribute on the host but open', async () => {
    const command = await mount();
    expect([...command.attributes].map((attribute) => attribute.name)).toEqual(['open']);
  });
});

describe('token contract', () => {
  const consumed = [...new Set(componentCss.match(/--nph-[a-z0-9-]+/g) ?? [])];

  it('every token the CSS consumes exists in tokens.css, and none is core or theme', () => {
    expect(consumed.length).toBeGreaterThan(0);
    for (const token of consumed) {
      expect(tokensCss, token).toContain(`${token}:`);
      expect(token).not.toMatch(/^--nph-(core|theme)-/);
    }
  });

  it('consumes the fifteen command tokens of the evidence', () => {
    for (const token of [
      'background',
      'radius',
      'max-width',
      'divider',
      'search-padding',
      'list-max-height',
      'list-padding',
      'highlight-weight',
      'state-padding',
      'status-gap',
      'status-foreground',
      'footer-padding',
      'footer-gap',
      'hint-gap',
      'footer-foreground',
    ]) {
      expect(consumed, token).toContain(`--nph-command-${token}`);
      expect(tokensCss, token).toContain(`--nph-command-${token}:`);
    }
  });

  it('writes no literal color and no literal measure outside the box relations', () => {
    const code = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(code).not.toMatch(/\d(px|rem|em)\b/);
    expect(code).not.toMatch(/rgba?\(/);
  });

  it('the dark scheme moves the panel and the lines only through the semantic tokens', () => {
    expect(tokensCss).toMatch(/--nph-command-background:\s*var\(--nph-color-dialog\)/);
    expect(tokensCss).toMatch(/--nph-command-divider:\s*var\(--nph-color-dialog-separator\)/);
  });
});
