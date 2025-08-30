import { test, expect } from "vitest";
import { mapToFigma } from "../p-converter";

test("mapToFigma - p要素ノードをFigmaノード設定にマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - 属性とchildrenを持つp要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "p",
    attributes: {
      id: "test-paragraph",
      style: "color: blue;",
    },
    children: [{ type: "text", content: "Test content" }],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
  expect(result?.name).toContain("test-paragraph");
  expect(result?.children).toHaveLength(1);
});

test("mapToFigma - p以外の要素に対してはnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - spanタグに対してnullを返す", () => {
  const node = {
    type: "element",
    tagName: "span",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - h1タグに対してnullを返す", () => {
  const node = {
    type: "element",
    tagName: "h1",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - テキストノードに対してnullを返す", () => {
  const node = {
    type: "text",
    content: "text",
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - コメントノードに対してnullを返す", () => {
  const node = {
    type: "comment",
    content: "<!-- comment -->",
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - nullに対してnullを返す", () => {
  const result = mapToFigma(null);
  expect(result).toBeNull();
});

test("mapToFigma - undefinedに対してnullを返す", () => {
  const result = mapToFigma(undefined);
  expect(result).toBeNull();
});

test("mapToFigma - 空のオブジェクトに対してnullを返す", () => {
  const result = mapToFigma({});
  expect(result).toBeNull();
});

test("mapToFigma - typeプロパティがない要素に対してnullを返す", () => {
  const node = {
    tagName: "p",
    attributes: {},
  };

  const result = mapToFigma(node);
  expect(result).toBeNull();
});

test("mapToFigma - tagNameプロパティがない要素に対してnullを返す", () => {
  const node = {
    type: "element",
    attributes: {},
  };

  const result = mapToFigma(node);
  expect(result).toBeNull();
});

test("mapToFigma - attributesプロパティがない要素も処理できる", () => {
  const node = {
    type: "element",
    tagName: "p",
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - childrenプロパティがない要素も処理できる", () => {
  const node = {
    type: "element",
    tagName: "p",
    attributes: {},
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - 最小限の構造でも処理できる", () => {
  const node = {
    type: "element",
    tagName: "p",
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});
