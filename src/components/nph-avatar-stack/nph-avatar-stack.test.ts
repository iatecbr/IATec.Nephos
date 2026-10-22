/**
 * Tests of `nph-avatar-stack` (P78), in a real browser (P21, item 5): the overlap,
 * the paint order, the width of the count and the accessibility tree only exist where
 * there is layout.
 *
 * They prove the contract accepted in Figma (frame `1579:46`, set `1579:45`) and the
 * decisions D1 to D3 of DSA-25: the API, the single size written on every avatar, the
 * overlap by `avatar/overlap`, the count and its typography per size, the colors in
 * both schemes and in another brand, the contrast of the count, the semantics of the
 * group read by the browser, the composition warnings, the invalid input and the token
 * contract. The photo, the person icon and the border of each avatar belong to
 * `nph-avatar`: here the tests only prove that the group draws no ring of its own.
 *
 * Accessibility assertions are written by hand (P72 moves the addon to DSA-32).
 * Photos are data URIs, never a network address.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cdp } from 'vitest/browser';

import '@fontsource/noto-sans/latin-500.css';
import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-avatar-stack.css?raw';
import { NPH_AVATAR_STACK_MAX_AVATARS, NPH_AVATAR_STACK_MIN_AVATARS, NphAvatarStack } from './nph-avatar-stack';
import { NPH_AVATAR_SIZES } from '../nph-avatar/nph-avatar';
import type { NphAvatar, NphAvatarSize } from '../nph-avatar/nph-avatar';

interface AvatarSpec {
  src?: string;
  label?: string;
  size?: string;
}

interface StackSpec {
  size?: string;
  count?: number;
  label?: string | null;
  avatars?: AvatarSpec[];
}

/** An abstract picture, as a data URI: valid, and it carries no person. */
function picture(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${color}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const THREE: AvatarSpec[] = [{ src: picture('#c0392b') }, {}, { src: picture('#2980b9') }];

beforeAll(async () => {
  await document.fonts.load('500 14px "Noto Sans"');
  await document.fonts.load('500 12px "Noto Sans"');
  await document.fonts.ready;
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

function avatar(spec: AvatarSpec): NphAvatar {
  const element = document.createElement('nph-avatar');
  if (spec.src !== undefined) element.src = spec.src;
  if (spec.label !== undefined) element.label = spec.label;
  if (spec.size !== undefined) element.setAttribute('size', spec.size);
  return element;
}

async function mount(spec: StackSpec = {}, parent: HTMLElement = document.body): Promise<NphAvatarStack> {
  const stack = document.createElement('nph-avatar-stack');
  if (spec.label !== null) stack.label = spec.label ?? 'Ana, Bruno and Carla';
  if (spec.size !== undefined) stack.size = spec.size as NphAvatarSize;
  if (spec.count !== undefined) stack.count = spec.count;
  stack.append(...(spec.avatars ?? THREE).map(avatar));
  parent.append(stack);
  await settle(stack);
  return stack;
}

/** The group and its avatars finished updating, and the child observer had its turn. */
async function settle(stack: NphAvatarStack): Promise<void> {
  await stack.updateComplete;
  await Promise.all(avatars(stack).map((child) => child.updateComplete));
  await new Promise((resolve) => setTimeout(resolve));
  await stack.updateComplete;
  await Promise.all(avatars(stack).map((child) => child.updateComplete));
}

function avatars(stack: NphAvatarStack): NphAvatar[] {
  return [...stack.children].filter((child): child is NphAvatar => child.localName === 'nph-avatar');
}

function countOf(stack: NphAvatarStack): HTMLElement | null {
  return stack.shadowRoot?.querySelector<HTMLElement>('.count') ?? null;
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
}

/** A token read as pixels. `margin-left` takes the negative overlap, which `width` refuses. */
function px(token: string): number {
  return Number.parseFloat(resolved('margin-left', token));
}

/** Brands read from the generated CSS; the default is the `:root` one. */
const DEFAULT_BRAND = /:root,\s*\[data-nph-brand="([\w-]+)"\]/.exec(tokensCss)?.[1] ?? '';
const BRANDS = [...new Set([...tokensCss.matchAll(/\[data-nph-brand="([\w-]+)"\]/g)].map((m) => m[1] ?? ''))];
const OTHER_BRAND = BRANDS.find((brand) => brand !== DEFAULT_BRAND) ?? '';

/** A part of the screen with a brand and a scheme on the same element (P67). */
function scope(brand = OTHER_BRAND, scheme: 'light' | 'dark' = 'dark'): HTMLElement {
  const part = document.createElement('div');
  part.setAttribute('data-nph-brand', brand);
  part.setAttribute('data-nph-color-scheme', scheme);
  document.body.append(part);
  return part;
}

/** WCAG relative luminance and contrast ratio, from computed `rgb()` colors. */
function luminance(color: string): number {
  const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((channel) => {
    const value = Number(channel) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

interface AxNode {
  ignored: boolean;
  role: string;
  name: string;
}

/**
 * The node the browser itself computes for an element, from its accessibility tree. The
 * DOM is not enough here: the children of a `role="img"` are pruned by the browser, and
 * only the tree shows it.
 */
async function axNode(element: Element): Promise<AxNode> {
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
    const node = nodes[0];
    return {
      ignored: Boolean(node?.ignored),
      role: String(node?.role?.value ?? ''),
      name: String(node?.name?.value ?? ''),
    };
  } finally {
    element.removeAttribute('data-ax-probe');
  }
}

describe('registration and API', () => {
  it('defines nph-avatar-stack only once', () => {
    expect(customElements.get('nph-avatar-stack')).toBe(NphAvatarStack);
  });

  it('the public API is exactly size, count and label', () => {
    const declared = [...(NphAvatarStack as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['size', 'count', 'label']);
  });

  it('the defaults are sm, no count and no name, and size reflects to the attribute', async () => {
    const stack = document.createElement('nph-avatar-stack');
    expect([stack.size, stack.count, stack.label]).toEqual(['sm', 0, '']);
    stack.label = 'Team';
    document.body.append(stack);
    await stack.updateComplete;
    expect(stack.getAttribute('size')).toBe('sm');
    expect(stack.hasAttribute('count')).toBe(false);
    expect(stack.hasAttribute('label')).toBe(false);
  });

  it('the attributes are size, count and label', async () => {
    const stack = document.createElement('nph-avatar-stack');
    stack.setAttribute('size', 'md');
    stack.setAttribute('count', '3');
    stack.setAttribute('label', 'Ana, Bruno and 3 more');
    document.body.append(stack);
    await stack.updateComplete;
    expect([stack.size, stack.count, stack.label]).toEqual(['md', 3, 'Ana, Bruno and 3 more']);
  });

  it('the limits of the group are two and five avatars', () => {
    expect([NPH_AVATAR_STACK_MIN_AVATARS, NPH_AVATAR_STACK_MAX_AVATARS]).toEqual([2, 5]);
  });

  it('has the open shadow root: one hidden wrapper, with the slot and nothing else when there is no count', async () => {
    const stack = await mount();
    expect(stack.shadowRoot?.mode).toBe('open');
    const children = [...(stack.shadowRoot?.children ?? [])].filter((node) => node.tagName !== 'STYLE');
    expect(children).toHaveLength(1);
    expect(children[0]?.getAttribute('aria-hidden')).toBe('true');
    expect(getComputedStyle(children[0] as HTMLElement).display).toBe('contents');
    expect([...(children[0]?.children ?? [])].map((node) => node.tagName.toLowerCase())).toEqual(['slot']);
  });
});

describe('a single size', () => {
  it('every avatar takes the size of the group', async () => {
    for (const size of NPH_AVATAR_SIZES) {
      const stack = await mount({ size });
      expect(avatars(stack).map((child) => child.getAttribute('size')), size).toEqual([size, size, size]);
      stack.remove();
    }
  });

  it('a size written on an avatar does not survive: the group writes its own', async () => {
    const stack = await mount({ size: 'md', avatars: [{ size: 'lg' }, { size: 'sm' }, {}] });
    expect(avatars(stack).map((child) => child.size)).toEqual(['md', 'md', 'md']);
  });

  it('changing the size of the group changes every avatar', async () => {
    const stack = await mount();
    stack.size = 'lg';
    await settle(stack);
    expect(avatars(stack).map((child) => child.size)).toEqual(['lg', 'lg', 'lg']);
  });

  it('an avatar that changes its own size afterwards takes the size of the group back', async () => {
    const stack = await mount({ size: 'md' });
    const [first] = avatars(stack);
    first?.setAttribute('size', 'lg');
    await settle(stack);
    expect(first?.size).toBe('md');
    first!.size = 'sm';
    await settle(stack);
    expect(first?.size).toBe('md');
  });

  it('an avatar added later takes the size of the group', async () => {
    const stack = await mount({ size: 'lg' });
    const late = avatar({ size: 'sm' });
    stack.append(late);
    await settle(stack);
    expect(late.size).toBe('lg');
  });
});

describe('the overlap', () => {
  for (const size of NPH_AVATAR_SIZES) {
    it(`${size}: each avatar starts avatar/overlap before the end of the previous one`, async () => {
      const stack = await mount({ size, avatars: [{}, {}, {}, {}, {}] });
      const side = px(`--nph-avatar-size-${size}`);
      const overlap = px('--nph-avatar-overlap');
      expect(overlap).toBeLessThan(0);
      const boxes = avatars(stack).map((child) => child.getBoundingClientRect());
      for (let index = 1; index < boxes.length; index += 1) {
        expect(boxes[index]!.left - boxes[index - 1]!.right, `${size} ${index}`).toBe(overlap);
      }
      expect(stack.getBoundingClientRect().width).toBe(5 * side + 4 * overlap);
      expect(stack.getBoundingClientRect().height).toBe(side);
    });
  }

  it('the first avatar has no start margin, so the group starts where its box starts', async () => {
    const stack = await mount();
    const [first] = avatars(stack);
    expect(getComputedStyle(first as HTMLElement).marginInlineStart).toBe('0px');
    expect(first?.getBoundingClientRect().left).toBe(stack.getBoundingClientRect().left);
  });

  it('each avatar paints over the previous one, in the strip they share', async () => {
    const stack = await mount({ size: 'lg' });
    const [first, second, third] = avatars(stack).map((child) => child.getBoundingClientRect());
    const y = first!.top + first!.height / 2;
    expect(document.elementFromPoint(second!.left + 2, y)).toBe(avatars(stack)[1]);
    expect(document.elementFromPoint(third!.left + 2, y)).toBe(avatars(stack)[2]);
    expect(document.elementFromPoint(first!.left + 2, y)).toBe(avatars(stack)[0]);
  });

  it('the group draws no ring, background or border of its own: the separation is the border of each avatar', async () => {
    const stack = await mount();
    const style = getComputedStyle(stack);
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(style.borderTopStyle).toBe('none');
    expect(style.outlineStyle).toBe('none');
    expect(style.boxShadow).toBe('none');
    for (const child of avatars(stack)) {
      expect(getComputedStyle(child, '::after').borderTopWidth).toBe(resolved('width', '--nph-border-width'));
      expect(getComputedStyle(child).boxShadow).toBe('none');
      expect(getComputedStyle(child).outlineStyle).toBe('none');
    }
  });
});

describe('the count', () => {
  it('with no count, or zero, there is no count', async () => {
    const without = await mount();
    expect(countOf(without)).toBeNull();
    const zero = await mount({ count: 0 });
    expect(countOf(zero)).toBeNull();
  });

  it('removing the count attribute takes the count away, with no error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const stack = await mount({ count: 3 });
    stack.setAttribute('count', '4');
    await settle(stack);
    expect(countOf(stack)?.textContent).toBe('+4');
    stack.removeAttribute('count');
    await settle(stack);
    expect(countOf(stack)).toBeNull();
    expect(stack.hasAttribute('data-nph-rendered')).toBe(true);
    expect(error).not.toHaveBeenCalled();
  });

  it('draws "+N" after the avatars, inside the hidden wrapper', async () => {
    const stack = await mount({ count: 3 });
    const count = countOf(stack);
    expect(count?.textContent).toBe('+3');
    expect(count?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(count?.previousElementSibling?.tagName.toLowerCase()).toBe('slot');
  });

  for (const size of NPH_AVATAR_SIZES) {
    it(`${size}: a box of avatar/size-${size} high and at least as wide, avatar/radius-${size}, overlapping the last avatar`, async () => {
      const stack = await mount({ size, count: 3 });
      const count = countOf(stack) as HTMLElement;
      const box = count.getBoundingClientRect();
      const side = px(`--nph-avatar-size-${size}`);
      expect(box.height).toBe(side);
      expect(box.width).toBeGreaterThanOrEqual(side);
      const last = avatars(stack).at(-1)!.getBoundingClientRect();
      expect(box.left - last.right).toBe(px('--nph-avatar-overlap'));
      const style = getComputedStyle(count);
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', `--nph-avatar-radius-${size}`));
      expect(style.boxSizing).toBe('border-box');
      expect(style.paddingLeft).toBe(resolved('padding-left', '--nph-space-inline-tight'));
      expect(style.paddingRight).toBe(resolved('padding-right', '--nph-space-inline-tight'));
    });
  }

  it('the count paints over the last avatar, in the strip they share', async () => {
    const stack = await mount({ size: 'lg', count: 3 });
    const count = countOf(stack) as HTMLElement;
    const box = count.getBoundingClientRect();
    /* The point is inside the last avatar and inside the count: the count wins. */
    expect(stack.shadowRoot?.elementFromPoint(box.left + 2, box.top + box.height / 2)).toBe(count);
  });

  it('grows with the number and keeps its height', async () => {
    const widths: number[] = [];
    for (const count of [3, 12, 128, 1024]) {
      const stack = await mount({ size: 'md', count });
      const box = (countOf(stack) as HTMLElement).getBoundingClientRect();
      expect(box.height).toBe(px('--nph-avatar-size-md'));
      widths.push(box.width);
      stack.remove();
    }
    expect(widths[0]).toBe(px('--nph-avatar-size-md'));
    expect(widths[2]!).toBeGreaterThan(widths[0]!);
    expect(widths[3]!).toBeGreaterThan(widths[2]!);
  });

  it('the text sits centered in the box and does not wrap', async () => {
    const stack = await mount({ size: 'sm', count: 1024 });
    const style = getComputedStyle(countOf(stack) as HTMLElement);
    expect([style.alignItems, style.justifyContent, style.whiteSpace]).toEqual(['center', 'center', 'nowrap']);
  });

  const ROLES: Record<NphAvatarSize, string> = { sm: 'label-sm', md: 'label-sm', lg: 'label-md' };
  for (const size of NPH_AVATAR_SIZES) {
    it(`${size}: the text is text/${ROLES[size]} (D1)`, async () => {
      const stack = await mount({ size, count: 3 });
      const style = getComputedStyle(countOf(stack) as HTMLElement);
      const role = `--nph-text-${ROLES[size]}`;
      expect(style.fontSize).toBe(resolved('font-size', `${role}-font-size`));
      expect(style.lineHeight).toBe(resolved('line-height', `${role}-line-height`));
      expect(style.fontWeight).toBe(resolved('font-weight', `${role}-font-weight`));
      expect(style.letterSpacing).toBe(resolved('letter-spacing', `${role}-letter-spacing`));
      expect(style.fontFamily).toBe(resolved('font-family', `${role}-font-family`));
    });
  }

  it('sm and md share the text size, and lg is larger', async () => {
    const sizes: string[] = [];
    for (const size of NPH_AVATAR_SIZES) {
      const stack = await mount({ size, count: 3 });
      sizes.push(getComputedStyle(countOf(stack) as HTMLElement).fontSize);
      stack.remove();
    }
    expect(sizes[0]).toBe(sizes[1]);
    expect(Number.parseFloat(sizes[2]!)).toBeGreaterThan(Number.parseFloat(sizes[0]!));
  });
});

describe('colors, in both schemes and in another brand', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the count is color/muted with a border/width border in color/border and color/muted-foreground text`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const stack = await mount({ count: 3 });
      const style = getComputedStyle(countOf(stack) as HTMLElement);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
      expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground'));
      for (const side of ['top', 'right', 'bottom', 'left'] as const) {
        expect(style.getPropertyValue(`border-${side}-width`), side).toBe(resolved('width', '--nph-border-width'));
        expect(style.getPropertyValue(`border-${side}-style`), side).toBe('solid');
        expect(style.getPropertyValue(`border-${side}-color`), side).toBe(resolved('color', '--nph-color-border'));
      }
    });
  }

  it('the two schemes differ, so the colors really follow the scheme', async () => {
    const stack = await mount({ count: 3 });
    document.documentElement.setAttribute('data-nph-color-scheme', 'light');
    const light = getComputedStyle(countOf(stack) as HTMLElement).backgroundColor;
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    expect(getComputedStyle(countOf(stack) as HTMLElement).backgroundColor).not.toBe(light);
  });

  it('with a brand other than the default and the dark scheme on the same element, the count takes the local tokens (P67)', async () => {
    const part = scope();
    const stack = await mount({ count: 3 }, part);
    const style = getComputedStyle(countOf(stack) as HTMLElement);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted', part));
    expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground', part));
    expect(style.borderTopColor).toBe(resolved('color', '--nph-color-border', part));
    expect([style.backgroundColor, style.color]).not.toEqual([
      resolved('background-color', '--nph-color-muted'),
      resolved('color', '--nph-color-muted-foreground'),
    ]);
  });
});

describe('contrast, measured', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the "+N" text on color/muted is at least 4.5:1, in every brand`, async () => {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const stack = await mount({ count: 3 }, part);
        const style = getComputedStyle(countOf(stack) as HTMLElement);
        expect(contrast(style.color, style.backgroundColor), `${scheme} ${brand}`).toBeGreaterThanOrEqual(4.5);
        part.remove();
      }
    });
  }
});

describe('semantics and focus', () => {
  it('the host is an image named by label, and the label does not stay as an attribute', async () => {
    const stack = await mount({ label: '  Ana, Bruno, Carla and 3 more  ', count: 3 });
    expect(stack.getAttribute('role')).toBe('img');
    expect(stack.getAttribute('aria-label')).toBe('Ana, Bruno, Carla and 3 more');
    expect(stack.hasAttribute('aria-hidden')).toBe(false);
  });

  it('the browser reads the group as one image with its name', async () => {
    const stack = await mount({ label: 'Ana, Bruno, Carla and 3 more', count: 3 });
    const node = await axNode(stack);
    expect(node.ignored).toBe(false);
    expect(node.role).toBe('image');
    expect(node.name).toBe('Ana, Bruno, Carla and 3 more');
  });

  it('the avatars and the count are not in the accessibility tree, even an avatar with a label of its own', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const stack = await mount({
      label: 'Team of three and 3 more',
      count: 3,
      avatars: [{ label: 'Zelda Quixote' }, {}, { src: picture('#16a085') }],
    });
    for (const child of avatars(stack)) {
      expect((await axNode(child)).ignored).toBe(true);
    }
    expect((await axNode(countOf(stack) as HTMLElement)).ignored).toBe(true);
    const group = await axNode(stack);
    expect([group.ignored, group.role, group.name]).toEqual([false, 'image', 'Team of three and 3 more']);
  });

  it('the same avatar with a label, outside the group, is in the accessibility tree: the group is what hides it', async () => {
    const alone = avatar({ label: 'Zelda Quixote' });
    document.body.append(alone);
    await alone.updateComplete;
    expect(await axNode(alone)).toEqual({ ignored: false, role: 'image', name: 'Zelda Quixote' });
  });

  it('a name put on the host by the consumer also counts: aria-label and aria-labelledby', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const byLabel = document.createElement('nph-avatar-stack');
    byLabel.setAttribute('aria-label', 'Owners');
    byLabel.append(avatar({}), avatar({}));
    document.body.append(byLabel);
    await settle(byLabel);
    expect(byLabel.hasAttribute('data-nph-rendered')).toBe(true);
    expect((await axNode(byLabel)).name).toBe('Owners');

    const title = document.createElement('span');
    title.id = 'stack-title';
    title.textContent = 'Reviewers';
    const byReference = document.createElement('nph-avatar-stack');
    byReference.setAttribute('aria-labelledby', 'stack-title');
    byReference.append(avatar({}), avatar({}));
    document.body.append(title, byReference);
    await settle(byReference);
    expect(byReference.hasAttribute('data-nph-rendered')).toBe(true);
    expect((await axNode(byReference)).name).toBe('Reviewers');
    expect(error).not.toHaveBeenCalled();
  });

  it('a new label renames the group without re-creating it', async () => {
    const stack = await mount({ label: 'Ana and Bruno' });
    stack.label = 'Ana, Bruno and 1 more';
    await settle(stack);
    expect(stack.getAttribute('aria-label')).toBe('Ana, Bruno and 1 more');
  });

  it('keeps an aria-label added by the consumer before the pending label update', async () => {
    const stack = await mount({ label: 'Original group' });
    stack.label = '';
    stack.setAttribute('aria-label', 'Team');
    await settle(stack);
    expect(stack.getAttribute('aria-label')).toBe('Team');
    expect(stack.getAttribute('role')).toBe('img');
    expect(stack.hasAttribute('data-nph-rendered')).toBe(true);
    expect((await axNode(stack)).name).toBe('Team');
  });

  it('never takes focus: focus() changes nothing and there is no tabindex', async () => {
    const stack = await mount({ count: 3 });
    const before = document.activeElement;
    stack.focus();
    expect(document.activeElement).toBe(before);
    expect(stack.hasAttribute('tabindex')).toBe(false);
    expect(stack.shadowRoot?.querySelector('[tabindex]')).toBeNull();
    expect(stack.shadowRoot?.delegatesFocus).toBe(false);
  });
});

describe('composition', () => {
  async function warnings(spec: StackSpec): Promise<string[]> {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount(spec);
    const messages = warn.mock.calls.map((call) => String(call[0]));
    warn.mockRestore();
    return messages.filter((message) => message.startsWith('[nph-avatar-stack]'));
  }

  it('from two to five avatars, with or without count, there is no warning', async () => {
    for (const total of [2, 3, 4, 5]) {
      expect(await warnings({ avatars: Array.from({ length: total }, () => ({})) }), String(total)).toEqual([]);
      expect(await warnings({ count: 3, avatars: Array.from({ length: total }, () => ({})) }), `${total} +3`).toEqual([]);
    }
  });

  it('fewer than two avatars warns and still renders', async () => {
    const messages = await warnings({ avatars: [{}] });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('fewer than two');
    expect(document.querySelector('nph-avatar-stack')?.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('more than five avatars warns and still draws all of them', async () => {
    const messages = await warnings({ avatars: Array.from({ length: 6 }, () => ({})) });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('more than five');
    const stack = document.querySelector('nph-avatar-stack') as NphAvatarStack;
    expect(avatars(stack).every((child) => child.getBoundingClientRect().width > 0)).toBe(true);
  });

  it('a child that is not an nph-avatar warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const stack = document.createElement('nph-avatar-stack');
    stack.label = 'Team';
    stack.append(avatar({}), avatar({}), document.createElement('span'));
    document.body.append(stack);
    await settle(stack);
    expect(warn.mock.calls.map((call) => String(call[0])).filter((message) => message.includes('only nph-avatar'))).toHaveLength(1);
  });

  it('an avatar with a label of its own warns', async () => {
    const messages = await warnings({ avatars: [{ label: 'Ana' }, {}] });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('label of its own');
  });

  it('label property changes after mounting add, clear, and reissue the composition warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const stack = await mount();
    const first = avatars(stack)[0];

    if (first === undefined) {
      throw new Error('Expected an avatar.');
    }

    expect(warn).not.toHaveBeenCalled();
    first.label = 'Ana';
    await settle(stack);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(first.getAttribute('aria-label')).toBe('Ana');

    first.label = '';
    await settle(stack);
    expect(first.hasAttribute('aria-label')).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);

    first.label = 'Ana';
    await settle(stack);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('a problem that is solved stops warning, and warns again if it comes back', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const stack = await mount({ avatars: [{}] });
    stack.append(avatar({}));
    await settle(stack);
    expect(warn).toHaveBeenCalledTimes(1);
    avatars(stack)[1]?.remove();
    await settle(stack);
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

describe('invalid input', () => {
  async function invalid(spec: StackSpec): Promise<{ stack: NphAvatarStack; errors: string[] }> {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const stack = await mount({ count: 3, ...spec });
    const errors = error.mock.calls.map((call) => String(call[0]));
    return { stack, errors };
  }

  function expectNothingDrawn(stack: NphAvatarStack): void {
    const box = stack.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([0, 0]);
    expect(stack.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(stack).display).toBe('none');
    expect(stack.shadowRoot?.querySelector('slot')).toBeNull();
    expect(countOf(stack)).toBeNull();
    expect(stack.getAttribute('aria-hidden')).toBe('true');
    expect(stack.hasAttribute('role')).toBe(false);
  }

  it('an unknown size: nothing drawn and one console.error', async () => {
    const { stack, errors } = await invalid({ size: 'xl' });
    expectNothingDrawn(stack);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('[nph-avatar-stack]');
    expect(errors[0]).toContain('size');
  });

  for (const count of [-1, 2.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    it(`count ${String(count)}: nothing drawn and one console.error`, async () => {
      const { stack, errors } = await invalid({ count });
      expectNothingDrawn(stack);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('count');
    });
  }

  it('a count attribute that is not a number: nothing drawn and one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const stack = document.createElement('nph-avatar-stack');
    stack.label = 'Team';
    stack.setAttribute('count', 'three');
    stack.append(avatar({}), avatar({}));
    document.body.append(stack);
    await settle(stack);
    expectNothingDrawn(stack);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('no name: nothing drawn and one console.error', async () => {
    const { stack, errors } = await invalid({ label: null });
    expectNothingDrawn(stack);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('name');
  });

  it('a label with only spaces is no name', async () => {
    const { stack, errors } = await invalid({ label: '   ' });
    expectNothingDrawn(stack);
    expect(errors).toHaveLength(1);
  });

  it('two causes emit two errors, one each', async () => {
    const { errors } = await invalid({ size: 'xl', label: null });
    expect(errors).toHaveLength(2);
  });

  it('the error does not repeat when the avatars change', async () => {
    const { stack } = await invalid({ size: 'xl' });
    const error = vi.mocked(console.error);
    stack.append(avatar({}));
    await settle(stack);
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('an invalid group does not write its size on the avatars', async () => {
    const { stack } = await invalid({ size: 'xl', avatars: [{ size: 'md' }, {}] });
    expect(avatars(stack).map((child) => child.size)).toEqual(['md', 'sm']);
  });

  it('does not write an invalid size to avatars after a valid group becomes invalid', async () => {
    const stack = await mount({ size: 'md', avatars: [{ size: 'lg' }, {}] });
    expect(avatars(stack).map((child) => child.size)).toEqual(['md', 'md']);

    stack.size = 'xl' as NphAvatarSize;
    await settle(stack);

    expectNothingDrawn(stack);
    expect(avatars(stack).map((child) => child.size)).toEqual(['md', 'md']);
  });

  it('does not write a newly invalid size during a pending child mutation', async () => {
    const stack = await mount({ size: 'md', avatars: [{}, {}] });
    const children = avatars(stack);
    const first = children[0];
    const second = children[1];
    if (first === undefined || second === undefined) {
      throw new Error('Expected two avatars.');
    }

    first.setAttribute('label', 'Ana');
    stack.setAttribute('size', 'xl');
    await settle(stack);

    expectNothingDrawn(stack);
    expect([first.size, second.size]).toEqual(['md', 'md']);
  });

  it('a valid input set later draws the group, with its semantics', async () => {
    const { stack } = await invalid({ label: null });
    stack.label = 'Ana, Bruno, Carla and 3 more';
    await settle(stack);
    expect(stack.hasAttribute('data-nph-rendered')).toBe(true);
    expect(stack.getAttribute('role')).toBe('img');
    expect(stack.hasAttribute('aria-hidden')).toBe(false);
    expect(countOf(stack)?.textContent).toBe('+3');
    expect(stack.getBoundingClientRect().width).toBeGreaterThan(0);
  });

  it('a name the consumer adds to the host later also makes the group draw', async () => {
    const { stack } = await invalid({ label: null });
    stack.setAttribute('aria-label', 'Team');
    await settle(stack);
    expect(stack.hasAttribute('data-nph-rendered')).toBe(true);
  });

  it('a valid group stays silent', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await mount({ count: 3 });
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('absences', () => {
  it('has no part', async () => {
    const stack = await mount({ count: 3 });
    expect(stack.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('does not emit events of its own', async () => {
    const events: string[] = [];
    const stack = document.createElement('nph-avatar-stack');
    for (const name of ['nph-change', 'nph-value-change', 'change', 'click']) {
      stack.addEventListener(name, () => events.push(name));
    }
    stack.label = 'Team';
    stack.append(avatar({}), avatar({}));
    document.body.append(stack);
    await settle(stack);
    stack.count = 2;
    stack.size = 'lg';
    await settle(stack);
    expect(events).toEqual([]);
  });

  it('has no property beyond the three of the contract', () => {
    const element = document.createElement('nph-avatar-stack') as unknown as Record<string, unknown>;
    for (const name of ['max', 'total', 'people', 'src', 'show', 'showCount', 'overlap', 'disabled', 'variant']) {
      expect(name in element, name).toBe(false);
    }
  });
});

describe('layout', () => {
  it('is an inline box that sits in the middle of a text line', async () => {
    const line = document.createElement('p');
    line.append('Team ');
    document.body.append(line);
    const stack = await mount({ size: 'md', count: 3 }, line);
    const style = getComputedStyle(stack);
    expect(style.display).toBe('inline-flex');
    expect(style.verticalAlign).toBe('middle');
  });

  it('does not shrink its avatars or its count in a narrow flex container', async () => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; align-items: center; inline-size: 40px;';
    document.body.append(row);
    const stack = await mount({ size: 'md', count: 3 }, row);
    expect(avatars(stack).map((child) => child.getBoundingClientRect().width)).toEqual([32, 32, 32]);
    expect((countOf(stack) as HTMLElement).getBoundingClientRect().width).toBe(32);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    const typography = ['label-sm', 'label-md'].flatMap((role) =>
      ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'].map((part) => `--nph-text-${role}-${part}`),
    );
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-avatar-overlap',
        '--nph-avatar-size-sm',
        '--nph-avatar-size-md',
        '--nph-avatar-size-lg',
        '--nph-avatar-radius-sm',
        '--nph-avatar-radius-md',
        '--nph-avatar-radius-lg',
        '--nph-space-inline-tight',
        '--nph-border-width',
        '--nph-color-border',
        '--nph-color-muted',
        '--nph-color-muted-foreground',
        ...typography,
      ]),
    );
    for (const name of used) {
      expect(tokensCss, name).toContain(name + ':');
    }
  });

  it('never consumes a core or theme layer directly', () => {
    expect(cssWithoutComments).not.toMatch(/--nph-core-/);
    expect(cssWithoutComments).not.toMatch(/--nph-theme-/);
  });

  it('the CSS has no literal design value and no motion', () => {
    expect(cssWithoutComments).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(cssWithoutComments).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(cssWithoutComments).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(cssWithoutComments).not.toMatch(/\b(animation|transition|@keyframes|z-index)\b/);
  });

  it('is still: no animation and no transition computed', async () => {
    const stack = await mount({ count: 3 });
    for (const element of [stack, countOf(stack) as HTMLElement]) {
      const style = getComputedStyle(element);
      expect(style.animationName).toBe('none');
      expect(style.transitionDuration).toBe('0s');
    }
  });

  it('design.md keeps avatar/overlap only for the space between the items of nph-avatar-stack', () => {
    expect(designMd).toMatch(/avatar\/overlap:[\s\S]*?USE only in the space between items of nph-avatar-stack/);
  });
});
