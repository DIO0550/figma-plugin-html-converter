/**
 * @fileoverview DD要素の属性型定義
 */

import type { GlobalAttributes } from "../../../base/global-attributes/global-attributes";

/**
 * DD要素の属性
 * 現在のHTML5仕様ではDD要素特有の属性は存在しないため、
 * GlobalAttributesを継承した型エイリアスとして定義
 */
export type DdAttributes = GlobalAttributes;
