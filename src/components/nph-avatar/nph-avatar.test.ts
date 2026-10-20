/**
 * Tests of `nph-avatar` (P74), in a real browser (P21, item 5): resolved
 * color, measures, image loading and the box inside a container only exist where
 * there is layout.
 *
 * They prove the contract accepted in Figma (frame `1434:30`, set `1434:29`): the
 * API, the square box per size with its corner, the person icon and its size, the
 * colors in both schemes and in another brand, the photo and its loading and
 * failure, the border over the photo, the host semantics, focus, the invalid input
 * and the token contract.
 *
 * Photos are data URIs, never a network address, so no test depends on the network
 * or leaves a 404 behind. The paint order of the border over the photo is not
 * measured: there is no pixel reading here, and `elementFromPoint` does not return a
 * pseudo-element. The test reads what the pseudo-element computes; the order itself
 * is structural and is stated in the CSS and in P74.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import '../../tokens/generated/tokens.css';
import tokensCss from '../../tokens/generated/tokens.css?raw';
import designMd from '../../../design.md?raw';
import componentCss from './nph-avatar.css?raw';
import { NPH_AVATAR_SIZES, NphAvatar, isSize } from './nph-avatar';

type Props = Partial<Pick<NphAvatar, 'size' | 'src' | 'label'>>;

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-nph-color-scheme');
  vi.restoreAllMocks();
});

/** An abstract picture, as a data URI: valid, and it carries no person. */
function picture(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="${color}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const PHOTO = picture('#c0392b');
const OTHER_PHOTO = picture('#2980b9');
/** The text "not an image" in base64: a valid data URI that is not a picture, so it fails to load. */
const BROKEN_PHOTO = 'data:image/png;base64,bm90IGFuIGltYWdl';

async function mount(props: Props = {}, parent: HTMLElement = document.body): Promise<NphAvatar> {
  const element = document.createElement('nph-avatar');
  Object.assign(element, props);
  parent.append(element);
  await element.updateComplete;
  return element;
}

/** The inner photo, when there is one. */
function photo(element: NphAvatar): HTMLImageElement | null {
  return element.shadowRoot?.querySelector<HTMLImageElement>('img') ?? null;
}

/** The inner person icon, when it is drawn. */
function icon(element: NphAvatar): HTMLElement | null {
  return element.shadowRoot?.querySelector<HTMLElement>('nph-icon') ?? null;
}

/** Waits until the photo finished loading and the avatar redrew itself. */
async function settled(element: NphAvatar): Promise<void> {
  await vi.waitFor(() => expect(photo(element)?.complete).toBe(true));
  await element.updateComplete;
}

function resolved(property: string, token: string, parent: HTMLElement = document.body): string {
  const probe = document.createElement('div');
  probe.style.setProperty(property, `var(${token})`);
  parent.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return value;
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

describe('registration and API', () => {
  it('defines nph-avatar only once', () => {
    expect(customElements.get('nph-avatar')).toBe(NphAvatar);
  });

  it('the public API is exactly size, src and label', () => {
    const declared = [...(NphAvatar as unknown as { elementProperties: Map<string, unknown> }).elementProperties.keys()];
    expect(declared).toEqual(['size', 'src', 'label']);
  });

  it('the sizes are exactly sm, md and lg, and the guard agrees', () => {
    expect([...NPH_AVATAR_SIZES]).toEqual(['sm', 'md', 'lg']);
    expect(['sm', 'md', 'lg'].every(isSize)).toBe(true);
    expect(['xs', 'xl', '', 'SM', 'circle'].some(isSize)).toBe(false);
  });

  it('the defaults are sm, with no photo and no name, and size reflects to the attribute', async () => {
    const element = await mount();
    expect([element.size, element.src, element.label]).toEqual(['sm', '', '']);
    expect(element.getAttribute('size')).toBe('sm');
  });

  it('src and label do not reflect to attributes', async () => {
    const element = await mount({ src: PHOTO, label: 'Ana' });
    expect(element.hasAttribute('src')).toBe(false);
    expect(element.hasAttribute('label')).toBe(false);
  });

  it('the attributes are size, src and label', async () => {
    const element = document.createElement('nph-avatar');
    element.setAttribute('size', 'md');
    element.setAttribute('src', PHOTO);
    element.setAttribute('label', 'Ana');
    document.body.append(element);
    await element.updateComplete;
    expect([element.size, element.src, element.label]).toEqual(['md', PHOTO, 'Ana']);
  });

  it('has the open shadow root', async () => {
    const element = await mount();
    expect(element.shadowRoot?.mode).toBe('open');
  });
});

describe('measures', () => {
  for (const size of NPH_AVATAR_SIZES) {
    it(`${size}: a square of avatar/size-${size} with avatar/radius-${size}, never a circle`, async () => {
      const element = await mount({ size });
      const box = element.getBoundingClientRect();
      const side = Number.parseFloat(resolved('width', `--nph-avatar-size-${size}`));
      expect([box.width, box.height]).toEqual([side, side]);
      const style = getComputedStyle(element);
      expect(style.boxSizing).toBe('border-box');
      expect(style.borderTopLeftRadius).toBe(resolved('border-top-left-radius', `--nph-avatar-radius-${size}`));
      expect(Number.parseFloat(style.borderTopLeftRadius)).toBeLessThan(side / 2);
      expect(style.overflow).toBe('hidden');
    });
  }

  it('the three sizes are 24, 32 and 40', async () => {
    const sides: number[] = [];
    for (const size of NPH_AVATAR_SIZES) {
      const element = await mount({ size });
      sides.push(element.getBoundingClientRect().width);
    }
    expect(sides).toEqual([24, 32, 40]);
  });

  it('the size is the same with a photo and without one', async () => {
    const without = await mount({ size: 'lg' });
    const withPhoto = await mount({ size: 'lg', src: PHOTO });
    await settled(withPhoto);
    expect(withPhoto.getBoundingClientRect().toJSON()).toMatchObject({
      width: without.getBoundingClientRect().width,
      height: without.getBoundingClientRect().height,
    });
  });
});

describe('the person icon', () => {
  for (const size of NPH_AVATAR_SIZES) {
    it(`${size}: nph-icon user in light, in icon/size-${size}, with no label`, async () => {
      const element = await mount({ size });
      const drawn = icon(element);
      expect(drawn).not.toBeNull();
      expect(drawn?.getAttribute('name')).toBe('user');
      expect(drawn?.getAttribute('size')).toBe(size);
      expect(drawn?.hasAttribute('variant')).toBe(false);
      expect(drawn?.hasAttribute('label')).toBe(false);
      const box = drawn?.getBoundingClientRect();
      const side = Number.parseFloat(resolved('width', `--nph-icon-size-${size}`));
      expect([box?.width, box?.height]).toEqual([side, side]);
    });
  }

  it('the icon is the one and only content without a photo, centered in the frame', async () => {
    const element = await mount({ size: 'md' });
    expect([...(element.shadowRoot?.children ?? [])].filter((node) => node.tagName !== 'STYLE').map((node) => node.tagName.toLowerCase())).toEqual(['nph-icon']);
    const frame = element.getBoundingClientRect();
    const box = icon(element)?.getBoundingClientRect();
    expect((box?.left ?? 0) - frame.left).toBeCloseTo(frame.right - (box?.right ?? 0), 2);
    expect((box?.top ?? 0) - frame.top).toBeCloseTo(frame.bottom - (box?.bottom ?? 0), 2);
  });
});

describe('colors, in both schemes and in another brand', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the frame is color/muted, the icon color/muted-foreground and the border color/border`, async () => {
      document.documentElement.setAttribute('data-nph-color-scheme', scheme);
      const element = await mount();
      const style = getComputedStyle(element);
      expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted'));
      expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground'));
      expect(getComputedStyle(icon(element) as HTMLElement).color).toBe(resolved('color', '--nph-color-muted-foreground'));
      expect(getComputedStyle(element, '::after').borderTopColor).toBe(resolved('color', '--nph-color-border'));
    });
  }

  it('the two schemes differ, so the colors really follow the scheme', async () => {
    const element = await mount();
    document.documentElement.setAttribute('data-nph-color-scheme', 'light');
    const light = getComputedStyle(element).backgroundColor;
    document.documentElement.setAttribute('data-nph-color-scheme', 'dark');
    expect(getComputedStyle(element).backgroundColor).not.toBe(light);
  });

  it('with a brand other than the default and the dark scheme on the same element, the avatar takes the local tokens (P67)', async () => {
    const part = scope();
    const element = await mount({}, part);
    const style = getComputedStyle(element);
    expect(style.backgroundColor).toBe(resolved('background-color', '--nph-color-muted', part));
    expect(style.color).toBe(resolved('color', '--nph-color-muted-foreground', part));
    expect(getComputedStyle(element, '::after').borderTopColor).toBe(resolved('color', '--nph-color-border', part));
    const pair = [style.backgroundColor, style.color, getComputedStyle(element, '::after').borderTopColor];
    const global = [
      resolved('background-color', '--nph-color-muted'),
      resolved('color', '--nph-color-muted-foreground'),
      resolved('color', '--nph-color-border'),
    ];
    expect(pair).not.toEqual(global);
  });

  it('has no hover, focus or disabled look of its own', async () => {
    const element = await mount();
    const style = getComputedStyle(element);
    expect(style.cursor).toBe('auto');
    expect(style.outlineStyle).toBe('none');
    expect(style.opacity).toBe('1');
  });
});

describe('the photo', () => {
  it('while it loads, the icon shows and the picture stays hidden', async () => {
    const element = await mount({ src: PHOTO });
    /* The load is a later task: right after the update, the photo has not arrived. */
    expect(icon(element)).not.toBeNull();
    expect(photo(element)).not.toBeNull();
    expect(photo(element)?.hidden).toBe(true);
    expect(getComputedStyle(photo(element) as HTMLElement).display).toBe('none');
  });

  it('after the load event, the picture shows, fills the frame and the icon is gone', async () => {
    const element = await mount({ size: 'md', src: PHOTO });
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    expect(icon(element)).toBeNull();
    const image = photo(element) as HTMLImageElement;
    expect(image.alt).toBe('');
    expect(image.naturalWidth).toBeGreaterThan(0);
    const frame = element.getBoundingClientRect();
    const box = image.getBoundingClientRect();
    expect([box.width, box.height, box.left, box.top]).toEqual([frame.width, frame.height, frame.left, frame.top]);
    const style = getComputedStyle(image);
    expect(style.objectFit).toBe('cover');
    expect(style.borderTopWidth).toBe('0px');
    expect(style.borderLeftWidth).toBe('0px');
    expect(style.borderBottomWidth).toBe('0px');
    expect(style.borderRightWidth).toBe('0px');
  });

  it('a photo that fails keeps the icon, hides the picture and logs nothing', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ src: BROKEN_PHOTO });
    await settled(element);
    expect(photo(element)?.naturalWidth).toBe(0);
    expect(photo(element)?.hidden).toBe(true);
    expect(icon(element)).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
  });

  it('a new src starts the wait again: the icon comes back until the new picture loads', async () => {
    const element = await mount({ src: PHOTO });
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    element.src = OTHER_PHOTO;
    await element.updateComplete;
    expect(icon(element)).not.toBeNull();
    expect(photo(element)?.hidden).toBe(true);
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    expect(icon(element)).toBeNull();
  });

  it('a new src that fails after a good one keeps the icon', async () => {
    const element = await mount({ src: PHOTO });
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    element.src = BROKEN_PHOTO;
    await element.updateComplete;
    await settled(element);
    expect(icon(element)).not.toBeNull();
    expect(photo(element)?.hidden).toBe(true);
  });

  it('a src that changes only by surrounding spaces keeps the loaded photo shown', async () => {
    const element = await mount({ src: PHOTO });
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    const image = photo(element);
    element.src = `  ${PHOTO}  `;
    await element.updateComplete;
    /* The address the picture gets is the same, so no new load comes: the photo must stay. */
    expect(photo(element)).toBe(image);
    expect(photo(element)?.hidden).toBe(false);
    expect(icon(element)).toBeNull();
  });

  it('a src that changes only by surrounding spaces keeps a failed photo failed', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ src: BROKEN_PHOTO });
    await settled(element);
    /* `complete` can turn true a moment before the `error` event reaches the component. */
    await vi.waitFor(() => expect((element as unknown as { photo: string }).photo).toBe('error'));
    await element.updateComplete;
    element.src = `  ${BROKEN_PHOTO}  `;
    await element.updateComplete;
    expect((element as unknown as { photo: string }).photo).toBe('error');
    expect(photo(element)?.hidden).toBe(true);
    expect(icon(element)).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
  });

  it('removing src goes back to the icon and draws no picture at all', async () => {
    const element = await mount({ src: PHOTO });
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    element.src = '';
    await element.updateComplete;
    expect(photo(element)).toBeNull();
    expect(icon(element)).not.toBeNull();
  });

  it('a src with only spaces is no photo: no picture, the icon', async () => {
    const element = await mount({ src: '   ' });
    expect(photo(element)).toBeNull();
    expect(icon(element)).not.toBeNull();
  });

  it('the picture has an empty alt: the name belongs to the host', async () => {
    const element = await mount({ src: PHOTO, label: 'Ana' });
    expect(photo(element)?.getAttribute('alt')).toBe('');
  });
});

describe('the border', () => {
  it('is drawn by an overlay over the whole frame, with border/width in color/border, letting the pointer through', async () => {
    const element = await mount({ size: 'md', src: PHOTO });
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    const overlay = getComputedStyle(element, '::after');
    expect(overlay.content).toBe('""');
    expect(overlay.position).toBe('absolute');
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      expect(overlay.getPropertyValue(side), side).toBe('0px');
    }
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      expect(overlay.getPropertyValue(`border-${side.toLowerCase()}-width`), side).toBe(resolved('width', '--nph-border-width'));
      expect(overlay.getPropertyValue(`border-${side.toLowerCase()}-style`), side).toBe('solid');
      expect(overlay.getPropertyValue(`border-${side.toLowerCase()}-color`), side).toBe(resolved('color', '--nph-color-border'));
    }
    expect(overlay.boxSizing).toBe('border-box');
    expect(overlay.pointerEvents).toBe('none');
  });

  it('takes the corner of the frame, so the border follows the rounded corner', async () => {
    for (const size of NPH_AVATAR_SIZES) {
      const element = await mount({ size });
      expect(getComputedStyle(element, '::after').borderTopLeftRadius, size).toBe(resolved('border-top-left-radius', `--nph-avatar-radius-${size}`));
      element.remove();
    }
  });

  it('the picture itself has no border: the only border is the overlay one', async () => {
    const element = await mount({ src: PHOTO });
    expect(getComputedStyle(photo(element) as HTMLElement).borderTopStyle).toBe('none');
  });

  it('is there without a photo too, as the frame has the same border', async () => {
    const element = await mount();
    expect(getComputedStyle(element, '::after').borderTopWidth).toBe(resolved('width', '--nph-border-width'));
  });

  it('does not change the frame size', async () => {
    const element = await mount({ size: 'sm' });
    expect(element.getBoundingClientRect().width).toBe(Number.parseFloat(resolved('width', '--nph-avatar-size-sm')));
  });
});

describe('semantics and focus', () => {
  it('without a label, the host is decorative: aria-hidden, no role, no aria-label', async () => {
    const element = await mount();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.hasAttribute('aria-label')).toBe(false);
  });

  it('a label with only spaces is decorative too', async () => {
    const element = await mount({ label: '   ' });
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.hasAttribute('aria-label')).toBe(false);
  });

  it('with a label, the host is an image with that name and is not hidden', async () => {
    const element = await mount({ label: '  Ana Souza  ' });
    expect(element.getAttribute('role')).toBe('img');
    expect(element.getAttribute('aria-label')).toBe('Ana Souza');
    expect(element.hasAttribute('aria-hidden')).toBe(false);
  });

  it('switches between decorative and named without re-creating the element', async () => {
    const element = await mount();
    const same = element;
    element.label = 'Ana';
    await element.updateComplete;
    expect([element.getAttribute('role'), element.getAttribute('aria-label'), element.hasAttribute('aria-hidden')]).toEqual(['img', 'Ana', false]);
    element.label = 'Bruno';
    await element.updateComplete;
    expect(element.getAttribute('aria-label')).toBe('Bruno');
    element.label = '';
    await element.updateComplete;
    expect([element.getAttribute('role'), element.hasAttribute('aria-label'), element.getAttribute('aria-hidden')]).toEqual([null, false, 'true']);
    expect(document.body.contains(same)).toBe(true);
    expect(same).toBe(element);
  });

  it('the semantics are the same with and without a photo', async () => {
    const element = await mount({ src: PHOTO, label: 'Ana' });
    expect(element.getAttribute('role')).toBe('img');
    expect(element.hasAttribute('aria-hidden')).toBe(false);
  });

  it('never takes focus: focus() changes nothing and there is no tabindex', async () => {
    const element = await mount({ label: 'Ana', src: PHOTO });
    const before = document.activeElement;
    element.focus();
    expect(document.activeElement).toBe(before);
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(element.shadowRoot?.querySelector('[tabindex]')).toBeNull();
    expect(element.shadowRoot?.delegatesFocus).toBe(false);
  });
});

describe('invalid input', () => {
  it('an unknown size: nothing drawn, 0x0, no rendered mark and one console.error', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = document.createElement('nph-avatar');
    element.setAttribute('size', 'circle');
    document.body.append(element);
    await element.updateComplete;
    const box = element.getBoundingClientRect();
    expect([box.width, box.height]).toEqual([0, 0]);
    expect(element.hasAttribute('data-nph-rendered')).toBe(false);
    expect(getComputedStyle(element).display).toBe('none');
    expect(icon(element)).toBeNull();
    expect(photo(element)).toBeNull();
    expect(error).toHaveBeenCalledTimes(1);
    expect(String(error.mock.calls[0]?.[0])).toContain('[nph-avatar]');
  });

  it('the error does not repeat when other properties change', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: 'xl' as NphAvatar['size'] });
    element.label = 'Ana';
    element.src = PHOTO;
    await element.updateComplete;
    expect(error).toHaveBeenCalledTimes(1);
  });

  it('an invalid size draws no photo and no icon, even with a src, and stays out of the accessibility tree', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: '' as NphAvatar['size'], src: PHOTO, label: 'Ana' });
    expect(photo(element)).toBeNull();
    expect(icon(element)).toBeNull();
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.hasAttribute('role')).toBe(false);
  });

  it('there is no visual fallback: the size does not turn into sm', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: 'xl' as NphAvatar['size'] });
    expect(element.getBoundingClientRect().width).toBe(0);
  });

  it('a valid size set later draws the avatar, with its semantics', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: 'xl' as NphAvatar['size'], label: 'Ana' });
    element.setAttribute('size', 'lg');
    await element.updateComplete;
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(element.getBoundingClientRect().width).toBe(Number.parseFloat(resolved('width', '--nph-avatar-size-lg')));
    expect(icon(element)).not.toBeNull();
    expect(element.getAttribute('role')).toBe('img');
  });

  it('a photo asked for while invalid is waited for again once the size becomes valid', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const element = await mount({ size: 'xl' as NphAvatar['size'], src: PHOTO });
    element.size = 'md';
    await element.updateComplete;
    expect(icon(element)).not.toBeNull();
    expect(photo(element)?.hidden).toBe(true);
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
  });

  it('no src and no label is a valid input and stays silent', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const element = await mount();
    expect(element.hasAttribute('data-nph-rendered')).toBe(true);
    expect(icon(element)).not.toBeNull();
    expect(error).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('absences', () => {
  it('has no slot and no part', async () => {
    const element = await mount({ src: PHOTO });
    expect(element.shadowRoot?.querySelector('slot')).toBeNull();
    expect(element.shadowRoot?.querySelector('[part]')).toBeNull();
  });

  it('draws no text and no initials', async () => {
    const element = await mount({ label: 'Ana Souza' });
    expect(element.shadowRoot?.textContent?.replace(/\s+/g, '')).toBe('');
  });

  it('does not emit events of its own', async () => {
    const events: string[] = [];
    const element = document.createElement('nph-avatar');
    for (const name of ['nph-change', 'nph-load', 'nph-error', 'load', 'error', 'change']) {
      element.addEventListener(name, () => events.push(name));
    }
    element.src = PHOTO;
    document.body.append(element);
    await element.updateComplete;
    await vi.waitFor(() => expect(photo(element)?.hidden).toBe(false));
    expect(events).toEqual([]);
  });

  it('has no property beyond the three of the contract', () => {
    const element = document.createElement('nph-avatar') as unknown as Record<string, unknown>;
    for (const name of ['shape', 'type', 'name', 'initials', 'alt', 'disabled', 'variant']) {
      expect(name in element, name).toBe(false);
    }
  });
});

describe('contrast, measured', () => {
  for (const scheme of ['light', 'dark'] as const) {
    it(`${scheme}: the person icon on color/muted is at least 3:1, in every brand`, async () => {
      for (const brand of BRANDS) {
        const part = scope(brand, scheme);
        const element = await mount({}, part);
        const frame = getComputedStyle(element).backgroundColor;
        const drawing = getComputedStyle(icon(element) as HTMLElement).color;
        expect(contrast(drawing, frame), `${scheme} ${brand}`).toBeGreaterThanOrEqual(3);
        part.remove();
      }
    });
  }
});

describe('layout in a container', () => {
  it('keeps its exact size in a row flex container and does not shrink in a narrow one', async () => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; inline-size: 10px;';
    document.body.append(row);
    const element = await mount({ size: 'lg' }, row);
    const box = element.getBoundingClientRect();
    const side = Number.parseFloat(resolved('width', '--nph-avatar-size-lg'));
    expect([box.width, box.height]).toEqual([side, side]);
    const style = getComputedStyle(element);
    expect([style.flexGrow, style.flexShrink]).toEqual(['0', '0']);
  });

  it('keeps its exact size next to a long text in a flex container', async () => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; align-items: center; inline-size: 120px;';
    const text = document.createElement('span');
    text.textContent = 'A very long name that wants all the room it can get';
    row.append(text);
    document.body.append(row);
    const element = await mount({ size: 'sm' }, row);
    expect(element.getBoundingClientRect().width).toBe(Number.parseFloat(resolved('width', '--nph-avatar-size-sm')));
  });

  it('a group of avatars sums up to exactly the sizes of its boxes', async () => {
    const row = document.createElement('div');
    row.style.cssText = 'display: inline-flex;';
    document.body.append(row);
    for (const size of NPH_AVATAR_SIZES) {
      await mount({ size }, row);
    }
    expect(row.getBoundingClientRect().width).toBe(24 + 32 + 40);
  });
});

describe('token contract', () => {
  const cssWithoutComments = componentCss.replace(/\/\*[\s\S]*?\*\//g, '');

  it('every custom property in the CSS exists in tokens.css, and these are the ones the contract names', () => {
    const used = [...cssWithoutComments.matchAll(/var\((--nph-[a-z0-9-]+)\)/g)].map((match) => match[1]);
    expect(new Set(used)).toEqual(
      new Set([
        '--nph-avatar-size-sm',
        '--nph-avatar-size-md',
        '--nph-avatar-size-lg',
        '--nph-avatar-radius-sm',
        '--nph-avatar-radius-md',
        '--nph-avatar-radius-lg',
        '--nph-color-muted',
        '--nph-color-muted-foreground',
        '--nph-color-border',
        '--nph-border-width',
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
    /* `100%` is the one box relation written: the photo fills the frame. */
    const withoutRelation = cssWithoutComments.replace(/\b100%/g, '');
    expect(withoutRelation).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(withoutRelation).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/i);
    expect(withoutRelation).not.toMatch(/\d(px|rem|em|ms|s|deg|turn|%)/);
    expect(withoutRelation).not.toMatch(/\b(animation|transition|@keyframes)\b/);
  });

  it('is still: no animation and no transition computed', async () => {
    const element = await mount();
    const style = getComputedStyle(element);
    expect(style.animationName).toBe('none');
    expect(style.transitionDuration).toBe('0s');
  });

  it('design.md keeps the avatar tokens and says the avatar is never a circle', () => {
    expect(designMd).toContain('tokens_avatar:');
    expect(designMd).toMatch(/never a circle/);
  });
});
