import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.getAlignItems: align-items: flex-startの場合MINを返す', () => {
    const styles = Styles.from({ display: 'flex', 'align-items': 'flex-start' });
    expect(Flexbox.getAlignItems(styles)).toBe('MIN');
});

test('Flexbox.getAlignItems: align-items: flex-endの場合MAXを返す', () => {
    const styles = Styles.from({ display: 'flex', 'align-items': 'flex-end' });
    expect(Flexbox.getAlignItems(styles)).toBe('MAX');
});

test('Flexbox.getAlignItems: align-items: centerの場合CENTERを返す', () => {
    const styles = Styles.from({ display: 'flex', 'align-items': 'center' });
    expect(Flexbox.getAlignItems(styles)).toBe('CENTER');
});

test('Flexbox.getAlignItems: align-items: stretch（デフォルト）の場合MINを返す', () => {
    const styles = Styles.from({ display: 'flex' });
    expect(Flexbox.getAlignItems(styles)).toBe('MIN');
});

test('Flexbox.getAlignItems: align-items: stretchの場合MINを返す', () => {
    const styles = Styles.from({ display: 'flex', 'align-items': 'stretch' });
    expect(Flexbox.getAlignItems(styles)).toBe('MIN');
});

test('Flexbox.getAlignItems: align-items: baselineの場合CENTERを返す', () => {
    const styles = Styles.from({ display: 'flex', 'align-items': 'baseline' });
    expect(Flexbox.getAlignItems(styles)).toBe('CENTER');
});