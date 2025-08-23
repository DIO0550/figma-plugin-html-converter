import { test, expect } from 'vitest';
import type { SectionAttributes } from '../section-attributes';

test('[SectionAttributes] GlobalAttributesを継承している', () => {
    const attributes: SectionAttributes = {
      id: 'test-section',
      class: 'content-section',
      style: 'padding: 20px;',
      'data-section': 'main',
      'aria-label': 'Main content section'
    };
    
    expect(attributes.id).toBe('test-section');
    expect(attributes.class).toBe('content-section');
    expect(attributes.style).toBe('padding: 20px;');
    expect(attributes['data-section']).toBe('main');
    expect(attributes['aria-label']).toBe('Main content section');
  });

test('[SectionAttributes] 任意のHTML属性を受け入れる', () => {
    const attributes: SectionAttributes = {
      role: 'main',
      tabindex: '0',
      hidden: 'true',
      lang: 'ja',
      dir: 'ltr'
    };
    
    expect(attributes.role).toBe('main');
    expect(attributes.tabindex).toBe('0');
    expect(attributes.hidden).toBe('true');
    expect(attributes.lang).toBe('ja');
    expect(attributes.dir).toBe('ltr');
});