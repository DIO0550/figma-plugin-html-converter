import type { SubElement } from "../../sub-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

// ===============================
// 共通テストデータビルダー
// ===============================

export const createSubElement = (
  attributes?: {
    id?: string;
    class?: string;
    style?: string;
  },
  children?: HTMLNode[],
): SubElement => {
  return {
    type: "element",
    tagName: "sub",
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
