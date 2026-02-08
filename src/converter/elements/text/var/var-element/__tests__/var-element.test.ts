import { test, expect } from "vitest";
import { VarElement } from "../var-element";

test("VarElement.isVarElement - var要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "var",
    attributes: {},
    children: [],
  };

  expect(VarElement.isVarElement(element)).toBe(true);
});

test("VarElement.isVarElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(VarElement.isVarElement(element)).toBe(false);
});

test("VarElement.isVarElement - nullの場合 - falseを返す", () => {
  expect(VarElement.isVarElement(null)).toBe(false);
});

test("VarElement.create - デフォルト値 - var要素を作成する", () => {
  const element = VarElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("var");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("VarElement.create - 属性付き - var要素を作成する", () => {
  const element = VarElement.create({
    id: "variable-x",
    class: "math-var",
  });

  expect(element.attributes?.id).toBe("variable-x");
  expect(element.attributes?.class).toBe("math-var");
});

test("VarElement.getId - id属性がある場合 - id属性を取得する", () => {
  const element = VarElement.create({ id: "variable-x" });
  expect(VarElement.getId(element)).toBe("variable-x");
});

test("VarElement.getClass - class属性がある場合 - class属性を取得する", () => {
  const element = VarElement.create({ class: "math-var" });
  expect(VarElement.getClass(element)).toBe("math-var");
});

test("VarElement.getStyle - style属性がある場合 - style属性を取得する", () => {
  const element = VarElement.create({ style: "font-style: italic" });
  expect(VarElement.getStyle(element)).toBe("font-style: italic");
});
