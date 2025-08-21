import { describe, it, expect } from 'vitest';
import type { GlobalAttributes } from '..';

describe('GlobalAttributes', () => {
  it('should define common HTML attributes', () => {
    const attributes: GlobalAttributes = {
      id: 'test-id',
      className: 'test-class another-class',
      style: 'color: red; background: blue;',
      title: 'Test Title',
      lang: 'ja',
      dir: 'ltr'
    };

    expect(attributes.id).toBe('test-id');
    expect(attributes.className).toBe('test-class another-class');
    expect(attributes.style).toBe('color: red; background: blue;');
    expect(attributes.title).toBe('Test Title');
    expect(attributes.lang).toBe('ja');
    expect(attributes.dir).toBe('ltr');
  });

  it('should allow all attributes to be optional', () => {
    const emptyAttributes: GlobalAttributes = {};
    
    expect(emptyAttributes).toEqual({});
  });

  it('should support data attributes', () => {
    const attributes: GlobalAttributes = {
      'data-test': 'value',
      'data-id': '123',
      'data-custom-attribute': 'custom-value'
    };

    expect(attributes['data-test']).toBe('value');
    expect(attributes['data-id']).toBe('123');
    expect(attributes['data-custom-attribute']).toBe('custom-value');
  });

  it('should support aria attributes', () => {
    const attributes: GlobalAttributes = {
      'aria-label': 'Button Label',
      'aria-hidden': 'true',
      'aria-describedby': 'description-id',
      'aria-live': 'polite'
    };

    expect(attributes['aria-label']).toBe('Button Label');
    expect(attributes['aria-hidden']).toBe('true');
    expect(attributes['aria-describedby']).toBe('description-id');
    expect(attributes['aria-live']).toBe('polite');
  });

  it('should support event handlers', () => {
    const attributes: GlobalAttributes = {
      onclick: 'handleClick()',
      onmouseover: 'handleMouseOver()',
      onkeydown: 'handleKeyDown(event)'
    };

    expect(attributes.onclick).toBe('handleClick()');
    expect(attributes.onmouseover).toBe('handleMouseOver()');
    expect(attributes.onkeydown).toBe('handleKeyDown(event)');
  });

  it('should support accessibility attributes', () => {
    const attributes: GlobalAttributes = {
      tabindex: '0',
      role: 'button',
      accesskey: 'b'
    };

    expect(attributes.tabindex).toBe('0');
    expect(attributes.role).toBe('button');
    expect(attributes.accesskey).toBe('b');
  });

  it('should support metadata attributes', () => {
    const attributes: GlobalAttributes = {
      hidden: 'true',
      draggable: 'true',
      contenteditable: 'true',
      spellcheck: 'false'
    };

    expect(attributes.hidden).toBe('true');
    expect(attributes.draggable).toBe('true');
    expect(attributes.contenteditable).toBe('true');
    expect(attributes.spellcheck).toBe('false');
  });
});