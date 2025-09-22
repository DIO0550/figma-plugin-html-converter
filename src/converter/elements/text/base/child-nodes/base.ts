import type { TextNodeConfig } from "../../../../models/figma-node";

/**
 * 子ノードの基底型
 */
export type BaseChildNode = {
  styles?: Record<string, string>;
};

/**
 * 子ノードの変換コンテキスト
 */
export type ChildNodeContext = {
  parentStyle?: string;
  elementType?: string;
  isHeading?: boolean;
};

/**
 * 子ノードの変換結果
 */
export type ChildNodeResult = {
  node: TextNodeConfig;
  metadata: {
    isText: boolean;
    isBold: boolean;
    isItalic: boolean;
    tagName?: string;
  };
};
