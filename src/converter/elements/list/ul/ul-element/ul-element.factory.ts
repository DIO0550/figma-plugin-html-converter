import { UlElement } from "./ul-element";
import type { UlAttributes } from "../ul-attributes";
import type { HTMLNode } from "../../../../models/html-node/html-node";

export function createUlElement(
  attributes: Partial<UlAttributes> = {},
  children: HTMLNode[] = [],
): UlElement {
  return UlElement.create(attributes, children);
}
