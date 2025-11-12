import type { SupElement } from "../../sup-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

// ===============================
// 共通テストデータビルダー
// ===============================

export const createSupElement = (
  attributes?: {
    id?: string;
    class?: string;
    style?: string;
  },
  children?: HTMLNode[],
): SupElement => {
  return {
    type: "element",
    tagName: "sup",
    attributes,
    children,
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
