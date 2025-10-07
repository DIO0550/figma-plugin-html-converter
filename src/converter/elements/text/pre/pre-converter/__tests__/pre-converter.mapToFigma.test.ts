import { test, expect } from "vitest";
import { mapToFigma } from "../pre-converter";

test("mapToFigma - pre要素ノードをFigmaノード設定にマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - 属性とchildrenを持つpre要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "pre",
    attributes: {
      id: "test-pre",
      style: "color: blue;",
    },
    children: [{ type: "text", textContent: "Test code" }],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
  expect(result?.name).toContain("test-pre");
  expect(result?.children).toHaveLength(1);
});

test("mapToFigma - pre以外の要素に対してはnullを返す", () => {
  const node = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - pタグに対してnullを返す", () => {
  const node = {
    type: "element",
    tagName: "p",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - codeタグに対してnullを返す", () => {
  const node = {
    type: "element",
    tagName: "code",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - テキストノードに対してnullを返す", () => {
  const node = {
    type: "text",
    textContent: "text",
  };

  const result = mapToFigma(node);

  expect(result).toBeNull();
});

test("mapToFigma - コメントノードに対してnullを返す", () => {
  const node = {
    type: "comment",
    textContent: "<!-- comment -->",
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
    tagName: "pre",
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
    tagName: "pre",
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - childrenプロパティがない要素も処理できる", () => {
  const node = {
    type: "element",
    tagName: "pre",
    attributes: {},
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - 最小限の構造でも処理できる", () => {
  const node = {
    type: "element",
    tagName: "pre",
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});
