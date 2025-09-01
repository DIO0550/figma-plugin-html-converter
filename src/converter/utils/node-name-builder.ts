import type { BaseElement } from "../elements/base";

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
export function buildNodeName<T extends string, A = Record<string, unknown>>(
  element: BaseElement<T, A>
): string {
  let name: string = element.tagName;

  // attributes が存在する場合のみ処理
  if (element.attributes) {
    const attrs = element.attributes as Record<string, unknown>;

    // ID属性を追加
    if (attrs.id) {
      name += `#${attrs.id}`;
    }

    // クラス属性を追加
    if (attrs.class) {
      const classString = String(attrs.class);
      const classes = classString.split(" ").filter(Boolean);
      if (classes.length > 0) {
        name += `.${classes.join(".")}`;
      }
    }
  }

  return name;
}
