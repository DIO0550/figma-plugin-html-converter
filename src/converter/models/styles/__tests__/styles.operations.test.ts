import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles Operations', () => {
  describe('get/set/remove', () => {
    test('スタイルプロパティを取得できる', () => {
      const styles = Styles.from({ color: 'red', background: 'blue' });
      expect(Styles.get(styles, 'color')).toBe('red');
      expect(Styles.get(styles, 'background')).toBe('blue');
      expect(Styles.get(styles, 'margin')).toBeUndefined();
    });

    test('スタイルプロパティを設定できる', () => {
      const styles = Styles.empty();
      const updated = Styles.set(styles, 'color', 'red');
      expect(updated.color).toBe('red');
    });

    test('スタイルプロパティを削除できる', () => {
      const styles = Styles.from({ color: 'red', background: 'blue' });
      const updated = Styles.remove(styles, 'color');
      expect(updated).toEqual({ background: 'blue' });
    });
  });

  describe('merge', () => {
    test('Stylesをマージできる', () => {
      const base = Styles.from({ color: 'red', margin: '10px' });
      const override = Styles.from({ color: 'blue', padding: '5px' });
      const merged = Styles.merge(base, override);
      expect(merged).toEqual({
        color: 'blue',
        margin: '10px',
        padding: '5px'
      });
    });
  });
});