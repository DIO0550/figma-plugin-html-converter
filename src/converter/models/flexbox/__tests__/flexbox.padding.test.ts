import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.parsePadding: 個別のpadding値をパースできる', () => {
    const styles = Styles.from({
      'padding-top': '10px',
      'padding-right': '20px',
      'padding-bottom': '30px',
      'padding-left': '40px'
    });
    
    const padding = Flexbox.parsePadding(styles);
    expect(padding).toEqual({
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 30,
      paddingLeft: 40
  });

test('Flexbox.parsePadding: shorthand paddingを4値でパースできる', () => {
    const styles = Styles.from({
      padding: '10px 20px 30px 40px'
    });
    
    const padding = Flexbox.parsePadding(styles);
    expect(padding).toEqual({
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 30,
      paddingLeft: 40
    });
});

test('Flexbox.parsePadding: 2値のshorthandを処理できる', () => {
    const styles = Styles.from({
      padding: '10px 20px'
    });
    
    const padding = Flexbox.parsePadding(styles);
    expect(padding).toEqual({
      paddingTop: 10,
      paddingRight: 20,
      paddingBottom: 10,
      paddingLeft: 20
    });
});

test('Flexbox.parsePadding: 単一値のshorthandを処理できる', () => {
    const styles = Styles.from({
      padding: '15px'
    });
    
    const padding = Flexbox.parsePadding(styles);
    expect(padding).toEqual({
      paddingTop: 15,
      paddingRight: 15,
      paddingBottom: 15,
      paddingLeft: 15
    });
  });
});