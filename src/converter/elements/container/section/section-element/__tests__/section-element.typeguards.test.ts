import { test, expect } from 'vitest';
import { SectionElement } from '../section-element';

test('[SectionElement.isSectionElement] 正しいsection要素を識別できる', () => {
    const element = {
      type: 'element',
      tagName: 'section',
      attributes: {},
      children: []
    };
    
    expect(SectionElement.isSectionElement(element)).toBe(true);
  });

test('[SectionElement.isSectionElement] 異なるtagNameの要素を識別できる', () => {
    const element = {
      type: 'element',
      tagName: 'div',
      attributes: {},
      children: []
    };
    
    expect(SectionElement.isSectionElement(element)).toBe(false);
  });

test('[SectionElement.isSectionElement] 異なるtypeのノードを識別できる', () => {
    const element = {
      type: 'text',
      content: 'text'
    };
    
    expect(SectionElement.isSectionElement(element)).toBe(false);
  });

test('[SectionElement.isSectionElement] nullを正しく処理できる', () => {
    expect(SectionElement.isSectionElement(null)).toBe(false);
  });

test('[SectionElement.isSectionElement] undefinedを正しく処理できる', () => {
    expect(SectionElement.isSectionElement(undefined)).toBe(false);
  });

test('[SectionElement.isSectionElement] 空のオブジェクトを正しく処理できる', () => {
    expect(SectionElement.isSectionElement({})).toBe(false);
});