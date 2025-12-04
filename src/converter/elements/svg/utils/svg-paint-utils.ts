import { Colors } from "../../../models/colors";
import type { FigmaNodeConfig } from "../../../models/figma-node";
import { Paint, type SolidPaint } from "../../../models/paint";
import { SvgAttributes, type SvgBaseAttributes } from "../svg-attributes";

/**
 * SVG仕様に基づくデフォルト値
 */
const DEFAULT_FILL_COLOR = "black";
const DEFAULT_STROKE_WIDTH = 1;
const FALLBACK_COLOR = { r: 0, g: 0, b: 0 };

/**
 * SVGのfill/stroke属性をFigmaのPaintに変換するユーティリティ
 */
export const SvgPaintUtils = {
  /**
   * fill属性からPaintを生成
   * @param attributes SVG属性
   * @returns SolidPaint または null（fill="none"の場合）
   */
  parseFillToPaint(attributes: SvgBaseAttributes): SolidPaint | null {
    // fill="none" の場合
    if (SvgAttributes.isFillNone(attributes)) {
      return null;
    }

    const fillValue = SvgAttributes.getFill(attributes);

    // fillが未定義の場合、デフォルトは黒
    const colorString = fillValue ?? DEFAULT_FILL_COLOR;
    const color = Colors.parse(colorString);

    if (!color) {
      // パースできない場合は黒
      return Paint.solid(FALLBACK_COLOR);
    }

    const paint = Paint.solid(color);

    // fill-opacityの適用
    const fillOpacity = SvgAttributes.getFillOpacity(attributes);
    if (fillOpacity !== undefined) {
      paint.opacity = fillOpacity;
    }

    return paint;
  },

  /**
   * stroke属性からPaintを生成
   * @param attributes SVG属性
   * @returns SolidPaint または null（strokeが未定義または"none"の場合）
   */
  parseStrokeToPaint(attributes: SvgBaseAttributes): SolidPaint | null {
    // stroke="none" の場合
    if (SvgAttributes.isStrokeNone(attributes)) {
      return null;
    }

    const strokeValue = SvgAttributes.getStroke(attributes);

    // strokeが未定義の場合、nullを返す（SVGのデフォルトはstrokeなし）
    if (strokeValue === undefined) {
      return null;
    }

    const color = Colors.parse(strokeValue);

    if (!color) {
      // パースできない場合は黒
      return Paint.solid(FALLBACK_COLOR);
    }

    const paint = Paint.solid(color);

    // stroke-opacityの適用
    const strokeOpacity = SvgAttributes.getStrokeOpacity(attributes);
    if (strokeOpacity !== undefined) {
      paint.opacity = strokeOpacity;
    }

    return paint;
  },

  /**
   * stroke-widthの値を取得
   *
   * stroke-width: 0 は有効な値として扱われ、0を返します。
   * Figmaでは strokeWeight: 0 の場合、ストロークは描画されません。
   *
   * @param attributes SVG属性
   * @returns ストロークの太さ（デフォルト: 1、0も有効値）
   */
  getStrokeWeight(attributes: SvgBaseAttributes): number {
    const strokeWidth = SvgAttributes.getStrokeWidth(attributes);
    return strokeWidth ?? DEFAULT_STROKE_WIDTH;
  },

  /**
   * fillからFigmaのfills配列を生成
   * @param attributes SVG属性
   * @returns Paint配列
   */
  createFills(attributes: SvgBaseAttributes): SolidPaint[] {
    const paint = this.parseFillToPaint(attributes);
    return paint ? [paint] : [];
  },

  /**
   * strokeからFigmaのstrokes配列を生成
   * @param attributes SVG属性
   * @returns Paint配列
   */
  createStrokes(attributes: SvgBaseAttributes): SolidPaint[] {
    const paint = this.parseStrokeToPaint(attributes);
    return paint ? [paint] : [];
  },

  /**
   * fill/strokeをFigmaNodeConfigに一括適用
   *
   * このメソッドは渡されたconfigオブジェクトを直接変更（ミューテート）します。
   * これは、FigmaNodeConfigの構築パターンに合わせた設計判断であり、
   * 各要素のtoFigmaNodeメソッド内でconfigを段階的に構築する際の
   * コード重複を削減するためのヘルパーとして機能します。
   *
   * @param config 適用先のFigmaノード設定（直接変更されます）
   * @param attributes SVG属性
   */
  applyPaintToNode(
    config: FigmaNodeConfig,
    attributes: SvgBaseAttributes,
  ): void {
    config.fills = this.createFills(attributes);
    const strokes = this.createStrokes(attributes);
    if (strokes.length > 0) {
      config.strokes = strokes;
      config.strokeWeight = this.getStrokeWeight(attributes);
    }
  },
};
