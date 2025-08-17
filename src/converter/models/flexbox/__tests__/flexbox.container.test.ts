import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.isFlexContainer: display: flexの場合trueを返す', () => {
    const styles = Styles.from({ display: 'flex' });
    expect(Flexbox.isFlexContainer(styles)).toBe(true);
});

test('Flexbox.isFlexContainer: display: inline-flexの場合trueを返す', () => {
    const styles = Styles.from({ display: 'inline-flex' });
    expect(Flexbox.isFlexContainer(styles)).toBe(true);
});

test('Flexbox.isFlexContainer: display: blockの場合falseを返す', () => {
    const styles = Styles.from({ display: 'block' });
    expect(Flexbox.isFlexContainer(styles)).toBe(false);
});

test('Flexbox.isFlexContainer: displayが設定されていない場合falseを返す', () => {
    const styles = Styles.from({});
    expect(Flexbox.isFlexContainer(styles)).toBe(false);
});