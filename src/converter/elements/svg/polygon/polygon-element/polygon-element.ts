import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { PolygonAttributes } from "../polygon-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * SVG polygon要素の型定義
 */
export interface PolygonElement {
  type: "element";
  tagName: "polygon";
  attributes: PolygonAttributes;
  children?: never;
}

/**
 * PolygonElementコンパニオンオブジェクト
 */
export const PolygonElement = {
  /**
   * 型ガード
   */
  isPolygonElement(node: unknown): node is PolygonElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "polygon"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<PolygonAttributes> = {}): PolygonElement {
    return {
      type: "element",
      tagName: "polygon",
      attributes: attributes as PolygonAttributes,
    };
  },

  /**
   * points属性を取得
   */
  getPoints(element: PolygonElement): string {
    return element.attributes.points ?? "";
  },

  /**
   * PolygonElementをFigmaのFRAMEノードに変換
   *
   * SVG polygon要素は閉じた多角形を表現します。
   * FigmaのVECTORノードは複雑なvectorNetworkの設定が必要なため、
   * 境界ボックスを計算してFRAMEノードで表現する設計を採用しています。
   *
   * @param element 変換するPolygon要素
   * @returns FigmaノードConfig（FRAMEタイプ）
   */
  toFigmaNode(element: PolygonElement): FigmaNodeConfig {
    const pointsString = this.getPoints(element);
    const points = SvgCoordinateUtils.parsePoints(pointsString);
    const bounds = SvgCoordinateUtils.calculatePointsBounds(points);

    const config = FigmaNode.createFrame("polygon");

    config.x = bounds.x;
    config.y = bounds.y;
    config.width = bounds.width;
    config.height = bounds.height;

    SvgPaintUtils.applyPaintToNode(config, element.attributes);

    return config;
  },

  /**
   * マッピング関数
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "polygon",
      this.isPolygonElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
