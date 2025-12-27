import { describe, test, expect } from "vitest";
import { SampConverter } from "../samp-converter";
import type { SampElement } from "../../samp-element";

describe("SampConverter.toFigmaNode", () => {
  test("基本的なsamp要素をTEXTノードに変換する（モノスペースフォント）", () => {
    const element: SampElement = {
      type: "element",
      tagName: "samp",
      attributes: {},
      children: [],
    };

    const result = SampConverter.toFigmaNode(element);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("samp");
    expect(result.content).toBe("");
    expect(result.style?.fontFamily).toBe("monospace");
    expect(result.style?.fontSize).toBe(14);
  });

  test("テキストコンテンツを持つsamp要素を正しく変換する", () => {
    const element: SampElement = {
      type: "element",
      tagName: "samp",
      attributes: {},
      children: [{ type: "text", textContent: "Error: File not found" }],
    };

    const result = SampConverter.toFigmaNode(element);

    expect(result.content).toBe("Error: File not found");
  });

  test("ID属性をノード名に反映する", () => {
    const element: SampElement = {
      type: "element",
      tagName: "samp",
      attributes: { id: "output-sample" },
      children: [],
    };

    const result = SampConverter.toFigmaNode(element);

    expect(result.name).toBe("samp#output-sample");
  });

  test("スタイル属性でfont-familyをオーバーライドできる", () => {
    const element: SampElement = {
      type: "element",
      tagName: "samp",
      attributes: { style: "font-family: Courier New" },
      children: [],
    };

    const result = SampConverter.toFigmaNode(element);

    expect(result.style?.fontFamily).toBe("Courier New");
  });
});

describe("SampConverter.mapToFigma", () => {
  test("samp要素を正しく変換する", () => {
    const element = {
      type: "element",
      tagName: "samp",
      attributes: {},
      children: [],
    };

    const result = SampConverter.mapToFigma(element);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TEXT");
  });

  test("samp要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = SampConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = SampConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
