import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG clipPath（クリッピングパス）要素の属性インターフェース
 *
 * clipPath要素はdefs内で定義され、他の要素のclip-path属性から参照される
 * 内部に図形要素を持ち、その形状でクリッピングを行う
 */
export interface ClipPathAttributes extends SvgBaseAttributes {
  /**
   * クリッピングパスの座標系を指定
   * - "userSpaceOnUse": クリッピングパスの座標はユーザー座標系を使用
   * - "objectBoundingBox": クリッピング対象要素のバウンディングボックスを基準とした相対座標
   * @default "userSpaceOnUse"
   */
  clipPathUnits?: "userSpaceOnUse" | "objectBoundingBox";
}
