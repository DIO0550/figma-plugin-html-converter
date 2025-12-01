import type { GlobalAttributes } from "../../base/global-attributes/global-attributes";

/**
 * SVG要素の共通属性
 * すべてのSVG図形要素で使用可能な属性
 */
export interface SvgPresentationAttributes {
  // 塗りつぶし
  fill?: string;
  "fill-opacity"?: string | number;
  "fill-rule"?: "nonzero" | "evenodd";

  // 線
  stroke?: string;
  "stroke-width"?: string | number;
  "stroke-opacity"?: string | number;
  "stroke-linecap"?: "butt" | "round" | "square";
  "stroke-linejoin"?: "miter" | "round" | "bevel";
  "stroke-dasharray"?: string;
  "stroke-dashoffset"?: string | number;
  "stroke-miterlimit"?: string | number;

  // 不透明度
  opacity?: string | number;

  // 変形
  transform?: string;

  // 表示
  visibility?: "visible" | "hidden" | "collapse";
  display?: string;
}

/**
 * SVG要素のベース属性
 * GlobalAttributesとSVG固有の属性を組み合わせたもの
 */
export type SvgBaseAttributes = GlobalAttributes & SvgPresentationAttributes;

// opacity値をパースして0-1の範囲に正規化するヘルパー
function parseOpacity(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(parsed)) return undefined;
  return Math.max(0, Math.min(1, parsed));
}

/**
 * SvgAttributesコンパニオンオブジェクト
 */
export const SvgAttributes = {
  /**
   * fill属性の値を取得
   */
  getFill(attributes: SvgBaseAttributes): string | undefined {
    return attributes.fill;
  },

  /**
   * stroke属性の値を取得
   */
  getStroke(attributes: SvgBaseAttributes): string | undefined {
    return attributes.stroke;
  },

  /**
   * stroke-width属性の値を取得（数値として）
   */
  getStrokeWidth(attributes: SvgBaseAttributes): number | undefined {
    const value = attributes["stroke-width"];
    if (value === undefined) return undefined;
    const parsed = typeof value === "number" ? value : parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  },

  /**
   * opacity属性の値を取得（0-1の数値として）
   */
  getOpacity(attributes: SvgBaseAttributes): number | undefined {
    return parseOpacity(attributes.opacity);
  },

  /**
   * fill-opacity属性の値を取得（0-1の数値として）
   */
  getFillOpacity(attributes: SvgBaseAttributes): number | undefined {
    return parseOpacity(attributes["fill-opacity"]);
  },

  /**
   * stroke-opacity属性の値を取得（0-1の数値として）
   */
  getStrokeOpacity(attributes: SvgBaseAttributes): number | undefined {
    return parseOpacity(attributes["stroke-opacity"]);
  },

  /**
   * fillがnoneかどうかを判定
   */
  isFillNone(attributes: SvgBaseAttributes): boolean {
    return attributes.fill === "none";
  },

  /**
   * strokeがnoneかどうかを判定
   */
  isStrokeNone(attributes: SvgBaseAttributes): boolean {
    return attributes.stroke === "none";
  },

  /**
   * stroke-linecap属性の値を取得
   */
  getStrokeLinecap(
    attributes: SvgBaseAttributes,
  ): "butt" | "round" | "square" | undefined {
    return attributes["stroke-linecap"];
  },

  /**
   * stroke-linejoin属性の値を取得
   */
  getStrokeLinejoin(
    attributes: SvgBaseAttributes,
  ): "miter" | "round" | "bevel" | undefined {
    return attributes["stroke-linejoin"];
  },

  /**
   * transform属性の値を取得
   */
  getTransform(attributes: SvgBaseAttributes): string | undefined {
    return attributes.transform;
  },
};
