import { test, expect } from "vitest";
import { HeaderElement } from "../header-element";

test(
  "HeaderElement.create - 属性なし - デフォルトのheader要素を作成する",
  () => {
    const element = HeaderElement.create();

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes: {},
      children: [],
    });
  }
);

test(
  "HeaderElement.create - 属性あり - 属性を設定したheader要素を作成する",
  () => {
    const attributes = {
      id: "page-header",
      className: "header sticky-header",
      style: "position: sticky; top: 0;",
    };
    const element = HeaderElement.create(attributes);

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes,
      children: [],
    });
  }
);

test("HeaderElement.create - 子要素あり - childrenを設定する", () => {
  const children = [
    {
      type: "element" as const,
      tagName: "nav",
      attributes: {},
    },
    {
      type: "text" as const,
      content: "Header text",
    },
  ];
  const element = HeaderElement.create({}, children);

  expect(element).toEqual({
    type: "element",
    tagName: "header",
    attributes: {},
    children,
  });
});

test(
  "HeaderElement.create - 属性と子要素あり - 両方を設定する",
  () => {
    const attributes = {
      id: "main-header",
      className: "header",
    };
    const children = [
      {
        type: "element" as const,
        tagName: "div",
        attributes: { className: "logo" },
      },
    ];
    const element = HeaderElement.create(attributes, children);

    expect(element).toEqual({
      type: "element",
      tagName: "header",
      attributes,
      children,
    });
  }
);

test(
  "HeaderElement.create - 部分的な属性 - 属性を保持する",
  () => {
    const element = HeaderElement.create({ id: "header" });

    expect(element.attributes).toEqual({ id: "header" });
    expect(element.children).toEqual([]);
  }
);

test(
  "HeaderElement.create - 空の属性 - 空オブジェクトを保持する",
  () => {
    const element = HeaderElement.create({});

    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  }
);
