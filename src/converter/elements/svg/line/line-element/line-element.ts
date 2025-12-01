import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { Paint } from "../../../../models/paint";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { LineAttributes } from "../line-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

// SVG line要素のデフォルト値（stroke未指定時に使用）
const DEFAULT_LINE_STROKE_COLOR = { r: 0, g: 0, b: 0 };
const DEFAULT_LINE_STROKE_WEIGHT = 1;

/**
 * SVG line要素の型定義
 */
export interface LineElement {
  type: "element";
  tagName: "line";
  attributes: LineAttributes;
  children?: never;
}

/**
 * LineElementコンパニオンオブジェクト
 */
export const LineElement = {
  /**
   * 型ガード
   */
  isLineElement(node: unknown): node is LineElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "line"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<LineAttributes> = {}): LineElement {
    return {
      type: "element",
      tagName: "line",
      attributes: attributes as LineAttributes,
    };
  },

  /**
   * x1属性を数値として取得
   */
  getX1(element: LineElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.x1, 0);
  },

  /**
   * y1属性を数値として取得
   */
  getY1(element: LineElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.y1, 0);
  },

  /**
   * x2属性を数値として取得
   */
  getX2(element: LineElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.x2, 0);
  },

  /**
   * y2属性を数値として取得
   */
  getY2(element: LineElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.y2, 0);
  },

  /**
   * LineElementをFigmaのFRAMEノードに変換
   * FigmaにはLINEノードがないため、FRAMEで線を表現
   * line要素は常にstrokeで描画され、fillは持たない
   * @param element 変換するLine要素
   * @returns FigmaノードConfig
   */
  toFigmaNode(element: LineElement): FigmaNodeConfig {
    const x1 = this.getX1(element);
    const y1 = this.getY1(element);
    const x2 = this.getX2(element);
    const y2 = this.getY2(element);

    const bounds = SvgCoordinateUtils.calculateLineBounds(x1, y1, x2, y2);

    const config = FigmaNode.createFrame("line");

    config.x = bounds.x;
    config.y = bounds.y;
    config.width = bounds.width;
    config.height = bounds.height;

    // 意図: stroke未指定時はSVG仕様に従いデフォルト黒を適用
    const strokes = SvgPaintUtils.createStrokes(element.attributes);
    if (strokes.length > 0) {
      config.strokes = strokes;
      config.strokeWeight = SvgPaintUtils.getStrokeWeight(element.attributes);
    } else {
      config.strokes = [Paint.solid(DEFAULT_LINE_STROKE_COLOR)];
      config.strokeWeight = DEFAULT_LINE_STROKE_WEIGHT;
    }

    config.fills = [];

    return config;
  },

  /**
   * マッピング関数
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "line",
      this.isLineElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
