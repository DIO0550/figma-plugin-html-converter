import { describe, test, expect } from "vitest";
import { KbdConverter } from "../kbd-converter";
import type { KbdElement } from "../../kbd-element";

describe("KbdConverter.toFigmaNode", () => {
  test("基本的なkbd要素をTEXTノードに変換する（モノスペースフォント）", () => {
    const element: KbdElement = {
      type: "element",
      tagName: "kbd",
      attributes: {},
      children: [],
    };

    const result = KbdConverter.toFigmaNode(element);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("kbd");
    expect(result.content).toBe("");
    expect(result.style?.fontFamily).toBe("monospace");
    expect(result.style?.fontSize).toBe(14);
  });

  test("テキストコンテンツを持つkbd要素を正しく変換する", () => {
    const element: KbdElement = {
      type: "element",
      tagName: "kbd",
      attributes: {},
      children: [{ type: "text", textContent: "Ctrl+C" }],
    };

    const result = KbdConverter.toFigmaNode(element);

    expect(result.content).toBe("Ctrl+C");
  });

  test("ID属性をノード名に反映する", () => {
    const element: KbdElement = {
      type: "element",
      tagName: "kbd",
      attributes: { id: "shortcut-copy" },
      children: [],
    };

    const result = KbdConverter.toFigmaNode(element);

    expect(result.name).toBe("kbd#shortcut-copy");
  });

  test("スタイル属性でfont-familyをオーバーライドできる", () => {
    const element: KbdElement = {
      type: "element",
      tagName: "kbd",
      attributes: { style: "font-family: Courier New" },
      children: [],
    };

    const result = KbdConverter.toFigmaNode(element);

    expect(result.style?.fontFamily).toBe("Courier New");
  });
});

describe("KbdConverter.mapToFigma", () => {
  test("kbd要素を正しく変換する", () => {
    const element = {
      type: "element",
      tagName: "kbd",
      attributes: {},
      children: [],
    };

    const result = KbdConverter.mapToFigma(element);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TEXT");
  });

  test("kbd要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = KbdConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = KbdConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
