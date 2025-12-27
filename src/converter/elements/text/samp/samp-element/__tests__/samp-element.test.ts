import { describe, test, expect } from "vitest";
import { SampElement } from "../samp-element";

describe("SampElement.isSampElement", () => {
  test("samp要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "samp",
      attributes: {},
      children: [],
    };

    expect(SampElement.isSampElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(SampElement.isSampElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(SampElement.isSampElement(null)).toBe(false);
  });
});

describe("SampElement.create", () => {
  test("デフォルト値でsamp要素を作成する", () => {
    const element = SampElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("samp");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでsamp要素を作成する", () => {
    const element = SampElement.create({
      id: "output-sample",
      class: "sample-output",
    });

    expect(element.attributes?.id).toBe("output-sample");
    expect(element.attributes?.class).toBe("sample-output");
  });
});

describe("SampElement accessors", () => {
  test("getIdはid属性を取得する", () => {
    const element = SampElement.create({ id: "output-sample" });
    expect(SampElement.getId(element)).toBe("output-sample");
  });

  test("getClassはclass属性を取得する", () => {
    const element = SampElement.create({ class: "sample-output" });
    expect(SampElement.getClass(element)).toBe("sample-output");
  });

  test("getStyleはstyle属性を取得する", () => {
    const element = SampElement.create({ style: "font-family: monospace" });
    expect(SampElement.getStyle(element)).toBe("font-family: monospace");
  });
});
