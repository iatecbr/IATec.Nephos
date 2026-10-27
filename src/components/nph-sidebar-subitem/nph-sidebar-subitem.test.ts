/**
 * Tests of `nph-sidebar-subitem` (P98), in a real browser (P21, item 5).
 *
 * They prove the contract accepted in Figma (board `1366:2`, documentation `2723:460`, set
 * `2251:51312`), recorded in the evidence of the `figma-docs-accepted` gate of DSA-53: the
 * API, the invalid input, the link, the arrow of options, the disabled line, the balloon,
 * the roles and names the browser computes, the colors and measures of each state, the
 * focus, and the token contract.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp, userEvent } from 'vitest/browser';

import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import componentCss from './nph-sidebar-subitem.css?raw';
import { NphSidebarSubitem } from './nph-sidebar-subitem';
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

async function mount(props: Partial<NphSidebarSubitem> = {}): Promise<NphSidebarSubitem> {
  const subitem = document.createElement('nph-sidebar-subitem');
  subitem.style.inlineSize = '240px';
  Object.assign(subitem, { label: 'Monthly', href: '#monthly', ...props });
  document.body.append(subitem);
  await subitem.updateComplete;
  return subitem;
}

const control = (subitem: NphSidebarSubitem): HTMLElement => subitem.shadowRoot?.querySelector('.control') as HTMLElement;
const arrow = (subitem: NphSidebarSubitem): NphIcon | null => subitem.shadowRoot?.querySelector('.arrow') as NphIcon | null;
const balloon = (subitem: NphSidebarSubitem): NphTooltip | null => subitem.shadowRoot?.querySelector('nph-tooltip') as NphTooltip | null;

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
    expect(customElements.get('nph-sidebar-subitem')).toBe(NphSidebarSubitem);
  });

  it('the public API is exactly P98: no icon, no counter, no more actions', () => {
    const declared = [...(NphSidebarSubitem as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared.sort()).toEqual(['active', 'disabled', 'href', 'label', 'options', 'tooltip']);
  });

  it('has the defaults of the set: options no, at rest, no balloon', () => {
    const subitem = document.createElement('nph-sidebar-subitem');
    expect(subitem.options).toBe(false);
    expect(subitem.active).toBe(false);
    expect(subitem.disabled).toBe(false);
    expect(subitem.tooltip).toBe('');
  });

  it('reflects active, options and disabled, which the CSS reads', async () => {
    const subitem = await mount({ active: true, options: true, disabled: true });
    expect(subitem.hasAttribute('active')).toBe(true);
    expect(subitem.hasAttribute('options')).toBe(true);
    expect(subitem.hasAttribute('disabled')).toBe(true);
  });

  it('has no slot and no part, and fills the width it receives', async () => {
    const subitem = await mount({ options: true, tooltip: 'Monthly report' });
    expect(subitem.shadowRoot?.querySelector('slot')).toBeNull();
    expect(subitem.shadowRoot?.querySelector('[part]')).toBeNull();
    expect(control(subitem).getBoundingClientRect().width).toBeCloseTo(240, 0);
  });
});

describe('invalid input', () => {
  it('a subitem without href renders nothing and complains once', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const subitem = await mount({ href: '' });
    expect(subitem.shadowRoot?.childElementCount).toBe(0);
    expect(getComputedStyle(subitem).display).toBe('none');
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toMatch(/^\[nph-sidebar-subitem\] a subitem needs an href/);
  });

  it('no label is a mount: nothing, and no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const subitem = await mount({ label: '', href: '' });
    expect(subitem.shadowRoot?.childElementCount).toBe(0);
    expect(error).not.toHaveBeenCalled();
  });

  it('a disabled subitem needs no href', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const subitem = await mount({ href: '', disabled: true });
    expect(control(subitem)).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
  });
});

describe('the link', () => {
  it('is an anchor named by the label, with aria-current when active', async () => {
    const subitem = await mount();
    expect(control(subitem).tagName).toBe('A');
    expect(control(subitem).getAttribute('href')).toBe('#monthly');
    expect(control(subitem).hasAttribute('aria-current')).toBe(false);
    const node = await axNode(control(subitem));
    expect(node.role).toBe('link');
    expect(node.name).toBe('Monthly');
    subitem.active = true;
    await subitem.updateComplete;
    expect(control(subitem).getAttribute('aria-current')).toBe('page');
  });

  it('options shows the chevron-right arrow at icon/size-sm, visual only', async () => {
    const subitem = await mount();
    expect(arrow(subitem)).toBeNull();
    subitem.options = true;
    await subitem.updateComplete;
    expect(arrow(subitem)?.name).toBe('chevron-right');
    expect(arrow(subitem)?.size).toBe('sm');
    expect(control(subitem).tagName).toBe('A');
    await (arrow(subitem) as NphIcon).updateComplete;
    const node = await axNode(control(subitem));
    expect(node.name).toBe('Monthly');
  });

  it('the click is the native click, which reaches the host', async () => {
    const subitem = await mount();
    const seen = vi.fn((event: Event) => event.preventDefault());
    subitem.addEventListener('click', seen);
    await userEvent.click(control(subitem));
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('a long label stays on one line and ends in an ellipsis, before the arrow', async () => {
    const subitem = await mount({ label: 'A very long name of a report that does not fit in the line', options: true });
    const label = subitem.shadowRoot?.querySelector('.label') as HTMLElement;
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    expect(label.getBoundingClientRect().right).toBeLessThanOrEqual((arrow(subitem) as HTMLElement).getBoundingClientRect().left);
  });
});

describe('the disabled line', () => {
  it('is a link without href, with role link and aria-disabled, no balloon, and lets no click through', async () => {
    const subitem = await mount({ disabled: true, tooltip: 'Monthly report' });
    expect(control(subitem).hasAttribute('href')).toBe(false);
    expect(control(subitem).getAttribute('role')).toBe('link');
    expect(control(subitem).getAttribute('aria-disabled')).toBe('true');
    expect(balloon(subitem)).toBeNull();
    const seen = vi.fn();
    subitem.addEventListener('click', seen);
    subitem.click();
    control(subitem).click();
    expect(seen).not.toHaveBeenCalled();
    expect(getComputedStyle(subitem).opacity).toBe(resolved('opacity', '--nph-state-disabled-opacity'));
  });
});

describe('colors, type and measures', () => {
  it('at rest: no background, sidebar/item-foreground, text/body-md', async () => {
    const subitem = await mount();
    const style = getComputedStyle(control(subitem));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-body-md-font-weight'));
  });

  it('on hover: sidebar/item-background-hover', async () => {
    const subitem = await mount();
    await userEvent.hover(control(subitem));
    expect(getComputedStyle(control(subitem)).backgroundColor).toBe(resolved('background-color', '--nph-sidebar-item-background-hover'));
  });

  it('active: sidebar/item-foreground-active and text/label-md, no background', async () => {
    const subitem = await mount({ active: true });
    const style = getComputedStyle(control(subitem));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.color).toBe(resolved('color', '--nph-sidebar-item-foreground-active'));
    expect(style.fontWeight).toBe(resolved('font-weight', '--nph-text-label-md-font-weight'));
  });

  it('height control/height-default, space/inline top and bottom and before the arrow, sidebar/item-padding on the sides', async () => {
    const subitem = await mount({ options: true });
    const style = getComputedStyle(control(subitem));
    expect(control(subitem).getBoundingClientRect().height).toBeCloseTo(px('--nph-control-height-default'), 0);
    expect(Number.parseFloat(style.paddingBlockStart)).toBeCloseTo(px('--nph-space-inline'), 0);
    expect(Number.parseFloat(style.paddingInlineStart)).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
    expect(Number.parseFloat(style.paddingInlineEnd)).toBeCloseTo(px('--nph-sidebar-item-padding'), 0);
    expect(Number.parseFloat(style.columnGap)).toBeCloseTo(px('--nph-space-inline'), 0);
    expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-sidebar-item-radius'));
  });
});

describe('focus and balloon', () => {
  it('keyboard focus draws the color/primary border and the focus/halo halo, in the item radii', async () => {
    const subitem = await mount();
    await userEvent.keyboard('{Tab}');
    expect(subitem.shadowRoot?.activeElement).toBe(control(subitem));
    const border = getComputedStyle(control(subitem), '::before');
    const halo = getComputedStyle(control(subitem), '::after');
    expect(border.borderTopColor).toBe(resolved('color', '--nph-color-primary'));
    expect(border.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-border-radius-sidebar-item'));
    expect(halo.borderTopColor).toBe(resolved('color', '--nph-focus-halo'));
    expect(halo.borderTopLeftRadius).toBe(resolved('border-top-left-radius', '--nph-focus-radius-sidebar-item'));
  });

  it('tooltip renders an nph-tooltip for the link, as its description; a click on it stops at the host', async () => {
    const subitem = await mount({ tooltip: 'Monthly report of the team' });
    const tooltip = balloon(subitem) as NphTooltip;
    await tooltip.updateComplete;
    expect(tooltip.getAttribute('for')).toBe('control');
    expect(tooltip.relation).toBe('description');
    const node = await axNode(control(subitem));
    expect(node.description).toBe('Monthly report of the team');
    const seen = vi.fn();
    subitem.addEventListener('click', seen);
    tooltip.click();
    expect(seen).not.toHaveBeenCalled();
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const used = new Set([...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1] ?? ''));

  it('every custom property in the CSS exists in tokens.css', () => {
    for (const name of used) {
      expect(tokensCss, name).toContain(`${name}:`);
    }
    for (const name of ['--nph-control-height-default', '--nph-space-inline', '--nph-sidebar-item-padding', '--nph-sidebar-item-radius']) {
      expect(used, name).toContain(name);
    }
  });

  it('never consumes a core or theme token, and has no literal color, measure or duration', () => {
    expect(componentCss).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(cssWithoutComments).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
  });
});
