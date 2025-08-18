import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles.parse', () => {
  test('単一のスタイルをパースできる', () => {
    const styles = Styles.parse('color: red');
    expect(styles).toEqual({ color: 'red' });
  });

  test('複数のスタイルをパースできる', () => {
    const styles = Styles.parse('color: red; background: blue; margin: 10px');
    expect(styles).toEqual({
      color: 'red',
      background: 'blue',
      margin: '10px'
    });
  });

  test('前後の空白を処理できる', () => {
    const styles = Styles.parse('  color  :  red  ;  background  :  blue  ');
    expect(styles).toEqual({
      color: 'red',
      background: 'blue'
    });
  });

  test('空文字列から空のStylesを作成する', () => {
    const styles = Styles.parse('');
    expect(styles).toEqual({});
    expect(Styles.isEmpty(styles)).toBe(true);
  });

  test('セミコロンのみの文字列を処理できる', () => {
    const styles = Styles.parse(';;;');
    expect(styles).toEqual({});
  });
});