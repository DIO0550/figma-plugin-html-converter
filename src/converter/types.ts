// 新しいモジュールから型をエクスポート
export { HTMLNode } from './models/html-node';
export { 
  FigmaNodeConfig, 
  NodeType,
  AutoLayoutConfig 
} from './models/figma-node';
export { RGB, RGBA, HSL } from './models/colors';
export type { Paint } from './models/paint';

// フォント名の型定義
export interface FontName {
  family: string;
  style: string;
}

// ConversionOptionsを専用モジュールからエクスポート
export { ConversionOptions } from './models/conversion-options';
export type { ConversionOptions as ConversionOptionsType } from './models/conversion-options';