/**
 * object要素の統合テスト
 * mapper.tsを通じた変換処理をテスト
 */

import { describe, test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "../../../mapper";

describe("object要素の統合テスト", () => {
  test("基本的なobject要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {
        data: "https://example.com/content.swf",
        type: "application/x-shockwave-flash",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("object: application/x-shockwave-flash");
  });

  test("サイズ属性を持つobject要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {
        data: "https://example.com/content.swf",
        width: "640",
        height: "360",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.width).toBe(640);
    expect(figmaNode.height).toBe(360);
  });

  test("デフォルトサイズを適用できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {},
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.width).toBe(300);
    expect(figmaNode.height).toBe(150);
  });

  test("プレースホルダーが子要素として含まれる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {
        data: "https://example.com/content.swf",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.children).toBeDefined();
    expect(Array.isArray(figmaNode.children)).toBe(true);
    expect(figmaNode.children?.length).toBeGreaterThan(0);
  });

  test("name属性を持つobject要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {
        data: "https://example.com/content.swf",
        name: "myFlashObject",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.name).toBe("object: myFlashObject");
  });

  test("PDFビューアのobject要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {
        data: "https://example.com/document.pdf",
        type: "application/pdf",
        width: "800",
        height: "600",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.name).toBe("object: application/pdf");
    expect(figmaNode.width).toBe(800);
    expect(figmaNode.height).toBe(600);
  });

  test("スタイル属性を持つobject要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {
        data: "https://example.com/content.swf",
        style: "border: 2px solid #333; border-radius: 8px;",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.strokes).toBeDefined();
    expect(figmaNode.strokeWeight).toBe(2);
    expect(figmaNode.cornerRadius).toBe(8);
  });
});
