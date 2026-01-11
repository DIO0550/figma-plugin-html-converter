/**
 * embed要素の統合テスト
 * mapper.tsを通じた変換処理をテスト
 */

import { describe, test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "../../../mapper";

describe("embed要素の統合テスト", () => {
  test("基本的なembed要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "embed",
      attributes: {
        src: "https://example.com/video.mp4",
        type: "video/mp4",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("embed: video/mp4");
  });

  test("サイズ属性を持つembed要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "embed",
      attributes: {
        src: "https://example.com/video.mp4",
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
      tagName: "embed",
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
      tagName: "embed",
      attributes: {
        src: "https://example.com/video.mp4",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.children).toBeDefined();
    expect(Array.isArray(figmaNode.children)).toBe(true);
    expect(figmaNode.children?.length).toBeGreaterThan(0);
  });

  test("PDFタイプのembed要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "embed",
      attributes: {
        src: "https://example.com/document.pdf",
        type: "application/pdf",
        width: "800",
        height: "600",
      },
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.name).toBe("embed: application/pdf");
    expect(figmaNode.width).toBe(800);
    expect(figmaNode.height).toBe(600);
  });

  test("スタイル属性を持つembed要素を変換できる", () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "embed",
      attributes: {
        src: "https://example.com/video.mp4",
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
