import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.getWidth: getWidthが動作する', () => {
    const styles = Styles.from({ width: '100px' });
    expect(Styles.getWidth(styles)).toBe(100);
  });

test('Styles.getHeight: getHeightが動作する', () => {
    const styles = Styles.from({ height: '200px' });
    expect(Styles.getHeight(styles)).toBe(200);
  });

test('Styles.getBackgroundColor: getBackgroundColorが動作する', () => {
    const styles = Styles.from({ 'background-color': '#ff0000' });
    expect(Styles.getBackgroundColor(styles)).toEqual({ r: 1, g: 0, b: 0 });
  });

test('Styles.getBackgroundColor: キャメルケースも処理する', () => {
    const styles = Styles.from({ backgroundColor: '#00ff00' });
    expect(Styles.getBackgroundColor(styles)).toEqual({ r: 0, g: 1, b: 0 });
  });

test('Styles.getColor: getColorが動作する', () => {
    const styles = Styles.from({ color: 'blue' });
    expect(Styles.getColor(styles)).toEqual({ r: 0, g: 0, b: 1 });
  });

test('Styles.getBorder: getBorderが動作する', () => {
    const styles = Styles.from({ border: '2px solid red' });
    const border = Styles.getBorder(styles);
    expect(border).toEqual({
      width: 2,
      style: 'solid',
      color: { r: 1, g: 0, b: 0 }
    });
  });

test('Styles.getBorderRadius: getBorderRadiusが動作する', () => {
    const styles = Styles.from({ 'border-radius': '10px' });
    expect(Styles.getBorderRadius(styles)).toBe(10);
  });

test('Styles.getBorderRadius: キャメルケースも処理する', () => {
    const styles = Styles.from({ borderRadius: '20px' });
    expect(Styles.getBorderRadius(styles)).toBe(20);
  });

test('Styles.getDisplay: getDisplayが動作する', () => {
    const styles = Styles.from({ display: 'flex' });
    expect(Styles.getDisplay(styles)).toBe('flex');
  });

test('Styles.getOpacity: getOpacityが動作する', () => {
    const styles = Styles.from({ opacity: '0.5' });
    expect(Styles.getOpacity(styles)).toBe(0.5);
  });

test('Styles.getOpacity: 範囲を制限する', () => {
    expect(Styles.getOpacity(Styles.from({ opacity: '1.5' }))).toBe(1);
    expect(Styles.getOpacity(Styles.from({ opacity: '-0.5' }))).toBe(0);
});

test('Styles.getWidth: 存在しないwidthをnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getWidth(styles)).toBeNull();
});

test('Styles.getHeight: 存在しないheightをnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getHeight(styles)).toBeNull();
});

test('Styles.getColor: 存在しないcolorをnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getColor(styles)).toBeNull();
});

test('Styles.getBackgroundColor: 存在しない色をnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getBackgroundColor(styles)).toBeNull();
});

test('Styles.getBorder: 存在しないborderをnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getBorder(styles)).toBeNull();
});

test('Styles.getBorderRadius: 存在しないborder-radiusをnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getBorderRadius(styles)).toBeNull();
});

test('Styles.getDisplay: 存在しないdisplayをundefinedとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getDisplay(styles)).toBeUndefined();
});

test('Styles.getOpacity: 存在しないopacityをnullとして処理する', () => {
  const styles = Styles.empty();
  expect(Styles.getOpacity(styles)).toBeNull();
});