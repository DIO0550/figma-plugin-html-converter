/**
 * object要素の統合テスト
 * mapper.tsを通じた変換処理をテスト
 */

import { test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "../../../mapper";

test(
  "mapHTMLNodeToFigma - 基本的なobject要素 - object名を含むFRAMEノードを返す",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - サイズ属性を持つobject要素 - サイズを反映する",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - サイズ未指定のobject要素 - デフォルトサイズを適用する",
  () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "object",
      attributes: {},
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.width).toBe(300);
    expect(figmaNode.height).toBe(150);
  },
);

test(
  "mapHTMLNodeToFigma - dataありのobject要素 - プレースホルダーを含む",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - name属性を持つobject要素 - ノード名に反映する",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - PDFビューアのobject要素 - 名前とサイズを反映する",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - style属性を持つobject要素 - ボーダーと角丸を反映する",
  () => {
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
  },
);
