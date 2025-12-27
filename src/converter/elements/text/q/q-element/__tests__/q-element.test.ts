import { describe, test, expect } from "vitest";
import { QElement } from "../q-element";

describe("QElement.isQElement", () => {
  test("q要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "q",
      attributes: {},
      children: [],
    };

    expect(QElement.isQElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(QElement.isQElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(QElement.isQElement(null)).toBe(false);
  });
});

describe("QElement.create", () => {
  test("デフォルト値でq要素を作成する", () => {
    const element = QElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("q");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでq要素を作成する", () => {
    const element = QElement.create({
      cite: "https://example.com/source",
      id: "quote-1",
    });

    expect(element.attributes?.cite).toBe("https://example.com/source");
    expect(element.attributes?.id).toBe("quote-1");
  });
});

describe("QElement accessors", () => {
  test("getCiteはcite属性を取得する", () => {
    const element = QElement.create({ cite: "https://example.com" });
    expect(QElement.getCite(element)).toBe("https://example.com");
  });

  test("cite属性がない場合undefinedを返す", () => {
    const element = QElement.create({});
    expect(QElement.getCite(element)).toBeUndefined();
  });
});
