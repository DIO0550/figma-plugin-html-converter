import { test, expect } from "vitest";
import { QElement } from "../q-element";

test("QElement.isQElement - q要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "q",
    attributes: {},
    children: [],
  };

  expect(QElement.isQElement(element)).toBe(true);
});

test("QElement.isQElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(QElement.isQElement(element)).toBe(false);
});

test("QElement.isQElement - nullの場合 - falseを返す", () => {
  expect(QElement.isQElement(null)).toBe(false);
});

test("QElement.create - デフォルト値 - q要素を作成する", () => {
  const element = QElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("q");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("QElement.create - 属性付き - q要素を作成する", () => {
  const element = QElement.create({
    cite: "https://example.com/source",
    id: "quote-1",
  });

  expect(element.attributes?.cite).toBe("https://example.com/source");
  expect(element.attributes?.id).toBe("quote-1");
});

test("QElement.getCite - cite属性がある場合 - cite属性を取得する", () => {
  const element = QElement.create({ cite: "https://example.com" });
  expect(QElement.getCite(element)).toBe("https://example.com");
});

test("QElement.getCite - cite属性がない場合 - undefinedを返す", () => {
  const element = QElement.create({});
  expect(QElement.getCite(element)).toBeUndefined();
});
