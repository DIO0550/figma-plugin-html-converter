// SVG共通属性
export {
  SvgAttributes,
  type SvgPresentationAttributes,
  type SvgBaseAttributes,
} from "./svg-attributes";

// ユーティリティ
export { SvgPaintUtils } from "./utils/svg-paint-utils";
export {
  SvgCoordinateUtils,
  type BoundingBox,
  type Point,
} from "./utils/svg-coordinate-utils";
export {
  SvgTransformUtils,
  type TransformCommand,
  type TranslateCommand,
  type RotateCommand,
  type ScaleCommand,
  type SkewXCommand,
  type SkewYCommand,
  type MatrixCommand,
  type TransformedBounds,
} from "./utils/svg-transform-utils";

// 基本図形要素
export { CircleElement } from "./circle";
export type { CircleAttributes } from "./circle";

export { RectElement } from "./rect";
export type { RectAttributes } from "./rect";

export { LineElement } from "./line";
export type { LineAttributes } from "./line";

export { EllipseElement } from "./ellipse";
export type { EllipseAttributes } from "./ellipse";

// パス要素
export { PathElement, PathParser, PathCommand } from "./path";
export type { PathAttributes, PathCommandType } from "./path";

// ポリゴン・ポリライン要素
export { PolygonElement } from "./polygon";
export type { PolygonAttributes } from "./polygon";

export { PolylineElement } from "./polyline";
export type { PolylineAttributes } from "./polyline";

// グループ・定義要素
export { GroupElement, type SvgChildNode } from "./group";
export type { GroupAttributes } from "./group";

export { DefsElement } from "./defs";
export type { DefsAttributes } from "./defs";
