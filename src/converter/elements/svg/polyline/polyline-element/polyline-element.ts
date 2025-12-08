import type { FigmaNodeConfig } from "../../../../models/figma-node";
import { FigmaNode } from "../../../../models/figma-node";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import type { PolylineAttributes } from "../polyline-attributes";
import { SvgCoordinateUtils } from "../../utils/svg-coordinate-utils";
import { SvgPaintUtils } from "../../utils/svg-paint-utils";

/**
 * SVG polyline要素の型定義
 */
export interface PolylineElement {
  type: "element";
  tagName: "polyline";
  attributes: PolylineAttributes;
  children?: never;
}

/**
 * PolylineElementコンパニオンオブジェクト
 */
export const PolylineElement = {
  /**
   * 型ガード
   */
  isPolylineElement(node: unknown): node is PolylineElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "polyline"
    );
  },

  /**
   * ファクトリーメソッド
   */
  create(attributes: Partial<PolylineAttributes> = {}): PolylineElement {
    return {
      type: "element",
      tagName: "polyline",
      attributes: attributes as PolylineAttributes,
    };
  },

  /**
   * points属性を取得
   */
  getPoints(element: PolylineElement): string {
    return element.attributes.points ?? "";
  },

  /**
   * PolylineElementをFigmaのFRAMEノードに変換
   *
   * SVG polyline要素は開いた折れ線を表現します（最初と最後の点は接続されない）。
   * FigmaのVECTORノードは複雑なvectorNetworkの設定が必要なため、
   * 境界ボックスを計算してFRAMEノードで表現する設計を採用しています。
   *
   * @param element 変換するPolyline要素
   * @returns FigmaノードConfig（FRAMEタイプ）
   */
  toFigmaNode(element: PolylineElement): FigmaNodeConfig {
    const pointsString = this.getPoints(element);
    const points = SvgCoordinateUtils.parsePoints(pointsString);
    const bounds = SvgCoordinateUtils.calculatePointsBounds(points);

    const config = FigmaNode.createFrame("polyline");

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
      "polyline",
      this.isPolylineElement,
      this.create,
      (element) => this.toFigmaNode(element),
    );
  },
};
