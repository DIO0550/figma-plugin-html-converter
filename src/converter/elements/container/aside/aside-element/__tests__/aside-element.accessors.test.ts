import { test, expect } from "vitest";
import { AsideElement } from "../aside-element";

// getId
test("AsideElement.getId: ID属性を取得できること", () => {
  const element = AsideElement.create({ id: "sidebar" });
  expect(AsideElement.getId(element)).toBe("sidebar");
});

test("AsideElement.getId: ID属性がない場合はundefinedを返すこと", () => {
  const element = AsideElement.create({});
  expect(AsideElement.getId(element)).toBeUndefined();
});

// getClassName
test("AsideElement.getClassName: className属性を取得できること", () => {
  const element = AsideElement.create({ className: "sidebar navigation" });
  expect(AsideElement.getClassName(element)).toBe("sidebar navigation");
});

test("AsideElement.getClassName: className属性がない場合はundefinedを返すこと", () => {
  const element = AsideElement.create({});
  expect(AsideElement.getClassName(element)).toBeUndefined();
});

// getStyle
test("AsideElement.getStyle: style属性を取得できること", () => {
  const element = AsideElement.create({ style: "width: 300px;" });
  expect(AsideElement.getStyle(element)).toBe("width: 300px;");
});

test("AsideElement.getStyle: style属性がない場合はundefinedを返すこと", () => {
  const element = AsideElement.create({});
  expect(AsideElement.getStyle(element)).toBeUndefined();
});

// getAttribute
test("AsideElement.getAttribute: 指定した属性を取得できること", () => {
  const element = AsideElement.create({
    id: "sidebar",
    className: "navigation",
    role: "complementary",
  });

  expect(AsideElement.getAttribute(element, "id")).toBe("sidebar");
  expect(AsideElement.getAttribute(element, "className")).toBe("navigation");
  expect(AsideElement.getAttribute(element, "role")).toBe("complementary");
});

test("AsideElement.getAttribute: 存在しない属性の場合はundefinedを返すこと", () => {
  const element = AsideElement.create({ id: "sidebar" });
  expect(AsideElement.getAttribute(element, "className")).toBeUndefined();
});

test("AsideElement.getAttribute: ARIA属性を取得できること", () => {
  const element = AsideElement.create({
    "aria-label": "サイドバー",
  });
  expect(AsideElement.getAttribute(element, "aria-label")).toBe("サイドバー");
});

// getChildren
test("AsideElement.getChildren: 子要素を取得できること", () => {
  const children = [
    {
      type: "text" as const,
      content: "Sidebar content",
    },
  ];
  const element = AsideElement.create({}, children);

  expect(AsideElement.getChildren(element)).toEqual(children);
});

test("AsideElement.getChildren: 子要素がない場合は空配列を返すこと", () => {
  const element = AsideElement.create({}, []);
  expect(AsideElement.getChildren(element)).toEqual([]);
});

test("AsideElement.getChildren: 子要素が未定義の場合はundefinedを返すこと", () => {
  const element = {
    type: "element" as const,
    tagName: "aside" as const,
    attributes: {},
  };
  expect(AsideElement.getChildren(element)).toBeUndefined();
});

// hasAttribute
test("AsideElement.hasAttribute: 属性が存在する場合はtrueを返すこと", () => {
  const element = AsideElement.create({
    id: "sidebar",
    className: "navigation",
  });

  expect(AsideElement.hasAttribute(element, "id")).toBe(true);
  expect(AsideElement.hasAttribute(element, "className")).toBe(true);
});

test("AsideElement.hasAttribute: 属性が存在しない場合はfalseを返すこと", () => {
  const element = AsideElement.create({ id: "sidebar" });

  expect(AsideElement.hasAttribute(element, "className")).toBe(false);
  expect(AsideElement.hasAttribute(element, "style")).toBe(false);
});

test("AsideElement.hasAttribute: 値がundefinedでも属性が存在すればtrueを返すこと", () => {
  const element = AsideElement.create({
    id: undefined,
  });

  expect(AsideElement.hasAttribute(element, "id")).toBe(true);
});

test("AsideElement.hasAttribute: ARIA属性の存在を確認できること", () => {
  const element = AsideElement.create({
    "aria-label": "サイドバー",
    role: "complementary",
  });

  expect(AsideElement.hasAttribute(element, "aria-label")).toBe(true);
  expect(AsideElement.hasAttribute(element, "role")).toBe(true);
  expect(AsideElement.hasAttribute(element, "aria-hidden")).toBe(false);
});
