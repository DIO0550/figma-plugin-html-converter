/**
 * @fileoverview OL要素の統合エクスポート
 */

export { OlAttributes } from "./ol-attributes";
export { OlElement } from "./ol-element";
export type { OlElement as OlElementType } from "./ol-element";
export {
  OlConverter,
  toFigmaNode as olToFigmaNode,
  mapToFigma as olMapToFigma,
} from "./ol-converter";
