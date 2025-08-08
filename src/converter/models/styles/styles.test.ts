import { describe, test, expect } from 'vitest';
import { Styles } from './styles';

describe('Styles', () => {
  describe('parse', () => {
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

  describe('toString', () => {
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

  describe('parseSize', () => {
    test('ピクセル値をパースできる', () => {
      expect(Styles.parseSize('100px')).toBe(100);
      expect(Styles.parseSize('50.5px')).toBe(50.5);
    });

    test('単位なしの数値をパースできる', () => {
      expect(Styles.parseSize('100')).toBe(100);
      expect(Styles.parseSize('50.5')).toBe(50.5);
    });

    test('他の単位をパースできる', () => {
      expect(Styles.parseSize('100%')).toEqual({ value: 100, unit: '%' });
      expect(Styles.parseSize('2em')).toEqual({ value: 2, unit: 'em' });
      expect(Styles.parseSize('1.5rem')).toEqual({ value: 1.5, unit: 'rem' });
    });

    test('特殊な値を処理できる', () => {
      expect(Styles.parseSize('auto')).toBeNull();
      expect(Styles.parseSize('inherit')).toBeNull();
    });

    test('不正な値を処理できる', () => {
      expect(Styles.parseSize('invalid')).toBeNull();
      expect(Styles.parseSize('')).toBeNull();
      expect(Styles.parseSize(undefined)).toBeNull();
    });
  });

  describe('parseColor', () => {
    test('16進数カラーをパースできる', () => {
      expect(Styles.parseColor('#ff0000')).toEqual({ r: 1, g: 0, b: 0 });
      expect(Styles.parseColor('#00ff00')).toEqual({ r: 0, g: 1, b: 0 });
      expect(Styles.parseColor('#0000ff')).toEqual({ r: 0, g: 0, b: 1 });
    });

    test('3桁の16進数カラーをパースできる', () => {
      expect(Styles.parseColor('#f00')).toEqual({ r: 1, g: 0, b: 0 });
      expect(Styles.parseColor('#0f0')).toEqual({ r: 0, g: 1, b: 0 });
      expect(Styles.parseColor('#00f')).toEqual({ r: 0, g: 0, b: 1 });
    });

    test('rgb()関数をパースできる', () => {
      expect(Styles.parseColor('rgb(255, 0, 0)')).toEqual({ r: 1, g: 0, b: 0 });
      expect(Styles.parseColor('rgb(0, 255, 0)')).toEqual({ r: 0, g: 1, b: 0 });
      expect(Styles.parseColor('rgb(0, 0, 255)')).toEqual({ r: 0, g: 0, b: 1 });
    });

    test('rgba()関数をパースできる', () => {
      expect(Styles.parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 1, g: 0, b: 0 });
      expect(Styles.parseColor('rgba(0, 255, 0, 1)')).toEqual({ r: 0, g: 1, b: 0 });
    });

    test('名前付きカラーをパースできる', () => {
      expect(Styles.parseColor('red')).toEqual({ r: 1, g: 0, b: 0 });
      expect(Styles.parseColor('blue')).toEqual({ r: 0, g: 0, b: 1 });
      expect(Styles.parseColor('black')).toEqual({ r: 0, g: 0, b: 0 });
      expect(Styles.parseColor('white')).toEqual({ r: 1, g: 1, b: 1 });
    });

    test('大文字小文字を無視する', () => {
      expect(Styles.parseColor('RED')).toEqual({ r: 1, g: 0, b: 0 });
      expect(Styles.parseColor('Blue')).toEqual({ r: 0, g: 0, b: 1 });
    });
  });

  describe('parseBorder', () => {
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

  describe('ゲッターメソッド', () => {
    test('getWidthが動作する', () => {
      const styles = Styles.from({ width: '100px' });
      expect(Styles.getWidth(styles)).toBe(100);
    });

    test('getHeightが動作する', () => {
      const styles = Styles.from({ height: '200px' });
      expect(Styles.getHeight(styles)).toBe(200);
    });

    test('getBackgroundColorが動作する', () => {
      const styles = Styles.from({ 'background-color': '#ff0000' });
      expect(Styles.getBackgroundColor(styles)).toEqual({ r: 1, g: 0, b: 0 });
    });

    test('getBackgroundColorがキャメルケースも処理する', () => {
      const styles = Styles.from({ backgroundColor: '#00ff00' });
      expect(Styles.getBackgroundColor(styles)).toEqual({ r: 0, g: 1, b: 0 });
    });

    test('getColorが動作する', () => {
      const styles = Styles.from({ color: 'blue' });
      expect(Styles.getColor(styles)).toEqual({ r: 0, g: 0, b: 1 });
    });

    test('getBorderが動作する', () => {
      const styles = Styles.from({ border: '2px solid red' });
      const border = Styles.getBorder(styles);
      expect(border).toEqual({
        width: 2,
        style: 'solid',
        color: { r: 1, g: 0, b: 0 }
      });
    });

    test('getBorderRadiusが動作する', () => {
      const styles = Styles.from({ 'border-radius': '10px' });
      expect(Styles.getBorderRadius(styles)).toBe(10);
    });

    test('getBorderRadiusがキャメルケースも処理する', () => {
      const styles = Styles.from({ borderRadius: '20px' });
      expect(Styles.getBorderRadius(styles)).toBe(20);
    });

    test('getDisplayが動作する', () => {
      const styles = Styles.from({ display: 'flex' });
      expect(Styles.getDisplay(styles)).toBe('flex');
    });

    test('getOpacityが動作する', () => {
      const styles = Styles.from({ opacity: '0.5' });
      expect(Styles.getOpacity(styles)).toBe(0.5);
    });

    test('getOpacityが範囲を制限する', () => {
      expect(Styles.getOpacity(Styles.from({ opacity: '1.5' }))).toBe(1);
      expect(Styles.getOpacity(Styles.from({ opacity: '-0.5' }))).toBe(0);
    });
  });

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