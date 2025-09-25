/**
 * テキスト要素のコンバーターの統合エクスポート
 */

// 段落要素のコンバーター
export {
  ParagraphChildConverter,
  ParagraphChildResult,
  type ParagraphChildResult as ParagraphChildResultType,
} from "./paragraph-child-converter";

// 見出し要素のコンバーター
export {
  HeadingChildConverter,
  HeadingChildResult,
  type HeadingChildResult as HeadingChildResultType,
} from "./heading-child-converter";

// カテゴリ判定
export {
  ElementCategory,
  type ElementCategory as ElementCategoryType,
} from "./element-category";

// 統合コンバーター
export { ElementContextConverter } from "./element-context-converter";
