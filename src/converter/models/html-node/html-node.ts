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

  // converterで使用される型ガード（互換性のため）
  isTextNode(node: unknown): node is { type: string; content: string } {
    return (
      node !== null &&
      typeof node === "object" &&
      "type" in node &&
      node.type === "text" &&
      "content" in node &&
      typeof node.content === "string"
    );
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

  // 要素からテキストコンテンツを抽出（後方互換性のため残す）
  extractTextContent(element: unknown): string {
    // 旧形式のノード（contentプロパティを持つ）の場合
    if (element && typeof element === "object") {
      // 型ガードを使用して安全にプロパティアクセス
      if (this.hasContentProperty(element)) {
        return element.content;
      }
      // テキストノードで、textContentプロパティを持つ場合
      if (this.hasTextContentProperty(element) && element.type === "text") {
        return element.textContent;
      }
      // 子要素を持つ場合、再帰的に処理
      if (this.hasChildrenProperty(element)) {
        return element.children
          .map((child: unknown) => this.extractTextContent(child))
          .join("");
      }
    }
    // 標準のextractTextにフォールバック
    return this.extractText(element as HTMLNode);
  },

  // 型ガード：contentプロパティを持つかチェック
  hasContentProperty(
    obj: object,
  ): obj is { content: string } & Record<string, unknown> {
    return (
      "content" in obj &&
      typeof (obj as { content: unknown }).content === "string"
    );
  },

  // 型ガード：textContentプロパティを持つかチェック
  hasTextContentProperty(
    obj: object,
  ): obj is { textContent: string; type: string } & Record<string, unknown> {
    return (
      "textContent" in obj &&
      typeof (obj as { textContent: unknown }).textContent === "string" &&
      "type" in obj &&
      typeof (obj as { type: unknown }).type === "string"
    );
  },

  // 型ガード：childrenプロパティを持つかチェック
  hasChildrenProperty(
    obj: object,
  ): obj is { children: unknown[] } & Record<string, unknown> {
    return (
      "children" in obj &&
      Array.isArray((obj as { children: unknown }).children)
    );
  },
};
