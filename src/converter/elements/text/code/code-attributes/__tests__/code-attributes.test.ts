import { test, expect } from "vitest";
import type { CodeAttributes } from "../code-attributes";

test("CodeAttributes - GlobalAttributesのid、class、style属性を正しく継承できる", () => {
  const attributes: CodeAttributes = {
    id: "test-code",
    class: "code-block",
    style: "color: red;",
  };

  expect(attributes.id).toBe("test-code");
  expect(attributes.class).toBe("code-block");
  expect(attributes.style).toBe("color: red;");
});

test("CodeAttributes - 空のオブジェクトでも有効なCodeAttributesとして扱える", () => {
  const attributes: CodeAttributes = {};
  expect(attributes).toBeDefined();
});

test("CodeAttributes - 一部の属性のみでも有効なCodeAttributesとして扱える", () => {
  const attributes: CodeAttributes = {
    class: "inline-code",
  };
  expect(attributes.class).toBe("inline-code");
  expect(attributes.id).toBeUndefined();
  expect(attributes.style).toBeUndefined();
});

test("CodeAttributes - 複数のクラスを持つclass属性を扱える", () => {
  const attributes: CodeAttributes = {
    class: "language-typescript highlight-line",
  };
  expect(attributes.class).toBe("language-typescript highlight-line");
});

test("CodeAttributes - 複雑なstyle属性を扱える", () => {
  const attributes: CodeAttributes = {
    style: "font-size: 14px; color: #ff0000; background-color: #f5f5f5;",
  };
  expect(attributes.style).toContain("font-size: 14px");
  expect(attributes.style).toContain("color: #ff0000");
  expect(attributes.style).toContain("background-color: #f5f5f5");
});
