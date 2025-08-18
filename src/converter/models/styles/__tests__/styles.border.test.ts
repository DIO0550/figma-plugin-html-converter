import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles.parseBorder', () => {
  test('完全なボーダー定義をパースできる', () => {
    const border = Styles.parseBorder('2px solid red');
    expect(border).toEqual({
      width: 2,
      style: 'solid',
      color: { r: 1, g: 0, b: 0 }
    });
  });

  test('順序が異なるボーダー定義をパースできる', () => {
    const border = Styles.parseBorder('solid 3px #00ff00');
    expect(border).toEqual({
      width: 3,
      style: 'solid',
      color: { r: 0, g: 1, b: 0 }
    });
  });

  test('一部のプロパティのみのボーダーをパースできる', () => {
    const border = Styles.parseBorder('1px');
    expect(border).toEqual({
      width: 1,
      style: 'solid',
      color: { r: 0, g: 0, b: 0 }
    });
  });
});