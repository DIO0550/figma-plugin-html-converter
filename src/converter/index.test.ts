import { describe, test, expect } from 'vitest';
import { convertHTMLToFigma } from './index';

describe('convertHTMLToFigma', () => {
  test('シンプルなdiv要素を変換できる', async () => {
    const html = '<div>Hello World</div>';
    const result = await convertHTMLToFigma(html);

    expect(result).toBeDefined();
    expect(result.type).toBe('FRAME');
    expect(result.name).toBe('div');
  });

  test('空のHTMLでもエラーにならない', async () => {
    const html = '';
    const result = await convertHTMLToFigma(html);

    expect(result).toBeDefined();
    expect(result.type).toBe('FRAME');
    expect(result.name).toBe('Root');
  });

  test('オプションを指定できる', async () => {
    const html = '<div>Test</div>';
    const options = {
      containerWidth: 1024,
      containerHeight: 768
    };
    const result = await convertHTMLToFigma(html, options);

    expect(result.width).toBe(1024);
    expect(result.height).toBe(768);
  });
});