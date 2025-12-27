import { describe, test, expect } from "vitest";
import { VarElement } from "../var-element";

describe("VarElement.isVarElement", () => {
  test("var要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "var",
      attributes: {},
      children: [],
    };

    expect(VarElement.isVarElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(VarElement.isVarElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(VarElement.isVarElement(null)).toBe(false);
  });
});

describe("VarElement.create", () => {
  test("デフォルト値でvar要素を作成する", () => {
    const element = VarElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("var");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでvar要素を作成する", () => {
    const element = VarElement.create({
      id: "variable-x",
      class: "math-var",
    });

    expect(element.attributes?.id).toBe("variable-x");
    expect(element.attributes?.class).toBe("math-var");
  });
});

describe("VarElement accessors", () => {
  test("getIdはid属性を取得する", () => {
    const element = VarElement.create({ id: "variable-x" });
    expect(VarElement.getId(element)).toBe("variable-x");
  });

  test("getClassはclass属性を取得する", () => {
    const element = VarElement.create({ class: "math-var" });
    expect(VarElement.getClass(element)).toBe("math-var");
  });

  test("getStyleはstyle属性を取得する", () => {
    const element = VarElement.create({ style: "font-style: italic" });
    expect(VarElement.getStyle(element)).toBe("font-style: italic");
  });
});
