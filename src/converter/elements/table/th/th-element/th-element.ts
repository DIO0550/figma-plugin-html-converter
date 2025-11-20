import { FigmaNodeConfig, FigmaNode } from "../../../../models/figma-node";
import type { ThAttributes } from "../th-attributes";
import type { BaseElement } from "../../../base/base-element";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * th要素の型定義
 * BaseElementを継承した専用の型
 */
export interface ThElement extends BaseElement<"th", ThAttributes> {
  children?: ThElement[];
}

/**
 * ThElementコンパニオンオブジェクト
 */
export const ThElement = {
  /**
   * ThElement型ガード
   *
   * 与えられたオブジェクトがThElementかどうかを判定します。
   *
   * @param node - 判定対象のオブジェクト
   * @returns ThElementの場合true、それ以外はfalse
   */
  isThElement(node: unknown): node is ThElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "th"
    );
  },

  /**
   * ThElementファクトリメソッド
   *
   * 新しいThElementインスタンスを作成します。
   *
   * @param attributes - th要素の属性（省略可）
   * @returns 新しいThElement
   */
  create(attributes: Partial<ThAttributes> = {}): ThElement {
    return {
      type: "element",
      tagName: "th",
      attributes: attributes as ThAttributes,
      children: [],
    };
  },

  /**
   * ThElementをFigmaNodeConfigに変換
   *
   * th要素をFigma FrameNodeに変換します。
   * scope属性に基づくノード命名とHTML属性からのスタイル適用を行います。
   *
   * @param element - 変換対象のThElement
   * @returns 変換されたFigmaNodeConfig
   */
  toFigmaNode(element: ThElement): FigmaNodeConfig {
    return toFigmaNodeWith(
      element,
      (el) => {
        const config = FigmaNode.createFrame(
          el.attributes?.scope ? `th-${el.attributes.scope}` : "th",
        );
        return FigmaNodeConfig.applyHtmlElementDefaults(
          config,
          "th",
          el.attributes,
        );
      },
      {
        applyCommonStyles: true,
      },
    );
  },

  /**
   * unknown型のノードをThElementに変換し、FigmaNodeConfigにマッピング
   *
   * @param node - 変換対象のノード
   * @returns FigmaNodeConfig または null
   */
  mapToFigma(node: unknown): FigmaNodeConfig | null {
    return mapToFigmaWith(
      node,
      "th",
      this.isThElement,
      this.create,
      this.toFigmaNode,
    );
  },
};
