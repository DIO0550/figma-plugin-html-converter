import { describe, test, expect } from 'vitest';
import { Attributes } from './attributes';

describe('Attributes', () => {
  describe('parse', () => {
    test('単一の属性をパースできる', () => {
      const attrs = Attributes.parse('id="test"');
      expect(attrs).toEqual({ id: 'test' });
    });

    test('複数の属性をパースできる', () => {
      const attrs = Attributes.parse('id="test" class="container"');
      expect(attrs).toEqual({ id: 'test', class: 'container' });
    });

    test('値のない属性をパースできる', () => {
      const attrs = Attributes.parse('disabled checked');
      expect(attrs).toEqual({ disabled: '', checked: '' });
    });

    test('混在した属性をパースできる', () => {
      const attrs = Attributes.parse('id="main" disabled class="active"');
      expect(attrs).toEqual({ id: 'main', disabled: '', class: 'active' });
    });

    test('空文字列から空のAttributesを作成する', () => {
      const attrs = Attributes.parse('');
      expect(attrs).toEqual({});
    });
  });

  describe('from', () => {
    test('オブジェクトからAttributes型を作成できる', () => {
      const attrs = Attributes.from({ id: 'test', class: 'container' });
      expect(attrs).toEqual({ id: 'test', class: 'container' });
    });
  });

  describe('empty', () => {
    test('空のAttributesを作成できる', () => {
      const attrs = Attributes.empty();
      expect(attrs).toEqual({});
      expect(Attributes.isEmpty(attrs)).toBe(true);
    });
  });

  describe('get/set/remove', () => {
    test('属性を取得できる', () => {
      const attrs = Attributes.from({ id: 'test' });
      expect(Attributes.get(attrs, 'id')).toBe('test');
      expect(Attributes.get(attrs, 'class')).toBeUndefined();
    });

    test('属性を設定できる', () => {
      const attrs = Attributes.empty();
      const updated = Attributes.set(attrs, 'id', 'test');
      expect(updated.id).toBe('test');
    });

    test('属性を削除できる', () => {
      const attrs = Attributes.from({ id: 'test', class: 'container' });
      const updated = Attributes.remove(attrs, 'id');
      expect(updated).toEqual({ class: 'container' });
    });
  });

  describe('merge', () => {
    test('Attributesをマージできる', () => {
      const base = Attributes.from({ id: 'test', class: 'old' });
      const override = Attributes.from({ class: 'new', disabled: '' });
      const merged = Attributes.merge(base, override);
      expect(merged).toEqual({ id: 'test', class: 'new', disabled: '' });
    });
  });

  describe('class操作', () => {
    test('クラスを追加できる', () => {
      const attrs = Attributes.empty();
      const updated = Attributes.addClass(attrs, 'active');
      expect(updated.class).toBe('active');
    });

    test('既存のクラスに追加できる', () => {
      const attrs = Attributes.from({ class: 'container' });
      const updated = Attributes.addClass(attrs, 'active');
      expect(updated.class).toBe('container active');
    });

    test('重複するクラスは追加されない', () => {
      const attrs = Attributes.from({ class: 'active container' });
      const updated = Attributes.addClass(attrs, 'active');
      expect(updated.class).toBe('active container');
    });

    test('クラスを削除できる', () => {
      const attrs = Attributes.from({ class: 'container active' });
      const updated = Attributes.removeClass(attrs, 'active');
      expect(updated.class).toBe('container');
    });

    test('最後のクラスを削除するとclass属性も削除される', () => {
      const attrs = Attributes.from({ class: 'active' });
      const updated = Attributes.removeClass(attrs, 'active');
      expect(updated.class).toBeUndefined();
    });
  });

  describe('特殊属性の取得', () => {
    test('id属性を取得できる', () => {
      const attrs = Attributes.from({ id: 'main' });
      expect(Attributes.getId(attrs)).toBe('main');
    });

    test('style属性を取得できる', () => {
      const attrs = Attributes.from({ style: 'color: red;' });
      expect(Attributes.getStyle(attrs)).toBe('color: red;');
    });
  });
});