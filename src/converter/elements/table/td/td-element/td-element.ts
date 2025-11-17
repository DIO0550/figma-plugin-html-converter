import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { TdAttributes } from "../td-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * td要素の型定義
 * BaseElementを継承した専用の型
 */
export interface TdElement extends BaseElement<"td", TdAttributes> {
  children: TdElement[] | [];
}

/**
 * TdElementコンパニオンオブジェクト
 */
export const TdElement = {
  /**
   * TdElement型ガード
   *
   * 与えられたオブジェクトがTdElementかどうかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns TdElementの場合true、それ以外はfalse
   */
  isTdElement(node: unknown): node is TdElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "td"
    );
  },

  /**
   * TdElementファクトリメソッド
   *
   * 新しいTdElementインスタンスを作成します。
   *
   * @param attributes - td要素の属性（省略可）
   * @returns 新しいTdElement
   */
  create(attributes: Partial<TdAttributes> = {}): TdElement {
    return {
      type: "element",
      tagName: "td",
      attributes: attributes as TdAttributes,
      children: [],
    };
  },

  /**
   * TdElementをFigmaNodeConfigに変換
   *
   * td要素をFigma FrameNodeに変換します。
   * スタイル属性（border、background-color、padding、width、height）が適用されます。
   *
   * @param element - 変換対象のTdElement
   * @returns 変換されたFigmaNodeConfig
   */
  toFigmaNode(element: TdElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame("td");
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "td",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * unknown型のノードをTdElementに変換し、FigmaNodeConfigにマッピング
   *
   * @param node - 変換対象のノード
   * @returns FigmaNodeConfig または null
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "td",
      this.isTdElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
