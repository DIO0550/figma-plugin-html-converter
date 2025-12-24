import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { SampAttributes } from "../samp-attributes";

/**
 * samp要素の型定義
 * HTMLのsamp（サンプル出力）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface SampElement extends BaseElement<"samp", SampAttributes> {
  children?: HTMLNode[];
}

/**
 * samp要素のコンパニオンオブジェクト
 */
export const SampElement = {
  /**
   * 型ガード: 与えられたノードがSampElementかどうかを判定
   */
  isSampElement(node: unknown): node is SampElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "samp"
    );
  },

  /**
   * ファクトリー: SampElementを作成
   */
  create(
    attributes: Partial<SampAttributes> = {},
    children: HTMLNode[] = [],
  ): SampElement {
    const fullAttributes: SampAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "samp",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: SampElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: SampElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: SampElement): string | undefined {
    return element.attributes?.style;
  },
};
