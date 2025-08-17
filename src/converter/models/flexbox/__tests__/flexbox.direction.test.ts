import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.getFlexDirection: row（デフォルト）の場合HORIZONTALを返す', () => {
    const styles = Styles.from({ display: 'flex' });
    expect(Flexbox.getFlexDirection(styles)).toBe('HORIZONTAL');
});

test('Flexbox.getFlexDirection: flex-direction: rowの場合HORIZONTALを返す', () => {
    const styles = Styles.from({ display: 'flex', 'flex-direction': 'row' });
    expect(Flexbox.getFlexDirection(styles)).toBe('HORIZONTAL');
});

test('Flexbox.getFlexDirection: flex-direction: row-reverseの場合HORIZONTALを返す', () => {
    const styles = Styles.from({ display: 'flex', 'flex-direction': 'row-reverse' });
    expect(Flexbox.getFlexDirection(styles)).toBe('HORIZONTAL');
});

test('Flexbox.getFlexDirection: flex-direction: columnの場合VERTICALを返す', () => {
    const styles = Styles.from({ display: 'flex', 'flex-direction': 'column' });
    expect(Flexbox.getFlexDirection(styles)).toBe('VERTICAL');
});

test('Flexbox.getFlexDirection: flex-direction: column-reverseの場合VERTICALを返す', () => {
    const styles = Styles.from({ display: 'flex', 'flex-direction': 'column-reverse' });
    expect(Flexbox.getFlexDirection(styles)).toBe('VERTICAL');
});