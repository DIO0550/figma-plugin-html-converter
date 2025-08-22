import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * div要素の属性定義
 * HTML Living Standard準拠
 *
 * div要素は固有の属性を持たず、グローバル属性のみを受け入れる
 * 将来的な拡張性と型の明確性のため、型エイリアスとして定義
 */
export type DivAttributes = GlobalAttributes;
