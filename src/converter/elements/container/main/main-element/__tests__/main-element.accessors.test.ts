import { it, expect } from "vitest";
import { MainElement } from "../main-element";
import type { MainElement as MainElementType } from "../main-element";
import type { HTMLNode } from "../../../../../models/html-node";

it("MainElement.getId - id属性あり - idを返す", () => {
  const element = MainElement.create({ id: "main-content" });
  expect(MainElement.getId(element)).toBe("main-content");
});

it("MainElement.getId - id属性なし - undefinedを返す", () => {
  const element = MainElement.create();
  expect(MainElement.getId(element)).toBeUndefined();
});

it(
  "MainElement.getClassName - className属性あり - classNameを返す",
  () => {
    const element = MainElement.create({ className: "main container" });
    expect(MainElement.getClassName(element)).toBe("main container");
  }
);

it(
  "MainElement.getClassName - className属性なし - undefinedを返す",
  () => {
    const element = MainElement.create();
    expect(MainElement.getClassName(element)).toBeUndefined();
  }
);

it("MainElement.getStyle - style属性あり - styleを返す", () => {
  const element = MainElement.create({ style: "padding: 20px;" });
  expect(MainElement.getStyle(element)).toBe("padding: 20px;");
});

it("MainElement.getStyle - style属性なし - undefinedを返す", () => {
  const element = MainElement.create();
  expect(MainElement.getStyle(element)).toBeUndefined();
});

it("MainElement.getAttribute - 属性あり - 値を返す", () => {
  const element = MainElement.create({
    id: "main",
    className: "content",
    title: "メインエリア",
    "data-page": "home",
    "aria-label": "メインコンテンツ",
  });

  expect(MainElement.getAttribute(element, "id")).toBe("main");
  expect(MainElement.getAttribute(element, "className")).toBe("content");
  expect(MainElement.getAttribute(element, "title")).toBe("メインエリア");
  expect(MainElement.getAttribute(element, "data-page")).toBe("home");
  expect(MainElement.getAttribute(element, "aria-label")).toBe("メインコンテンツ");
});

it("MainElement.getAttribute - 属性なし - undefinedを返す", () => {
  const element = MainElement.create({ id: "main" });
  expect(MainElement.getAttribute(element, "className")).toBeUndefined();
  expect(MainElement.getAttribute(element, "style")).toBeUndefined();
  expect(MainElement.getAttribute(element, "data-test")).toBeUndefined();
});

it("MainElement.getChildren - childrenあり - childrenを返す", () => {
  const children: HTMLNode[] = [
    { type: "text", content: "テキスト" },
    {
      type: "element",
      tagName: "section",
      attributes: {},
      children: [],
    },
  ];
  const element = MainElement.create({}, children);
  expect(MainElement.getChildren(element)).toEqual(children);
});

it("MainElement.getChildren - childrenなし - 空配列を返す", () => {
  const element = MainElement.create();
  expect(MainElement.getChildren(element)).toEqual([]);
});

it("MainElement.getChildren - childrenがundefined - undefinedを返す", () => {
  const element: MainElementType = {
    type: "element",
    tagName: "main",
    attributes: {},
    children: undefined,
  };
  expect(MainElement.getChildren(element)).toBeUndefined();
});

it("MainElement.hasAttribute - 属性あり - trueを返す", () => {
  const element = MainElement.create({
    id: "main",
    className: "content",
    style: "padding: 20px;",
    "data-page": "home",
  });

  expect(MainElement.hasAttribute(element, "id")).toBe(true);
  expect(MainElement.hasAttribute(element, "className")).toBe(true);
  expect(MainElement.hasAttribute(element, "style")).toBe(true);
  expect(MainElement.hasAttribute(element, "data-page")).toBe(true);
});

it("MainElement.hasAttribute - 属性なし - falseを返す", () => {
  const element = MainElement.create({ id: "main" });

  expect(MainElement.hasAttribute(element, "className")).toBe(false);
  expect(MainElement.hasAttribute(element, "style")).toBe(false);
  expect(MainElement.hasAttribute(element, "title")).toBe(false);
  expect(MainElement.hasAttribute(element, "data-test")).toBe(false);
});

it("MainElement.hasAttribute - undefined値の属性 - trueを返す", () => {
  const element = MainElement.create({
    id: undefined as unknown as string,
  });

  expect(MainElement.hasAttribute(element, "id")).toBe(true);
});
