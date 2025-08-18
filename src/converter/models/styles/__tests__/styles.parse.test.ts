import { test, expect } from 'vitest';
import { Styles } from '../styles';

test('Styles.parse: 単一のスタイルをパースできる', () => {
  const styles = Styles.parse('color: red');
  expect(styles).toEqual({ color: 'red' });
});

test('Styles.parse: 複数のスタイルをパースできる', () => {
  const styles = Styles.parse('color: red; background: blue; margin: 10px');
  expect(styles).toEqual({
    color: 'red',
    background: 'blue',
    margin: '10px'
  });
});

test('Styles.parse: 前後の空白を処理できる', () => {
  const styles = Styles.parse('  color  :  red  ;  background  :  blue  ');
  expect(styles).toEqual({
    color: 'red',
    background: 'blue'
  });
});

test('Styles.parse: 空文字列から空のStylesを作成する', () => {
  const styles = Styles.parse('');
  expect(styles).toEqual({});
  expect(Styles.isEmpty(styles)).toBe(true);
});

test('Styles.parse: セミコロンのみの文字列を処理できる', () => {
  const styles = Styles.parse(';;;');
  expect(styles).toEqual({});
});

test('Styles.parse: 複雑なスタイル文字列を正しくパースする', () => {
  const styles = Styles.parse('font-family: "Arial", sans-serif; background: url("bg.png") center/cover');
  expect(styles['font-family']).toBe('"Arial", sans-serif');
  expect(styles['background']).toBe('url("bg.png") center/cover');
});

test('Styles.parse: コロンがない不正な形式を無視する', () => {
  const styles = Styles.parse('invalid-style; color: red; also-invalid');
  expect(styles).toEqual({ color: 'red' });
});

test('Styles.parse: 値が空のプロパティを無視する', () => {
  const styles = Styles.parse('color:; background: blue; margin:');
  expect(styles).toEqual({ background: 'blue' });
});

test('Styles.parse: 重複するプロパティは後の値で上書きする', () => {
  const styles = Styles.parse('color: red; color: blue; color: green');
  expect(styles).toEqual({ color: 'green' });
});