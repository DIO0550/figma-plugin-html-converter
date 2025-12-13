import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG defs（定義）要素の属性インターフェース
 * defs要素は直接描画されず、グラデーション、パターン、シンボル等の定義を含む
 *
 * defs要素固有の属性はないが、子要素への属性継承のためにSvgBaseAttributesを拡張
 */
export type DefsAttributes = SvgBaseAttributes;
