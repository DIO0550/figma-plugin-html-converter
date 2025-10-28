import { FigmaNodeConfig } from "../../../../models/figma-node";
import { HTMLNode } from "../../../../models/html-node/html-node";
import { ElementContextConverter } from "../../base/converters";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import type { H1Element } from "../h1/h1-element";
import type { H2Element } from "../h2/h2-element";
import type { H3Element } from "../h3/h3-element";
import type { H4Element } from "../h4/h4-element";
import type { H5Element } from "../h5/h5-element";
import type { H6Element } from "../h6/h6-element";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

type HeadingElement =
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element;

/**
 * 見出し要素をFigmaノードに変換
 */
export function toFigmaNode(element: HeadingElement): FigmaNodeConfig {
  const level = element.tagName;

  return toFigmaNodeWith(
    element,
    (el) => {
      const frame = HTMLFrame.from(level, el.attributes);
      return HTMLFrame.toFigmaNodeConfig(frame);
    },
    {
      applyCommonStyles: true,
      childrenConverter: (el) => {
        if (!el.children || el.children.length === 0) {
          return [];
        }
        const results = ElementContextConverter.convertAll(
          el.children,
          el.attributes?.style,
          level,
        );
        return results.map((result) => result.node as FigmaNodeConfig);
      },
    },
  );
}

/**
 * 見出し要素かどうかを判定
 */
function isHeadingElement(node: unknown): node is HeadingElement {
  if (!HTMLNode.isElementNode(node)) {
    return false;
  }
  const tagName = (node as { tagName: unknown }).tagName;
  return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName as string);
}

/**
 * ノードをFigmaノードにマッピング
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  if (isHeadingElement(node)) {
    return toFigmaNode(node);
  }
  return null;
}

/**
 * 見出し要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const HeadingConverter = {
  toFigmaNode,
  mapToFigma,
};
