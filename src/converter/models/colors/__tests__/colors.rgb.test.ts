import { test, expect } from 'vitest';
import { Colors } from '../colors';

test('0-255の値から0-1のRGB値を作成できる', () => {
  const color = Colors.rgb(255, 128, 64);
  expect(color.r).toBeCloseTo(1);
  expect(color.g).toBeCloseTo(0.5019607843137255);
  expect(color.b).toBeCloseTo(0.25098039215686274);
});

test('範囲外の値をクランプして正しいRGB値を作成できる', () => {
  const color = Colors.rgb(300, -50, 128);
  expect(color.r).toBe(1); // 300 -> 255 -> 1
  expect(color.g).toBe(0); // -50 -> 0 -> 0
  expect(color.b).toBeCloseTo(0.5019607843137255);
});

test('RGBA値を作成できる', () => {
  const color = Colors.rgba(255, 128, 64, 0.5);
  expect(color.r).toBeCloseTo(1);
  expect(color.g).toBeCloseTo(0.5019607843137255);
  expect(color.b).toBeCloseTo(0.25098039215686274);
  expect(color.a).toBe(0.5);
});

test('RGBAのアルファ値が範囲内にクランプされる', () => {
  const color1 = Colors.rgba(255, 128, 64, 1.5);
  expect(color1.a).toBe(1);
  
  const color2 = Colors.rgba(255, 128, 64, -0.5);
  expect(color2.a).toBe(0);
});

test('RGBをrgb()関数文字列に変換できる', () => {
  const color = { r: 1, g: 0.5, b: 0.25 };
  const rgbString = Colors.toRgbString(color);
  expect(rgbString).toBe('rgb(255, 128, 64)');
});

test('RGBAをrgba()関数文字列に変換できる', () => {
  const color = { r: 1, g: 0.5, b: 0.25, a: 0.8 };
  const rgbaString = Colors.toRgbaString(color);
  expect(rgbaString).toBe('rgba(255, 128, 64, 0.8)');
});

test('rgb()関数文字列からRGBに変換できる', () => {
  const color = Colors.fromRgbString('rgb(255, 128, 64)');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0.5019607843137255);
  expect(color!.b).toBeCloseTo(0.25098039215686274);
});

test('rgba()関数文字列からRGBに変換できる（アルファ値は無視）', () => {
  const color = Colors.fromRgbString('rgba(255, 128, 64, 0.5)');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
  expect(color!.g).toBeCloseTo(0.5019607843137255);
  expect(color!.b).toBeCloseTo(0.25098039215686274);
});

test('スペースを含むrgb()関数文字列を処理できる', () => {
  const color = Colors.fromRgbString('rgb( 255 , 128 , 64 )');
  expect(color).not.toBeNull();
  expect(color!.r).toBeCloseTo(1);
});

test('不正なrgb()関数文字列はnullを返す', () => {
  expect(Colors.fromRgbString('invalid')).toBeNull();
  expect(Colors.fromRgbString('rgb(255, 128)')).toBeNull();
  expect(Colors.fromRgbString('rgb(255 128 64)')).toBeNull();
});