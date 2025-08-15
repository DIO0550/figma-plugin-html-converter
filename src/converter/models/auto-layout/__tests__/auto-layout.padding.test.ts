import { it, expect } from 'vitest';
import { AutoLayoutProperties } from '../auto-layout';
import { Styles } from '../../styles';

it('paddingプロパティを変換できる', () => {
  const styles = Styles.from({
    display: 'flex',
    padding: '10px 20px'
  });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout).toMatchObject({
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  });
});

it('複雑なpadding値を処理できる', () => {
  const styles = Styles.from({
    display: 'flex',
    'padding-left': '5px',
    'padding-right': '10px',
    'padding-top': '15px',
    'padding-bottom': '20px'
  });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout).toMatchObject({
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 20
  });
});