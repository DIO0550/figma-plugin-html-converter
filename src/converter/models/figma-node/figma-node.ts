// Figmaノードタイプ
export type NodeType = 'FRAME' | 'TEXT' | 'RECTANGLE' | 'GROUP';

// Constraints設定
export interface Constraints {
  horizontal: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
  vertical: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
}

// FigmaNodeConfigをre-export
export { FigmaNodeConfig } from './config/figma-node-config';
export { AutoLayoutConfig } from './config/figma-node-config';
// コンパニオンオブジェクトをFigmaNodeとしてre-export
export { FigmaNodeConfig as FigmaNode } from './config/figma-node-config';