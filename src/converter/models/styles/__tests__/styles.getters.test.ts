import { describe, test, expect } from 'vitest';
import { Styles } from '../styles';

describe('Styles Getters', () => {
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