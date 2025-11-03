import { FigmaNodeConfig } from "../../../../models/figma-node";
import { BlockquoteElement } from "../blockquote-element";
import type { BlockquoteElement as BlockquoteElementType } from "../blockquote-element";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";
import { createTextChildrenConverter } from "../../../../utils/children-converter-helpers";

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
      childrenConverter: createTextChildrenConverter("blockquote"),
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
