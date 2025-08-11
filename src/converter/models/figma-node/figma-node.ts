import type { Paint } from '../paint';

// Figmaノードタイプ
export type NodeType = 'FRAME' | 'TEXT' | 'RECTANGLE' | 'GROUP';

// Constraints設定
export interface Constraints {
  horizontal: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
  vertical: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
}

// Figmaノード設定の型定義
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
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX';
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

// Auto Layout設定
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
  counterAxisAlign?: 'MIN' | 'CENTER' | 'MAX';
}

// FigmaNodeのコンパニオンオブジェクト
export const FigmaNode = {
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
  }
};