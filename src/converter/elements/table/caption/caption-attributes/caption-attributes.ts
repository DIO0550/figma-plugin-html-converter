/**
 * @fileoverview caption要素の属性定義
 */

import type { GlobalAttributes } from "../../../base";

/**
 * caption要素の属性インターフェース
 *
 * caption要素はテーブルのキャプション（説明文）を表します。
 * GlobalAttributesのみを継承し、caption固有の属性はありません。
 *
 * @see https://developer.mozilla.org/ja/docs/Web/HTML/Element/caption
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CaptionAttributes extends GlobalAttributes {}
