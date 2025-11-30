import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { CircleAttributes } from "../circle-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * SVG circle要素の型定義
 */
export interface CircleElement {
  type: "element";
  tagName: "circle";
  attributes: CircleAttributes;
  children?: never;
}

/**
 * CircleElementコンパニオンオブジェクト
 */
export const CircleElement = {
  /**
   * 型ガード
   */
  isCircleElement(node: unknown): node is CircleElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "circle"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<CircleAttributes> = {}): CircleElement {
    return {
      type: "element",
      tagName: "circle",
      attributes: attributes as CircleAttributes,
    };
  },

  /**
   * cx属性を数値として取得
   */
  getCx(element: CircleElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.cx, 0);
  },

  /**
   * cy属性を数値として取得
   */
  getCy(element: CircleElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.cy, 0);
  },

  /**
   * r属性を数値として取得
   */
  getR(element: CircleElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.r, 0);
  },

  /**
   * FigmaNodeConfigへの変換
   * SVGの円は Figma の RECTANGLE + cornerRadius で表現
   */
  toFigmaNode(element: CircleElement): FigmaNodeConfig {
    const cx = this.getCx(element);
    const cy = this.getCy(element);
    const r = this.getR(element);

    // 境界ボックスを計算
    const bounds = SvgCoordinateUtils.calculateCircleBounds(cx, cy, r);

    // RECTANGLEノードを作成（cornerRadiusで円形を表現）
    const config = FigmaNode.createRectangle("circle");

    // 位置とサイズを設定
    config.x = bounds.x;
    config.y = bounds.y;
    config.width = bounds.width;
    config.height = bounds.height;

    // 円形にするためにcornerRadiusを半径に設定
    config.cornerRadius = r;

    // fill を適用
    config.fills = SvgPaintUtils.createFills(element.attributes);

    // stroke を適用
    const strokes = SvgPaintUtils.createStrokes(element.attributes);
    if (strokes.length > 0) {
      config.strokes = strokes;
      config.strokeWeight = SvgPaintUtils.getStrokeWeight(element.attributes);
    }

    return config;
  },

  /**
   * マッピング関数
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "circle",
      this.isCircleElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
