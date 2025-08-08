// ノードタイプの定数
const NODE_TYPE = {
  ELEMENT: 'element',
  TEXT: 'text',
  COMMENT: 'comment'
} as const;

export type NodeType = typeof NODE_TYPE[keyof typeof NODE_TYPE];

// HTMLノードの型定義
export interface HTMLNode {
  type: NodeType;
  tagName?: string;
  attributes?: Record<string, string>;
  children?: HTMLNode[];
  textContent?: string;
}

import type { HTML } from '../html';
import { HTML as HTMLObj } from '../html';

// HTMLNodeのコンパニオンオブジェクト
export const HTMLNode = {
  // HTMLからHTMLNodeを作成
  from(html: HTML): HTMLNode {
    return HTMLObj.toHTMLNode(html);
  },

  // 型ガード
  isElement(node: HTMLNode): node is HTMLNode & { type: typeof NODE_TYPE.ELEMENT; tagName: string } {
    return node.type === NODE_TYPE.ELEMENT;
  },

  isText(node: HTMLNode): node is HTMLNode & { type: typeof NODE_TYPE.TEXT; textContent: string } {
    return node.type === NODE_TYPE.TEXT;
  },

  isComment(node: HTMLNode): node is HTMLNode & { type: typeof NODE_TYPE.COMMENT; textContent: string } {
    return node.type === NODE_TYPE.COMMENT;
  },

  // ファクトリーメソッド
  createElement(tagName: string, attributes?: Record<string, string>): HTMLNode {
    return {
      type: NODE_TYPE.ELEMENT,
      tagName,
      attributes,
      children: []
    };
  },

  createText(textContent: string): HTMLNode {
    return {
      type: NODE_TYPE.TEXT,
      textContent
    };
  },

  createComment(textContent: string): HTMLNode {
    return {
      type: NODE_TYPE.COMMENT,
      textContent
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
      return node.textContent || '';
    }

    if (HTMLNode.isElement(node) && node.children) {
      return node.children
        .map(child => HTMLNode.getTextContent(child))
        .join('');
    }

    return '';
  },

  hasChildren(node: HTMLNode): boolean {
    return Array.isArray(node.children) && node.children.length > 0;
  }
};