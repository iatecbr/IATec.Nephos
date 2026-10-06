/**
 * Proof of the `nph-icon` stories frame.
 *
 * The component has its own test in `nph-icon.test.ts`. Here we prove what
 * the showcase promises: the category index cannot diverge from the core, and
 * the gallery search cannot reveal anything outside it.
 */
import { describe, expect, it } from 'vitest';

import { CATEGORIES, CORE_TOTAL, filterNames } from './nph-icon.demo';
import { NPH_ICON_NAMES } from './nph-icon.icons';

const FROM_CATEGORIES = CATEGORIES.flatMap((category) => [...category]);

describe('category index', () => {
  it('covers exactly the same set as NPH_ICON_NAMES', () => {
    expect([...FROM_CATEGORIES].sort()).toEqual([...NPH_ICON_NAMES].sort());
  });

  it('repeats no name', () => {
    expect(new Set(FROM_CATEGORIES).size).toBe(FROM_CATEGORIES.length);
  });

  it('the sum of the categories is the core total', () => {
    const sum = CATEGORIES.reduce((total, category) => total + category.length, 0);
    expect(sum).toBe(CORE_TOTAL);
    expect(CORE_TOTAL).toBe(new Set(NPH_ICON_NAMES).size);
  });
});

describe('gallery search', () => {
  it('an empty search returns the whole core', () => {
    for (const term of ['', ' ', '   \t ']) {
      expect(filterNames(NPH_ICON_NAMES, term), JSON.stringify(term)).toEqual([
        ...NPH_ICON_NAMES,
      ]);
    }
  });

  it('a search with no match returns an empty list', () => {
    for (const term of ['rocket', 'zzz', 'fa-star']) {
      expect(filterNames(NPH_ICON_NAMES, term), term).toEqual([]);
    }
  });

  it('ignores letter case and surrounding whitespace', () => {
    const expected = filterNames(NPH_ICON_NAMES, 'chevron');
    expect(expected.length).toBeGreaterThan(0);
    for (const term of ['CHEVRON', 'Chevron', '  chevron  ', ' ChEvRoN ']) {
      expect(filterNames(NPH_ICON_NAMES, term), term).toEqual(expected);
    }
  });

  it('the result is always a subset of the core', () => {
    const core = new Set<string>(NPH_ICON_NAMES);
    for (const term of ['', 'a', 'circle', 'star', 'e', '-', 'x']) {
      for (const name of filterNames(NPH_ICON_NAMES, term)) {
        expect(core.has(name), `${term} -> ${name}`).toBe(true);
      }
    }
  });

  it('preserves the core order', () => {
    const result = filterNames(NPH_ICON_NAMES, 'arrow');
    const coreOrder = NPH_ICON_NAMES.filter((name) => result.includes(name));
    expect(result).toEqual([...coreOrder]);
  });

  it('does not return the same reference as the source list', () => {
    expect(filterNames(NPH_ICON_NAMES, '')).not.toBe(NPH_ICON_NAMES);
  });
});
