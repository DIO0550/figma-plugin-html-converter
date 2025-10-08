import { test, expect } from "vitest";
import { mapToFigma } from "../blockquote-converter";

test("mapToFigma - blockquote要素ノードをFigmaノード設定にマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "blockquote",
    attributes: {},
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - 属性とchildrenを持つblockquote要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      id: "test-quote",
      cite: "https://example.com/source",
      style: "margin-left: 40px;",
    },
    children: [{ type: "text", textContent: "Famous quote" }],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
  expect(result?.name).toContain("test-quote");
  expect(result?.children).toHaveLength(1);
});

test("mapToFigma - cite属性を持つblockquote要素を正しくマッピングできる", () => {
  const node = {
    type: "element",
    tagName: "blockquote",
    attributes: {
      cite: "https://example.com/quote-source",
    },
    children: [],
  };

  const result = mapToFigma(node);

  expect(result).toBeDefined();
  expect(result?.type).toBe("FRAME");
});

test("mapToFigma - blockquote以外の要素に対してはnullを返す", () => {
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

test("mapToFigma - テキストノードに対してnullを返す", () => {
  const node = {
    type: "text",
    textContent: "text",
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

test("mapToFigma - 数値に対してnullを返す", () => {
  const result = mapToFigma(123);
  expect(result).toBeNull();
});

test("mapToFigma - 文字列に対してnullを返す", () => {
  const result = mapToFigma("blockquote");
  expect(result).toBeNull();
});

test("mapToFigma - 配列に対してnullを返す", () => {
  const result = mapToFigma([]);
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

test("mapToFigma - typeプロパティがない要素に対してnullを返す", () => {
  const node = {
    tagName: "blockquote",
    attributes: {},
  };

  const result = mapToFigma(node);
  expect(result).toBeNull();
});
