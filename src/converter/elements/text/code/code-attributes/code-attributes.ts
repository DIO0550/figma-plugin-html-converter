import type { GlobalAttributes } from "../../../base/global-attributes";

/**
 * code要素の属性
 * HTMLのcode（インラインコード）要素を表現します
 *
 * @remarks
 * code要素は特有の属性を持たず、GlobalAttributesのみを継承します。
 * モノスペースフォント、背景色、パディングなどの視覚的スタイルは
 * デフォルトスタイルとして適用されます。
 *
 * @example
 * ```typescript
 * const attributes: CodeAttributes = {
 *   class: "language-typescript",
 *   style: "font-size: 14px;"
 * };
 * ```
 */
export type CodeAttributes = GlobalAttributes;
