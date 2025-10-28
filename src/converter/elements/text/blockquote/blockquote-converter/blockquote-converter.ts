import { FigmaNodeConfig } from "../../../../models/figma-node";
import { BlockquoteElement } from "../blockquote-element";
import type { BlockquoteElement as BlockquoteElementType } from "../blockquote-element";
import { ElementContextConverter } from "../../base/converters";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * blockquote要素をFigmaノードに変換
 */
export function toFigmaNode(element: BlockquoteElementType): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      const frame = HTMLFrame.from("blockquote", el.attributes);
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
          "blockquote",
        );
        return results.map((result) => result.node as FigmaNodeConfig);
      },
    },
  );
}

/**
 * ノードをFigmaノードにマッピング
 */
export function mapToFigma(node: unknown): FigmaNodeConfig | null {
  return mapToFigmaWith(
    node,
    "blockquote",
    BlockquoteElement.isBlockquoteElement,
    BlockquoteElement.create,
    toFigmaNode,
  );
}

/**
 * blockquote要素のコンバーター
 * toFigmaNodeとmapToFigma関数をまとめた名前空間
 */
export const BlockquoteConverter = {
  toFigmaNode,
  mapToFigma,
};
