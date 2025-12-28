import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * abbr要素の属性定義
 * HTMLのabbr要素はグローバル属性のみを持ち、
 * titleはグローバル属性として既に定義されています
 * （略語の説明を提供するために使用）
 */
export type AbbrAttributes = GlobalAttributes;
