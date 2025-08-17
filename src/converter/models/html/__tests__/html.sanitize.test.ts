import { test, expect } from 'vitest';
import { HTML } from '../html';

test('HTML.sanitize: 余分な空白を削除する', () => {
  const html = HTML.sanitize('  <div>  Hello  </div>  ');
  expect(html).toBe('<div>  Hello  </div>');
});

test('HTML.sanitize: 改行を含むHTMLを整形する', () => {
  const html = HTML.sanitize(`
    <div>
      Hello
    </div>
  `);
  expect(html).toBe('<div>\n      Hello\n    </div>');
});