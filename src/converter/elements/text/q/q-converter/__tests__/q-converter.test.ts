import { test, expect } from "vitest";
import { QConverter } from "../q-converter";
import type { QElement } from "../../q-element";

test("QConverter.toFigmaNode - 基本的なq要素 - TEXTノードに変換する（引用符付き）", () => {
  const element: QElement = {
    type: "element",
    tagName: "q",
    attributes: {},
    children: [{ type: "text", textContent: "Hello World" }],
  };

  const result = QConverter.toFigmaNode(element);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("q");
  expect(result.content).toBe('"Hello World"');
});

test("QConverter.toFigmaNode - 空のq要素 - 空の引用符になる", () => {
  const element: QElement = {
    type: "element",
    tagName: "q",
    attributes: {},
    children: [],
  };

  const result = QConverter.toFigmaNode(element);

  expect(result.content).toBe('""');
});

test("QConverter.toFigmaNode - cite属性がある場合 - ノード名に含める", () => {
  const element: QElement = {
    type: "element",
    tagName: "q",
    attributes: { cite: "https://example.com/source" },
    children: [],
  };

  const result = QConverter.toFigmaNode(element);

  expect(result.name).toBe("q [https://example.com/source]");
});

test("QConverter.toFigmaNode - ID属性がある場合 - ノード名に反映する", () => {
  const element: QElement = {
    type: "element",
    tagName: "q",
    attributes: { id: "quote-1" },
    children: [],
  };

  const result = QConverter.toFigmaNode(element);

  expect(result.name).toBe("q#quote-1");
});

test("QConverter.toFigmaNode - IDとcite両方がある場合 - 両方をノード名に含める", () => {
  const element: QElement = {
    type: "element",
    tagName: "q",
    attributes: {
      id: "quote-1",
      cite: "https://example.com",
    },
    children: [],
  };

  const result = QConverter.toFigmaNode(element);

  expect(result.name).toBe("q#quote-1 [https://example.com]");
});

test("QConverter.mapToFigma - q要素の場合 - 正しく変換する", () => {
  const element = {
    type: "element",
    tagName: "q",
    attributes: {},
    children: [],
  };

  const result = QConverter.mapToFigma(element);

  expect(result).not.toBeNull();
  expect(result?.type).toBe("TEXT");
});

test("QConverter.mapToFigma - q要素でない場合 - nullを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  const result = QConverter.mapToFigma(element);

  expect(result).toBeNull();
});

test("QConverter.mapToFigma - nullを渡した場合 - nullを返す", () => {
  const result = QConverter.mapToFigma(null);
  expect(result).toBeNull();
});
