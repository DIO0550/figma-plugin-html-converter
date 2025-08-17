import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.parseGap: 単一のgap値をパースできる', () => {
    const styles = Styles.from({
      gap: '10px'
    });
    
    const gap = Flexbox.parseGap(styles);
    expect(gap).toEqual({
      rowGap: 10,
      columnGap: 10
  });

test('Flexbox.parseGap: 2つのgap値をパースできる', () => {
    const styles = Styles.from({
      gap: '10px 20px'
    });
    
    const gap = Flexbox.parseGap(styles);
    expect(gap).toEqual({
      rowGap: 10,
      columnGap: 20
    });
});

test('Flexbox.parseGap: row-gapとcolumn-gapを個別にパースできる', () => {
    const styles = Styles.from({
      'row-gap': '15px',
      'column-gap': '25px'
    });
    
    const gap = Flexbox.parseGap(styles);
    expect(gap).toEqual({
      rowGap: 15,
      columnGap: 25
    });
});

test('Flexbox.parseGap: 個別のgap値がshorthandより優先される', () => {
    const styles = Styles.from({
      gap: '10px',
      'row-gap': '30px',
      'column-gap': '40px'
    });
    
    const gap = Flexbox.parseGap(styles);
    expect(gap).toEqual({
      rowGap: 30,
      columnGap: 40
    });
});

test('Flexbox.parseGap: gapが指定されていない場合デフォルト値を返す', () => {
    const styles = Styles.from({});
    
    const gap = Flexbox.parseGap(styles);
    expect(gap).toEqual({
      rowGap: 0,
      columnGap: 0
    });
  });
});