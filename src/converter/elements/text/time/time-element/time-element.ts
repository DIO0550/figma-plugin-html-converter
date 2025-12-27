import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { TimeAttributes } from "../time-attributes";

/**
 * time要素の型定義
 * HTMLのtime（日時）要素を表現します
 * BaseElementを継承した専用の型
 */
export interface TimeElement extends BaseElement<"time", TimeAttributes> {
  children?: HTMLNode[];
}

/**
 * time要素のコンパニオンオブジェクト
 */
export const TimeElement = {
  /**
   * 型ガード: 与えられたノードがTimeElementかどうかを判定
   */
  isTimeElement(node: unknown): node is TimeElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "time"
    );
  },

  /**
   * ファクトリー: TimeElementを作成
   */
  create(
    attributes: Partial<TimeAttributes> = {},
    children: HTMLNode[] = [],
  ): TimeElement {
    const fullAttributes: TimeAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "time",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   */
  getId(element: TimeElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   */
  getClass(element: TimeElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   */
  getStyle(element: TimeElement): string | undefined {
    return element.attributes?.style;
  },

  /**
   * datetime属性の取得
   */
  getDatetime(element: TimeElement): string | undefined {
    return element.attributes?.datetime;
  },
};
