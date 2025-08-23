import { test, expect } from 'vitest';
import { SectionElement } from '../section-element';

test('[SectionElement.getId] ID属性を取得できる', () => {
      const element = SectionElement.create({ id: 'section-1' });
      expect(SectionElement.getId(element)).toBe('section-1');
    });

test('[SectionElement.getId] ID属性がない場合はundefinedを返す', () => {
      const element = SectionElement.create();
      expect(SectionElement.getId(element)).toBeUndefined();
    });

test('[SectionElement.getId] 空文字のID属性を取得できる', () => {
      const element = SectionElement.create({ id: '' });
      expect(SectionElement.getId(element)).toBe('');
});

test('[SectionElement.getClass] class属性を取得できる', () => {
      const element = SectionElement.create({ class: 'my-section' });
      expect(SectionElement.getClass(element)).toBe('my-section');
    });

test('[SectionElement.getClass] 複数のクラスを含むclass属性を取得できる', () => {
      const element = SectionElement.create({ class: 'section primary large' });
      expect(SectionElement.getClass(element)).toBe('section primary large');
    });

test('[SectionElement.getClass] class属性がない場合はundefinedを返す', () => {
      const element = SectionElement.create();
      expect(SectionElement.getClass(element)).toBeUndefined();
});

test('[SectionElement.getStyle] style属性を取得できる', () => {
      const element = SectionElement.create({ style: 'background: white;' });
      expect(SectionElement.getStyle(element)).toBe('background: white;');
    });

test('[SectionElement.getStyle] 複数のスタイルを含むstyle属性を取得できる', () => {
      const element = SectionElement.create({ 
        style: 'padding: 10px; margin: 20px; color: blue;' 
      });
      expect(SectionElement.getStyle(element)).toBe('padding: 10px; margin: 20px; color: blue;');
    });

test('[SectionElement.getStyle] style属性がない場合はundefinedを返す', () => {
      const element = SectionElement.create();
      expect(SectionElement.getStyle(element)).toBeUndefined();
});