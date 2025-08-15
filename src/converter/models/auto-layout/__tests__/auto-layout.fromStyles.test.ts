import { it, expect } from 'vitest';
import { AutoLayoutProperties } from '../auto-layout';
import { Styles } from '../../styles';

it('非flexコンテナの場合はnullを返す', () => {
  const styles = Styles.from({ display: 'block' });
  expect(AutoLayoutProperties.fromStyles(styles)).toBeNull();
});

it('基本的なflexコンテナを変換できる', () => {
  const styles = Styles.from({ display: 'flex' });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout).toEqual({
    layoutMode: 'HORIZONTAL',
    primaryAxisAlignItems: 'MIN',
    counterAxisAlignItems: 'MIN',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0
  });
});

it('中央揃えのflex columnを変換できる', () => {
  const styles = Styles.from({
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center'
  });
  const autoLayout = AutoLayoutProperties.fromStyles(styles);
  
  expect(autoLayout).toEqual({
    layoutMode: 'VERTICAL',
    primaryAxisAlignItems: 'CENTER',
    counterAxisAlignItems: 'CENTER',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0
  });
});