import type { FigmaNodeConfig } from '../../../../models/figma-node';
import { FigmaNode } from '../../../../models/figma-node';
import { Styles } from '../../../../models/styles';
import { Paint } from '../../../../models/paint';
import type { SectionAttributes } from '../section-attributes';
import type { BaseElement } from '../../../base/base-element';

/**
 * section要素の型定義
 * BaseElementを継承した専用の型
 * HTML5のセマンティック要素として文書のセクションを表す
 */
export interface SectionElement extends BaseElement<'section'> {
  attributes: SectionAttributes;
  children: SectionElement[] | [];
}

/**
 * SectionElementコンパニオンオブジェクト
 */
export const SectionElement = {
  /**
   * 内部ヘルパー: section要素のような構造を持つオブジェクトかを判定
   */
  _isSectionElementLike(node: unknown): boolean {
    return (
      typeof node === 'object' &&
      node !== null &&
      'type' in node &&
      'tagName' in node &&
      (node as any).type === 'element' &&
      (node as any).tagName === 'section'
    );
  },

  /**
   * 型ガード: オブジェクトがSectionElementかを判定
   */
  isSectionElement(node: unknown): node is SectionElement {
    return this._isSectionElementLike(node);
  },

  /**
   * ファクトリメソッド: 新しいSectionElementを作成
   */
  create(attributes: Partial<SectionAttributes> = {}): SectionElement {
    return {
      type: 'element',
      tagName: 'section',
      attributes: attributes as SectionAttributes,
      children: []
    };
  },

  /**
   * 属性アクセサ: ID属性を取得
   */
  getId(element: SectionElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * 属性アクセサ: class属性を取得
   */
  getClass(element: SectionElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * 属性アクセサ: style属性を取得
   */
  getStyle(element: SectionElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * Figma変換: SectionElementをFigmaノードに変換
   */
  toFigmaNode(element: SectionElement): FigmaNodeConfig {
    const config = FigmaNode.createFrame('section');
    
    // sectionはデフォルトでverticalレイアウト
    config.layoutMode = 'VERTICAL';
    // セクションは通常、親要素の幅いっぱいに広がる
    config.layoutSizingHorizontal = 'FILL';
    
    // IDやクラスをノード名に反映
    if (element.attributes?.id) {
      config.name = `section#${element.attributes.id}`;
    } else if (element.attributes?.class) {
      config.name = `section.${element.attributes.class.split(' ')[0]}`;
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
            'stretch': 'MIN' // FigmaのcounterAxisAlignItemsではSTRETCHは未サポートのため、MINにマップ
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

  /**
   * マッピング: 汎用的なHTMLNodeをFigmaノードに変換
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    if (!this.isSectionElement(node)) {
      // 互換性のためのHTMLNodeからの変換
      if (this._isSectionElementLike(node)) {
        const nodeWithType = node as any;
        const attributes = 'attributes' in nodeWithType && typeof nodeWithType.attributes === 'object' 
          ? nodeWithType.attributes as Partial<SectionAttributes>
          : {};
        const element = this.create(attributes);
        return this.toFigmaNode(element);
      }
      return null;
    }
    return this.toFigmaNode(node);
  }
};