/**
 * Tests of `nph-tooltip` (P65, amended by P77), in a real browser (P21, item 5):
 * hover, keyboard focus, the top layer, placement, transitions, line measure and
 * word breaking only exist where there is layout, a pointer and a loaded font.
 *
 * They prove the contract accepted in Figma (frame `1237:5`, board `1241:3`) and the
 * six rules of 22/10/2026 (DSA-48): the API, how the tooltip finds its element,
 * opening on keyboard focus at once and on hover after `motion/hover-delay`, never on
 * touch and never on an element without focus, Enter and Space leaving it alone,
 * closing (leave, blur, Esc), staying open over the balloon, the balloon as the name
 * of an icon-only button, the four sides with flip, the motion, the semantics and the
 * token contract.
 * Accessibility assertions are written by hand (P72 moves the addon to DSA-32).
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-tooltip.css?raw';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

import { translations } from '../../../.storybook/i18n/index.js';
import { NPH_TOOLTIP_RELATIONS, NPH_TOOLTIP_SIDES, NphTooltip } from './nph-tooltip';
import componentSource from './nph-tooltip.ts?raw';
import type { NphTooltipSide } from './nph-tooltip';
import { OneLine, TwoLines } from './nph-tooltip.stories';

const ONE_LINE = 'Explica o que o campo pede.';
const TWO_LINES = 'Use o nome como está no documento, sem abreviar nem trocar a ordem.';
const MAX_WIDTH = 235;
const MAX_HEIGHT = 44;
const LINE_HEIGHT = 24;
const SCHEMES = ['light', 'dark'] as const;

beforeAll(async () => {
  /* Without the token font, the measure would come out in the browser fallback font. */
  await document.fonts.load('400 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

interface Fixture {
  button: HTMLButtonElement;
  tooltip: NphTooltip;
}

interface Options {
  text?: string;
  open?: boolean;
  side?: NphTooltipSide;
  style?: string;
  parent?: HTMLElement | ShadowRoot;
}

/** A button and its tooltip, siblings in the same root, `for` pointing at the button. */
async function mount(options: Options = {}): Promise<Fixture> {
  const { text = ONE_LINE, open = false, side, style = 'position:fixed;left:300px;top:300px', parent = document.body } = options;
  const button = document.createElement('button');
  button.id = `target-${Math.random().toString(36).slice(2)}`;
  button.textContent = 'Target';
  button.style.cssText = style;
  const tooltip = document.createElement('nph-tooltip');
  tooltip.setAttribute('for', button.id);
  tooltip.text = text;
  tooltip.open = open;
  if (side) tooltip.side = side;
  parent.append(button, tooltip);
  await tooltip.updateComplete;
  return { button, tooltip };
}

function bubbleOf(element: NphTooltip): HTMLElement {
  const bubble = element.shadowRoot?.querySelector<HTMLElement>('.bubble');
  if (!bubble) throw new Error('the tooltip rendered no balloon');
  return bubble;
}

const isShown = (element: NphTooltip): boolean => bubbleOf(element).matches(':popover-open');

/** The balloon is shown AND the enter transition has started. */
async function shown(element: NphTooltip): Promise<void> {
  await element.updateComplete;
  expect(isShown(element)).toBe(true);
}

/** The tooltip turned itself on: hover waits `motion/hover-delay` first. */
async function opened(element: NphTooltip): Promise<void> {
  await vi.waitFor(() => expect(element.open).toBe(true), { timeout: 2000 });
  await element.updateComplete;
  expect(isShown(element)).toBe(true);
}

/** Hovers the element and waits out `motion/hover-delay` until the balloon is shown. */
async function hoverOpen(target: Element, element: NphTooltip): Promise<void> {
  await userEvent.hover(target);
  await opened(element);
}

const pause = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** The balloon has left the top layer: the exit ended. */
async function gone(element: NphTooltip): Promise<void> {
  await vi.waitFor(() => expect(isShown(element)).toBe(false), { timeout: 2000 });
}

/** The value the browser gives a token, in the same property. */
function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (property: string, token: string): number => Number.parseFloat(resolved(property, token));

/** The bubble text node. Lit puts comment markers around it. */
function textNodeOf(bubble: HTMLElement): Text {
  const textNode = [...bubble.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  expect(textNode).toBeDefined();
  return textNode as Text;
}

/** Distinct tops of the text lines, read from the rectangles of the text node itself. */
function lineTops(bubble: HTMLElement): number[] {
  const range = document.createRange();
  range.selectNodeContents(textNodeOf(bubble));
  const tops = [...range.getClientRects()].map((rect) => Math.round(rect.top));
  return [...new Set(tops)];
}

function touch(type: string, target: HTMLElement): void {
  target.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', bubbles: type !== 'pointerenter' && type !== 'pointerleave' }));
}

/**
 * CDP takes coordinates of the top page, and the tests run in a frame inside it, moved
 * and scaled to fit: the point is carried from this window into that page.
 */
async function moveMouse(x: number, y: number): Promise<void> {
  const frame = window.frameElement?.getBoundingClientRect();
  const scale = frame ? frame.width / window.innerWidth : 1;
  await cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: (frame?.left ?? 0) + x * scale,
    y: (frame?.top ?? 0) + y * scale,
  });
}

/**
 * The text fits inside the balloon: no line is cut. `scrollHeight` is not used: the
 * invisible hit area that reaches across the gap to the element overflows on purpose.
 */
function textFits(bubble: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(textNodeOf(bubble));
  const text = range.getBoundingClientRect();
  const box = bubble.getBoundingClientRect();
  expect(text.top).toBeGreaterThanOrEqual(box.top - 0.5);
  expect(text.bottom).toBeLessThanOrEqual(box.bottom + 0.5);
  expect(text.right).toBeLessThanOrEqual(box.right + 0.5);
}

/**
 * The description the browser itself computes for an element, from its accessibility
 * tree. `toHaveAccessibleDescription` is not used for this: it reads the DOM with a
 * library that does not follow the text into a shadow root.
 */
async function axDescription(element: Element): Promise<string> {
  return String((await axNode(element))?.description?.value ?? '');
}

/** The accessible name the browser itself computes, from the same tree. */
async function axName(element: Element): Promise<string> {
  return String((await axNode(element))?.name?.value ?? '');
}

interface AxNode {
  name?: { value?: unknown };
  description?: { value?: unknown };
}

async function axNode(element: Element): Promise<AxNode | undefined> {
  const session = cdp();
  await session.send('Accessibility.enable');
  element.setAttribute('data-ax-probe', '');
  try {
    /* The tests run in a frame: look the element up through the DOM domain, piercing into it. */
    await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { searchId, resultCount } = await session.send('DOM.performSearch', { query: '[data-ax-probe]' });
    expect(resultCount).toBe(1);
    const { nodeIds } = await session.send('DOM.getSearchResults', { searchId, fromIndex: 0, toIndex: 1 });
    await session.send('DOM.discardSearchResults', { searchId });
    const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId: nodeIds[0] as number, fetchRelatives: false });
    return nodes[0] as AxNode | undefined;
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-tooltip only once', () => {
    expect(customElements.get('nph-tooltip')).toBe(NphTooltip);
  });

  it('the public API is exactly text, for, side, open and relation', () => {
    const declared = Object.keys(
      Object.fromEntries((NphTooltip as unknown as { elementProperties: Map<string, unknown> }).elementProperties),
    );
    expect(new Set(declared)).toEqual(new Set(['text', 'for', 'side', 'open', 'relation']));
  });

  it('defaults: empty text, no for, side top, closed, a description', () => {
    const tooltip = document.createElement('nph-tooltip');
    expect([tooltip.text, tooltip.for, tooltip.side, tooltip.open, tooltip.relation]).toEqual(['', null, 'top', false, 'description']);
  });

  it('for and open reflect to attributes; text, side and relation do not', async () => {
    const { tooltip } = await mount({ open: true, side: 'left' });
    expect(tooltip.hasAttribute('for')).toBe(true);
    expect(tooltip.hasAttribute('open')).toBe(true);
    expect(tooltip.hasAttribute('text')).toBe(false);
    expect(tooltip.hasAttribute('side')).toBe(false);
    expect(tooltip.hasAttribute('relation')).toBe(false);
    tooltip.open = false;
    await tooltip.updateComplete;
    expect(tooltip.hasAttribute('open')).toBe(false);
  });

  it('exposes only the four sides, top first, the two relations, and no part, slot or event of its own', async () => {
    expect([...NPH_TOOLTIP_SIDES]).toEqual(['top', 'bottom', 'left', 'right']);
    expect([...NPH_TOOLTIP_RELATIONS]).toEqual(['description', 'name']);
    const { tooltip } = await mount();
    expect(tooltip.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(tooltip.shadowRoot?.querySelector('slot')).toBeNull();
    const events = vi.fn();
    for (const type of ['nph-open', 'nph-close', 'nph-change', 'open', 'close', 'toggle']) tooltip.addEventListener(type, events);
    await userEvent.hover(page.elementLocator(tooltip.parentElement?.querySelector('button') as HTMLElement));
    await tooltip.updateComplete;
    expect(events).not.toHaveBeenCalled();
  });
});

describe('how it finds its element (for)', () => {
  it('finds the element by id in the same root, and the element points to the tooltip', async () => {
    const { button, tooltip } = await mount();
    expect(tooltip.id).not.toBe('');
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('inside a shadow root, it looks in that root and not in the document', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const root = host.attachShadow({ mode: 'open' });
    const outside = document.createElement('button');
    outside.id = 'same-id';
    document.body.append(outside);
    const button = document.createElement('button');
    button.id = 'same-id';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', 'same-id');
    tooltip.text = ONE_LINE;
    root.append(button, tooltip);
    await tooltip.updateComplete;
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(outside.hasAttribute('aria-describedby')).toBe(false);
  });

  it('adds its id to an existing aria-describedby and removes only its own', async () => {
    const button = document.createElement('button');
    button.id = 'with-description';
    button.setAttribute('aria-describedby', 'other');
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', 'with-description');
    tooltip.text = ONE_LINE;
    document.body.append(button, tooltip);
    await tooltip.updateComplete;
    expect(button.getAttribute('aria-describedby')).toBe(`other ${tooltip.id}`);
    tooltip.remove();
    expect(button.getAttribute('aria-describedby')).toBe('other');
  });

  it('keeps the id the consumer gave it', async () => {
    const button = document.createElement('button');
    button.id = 'mine';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.id = 'my-tooltip';
    tooltip.setAttribute('for', 'mine');
    document.body.append(button, tooltip);
    await tooltip.updateComplete;
    expect(tooltip.id).toBe('my-tooltip');
    expect(button.getAttribute('aria-describedby')).toBe('my-tooltip');
  });

  it('changing for moves the description to the new element and clears the old one', async () => {
    const { button, tooltip } = await mount();
    const other = document.createElement('button');
    other.id = 'other-target';
    document.body.append(other);
    tooltip.setAttribute('for', 'other-target');
    await tooltip.updateComplete;
    expect(other.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
  });

  it('reassociates when the target is replaced by a node with the same id', async () => {
    const { button, tooltip } = await mount();
    const replacement = document.createElement('button');
    replacement.id = button.id;
    replacement.style.cssText = button.style.cssText;
    button.replaceWith(replacement);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(replacement.getAttribute('aria-describedby')).toBe(tooltip.id);
    await hoverOpen(replacement, tooltip);
  });

  it('accepts a focusable SVG target and opens on hover', async () => {
    const target = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    target.id = 'chart';
    target.setAttribute('tabindex', '0');
    target.setAttribute('width', '100');
    target.setAttribute('height', '100');
    target.style.cssText = 'position:fixed;left:300px;top:300px';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', target.id);
    tooltip.text = ONE_LINE;
    document.body.append(target, tooltip);
    await tooltip.updateComplete;
    expect(target.getAttribute('aria-describedby')).toBe(tooltip.id);
    target.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await opened(tooltip);
  });

  it('observes the new target after for changes while the balloon is open', async () => {
    const { tooltip } = await mount({ open: true });
    await shown(tooltip);
    const target = document.createElement('button');
    target.id = 'resized-target';
    target.style.cssText = 'position:fixed;left:120px;top:420px;width:80px;height:36px';
    document.body.append(target);
    tooltip.for = target.id;
    await tooltip.updateComplete;
    await vi.waitFor(() => {
      const box = bubbleOf(tooltip).getBoundingClientRect();
      const anchor = target.getBoundingClientRect();
      expect(box.left + box.width / 2).toBeCloseTo(anchor.left + anchor.width / 2, 1);
    });
    target.style.width = '160px';
    await vi.waitFor(() => {
      const box = bubbleOf(tooltip).getBoundingClientRect();
      const anchor = target.getBoundingClientRect();
      expect(box.left + box.width / 2).toBeCloseTo(anchor.left + anchor.width / 2, 1);
    });
    expect(tooltip.open).toBe(true);
  });

  it('an element that appears one frame later is found, with no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', 'late');
    tooltip.text = ONE_LINE;
    document.body.append(tooltip);
    await tooltip.updateComplete;
    const button = document.createElement('button');
    button.id = 'late';
    document.body.append(button);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(error).not.toHaveBeenCalled();
  });

  it('with no matching element, it draws nothing and reports once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', 'missing');
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    document.body.append(tooltip);
    await tooltip.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    tooltip.text = `${ONE_LINE} `;
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-tooltip]');
  });

  it('with no for at all, it draws nothing and reports once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tooltip = document.createElement('nph-tooltip');
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    document.body.append(tooltip);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('an invalid side draws nothing and reports once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { tooltip } = await mount({ open: true });
    await shown(tooltip);
    (tooltip as unknown as { side: string }).side = 'diagonal';
    await tooltip.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    await gone(tooltip);
  });

  it('removing the tooltip releases the listeners of the element and of the document', async () => {
    const { button, tooltip } = await mount({ open: true });
    await shown(tooltip);
    const removed = vi.spyOn(button, 'removeEventListener');
    const documentRemoved = vi.spyOn(document, 'removeEventListener');
    tooltip.remove();
    const types = removed.mock.calls.map(([type]) => type);
    for (const type of ['pointerenter', 'pointerleave', 'pointerdown', 'focusin', 'focusout']) {
      if (type === 'pointerdown') {
        expect(documentRemoved.mock.calls.some(([removedType]) => removedType === type)).toBe(true);
      } else {
        expect(types).toContain(type);
      }
    }
    expect(documentRemoved.mock.calls.filter(([type, , options]) => type === 'keydown' && options === true)).toHaveLength(2);
  });
});

describe('opening on hover and on keyboard focus', () => {
  it('closed at rest: the balloon holds the text but is not shown, and the host takes no room', async () => {
    const { tooltip } = await mount();
    expect(isShown(tooltip)).toBe(false);
    expect(bubbleOf(tooltip).textContent).toBe(ONE_LINE);
    const box = tooltip.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([0, 0]);
    expect(getComputedStyle(tooltip).position).toBe('absolute');
  });

  it('a mouse hover opens it after motion/hover-delay, not before', async () => {
    const { button, tooltip } = await mount();
    const started = performance.now();
    await userEvent.hover(button);
    await pause(100);
    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
    await opened(tooltip);
    expect(performance.now() - started).toBeGreaterThanOrEqual(290);
    expect(tooltip.hasAttribute('open')).toBe(true);
  });

  it('keyboard focus opens it, and the focus stays on the element', async () => {
    const { button, tooltip } = await mount();
    await userEvent.tab();
    expect(document.activeElement).toBe(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    expect(isShown(tooltip)).toBe(true);
    expect(document.activeElement).toBe(button);
  });

  it('a mouse click that focuses the button does not open it by itself (no visible focus)', async () => {
    const { button, tooltip } = await mount();
    button.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', bubbles: true }));
    button.focus({ focusVisible: false } as FocusOptions);
    await tooltip.updateComplete;
    if (!button.matches(':focus-visible')) {
      expect(tooltip.open).toBe(false);
    }
  });

  it('touch does not open it: not by pointerenter and not by the focus a tap gives', async () => {
    const { button, tooltip } = await mount();
    touch('pointerenter', button);
    touch('pointerdown', button);
    button.focus();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
  });

  it('touching an associated label does not open the focused input', async () => {
    const label = document.createElement('label');
    label.htmlFor = 'label-target';
    label.textContent = 'Field';
    const input = document.createElement('input');
    input.id = label.htmlFor;
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', input.id);
    tooltip.text = ONE_LINE;
    document.body.append(label, input, tooltip);
    await tooltip.updateComplete;
    label.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true, composed: true }));
    input.focus();
    await tooltip.updateComplete;
    expect(document.activeElement).toBe(input);
    expect(tooltip.open).toBe(false);
  });

  it('after a touch, the keyboard opens it again', async () => {
    const { button, tooltip } = await mount();
    touch('pointerdown', button);
    button.blur();
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(document.activeElement).toBe(button);
    expect(tooltip.open).toBe(true);
  });

  it('typing after touch opens it without moving focus away', async () => {
    const input = document.createElement('input');
    input.id = 'typed-after-touch';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', input.id);
    tooltip.text = ONE_LINE;
    document.body.append(input, tooltip);
    await tooltip.updateComplete;
    input.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }));
    input.focus();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    await userEvent.keyboard('a');
    await tooltip.updateComplete;
    expect(document.activeElement).toBe(input);
    expect(tooltip.open).toBe(true);
  });

  it('a click or Enter on the element does not toggle the balloon', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.click(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    await userEvent.keyboard('{Enter}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
  });

  it('an element whose focus lives in a shadow root opens it by keyboard (the focus is composed)', async () => {
    const host = document.createElement('div');
    host.id = 'shadow-host';
    host.style.cssText = 'position:fixed;left:300px;top:300px';
    const inner = host.attachShadow({ mode: 'open', delegatesFocus: true });
    inner.innerHTML = '<button>Inside</button>';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', 'shadow-host');
    tooltip.text = ONE_LINE;
    document.body.append(host, tooltip);
    await tooltip.updateComplete;
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
  });
});

describe('closing', () => {
  it('the pointer leaving the element closes it after the exit', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    await gone(tooltip);
  });

  it('it stays open while the pointer is over the balloon (WCAG 1.4.13)', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.hover(bubbleOf(tooltip));
    await tooltip.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(tooltip.open).toBe(true);
    expect(isShown(tooltip)).toBe(true);
    await userEvent.unhover(bubbleOf(tooltip));
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    await gone(tooltip);
  });

  it('crossing the gap: entering the balloon during the exit cancels the close', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(true);
    await userEvent.hover(bubbleOf(tooltip));
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(isShown(tooltip)).toBe(true);
  });

  it('keeps a pointer path open across the gap when the crossing takes longer than the exit', async () => {
    const { button, tooltip } = await mount({ style: 'position:fixed;left:300px;top:300px;width:60px;height:36px' });
    const anchor = button.getBoundingClientRect();
    const x = anchor.left + anchor.width / 2;
    await moveMouse(x, anchor.top + 1);
    await opened(tooltip);
    const bubble = bubbleOf(tooltip).getBoundingClientRect();
    expect(bubble.bottom).toBeLessThan(anchor.top);
    for (let step = 1; step <= 8; step += 1) {
      const y = anchor.top + 1 + ((bubble.bottom - 1) - (anchor.top + 1)) * (step / 8);
      await moveMouse(x, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await tooltip.updateComplete;
      expect(isShown(tooltip)).toBe(true);
    }
    expect(tooltip.open).toBe(true);
  });

  it('blur closes it when the pointer is not over it', async () => {
    const { button, tooltip } = await mount();
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    button.blur();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    await gone(tooltip);
  });

  it('two holds: hover leaving keeps it open while the focus is on the element, and the reverse', async () => {
    const { button, tooltip } = await mount();
    await userEvent.tab();
    await userEvent.hover(button);
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    expect(document.activeElement).toBe(button);
    expect(tooltip.open).toBe(true);
    await userEvent.hover(button);
    button.blur();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
  });

  it('Esc closes it, keeps the focus on the element and does not propagate', async () => {
    const { button, tooltip } = await mount();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await userEvent.tab();
    await tooltip.updateComplete;
    await userEvent.keyboard('{Escape}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    expect(document.activeElement).toBe(button);
    expect(outer.mock.calls.filter(([event]) => event.key === 'Escape')).toHaveLength(0);
    document.body.removeEventListener('keydown', outer);
    await gone(tooltip);
  });

  it('Esc is cancelled, so a native dialog around does not close with it', async () => {
    const { tooltip } = await mount();
    await userEvent.tab();
    await tooltip.updateComplete;
    let seen: KeyboardEvent | undefined;
    const probe = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') seen = event;
    };
    window.addEventListener('keydown', probe, true);
    await userEvent.keyboard('{Escape}');
    window.removeEventListener('keydown', probe, true);
    expect(seen?.defaultPrevented).toBe(true);
    expect(tooltip.open).toBe(false);
  });

  it('after Esc it does not come back while the pointer or the focus is still there, and returns on the next visit', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.keyboard('{Escape}');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(document.activeElement).toBe(button);
    expect(tooltip.open).toBe(false);
    await userEvent.unhover(button);
    button.blur();
    await tooltip.updateComplete;
    await userEvent.hover(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
  });

  it('stays open while the pointer crosses the gap slowly', async () => {
    const { button, tooltip } = await mount();
    const target = button.getBoundingClientRect();
    await moveMouse(target.left + target.width / 2, target.top + target.height / 2);
    await opened(tooltip);

    const bubble = bubbleOf(tooltip).getBoundingClientRect();
    await moveMouse(target.left + target.width / 2, (bubble.bottom + target.top) / 2);
    await new Promise((resolve) => window.setTimeout(resolve, 200));
    expect(tooltip.open).toBe(true);
    expect(isShown(tooltip)).toBe(true);

    await moveMouse(bubble.left + bubble.width / 2, bubble.top + bubble.height / 2);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
  });

  it('Esc with the balloon closed is not intercepted', async () => {
    const { button } = await mount();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    /* Focus after a touch: the element has the focus and the balloon stays closed. */
    touch('pointerdown', button);
    button.focus();
    await userEvent.keyboard('{Escape}');
    expect(outer.mock.calls.filter(([event]) => event.key === 'Escape')).toHaveLength(1);
    document.body.removeEventListener('keydown', outer);
  });

  it('open set by the consumer shows the balloon, and Esc closes it', async () => {
    const { tooltip } = await mount({ open: true });
    await shown(tooltip);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.body.dispatchEvent(escape);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(false);
    expect(escape.defaultPrevented).toBe(true);
    await gone(tooltip);
  });

  it('open with empty or whitespace-only text: nothing is shown', async () => {
    for (const text of ['', '   ']) {
      const { tooltip } = await mount({ text, open: true });
      expect(isShown(tooltip), JSON.stringify(text)).toBe(false);
      tooltip.remove();
    }
  });
});

describe('semantics and focus', () => {
  it('the host is role="tooltip" closed and open', async () => {
    const { tooltip } = await mount();
    expect(tooltip.getAttribute('role')).toBe('tooltip');
    tooltip.open = true;
    await tooltip.updateComplete;
    expect(tooltip.getAttribute('role')).toBe('tooltip');
    expect(tooltip.hasAttribute('aria-live')).toBe(false);
  });

  it('the element is described by the balloon text in the browser accessibility tree, closed and open', async () => {
    const { button, tooltip } = await mount();
    expect(await axDescription(button)).toBe(ONE_LINE);
    tooltip.open = true;
    await tooltip.updateComplete;
    expect(await axDescription(button)).toBe(ONE_LINE);
    tooltip.text = TWO_LINES;
    await tooltip.updateComplete;
    expect(await axDescription(button)).toBe(TWO_LINES);
    tooltip.text = '   ';
    await tooltip.updateComplete;
    expect(tooltip.hasAttribute('aria-label')).toBe(false);
  });

  it('the host mirrors the text in aria-label, because the browser does not read hidden text', async () => {
    const { tooltip } = await mount();
    expect(tooltip.getAttribute('aria-label')).toBe(ONE_LINE);
    expect(isShown(tooltip)).toBe(false);
  });

  it('the tooltip does not give the element a name, and keeps the one it has', async () => {
    const { button } = await mount();
    button.setAttribute('aria-label', 'Delete');
    expect(button.hasAttribute('aria-labelledby')).toBe(false);
    await expect.element(page.elementLocator(button)).toHaveAccessibleName('Delete');
  });

  it('the balloon never receives focus and has no focusable element', async () => {
    const { tooltip } = await mount({ open: true });
    await shown(tooltip);
    const before = document.activeElement;
    tooltip.focus();
    bubbleOf(tooltip).focus();
    expect(document.activeElement).toBe(before);
    expect(tooltip.hasAttribute('tabindex')).toBe(false);
    const focusable = tooltip.shadowRoot?.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    expect(focusable?.length ?? 0).toBe(0);
  });
});

describe('the wait on hover (motion/hover-delay)', () => {
  it('the wait is the token the page resolves, read by the script and not written in it', async () => {
    const { tooltip } = await mount();
    expect(getComputedStyle(tooltip).getPropertyValue('--nph-motion-hover-delay').trim()).toBe('300ms');
    expect(componentSource).toContain("'--nph-motion-hover-delay'");
    expect(componentSource).not.toMatch(/\b300\b/);
  });

  it('leaving before the wait ends does not open it', async () => {
    const { button, tooltip } = await mount();
    await userEvent.hover(button);
    await pause(100);
    await userEvent.unhover(button);
    await pause(400);
    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
  });

  it('a pen waits like a mouse', async () => {
    const { button, tooltip } = await mount();
    button.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'pen' }));
    await pause(100);
    expect(tooltip.open).toBe(false);
    await opened(tooltip);
  });

  it('keyboard focus and open set by the consumer do not wait', async () => {
    const { tooltip } = await mount();
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    const other = await mount({ open: true });
    await shown(other.tooltip);
  });

  it('opening by focus during the hover wait retains the pointer after blur', async () => {
    const { button, tooltip } = await mount();
    await userEvent.hover(button);
    await pause(100);
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(document.activeElement).toBe(button);
    expect(tooltip.open).toBe(true);
    button.blur();
    await pause(400);

    expect(tooltip.open).toBe(true);
    expect(isShown(tooltip)).toBe(true);
  });

  it('a touch pointerdown cancels a pending wait after mouse hover', async () => {
    const { button, tooltip } = await mount();
    await userEvent.hover(button);
    await pause(100);
    touch('pointerdown', button);
    await pause(400);

    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
  });

  it('coming back to the element during the exit keeps it, with no new wait', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(true);
    await userEvent.hover(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
  });

  it('Esc during the wait ends it, is not intercepted, and the next visit waits again', async () => {
    const { button, tooltip } = await mount();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await userEvent.hover(button);
    await pause(100);
    await userEvent.keyboard('{Escape}');
    await pause(400);
    expect(tooltip.open).toBe(false);
    expect(outer.mock.calls.filter(([event]) => event.key === 'Escape')).toHaveLength(1);
    document.body.removeEventListener('keydown', outer);
    await userEvent.unhover(button);
    await hoverOpen(button, tooltip);
  });

  it('removing the tooltip during the wait does not open it later', async () => {
    const { button, tooltip } = await mount();
    await userEvent.hover(button);
    await pause(50);
    tooltip.remove();
    await pause(400);
    expect(tooltip.open).toBe(false);
  });

  it('without the token it opens at once and reports once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { button, tooltip } = await mount();
    tooltip.style.setProperty('--nph-motion-hover-delay', 'initial');
    await userEvent.hover(button);
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    await userEvent.unhover(button);
    await userEvent.hover(button);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('motion/hover-delay');
  });
});

describe('click, Enter and Space run the action and leave the balloon alone', () => {
  it('a click during the wait cancels it, and Enter and Space after it do not open the balloon', async () => {
    const { button, tooltip } = await mount();
    await userEvent.click(button);
    expect(document.activeElement).toBe(button);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await pause(400);
    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
    await userEvent.unhover(button);
    await hoverOpen(button, tooltip);
  });

  it('a mouse click on an input during the wait does not open it through focus-visible', async () => {
    const input = document.createElement('input');
    input.id = 'click-during-wait';
    input.style.cssText = 'position:fixed;left:300px;top:300px';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', input.id);
    tooltip.text = ONE_LINE;
    document.body.append(input, tooltip);
    await tooltip.updateComplete;

    await userEvent.hover(input);
    await pause(100);
    await userEvent.click(input);
    expect(document.activeElement).toBe(input);
    expect(input.matches(':focus-visible')).toBe(true);
    await pause(400);

    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
  });

  it('Enter and Space do not close a balloon that the focus opened', async () => {
    const { tooltip } = await mount();
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
  });

  it('Esc after a touch on an input does not open it, and the key reaches the page', async () => {
    const input = document.createElement('input');
    input.id = 'escape-after-touch';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', input.id);
    tooltip.text = ONE_LINE;
    document.body.append(input, tooltip);
    await tooltip.updateComplete;
    input.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }));
    input.focus();
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    await userEvent.keyboard('{Escape}');
    await tooltip.updateComplete;
    document.body.removeEventListener('keydown', outer);
    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
    expect(outer.mock.calls.filter(([event]) => event.key === 'Escape')).toHaveLength(1);
  });
});

describe('only on an element that receives focus', () => {
  it('a contenteditable editing host opens when focused by Tab', async () => {
    const editor = document.createElement('div');
    editor.id = 'contenteditable-target';
    editor.contentEditable = 'true';
    editor.style.cssText = 'position:fixed;left:300px;top:300px';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', editor.id);
    tooltip.text = ONE_LINE;
    document.body.append(editor, tooltip);
    await tooltip.updateComplete;

    await userEvent.tab();
    await tooltip.updateComplete;

    expect(document.activeElement).toBe(editor);
    expect(tooltip.open).toBe(true);
    await shown(tooltip);
  });

  it('contenteditable focusability follows nested hosts and contenteditable mutations', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const outer = document.createElement('div');
    outer.contentEditable = 'true';
    const inner = document.createElement('div');
    inner.id = 'nested-contenteditable-target';
    inner.contentEditable = 'true';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', inner.id);
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    outer.append(inner);
    document.body.append(outer, tooltip);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);

    outer.contentEditable = 'false';
    /* The root observer reacts in a later microtask: wait for it, not only for Lit. */
    await vi.waitFor(() => expect(isShown(tooltip)).toBe(true));

    inner.tabIndex = -1;
    await vi.waitFor(() => expect(tooltip.open).toBe(false));
    await gone(tooltip);

    inner.tabIndex = 0;
    tooltip.open = true;
    await shown(tooltip);

    inner.removeAttribute('tabindex');
    inner.contentEditable = 'false';
    await vi.waitFor(() => expect(tooltip.open).toBe(false));
    await gone(tooltip);

    tooltip.open = true;
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);
    inner.contentEditable = 'true';
    await vi.waitFor(() => expect(isShown(tooltip)).toBe(true));
  });

  it('a disabled button gets no balloon, on hover or when the consumer opens it, and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { button, tooltip } = await mount();
    button.disabled = true;
    button.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    await pause(400);
    expect(tooltip.open).toBe(false);
    tooltip.open = true;
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(error).not.toHaveBeenCalled();
  });

  it('loose text gets no balloon and reports once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const span = document.createElement('span');
    span.id = 'loose-text';
    span.textContent = 'Loose text';
    span.style.cssText = 'position:fixed;left:300px;top:300px';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', span.id);
    tooltip.text = ONE_LINE;
    document.body.append(span, tooltip);
    await tooltip.updateComplete;
    await userEvent.hover(span);
    await pause(400);
    await userEvent.unhover(span);
    await userEvent.hover(span);
    expect(tooltip.open).toBe(false);
    expect(isShown(tooltip)).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('does not receive focus');
  });

  it('an SVG without tabindex gets no balloon', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const target = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    target.id = 'plain-chart';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', target.id);
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    document.body.append(target, tooltip);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);
  });

  it('disabling the element while the balloon is open closes it', async () => {
    const { button, tooltip } = await mount();
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    button.disabled = true;
    await vi.waitFor(() => expect(tooltip.open).toBe(false));
    await gone(tooltip);
  });

  it('disabling an ancestor fieldset closes the balloon and keeps its ARIA reference', async () => {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    const exemptButton = document.createElement('button');
    exemptButton.id = 'fieldset-legend-target';
    const button = document.createElement('button');
    button.id = 'fieldset-target';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', button.id);
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    const exemptTooltip = document.createElement('nph-tooltip');
    exemptTooltip.setAttribute('for', exemptButton.id);
    exemptTooltip.text = ONE_LINE;
    exemptTooltip.open = true;
    legend.append(exemptButton);
    fieldset.append(button);
    fieldset.prepend(legend);
    document.body.append(fieldset, tooltip, exemptTooltip);
    await Promise.all([tooltip.updateComplete, exemptTooltip.updateComplete]);
    await shown(tooltip);
    await shown(exemptTooltip);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(exemptButton.getAttribute('aria-describedby')).toBe(exemptTooltip.id);

    fieldset.disabled = true;
    await vi.waitFor(() => expect(tooltip.open).toBe(false));
    await gone(tooltip);
    await exemptTooltip.updateComplete;

    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(exemptButton.matches(':disabled')).toBe(false);
    expect(exemptTooltip.open).toBe(true);
    expect(isShown(exemptTooltip)).toBe(true);
  });

  it('moving an associated target into a disabled fieldset closes the balloon and keeps its ARIA reference', async () => {
    const { button, tooltip } = await mount({ open: true });
    await shown(tooltip);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);

    const fieldset = document.createElement('fieldset');
    fieldset.disabled = true;
    document.body.append(fieldset);
    fieldset.append(button);
    await vi.waitFor(() => expect(tooltip.open).toBe(false));
    await gone(tooltip);

    expect(button.matches(':disabled')).toBe(true);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('a custom element host with a disabled attribute gets no balloon', async () => {
    const host = document.createElement('div');
    host.id = 'disabled-host';
    host.attachShadow({ mode: 'open', delegatesFocus: true }).innerHTML = '<button disabled>Inside</button>';
    host.setAttribute('disabled', '');
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', host.id);
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    document.body.append(host, tooltip);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(false);
  });
});

describe('the balloon as the name of an icon-only button (relation="name")', () => {
  async function iconOnly(text = 'Delete'): Promise<Fixture> {
    const button = document.createElement('button');
    button.id = `icon-only-${Math.random().toString(36).slice(2)}`;
    button.innerHTML = '<span aria-hidden="true">×</span>';
    button.style.cssText = 'position:fixed;left:300px;top:300px';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', button.id);
    tooltip.relation = 'name';
    tooltip.text = text;
    document.body.append(button, tooltip);
    await tooltip.updateComplete;
    return { button, tooltip };
  }

  it('the browser names the button with the balloon text, once, closed and open', async () => {
    const { button, tooltip } = await iconOnly();
    expect(button.getAttribute('aria-labelledby')).toBe(tooltip.id);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(await axName(button)).toBe('Delete');
    expect(await axDescription(button)).toBe('');
    tooltip.open = true;
    await shown(tooltip);
    expect(await axName(button)).toBe('Delete');
    expect(await axDescription(button)).toBe('');
    tooltip.text = 'Remove';
    await tooltip.updateComplete;
    expect(await axName(button)).toBe('Remove');
  });

  it('opens on hover after the wait and on focus at once, like a description', async () => {
    const { button, tooltip } = await iconOnly();
    await userEvent.tab();
    await tooltip.updateComplete;
    expect(tooltip.open).toBe(true);
    button.blur();
    await tooltip.updateComplete;
    await hoverOpen(button, tooltip);
  });

  it('changing relation moves the reference between the two attributes', async () => {
    const { button, tooltip } = await mount();
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    tooltip.relation = 'name';
    await tooltip.updateComplete;
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-labelledby')).toBe(tooltip.id);
    tooltip.relation = 'description';
    await tooltip.updateComplete;
    expect(button.hasAttribute('aria-labelledby')).toBe(false);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('keeps the ids the consumer wrote, and never removes a reference it did not add', async () => {
    const button = document.createElement('button');
    button.id = 'consumer-labelled';
    button.setAttribute('aria-labelledby', 'caption my-tip');
    const tooltip = document.createElement('nph-tooltip');
    tooltip.id = 'my-tip';
    tooltip.setAttribute('for', button.id);
    tooltip.relation = 'name';
    tooltip.text = 'Delete';
    document.body.append(button, tooltip);
    await tooltip.updateComplete;
    expect(button.getAttribute('aria-labelledby')).toBe('caption my-tip');
    tooltip.remove();
    expect(button.getAttribute('aria-labelledby')).toBe('caption my-tip');
  });

  it('a name with no text reports once in development', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { tooltip } = await iconOnly('   ');
    tooltip.text = '';
    await tooltip.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('relation="name" needs text');
  });

  it('an invalid relation draws nothing, writes no reference and reports once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { button, tooltip } = await mount({ open: true });
    await shown(tooltip);
    (tooltip as unknown as { relation: string }).relation = 'title';
    await tooltip.updateComplete;
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.hasAttribute('aria-labelledby')).toBe(false);
    expect(error).toHaveBeenCalledTimes(1);
    await gone(tooltip);
  });
});

describe('the reference follows the id of the tooltip', () => {
  it('changing the id after the association moves the reference and keeps the other ids', async () => {
    const button = document.createElement('button');
    button.id = 'renamed-target';
    button.setAttribute('aria-describedby', 'other');
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', button.id);
    tooltip.text = ONE_LINE;
    document.body.append(button, tooltip);
    await tooltip.updateComplete;
    expect(button.getAttribute('aria-describedby')).toBe(`other ${tooltip.id}`);
    tooltip.id = 'renamed';
    await vi.waitFor(() => expect(button.getAttribute('aria-describedby')).toBe('other renamed'));
    expect(await axDescription(button)).toBe(ONE_LINE);
    tooltip.remove();
    expect(button.getAttribute('aria-describedby')).toBe('other');
  });

  it('with relation="name", the id change moves aria-labelledby', async () => {
    const { button, tooltip } = await mount();
    tooltip.relation = 'name';
    await tooltip.updateComplete;
    tooltip.id = 'renamed-name';
    await vi.waitFor(() => expect(button.getAttribute('aria-labelledby')).toBe('renamed-name'));
    tooltip.remove();
    expect(button.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('removing the id gives the tooltip a new one, still referenced', async () => {
    const { button, tooltip } = await mount();
    tooltip.removeAttribute('id');
    await vi.waitFor(() => expect(tooltip.id).not.toBe(''));
    await vi.waitFor(() => expect(button.getAttribute('aria-describedby')).toBe(tooltip.id));
  });
});

describe('placement', () => {
  const target = { left: 300, top: 300 };

  /* The test window is narrow by default; the balloon needs room on each side. */
  beforeAll(async () => {
    await page.viewport(900, 700);
  });

  afterAll(async () => {
    await page.viewport(414, 896);
  });

  for (const side of NPH_TOOLTIP_SIDES) {
    it(`side ${side}: at space/inline from the element, centered on it`, async () => {
      const { button, tooltip } = await mount({ open: true, side, style: `position:fixed;left:${target.left}px;top:${target.top}px;width:60px;height:36px` });
      await shown(tooltip);
      const anchor = button.getBoundingClientRect();
      const box = bubbleOf(tooltip).getBoundingClientRect();
      const gap = px('width', '--nph-space-inline');
      expect(gap).toBe(8);
      if (side === 'top') expect(anchor.top - box.bottom).toBeCloseTo(gap, 1);
      if (side === 'bottom') expect(box.top - anchor.bottom).toBeCloseTo(gap, 1);
      if (side === 'left') expect(anchor.left - box.right).toBeCloseTo(gap, 1);
      if (side === 'right') expect(box.left - anchor.right).toBeCloseTo(gap, 1);
      if (side === 'top' || side === 'bottom') {
        expect(box.left + box.width / 2).toBeCloseTo(anchor.left + anchor.width / 2, 1);
      } else {
        expect(box.top + box.height / 2).toBeCloseTo(anchor.top + anchor.height / 2, 1);
      }
      expect(bubbleOf(tooltip).getAttribute('data-side')).toBe(side);
    });
  }

  it('top is the default', async () => {
    const { button, tooltip } = await mount({ open: true });
    await shown(tooltip);
    expect(bubbleOf(tooltip).getBoundingClientRect().bottom).toBeLessThan(button.getBoundingClientRect().top);
  });

  it('flips to the opposite side when it does not fit', async () => {
    const { button, tooltip } = await mount({ open: true, style: 'position:fixed;left:300px;top:4px' });
    await shown(tooltip);
    expect(bubbleOf(tooltip).getBoundingClientRect().top).toBeGreaterThan(button.getBoundingClientRect().bottom);
    expect(bubbleOf(tooltip).getAttribute('data-side')).toBe('bottom');
  });

  it('left flips to right near the left edge', async () => {
    const { button, tooltip } = await mount({ open: true, side: 'left', style: 'position:fixed;left:4px;top:300px' });
    await shown(tooltip);
    expect(bubbleOf(tooltip).getBoundingClientRect().left).toBeGreaterThan(button.getBoundingClientRect().right);
  });

  it('never leaves the window on the cross axis', async () => {
    const { tooltip } = await mount({ open: true, text: TWO_LINES, style: 'position:fixed;left:0px;top:300px;width:20px' });
    await shown(tooltip);
    const box = bubbleOf(tooltip).getBoundingClientRect();
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
  });

  it('caps width to a narrow viewport and keeps the complete wrapped text', async () => {
    try {
      await page.viewport(200, 400);
      const { button, tooltip } = await mount({
        open: true,
        text: TWO_LINES,
        style: 'position:fixed;left:60px;top:100px;width:40px;height:36px',
      });
      await shown(tooltip);
      const target = button.getBoundingClientRect();
      expect(target.left).toBeGreaterThanOrEqual(0);
      expect(target.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
      const bubble = bubbleOf(tooltip);
      const box = bubble.getBoundingClientRect();
      expect(box.width).toBeLessThanOrEqual(document.documentElement.clientWidth);
      expect(box.right).toBeLessThanOrEqual(document.documentElement.clientWidth);
      expect(box.height).toBeGreaterThan(MAX_HEIGHT);
      expect(bubble.style.maxHeight).toBe('none');
      expect(bubble.textContent).toBe(TWO_LINES);
      textFits(bubble);
    } finally {
      await page.viewport(900, 700);
    }
  });

  it('follows the element when the page scrolls while it is open', async () => {
    const holder = document.createElement('div');
    holder.style.cssText = 'height:2000px;position:relative';
    document.body.append(holder);
    const { button, tooltip } = await mount({ open: true, style: 'position:absolute;left:300px;top:600px', parent: holder });
    await shown(tooltip);
    const gap = px('width', '--nph-space-inline');
    window.scrollTo(0, 450);
    await vi.waitFor(() => {
      expect(Math.round(button.getBoundingClientRect().top)).toBe(150);
      expect(button.getBoundingClientRect().top - bubbleOf(tooltip).getBoundingClientRect().bottom).toBeCloseTo(gap, 1);
    });
    window.scrollTo(0, 0);
  });

  it('follows a focused target through nested shadow roots when an internal ancestor scrolls', async () => {
    const outerHost = document.createElement('div');
    document.body.append(outerHost);
    const outerRoot = outerHost.attachShadow({ mode: 'open' });
    const scroller = document.createElement('div');
    scroller.style.cssText = 'position:fixed;left:200px;top:100px;width:300px;height:200px;overflow:auto';
    const innerHost = document.createElement('div');
    innerHost.style.cssText = 'position:relative;width:600px;height:600px';
    scroller.append(innerHost);
    outerRoot.append(scroller);
    const innerRoot = innerHost.attachShadow({ mode: 'open' });
    const target = document.createElement('button');
    target.id = 'nested-target';
    target.style.cssText = 'position:absolute;left:50px;top:300px;width:60px;height:36px';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', target.id);
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    innerRoot.append(target, tooltip);
    await tooltip.updateComplete;
    target.focus({ preventScroll: true });
    await shown(tooltip);
    const initialTop = target.getBoundingClientRect().top;
    const gap = px('width', '--nph-space-inline');
    scroller.scrollTop = 50;
    await vi.waitFor(() => {
      expect(target.getBoundingClientRect().top).toBeCloseTo(initialTop - 50, 1);
      expect(target.getBoundingClientRect().top - bubbleOf(tooltip).getBoundingClientRect().bottom).toBeCloseTo(gap, 1);
    });
  });

  it('follows a slotted element when a container inside the shadow root around its slot scrolls (slot in slot)', async () => {
    const outer = document.createElement('div');
    outer.attachShadow({ mode: 'open' }).innerHTML =
      '<div class="scroller" style="position:fixed;left:100px;top:300px;width:220px;height:120px;overflow:auto"><div style="height:60px"></div><slot></slot><div style="height:600px"></div></div>';
    const inner = document.createElement('div');
    inner.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>';
    const button = document.createElement('button');
    button.id = 'slotted-target';
    button.textContent = 'Target';
    const tooltip = document.createElement('nph-tooltip');
    tooltip.setAttribute('for', button.id);
    tooltip.text = ONE_LINE;
    tooltip.open = true;
    inner.append(button, tooltip);
    outer.append(inner);
    document.body.append(outer);
    await shown(tooltip);
    /* The first ResizeObserver report places the balloon once more: let it pass before scrolling. */
    await pause(200);
    const scroller = outer.shadowRoot?.querySelector<HTMLElement>('.scroller') as HTMLElement;
    const gapBefore = button.getBoundingClientRect().top - bubbleOf(tooltip).getBoundingClientRect().bottom;
    scroller.scrollTop = 30;
    await vi.waitFor(() => {
      const gapAfter = button.getBoundingClientRect().top - bubbleOf(tooltip).getBoundingClientRect().bottom;
      expect(gapAfter).toBeCloseTo(gapBefore, 0);
    });
  });

  it('an element scrolled out of the window takes its balloon with it, and gets it back when it returns', async () => {
    const holder = document.createElement('div');
    holder.style.cssText = 'height:3000px;position:relative';
    document.body.append(holder);
    const { tooltip } = await mount({ open: true, style: 'position:absolute;left:300px;top:2000px', parent: holder });
    await shown(tooltip);
    expect(getComputedStyle(bubbleOf(tooltip)).visibility).toBe('hidden');
    window.scrollTo(0, 1800);
    await vi.waitFor(() => expect(getComputedStyle(bubbleOf(tooltip)).visibility).toBe('visible'));
    window.scrollTo(0, 0);
    await vi.waitFor(() => expect(getComputedStyle(bubbleOf(tooltip)).visibility).toBe('hidden'));
  });

  it('the distance is larger than the outer reach of the focus, so the balloon never covers it', async () => {
    const reach = px('width', '--nph-border-width') + px('width', '--nph-focus-ring-width');
    expect(px('width', '--nph-space-inline')).toBeGreaterThan(reach);
  });

  it('it is in the top layer: an ancestor with overflow hidden does not clip it', async () => {
    const clip = document.createElement('div');
    clip.style.cssText = 'position:fixed;left:300px;top:300px;width:40px;height:20px;overflow:hidden';
    document.body.append(clip);
    const { tooltip } = await mount({ open: true, text: TWO_LINES, style: 'position:static', parent: clip });
    await shown(tooltip);
    const box = bubbleOf(tooltip).getBoundingClientRect();
    expect(box.width).toBeGreaterThan(40);
    expect(document.elementFromPoint(box.left + 5, box.top + 5)).toBe(tooltip);
  });
});

describe('motion', () => {
  it('enters on the enter role and leaves on the exit role (duration and curve)', async () => {
    const { button, tooltip } = await mount();
    const bubble = bubbleOf(tooltip);
    expect(getComputedStyle(bubble).transitionProperty).toBe('opacity');
    await hoverOpen(button, tooltip);
    const entering = getComputedStyle(bubble);
    expect(entering.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-enter-duration'));
    expect(entering.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-enter-easing'));
    expect(entering.transitionDuration).toBe('0.25s');
    await vi.waitFor(() => expect(getComputedStyle(bubble).opacity).toBe('1'));
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    const leaving = getComputedStyle(bubble);
    expect(leaving.transitionDuration).toBe(resolved('transition-duration', '--nph-motion-exit-duration'));
    expect(leaving.transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-exit-easing'));
    expect(leaving.transitionDuration).toBe('0.15s');
  });

  it('the balloon only leaves the top layer after the exit has run', async () => {
    const { button, tooltip } = await mount();
    await hoverOpen(button, tooltip);
    await userEvent.unhover(button);
    await tooltip.updateComplete;
    expect(isShown(tooltip)).toBe(true);
    await gone(tooltip);
    expect(getComputedStyle(bubbleOf(tooltip)).display).toBe('none');
  });

  it('animates only opacity: no position, size or layout property', async () => {
    const { tooltip } = await mount();
    expect(getComputedStyle(bubbleOf(tooltip)).transitionProperty).toBe('opacity');
  });

  it('with reduced motion, the duration is 100 ms (core/duration/100 through its semantic alias), the curve stays and the balloon still appears', async () => {
    const session = cdp();
    try {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
      const { button, tooltip } = await mount();
      const bubble = bubbleOf(tooltip);
      await hoverOpen(button, tooltip);
      const duration = resolved('transition-duration', '--nph-motion-hover-duration');
      expect(duration).toBe('0.1s');
      expect(getComputedStyle(bubble).transitionDuration).toBe(duration);
      expect(getComputedStyle(bubble).transitionTimingFunction).toBe(resolved('transition-timing-function', '--nph-motion-enter-easing'));
      await vi.waitFor(() => expect(getComputedStyle(bubble).opacity).toBe('1'));
      await userEvent.unhover(button);
      await tooltip.updateComplete;
      expect(getComputedStyle(bubble).transitionDuration).toBe(duration);
      await gone(tooltip);
    } finally {
      await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    }
    await vi.waitFor(() => expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = [...new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]))].sort();

  it('consumes exactly the tokens of the accepted board', () => {
    expect(used).toEqual(
      [
        '--nph-color-tooltip',
        '--nph-color-tooltip-foreground',
        '--nph-elevation-dropdown',
        '--nph-layout-max-tooltip-height',
        '--nph-layout-max-tooltip-width',
        '--nph-motion-enter-duration',
        '--nph-motion-enter-easing',
        '--nph-motion-exit-duration',
        '--nph-motion-exit-easing',
        '--nph-motion-hover-duration',
        '--nph-radius-inner',
        '--nph-space-inline',
        '--nph-space-inline-tight',
        '--nph-text-body-sm-font-family',
        '--nph-text-body-sm-font-size',
        '--nph-text-body-sm-font-weight',
        '--nph-text-body-sm-letter-spacing',
        '--nph-text-body-sm-line-height',
      ].sort(),
    );
  });

  it('the script reads motion/hover-delay, the one token the CSS does not carry, and it exists', () => {
    expect([...componentSource.matchAll(/'(--nph-[a-z0-9-]+)'/g)].map((match) => match[1])).toEqual(['--nph-motion-hover-delay']);
    expect(tokensCss).toContain('--nph-motion-hover-delay:');
  });

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('the CSS has no literal design value, no core or theme token and no border', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|ms|s)\b/);
    expect(cssWithoutComments).not.toMatch(/--nph-(core|theme)-/);
    expect(cssWithoutComments).not.toMatch(/border-width|--nph-border-width|z-index/);
  });

  it('the balloon draws no border and cuts nothing', async () => {
    const { tooltip } = await mount({ open: true, text: TWO_LINES });
    await shown(tooltip);
    const style = getComputedStyle(bubbleOf(tooltip));
    expect(style.borderTopWidth).toBe('0px');
    expect(style.overflow).toBe('visible');
    expect(style.textOverflow).not.toBe('ellipsis');
    expect(style.hyphens).not.toBe('auto');
    expect(style.wordBreak).toBe('normal');
    expect(style.boxSizing).toBe('border-box');
  });

  for (const scheme of SCHEMES) {
    it(`${scheme}: the text on the balloon passes 4.5:1 and matches the board (6.69 light, 7.47 dark)`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const { tooltip } = await mount({ open: true });
      await shown(tooltip);
      const style = getComputedStyle(bubbleOf(tooltip));
      const ratio = contrast(rgb(style.color), rgb(style.backgroundColor));
      expect(ratio).toBeGreaterThan(4.5);
      expect(ratio).toBeCloseTo(scheme === 'light' ? 6.69 : 7.47, 1);
    });
  }
});

function rgb(value: string): [number, number, number] {
  const canvas = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
  canvas.fillStyle = '#000';
  canvas.fillStyle = value;
  canvas.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = canvas.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe('measure', () => {
  it('Figma width and height limits: 235 and 44', async () => {
    const { tooltip } = await mount({ open: true });
    await shown(tooltip);
    const style = getComputedStyle(bubbleOf(tooltip));
    expect(style.maxWidth).toBe(MAX_WIDTH + 'px');
    expect(style.maxHeight).toBe(MAX_HEIGHT + 'px');
  });

  it('short text: one line of 24, up to 235 wide', async () => {
    const { tooltip } = await mount({ open: true });
    await shown(tooltip);
    const bubble = bubbleOf(tooltip);
    const box = bubble.getBoundingClientRect();
    expect(Math.abs(box.height - LINE_HEIGHT)).toBeLessThanOrEqual(1);
    expect(box.width).toBeLessThanOrEqual(MAX_WIDTH);
    expect(lineTops(bubble)).toHaveLength(1);
  });

  it('Figma text: two lines, fits in 235 × 44, no overflow', async () => {
    const { tooltip } = await mount({ open: true, text: TWO_LINES });
    await shown(tooltip);
    const bubble = bubbleOf(tooltip);
    const box = bubble.getBoundingClientRect();
    expect(box.width).toBeLessThanOrEqual(MAX_WIDTH);
    expect(box.height).toBeLessThanOrEqual(MAX_HEIGHT);
    expect(lineTops(bubble)).toHaveLength(2);
    textFits(bubble);
  });

  it('no word of the two-line text was broken', async () => {
    const { tooltip } = await mount({ open: true, text: TWO_LINES });
    await shown(tooltip);
    const textNode = textNodeOf(bubbleOf(tooltip));
    expect(textNode.data).toBe(TWO_LINES);
    let offset = 0;
    for (const word of TWO_LINES.split(' ')) {
      const start = TWO_LINES.indexOf(word, offset);
      const range = document.createRange();
      range.setStart(textNode, start);
      range.setEnd(textNode, start + word.length);
      expect(range.getClientRects().length, word).toBe(1);
      offset = start + word.length;
    }
  });
});

describe('nph-tooltip Validation: dictionary text', () => {
  const LOCALES = ['pt-BR', 'en', 'es'] as const;
  type Renderable = { render?: (args: unknown, context: unknown) => TemplateResult };

  async function renderStory(story: Renderable, locale: string): Promise<NphTooltip> {
    const target = document.createElement('div');
    document.body.append(target);
    render(story.render?.({}, { globals: { locale } }) as TemplateResult, target);
    const element = target.querySelector('nph-tooltip') as NphTooltip;
    await element.updateComplete;
    return element;
  }

  for (const locale of LOCALES) {
    it(`${locale}: one line takes one line, and two lines take two, within 235 x 44`, async () => {
      const texts = translations(locale).tooltipValidation;
      const one = await renderStory(OneLine as Renderable, locale);
      const two = await renderStory(TwoLines as Renderable, locale);
      expect(one.text).toBe(texts.oneLine);
      expect(two.text).toBe(texts.twoLines);
      await shown(one);
      await shown(two);
      const oneBubble = bubbleOf(one);
      const twoBubble = bubbleOf(two);
      expect(lineTops(oneBubble)).toHaveLength(1);
      expect(lineTops(twoBubble)).toHaveLength(2);
      expect(twoBubble.getBoundingClientRect().width).toBeLessThanOrEqual(MAX_WIDTH + 0.5);
      expect(twoBubble.getBoundingClientRect().height).toBeLessThanOrEqual(MAX_HEIGHT + 0.5);
    });
  }

  it('en: no pt-BR text appears', async () => {
    const english = Object.values(translations('en').tooltipValidation) as string[];
    const portuguese = (Object.values(translations('pt-BR').tooltipValidation) as string[]).filter(
      (value) => !english.includes(value),
    );
    expect(portuguese.length).toBeGreaterThan(0);
    for (const story of [OneLine, TwoLines] as Renderable[]) {
      const element = await renderStory(story, 'en');
      for (const value of portuguese) {
        expect(element.text).not.toBe(value);
        expect(bubbleOf(element).textContent ?? '').not.toContain(value);
      }
    }
  });

  it('en and es have the same keys as pt-BR', () => {
    const keys = Object.keys(translations('pt-BR').tooltipValidation);
    expect(Object.keys(translations('en').tooltipValidation)).toEqual(keys);
    expect(Object.keys(translations('es').tooltipValidation)).toEqual(keys);
  });
});
