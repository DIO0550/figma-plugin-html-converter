import { it, expect } from "vitest";
import { HeaderElement } from "../header-element";
import type { HeaderElement as HeaderElementType } from "../header-element";

it("HeaderElement.getId - id属性あり - idを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: { id: "page-header" },
  };
  expect(HeaderElement.getId(element)).toBe("page-header");
});

it("HeaderElement.getId - id属性なし - undefinedを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
  };
  expect(HeaderElement.getId(element)).toBeUndefined();
});

it(
  "HeaderElement.getClassName - className属性あり - classNameを返す",
  () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: { className: "header sticky-header" },
    };
    expect(HeaderElement.getClassName(element)).toBe("header sticky-header");
  }
);

it(
  "HeaderElement.getClassName - className属性なし - undefinedを返す",
  () => {
    const element: HeaderElementType = {
      type: "element",
      tagName: "header",
      attributes: {},
    };
    expect(HeaderElement.getClassName(element)).toBeUndefined();
  }
);

it("HeaderElement.getStyle - style属性あり - styleを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: { style: "background: #333; padding: 20px;" },
  };
  expect(HeaderElement.getStyle(element)).toBe(
    "background: #333; padding: 20px;",
  );
});

it("HeaderElement.getStyle - style属性なし - undefinedを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
  };
  expect(HeaderElement.getStyle(element)).toBeUndefined();
});

it("HeaderElement.getAttribute - 属性あり - 値を返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      id: "header",
      className: "site-header",
      "data-sticky": "true",
    },
  };
  expect(HeaderElement.getAttribute(element, "id")).toBe("header");
  expect(HeaderElement.getAttribute(element, "className")).toBe("site-header");
  expect(HeaderElement.getAttribute(element, "data-sticky")).toBe("true");
});

it("HeaderElement.getAttribute - 属性なし - undefinedを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
  };
  expect(HeaderElement.getAttribute(element, "id")).toBeUndefined();
});

it("HeaderElement.getChildren - childrenあり - childrenを返す", () => {
  const children = [
    {
      type: "element" as const,
      tagName: "nav",
      attributes: {},
    },
  ];
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
    children,
  };
  expect(HeaderElement.getChildren(element)).toBe(children);
});

it("HeaderElement.getChildren - childrenなし - undefinedを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
  };
  expect(HeaderElement.getChildren(element)).toBeUndefined();
});

it("HeaderElement.getChildren - 空配列children - 空配列を返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
    children: [],
  };
  expect(HeaderElement.getChildren(element)).toEqual([]);
});

it("HeaderElement.hasAttribute - 属性あり - trueを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      id: "header",
      className: "site-header",
    },
  };
  expect(HeaderElement.hasAttribute(element, "id")).toBe(true);
  expect(HeaderElement.hasAttribute(element, "className")).toBe(true);
});

it("HeaderElement.hasAttribute - 属性なし - falseを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {
      id: "header",
    },
  };
  expect(HeaderElement.hasAttribute(element, "className")).toBe(false);
  expect(HeaderElement.hasAttribute(element, "style")).toBe(false);
});

it("HeaderElement.hasAttribute - 空のattributes - falseを返す", () => {
  const element: HeaderElementType = {
    type: "element",
    tagName: "header",
    attributes: {},
  };
  expect(HeaderElement.hasAttribute(element, "id")).toBe(false);
});
