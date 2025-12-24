import { describe, test, expect } from "vitest";
import { CiteConverter } from "../cite-converter";
import type { CiteElement } from "../../cite-element";

describe("CiteConverter.toFigmaNode", () => {
  test("基本的なcite要素をTEXTノードに変換する（イタリック体）", () => {
    const element: CiteElement = {
      type: "element",
      tagName: "cite",
      attributes: {},
      children: [],
    };

    const result = CiteConverter.toFigmaNode(element);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("cite");
    expect(result.content).toBe("");
    expect(result.style?.fontStyle).toBe("italic");
  });

  test("テキストコンテンツを持つcite要素を正しく変換する", () => {
    const element: CiteElement = {
      type: "element",
      tagName: "cite",
      attributes: {},
      children: [{ type: "text", textContent: "The Great Gatsby" }],
    };

    const result = CiteConverter.toFigmaNode(element);

    expect(result.content).toBe("The Great Gatsby");
  });

  test("ID属性をノード名に反映する", () => {
    const element: CiteElement = {
      type: "element",
      tagName: "cite",
      attributes: { id: "book-title" },
      children: [],
    };

    const result = CiteConverter.toFigmaNode(element);

    expect(result.name).toBe("cite#book-title");
  });

  test("スタイル属性でfont-styleをオーバーライドできる", () => {
    const element: CiteElement = {
      type: "element",
      tagName: "cite",
      attributes: { style: "font-style: normal" },
      children: [],
    };

    const result = CiteConverter.toFigmaNode(element);

    // font-style: normalの場合、FigmaではfontStyleプロパティは設定されない（undefinedになる）
    expect(result.style?.fontStyle).toBeUndefined();
  });
});

describe("CiteConverter.mapToFigma", () => {
  test("cite要素を正しく変換する", () => {
    const element = {
      type: "element",
      tagName: "cite",
      attributes: {},
      children: [],
    };

    const result = CiteConverter.mapToFigma(element);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TEXT");
  });

  test("cite要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = CiteConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = CiteConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
