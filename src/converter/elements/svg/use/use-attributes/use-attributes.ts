import type { SvgBaseAttributes } from "../../svg-attributes";

/**
 * SVG use（再利用）要素の属性インターフェース
 *
 * use要素はdefs内で定義された要素を参照し、再利用する
 * href/xlink:href属性で参照先を指定し、x/y属性で配置位置を調整できる
 */
export interface UseAttributes extends SvgBaseAttributes {
  /**
   * 参照先要素のID（#付きのフラグメント識別子）
   * 例: "#myRect", "#symbol1"
   */
  href?: string;

  /**
   * 参照先要素のID（xlink名前空間、レガシー互換性のため）
   * @deprecated SVG2ではhref属性を推奨
   */
  "xlink:href"?: string;

  /**
   * 参照要素の配置X座標
   * @default 0
   */
  x?: string | number;

  /**
   * 参照要素の配置Y座標
   * @default 0
   */
  y?: string | number;

  /**
   * 参照要素の幅（symbol要素参照時に有効）
   */
  width?: string | number;

  /**
   * 参照要素の高さ（symbol要素参照時に有効）
   */
  height?: string | number;
}
