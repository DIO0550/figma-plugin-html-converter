import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.parseMargin: 個別のmargin値をパースできる', () => {
    const styles = Styles.from({
      'margin-top': '10px',
      'margin-right': '20px',
      'margin-bottom': '30px',
      'margin-left': '40px'
    });
    
    const margin = Flexbox.parseMargin(styles);
    expect(margin).toEqual({
      marginTop: 10,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 40
    });
});

test('Flexbox.parseMargin: 4値のshorthand marginをパースできる', () => {
    const styles = Styles.from({
      margin: '10px 20px 30px 40px'
    });
    
    const margin = Flexbox.parseMargin(styles);
    expect(margin).toEqual({
      marginTop: 10,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 40
    });
});

test('Flexbox.parseMargin: 2値のmargin shorthandを処理できる', () => {
    const styles = Styles.from({
      margin: '10px 20px'
    });
    
    const margin = Flexbox.parseMargin(styles);
    expect(margin).toEqual({
      marginTop: 10,
      marginRight: 20,
      marginBottom: 10,
      marginLeft: 20
    });
});

test('Flexbox.parseMargin: 単一値のmargin shorthandを処理できる', () => {
    const styles = Styles.from({
      margin: '15px'
    });
    
    const margin = Flexbox.parseMargin(styles);
    expect(margin).toEqual({
      marginTop: 15,
      marginRight: 15,
      marginBottom: 15,
      marginLeft: 15
    });
});

test('Flexbox.parseMargin: 3値のmargin shorthandを処理できる', () => {
    const styles = Styles.from({
      margin: '10px 20px 30px'
    });
    
    const margin = Flexbox.parseMargin(styles);
    expect(margin).toEqual({
      marginTop: 10,
      marginRight: 20,
      marginBottom: 30,
      marginLeft: 20
    });
});

test('Flexbox.parseMargin: 指定されていないmarginに対して0を返す', () => {
    const styles = Styles.from({});
    
    const margin = Flexbox.parseMargin(styles);
    expect(margin).toEqual({
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0
    });
});