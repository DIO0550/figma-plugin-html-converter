import { test, expect } from 'vitest';
import { SectionElement } from '../section-element';
import type { SectionAttributes } from '../../section-attributes';

test('[SectionElement.create] 空の属性でsection要素を作成できる', () => {
    const element = SectionElement.create();
    
    expect(element.type).toBe('element');
    expect(element.tagName).toBe('section');
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

test('[SectionElement.create] ID属性を指定してsection要素を作成できる', () => {
    const element = SectionElement.create({ id: 'test-section' });
    
    expect(element.attributes.id).toBe('test-section');
  });

test('[SectionElement.create] class属性を指定してsection要素を作成できる', () => {
    const element = SectionElement.create({ class: 'content-section' });
    
    expect(element.attributes.class).toBe('content-section');
  });

test('[SectionElement.create] style属性を指定してsection要素を作成できる', () => {
    const element = SectionElement.create({ style: 'padding: 20px;' });
    
    expect(element.attributes.style).toBe('padding: 20px;');
  });

test('[SectionElement.create] 複数の属性を含むsection要素を作成できる', () => {
    const attributes: Partial<SectionAttributes> = {
      id: 'main-section',
      class: 'container',
      style: 'margin: 10px;',
      'aria-label': 'Main section',
      'data-section': 'content'
    };
    
    const element = SectionElement.create(attributes);
    
    expect(element.attributes.id).toBe('main-section');
    expect(element.attributes.class).toBe('container');
    expect(element.attributes.style).toBe('margin: 10px;');
    expect(element.attributes['aria-label']).toBe('Main section');
    expect(element.attributes['data-section']).toBe('content');
  });

test('[SectionElement.create] data属性を含むsection要素を作成できる', () => {
    const element = SectionElement.create({
      'data-testid': 'test-section',
      'data-value': '123'
    });
    
    expect(element.attributes['data-testid']).toBe('test-section');
    expect(element.attributes['data-value']).toBe('123');
  });

test('[SectionElement.create] ARIA属性を含むsection要素を作成できる', () => {
    const element = SectionElement.create({
      'aria-label': 'Navigation section',
      'aria-hidden': 'false'
    });
    
    expect(element.attributes['aria-label']).toBe('Navigation section');
    expect(element.attributes['aria-hidden']).toBe('false');
});