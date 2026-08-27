/**
 * Prova da moldura das stories do `nph-icon`.
 *
 * O componente tem o proprio teste em `nph-icon.test.ts`. Aqui se prova o que
 * a vitrine promete: o indice de categorias nao pode divergir do nucleo, e a
 * busca da galeria nao pode revelar nada fora dele.
 */
import { describe, expect, it } from 'vitest';

import { CATEGORIAS, TOTAL_DO_NUCLEO, filtrarNomes } from './nph-icon.demo';
import { NPH_ICON_NAMES } from './nph-icon.icons';

const DAS_CATEGORIAS = CATEGORIAS.flatMap((categoria) => [...categoria]);

describe('indice de categorias', () => {
  it('cobre exatamente o mesmo conjunto de NPH_ICON_NAMES', () => {
    expect([...DAS_CATEGORIAS].sort()).toEqual([...NPH_ICON_NAMES].sort());
  });

  it('nao repete nenhum nome', () => {
    expect(new Set(DAS_CATEGORIAS).size).toBe(DAS_CATEGORIAS.length);
  });

  it('a soma das categorias e o total do nucleo', () => {
    const soma = CATEGORIAS.reduce((total, categoria) => total + categoria.length, 0);
    expect(soma).toBe(TOTAL_DO_NUCLEO);
    expect(TOTAL_DO_NUCLEO).toBe(34);
  });
});

describe('busca da galeria', () => {
  it('busca vazia devolve o nucleo inteiro', () => {
    for (const termo of ['', ' ', '   \t ']) {
      expect(filtrarNomes(NPH_ICON_NAMES, termo), JSON.stringify(termo)).toEqual([
        ...NPH_ICON_NAMES,
      ]);
    }
  });

  it('busca sem correspondencia devolve lista vazia', () => {
    for (const termo of ['rocket', 'zzz', 'fa-star']) {
      expect(filtrarNomes(NPH_ICON_NAMES, termo), termo).toEqual([]);
    }
  });

  it('nao diferencia maiusculas nem espaco em volta', () => {
    const esperado = filtrarNomes(NPH_ICON_NAMES, 'chevron');
    expect(esperado.length).toBeGreaterThan(0);
    for (const termo of ['CHEVRON', 'Chevron', '  chevron  ', ' ChEvRoN ']) {
      expect(filtrarNomes(NPH_ICON_NAMES, termo), termo).toEqual(esperado);
    }
  });

  it('o resultado e sempre subconjunto do nucleo', () => {
    const nucleo = new Set<string>(NPH_ICON_NAMES);
    for (const termo of ['', 'a', 'circle', 'star', 'e', '-', 'x']) {
      for (const nome of filtrarNomes(NPH_ICON_NAMES, termo)) {
        expect(nucleo.has(nome), `${termo} -> ${nome}`).toBe(true);
      }
    }
  });

  it('preserva a ordem do nucleo', () => {
    const resultado = filtrarNomes(NPH_ICON_NAMES, 'arrow');
    const ordemNoNucleo = NPH_ICON_NAMES.filter((nome) => resultado.includes(nome));
    expect(resultado).toEqual([...ordemNoNucleo]);
  });

  it('nao devolve a mesma referencia da lista de origem', () => {
    expect(filtrarNomes(NPH_ICON_NAMES, '')).not.toBe(NPH_ICON_NAMES);
  });
});
