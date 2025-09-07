import { UlElement } from "./ul-element";

export function isUlElement(node: unknown): node is UlElement {
  return UlElement.isUlElement(node);
}
