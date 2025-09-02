import type { BaseElement } from "../elements/base";
import type { GlobalAttributes } from "../elements/base/global-attributes/global-attributes";

/**
 * BaseElement から Figma のノード名を生成します
 *
 * @param element - BaseElement（attributesを含む場合がある）
 * @returns タグ名、ID、クラス名を組み合わせたノード名
 *
 * @example
 * - タグ名のみ: buildNodeName(element) → "div"
 * - ID付き: buildNodeName({ ...element, attributes: { id: "header" } }) → "div#header"
 * - クラス付き: buildNodeName({ ...element, attributes: { class: "container" } }) → "div.container"
 * - ID+クラス: buildNodeName({ ...element, attributes: { id: "header", class: "navbar" } }) → "div#header.navbar"
 */
export function buildNodeName<
  T extends string,
  A extends GlobalAttributes = GlobalAttributes,
>(element: BaseElement<T, A>): string {
  if (!element.attributes) {
    return element.tagName;
  }

  let name: string = element.tagName;
  const attrs = element.attributes;

  if (attrs.id) {
    name += `#${attrs.id}`;
  }

  if (attrs.class) {
    // 連続する空白がある場合にドット記法が壊れるのを防ぐ
    const classes = attrs.class
      .split(" ")
      .filter((className) => className !== "");
    if (classes.length > 0) {
      name += `.${classes.join(".")}`;
    }
  }

  return name;
}
