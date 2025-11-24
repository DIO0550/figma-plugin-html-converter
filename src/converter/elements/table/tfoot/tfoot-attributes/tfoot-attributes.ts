/**
 * @fileoverview tfoot要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * tfoot要素の属性インターフェース
 *
 * tfoot要素はテーブルのフッターセクションを表します。
 * GlobalAttributesのみを継承し、tfoot固有の属性はありません。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/tfoot
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TfootAttributes extends GlobalAttributes {}
