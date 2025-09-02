import type { BaseElement } from "../elements/base";

// 属性の型制約を定義
type NodeNameAttributes = {
  id?: string | unknown;
  class?: string | unknown;
  [key: string]: unknown;
};

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
  A extends NodeNameAttributes = NodeNameAttributes,
>(element: BaseElement<T, A>): string {
  let name: string = element.tagName;

  // attributes が存在する場合のみ処理
  if (element.attributes) {
    // 型制約により安全にアクセス可能
    const attrs = element.attributes;

    // ID属性を追加（型安全にチェック）
    if (attrs.id && typeof attrs.id === "string") {
      name += `#${attrs.id}`;
    }

    // クラス属性を追加（型安全にチェック）
    if (attrs.class && typeof attrs.class === "string") {
      const classes = attrs.class.split(" ").filter(Boolean);
      if (classes.length > 0) {
        name += `.${classes.join(".")}`;
      }
    }
  }

  return name;
}
