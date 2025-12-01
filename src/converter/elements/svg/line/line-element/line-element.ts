import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { Paint } from "../../../../models/paint";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { LineAttributes } from "../line-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * SVG仕様に基づくデフォルト値
 */
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
   * FigmaNodeConfigへの変換
   * SVGのlineはFigmaのFrameで表現（Figmaには純粋なLineノードがないため）
   */
  toFigmaNode(element: LineElement): FigmaNodeConfig {
    const x1 = this.getX1(element);
    const y1 = this.getY1(element);
    const x2 = this.getX2(element);
    const y2 = this.getY2(element);

    // 境界ボックスを計算
    const bounds = SvgCoordinateUtils.calculateLineBounds(x1, y1, x2, y2);

    // FRAMEノードを作成（Figmaには純粋なLineノードがないため）
    const config = FigmaNode.createFrame("line");

    // 位置とサイズを設定
    config.x = bounds.x;
    config.y = bounds.y;
    config.width = bounds.width;
    config.height = bounds.height;

    // stroke を適用（lineは基本的にstrokeで描画）
    const strokes = SvgPaintUtils.createStrokes(element.attributes);
    if (strokes.length > 0) {
      config.strokes = strokes;
      config.strokeWeight = SvgPaintUtils.getStrokeWeight(element.attributes);
    } else {
      // strokeが指定されていない場合、デフォルトで黒のストロークを設定
      config.strokes = [Paint.solid(DEFAULT_LINE_STROKE_COLOR)];
      config.strokeWeight = DEFAULT_LINE_STROKE_WEIGHT;
    }

    // lineはfillを持たない
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
