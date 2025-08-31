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

  isComment(
    node: HTMLNode,
  ): node is HTMLNode & {
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

  // 要素からテキストコンテンツを抽出（converterで使用）
  extractTextContent(element: HTMLNode): string {
    if (!element.children || element.children.length === 0) {
      return "";
    }

    let text = "";
    for (const child of element.children) {
      if (HTMLNode.isTextNode(child)) {
        text += child.content;
      } else if (HTMLNode.isElementNode(child)) {
        text += HTMLNode.extractTextContent(child);
      }
    }
    return text;
  },
};
