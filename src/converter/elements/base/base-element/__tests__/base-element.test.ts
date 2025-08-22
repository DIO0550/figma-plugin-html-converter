import { describe, it, expect } from 'vitest';
import type { BaseElement } from '..';

describe('BaseElement', () => {
  it('should be a valid BaseElement interface', () => {
    const divElement: BaseElement<'div'> = {
      type: 'element',
      tagName: 'div',
      children: []
    };

    expect(divElement.type).toBe('element');
    expect(divElement.tagName).toBe('div');
    expect(divElement.children).toEqual([]);
  });

  it('should allow children property to be optional', () => {
    const imgElement: BaseElement<'img'> = {
      type: 'element',
      tagName: 'img'
    };

    expect(imgElement.type).toBe('element');
    expect(imgElement.tagName).toBe('img');
    expect(imgElement.children).toBeUndefined();
  });

  it('should enforce specific tagName type', () => {
    const pElement: BaseElement<'p'> = {
      type: 'element',
      tagName: 'p'
    };

    expect(pElement.tagName).toBe('p');
  });

  it('should support nested elements', () => {
    const spanElement: BaseElement<'span'> = {
      type: 'element',
      tagName: 'span'
    };

    const divElement: BaseElement<'div'> = {
      type: 'element',
      tagName: 'div',
      children: [spanElement as unknown]
    };

    expect(divElement.children).toHaveLength(1);
    expect((divElement.children![0] as BaseElement<'span'>).tagName).toBe('span');
  });
});