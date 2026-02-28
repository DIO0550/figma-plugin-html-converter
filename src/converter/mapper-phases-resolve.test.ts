import { test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "./mapper";
import { HTMLNode } from "./models/html-node";
import { HTML } from "./models/html";

function createHTMLNode(html: string): HTMLNode {
  const parsed = HTML.from(html);
  return HTML.toHTMLNode(parsed);
}

// --- 入口（text/comment）回帰テスト ---

test("入口 - テキストノード → TEXT返却", () => {
  const textNode: HTMLNode = {
    type: "text",
    textContent: "Hello",
  };

  const result = mapHTMLNodeToFigma(textNode);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("Text");
});

test("入口 - コメントノード → Commentフレーム返却", () => {
  const commentNode: HTMLNode = {
    type: "comment",
  };

  const result = mapHTMLNodeToFigma(commentNode);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("Comment");
});

// --- resolveByTag 統合テスト ---

test("resolveByTag - div要素 → フレーム生成", () => {
  const node = createHTMLNode("<div>test</div>");
  const result = mapHTMLNodeToFigma(node);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("div");
});

test("resolveByTag - img要素 → 画像ノード生成", () => {
  const node: HTMLNode = {
    type: "element",
    tagName: "img",
    attributes: { src: "test.png", alt: "test" },
  };
  const result = mapHTMLNodeToFigma(node);

  expect(result.name).toContain("img");
});

test("resolveByTag - video要素 → ビデオノード生成", () => {
  const node = createHTMLNode('<video src="test.mp4"></video>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.name).toContain("video");
});

test("resolveByTag - audio要素 → オーディオノード生成", () => {
  const node = createHTMLNode('<audio src="test.mp3"></audio>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.name).toContain("audio");
});

test("resolveByTag - iframe要素 → iframeノード生成", () => {
  const node = createHTMLNode('<iframe src="https://example.com"></iframe>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.name).toContain("iframe");
});

test("resolveByTag - ul要素 → VERTICAL autoLayout", () => {
  const node = createHTMLNode("<ul><li>item</li></ul>");
  const result = mapHTMLNodeToFigma(node);

  expect(result.type).toBe("FRAME");
  expect(result.layoutMode).toBe("VERTICAL");
});

test("resolveByTag - li要素 → HORIZONTAL autoLayout", () => {
  const node = createHTMLNode("<li>item</li>");
  const result = mapHTMLNodeToFigma(node);

  expect(result.type).toBe("FRAME");
  expect(result.layoutMode).toBe("HORIZONTAL");
});

test("resolveByTag - span要素 → テキストノード生成", () => {
  const node = createHTMLNode("<span>text content</span>");
  const result = mapHTMLNodeToFigma(node);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("span");
});

test("resolveByTag - h1要素 → テキストノード生成", () => {
  const node = createHTMLNode("<h1>heading</h1>");
  const result = mapHTMLNodeToFigma(node);

  expect(result.type).toBe("TEXT");
  expect(result.name).toBe("h1");
});
