import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { RectAttributes } from "../rect-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * SVG rect要素の型定義
 */
export interface RectElement {
  type: "element";
  tagName: "rect";
  attributes: RectAttributes;
  children?: never;
}

/**
 * RectElementコンパニオンオブジェクト
 */
export const RectElement = {
  /**
   * 型ガード
   */
  isRectElement(node: unknown): node is RectElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "rect"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<RectAttributes> = {}): RectElement {
    return {
      type: "element",
      tagName: "rect",
      attributes: attributes as RectAttributes,
    };
  },

  /**
   * x属性を数値として取得
   */
  getX(element: RectElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.x, 0);
  },

  /**
   * y属性を数値として取得
   */
  getY(element: RectElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(element.attributes.y, 0);
  },

  /**
   * width属性を数値として取得
   */
  getWidth(element: RectElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(
      element.attributes.width,
      0,
    );
  },

  /**
   * height属性を数値として取得
   */
  getHeight(element: RectElement): number {
    return SvgCoordinateUtils.parseNumericAttribute(
      element.attributes.height,
      0,
    );
  },

  /**
   * rx属性を数値として取得
   */
  getRx(element: RectElement): number | undefined {
    const rx = element.attributes.rx;
    if (rx === undefined) return undefined;
    return SvgCoordinateUtils.parseNumericAttribute(rx, 0);
  },

  /**
   * ry属性を数値として取得
   */
  getRy(element: RectElement): number | undefined {
    const ry = element.attributes.ry;
    if (ry === undefined) return undefined;
    return SvgCoordinateUtils.parseNumericAttribute(ry, 0);
  },

  /**
   * 角丸半径を取得
   *
   * Figmaは単一のcornerRadiusのみをサポートしているため、
   * SVG仕様に従いrx属性を優先し、rxがなければry属性を使用します。
   * rx≠ryの場合、Figmaでは正確な楕円角丸にならない制限があります。
   *
   * @param element Rect要素
   * @returns 角丸半径（rx優先、なければry、どちらもなければundefined）
   */
  getCornerRadius(element: RectElement): number | undefined {
    const rx = this.getRx(element);
    const ry = this.getRy(element);

    if (rx !== undefined) return rx;
    if (ry !== undefined) return ry;
    return undefined;
  },

  /**
   * RectElementをFigmaのRECTANGLEノードに変換
   * @param element 変換するRect要素
   * @returns FigmaノードConfig
   */
  toFigmaNode(element: RectElement): FigmaNodeConfig {
    const x = this.getX(element);
    const y = this.getY(element);
    const width = this.getWidth(element);
    const height = this.getHeight(element);

    const config = FigmaNode.createRectangle("rect");

    config.x = x;
    config.y = y;
    config.width = width;
    config.height = height;

    const cornerRadius = this.getCornerRadius(element);
    if (cornerRadius !== undefined) {
      config.cornerRadius = cornerRadius;
    }

    SvgPaintUtils.applyPaintToNode(config, element.attributes);

    return config;
  },

  /**
   * マッピング関数
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "rect",
      this.isRectElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
