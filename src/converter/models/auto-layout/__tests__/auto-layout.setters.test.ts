import { it, expect } from 'vitest';
import { AutoLayoutProperties } from '../auto-layout';

it('レイアウトモードを設定できる', () => {
  const initial = AutoLayoutProperties.empty();
  const updated = AutoLayoutProperties.setLayoutMode(initial, 'VERTICAL');
  
  expect(updated.layoutMode).toBe('VERTICAL');
});

it('プライマリ軸の配置を設定できる', () => {
  const initial = AutoLayoutProperties.empty();
  const updated = AutoLayoutProperties.setPrimaryAxisAlign(initial, 'SPACE_BETWEEN');
  
  expect(updated.primaryAxisAlignItems).toBe('SPACE_BETWEEN');
});

it('カウンター軸の配置を設定できる', () => {
  const initial = AutoLayoutProperties.empty();
  const updated = AutoLayoutProperties.setCounterAxisAlign(initial, 'CENTER');
  
  expect(updated.counterAxisAlignItems).toBe('CENTER');
});

it('アイテム間隔を設定できる', () => {
  const initial = AutoLayoutProperties.empty();
  const updated = AutoLayoutProperties.setItemSpacing(initial, 24);
  
  expect(updated.itemSpacing).toBe(24);
});

it('paddingを設定できる', () => {
  const initial = AutoLayoutProperties.empty();
  const updated = AutoLayoutProperties.setPadding(initial, {
    top: 10,
    right: 20,
    bottom: 30,
    left: 40
  });
  
  expect(updated.paddingTop).toBe(10);
  expect(updated.paddingRight).toBe(20);
  expect(updated.paddingBottom).toBe(30);
  expect(updated.paddingLeft).toBe(40);
});

it('部分的なpaddingを設定できる', () => {
  const initial = AutoLayoutProperties.from({
    layoutMode: 'HORIZONTAL',
    primaryAxisAlignItems: 'MIN',
    counterAxisAlignItems: 'MIN',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    itemSpacing: 0
  });
  
  const updated = AutoLayoutProperties.setPadding(initial, {
    top: 20,
    bottom: 20
  });
  
  expect(updated.paddingTop).toBe(20);
  expect(updated.paddingBottom).toBe(20);
  expect(updated.paddingLeft).toBe(10); // 変更されない
  expect(updated.paddingRight).toBe(10); // 変更されない
});