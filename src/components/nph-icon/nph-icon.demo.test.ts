/**
 * Prova da moldura das stories do `nph-icon`.
 *
 * O componente tem o proprio teste em `nph-icon.test.ts`. Aqui se prova o que
 * a vitrine promete: o indice de categorias nao pode divergir do nucleo, e a
 * busca da galeria nao pode revelar nada fora dele.
 */
import { describe, expect, it } from 'vitest';

import { CATEGORIES, CORE_TOTAL, filterNames } from './nph-icon.demo';
import { NPH_ICON_NAMES } from './nph-icon.icons';

const FROM_CATEGORIES = CATEGORIES.flatMap((category) => [...category]);

describe('indice de categorias', () => {
  it('cobre exatamente o mesmo conjunto de NPH_ICON_NAMES', () => {
    expect([...FROM_CATEGORIES].sort()).toEqual([...NPH_ICON_NAMES].sort());
  });

  it('nao repete nenhum nome', () => {
    expect(new Set(FROM_CATEGORIES).size).toBe(FROM_CATEGORIES.length);
  });

  it('a soma das categorias e o total do nucleo', () => {
    const sum = CATEGORIES.reduce((total, category) => total + category.length, 0);
    expect(sum).toBe(CORE_TOTAL);
    expect(CORE_TOTAL).toBe(new Set(NPH_ICON_NAMES).size);
  });
});

describe('busca da galeria', () => {
  it('busca vazia devolve o nucleo inteiro', () => {
    for (const term of ['', ' ', '   \t ']) {
      expect(filterNames(NPH_ICON_NAMES, term), JSON.stringify(term)).toEqual([
        ...NPH_ICON_NAMES,
      ]);
    }
  });

  it('busca sem correspondencia devolve lista vazia', () => {
    for (const term of ['rocket', 'zzz', 'fa-star']) {
      expect(filterNames(NPH_ICON_NAMES, term), term).toEqual([]);
    }
  });

  it('nao diferencia maiusculas nem espaco em volta', () => {
    const expected = filterNames(NPH_ICON_NAMES, 'chevron');
    expect(expected.length).toBeGreaterThan(0);
    for (const term of ['CHEVRON', 'Chevron', '  chevron  ', ' ChEvRoN ']) {
      expect(filterNames(NPH_ICON_NAMES, term), term).toEqual(expected);
    }
  });

  it('o resultado e sempre subconjunto do nucleo', () => {
    const core = new Set<string>(NPH_ICON_NAMES);
    for (const term of ['', 'a', 'circle', 'star', 'e', '-', 'x']) {
      for (const name of filterNames(NPH_ICON_NAMES, term)) {
        expect(core.has(name), `${term} -> ${name}`).toBe(true);
      }
    }
  });

  it('preserva a ordem do nucleo', () => {
    const result = filterNames(NPH_ICON_NAMES, 'arrow');
    const coreOrder = NPH_ICON_NAMES.filter((name) => result.includes(name));
    expect(result).toEqual([...coreOrder]);
  });

  it('nao devolve a mesma referencia da lista de origem', () => {
    expect(filterNames(NPH_ICON_NAMES, '')).not.toBe(NPH_ICON_NAMES);
  });
});
