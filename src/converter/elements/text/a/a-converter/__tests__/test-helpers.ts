import type { AElement } from "../../a-element";
import type { HTMLNode } from "../../../../../models/html-node/html-node";

// ===============================
// 共通テストデータビルダー
// ===============================

export const createAElement = (
  href?: string,
  children?: HTMLNode[],
  style?: string,
): AElement => {
  return {
    type: "element",
    tagName: "a",
    attributes: href || style ? { href, style } : undefined,
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

export const createDefaultTextStyle = () => ({
  fontFamily: "Inter",
  fontSize: 16,
  fontWeight: 400,
  lineHeight: {
    unit: "PIXELS" as const,
    value: 24,
  },
  letterSpacing: 0,
  textAlign: "LEFT" as const,
  verticalAlign: "TOP" as const,
  textDecoration: "UNDERLINE" as const,
  fills: [
    {
      type: "SOLID" as const,
      color: {
        r: 0,
        g: 0.478,
        b: 1,
        a: 1,
      },
    },
  ],
});
