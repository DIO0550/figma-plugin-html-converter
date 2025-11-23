/**
 * @fileoverview tbody要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * tbody要素の属性インターフェース
 *
 * tbody要素はテーブルのボディセクションを表します。
 * GlobalAttributesのみを継承し、tbody固有の属性はありません。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/tbody
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TbodyAttributes extends GlobalAttributes {}
