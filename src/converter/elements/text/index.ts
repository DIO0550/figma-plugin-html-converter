// Element types and attributes
export { PAttributes, PElement } from "./p";
export * from "./span";
export {
  HeadingAttributes,
  H1Element,
  H2Element,
  H3Element,
  H4Element,
  H5Element,
  H6Element,
} from "./heading";
export * from "./a";
export * from "./strong";
export * from "./em";
export * from "./b";
export * from "./i";

// Converters (exported with specific names to avoid conflicts)
export {
  toFigmaNode as pToFigmaNode,
  mapToFigma as pMapToFigma,
  PConverter,
} from "./p/p-converter";
export {
  toFigmaNode as headingToFigmaNode,
  mapToFigma as headingMapToFigma,
} from "./heading/heading-converter";
