import { test, expect } from "vitest";
import { ThElement } from "../th-element";
import type { ThAttributes } from "../../th-attributes";

// ファクトリメソッドのテスト
test("空の属性でth要素を作成できる", () => {
  const element = ThElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("th");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("scope属性を指定してth要素を作成できる", () => {
  const element = ThElement.create({ scope: "col" });

  expect(element.attributes.scope).toBe("col");
});

test("width属性を指定してth要素を作成できる", () => {
  const element = ThElement.create({ width: "100px" });

  expect(element.attributes.width).toBe("100px");
});

test("abbr属性を指定してth要素を作成できる", () => {
  const element = ThElement.create({ abbr: "Full Name" });

  expect(element.attributes.abbr).toBe("Full Name");
});

// test.eachを使用した複数属性のテスト
test.each([
  { scope: "col", width: "100px", abbr: "Name" },
  { scope: "row", colspan: "2", rowspan: "1" },
  { id: "header-1", class: "header-cell", style: "font-weight: bold;" },
  { scope: "colgroup", width: "120px", height: "40px" },
])("複数の属性%pを含むth要素を作成できる", (attributes) => {
  const element = ThElement.create(attributes);

  Object.entries(attributes).forEach(([key, value]) => {
    expect(element.attributes[key]).toBe(value);
  });
});

test("すべての属性を指定してth要素を作成できる", () => {
  const attrs: Partial<ThAttributes> = {
    scope: "row",
    width: "120px",
    height: "40px",
    abbr: "Name",
    colspan: "2",
    rowspan: "1",
    style: "background-color: #f0f0f0;",
    class: "header-cell",
    id: "header-1",
  };

  const element = ThElement.create(attrs);

  expect(element.attributes.scope).toBe("row");
  expect(element.attributes.width).toBe("120px");
  expect(element.attributes.height).toBe("40px");
  expect(element.attributes.abbr).toBe("Name");
  expect(element.attributes.colspan).toBe("2");
  expect(element.attributes.rowspan).toBe("1");
  expect(element.attributes.style).toBe("background-color: #f0f0f0;");
  expect(element.attributes.class).toBe("header-cell");
  expect(element.attributes.id).toBe("header-1");
});

test("作成したth要素は型ガードを通過する", () => {
  const element = ThElement.create({ scope: "col" });

  expect(ThElement.isThElement(element)).toBe(true);
});
