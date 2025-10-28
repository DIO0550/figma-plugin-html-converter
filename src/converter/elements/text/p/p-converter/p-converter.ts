import { FigmaNodeConfig } from "../../../../models/figma-node";
import type { PElement } from "../p-element";
import { PElement as PElementCompanion } from "../p-element";
import { ElementContextConverter } from "../../base/converters";
import { HTMLFrame } from "../../../../models/figma-node/factories/html-frame";
import { mapToFigmaWith } from "../../../../utils/element-utils";
import { toFigmaNodeWith } from "../../../../utils/to-figma-node-with";

/**
 * p要素をFigmaノードに変換
 */
export function toFigmaNode(element: PElement): FigmaNodeConfig {
  return toFigmaNodeWith(
    element,
    (el) => {
      const frame = HTMLFrame.from("p", el.attributes);
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
          "p",
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
    "p",
    PElementCompanion.isPElement,
    PElementCompanion.create,
    toFigmaNode,
  );
}

/**
 * p要素のコンバーター
 * 後方互換性のためのエクスポート
 */
export const PConverter = {
  toFigmaNode,
  mapToFigma,
};
