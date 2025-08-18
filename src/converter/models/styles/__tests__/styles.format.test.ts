import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles.toString', () => {
  test('Stylesを文字列に変換できる', () => {
    const styles = Styles.from({ color: 'red', background: 'blue' });
    const str = Styles.toString(styles);
    expect(str).toBe('color: red; background: blue');
  });

  test('空のStylesを空文字列に変換する', () => {
    const styles = Styles.empty();
    const str = Styles.toString(styles);
    expect(str).toBe('');
  });
});