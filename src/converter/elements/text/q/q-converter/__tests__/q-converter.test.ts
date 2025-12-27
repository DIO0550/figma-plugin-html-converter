import { describe, test, expect } from "vitest";
import { QConverter } from "../q-converter";
import type { QElement } from "../../q-element";

describe("QConverter.toFigmaNode", () => {
  test("基本的なq要素をTEXTノードに変換する（引用符付き）", () => {
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

  test("空のq要素は空の引用符になる", () => {
    const element: QElement = {
      type: "element",
      tagName: "q",
      attributes: {},
      children: [],
    };

    const result = QConverter.toFigmaNode(element);

    expect(result.content).toBe('""');
  });

  test("cite属性をノード名に含める", () => {
    const element: QElement = {
      type: "element",
      tagName: "q",
      attributes: { cite: "https://example.com/source" },
      children: [],
    };

    const result = QConverter.toFigmaNode(element);

    expect(result.name).toBe("q [https://example.com/source]");
  });

  test("ID属性をノード名に反映する", () => {
    const element: QElement = {
      type: "element",
      tagName: "q",
      attributes: { id: "quote-1" },
      children: [],
    };

    const result = QConverter.toFigmaNode(element);

    expect(result.name).toBe("q#quote-1");
  });

  test("IDとcite両方がある場合両方をノード名に含める", () => {
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
});

describe("QConverter.mapToFigma", () => {
  test("q要素を正しく変換する", () => {
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

  test("q要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = QConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = QConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
