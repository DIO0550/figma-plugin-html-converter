import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { EllipseAttributes } from "../ellipse-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * SVG ellipse要素の型定義
 */
export interface EllipseElement {
  type: "element";
  tagName: "ellipse";
  attributes: EllipseAttributes;
  children?: never;
}

/**
 * EllipseElementコンパニオンオブジェクト
 */
export const EllipseElement = {
  /**
   * 型ガード
   */
  isEllipseElement(node: unknown): node is EllipseElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "ellipse"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<EllipseAttributes> = {}): EllipseElement {
    return {
      type: "element",
      tagName: "ellipse",
      attributes: attributes as EllipseAttributes,
    };
  },

  /**
   * cx属性を数値として取得
   */
  getCx(element: EllipseElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.cx, 0);
  },

  /**
   * cy属性を数値として取得
   */
  getCy(element: EllipseElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.cy, 0);
  },

  /**
   * rx属性を数値として取得
   */
  getRx(element: EllipseElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.rx, 0);
  },

  /**
   * ry属性を数値として取得
   */
  getRy(element: EllipseElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.ry, 0);
  },

  /**
   * FigmaNodeConfigへの変換
   * SVGの楕円は Figma の RECTANGLE + cornerRadius で表現
   */
  toFigmaNode(element: EllipseElement): FigmaNodeConfig {
    const cx = this.getCx(element);
    const cy = this.getCy(element);
    const rx = this.getRx(element);
    const ry = this.getRy(element);

    // 境界ボックスを計算
    const bounds = SvgCoordinateUtils.calculateEllipseBounds(cx, cy, rx, ry);

    // RECTANGLEノードを作成（cornerRadiusで楕円形を表現）
    const config = FigmaNode.createRectangle("ellipse");

    // 位置とサイズを設定
    config.x = bounds.x;
    config.y = bounds.y;
    config.width = bounds.width;
    config.height = bounds.height;

    // FigmaのRECTANGLEノードでは、cornerRadiusで円形にはできるが楕円（rx ≠ ry）は正確に再現できません
    // そのため、SVG楕円要素（ellipse）の近似として、半径の小さい方をcornerRadiusに設定し「円形に近い角丸矩形」として表現します
    // 注意: rx ≠ ry の場合、Figma上では本来の楕円形状にはなりません（円形の近似のみ）
    const cornerRadius = Math.min(rx, ry);
    config.cornerRadius = cornerRadius;

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
      "ellipse",
      this.isEllipseElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
