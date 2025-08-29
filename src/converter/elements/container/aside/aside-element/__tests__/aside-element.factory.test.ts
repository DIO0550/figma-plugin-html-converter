import { test, expect } from "vitest";
import { AsideElement } from "../aside-element";

test("AsideElement.create: 属性なしでaside要素を作成できること", () => {
  const element = AsideElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "aside",
    attributes: {},
    children: [],
  });
});

test("AsideElement.create: 属性を指定してaside要素を作成できること", () => {
  const attributes = {
    id: "sidebar",
    className: "navigation",
    style: "width: 300px;",
  };

  const element = AsideElement.create(attributes);

  expect(element.attributes).toEqual(attributes);
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("aside");
  expect(element.children).toEqual([]);
});

test("AsideElement.create: 子要素を指定してaside要素を作成できること", () => {
  const children = [
    {
      type: "text" as const,
      content: "Sidebar content",
    },
  ];

  const element = AsideElement.create({}, children);

  expect(element.children).toEqual(children);
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("aside");
});

test("AsideElement.create: 属性と子要素を指定してaside要素を作成できること", () => {
  const attributes = {
    id: "sidebar",
    role: "complementary",
  };
  const children = [
    {
      type: "element" as const,
      tagName: "h3",
      attributes: {},
      children: [
        {
          type: "text" as const,
          content: "関連情報",
        },
      ],
    },
  ];

  const element = AsideElement.create(attributes, children);

  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual(children);
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("aside");
});

test("AsideElement.create: 空の属性と空の子要素でaside要素を作成できること", () => {
  const element = AsideElement.create({}, []);

  expect(element).toEqual({
    type: "element",
    tagName: "aside",
    attributes: {},
    children: [],
  });
});

test("AsideElement.create: 部分的な属性でaside要素を作成できること", () => {
  const element = AsideElement.create({ id: "sidebar" });

  expect(element.attributes.id).toBe("sidebar");
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("aside");
});

test("AsideElement.create: ARIA属性を含むaside要素を作成できること", () => {
  const attributes = {
    "aria-label": "サイドバー",
    role: "complementary",
  };

  const element = AsideElement.create(attributes);

  expect(element.attributes["aria-label"]).toBe("サイドバー");
  expect(element.attributes.role).toBe("complementary");
});
