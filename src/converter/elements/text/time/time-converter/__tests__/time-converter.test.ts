import { describe, test, expect } from "vitest";
import { TimeConverter } from "../time-converter";
import type { TimeElement } from "../../time-element";

describe("TimeConverter.toFigmaNode", () => {
  test("基本的なtime要素をTEXTノードに変換する", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: {},
      children: [],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("time");
    expect(result.content).toBe("");
    expect(result.style).toEqual({
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: { unit: "PIXELS", value: 24 },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
    });
  });

  test("テキストコンテンツを持つtime要素を正しく変換する", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: { datetime: "2024-12-25" },
      children: [{ type: "text", textContent: "December 25, 2024" }],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.content).toBe("December 25, 2024");
  });

  test("datetime属性をノード名に含める", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: { datetime: "2024-12-25T10:00:00" },
      children: [],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.name).toBe("time [2024-12-25T10:00:00]");
  });

  test("ID属性をノード名に反映する", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: { id: "event-date" },
      children: [],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.name).toBe("time#event-date");
  });

  test("class属性をノード名に反映する", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: { class: "highlight" },
      children: [],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.name).toBe("time.highlight");
  });

  test("IDとdatetime両方がある場合両方をノード名に含める", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: {
        id: "event-date",
        datetime: "2024-12-25",
      },
      children: [],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.name).toBe("time#event-date [2024-12-25]");
  });

  test("スタイル属性を正しく適用する", () => {
    const element: TimeElement = {
      type: "element",
      tagName: "time",
      attributes: { style: "color: blue; font-weight: bold" },
      children: [],
    };

    const result = TimeConverter.toFigmaNode(element);

    expect(result.style?.fontWeight).toBe(700);
    expect(result.style?.fills).toEqual([
      { type: "SOLID", color: { r: 0, g: 0, b: 1, a: 1 } },
    ]);
  });
});

describe("TimeConverter.mapToFigma", () => {
  test("time要素を正しく変換する", () => {
    const element = {
      type: "element",
      tagName: "time",
      attributes: {},
      children: [],
    };

    const result = TimeConverter.mapToFigma(element);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TEXT");
  });

  test("time要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = TimeConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = TimeConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
