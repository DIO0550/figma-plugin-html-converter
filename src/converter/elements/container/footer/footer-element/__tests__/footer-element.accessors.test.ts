import { test, expect } from "vitest";
import { FooterElement } from "../footer-element";
import type { FooterElement as FooterElementType } from "../footer-element";

test("FooterElement.getId - id属性あり - idを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: { id: "site-footer" },
  };

  expect(FooterElement.getId(element)).toBe("site-footer");
});

test("FooterElement.getId - id属性なし - undefinedを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {},
  };

  expect(FooterElement.getId(element)).toBeUndefined();
});

test(
  "FooterElement.getClassName - className属性あり - classNameを返す",
  () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: { className: "footer site-footer" },
    };

    expect(FooterElement.getClassName(element)).toBe("footer site-footer");
  }
);

test(
  "FooterElement.getClassName - className属性なし - undefinedを返す",
  () => {
    const element: FooterElementType = {
      type: "element",
      tagName: "footer",
      attributes: {},
    };

    expect(FooterElement.getClassName(element)).toBeUndefined();
  }
);

test("FooterElement.getStyle - style属性あり - styleを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: { style: "background-color: #333; padding: 20px;" },
  };

  expect(FooterElement.getStyle(element)).toBe(
    "background-color: #333; padding: 20px;",
  );
});

test("FooterElement.getStyle - style属性なし - undefinedを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {},
  };

  expect(FooterElement.getStyle(element)).toBeUndefined();
});

test("FooterElement.getAttribute - 属性あり - 値を返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {
      id: "footer",
      className: "site-footer",
      "data-theme": "dark",
      "aria-label": "ページフッター",
    },
  };

  expect(FooterElement.getAttribute(element, "id")).toBe("footer");
  expect(FooterElement.getAttribute(element, "className")).toBe("site-footer");
  expect(FooterElement.getAttribute(element, "data-theme")).toBe("dark");
  expect(FooterElement.getAttribute(element, "aria-label")).toBe(
    "ページフッター",
  );
});

test("FooterElement.getAttribute - 属性なし - undefinedを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: { id: "footer" },
  };

  expect(FooterElement.getAttribute(element, "className")).toBeUndefined();
  expect(FooterElement.getAttribute(element, "style")).toBeUndefined();
});

test("FooterElement.getChildren - childrenあり - childrenを返す", () => {
  const children = [
    { type: "text" as const, content: "Footer content" },
    {
      type: "element" as const,
      tagName: "nav",
      attributes: {},
      children: [],
    },
  ];
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {},
    children,
  };

  expect(FooterElement.getChildren(element)).toEqual(children);
});

test("FooterElement.getChildren - childrenなし - undefinedを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {},
  };

  expect(FooterElement.getChildren(element)).toBeUndefined();
});

test("FooterElement.getChildren - 空配列children - 空配列を返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {},
    children: [],
  };

  expect(FooterElement.getChildren(element)).toEqual([]);
});

test("FooterElement.hasAttribute - 属性あり - trueを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: {
      id: "footer",
      className: "site-footer",
      style: "padding: 10px;",
    },
  };

  expect(FooterElement.hasAttribute(element, "id")).toBe(true);
  expect(FooterElement.hasAttribute(element, "className")).toBe(true);
  expect(FooterElement.hasAttribute(element, "style")).toBe(true);
});

test("FooterElement.hasAttribute - 属性なし - falseを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: { id: "footer" },
  };

  expect(FooterElement.hasAttribute(element, "className")).toBe(false);
  expect(FooterElement.hasAttribute(element, "style")).toBe(false);
  expect(FooterElement.hasAttribute(element, "data-test")).toBe(false);
});

test("FooterElement.hasAttribute - undefined値の属性 - trueを返す", () => {
  const element: FooterElementType = {
    type: "element",
    tagName: "footer",
    attributes: { id: undefined } as FooterElementType["attributes"],
  };

  expect(FooterElement.hasAttribute(element, "id")).toBe(true);
});
