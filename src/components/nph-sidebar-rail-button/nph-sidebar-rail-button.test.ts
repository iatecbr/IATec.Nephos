/**
 * Tests of `nph-sidebar-rail-button` (P98), in a real browser (P21, item 5).
 *
 * They prove the contract accepted in Figma (board `1366:2`, documentation `2723:460`, set
 * `2251:51328`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-53: the
 * API, the invalid input, the link named by the label and its balloon, the counter as the
 * description, the disabled button, the roles and names the browser computes, the colors and
 * measures of each state, the focus, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-sidebar-rail-button.css?raw';
import { NphSidebarRailButton } from './nph-sidebar-rail-button';
import type { NphIcon } from '../nph-icon/nph-icon';
import type { NphTooltip } from '../nph-tooltip/nph-tooltip';

beforeAll(async () => {
  await document.fonts.load('400 14px "Noto Sans"');
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(async () => {
  await userEvent.unhover(document.body).catch(() => {});
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function mount(props: Partial<NphSidebarRailButton> = {}): Promise<NphSidebarRailButton> {
  const rail = document.createElement('nph-sidebar-rail-button');
  Object.assign(rail, { label: 'Inbox', icon: 'inbox', href: '#inbox', ...props });
  document.body.append(rail);
  await rail.updateComplete;
  const tooltip = rail.shadowRoot?.querySelector('nph-tooltip') as NphTooltip | null;
  await tooltip?.updateComplete;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  return rail;
}

const control = (rail: NphSidebarRailButton): HTMLElement => rail.shadowRoot?.querySelector('.control') as HTMLElement;
const icon = (rail: NphSidebarRailButton): NphIcon => rail.shadowRoot?.querySelector('.icon') as NphIcon;
const counter = (rail: NphSidebarRailButton): HTMLElement | null => rail.shadowRoot?.querySelector('.counter') as HTMLElement | null;
const balloon = (rail: NphSidebarRailButton): NphTooltip | null => rail.shadowRoot?.querySelector('nph-tooltip') as NphTooltip | null;

function resolved(property: string, token: string): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

const px = (token: string): number => Number.parseFloat(resolved('width', token));

async function axNode(element: Element): Promise<{ role: string; name: string; description: string }> {
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
    return {
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
      description: String(node?.description?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('registers the tag once and exposes the class', () => {
    expect(customElements.get('nph-sidebar-rail-button')).toBe(NphSidebarRailButton);
  });

  it('the public API is exactly P98: no tooltip property, the balloon is always on', () => {
    const declared = [...(NphSidebarRailButton as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(['active', 'counter', 'disabled', 'href', 'icon', 'label']);
  });

  it('reflects active and disabled, and reads counter from the attribute', async () => {
    const rail = document.createElement('nph-sidebar-rail-button');
    rail.setAttribute('label', 'Inbox');
    rail.setAttribute('icon', 'inbox');
    rail.setAttribute('href', '#inbox');
    rail.setAttribute('counter', '5');
    document.body.append(rail);
    rail.active = true;
    await rail.updateComplete;
    expect(rail.counter).toBe(5);
    expect(rail.hasAttribute('active')).toBe(true);
    rail.disabled = true;
    await rail.updateComplete;
    expect(rail.hasAttribute('disabled')).toBe(true);
  });

  it('has no slot and no part', async () => {
    const rail = await mount({ counter: 2 });
    expect(rail.shadowRoot?.querySelector('slot')).toBeNull();
    expect(rail.shadowRoot?.querySelector('[part]')).toBeNull();
  });
});

describe('invalid input', () => {
  const cases: Array<[string, Partial<NphSidebarRailButton>, RegExp]> = [
    ['no label', { label: '' }, /needs a label/],
    ['no icon', { icon: '' }, /needs an icon/],
    ['an icon outside the core', { icon: 'rocket' }, /"rocket" is not a core name/],
    ['no href', { href: '' }, /needs an href/],
    ['a counter that is not a whole number', { counter: 2.5 }, /counter shows a whole number/],
  ];

  for (const [cause, props, message] of cases) {
    it(`${cause}: renders nothing and complains once`, async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const rail = await mount(props);
      expect(rail.shadowRoot?.childElementCount).toBe(0);
      expect(getComputedStyle(rail).display).toBe('none');
      expect(error).toHaveBeenCalledTimes(1);
      expect(String(error.mock.calls[0]?.[0])).toMatch(message);
      expect(String(error.mock.calls[0]?.[0])).toMatch(/^\[nph-sidebar-rail-button\]/);
    });
  }

  it('no label and no icon is a mount: nothing, and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rail = await mount({ label: '', icon: '', href: '' });
    expect(rail.shadowRoot?.childElementCount).toBe(0);
    expect(error).not.toHaveBeenCalled();
  });
});

describe('the link, its name and the balloon', () => {
  it('is an anchor named by the label, and the balloon repeats the name', async () => {
    const rail = await mount();
    expect(control(rail).tagName).toBe('A');
    expect(control(rail).getAttribute('href')).toBe('#inbox');
    expect(control(rail).getAttribute('aria-label')).toBe('Inbox');
    const tooltip = balloon(rail) as NphTooltip;
    expect(tooltip.getAttribute('for')).toBe('control');
    expect(tooltip.relation).toBe('name');
    expect(tooltip.text).toBe('Inbox');
    const node = await axNode(control(rail));
    expect(node.role).toBe('link');
    expect(node.name).toBe('Inbox');
    expect(node.description).toBe('');
  });

  it('keyboard focus opens the balloon at once', async () => {
    const rail = await mount();
    await userEvent.keyboard('{Tab}');
    await (balloon(rail) as NphTooltip).updateComplete;
    expect(balloon(rail)?.open).toBe(true);
  });

  it('at rest the icon is light; active it is solid, with aria-current="page"', async () => {
    const rail = await mount();
    expect(icon(rail).variant).toBe('light');
    expect(icon(rail).size).toBe('md');
    rail.active = true;
    await rail.updateComplete;
    expect(icon(rail).variant).toBe('solid');
    expect(control(rail).getAttribute('aria-current')).toBe('page');
  });

  it('the counter is read as text, as the description of the link', async () => {
    const rail = await mount({ counter: 7 });
    expect(counter(rail)?.textContent).toBe('7');
    const node = await axNode(control(rail));
    expect(node.name).toBe('Inbox');
    expect(node.description).toBe('7');
  });

  it('the click is the native click; a click on the balloon stops at the host', async () => {
    const rail = await mount();
    const seen = vi.fn((event: Event) => event.preventDefault());
    rail.addEventListener('click', seen);
    await userEvent.click(control(rail));
    expect(seen).toHaveBeenCalledTimes(1);
    (balloon(rail) as HTMLElement).click();
    expect(seen).toHaveBeenCalledTimes(1);
  });
});

describe('the disabled button', () => {
  it('is a link without href, role link, aria-disabled, still named; no balloon and no click', async () => {
    const rail = await mount({ disabled: true });
    expect(control(rail).hasAttribute('href')).toBe(false);
    expect(control(rail).getAttribute('role')).toBe('link');
    expect(control(rail).getAttribute('aria-disabled')).toBe('true');
    expect(balloon(rail)).toBeNull();
    const node = await axNode(control(rail));
    expect(node.role).toBe('link');
    expect(node.name).toBe('Inbox');
    const seen = vi.fn();
    rail.addEventListener('click', seen);
    rail.click();
    control(rail).click();
    expect(seen).not.toHaveBeenCalled();
    expect(getComputedStyle(rail).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });

  it('a disabled rail button needs no href', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await mount({ disabled: true, href: '' });
    expect(error).not.toHaveBeenCalled();
  });
});

describe('colors and measures', () => {
  it('a square of sidebar/rail-button-size in radius/container, the icon at icon/size-md', async () => {
    const rail = await mount();
    const box = control(rail).getBoundingClientRect();
    expect(box.width).toBeCloseTo(px('--nph-sidebar-rail-button-size'), 0);
    expect(box.height).toBeCloseTo(px('--nph-sidebar-rail-button-size'), 0);
    expect(getComputedStyle(control(rail)).borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-radius-container'));
    expect(icon(rail).getBoundingClientRect().width).toBeCloseTo(px('--nph-icon-size-md'), 0);
  });

  it('at rest: no background and sidebar/item-foreground; on hover: sidebar/rail-background-hover', async () => {
    const rail = await mount();
    expect(getComputedStyle(control(rail)).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(control(rail)).color).toBe(resolved('color', '--nph-sidebar-item-foreground'));
    await userEvent.hover(control(rail));
    expect(getComputedStyle(control(rail)).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-rail-background-hover'));
  });

  it('active: sidebar/rail-background-active and the icon in sidebar/rail-foreground-active, on hover too', async () => {
    const rail = await mount({ active: true });
    const check = (): void => {
      const style = getComputedStyle(control(rail));
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-sidebar-rail-background-active'));
      expect(style.color).toBe(resolved('color', '--nph-sidebar-rail-foreground-active'));
    };
    check();
    await userEvent.hover(control(rail));
    check();
  });

  it('the counter: a pill on the top end corner (D-1), with an outline in sidebar/panel-background when active (D-2)', async () => {
    const rail = await mount({ counter: 3 });
    const pill = counter(rail) as HTMLElement;
    const box = control(rail).getBoundingClientRect();
    const corner = pill.getBoundingClientRect();
    expect(corner.top).toBeCloseTo(box.top, 0);
    expect(corner.right).toBeCloseTo(box.right, 0);
    expect(corner.height).toBeCloseTo(px('--nph-icon-size-md'), 0);
    const style = getComputedStyle(pill);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-sidebar-item-badge-background'));
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-badge-foreground'));
    expect(style.outlineStyle).toBe('none');
    rail.active = true;
    await rail.updateComplete;
    const active = getComputedStyle(pill);
    expect(active.outlineStyle).toBe('solid');
    expect(active.outlineColor).toBe(resolved('color', '--nph-sidebar-panel-background'));
    expect(Number.parseFloat(active.outlineWidth)).toBeCloseTo(px('--nph-border-width'), 1);
  });

  it('keyboard focus draws the color/primary border and the focus/halo halo, in the container radii', async () => {
    const rail = await mount();
    await userEvent.keyboard('{Tab}');
    expect(rail.shadowRoot?.activeElement).toBe(control(rail));
    const border = getComputedStyle(control(rail), '::before');
    const halo = getComputedStyle(control(rail), '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-container'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-container'));
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css, including the rail tokens of the evidence', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
    for (const name of [
      '--nph-sidebar-rail-button-size',
      '--nph-sidebar-rail-background-hover',
      '--nph-sidebar-rail-background-active',
      '--nph-sidebar-rail-foreground-active',
      '--nph-sidebar-panel-background',
      '--nph-radius-container',
      '--nph-focus-border-radius-container',
      '--nph-focus-radius-container',
    ]) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token, nor sidebar/rail-radius, and has no literal value', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/--nph-sidebar-rail-radius/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
  });
});
