import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG g（グループ）要素の属性インターフェース
 * グループ要素は子要素を持ち、transform属性でグループ全体に変換を適用できる
 *
 * g要素固有の属性はないが、子要素への属性継承のためにSvgBaseAttributesを拡張
 * transform, fill, stroke等はSvgBaseAttributesから継承
 */
export type GroupAttributes = SvgBaseAttributes;
