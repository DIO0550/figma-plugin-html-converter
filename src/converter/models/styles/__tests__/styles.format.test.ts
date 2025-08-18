import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.toString: Stylesを文字列に変換できる', () => {
    const styles = Styles.from({ color: 'red', background: 'blue' });
    const str = Styles.toString(styles);
    expect(str).toBe('color: red; background: blue');
});

test('Styles.toString: 空のStylesを空文字列に変換する', () => {
    const styles = Styles.empty();
    const str = Styles.toString(styles);
    expect(str).toBe('');
});

test('Styles.toString: 単一のプロパティを正しく変換する', () => {
  const styles = Styles.from({ display: 'flex' });
  expect(Styles.toString(styles)).toBe('display: flex');
});

test('Styles.toString: 特殊文字を含むプロパティを正しく変換する', () => {
  const styles = Styles.from({ 
    'font-family': 'Arial, sans-serif',
    'background-image': 'url("image.png")' 
  });
  const str = Styles.toString(styles);
  expect(str).toContain('font-family: Arial, sans-serif');
  expect(str).toContain('background-image: url("image.png")');
});