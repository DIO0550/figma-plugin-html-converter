/**
 * @fileoverview thead要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * thead要素の属性インターフェース
 *
 * thead要素はテーブルのヘッダーセクションを表します。
 * GlobalAttributesのみを継承し、thead固有の属性はありません。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/thead
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TheadAttributes extends GlobalAttributes {}
