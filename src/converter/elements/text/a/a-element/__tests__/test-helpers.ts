import type { AElement as AElementType } from "../a-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

// ===============================
// 共通テストデータビルダー
// ===============================

export const createAElement = (
  overrides?: Partial<AElementType>,
): AElementType => {
  return {
    type: "element",
    tagName: "a",
    ...overrides,
  };
};

export const createTextNode = (content: string): HTMLNode => {
  return {
    type: "text",
    textContent: content,
  };
};

export const createElementNode = (
  tagName: string,
  children?: HTMLNode[],
): HTMLNode => {
  return {
    type: "element",
    tagName,
    children,
  };
};
