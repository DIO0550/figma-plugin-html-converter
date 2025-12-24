import { describe, test, expect } from "vitest";
import { VarConverter } from "../var-converter";
import type { VarElement } from "../../var-element";

describe("VarConverter.toFigmaNode", () => {
  test("基本的なvar要素をTEXTノードに変換する（イタリック体）", () => {
    const element: VarElement = {
      type: "element",
      tagName: "var",
      attributes: {},
      children: [],
    };

    const result = VarConverter.toFigmaNode(element);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("var");
    expect(result.content).toBe("");
    expect(result.style?.fontStyle).toBe("italic");
  });

  test("テキストコンテンツを持つvar要素を正しく変換する", () => {
    const element: VarElement = {
      type: "element",
      tagName: "var",
      attributes: {},
      children: [{ type: "text", textContent: "x" }],
    };

    const result = VarConverter.toFigmaNode(element);

    expect(result.content).toBe("x");
  });

  test("ID属性をノード名に反映する", () => {
    const element: VarElement = {
      type: "element",
      tagName: "var",
      attributes: { id: "variable-x" },
      children: [],
    };

    const result = VarConverter.toFigmaNode(element);

    expect(result.name).toBe("var#variable-x");
  });

  test("スタイル属性でfont-styleをオーバーライドできる", () => {
    const element: VarElement = {
      type: "element",
      tagName: "var",
      attributes: { style: "font-style: normal" },
      children: [],
    };

    const result = VarConverter.toFigmaNode(element);

    // font-style: normalの場合、FigmaではfontStyleプロパティは設定されない（undefinedになる）
    expect(result.style?.fontStyle).toBeUndefined();
  });
});

describe("VarConverter.mapToFigma", () => {
  test("var要素を正しく変換する", () => {
    const element = {
      type: "element",
      tagName: "var",
      attributes: {},
      children: [],
    };

    const result = VarConverter.mapToFigma(element);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TEXT");
  });

  test("var要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = VarConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = VarConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
