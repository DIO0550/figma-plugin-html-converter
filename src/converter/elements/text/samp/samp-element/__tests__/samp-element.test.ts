import { test, expect } from "vitest";
import { SampElement } from "../samp-element";

test("SampElement.isSampElement - samp要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "samp",
    attributes: {},
    children: [],
  };

  expect(SampElement.isSampElement(element)).toBe(true);
});

test("SampElement.isSampElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(SampElement.isSampElement(element)).toBe(false);
});

test("SampElement.isSampElement - nullの場合 - falseを返す", () => {
  expect(SampElement.isSampElement(null)).toBe(false);
});

test("SampElement.create - デフォルト値の場合 - samp要素を作成する", () => {
  const element = SampElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("samp");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("SampElement.create - 属性付きの場合 - samp要素を作成する", () => {
  const element = SampElement.create({
    id: "output-sample",
    class: "sample-output",
  });

  expect(element.attributes?.id).toBe("output-sample");
  expect(element.attributes?.class).toBe("sample-output");
});

test("SampElement.getId - id属性がある場合 - id属性を取得する", () => {
  const element = SampElement.create({ id: "output-sample" });
  expect(SampElement.getId(element)).toBe("output-sample");
});

test("SampElement.getClass - class属性がある場合 - class属性を取得する", () => {
  const element = SampElement.create({ class: "sample-output" });
  expect(SampElement.getClass(element)).toBe("sample-output");
});

test("SampElement.getStyle - style属性がある場合 - style属性を取得する", () => {
  const element = SampElement.create({ style: "font-family: monospace" });
  expect(SampElement.getStyle(element)).toBe("font-family: monospace");
});
