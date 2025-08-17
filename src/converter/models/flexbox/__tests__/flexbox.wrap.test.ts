import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.getFlexWrap: flex-wrap: wrapの場合trueを返す', () => {
    const styles = Styles.from({
      'flex-wrap': 'wrap'
    });
    
    expect(Flexbox.getFlexWrap(styles)).toBe(true);
});

test('Flexbox.getFlexWrap: flex-wrap: wrap-reverseの場合trueを返す', () => {
    const styles = Styles.from({
      'flex-wrap': 'wrap-reverse'
    });
    
    expect(Flexbox.getFlexWrap(styles)).toBe(true);
});

test('Flexbox.getFlexWrap: flex-wrap: nowrapの場合falseを返す', () => {
    const styles = Styles.from({
      'flex-wrap': 'nowrap'
    });
    
    expect(Flexbox.getFlexWrap(styles)).toBe(false);
});

test('Flexbox.getFlexWrap: flex-wrapが指定されていない場合falseを返す', () => {
    const styles = Styles.from({});
    
    expect(Flexbox.getFlexWrap(styles)).toBe(false);
});