import { test, expect } from 'vitest';
import { Attributes } from '../attributes';

test('Attributesをマージできる', () => {
  const base = Attributes.from({ id: 'test', class: 'old' });
  const override = Attributes.from({ class: 'new', disabled: '' });
  const merged = Attributes.merge(base, override);
  expect(merged).toEqual({ id: 'test', class: 'new', disabled: '' });
});