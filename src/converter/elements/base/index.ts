/**
 * Base element types and utilities
 * 基底要素の型定義とユーティリティ
 */

export type { BaseElement } from './base-element';
export type { GlobalAttributes } from './global-attributes';
export type {
  ExtractTagName,
  IsVoidElement,
  ElementChildren,
  StrictAttributes,
  HTMLTagName
} from './type-utils';
export {
  isBaseElement,
  isVoidElement
} from './type-utils';