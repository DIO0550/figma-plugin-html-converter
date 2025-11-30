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
   * 角丸の半径を取得（rx/ryの処理）
   * SVGの仕様に従い、rxのみ指定された場合はryも同じ値になる
   */
  getCornerRadius(element: RectElement): number | undefined {
    const rx = this.getRx(element);
    const ry = this.getRy(element);

    // rxが指定されていればrxを使用
    if (rx !== undefined) return rx;
    // ryのみ指定されていればryを使用
    if (ry !== undefined) return ry;
    // どちらも未指定なら角丸なし
    return undefined;
  },

  /**
   * FigmaNodeConfigへの変換
   */
  toFigmaNode(element: RectElement): FigmaNodeConfig {
    const x = this.getX(element);
    const y = this.getY(element);
    const width = this.getWidth(element);
    const height = this.getHeight(element);

    // RECTANGLEノードを作成
    const config = FigmaNode.createRectangle("rect");

    // 位置とサイズを設定
    config.x = x;
    config.y = y;
    config.width = width;
    config.height = height;

    // 角丸を設定
    const cornerRadius = this.getCornerRadius(element);
    if (cornerRadius !== undefined) {
      config.cornerRadius = cornerRadius;
    }

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
      "rect",
      this.isRectElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
