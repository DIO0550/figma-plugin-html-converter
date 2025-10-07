import { test, expect } from "vitest";
import type { PreAttributes } from "../pre-attributes";

test("PreAttributes - GlobalAttributesのid、class、style属性を正しく継承できる", () => {
  const attributes: PreAttributes = {
    id: "test-pre",
    class: "code-block",
    style: "color: red;",
  };

  expect(attributes.id).toBe("test-pre");
  expect(attributes.class).toBe("code-block");
  expect(attributes.style).toBe("color: red;");
});

test("PreAttributes - 空のオブジェクトでも有効なPreAttributesとして扱える", () => {
  const attributes: PreAttributes = {};
  expect(attributes).toBeDefined();
});

test("PreAttributes - 一部の属性のみでも有効なPreAttributesとして扱える", () => {
  const attributes: PreAttributes = {
    class: "preformatted-text",
  };
  expect(attributes.class).toBe("preformatted-text");
  expect(attributes.id).toBeUndefined();
  expect(attributes.style).toBeUndefined();
});

test("PreAttributes - 複数のクラスを持つclass属性を扱える", () => {
  const attributes: PreAttributes = {
    class: "language-typescript line-numbers",
  };
  expect(attributes.class).toBe("language-typescript line-numbers");
});

test("PreAttributes - 複雑なstyle属性を扱える", () => {
  const attributes: PreAttributes = {
    style: "font-family: Courier New; color: #333; background-color: #f5f5f5;",
  };
  expect(attributes.style).toContain("font-family: Courier New");
  expect(attributes.style).toContain("color: #333");
  expect(attributes.style).toContain("background-color: #f5f5f5");
});
