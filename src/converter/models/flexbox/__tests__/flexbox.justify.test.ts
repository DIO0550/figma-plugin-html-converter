import { test, expect } from 'vitest';
import { Flexbox } from '../flexbox';
import { Styles } from '../../styles';

test('Flexbox.getJustifyContent: flex-start（デフォルト）の場合MINを返す', () => {
    const styles = Styles.from({ display: 'flex' });
    expect(Flexbox.getJustifyContent(styles)).toBe('MIN');
});

test('Flexbox.getJustifyContent: justify-content: flex-startの場合MINを返す', () => {
    const styles = Styles.from({ display: 'flex', 'justify-content': 'flex-start' });
    expect(Flexbox.getJustifyContent(styles)).toBe('MIN');
});

test('Flexbox.getJustifyContent: justify-content: flex-endの場合MAXを返す', () => {
    const styles = Styles.from({ display: 'flex', 'justify-content': 'flex-end' });
    expect(Flexbox.getJustifyContent(styles)).toBe('MAX');
});

test('Flexbox.getJustifyContent: justify-content: centerの場合CENTERを返す', () => {
    const styles = Styles.from({ display: 'flex', 'justify-content': 'center' });
    expect(Flexbox.getJustifyContent(styles)).toBe('CENTER');
});

test('Flexbox.getJustifyContent: justify-content: space-betweenの場合SPACE_BETWEENを返す', () => {
    const styles = Styles.from({ display: 'flex', 'justify-content': 'space-between' });
    expect(Flexbox.getJustifyContent(styles)).toBe('SPACE_BETWEEN');
});

test('Flexbox.getJustifyContent: justify-content: space-aroundの場合SPACE_BETWEENを返す', () => {
    const styles = Styles.from({ display: 'flex', 'justify-content': 'space-around' });
    expect(Flexbox.getJustifyContent(styles)).toBe('SPACE_BETWEEN');
});

test('Flexbox.getJustifyContent: justify-content: space-evenlyの場合SPACE_BETWEENを返す', () => {
    const styles = Styles.from({ display: 'flex', 'justify-content': 'space-evenly' });
    expect(Flexbox.getJustifyContent(styles)).toBe('SPACE_BETWEEN');
});