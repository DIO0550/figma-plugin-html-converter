import { it, expect } from 'vitest';
import { AutoLayoutProperties } from '../auto-layout';
import { Styles } from '../../styles';

it('gapプロパティをitemSpacingに変換できる', () => {
  const styles = Styles.from({
    display: 'flex',
    gap: '16px'
  });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout?.itemSpacing).toBe(16);
});

it('水平レイアウトではcolumn-gapを使用する', () => {
  const styles = Styles.from({
    display: 'flex',
    'flex-direction': 'row',
    'column-gap': '20px',
    'row-gap': '10px'
  });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout?.itemSpacing).toBe(20);
});

it('垂直レイアウトではrow-gapを使用する', () => {
  const styles = Styles.from({
    display: 'flex',
    'flex-direction': 'column',
    'column-gap': '20px',
    'row-gap': '10px'
  });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout?.itemSpacing).toBe(10);
});

it('2つの値を持つgapショートハンドを正しく処理できる', () => {
  const stylesHorizontal = Styles.from({
    display: 'flex',
    'flex-direction': 'row',
    gap: '10px 20px'
  });
  const autoLayoutHorizontal = AutoLayoutProperties.fromStyles(stylesHorizontal);
  
  expect(autoLayoutHorizontal?.itemSpacing).toBe(20); // column-gap

  const stylesVertical = Styles.from({
    display: 'flex',
    'flex-direction': 'column',
    gap: '10px 20px'
  });
  const autoLayoutVertical = AutoLayoutProperties.fromStyles(stylesVertical);
  
  expect(autoLayoutVertical?.itemSpacing).toBe(10); // row-gap
});