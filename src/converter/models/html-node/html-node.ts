// ノードタイプの定数
const NODE_TYPE = {
  ELEMENT: "element",
  TEXT: "text",
  COMMENT: "comment",
} as const;

export type NodeType = (typeof NODE_TYPE)[keyof typeof NODE_TYPE];

// HTMLノードの型定義
export interface HTMLNode {
  type: NodeType;
  tagName?: string;
  attributes?: Record<string, string>;
  children?: HTMLNode[];
  textContent?: string;
}

import type { HTML } from "../html";
import { HTML as HTMLObj } from "../html";

// HTMLNodeのコンパニオンオブジェクト
export const HTMLNode = {
  // HTMLからHTMLNodeを作成
  from(html: HTML): HTMLNode {
    return HTMLObj.toHTMLNode(html);
  },

  // 型ガード
  isElement(
    node: HTMLNode,
  ): node is HTMLNode & { type: typeof NODE_TYPE.ELEMENT; tagName: string } {
    return node.type === NODE_TYPE.ELEMENT;
  },

  isText(
    node: HTMLNode,
  ): node is HTMLNode & { type: typeof NODE_TYPE.TEXT; textContent: string } {
    return node.type === NODE_TYPE.TEXT;
  },

  isComment(node: HTMLNode): node is HTMLNode & {
    type: typeof NODE_TYPE.COMMENT;
    textContent: string;
  } {
    return node.type === NODE_TYPE.COMMENT;
  },

  // ファクトリーメソッド
  createElement(
    tagName: string,
    attributes?: Record<string, string>,
  ): HTMLNode {
    return {
      type: NODE_TYPE.ELEMENT,
      tagName,
      attributes,
      children: [],
    };
  },

  createText(textContent: string): HTMLNode {
    return {
      type: NODE_TYPE.TEXT,
      textContent,
    };
  },

  createComment(textContent: string): HTMLNode {
    return {
      type: NODE_TYPE.COMMENT,
      textContent,
    };
  },

  // ユーティリティメソッド
  appendChild(parent: HTMLNode, child: HTMLNode): void {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(child);
  },

  getTextContent(node: HTMLNode): string {
    if (HTMLNode.isText(node) || HTMLNode.isComment(node)) {
      return node.textContent || "";
    }

    if (HTMLNode.isElement(node) && node.children) {
      return node.children
        .map((child) => HTMLNode.getTextContent(child))
        .join("");
    }

    return "";
  },

  hasChildren(node: HTMLNode): boolean {
    return Array.isArray(node.children) && node.children.length > 0;
  },

  // converterで使用される型ガード（新形式のみ）
  isTextNode(
    node: unknown,
  ): node is { type: "text"; textContent: string } & Record<string, unknown> {
    return (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      (node as { type: unknown }).type === "text" &&
      "textContent" in node &&
      typeof (node as { textContent: unknown }).textContent === "string"
    );
  },

  /**
   * テキストノードのコンテンツを取得するヘルパー関数
   * textContentとcontentの両方に対応（副作用なし）
   *
   * @param node - テキストノード
   * @returns コンテンツ文字列、取得できない場合は空文字列
   */
  getTextNodeContent(node: unknown): string {
    if (this.isTextNode(node)) {
      return node.textContent;
    }
    return "";
  },

  isElementNode(
    node: unknown,
  ): node is HTMLNode & { type: "element"; tagName: string } {
    return (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      node.type === "element" &&
      "tagName" in node &&
      typeof (node as { tagName: unknown }).tagName === "string"
    );
  },

  /**
   * HTMLノードからテキストを再帰的に抽出します（循環参照対策付き）
   *
   * @param node - テキストを抽出するHTMLノード
   * @returns 抽出されたテキスト文字列
   */
  extractText(node: HTMLNode | null | undefined): string {
    if (!node) {
      return "";
    }

    const visited = new WeakSet<object>();
    return this.extractTextRecursive(node, visited);
  },

  /**
   * 複数のHTMLノードからテキストを抽出して結合します
   *
   * @param nodes - テキストを抽出するHTMLノードの配列
   * @returns 抽出されたテキスト文字列
   */
  extractTextFromNodes(
    nodes: readonly (HTMLNode | null | undefined)[],
  ): string {
    return nodes
      .filter((node): node is HTMLNode => node != null)
      .map((node) => this.extractText(node))
      .join("");
  },

  /**
   * 再帰的にテキストを抽出（内部用）
   */
  extractTextRecursive(node: HTMLNode, visited: WeakSet<object>): string {
    // 循環参照のチェック
    if (visited.has(node)) {
      return "";
    }
    visited.add(node);

    // テキストノードの場合
    if (this.isText(node)) {
      return node.textContent || "";
    }

    // 要素ノードの場合
    if (this.isElement(node) && node.children) {
      return node.children
        .filter((child): child is HTMLNode => child != null)
        .map((child) => this.extractTextRecursive(child, visited))
        .join("");
    }

    return "";
  },

  // 要素からテキストコンテンツを抽出（新形式のみ）
  extractTextContent(element: unknown): string {
    // 新形式の構造に限定し、標準のextractTextに委譲
    return this.extractText(element as HTMLNode);
  },
};
