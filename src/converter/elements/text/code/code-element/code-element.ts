import type { HTMLNode } from "../../../../models/html-node/html-node";
import type { BaseElement } from "../../../base/base-element/base-element";
import type { CodeAttributes } from "../code-attributes";

/**
 * code要素の型定義
 * HTMLのcode（インラインコード）要素を表現します
 * BaseElementを継承した専用の型
 *
 * @remarks
 * code要素はインラインコードブロックを表示するために使用されます。
 * モノスペースフォント、背景色、パディングなどのデフォルトスタイルが適用されます。
 *
 * @example
 * ```typescript
 * const element: CodeElement = {
 *   type: "element",
 *   tagName: "code",
 *   attributes: { class: "language-typescript" },
 *   children: [{ type: "text", content: "const x = 10;" }]
 * };
 * ```
 */
export interface CodeElement extends BaseElement<"code", CodeAttributes> {
  children?: HTMLNode[];
}

/**
 * code要素のコンパニオンオブジェクト
 *
 * @remarks
 * code要素の作成、型ガード、属性アクセスなどのユーティリティ関数を提供します。
 */
export const CodeElement = {
  /**
   * 型ガード: 与えられたノードがCodeElementかどうかを判定
   *
   * @param node - 判定対象のノード
   * @returns code要素の場合は true、それ以外は false
   *
   * @example
   * ```typescript
   * if (CodeElement.isCodeElement(node)) {
   *   // nodeはCodeElement型として扱える
   *   console.log(node.tagName); // "code"
   * }
   * ```
   */
  isCodeElement(node: unknown): node is CodeElement {
    return (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      "tagName" in node &&
      node.type === "element" &&
      node.tagName === "code"
    );
  },

  /**
   * ファクトリー: CodeElementを作成
   *
   * @param attributes - 要素の属性（省略可能）
   * @param children - 子ノード（省略可能）
   * @returns 作成されたCodeElement
   *
   * @example
   * ```typescript
   * const element = CodeElement.create(
   *   { class: "language-typescript" },
   *   [{ type: "text", content: "const x = 10;" }]
   * );
   * ```
   */
  create(
    attributes: Partial<CodeAttributes> = {},
    children: HTMLNode[] = [],
  ): CodeElement {
    // デフォルト値と提供された属性をマージ
    const fullAttributes: CodeAttributes = {
      ...attributes,
    };

    return {
      type: "element",
      tagName: "code",
      attributes: fullAttributes,
      children,
    };
  },

  /**
   * ID属性の取得
   *
   * @param element - code要素
   * @returns id属性の値、存在しない場合はundefined
   *
   * @example
   * ```typescript
   * const element = CodeElement.create({ id: "snippet-1" });
   * const id = CodeElement.getId(element); // "snippet-1"
   * ```
   */
  getId(element: CodeElement): string | undefined {
    return element.attributes?.id;
  },

  /**
   * クラス属性の取得
   *
   * @param element - code要素
   * @returns class属性の値、存在しない場合はundefined
   *
   * @example
   * ```typescript
   * const element = CodeElement.create({ class: "language-typescript" });
   * const className = CodeElement.getClass(element); // "language-typescript"
   * ```
   */
  getClass(element: CodeElement): string | undefined {
    return element.attributes?.class;
  },

  /**
   * スタイル属性の取得
   *
   * @param element - code要素
   * @returns style属性の値、存在しない場合はundefined
   *
   * @example
   * ```typescript
   * const element = CodeElement.create({ style: "font-size: 14px;" });
   * const style = CodeElement.getStyle(element); // "font-size: 14px;"
   * ```
   */
  getStyle(element: CodeElement): string | undefined {
    return element.attributes?.style;
  },
};
