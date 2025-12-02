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
   * EllipseElementをFigmaのRECTANGLEノードに変換
   *
   * 設計判断: FigmaにはELLIPSEノードが存在しますが、このコンバーターでは
   * 他のSVG図形要素との一貫性を保つため、RECTANGLE + cornerRadiusで楕円を近似表現します。
   * 制限: rx ≠ ry の場合、Figmaでは正確な楕円にならず角丸矩形として表現されます。
   *
   * @param element 変換するEllipse要素
   * @returns FigmaノードConfig
   */
  toFigmaNode(element: EllipseElement): FigmaNodeConfig {
    const cx = this.getCx(element);
    const cy = this.getCy(element);
    const rx = this.getRx(element);
    const ry = this.getRy(element);

    const bounds = SvgCoordinateUtils.calculateEllipseBounds(cx, cy, rx, ry);

    const config = FigmaNode.createRectangle("ellipse");

    config.x = bounds.x;
    config.y = bounds.y;
    config.width = bounds.width;
    config.height = bounds.height;

    // 意図: 小さい方の半径を使用し、できるだけ楕円に近い形状を実現
    const cornerRadius = Math.min(rx, ry);
    config.cornerRadius = cornerRadius;

    SvgPaintUtils.applyPaintToNode(config, element.attributes);

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
