import type { DelElement } from "../../del-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

// ===============================
// 共通テストデータビルダー
// ===============================

export const createDelElement = (
  attributes?: {
    cite?: string;
    datetime?: string;
    id?: string;
    class?: string;
    style?: string;
  },
  children?: HTMLNode[],
): DelElement => {
  return {
    type: "element",
    tagName: "del",
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
