import { test, expect } from "vitest";
import type { SmallAttributes } from "../small-attributes";

test("SmallAttributes - グローバル属性を含むことができる", () => {
  const attributes: SmallAttributes = {
    id: "small-text-1",
    class: "small-text",
    style: "font-size: 0.8em;",
    title: "Small text",
    lang: "ja",
    dir: "ltr",
  };

  expect(attributes.id).toBe("small-text-1");
  expect(attributes.class).toBe("small-text");
  expect(attributes.style).toBe("font-size: 0.8em;");
  expect(attributes.title).toBe("Small text");
  expect(attributes.lang).toBe("ja");
  expect(attributes.dir).toBe("ltr");
});

test("SmallAttributes - 空の属性オブジェクトを作成できる", () => {
  const attributes: SmallAttributes = {};
  expect(attributes).toEqual({});
});

test("SmallAttributes - 部分的な属性セットを作成できる", () => {
  const attributes: SmallAttributes = {
    id: "small-1",
    style: "color: gray;",
  };
  expect(attributes.id).toBe("small-1");
  expect(attributes.style).toBe("color: gray;");
  expect(attributes.class).toBeUndefined();
});

test("SmallAttributes - カスタムdata属性を含むことができる", () => {
  const attributes: SmallAttributes = {
    "data-testid": "small-component",
    "data-size": "xs",
    "data-importance": "low",
  };

  expect(attributes["data-testid"]).toBe("small-component");
  expect(attributes["data-size"]).toBe("xs");
  expect(attributes["data-importance"]).toBe("low");
});

test("SmallAttributes - アクセシビリティ属性を含むことができる", () => {
  const attributes: SmallAttributes = {
    "aria-label": "Small text section",
    "aria-describedby": "small-description",
    "aria-hidden": "false",
    role: "note",
  };

  expect(attributes["aria-label"]).toBe("Small text section");
  expect(attributes["aria-describedby"]).toBe("small-description");
  expect(attributes["aria-hidden"]).toBe("false");
  expect(attributes.role).toBe("note");
});

test("SmallAttributes - GlobalAttributesと互換性がある", () => {
  const globalAttrs = {
    id: "test",
    class: "test-class",
    style: "color: red;",
  };

  const smallAttributes: SmallAttributes = globalAttrs;
  expect(smallAttributes.id).toBe("test");
  expect(smallAttributes.class).toBe("test-class");
  expect(smallAttributes.style).toBe("color: red;");
});
