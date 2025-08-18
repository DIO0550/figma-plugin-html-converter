import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles Spacing', () => {
  describe('parsePadding', () => {
    test('単一値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px');
      expect(padding).toEqual({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      });
    });

    test('2値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px 20px');
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
      });
    });

    test('3値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px 20px 30px');
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 20
      });
    });

    test('4値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px 20px 30px 40px');
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 40
      });
    });
  });

  describe('getPadding/getMargin', () => {
    test('getPaddingが動作する', () => {
      const styles = Styles.from({ padding: '10px 20px' });
      const padding = Styles.getPadding(styles);
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
      });
    });

    test('getMarginが動作する', () => {
      const styles = Styles.from({ margin: '5px' });
      const margin = Styles.getMargin(styles);
      expect(margin).toEqual({
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
      });
    });
  });
});