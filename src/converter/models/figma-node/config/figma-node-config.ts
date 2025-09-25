import type { Paint } from '../../paint';
import { Paint as PaintUtil } from '../../paint';
import type { Constraints, NodeType } from '../figma-node';

export interface FigmaNodeConfig {
  type: NodeType;
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  cornerRadius?: number;
  // Auto Layoutプロパティ
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  layoutWrap?: 'NO_WRAP' | 'WRAP';
  // Positioning
  constraints?: Constraints;
  zIndex?: number;
  // 子要素
  children?: FigmaNodeConfig[];
  // レスポンシブプロパティ
  layoutGrow?: number;
  layoutSizingHorizontal?: 'FIXED' | 'HUG' | 'FILL';
  layoutSizingVertical?: 'FIXED' | 'HUG' | 'FILL';
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

export interface AutoLayoutConfig {
  mode: 'HORIZONTAL' | 'VERTICAL';
  spacing?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  primaryAxisAlign?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';
}

// ヘルパー関数
const isDivTag = (tagName: string): boolean => tagName === 'div';

export const FigmaNodeConfig = {
  // 型ガード
  isFrame(node: FigmaNodeConfig): boolean {
    return node.type === 'FRAME';
  },

  isText(node: FigmaNodeConfig): boolean {
    return node.type === 'TEXT';
  },

  isRectangle(node: FigmaNodeConfig): boolean {
    return node.type === 'RECTANGLE';
  },

  isGroup(node: FigmaNodeConfig): boolean {
    return node.type === 'GROUP';
  },

  // ファクトリーメソッド
  createFrame(name: string, props?: Partial<FigmaNodeConfig>): FigmaNodeConfig {
    return {
      type: 'FRAME',
      name,
      ...props
    };
  },
  

  createText(content: string, props?: Partial<FigmaNodeConfig>): FigmaNodeConfig {
    return {
      type: 'TEXT',
      name: content,
      ...props
    };
  },

  createRectangle(name: string, props?: Partial<FigmaNodeConfig>): FigmaNodeConfig {
    return {
      type: 'RECTANGLE',
      name,
      ...props
    };
  },

  createGroup(name: string, props?: Partial<FigmaNodeConfig>): FigmaNodeConfig {
    return {
      type: 'GROUP',
      name,
      ...props
    };
  },

  // スタイルヘルパー
  setSize(node: FigmaNodeConfig, width: number, height: number): void {
    node.width = width;
    node.height = height;
  },

  setPosition(node: FigmaNodeConfig, x: number, y: number): void {
    node.x = x;
    node.y = y;
  },

  setFills(node: FigmaNodeConfig, fills: Paint[]): void {
    node.fills = fills;
  },

  setStrokes(node: FigmaNodeConfig, strokes: Paint[], weight?: number): void {
    node.strokes = strokes;
    if (weight !== undefined) {
      node.strokeWeight = weight;
    }
  },

  setCornerRadius(node: FigmaNodeConfig, radius: number): void {
    node.cornerRadius = radius;
  },

  setAutoLayout(node: FigmaNodeConfig, config: AutoLayoutConfig): void {
    node.layoutMode = config.mode;
    
    if (config.spacing !== undefined) {
      node.itemSpacing = config.spacing;
    }

    if (config.padding) {
      if (config.padding.top !== undefined) node.paddingTop = config.padding.top;
      if (config.padding.right !== undefined) node.paddingRight = config.padding.right;
      if (config.padding.bottom !== undefined) node.paddingBottom = config.padding.bottom;
      if (config.padding.left !== undefined) node.paddingLeft = config.padding.left;
    }

    if (config.primaryAxisAlign) {
      node.primaryAxisAlignItems = config.primaryAxisAlign;
    }

    if (config.counterAxisAlign) {
      node.counterAxisAlignItems = config.counterAxisAlign;
    }
  },

  /**
   * HTML要素のデフォルト設定を適用
   * ブロック要素のレイアウト設定とHTML属性（ID、クラス）からのノード名生成を行う
   */
  applyHtmlElementDefaults(
    config: FigmaNodeConfig, 
    tagName: string,
    attributes?: { id?: string; class?: string; [key: string]: unknown }
  ): FigmaNodeConfig {
    const newConfig = { ...config };
    
    // div要素の場合はデフォルトでNONEレイアウト
    if (isDivTag(tagName)) {
      newConfig.layoutMode = 'NONE';
    } else {
      // その他のブロック要素はverticalレイアウト
      newConfig.layoutMode = 'VERTICAL';
      // 通常、親要素の幅いっぱいに広がる
      newConfig.layoutSizingHorizontal = 'FILL';
    }
    
    // IDやクラスをノード名に反映（div要素の場合はtagNameを含めない）
    if (attributes?.id) {
      newConfig.name = isDivTag(tagName) ? `#${attributes.id}` : `${tagName}#${attributes.id}`;
    } else if (attributes?.class) {
      const className = typeof attributes.class === 'string' ? attributes.class : '';
      const firstClass = className.split(' ')[0];
      newConfig.name = isDivTag(tagName) ? `.${firstClass}` : `${tagName}.${firstClass}`;
    }
    
    return newConfig;
  },

  /**
   * パディングスタイルを適用
   * CSSのpadding値をFigmaのパディングプロパティに変換
   */
  applyPaddingStyles(config: FigmaNodeConfig, padding: number | { top?: number; right?: number; bottom?: number; left?: number }): FigmaNodeConfig {
    const newConfig = { ...config };
    
    if (typeof padding === 'number') {
      newConfig.paddingTop = padding;
      newConfig.paddingRight = padding;
      newConfig.paddingBottom = padding;
      newConfig.paddingLeft = padding;
    } else {
      newConfig.paddingTop = padding.top ?? 0;
      newConfig.paddingRight = padding.right ?? 0;
      newConfig.paddingBottom = padding.bottom ?? 0;
      newConfig.paddingLeft = padding.left ?? 0;
    }
    
    return newConfig;
  },

  /**
   * 背景色を適用
   * RGB色をFigmaのfillプロパティに変換
   */
  applyBackgroundColor(config: FigmaNodeConfig, color: { r: number; g: number; b: number }): FigmaNodeConfig {
    const newConfig = { ...config };
    newConfig.fills = [PaintUtil.solid(color)];
    return newConfig;
  },

  /**
   * Flexboxスタイルを適用
   * CSSのflexboxプロパティをFigmaのAuto Layoutに変換
   */
  applyFlexboxStyles(
    config: FigmaNodeConfig,
    options: {
      display?: string;
      flexDirection?: string;
      gap?: number;
      alignItems?: string;
      justifyContent?: string;
    }
  ): FigmaNodeConfig {
    const newConfig = { ...config };
    
    if (options.display === 'flex') {
      // Flex direction
      newConfig.layoutMode = options.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
      
      // Gap
      if (options.gap !== undefined) {
        newConfig.itemSpacing = options.gap;
      }
      
      // Align items (cross axis)
      if (options.alignItems) {
        const alignMap: Record<string, 'MIN' | 'CENTER' | 'MAX' | 'STRETCH'> = {
          'flex-start': 'MIN',
          'center': 'CENTER',
          'flex-end': 'MAX',
          'stretch': 'STRETCH'
        };
        newConfig.counterAxisAlignItems = alignMap[options.alignItems] || 'MIN';
      }
      
      // Justify content (main axis)
      if (options.justifyContent) {
        const justifyMap: Record<string, 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'> = {
          'flex-start': 'MIN',
          'center': 'CENTER',
          'flex-end': 'MAX',
          'space-between': 'SPACE_BETWEEN'
        };
        newConfig.primaryAxisAlignItems = justifyMap[options.justifyContent] || 'MIN';
      }
    }
    
    return newConfig;
  },

  /**
   * ボーダースタイルを適用
   * CSSのborderプロパティをFigmaのstrokes/cornerRadiusに変換
   */
  applyBorderStyles(
    config: FigmaNodeConfig,
    options: {
      border?: { color: { r: number; g: number; b: number }; width: number };
      borderRadius?: number;
    }
  ): FigmaNodeConfig {
    const newConfig = { ...config };
    
    // ボーダー
    if (options.border) {
      newConfig.strokes = [PaintUtil.solid(options.border.color)];
      newConfig.strokeWeight = options.border.width;
    }
    
    // 角丸
    if (options.borderRadius !== undefined) {
      newConfig.cornerRadius = options.borderRadius;
    }
    
    return newConfig;
  },

  /**
   * サイズスタイルを適用
   * CSSのwidth/heightをFigmaのサイズプロパティに変換
   */
  applySizeStyles(
    config: FigmaNodeConfig,
    options: {
      width?: number;
      height?: number;
    }
  ): FigmaNodeConfig {
    const newConfig = { ...config };
    
    if (options.width !== undefined) {
      newConfig.width = options.width;
    }
    
    if (options.height !== undefined) {
      newConfig.height = options.height;
    }
    
    return newConfig;
  }
};
