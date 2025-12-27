import { describe, test, expect } from "vitest";
import { AbbrConverter } from "../abbr-converter";
import type { AbbrElement } from "../../abbr-element";

describe("AbbrConverter.toFigmaNode", () => {
  test("基本的なabbr要素をTEXTノードに変換する", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: {},
      children: [],
    };

    const result = AbbrConverter.toFigmaNode(element);

    expect(result.type).toBe("TEXT");
    expect(result.name).toBe("abbr");
    expect(result.content).toBe("");
    expect(result.style).toEqual({
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: { unit: "PIXELS", value: 24 },
      letterSpacing: 0,
      textAlign: "LEFT",
      verticalAlign: "TOP",
      textDecoration: "UNDERLINE",
    });
  });

  test("テキストコンテンツを持つabbr要素を正しく変換する", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: { title: "HyperText Markup Language" },
      children: [{ type: "text", textContent: "HTML" }],
    };

    const result = AbbrConverter.toFigmaNode(element);

    expect(result.content).toBe("HTML");
  });

  test("title属性をノード名に含める", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: { title: "HyperText Markup Language" },
      children: [],
    };

    const result = AbbrConverter.toFigmaNode(element);

    expect(result.name).toBe("abbr [HyperText Markup Language]");
  });

  test("ID属性をノード名に反映する", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: { id: "html-abbr" },
      children: [],
    };

    const result = AbbrConverter.toFigmaNode(element);

    expect(result.name).toBe("abbr#html-abbr");
  });

  test("IDとtitle両方がある場合両方をノード名に含める", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: {
        id: "html-abbr",
        title: "HyperText Markup Language",
      },
      children: [],
    };

    const result = AbbrConverter.toFigmaNode(element);

    expect(result.name).toBe("abbr#html-abbr [HyperText Markup Language]");
  });

  test("スタイル属性でtext-decorationをオーバーライドできる", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: { style: "text-decoration: line-through" },
      children: [],
    };

    const result = AbbrConverter.toFigmaNode(element);

    // デフォルトのUNDERLINEがline-through（STRIKETHROUGH）でオーバーライドされることを確認
    expect(result.style?.textDecoration).toBe("STRIKETHROUGH");
  });

  test("スタイル属性でtext-decoration: noneを指定するとデフォルトの下線が削除される", () => {
    const element: AbbrElement = {
      type: "element",
      tagName: "abbr",
      attributes: { style: "text-decoration: none" },
      children: [],
    };

    const result = AbbrConverter.toFigmaNode(element);

    // デフォルトのUNDERLINEがnoneで削除されることを確認
    expect(result.style?.textDecoration).toBeUndefined();
  });
});

describe("AbbrConverter.mapToFigma", () => {
  test("abbr要素を正しく変換する", () => {
    const element = {
      type: "element",
      tagName: "abbr",
      attributes: {},
      children: [],
    };

    const result = AbbrConverter.mapToFigma(element);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TEXT");
  });

  test("abbr要素でない場合nullを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    const result = AbbrConverter.mapToFigma(element);

    expect(result).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const result = AbbrConverter.mapToFigma(null);
    expect(result).toBeNull();
  });
});
