import { FigmaNodeConfig } from "../../../../models/figma-node";
import type { PreElement } from "../pre-element";
import { PreElement as PreElementCompanion } from "../pre-element";
import { ElementContextConverter } from "../../base/converters";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * pre要素をFigmaノードに変換
 */
export function toFigmaNode(element: PreElement): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      const frame = HTMLFrame.from("pre", el.attributes);
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
          "pre",
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
    "pre",
    PreElementCompanion.isPreElement,
    PreElementCompanion.create,
    toFigmaNode,
  );
}

/**
 * pre要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const PreConverter = {
  toFigmaNode,
  mapToFigma,
};
