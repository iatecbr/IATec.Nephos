/**
 * The part of `nph-collapsible` that every disclosure growing in place shares (DSA-98).
 *
 * Two pieces grow a block in place with this part: the content of the `nph-collapsible` and the block of a
 * group and of a subgroup of the `nph-sidebar` panel menu (P124). The motion exception of `design.md`
 * covers exactly these (DSA-78 D-3, widened by DSA-98): the rows of a grid animate in `collapsible/expand-*`,
 * and with reduced motion the block opens and closes at once.
 *
 * What is shared here is the machine of phases of P121 (`closed`, `opening`, `open`, `closing`) and the
 * reading of the time the browser resolved for the growth. The grid track, the clip and the reduced-motion
 * rule are in `nph-collapsible.disclosure.css`. What stays in each piece is what is its own: where the
 * phase is kept (one field, or one per block), what the block holds, and the attributes that hide it.
 *
 * Internal, not API: nothing here is a property, an attribute, a slot or a part of `nph-collapsible`.
 */

/** Where a block is: steady, open or closed, or growing or shrinking. */
export type DisclosurePhase = 'closed' | 'opening' | 'open' | 'closing';

/** The CSS property the growth animates; the end of the transition of any other property is not the end of the growth. */
export const DISCLOSURE_GROWTH_PROPERTY = 'grid-template-rows';

/** Time, in milliseconds, kept after the resolved duration before the safety net ends the growth by itself. */
export const DISCLOSURE_SETTLE_MARGIN = 50;

/** The longest time of a `transition-duration` value (`0.25s`, `250ms`, `0s, 0.2s`), in milliseconds. */
export function longestDuration(value: string): number {
  let longest = 0;
  for (const part of value.split(',')) {
    const trimmed = part.trim();
    const amount = Number.parseFloat(trimmed);
    if (!Number.isFinite(amount)) continue;
    longest = Math.max(longest, trimmed.endsWith('ms') ? amount : amount * 1000);
  }
  return longest;
}

/** The phase of a block that is not moving. */
export function steadyPhase(open: boolean): DisclosurePhase {
  return open ? 'open' : 'closed';
}

/** The phase of a block that was asked to open or to close: it moves only when the browser resolves a duration. */
export function phaseFor(open: boolean, duration: number): DisclosurePhase {
  if (!(duration > 0)) return steadyPhase(open);
  return open ? 'opening' : 'closing';
}

/** Whether the block is growing or shrinking. */
export function isMoving(phase: DisclosurePhase): boolean {
  return phase === 'opening' || phase === 'closing';
}

/** The growth is over: `opening` becomes `open`, `closing` becomes `closed`, a steady phase stays. */
export function settledPhase(phase: DisclosurePhase): DisclosurePhase {
  if (phase === 'opening') return 'open';
  if (phase === 'closing') return 'closed';
  return phase;
}

/** The time the block takes to grow, from the style the browser resolved: 0 with reduced motion or with no box. */
export function growthDuration(block: Element | null): number {
  return block === null ? 0 : longestDuration(getComputedStyle(block).transitionDuration);
}

/** The curve the block grows with, from the style the browser resolved: the first of the list. */
export function growthEasing(block: Element): string {
  return getComputedStyle(block).transitionTimingFunction.split(/,(?![^(]*\))/)[0]?.trim() ?? 'ease';
}

/** The time after which a safety net ends the growth, since a transition never ends in a box that is not rendered. */
export function settleDelay(block: Element | null): number {
  return growthDuration(block) + DISCLOSURE_SETTLE_MARGIN;
}

/** The end of the growth of the block itself: not the end of a transition of something inside it. */
export function endsGrowth(event: TransitionEvent): boolean {
  return event.target === event.currentTarget && event.propertyName === DISCLOSURE_GROWTH_PROPERTY;
}
