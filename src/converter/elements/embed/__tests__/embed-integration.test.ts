/**
 * embed要素の統合テスト
 * mapper.tsを通じた変換処理をテスト
 */

import { test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "../../../mapper";

test(
  "mapHTMLNodeToFigma - 基本的なembed要素 - embed名を含むFRAMEノードを返す",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - サイズ属性を持つembed要素 - サイズを反映する",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - サイズ未指定のembed要素 - デフォルトサイズを適用する",
  () => {
    const htmlNode = {
      type: "element" as const,
      tagName: "embed",
      attributes: {},
      children: [],
    };

    const figmaNode = mapHTMLNodeToFigma(htmlNode);

    expect(figmaNode.width).toBe(300);
    expect(figmaNode.height).toBe(150);
  },
);

test(
  "mapHTMLNodeToFigma - srcありのembed要素 - プレースホルダーを含む",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - PDFタイプのembed要素 - 名前とサイズを反映する",
  () => {
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
  },
);

test(
  "mapHTMLNodeToFigma - style属性を持つembed要素 - ボーダーと角丸を反映する",
  () => {
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
  },
);
