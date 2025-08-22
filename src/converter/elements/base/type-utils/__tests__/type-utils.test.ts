import { describe, it, expect } from 'vitest';
import type { 
  ExtractTagName,
  IsVoidElement,
  ElementChildren,
  StrictAttributes
} from '..';
import type { BaseElement } from '../../base-element';

describe('Type Utilities', () => {
  describe('ExtractTagName', () => {
    it('should extract tagName from BaseElement', () => {
      type DivElement = BaseElement<'div'>;
      type TagName = ExtractTagName<DivElement>;
      
      const tagName: TagName = 'div';
      expect(tagName).toBe('div');
    });
  });

  describe('IsVoidElement', () => {
    it('should identify void elements', () => {
      type ImgVoid = IsVoidElement<'img'>;
      type DivVoid = IsVoidElement<'div'>;
      type InputVoid = IsVoidElement<'input'>;
      type BrVoid = IsVoidElement<'br'>;
      type HrVoid = IsVoidElement<'hr'>;
      
      const imgVoid: ImgVoid = true;
      const divVoid: DivVoid = false;
      const inputVoid: InputVoid = true;
      const brVoid: BrVoid = true;
      const hrVoid: HrVoid = true;
      
      expect(imgVoid).toBe(true);
      expect(divVoid).toBe(false);
      expect(inputVoid).toBe(true);
      expect(brVoid).toBe(true);
      expect(hrVoid).toBe(true);
    });
  });

  describe('ElementChildren', () => {
    it('should determine children type based on element', () => {
      type ImgChildren = ElementChildren<'img'>;
      type DivChildren = ElementChildren<'div'>;
      
      const imgChildren: ImgChildren = undefined;
      const divChildren: DivChildren = [];
      
      expect(imgChildren).toBeUndefined();
      expect(divChildren).toEqual([]);
    });
  });

  describe('StrictAttributes', () => {
    it('should merge element-specific attributes with global attributes', () => {
      interface DivSpecificAttributes {
        align?: 'left' | 'center' | 'right';
      }
      
      type DivAttributes = StrictAttributes<DivSpecificAttributes>;
      
      const attributes: DivAttributes = {
        id: 'test',
        className: 'container',
        align: 'center',
        'data-test': 'value',
        'aria-label': 'Container'
      };
      
      expect(attributes.id).toBe('test');
      expect(attributes.className).toBe('container');
      expect(attributes.align).toBe('center');
      expect(attributes['data-test']).toBe('value');
      expect(attributes['aria-label']).toBe('Container');
    });
  });

  describe('Type Guards', () => {
    it('should provide type guard utilities', () => {
      const isString = (value: unknown): value is string => {
        return typeof value === 'string';
      };
      
      const isNumber = (value: unknown): value is number => {
        return typeof value === 'number';
      };
      
      expect(isString('test')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isNumber(123)).toBe(true);
      expect(isNumber('test')).toBe(false);
    });
  });
});