import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * section要素の属性定義
 * HTML Living Standard準拠
 *
 * section要素は固有の属性を持たず、グローバル属性のみを受け入れる
 * 文書のセクションを表すセマンティック要素
 * 将来的な拡張性と型の明確性のため、型エイリアスとして定義
 */
export type SectionAttributes = GlobalAttributes;