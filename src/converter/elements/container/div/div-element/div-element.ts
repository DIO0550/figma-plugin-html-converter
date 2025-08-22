import type { FigmaNodeConfig } from '../../../../models/figma-node';
import { FigmaNode } from '../../../../models/figma-node';
import { Styles } from '../../../../models/styles';
import { Paint } from '../../../../models/paint';
import type { DivAttributes } from '../div-attributes';
import type { BaseElement } from '../../../base/base-element';

/**
 * div要素の型定義
 * BaseElementを継承した専用の型
 */
export interface DivElement extends BaseElement<'div'> {
  attributes: DivAttributes;
  children: DivElement[] | [];
}

/**
 * DivElementコンパニオンオブジェクト
 */
export const DivElement = {
  isDivElement(node: unknown): node is DivElement {
    return (
      typeof node === 'object' &&
      node !== null &&
      'type' in node &&
      'tagName' in node &&
      node.type === 'element' &&
      node.tagName === 'div'
    );
  },

  create(attributes: Partial<DivAttributes> = {}): DivElement {
    return {
      type: 'element',
      tagName: 'div',
      attributes: attributes as DivAttributes,
      children: []
    };
  },

  toFigmaNode(element: DivElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame('div');
    
    // デフォルトのlayoutModeを設定
    config.layoutMode = 'NONE';
    
    // IDやクラスをノード名に反映
    if (element.attributes?.id) {
      config.name = `#${element.attributes.id}`;
    } else if (element.attributes?.class) {
      config.name = `.${element.attributes.class.split(' ')[0]}`;
    }
    
    // スタイルの適用
    if (element.attributes?.style) {
      const styles = Styles.parse(element.attributes.style);
      
      // 背景色
      const backgroundColor = Styles.getBackgroundColor(styles);
      if (backgroundColor) {
        config.fills = [Paint.solid(backgroundColor)];
      }
      
      // パディング
      const padding = Styles.getPadding(styles);
      if (padding) {
        if (typeof padding === 'number') {
          config.paddingTop = padding;
          config.paddingRight = padding;
          config.paddingBottom = padding;
          config.paddingLeft = padding;
        } else {
          config.paddingTop = padding.top ?? 0;
          config.paddingRight = padding.right ?? 0;
          config.paddingBottom = padding.bottom ?? 0;
          config.paddingLeft = padding.left ?? 0;
        }
      }
      
      // Flexbox
      const display = Styles.get(styles, 'display');
      if (display === 'flex') {
        const flexDirection = Styles.get(styles, 'flex-direction');
        config.layoutMode = flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
        
        // Gap
        const gap = Styles.get(styles, 'gap');
        if (gap) {
          const gapValue = Styles.parseSize(gap);
          if (typeof gapValue === 'number') {
            config.itemSpacing = gapValue;
          }
        }
        
        // Align items
        const alignItems = Styles.get(styles, 'align-items');
        if (alignItems) {
          const alignMap: Record<string, 'MIN' | 'CENTER' | 'MAX'> = {
            'flex-start': 'MIN',
            'center': 'CENTER',
            'flex-end': 'MAX',
            'stretch': 'MIN' // FigmaではSTRETCHはサポートされていないため、MINにマップ
          };
          config.counterAxisAlignItems = alignMap[alignItems] || 'MIN';
        }
        
        // Justify content
        const justifyContent = Styles.get(styles, 'justify-content');
        if (justifyContent) {
          const justifyMap: Record<string, 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'> = {
            'flex-start': 'MIN',
            'center': 'CENTER',
            'flex-end': 'MAX',
            'space-between': 'SPACE_BETWEEN'
          };
          config.primaryAxisAlignItems = justifyMap[justifyContent] || 'MIN';
        }
      }
      
      // ボーダー
      const border = Styles.getBorder(styles);
      if (border) {
        config.strokes = [Paint.solid(border.color)];
        config.strokeWeight = border.width;
      }
      
      // 角丸
      const borderRadius = Styles.getBorderRadius(styles);
      if (borderRadius !== null) {
        if (typeof borderRadius === 'number') {
          config.cornerRadius = borderRadius;
        }
      }
      
      // サイズ
      const width = Styles.getWidth(styles);
      if (typeof width === 'number') {
        config.width = width;
      }
      
      const height = Styles.getHeight(styles);
      if (typeof height === 'number') {
        config.height = height;
      }
    }
    
    return config;
  },

  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!this.isDivElement(node)) {
      // 互換性のためのHTMLNodeからの変換
      if (
        node !== null &&
        typeof node === 'object' &&
        'type' in node &&
        'tagName' in node &&
        node.type === 'element' &&
        node.tagName === 'div'
      ) {
        const attributes = 'attributes' in node && typeof node.attributes === 'object' 
          ? node.attributes as Partial<DivAttributes>
          : {};
        const element = this.create(attributes);
        return this.toFigmaNode(element);
      }
      return null;
    }
    return this.toFigmaNode(node);
  }
};