import { describe, test, expect } from 'vitest';
import { FigmaNode } from '../../../../../models/figma-node';
import { 
  SectionElement,
  applyBasicConfig,
  applyBackgroundStyles
} from '../section-element';

describe('SectionElement helpers', () => {
  describe('applyBasicConfig', () => {
    test('デフォルトのレイアウトモードをVERTICALに設定する', () => {
      const config = FigmaNode.createFrame('section');
      
      const newConfig = applyBasicConfig(config, 'section');
      
      expect(newConfig.layoutMode).toBe('VERTICAL');
      expect(newConfig.layoutSizingHorizontal).toBe('FILL');
      // 元のconfigは変更されていないことを確認
      expect(config.layoutMode).toBeUndefined();
    });

    test('ID属性がある場合はノード名にIDを含める', () => {
      const config = FigmaNode.createFrame('section');
      
      const newConfig = applyBasicConfig(config, 'section', { id: 'main-section' });
      
      expect(newConfig.name).toBe('section#main-section');
      // 元のconfigは変更されていないことを確認
      expect(config.name).toBe('section');
    });

    test('class属性がある場合はノード名に最初のクラスを含める', () => {
      const config = FigmaNode.createFrame('section');
      
      const newConfig = applyBasicConfig(config, 'section', { class: 'container primary' });
      
      expect(newConfig.name).toBe('section.container');
      // 元のconfigは変更されていないことを確認
      expect(config.name).toBe('section');
    });

    test('IDとclassの両方がある場合はIDを優先する', () => {
      const config = FigmaNode.createFrame('section');
      
      const newConfig = applyBasicConfig(config, 'section', { 
        id: 'main-section',
        class: 'container' 
      });
      
      expect(newConfig.name).toBe('section#main-section');
      // 元のconfigは変更されていないことを確認
      expect(config.name).toBe('section');
    });

    test('attributes未指定でも動作する', () => {
      const config = FigmaNode.createFrame('div');
      
      const newConfig = applyBasicConfig(config, 'div');
      
      expect(newConfig.layoutMode).toBe('VERTICAL');
      expect(newConfig.layoutSizingHorizontal).toBe('FILL');
      expect(newConfig.name).toBe('div');
    });

    test('異なるタグ名でも動作する', () => {
      const config = FigmaNode.createFrame('article');
      
      const newConfig = applyBasicConfig(config, 'article', { id: 'main-article' });
      
      expect(newConfig.name).toBe('article#main-article');
      expect(newConfig.layoutMode).toBe('VERTICAL');
    });
  });

  describe('applyBackgroundStyles', () => {
    test('背景色が指定されている場合はfillsに適用する', () => {
      const config = FigmaNode.createFrame('section');
      const styles = {
        'background-color': '#ff0000'
      };
      
      const newConfig = applyBackgroundStyles(config, styles);
      
      expect(newConfig.fills).toEqual([{
        type: 'SOLID',
        color: { r: 1, g: 0, b: 0 },
        opacity: undefined,
        visible: true
      }]);
      // 元のconfigは変更されていないことを確認
      expect(config.fills).toBeUndefined();
    });

    test('背景色が指定されていない場合は何も設定しない', () => {
      const config = FigmaNode.createFrame('section');
      const styles = {
        'color': '#000000'
      };
      
      const newConfig = applyBackgroundStyles(config, styles);
      
      expect(newConfig.fills).toBeUndefined();
      // 元のconfigは変更されていないことを確認
      expect(config.fills).toBeUndefined();
    });
  });
});