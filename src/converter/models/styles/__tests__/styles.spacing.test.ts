import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.parsePadding: 単一値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px');
      expect(padding).toEqual({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      });
    });

test('Styles.parsePadding: 2値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px 20px');
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
      });
    });

test('Styles.parsePadding: 3値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px 20px 30px');
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 20
      });
    });

test('Styles.parsePadding: 4値のpaddingをパースできる', () => {
      const padding = Styles.parsePadding('10px 20px 30px 40px');
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 40
      });
});

test('Styles.getPadding: getPaddingが動作する', () => {
      const styles = Styles.from({ padding: '10px 20px' });
      const padding = Styles.getPadding(styles);
      expect(padding).toEqual({
        top: 10,
        right: 20,
        bottom: 10,
        left: 20
      });
    });

test('Styles.getMargin: getMarginが動作する', () => {
      const styles = Styles.from({ margin: '5px' });
      const margin = Styles.getMargin(styles);
      expect(margin).toEqual({
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
      });
});

test('Styles.parsePadding: 異常な値をnullとして処理する', () => {
  const padding = Styles.parsePadding('invalid');
  expect(padding).toBeNull();
});

test('Styles.parsePadding: auto値を処理できる', () => {
  const padding = Styles.parsePadding('auto');
  expect(padding).toBeNull();
});

test('Styles.parsePadding: 0値のpaddingを処理できる', () => {
  const padding = Styles.parsePadding('0');
  expect(padding).toEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
});

test('Styles.getPadding: 存在しないpaddingをnullとして処理する', () => {
  const styles = Styles.empty();
  const padding = Styles.getPadding(styles);
  expect(padding).toBeNull();
});

test('Styles.getMargin: 存在しないmarginをnullとして処理する', () => {
  const styles = Styles.empty();
  const margin = Styles.getMargin(styles);
  expect(margin).toBeNull();
});