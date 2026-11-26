/**
 * Tests of the part `nph-collapsible` shares with every block that grows in place (DSA-98).
 *
 * What this file proves: the phase machine of P121 (`closed`, `opening`, `open`, `closing`), the reading of
 * the time the browser resolved, the end of the growth, and that both pieces that grow a block in place
 * (`nph-collapsible` and the panel menu of `nph-sidebar`) import this part and draw the same growth.
 * The behavior of each piece on top of it is proved in its own test.
 */
import { describe, expect, it } from 'vitest';

import '../../tokens/generated/tokens.css';
import disclosureCss from './nph-collapsible.disclosure.css?raw';
import {
  DISCLOSURE_GROWTH_PROPERTY,
  DISCLOSURE_SETTLE_MARGIN,
  endsGrowth,
  growthDuration,
  growthEasing,
  isMoving,
  longestDuration,
  phaseFor,
  settleDelay,
  settledPhase,
  steadyPhase,
} from './nph-collapsible.disclosure';
import { NphCollapsible } from './nph-collapsible';
import '../nph-sidebar/nph-sidebar';
import { NphSidebar } from '../nph-sidebar/nph-sidebar';

describe('the phases of a block that grows in place', () => {
  it('a block that is not moving is open or closed', () => {
    expect(steadyPhase(true)).toBe('open');
    expect(steadyPhase(false)).toBe('closed');
  });

  it('a block asked to open or close moves only when the browser resolved a time', () => {
    expect(phaseFor(true, 250)).toBe('opening');
    expect(phaseFor(false, 250)).toBe('closing');
    expect(phaseFor(true, 0)).toBe('open');
    expect(phaseFor(false, 0)).toBe('closed');
    expect(phaseFor(true, Number.NaN)).toBe('open');
  });

  it('the growth ends in the steady phase of its direction; a steady phase stays', () => {
    expect(settledPhase('opening')).toBe('open');
    expect(settledPhase('closing')).toBe('closed');
    expect(settledPhase('open')).toBe('open');
    expect(settledPhase('closed')).toBe('closed');
  });

  it('only opening and closing are moving', () => {
    expect(['closed', 'opening', 'open', 'closing'].map((phase) => isMoving(phase as Parameters<typeof isMoving>[0]))).toEqual([false, true, false, true]);
  });
});

describe('the time of the growth', () => {
  it('reads seconds and milliseconds, and the longest of a list', () => {
    expect(longestDuration('0.25s')).toBe(250);
    expect(longestDuration('250ms')).toBe(250);
    expect(longestDuration('0s, 0.3s')).toBe(300);
    expect(longestDuration('0s')).toBe(0);
    expect(longestDuration('')).toBe(0);
    expect(longestDuration('auto')).toBe(0);
  });

  it('a missing block has no time, and the safety net waits the time plus a margin', () => {
    expect(growthDuration(null)).toBe(0);
    expect(settleDelay(null)).toBe(DISCLOSURE_SETTLE_MARGIN);
  });

  it('reads the time and the first curve from the style the browser resolved', () => {
    const block = document.createElement('div');
    block.style.transitionDuration = '0.2s, 0.4s';
    block.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1), linear';
    document.body.append(block);
    expect(growthDuration(block)).toBe(400);
    expect(settleDelay(block)).toBe(400 + DISCLOSURE_SETTLE_MARGIN);
    expect(growthEasing(block)).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    block.remove();
  });
});

describe('the end of the growth', () => {
  it('is the transition of the rows of the block itself, not one of something inside it', () => {
    const block = document.createElement('div');
    const inside = document.createElement('span');
    block.append(inside);
    const seen: boolean[] = [];
    block.addEventListener('transitionend', (event) => seen.push(endsGrowth(event)));
    inside.dispatchEvent(new TransitionEvent('transitionend', { propertyName: DISCLOSURE_GROWTH_PROPERTY, bubbles: true }));
    block.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'opacity' }));
    block.dispatchEvent(new TransitionEvent('transitionend', { propertyName: DISCLOSURE_GROWTH_PROPERTY }));
    expect(seen).toEqual([false, false, true]);
  });
});

describe('the shared style', () => {
  it('animates only the rows of the grid, reading collapsible/expand-* and nothing of the panel menu', () => {
    const css = disclosureCss.replace(/\/\*[\s\S]*?\*\//g, '');
    expect([...css.matchAll(/transition-property:\s*([^;]+);/g)].map((match) => (match[1] ?? '').trim())).toEqual(['grid-template-rows']);
    expect(css).toContain('var(--nph-collapsible-expand-duration)');
    expect(css).toContain('var(--nph-collapsible-expand-easing)');
    expect(css).not.toMatch(/panel-menu/);
    expect(css).not.toMatch(/--nph-core-|--nph-theme-/);
    expect(css).not.toMatch(/\d+(\.\d+)?(px|rem|em|ms|s|vh|vw)\b/);
  });

  it('opens and closes at once with reduced motion', () => {
    const reduced = /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\[data-disclosure\]\s*\{\s*transition:\s*none;/;
    expect(disclosureCss).toMatch(reduced);
  });

  it('both pieces that grow a block in place carry the shared style, ahead of their own', () => {
    for (const piece of [NphCollapsible, NphSidebar]) {
      const styles = piece.styles as readonly { cssText: string }[];
      expect(styles).toHaveLength(2);
      expect(styles[0]?.cssText, piece.name).toContain('[data-disclosure]');
      expect(styles[1]?.cssText, piece.name).not.toContain('[data-disclosure]');
    }
  });
});
