/**
 * Tests of `nph-timeline` (P132), in a real browser (P21, item 5): the measures, the colors, the focus and the
 * names the browser computes only exist where there is layout.
 *
 * They prove the contract accepted in Figma (documentation frame `5237:3423`, sets `5216:304` and `5216:701`),
 * recorded in the evidence of the `figma-docs-accepted` gate of DSA-89: the API, the invalid input, the list
 * semantics and the names the browser computes, the three markers and the six states, the connector line on a whole
 * pixel, the text, the action, the slot for rich content, "Show more" with its announcement and its focus, the
 * loading and empty states, the absence of motion, the color scheme and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-timeline.css?raw';
import {
  NPH_TIMELINE_ACTION_EVENT,
  NPH_TIMELINE_LOADING_ROWS,
  NPH_TIMELINE_MARKERS,
  NPH_TIMELINE_MORE_EVENT,
  NPH_TIMELINE_STATUSES,
  NPH_TIMELINE_TYPES,
  NphTimeline,
} from './nph-timeline';
import type { NphTimelineActionDetail, NphTimelineItem } from './nph-timeline';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('600 14px "Noto Sans"');
  await document.fonts.ready;
});

/** The listeners a test puts on the page; aborted at the end of each test, so none leaks into the next. */
let listeners = new AbortController();

afterEach(() => {
  listeners.abort();
  listeners = new AbortController();
  document.body.replaceChildren();
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

const TEXTS = {
  label: 'Request history',
  completedLabel: 'Completed',
  currentLabel: 'Current step',
  pendingLabel: 'Waiting',
  errorLabel: 'Error',
  warningLabel: 'Warning',
  loadingLabel: 'Loading',
  moreLabel: 'Show more',
  newLabel: '{count} new events',
  loadedLabel: '{count} events loaded',
  emptyHeading: 'No events yet',
  emptyDescription: 'Events show up here as they happen.',
};

const PROCESS: NphTimelineItem[] = [
  { title: 'Request sent', who: 'Ana Souza', when: '08/11, 09:12', datetime: '2026-11-08T09:12', status: 'completed' },
  { title: 'Under review', description: 'The team is checking the request.', who: 'Bruno Lima', when: '09/11, 10:00', datetime: '2026-11-09T10:00', status: 'current' },
  { title: 'Approval', who: 'Warehouse', status: 'pending' },
];

const HISTORY: NphTimelineItem[] = [
  { title: 'Record created', who: 'System', when: '08/11, 10:05', datetime: '2026-11-08T10:05' },
  { title: 'Owner changed', who: 'Ana Souza', when: '08/11, 11:30', datetime: '2026-11-08T11:30' },
  { title: 'Comment added', who: 'Bruno Lima', when: '09/11, 08:00', datetime: '2026-11-09T08:00' },
];

async function mount(props: Partial<NphTimeline> = {}, width = '30rem'): Promise<NphTimeline> {
  const holder = document.createElement('div');
  holder.style.inlineSize = width;
  const timeline = document.createElement('nph-timeline');
  Object.assign(timeline, { items: PROCESS, ...TEXTS, ...props });
  holder.append(timeline);
  document.body.append(holder);
  await settle(timeline);
  return timeline;
}

async function settle(timeline: NphTimeline): Promise<void> {
  await timeline.updateComplete;
  await frame();
  for (const inner of timeline.shadowRoot?.querySelectorAll('nph-icon, nph-button, nph-avatar, nph-skeleton, nph-empty, nph-separator') ?? []) {
    await (inner as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  }
  await timeline.updateComplete;
}

const root = (timeline: NphTimeline): ShadowRoot => timeline.shadowRoot as ShadowRoot;
const list = (timeline: NphTimeline): HTMLOListElement => root(timeline).querySelector('ol') as HTMLOListElement;
const items = (timeline: NphTimeline): HTMLElement[] => [...root(timeline).querySelectorAll<HTMLElement>('li.item')];
const item = (timeline: NphTimeline, index: number): HTMLElement => items(timeline)[index] as HTMLElement;
const marker = (timeline: NphTimeline, index: number): HTMLElement => item(timeline, index).querySelector('.marker') as HTMLElement;
const connector = (timeline: NphTimeline, index: number): HTMLElement | null => item(timeline, index).querySelector('.connector');
const title = (timeline: NphTimeline, index: number): HTMLElement => item(timeline, index).querySelector('.title') as HTMLElement;
const more = (timeline: NphTimeline): HTMLElement | null => root(timeline).querySelector('.more');
const live = (timeline: NphTimeline): HTMLElement => root(timeline).querySelector('.live') as HTMLElement;

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));
const color = (token: string): string => resolved('color', token);
const background = (token: string): string => resolved('background-color', token);

const frame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** The events the timeline fires, collected until the end of the test. */
function collect<T>(timeline: NphTimeline, name: string): T[] {
  const seen: T[] = [];
  timeline.addEventListener(name, (event) => seen.push((event as CustomEvent<T>).detail), { signal: listeners.signal });
  return seen;
}

/** The node the browser itself builds for an element in its accessibility tree. */
async function axNode(element: Element): Promise<{ role: string; name: string }> {
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
    return { role: String(node?.role?.value ?? ''), name: String(node?.name?.value ?? '') };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('registers the tag and exports the values of the contract', () => {
    expect(customElements.get('nph-timeline')).toBe(NphTimeline);
    expect([...NPH_TIMELINE_TYPES]).toEqual(['process', 'history']);
    expect([...NPH_TIMELINE_STATUSES]).toEqual(['neutral', 'completed', 'current', 'pending', 'error', 'warning']);
    expect([...NPH_TIMELINE_MARKERS]).toEqual(['dot', 'circle', 'avatar']);
    expect(NPH_TIMELINE_ACTION_EVENT).toBe('nph-timeline-action');
    expect(NPH_TIMELINE_MORE_EVENT).toBe('nph-timeline-more');
  });

  it('has the defaults of the contract', () => {
    const timeline = new NphTimeline();
    expect(timeline.items).toEqual([]);
    expect(timeline.type).toBe('process');
    expect(timeline.hasMore).toBe(false);
    expect(timeline.loading).toBe(false);
    expect(timeline.live).toBe(false);
    expect(timeline.labelledBy).toBeNull();
  });

  it('reflects type, has-more, loading and live', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true, loading: false, live: true });
    expect(timeline.getAttribute('type')).toBe('history');
    expect(timeline.hasAttribute('has-more')).toBe(true);
    expect(timeline.hasAttribute('live')).toBe(true);
    expect(timeline.hasAttribute('loading')).toBe(false);
    timeline.loading = true;
    await timeline.updateComplete;
    expect(timeline.hasAttribute('loading')).toBe(true);
  });

  it('reads the attributes of the texts', async () => {
    const timeline = document.createElement('nph-timeline');
    timeline.setAttribute('completed-label', 'Done');
    timeline.setAttribute('more-label', 'More');
    timeline.setAttribute('aria-label', 'Name');
    expect(timeline.completedLabel).toBe('Done');
    expect(timeline.moreLabel).toBe('More');
    expect(timeline.hostName).toBe('Name');
  });

  it('is a block that takes the width of where it lives', async () => {
    const timeline = await mount({}, '25rem');
    expect(getComputedStyle(timeline).display).toBe('block');
    expect(timeline.getBoundingClientRect().width).toBe(25 * 16);
  });

  it('has no ::part, no slot of its own and no event of its own besides the two of the contract', async () => {
    const timeline = await mount();
    expect(root(timeline).querySelector('[part]')).toBeNull();
    expect(root(timeline).querySelectorAll('slot')).toHaveLength(0);
  });
});

describe('invalid input', () => {
  async function problems(props: Partial<NphTimeline>): Promise<{ timeline: NphTimeline; errors: string[] }> {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const timeline = await mount(props);
    const errors = spy.mock.calls.map((call) => String(call[0]));
    return { timeline, errors };
  }

  const cases: Array<[string, Partial<NphTimeline>, RegExp]> = [
    ['items that is not a list', { items: 'a,b' as unknown as NphTimelineItem[] }, /`items` is not a list/],
    ['an item without a title', { items: [{ title: 'A' }, { title: '  ' }] }, /item 2 has no `title`/],
    ['an item that is not an object', { items: [{ title: 'A' }, null as unknown as NphTimelineItem] }, /item 2 has no `title`/],
    ['a status outside the list', { items: [{ title: 'A', status: 'done' as unknown as 'error' }] }, /status "done" of item 1 does not exist/],
    ['a marker outside the list', { items: [{ title: 'A', marker: 'square' as unknown as 'dot' }] }, /marker "square" of item 1 does not exist/],
    ['a type outside the list', { type: 'steps' as unknown as 'process' }, /type "steps" does not exist/],
  ];

  for (const [name, props, message] of cases) {
    it(`${name} draws nothing and says it once`, async () => {
      const { timeline, errors } = await problems(props);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatch(message);
      expect(timeline.hasAttribute('data-nph-rendered')).toBe(false);
      expect(getComputedStyle(timeline).display).toBe('none');
      expect(root(timeline).querySelector('ol')).toBeNull();
    });
  }

  it('a re-render with the same input stays silent', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const timeline = await mount({ items: [{ title: '' }] });
    timeline.label = 'Other';
    await timeline.updateComplete;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('a valid input after an invalid one draws the list', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const timeline = await mount({ items: [{ title: '' }] });
    timeline.items = PROCESS;
    await settle(timeline);
    expect(timeline.hasAttribute('data-nph-rendered')).toBe(true);
    expect(items(timeline)).toHaveLength(3);
  });

  it('an empty list with no empty-heading is a mount: it draws nothing and says nothing but a warning', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const timeline = await mount({ items: [], emptyHeading: null });
    expect(error).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/empty-heading/);
    expect(getComputedStyle(timeline).display).toBe('none');
  });

  it('a single event is valid: one item in a named list, with no connector line', async () => {
    const timeline = await mount({ items: [{ title: 'Created', status: 'completed' }] });
    expect(items(timeline)).toHaveLength(1);
    expect(connector(timeline, 0)).toBeNull();
    expect(list(timeline).getAttribute('aria-label')).toBe('Request history');
  });

  it('the hidden attribute of the consumer still hides a valid timeline', async () => {
    const timeline = await mount();
    timeline.hidden = true;
    await timeline.updateComplete;
    expect(getComputedStyle(timeline).display).toBe('none');
  });
});

describe('warnings: drawn, and said once', () => {
  async function warnings(props: Partial<NphTimeline>): Promise<string[]> {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const timeline = await mount(props);
    timeline.requestUpdate();
    await timeline.updateComplete;
    expect(timeline.hasAttribute('data-nph-rendered')).toBe(true);
    return spy.mock.calls.map((call) => String(call[0]));
  }

  const blank = { label: null, hostName: null, labelledBy: null };

  it('a list with no accessible name', async () => {
    const messages = await warnings(blank);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/no accessible name/);
  });

  it('a state with no text for it, one message per property', async () => {
    const messages = await warnings({ completedLabel: null, currentLabel: null, pendingLabel: null });
    expect(messages).toHaveLength(3);
    expect(messages.join('\n')).toMatch(/completed-label/);
    expect(messages.join('\n')).toMatch(/current-label/);
    expect(messages.join('\n')).toMatch(/pending-label/);
  });

  it('an error and a warning item with no text for them', async () => {
    const messages = await warnings({
      items: [{ title: 'A', status: 'error' }, { title: 'B', status: 'warning' }],
      errorLabel: null,
      warningLabel: null,
    });
    expect(messages.join('\n')).toMatch(/error-label/);
    expect(messages.join('\n')).toMatch(/warning-label/);
  });

  it('a when without a datetime', async () => {
    const messages = await warnings({ items: [{ title: 'A', when: '08/11', status: 'completed' }] });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/`when` and no `datetime`/);
  });

  it('a status on a dot or an avatar is ignored', async () => {
    const messages = await warnings({ items: [{ title: 'A', marker: 'dot', status: 'completed' }, { title: 'B', marker: 'avatar', status: 'error' }] });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/only the circle marker has a state/);
  });

  it('more than one current item', async () => {
    const messages = await warnings({ items: [{ title: 'A', status: 'current' }, { title: 'B', status: 'current' }] });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/more than one item is current/);
  });

  it('a repeated id', async () => {
    const messages = await warnings({ items: [{ title: 'A', id: 'x' }, { title: 'B', id: 'x' }] });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/same `id`/);
  });

  it('has-more with no more-label, and live with no new-label', async () => {
    const messages = await warnings({ hasMore: true, moreLabel: null, live: true, newLabel: null });
    expect(messages.join('\n')).toMatch(/more-label/);
    expect(messages.join('\n')).toMatch(/new-label/);
  });

  it('loading with no loading-label', async () => {
    const messages = await warnings({ loading: true, loadingLabel: null });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatch(/loading-label/);
  });

  it('a clean list says nothing', async () => {
    expect(await warnings({})).toEqual([]);
  });
});

describe('semantics', () => {
  it('is an ordered list with a name and one list item per event, and no role of its own', async () => {
    const timeline = await mount();
    const ol = list(timeline);
    expect(ol.tagName).toBe('OL');
    expect(ol.hasAttribute('role')).toBe(false);
    expect([...ol.children].map((child) => child.tagName)).toEqual(['LI', 'LI', 'LI']);
    expect(await axNode(ol)).toEqual({ role: 'list', name: 'Request history' });
  });

  it('the label wins over the host aria-label', async () => {
    const timeline = await mount({ label: 'Named', hostName: 'Ignored' });
    expect(list(timeline).getAttribute('aria-label')).toBe('Named');
    const other = await mount({ label: null, hostName: 'From the host' });
    expect(list(other).getAttribute('aria-label')).toBe('From the host');
  });

  it('a visible title names the list by labelledBy, an element given as a property', async () => {
    const heading = document.createElement('h2');
    heading.textContent = 'Order 4812';
    document.body.append(heading);
    const timeline = await mount({ label: null, labelledBy: heading });
    expect(list(timeline).hasAttribute('aria-label')).toBe(false);
    expect(await axNode(list(timeline))).toEqual({ role: 'list', name: 'Order 4812' });
  });

  it('labelledBy wins over label when both are given, as aria-labelledby does over aria-label', async () => {
    const heading = document.createElement('h2');
    heading.textContent = 'Order 4812';
    document.body.append(heading);
    const timeline = await mount({ label: 'Request history', labelledBy: heading });
    expect(await axNode(list(timeline))).toEqual({ role: 'list', name: 'Order 4812' });
  });

  it('only the current item of the process type has aria-current="step"', async () => {
    const timeline = await mount();
    const current = [...root(timeline).querySelectorAll('[aria-current]')];
    expect(current).toEqual([item(timeline, 1)]);
    expect(current[0]?.getAttribute('aria-current')).toBe('step');
  });

  it('the history has no aria-current, even on an item drawn as current', async () => {
    const timeline = await mount({ type: 'history', items: [{ title: 'A', status: 'completed', marker: 'circle' }, { title: 'B', status: 'current', marker: 'circle' }] });
    expect(root(timeline).querySelector('[aria-current]')).toBeNull();
  });

  it('with more than one current item the first one takes aria-current', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const timeline = await mount({ items: [{ title: 'A', status: 'completed' }, { title: 'B', status: 'current' }, { title: 'C', status: 'current' }] });
    expect([...root(timeline).querySelectorAll('[aria-current]')]).toEqual([item(timeline, 1)]);
  });

  it('the marker and the connector line are hidden from assistive technology', async () => {
    const timeline = await mount();
    for (const rail of root(timeline).querySelectorAll('.rail')) {
      expect(rail.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('the state is hidden text at the start of the title; neutral has none and the pending item says it is waiting', async () => {
    const timeline = await mount({
      items: [
        { title: 'A', status: 'completed' },
        { title: 'B', status: 'current' },
        { title: 'C', status: 'error' },
        { title: 'D', status: 'warning' },
        { title: 'E', status: 'neutral' },
        { title: 'F', status: 'pending', who: 'Warehouse' },
      ],
    });
    const hidden = (index: number): string | undefined => item(timeline, index).querySelector('.hidden')?.textContent ?? undefined;
    expect(hidden(0)).toBe('Completed, ');
    expect(hidden(1)).toBe('Current step, ');
    expect(hidden(2)).toBe('Error, ');
    expect(hidden(3)).toBe('Warning, ');
    expect(hidden(4)).toBeUndefined();
    expect(hidden(5)).toBeUndefined();
    expect(item(timeline, 5).querySelector('.waiting')?.textContent).toBe('Waiting');
    const row = item(timeline, 0).querySelector('.title-row') as HTMLElement;
    expect(row.firstElementChild?.classList.contains('hidden')).toBe(true);
  });

  it('the event type is hidden text after the state, when the title does not tell it', async () => {
    const timeline = await mount({ items: [{ title: 'Ana wrote', status: 'completed', typeLabel: 'Comment' }, { title: 'B', typeLabel: 'Comment', marker: 'circle' }] });
    expect(item(timeline, 0).querySelector('.hidden')?.textContent).toBe('Completed, Comment, ');
    expect(item(timeline, 1).querySelector('.hidden')?.textContent).toBe('Comment, ');
  });

  it('the hidden text is clipped, not display: none, so the screen reader reads it', async () => {
    const timeline = await mount();
    const hidden = item(timeline, 0).querySelector('.hidden') as HTMLElement;
    const style = getComputedStyle(hidden);
    expect(style.display).not.toBe('none');
    expect(style.visibility).toBe('visible');
    expect(style.clipPath).not.toBe('none');
    expect(style.position).toBe('absolute');
  });

  it('the date is a time element with the machine value, and a date with no value is plain text', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const timeline = await mount({ items: [{ title: 'A', when: '08/11, 09:12', datetime: '2026-11-08T09:12' }, { title: 'B', when: '09/11' }] });
    const time = item(timeline, 0).querySelector('time') as HTMLTimeElement;
    expect(time.getAttribute('datetime')).toBe('2026-11-08T09:12');
    expect(time.textContent).toBe('08/11, 09:12');
    expect(item(timeline, 1).querySelector('time')).toBeNull();
    expect(item(timeline, 1).querySelector('.when')?.textContent).toBe('09/11');
  });

  it('the item takes no focus, no role and no tabindex: nothing on it but the actions takes Tab', async () => {
    const timeline = await mount({ items: PROCESS.map((entry, index) => (index === 1 ? { ...entry, action: 'See details' } : entry)), hasMore: true });
    for (const li of items(timeline)) {
      expect(li.hasAttribute('tabindex')).toBe(false);
      expect(li.hasAttribute('role')).toBe(false);
    }
    expect(root(timeline).querySelectorAll('[tabindex]:not([tabindex="-1"])')).toHaveLength(0);
  });

  it('the Tab key goes through the actions in list order and then "Show more"; the arrows do nothing', async () => {
    const timeline = await mount({
      items: PROCESS.map((entry, index) => ({ ...entry, action: `Action ${String(index + 1)}` })),
      hasMore: true,
    });
    const buttons = [...root(timeline).querySelectorAll<HTMLElement>('nph-button')];
    expect(buttons).toHaveLength(4);
    await userEvent.keyboard('{Tab}');
    const seen: Element[] = [];
    for (let step = 0; step < 4; step += 1) {
      seen.push(root(timeline).activeElement as Element);
      await userEvent.keyboard('{Tab}');
    }
    expect(seen).toEqual(buttons);
  });

  it('the arrow keys move nothing', async () => {
    const timeline = await mount({ items: PROCESS.map((entry) => ({ ...entry, action: 'See details' })) });
    const buttons = [...root(timeline).querySelectorAll<HTMLElement>('nph-button')];
    (buttons[0] as HTMLElement).focus();
    await userEvent.keyboard('{ArrowDown}{ArrowRight}{End}');
    expect(root(timeline).activeElement).toBe(buttons[0]);
  });

  it('the text stays selectable: the item is not interactive', async () => {
    const timeline = await mount();
    expect(getComputedStyle(item(timeline, 0)).userSelect).not.toBe('none');
    expect(getComputedStyle(item(timeline, 0)).cursor).toBe('auto');
  });
});

describe('the meta line', () => {
  const metaText = (timeline: NphTimeline, index: number): string => item(timeline, index).querySelector('.meta')?.textContent ?? '';

  it('who and when, separated by a middle dot with a space on each side', async () => {
    const timeline = await mount({ items: HISTORY });
    expect(metaText(timeline, 0)).toBe('System · 08/11, 10:05');
  });

  it('who alone and when alone carry no dot', async () => {
    const timeline = await mount({ items: [{ title: 'A', who: 'Ana' }, { title: 'B', when: '08/11', datetime: '2026-11-08' }] });
    expect(metaText(timeline, 0)).toBe('Ana');
    expect(metaText(timeline, 1)).toBe('08/11');
  });

  it('the pending item starts with the waiting word, then the middle dot and who', async () => {
    const timeline = await mount();
    expect(metaText(timeline, 2)).toBe('Waiting · Warehouse');
    const waiting = item(timeline, 2).querySelector('.waiting') as HTMLElement;
    expect(getComputedStyle(waiting).color).toBe(color('--nph-timeline-description-foreground'));
    const who = item(timeline, 2).querySelector('.who') as HTMLElement;
    expect(getComputedStyle(who).color).toBe(color('--nph-timeline-meta-foreground'));
  });

  it('the pending item with no who still says it is waiting', async () => {
    const timeline = await mount({ items: [{ title: 'A', status: 'pending' }] });
    expect(metaText(timeline, 0)).toBe('Waiting');
  });

  it('an item with nothing for the meta line draws none', async () => {
    const timeline = await mount({ items: [{ title: 'A' }, { title: 'B' }] });
    expect(item(timeline, 0).querySelector('.meta')).toBeNull();
  });

  it('is set in the caption style in the meta color, with no gap between the parts', async () => {
    const timeline = await mount({ items: HISTORY });
    const meta = item(timeline, 0).querySelector('.meta') as HTMLElement;
    const style = getComputedStyle(meta);
    expect(style.color).toBe(color('--nph-timeline-meta-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-caption-font-size'));
    expect(style.lineHeight).toBe(resolved('line-height', '--nph-text-caption-line-height'));
    expect(style.display).toBe('block');
    expect(style.gap).toBe('normal');
  });
});

describe('the markers', () => {
  const circle = (status: NonNullable<NphTimelineItem['status']>, extra: Partial<NphTimelineItem> = {}): NphTimelineItem => ({ title: 'T', marker: 'circle', status, ...extra });

  it('every marker column is the width of the marker, and the marker is a square of that size', async () => {
    const timeline = await mount();
    for (const index of [0, 1, 2]) {
      const box = marker(timeline, index).getBoundingClientRect();
      expect(box.width).toBe(px('--nph-timeline-marker-size'));
      expect(box.height).toBe(px('--nph-timeline-marker-size'));
      expect(item(timeline, index).querySelector('.rail')?.getBoundingClientRect().width).toBe(px('--nph-timeline-marker-size'));
    }
  });

  it('the dot is 8 px, round, in the dot color, inside a 24 px box with no fill', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY });
    const box = marker(timeline, 0);
    const dot = box.querySelector('.dot') as HTMLElement;
    expect(item(timeline, 0).dataset.marker).toBe('dot');
    expect(dot.getBoundingClientRect().width).toBe(px('--nph-timeline-dot-size'));
    expect(dot.getBoundingClientRect().height).toBe(px('--nph-timeline-dot-size'));
    expect(getComputedStyle(dot).backgroundColor).toBe(background('--nph-timeline-dot-background'));
    expect(getComputedStyle(dot).borderRadius).toBe(resolved('border-radius', '--nph-timeline-marker-radius'));
    expect(getComputedStyle(box).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const center = (rect: DOMRect): number => rect.left + rect.width / 2;
    expect(center(dot.getBoundingClientRect())).toBe(center(box.getBoundingClientRect()));
  });

  it('the marker follows the type: a circle on the process and a dot on the history, unless the item says otherwise', async () => {
    const process = await mount({ items: [{ title: 'A' }] });
    expect(item(process, 0).dataset.marker).toBe('circle');
    const history = await mount({ type: 'history', items: [{ title: 'A' }, { title: 'B', marker: 'circle' }, { title: 'C', marker: 'avatar' }] });
    expect(items(history).map((li) => li.dataset.marker)).toEqual(['dot', 'circle', 'avatar']);
  });

  it('the neutral circle: tonal fill, the event icon at 16 px in the marker foreground', async () => {
    const timeline = await mount({ items: [circle('neutral', { icon: 'comment' })] });
    const box = marker(timeline, 0);
    expect(getComputedStyle(box).backgroundColor).toBe(background('--nph-timeline-marker-background'));
    expect(getComputedStyle(box).color).toBe(color('--nph-timeline-marker-foreground'));
    expect(getComputedStyle(box).borderRadius).toBe(resolved('border-radius', '--nph-timeline-marker-radius'));
    const icon = box.querySelector('nph-icon') as HTMLElement;
    expect(icon.getAttribute('name')).toBe('comment');
    expect(icon.getAttribute('variant')).toBe('light');
    expect(icon.getBoundingClientRect().width).toBe(px('--nph-timeline-marker-icon-size'));
    expect(getComputedStyle(icon).color).toBe(color('--nph-timeline-marker-foreground'));
  });

  it('the neutral circle with no icon is the tonal circle alone', async () => {
    const timeline = await mount({ items: [circle('neutral')] });
    expect(marker(timeline, 0).querySelector('nph-icon')).toBeNull();
  });

  it('the completed circle: the primary fill and the check', async () => {
    const timeline = await mount({ items: [circle('completed', { icon: 'comment' })] });
    const box = marker(timeline, 0);
    expect(getComputedStyle(box).backgroundColor).toBe(background('--nph-timeline-marker-background-primary'));
    expect(getComputedStyle(box).color).toBe(color('--nph-timeline-marker-foreground-primary'));
    expect(box.querySelector('nph-icon')?.getAttribute('name')).toBe('check');
  });

  it('the current circle: the same fill and a center dot of the dot size, with no glyph', async () => {
    const timeline = await mount({ items: [circle('current')] });
    const box = marker(timeline, 0);
    expect(getComputedStyle(box).backgroundColor).toBe(background('--nph-timeline-marker-background-primary'));
    const center = box.querySelector('.center-dot') as HTMLElement;
    expect(center.getBoundingClientRect().width).toBe(px('--nph-timeline-dot-size'));
    expect(getComputedStyle(center).backgroundColor).toBe(background('--nph-timeline-marker-foreground-primary'));
    expect(getComputedStyle(center).borderRadius).toBe(resolved('border-radius', '--nph-timeline-marker-radius'));
    expect(box.querySelector('nph-icon')).toBeNull();
  });

  it('the pending circle: no fill, a 1 px outline in the pending color, no glyph, and the size does not change', async () => {
    const timeline = await mount({ items: [circle('pending')] });
    const box = marker(timeline, 0);
    const style = getComputedStyle(box);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopWidth).toBe(`${String(px('--nph-timeline-marker-border-width'))}px`);
    expect(style.borderTopStyle).toBe('solid');
    expect(style.borderTopColor).toBe(color('--nph-timeline-marker-border-pending'));
    expect(box.querySelector('nph-icon, .center-dot')).toBeNull();
    expect(box.getBoundingClientRect().width).toBe(px('--nph-timeline-marker-size'));
  });

  it('the error circle: the error fill, outline and circle-xmark', async () => {
    const timeline = await mount({ items: [circle('error')] });
    const box = marker(timeline, 0);
    const style = getComputedStyle(box);
    expect(style.backgroundColor).toBe(background('--nph-timeline-marker-background-error'));
    expect(style.borderTopColor).toBe(color('--nph-timeline-marker-border-error'));
    expect(style.borderTopWidth).toBe(`${String(px('--nph-timeline-marker-border-width'))}px`);
    expect(style.color).toBe(color('--nph-timeline-marker-foreground-error'));
    expect(box.querySelector('nph-icon')?.getAttribute('name')).toBe('circle-xmark');
  });

  it('the warning circle: the warning fill, outline and triangle-exclamation', async () => {
    const timeline = await mount({ items: [circle('warning')] });
    const box = marker(timeline, 0);
    const style = getComputedStyle(box);
    expect(style.backgroundColor).toBe(background('--nph-timeline-marker-background-warning'));
    expect(style.borderTopColor).toBe(color('--nph-timeline-marker-border-warning'));
    expect(style.color).toBe(color('--nph-timeline-marker-foreground-warning'));
    expect(box.querySelector('nph-icon')?.getAttribute('name')).toBe('triangle-exclamation');
  });

  it('the weight of the icon never swaps: light on every state', async () => {
    const timeline = await mount({ items: [circle('completed'), circle('error'), circle('warning'), circle('neutral', { icon: 'comment' })] });
    for (const icon of root(timeline).querySelectorAll('.marker nph-icon')) {
      expect(icon.getAttribute('variant')).toBe('light');
      expect(icon.getAttribute('size')).toBe('sm');
    }
  });

  it('the avatar marker is an nph-avatar sm with no circle around it', async () => {
    const timeline = await mount({ type: 'history', items: [{ title: 'A', marker: 'avatar', avatar: '', who: 'Ana Souza' }] });
    const box = marker(timeline, 0);
    const avatar = box.querySelector('nph-avatar') as HTMLElement;
    expect(avatar.getAttribute('size')).toBe('sm');
    expect(avatar.getBoundingClientRect().width).toBe(px('--nph-timeline-marker-size'));
    expect(getComputedStyle(box).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(box).borderTopWidth).toBe('0px');
    expect(getComputedStyle(box).borderRadius).toBe('0px');
    expect(avatar.getAttribute('aria-hidden') ?? avatar.getAttribute('role')).toBeTruthy();
  });

  it('the avatar takes the photo address, and with none draws the person icon', async () => {
    const timeline = await mount({ type: 'history', items: [{ title: 'A', marker: 'avatar', avatar: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }, { title: 'B', marker: 'avatar' }] });
    expect(item(timeline, 0).querySelector('nph-avatar')?.getAttribute('src')).toMatch(/^data:image/);
    expect(item(timeline, 1).querySelector('nph-avatar')?.getAttribute('src')).toBe('');
  });
});

describe('the text', () => {
  it('the title is in the label style and the title color', async () => {
    const timeline = await mount();
    const style = getComputedStyle(title(timeline, 0));
    expect(style.color).toBe(color('--nph-timeline-title-foreground'));
    expect(style.fontSize).toBe(resolved('font-size', '--nph-text-label-md-font-size'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('the current title is strong and the pending title is muted', async () => {
    const timeline = await mount();
    expect(getComputedStyle(title(timeline, 1)).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-strong-font-weight'));
    expect(getComputedStyle(title(timeline, 1)).color).toBe(color('--nph-timeline-title-foreground'));
    expect(getComputedStyle(title(timeline, 2)).color).toBe(color('--nph-timeline-title-foreground-pending'));
    expect(getComputedStyle(title(timeline, 0)).fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('the description is in the body style and the description color, and is optional', async () => {
    const timeline = await mount();
    const description = item(timeline, 1).querySelector('.description') as HTMLElement;
    expect(description.textContent).toBe('The team is checking the request.');
    expect(getComputedStyle(description).color).toBe(color('--nph-timeline-description-foreground'));
    expect(getComputedStyle(description).fontSize).toBe(resolved('font-size', '--nph-text-body-md-font-size'));
    expect(item(timeline, 0).querySelector('.description')).toBeNull();
  });

  it('the title row is as tall as the marker and the title centers on it', async () => {
    const timeline = await mount();
    const row = item(timeline, 0).querySelector('.title-row') as HTMLElement;
    expect(row.getBoundingClientRect().height).toBe(px('--nph-timeline-marker-size'));
    const rowBox = row.getBoundingClientRect();
    const titleBox = title(timeline, 0).getBoundingClientRect();
    expect(Math.abs(titleBox.top + titleBox.height / 2 - (rowBox.top + rowBox.height / 2))).toBeLessThanOrEqual(0.5);
  });

  it('the parts of the text are a text gap apart, in order: title, description, meta line', async () => {
    const timeline = await mount();
    const parts = [...(item(timeline, 1).querySelector('.text') as HTMLElement).children] as HTMLElement[];
    expect(parts.map((part) => part.className)).toEqual(['title-row', 'description', 'meta']);
    const gap = px('--nph-timeline-text-gap');
    expect(parts[1]!.getBoundingClientRect().top - parts[0]!.getBoundingClientRect().bottom).toBe(gap);
    expect(parts[2]!.getBoundingClientRect().top - parts[1]!.getBoundingClientRect().bottom).toBe(gap);
  });

  it('a long title and a long description wrap and the item grows, with no cut', async () => {
    const long = 'A very long title that does not fit one line of the narrow column and has to wrap '.repeat(2);
    const timeline = await mount({ items: [{ title: long, description: long, status: 'completed' }, { title: 'B' }] }, '16rem');
    const row = item(timeline, 0).querySelector('.title-row') as HTMLElement;
    expect(row.getBoundingClientRect().height).toBeGreaterThan(px('--nph-timeline-marker-size'));
    expect(title(timeline, 0).scrollWidth).toBeLessThanOrEqual(title(timeline, 0).clientWidth);
    expect(getComputedStyle(title(timeline, 0)).textOverflow).toBe('clip');
    expect(getComputedStyle(item(timeline, 0).querySelector('.description') as HTMLElement).textOverflow).toBe('clip');
    const connectorBox = connector(timeline, 0)!.getBoundingClientRect();
    expect(connectorBox.bottom).toBeLessThanOrEqual(item(timeline, 0).getBoundingClientRect().bottom);
  });

  it('a long word does not push the item out of the container', async () => {
    const word = 'Overflow'.repeat(24);
    const timeline = await mount({ items: [{ title: word, description: word, who: word }] }, '16rem');
    expect(item(timeline, 0).getBoundingClientRect().right).toBeLessThanOrEqual(timeline.getBoundingClientRect().right);
  });
});

describe('the layout of an item', () => {
  it('the content starts a content gap after the marker column', async () => {
    const timeline = await mount();
    const rail = item(timeline, 0).querySelector('.rail') as HTMLElement;
    const content = item(timeline, 0).querySelector('.content') as HTMLElement;
    expect(content.getBoundingClientRect().left - rail.getBoundingClientRect().right).toBe(px('--nph-timeline-content-gap'));
  });

  it('every item leaves an item gap below its text, while the line runs through it', async () => {
    const timeline = await mount({ items: [{ title: 'A' }, { title: 'B' }] });
    const first = item(timeline, 0).querySelector('.text') as HTMLElement;
    const second = item(timeline, 1);
    expect(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom).toBe(px('--nph-timeline-item-gap'));
  });

  it('the list has no gap of its own: the items touch', async () => {
    const timeline = await mount();
    expect(getComputedStyle(list(timeline)).gap).toBe('normal');
    expect(item(timeline, 1).getBoundingClientRect().top).toBe(item(timeline, 0).getBoundingClientRect().bottom);
  });

  it('the marker sits at the top of its column, level with the title row', async () => {
    const timeline = await mount();
    const row = item(timeline, 0).querySelector('.title-row') as HTMLElement;
    expect(marker(timeline, 0).getBoundingClientRect().top).toBe(row.getBoundingClientRect().top);
  });

  it('on the right-to-left writing the marker column goes to the right', async () => {
    document.documentElement.setAttribute('dir', 'rtl');
    const timeline = await mount();
    const rail = item(timeline, 0).querySelector('.rail') as HTMLElement;
    const content = item(timeline, 0).querySelector('.content') as HTMLElement;
    expect(rail.getBoundingClientRect().left).toBeGreaterThan(content.getBoundingClientRect().left);
  });
});

describe('the connector line', () => {
  it('is an nph-separator vertical, one per item and none on the last', async () => {
    const timeline = await mount();
    const lines = items(timeline).map((_, index) => connector(timeline, index));
    expect(lines.map((line) => line?.tagName ?? null)).toEqual(['NPH-SEPARATOR', 'NPH-SEPARATOR', null]);
    expect(lines[0]?.getAttribute('orientation')).toBe('vertical');
  });

  it('is 1 px wide, the thickness of the separator, from border/width', async () => {
    const timeline = await mount();
    expect(connector(timeline, 0)!.getBoundingClientRect().width).toBe(px('--nph-border-width'));
  });

  it('sits at half of the marker column, on a whole pixel, with no transform', async () => {
    const timeline = await mount();
    const line = connector(timeline, 0) as HTMLElement;
    const rail = item(timeline, 0).querySelector('.rail') as HTMLElement;
    const offset = line.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    expect(offset).toBe(px('--nph-timeline-marker-size') / 2);
    expect(Number.isInteger(offset)).toBe(true);
    expect(getComputedStyle(line).transform).toBe('none');
    expect(getComputedStyle(line).translate).toBe('none');
    expect(Number.isInteger(line.getBoundingClientRect().left)).toBe(true);
  });

  it('runs from a gap below the marker to a gap above the bottom of the item', async () => {
    const timeline = await mount({ items: [{ title: 'A', description: 'Two' }, { title: 'B' }] });
    const line = connector(timeline, 0)!.getBoundingClientRect();
    const box = marker(timeline, 0).getBoundingClientRect();
    expect(line.top - box.bottom).toBe(px('--nph-timeline-connector-gap'));
    expect(item(timeline, 0).getBoundingClientRect().bottom - line.bottom).toBe(px('--nph-timeline-connector-gap'));
    expect(marker(timeline, 1).getBoundingClientRect().top - line.bottom).toBe(px('--nph-timeline-connector-gap'));
  });

  it('is painted in the connector color on every status but the pending one', async () => {
    const timeline = await mount({
      items: [
        { title: 'N', marker: 'circle' },
        { title: 'C', status: 'completed' },
        { title: 'U', status: 'current' },
        { title: 'E', status: 'error' },
        { title: 'W', status: 'warning' },
        { title: 'D', marker: 'dot' },
        { title: 'A', marker: 'avatar' },
        { title: 'last' },
      ],
    });
    for (let index = 0; index < 7; index += 1) {
      expect(getComputedStyle(connector(timeline, index)!).backgroundColor, String(index)).toBe(background('--nph-timeline-connector-border'));
    }
  });

  it('on the pending item the separator keeps its own color, color/border', async () => {
    const timeline = await mount({ items: [{ title: 'A', status: 'pending' }, { title: 'B' }] });
    expect(getComputedStyle(connector(timeline, 0)!).backgroundColor).toBe(background('--nph-color-border'));
    expect(getComputedStyle(connector(timeline, 0)!).backgroundColor).not.toBe(background('--nph-timeline-connector-border'));
  });

  it('does not change the separator: it is the one of the system', async () => {
    const timeline = await mount();
    const separator = document.createElement('nph-separator');
    separator.setAttribute('orientation', 'vertical');
    document.body.append(separator);
    await (separator as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    expect(getComputedStyle(separator).backgroundColor).toBe(background('--nph-color-border'));
    expect(connector(timeline, 0)!.shadowRoot).not.toBeNull();
  });
});

describe('the action', () => {
  const WITH_ACTION = PROCESS.map((entry, index) => (index === 1 ? { ...entry, id: 'review', action: 'See details' } : entry));

  it('is an nph-button secondary ghost below the text, off by default', async () => {
    const timeline = await mount({ items: WITH_ACTION });
    expect(root(timeline).querySelectorAll('nph-button')).toHaveLength(1);
    const button = item(timeline, 1).querySelector('nph-button') as HTMLElement;
    expect(button.getAttribute('severity')).toBe('secondary');
    expect(button.getAttribute('emphasis')).toBe('ghost');
    expect(button.getAttribute('text')).toBe('See details');
    const text = item(timeline, 1).querySelector('.text') as HTMLElement;
    expect(button.getBoundingClientRect().top - text.getBoundingClientRect().bottom).toBe(px('--nph-timeline-action-gap'));
  });

  it('fires nph-timeline-action with the position and the id, bubbling out of the shadow root', async () => {
    const timeline = await mount({ items: WITH_ACTION });
    const seen = collect<NphTimelineActionDetail>(timeline, 'nph-timeline-action');
    let outside = 0;
    document.addEventListener('nph-timeline-action', () => (outside += 1), { signal: listeners.signal });
    (item(timeline, 1).querySelector('nph-button') as HTMLElement).click();
    expect(seen).toEqual([{ index: 1, id: 'review' }]);
    expect(outside).toBe(1);
  });

  it('the id is null when the item has none', async () => {
    const timeline = await mount({ items: [{ title: 'A', action: 'Open' }] });
    const seen = collect<NphTimelineActionDetail>(timeline, 'nph-timeline-action');
    (item(timeline, 0).querySelector('nph-button') as HTMLElement).click();
    expect(seen).toEqual([{ index: 0, id: null }]);
  });

  it('a keyboard activation fires it too, with Enter and with Space', async () => {
    const timeline = await mount({ items: WITH_ACTION });
    const seen = collect<NphTimelineActionDetail>(timeline, 'nph-timeline-action');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(seen).toHaveLength(2);
  });

  it('a disabled action keeps the item as it is and fires nothing', async () => {
    const timeline = await mount({ items: WITH_ACTION.map((entry, index) => (index === 1 ? { ...entry, actionDisabled: true } : entry)) });
    const seen = collect<NphTimelineActionDetail>(timeline, 'nph-timeline-action');
    const button = item(timeline, 1).querySelector('nph-button') as HTMLElement;
    expect(button.hasAttribute('disabled')).toBe(true);
    button.click();
    expect(seen).toEqual([]);
    expect(getComputedStyle(marker(timeline, 1)).backgroundColor).toBe(background('--nph-timeline-marker-background-primary'));
    expect(getComputedStyle(title(timeline, 1)).opacity).toBe('1');
    expect(getComputedStyle(item(timeline, 1)).opacity).toBe('1');
    /* Only the button goes under the disabled opacity (T11): it is the one the browser draws dimmed. */
    const opacity = (element: Element): number => Number.parseFloat(getComputedStyle(element).opacity);
    const native = button.shadowRoot?.querySelector('button') as HTMLElement;
    const dimmed = opacity(button) * opacity(native);
    expect(dimmed).toBeCloseTo(Number.parseFloat(resolved('opacity', '--nph-state-disabled-opacity')), 5);
  });

  it('the item has no hover, pressed or selected look', async () => {
    const timeline = await mount();
    const before = getComputedStyle(item(timeline, 0)).backgroundColor;
    await userEvent.hover(item(timeline, 0));
    expect(getComputedStyle(item(timeline, 0)).backgroundColor).toBe(before);
    expect(getComputedStyle(item(timeline, 0)).cursor).toBe('auto');
    await userEvent.unhover(item(timeline, 0));
  });
});

describe('rich content in a slot', () => {
  it('the slot is named as the id of the item and draws the content below the text', async () => {
    const timeline = await mount({ items: PROCESS.map((entry, index) => (index === 0 ? { ...entry, id: 'ev1' } : entry)) });
    const block = document.createElement('div');
    block.slot = 'ev1';
    block.textContent = 'Rich content';
    block.style.blockSize = '3rem';
    timeline.append(block);
    await settle(timeline);
    const slot = item(timeline, 0).querySelector('slot') as HTMLSlotElement;
    expect(slot.name).toBe('ev1');
    expect(slot.assignedElements()).toEqual([block]);
    const text = item(timeline, 0).querySelector('.text') as HTMLElement;
    expect(block.getBoundingClientRect().top - text.getBoundingClientRect().bottom).toBe(px('--nph-timeline-action-gap'));
    expect(block.getBoundingClientRect().width).toBe((item(timeline, 0).querySelector('.content') as HTMLElement).getBoundingClientRect().width);
  });

  it('an item without an id has no slot, and an empty slot adds no gap', async () => {
    const timeline = await mount({ items: [{ title: 'A', id: 'a' }, { title: 'B' }] });
    expect(item(timeline, 1).querySelector('slot')).toBeNull();
    const text = item(timeline, 0).querySelector('.text') as HTMLElement;
    const content = item(timeline, 0).querySelector('.content') as HTMLElement;
    expect(content.getBoundingClientRect().bottom - text.getBoundingClientRect().bottom).toBe(px('--nph-timeline-item-gap'));
  });

  it('the timeline does not style what goes in the slot', async () => {
    const timeline = await mount({ items: [{ title: 'A', id: 'a' }] });
    const block = document.createElement('div');
    block.slot = 'a';
    block.textContent = 'x';
    block.style.color = 'rgb(1, 2, 3)';
    timeline.append(block);
    await settle(timeline);
    expect(getComputedStyle(block).color).toBe('rgb(1, 2, 3)');
  });
});

describe('"Show more"', () => {
  const more3 = (): NphTimelineItem[] => [
    { title: 'Older 1', who: 'A', when: '01/11', datetime: '2026-11-01' },
    { title: 'Older 2', who: 'B', when: '31/10', datetime: '2026-10-31' },
  ];

  it('is a ghost button after the list, outside it, on while has-more is on', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    const button = more(timeline) as HTMLElement;
    expect(button.tagName).toBe('NPH-BUTTON');
    expect(button.getAttribute('severity')).toBe('secondary');
    expect(button.getAttribute('emphasis')).toBe('ghost');
    expect(button.getAttribute('text')).toBe('Show more');
    expect(list(timeline).contains(button)).toBe(false);
    expect(list(timeline).compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(more(await mount({ items: HISTORY }))).toBeNull();
  });

  it('is aligned to the marker column', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    expect((more(timeline) as HTMLElement).getBoundingClientRect().left).toBe(marker(timeline, 0).getBoundingClientRect().left);
  });

  it('fires nph-timeline-more, bubbling out of the shadow root', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    const seen = collect<undefined>(timeline, 'nph-timeline-more');
    let outside = 0;
    document.addEventListener('nph-timeline-more', () => (outside += 1), { signal: listeners.signal });
    (more(timeline) as HTMLElement).click();
    expect(seen).toHaveLength(1);
    expect(outside).toBe(1);
  });

  it('the earlier events go in at the end of the list, before the button, and are announced; the focus stays on the button', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    (more(timeline) as HTMLElement).focus();
    (more(timeline) as HTMLElement).click();
    timeline.items = [...HISTORY, ...more3()];
    await settle(timeline);
    expect(items(timeline).map((li) => li.querySelector('.title')?.textContent)).toEqual(['Record created', 'Owner changed', 'Comment added', 'Older 1', 'Older 2']);
    expect(live(timeline).textContent?.trim()).toBe('2 events loaded');
    expect(root(timeline).activeElement).toBe(more(timeline));
    expect(connector(timeline, 2)).not.toBeNull();
    expect(list(timeline).contains(more(timeline))).toBe(false);
  });

  it('on the last batch the button goes away and the focus moves to the first new item, which takes tabindex only while it holds it', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    (more(timeline) as HTMLElement).focus();
    (more(timeline) as HTMLElement).click();
    timeline.items = [...HISTORY, ...more3()];
    timeline.hasMore = false;
    await settle(timeline);
    expect(more(timeline)).toBeNull();
    const first = item(timeline, 3);
    expect(root(timeline).activeElement).toBe(first);
    expect(first.getAttribute('tabindex')).toBe('-1');
    expect(first.querySelector('.title')?.textContent).toBe('Older 1');
    expect(live(timeline).textContent?.trim()).toBe('2 events loaded');
    first.blur();
    expect(first.hasAttribute('tabindex')).toBe(false);
  });

  it('the connector line of the old last item appears, and the new last item has none', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    expect(connector(timeline, 2)).toBeNull();
    timeline.items = [...HISTORY, ...more3()];
    timeline.hasMore = false;
    await settle(timeline);
    expect(connector(timeline, 2)).not.toBeNull();
    expect(connector(timeline, 4)).toBeNull();
  });

  it('with the last batch and no event, the focus goes to the last item', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    (more(timeline) as HTMLElement).focus();
    (more(timeline) as HTMLElement).click();
    timeline.hasMore = false;
    await settle(timeline);
    expect(root(timeline).activeElement).toBe(item(timeline, 2));
  });

  it('a request that ended with no event is not the answer to a later growth', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true, live: true });
    (more(timeline) as HTMLElement).click();
    timeline.hasMore = false;
    await settle(timeline);
    timeline.items = [{ title: 'New' }, ...HISTORY];
    await settle(timeline);
    expect(live(timeline).textContent?.trim()).toBe('1 new events');
  });

  it('the focus is not moved when it was not on the button', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, hasMore: true });
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    timeline.hasMore = false;
    await settle(timeline);
    expect(document.activeElement).toBe(outside);
  });

  it('a new list without "Show more" announces nothing', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY });
    timeline.items = [...HISTORY, ...more3()];
    await settle(timeline);
    expect(live(timeline).textContent).toBe('');
  });
});

describe('live events', () => {
  it('the region is a polite live region outside the list, empty at first', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, live: true });
    const region = live(timeline);
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(list(timeline).contains(region)).toBe(false);
    expect(region.textContent).toBe('');
    expect(list(timeline).hasAttribute('aria-live')).toBe(false);
  });

  it('a growth with live on is announced; the same text twice still changes the region', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY, live: true });
    const fresh = (n: number): NphTimelineItem[] => Array.from({ length: n }, (_, index) => ({ title: `New ${String(index)}` }));
    timeline.items = [...fresh(2), ...HISTORY];
    await settle(timeline);
    const first = live(timeline).textContent ?? '';
    expect(first.trim()).toBe('2 new events');
    timeline.items = [...fresh(2), ...(timeline.items as NphTimelineItem[])];
    await settle(timeline);
    const second = live(timeline).textContent ?? '';
    expect(second.trim()).toBe('2 new events');
    expect(second).not.toBe(first);
  });

  it('with live off a growth is not announced, and a shrink or the first load is not either', async () => {
    const timeline = await mount({ type: 'history', items: HISTORY });
    timeline.items = [{ title: 'A' }, ...HISTORY];
    await settle(timeline);
    expect(live(timeline).textContent).toBe('');
    const on = await mount({ type: 'history', items: [], live: true });
    on.items = HISTORY;
    await settle(on);
    expect(live(on).textContent).toBe('');
    on.items = HISTORY.slice(0, 1);
    await settle(on);
    expect(live(on).textContent).toBe('');
  });
});

describe('loading and empty', () => {
  it('loading sets aria-busy on the list, hides the skeleton, and writes the word outside the hidden node', async () => {
    const timeline = await mount({ items: [], loading: true });
    const ol = list(timeline);
    expect(ol.getAttribute('aria-busy')).toBe('true');
    expect(ol.getAttribute('aria-label')).toBe('Request history');
    const rows = ol.querySelector('.rows') as HTMLElement;
    expect(rows.getAttribute('aria-hidden')).toBe('true');
    expect(rows.querySelectorAll('nph-skeleton[shape="avatar-sm"]')).toHaveLength(NPH_TIMELINE_LOADING_ROWS);
    expect(rows.querySelectorAll('nph-skeleton[shape="line"]')).toHaveLength(NPH_TIMELINE_LOADING_ROWS * 2);
    const word = ol.querySelector('.hidden') as HTMLElement;
    expect(word.textContent).toBe('Loading');
    expect(rows.contains(word)).toBe(false);
    expect(ol.querySelectorAll('.item')).toHaveLength(0);
  });

  it('a list named only by labelledBy keeps its name while it loads', async () => {
    const heading = document.createElement('h2');
    heading.textContent = 'Order 4812';
    document.body.append(heading);
    const timeline = await mount({ items: [], loading: true, label: null, labelledBy: heading });
    expect(await axNode(list(timeline))).toEqual({ role: 'list', name: 'Order 4812' });
  });

  it('loading replaces the items, even when there are some', async () => {
    const timeline = await mount({ loading: true });
    expect(items(timeline)).toHaveLength(0);
    timeline.loading = false;
    await settle(timeline);
    expect(items(timeline)).toHaveLength(3);
    expect(list(timeline).hasAttribute('aria-busy')).toBe(false);
  });

  it('the skeleton rows are a marker, a gap and a text column, an item gap apart', async () => {
    const timeline = await mount({ items: [], loading: true });
    const rows = [...root(timeline).querySelectorAll<HTMLElement>('.row')];
    expect(rows).toHaveLength(3);
    const avatar = rows[0]!.querySelector('nph-skeleton') as HTMLElement;
    expect(avatar.getBoundingClientRect().width).toBe(px('--nph-timeline-marker-size'));
    expect(rows[0]!.querySelector('.row-text')!.getBoundingClientRect().left - avatar.getBoundingClientRect().right).toBe(px('--nph-timeline-content-gap'));
    expect(rows[1]!.getBoundingClientRect().top - rows[0]!.getBoundingClientRect().bottom).toBe(px('--nph-timeline-item-gap'));
  });

  it('no events: nph-empty in place of the list, and no empty list remains', async () => {
    const timeline = await mount({ items: [] });
    const empty = root(timeline).querySelector('nph-empty') as HTMLElement;
    expect(empty.getAttribute('heading')).toBe('No events yet');
    expect(empty.getAttribute('description')).toBe('Events show up here as they happen.');
    expect(root(timeline).querySelector('ol')).toBeNull();
    expect(more(timeline)).toBeNull();
  });

  it('the empty state goes away when the events arrive', async () => {
    const timeline = await mount({ items: [] });
    timeline.items = HISTORY;
    await settle(timeline);
    expect(root(timeline).querySelector('nph-empty')).toBeNull();
    expect(items(timeline)).toHaveLength(3);
  });
});

describe('motion', () => {
  it('nothing animates: no transition and no animation on any part', async () => {
    const timeline = await mount({ items: [...PROCESS, { title: 'Done', status: 'error' }] });
    for (const element of root(timeline).querySelectorAll<HTMLElement>('.item, .marker, .connector, .title, .meta, .content, .dot, .center-dot')) {
      const style = getComputedStyle(element);
      expect(style.transitionDuration, element.className).toBe('0s');
      expect(style.animationName, element.className).toBe('none');
    }
    expect(componentCss.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/transition|animation|@keyframes/);
  });
});

describe('color scheme', () => {
  function inside(holder: HTMLElement, token: string): string {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(${token})`;
    holder.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  }

  it('the colors follow data-nph-color-scheme set on a parent', async () => {
    const timeline = await mount({ items: [{ title: 'A', status: 'completed' }, { title: 'B' }] });
    const holder = timeline.parentElement as HTMLElement;
    const light = getComputedStyle(marker(timeline, 0)).backgroundColor;
    const lightLine = getComputedStyle(connector(timeline, 0)!).backgroundColor;
    expect(light).toBe(inside(holder, '--nph-timeline-marker-background-primary'));
    holder.setAttribute('data-nph-color-scheme', 'dark');
    await frame();
    await wait(100);
    const dark = getComputedStyle(marker(timeline, 0)).backgroundColor;
    expect(dark).not.toBe(light);
    expect(dark).toBe(inside(holder, '--nph-timeline-marker-background-primary'));
    expect(getComputedStyle(connector(timeline, 0)!).backgroundColor).toBe(inside(holder, '--nph-timeline-connector-border'));
    expect(getComputedStyle(connector(timeline, 0)!).backgroundColor).not.toBe(lightLine);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));
  const declared = [...new Set([...tokensCss.matchAll(/(--nph-timeline-[a-z0-9-]+):/g)].map((match) => match[1] ?? ''))];

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
  });

  it('consumes every one of the twenty-seven timeline/* tokens', () => {
    expect(declared).toHaveLength(27);
    for (const name of declared) {
      expect(used, name).toContain(name);
    }
  });

  it('uses the four text roles and the thickness of the line stays with the separator', () => {
    for (const name of [
      '--nph-text-label-md-font-size',
      '--nph-text-label-md-strong-font-weight',
      '--nph-text-body-md-font-size',
      '--nph-text-caption-font-size',
    ]) {
      expect(used, name).toContain(name);
    }
    expect(used).not.toContain('--nph-border-width');
  });

  it('never consumes a core or theme token', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
  });

  it('the CSS has no literal color, duration or measure', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    const measures = [...cssWithoutComments.matchAll(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/g)].map((match) => match[0]);
    expect(measures).toEqual([]);
  });

  it('writes no transform and no translate on the line', () => {
    expect(cssWithoutComments).not.toMatch(/transform|translate/);
  });
});
