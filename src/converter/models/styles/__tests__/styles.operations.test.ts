import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.get: スタイルプロパティを取得できる', () => {
  const styles = Styles.from({ color: 'red', background: 'blue' });
  expect(Styles.get(styles, 'color')).toBe('red');
  expect(Styles.get(styles, 'background')).toBe('blue');
  expect(Styles.get(styles, 'margin')).toBeUndefined();
});

test('Styles.get: 空のStylesからundefinedを返す', () => {
  const styles = Styles.empty();
  expect(Styles.get(styles, 'color')).toBeUndefined();
});

test('Styles.get: 存在しないプロパティからundefinedを返す', () => {
  const styles = Styles.from({ background: 'blue' });
  expect(Styles.get(styles, 'color')).toBeUndefined();
  expect(Styles.get(styles, 'border')).toBeUndefined();
});

test('Styles.set: スタイルプロパティを設定できる', () => {
  const styles = Styles.empty();
  const updated = Styles.set(styles, 'color', 'red');
  expect(updated.color).toBe('red');
});

test('Styles.set: 既存のプロパティを上書きできる', () => {
  const styles = Styles.from({ color: 'red' });
  const updated = Styles.set(styles, 'color', 'blue');
  expect(updated.color).toBe('blue');
});

test('Styles.set: nullやundefinedの値を設定できる', () => {
  const styles = Styles.empty();
  const updated1 = Styles.set(styles, 'color', null as any);
  const updated2 = Styles.set(styles, 'background', undefined as any);
  expect(updated1.color).toBeNull();
  expect(updated2.background).toBeUndefined();
});

test('Styles.remove: スタイルプロパティを削除できる', () => {
  const styles = Styles.from({ color: 'red', background: 'blue' });
  const updated = Styles.remove(styles, 'color');
  expect(updated).toEqual({ background: 'blue' });
});

test('Styles.remove: 存在しないプロパティを削除しても変化しない', () => {
  const styles = Styles.from({ color: 'red' });
  const updated = Styles.remove(styles, 'background');
  expect(updated).toEqual({ color: 'red' });
});

test('Styles.remove: 空のStylesから削除しても空のまま', () => {
  const styles = Styles.empty();
  const updated = Styles.remove(styles, 'color');
  expect(updated).toEqual({});
});

test('Styles.merge: Stylesをマージできる', () => {
  const base = Styles.from({ color: 'red', margin: '10px' });
  const override = Styles.from({ color: 'blue', padding: '5px' });
  const merged = Styles.merge(base, override);
  expect(merged).toEqual({
    color: 'blue',
    margin: '10px',
    padding: '5px'
  });
});

test('Styles.merge: 空のStylesとマージできる', () => {
  const styles = Styles.from({ color: 'red' });
  const empty = Styles.empty();
  expect(Styles.merge(styles, empty)).toEqual({ color: 'red' });
  expect(Styles.merge(empty, styles)).toEqual({ color: 'red' });
});

test('Styles.merge: 複数のプロパティを正しくマージする', () => {
  const styles1 = Styles.from({ color: 'red', margin: '10px', padding: '5px' });
  const styles2 = Styles.from({ color: 'blue', border: '1px solid black' });
  const merged = Styles.merge(styles1, styles2);
  expect(merged).toEqual({ 
    color: 'blue',  // overridden
    margin: '10px',
    padding: '5px',
    border: '1px solid black'
  });
});