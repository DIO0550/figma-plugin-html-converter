import { it, expect } from 'vitest';
import { AutoLayoutProperties } from '../auto-layout';

it('空のAutoLayoutプロパティを作成できる', () => {
  const properties = AutoLayoutProperties.empty();
  
  expect(properties).toEqual({
    layoutMode: 'HORIZONTAL',
    primaryAxisAlignItems: 'MIN',
    counterAxisAlignItems: 'MIN',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0
  });
});

it('オブジェクトからプロパティを作成できる', () => {
  const properties = AutoLayoutProperties.from({
    layoutMode: 'VERTICAL',
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'MAX',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    itemSpacing: 15
  });
  
  expect(properties.layoutMode).toBe('VERTICAL');
  expect(properties.primaryAxisAlignItems).toBe('CENTER');
  expect(properties.counterAxisAlignItems).toBe('MAX');
  expect(properties.itemSpacing).toBe(15);
});