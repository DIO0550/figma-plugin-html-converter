import { test, expect } from "vitest";
import type { MarkAttributes } from "../mark-attributes";

test("MarkAttributes - グローバル属性を含むことができる", () => {
  const attributes: MarkAttributes = {
    id: "mark-text-1",
    class: "highlight",
    style: "background-color: yellow;",
    title: "Highlighted text",
    lang: "ja",
    dir: "ltr",
  };

  expect(attributes.id).toBe("mark-text-1");
  expect(attributes.class).toBe("highlight");
  expect(attributes.style).toBe("background-color: yellow;");
  expect(attributes.title).toBe("Highlighted text");
  expect(attributes.lang).toBe("ja");
  expect(attributes.dir).toBe("ltr");
});

test("MarkAttributes - 空の属性オブジェクトを作成できる", () => {
  const attributes: MarkAttributes = {};
  expect(attributes).toEqual({});
});

test("MarkAttributes - 部分的な属性セットを作成できる", () => {
  const attributes: MarkAttributes = {
    id: "mark-1",
    style: "background-color: #ffff00;",
  };
  expect(attributes.id).toBe("mark-1");
  expect(attributes.style).toBe("background-color: #ffff00;");
  expect(attributes.class).toBeUndefined();
});

test("MarkAttributes - カスタムdata属性を含むことができる", () => {
  const attributes: MarkAttributes = {
    "data-testid": "mark-component",
    "data-highlight": "true",
    "data-importance": "high",
  };

  expect(attributes["data-testid"]).toBe("mark-component");
  expect(attributes["data-highlight"]).toBe("true");
  expect(attributes["data-importance"]).toBe("high");
});

test("MarkAttributes - アクセシビリティ属性を含むことができる", () => {
  const attributes: MarkAttributes = {
    "aria-label": "Highlighted text section",
    "aria-describedby": "mark-description",
    "aria-hidden": "false",
    role: "mark",
  };

  expect(attributes["aria-label"]).toBe("Highlighted text section");
  expect(attributes["aria-describedby"]).toBe("mark-description");
  expect(attributes["aria-hidden"]).toBe("false");
  expect(attributes.role).toBe("mark");
});

test("MarkAttributes - GlobalAttributesと互換性がある", () => {
  const globalAttrs = {
    id: "test",
    class: "test-class",
    style: "color: red;",
  };

  const markAttributes: MarkAttributes = globalAttrs;
  expect(markAttributes.id).toBe("test");
  expect(markAttributes.class).toBe("test-class");
  expect(markAttributes.style).toBe("color: red;");
});
