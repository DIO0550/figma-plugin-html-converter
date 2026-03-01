import { test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "./mapper";
import type { HTMLNode } from "./models/html-node";
import { HTML } from "./models/html";

function createHTMLNode(html: string): HTMLNode {
  const parsed = HTML.from(html);
  return HTML.toHTMLNode(parsed);
}

// --- appendChildren 統合テスト ---

test("appendChildren - 子要素の再帰処理", () => {
  const node = createHTMLNode(
    "<div><span>child1</span><span>child2</span></div>",
  );
  const result = mapHTMLNodeToFigma(node);

  const children = (result as unknown as { children: unknown[] }).children;
  expect(children).toBeDefined();
  expect(children).toHaveLength(2);
});

test("appendChildren - コメントノード除外", () => {
  const node: HTMLNode = {
    type: "element",
    tagName: "div",
    children: [
      { type: "comment" },
      {
        type: "element",
        tagName: "span",
        children: [{ type: "text", textContent: "text" }],
      },
    ],
  };
  const result = mapHTMLNodeToFigma(node);

  const children = (result as unknown as { children: unknown[] }).children;
  expect(children).toHaveLength(1);
});

test("appendChildren - 子要素がコメントのみの場合 → childrenが設定されない", () => {
  const node: HTMLNode = {
    type: "element",
    tagName: "div",
    children: [{ type: "comment" }, { type: "comment" }],
  };
  const result = mapHTMLNodeToFigma(node);

  const children = (result as unknown as { children?: unknown[] }).children;
  expect(children).toBeUndefined();
});

test("appendChildren - 子要素なし要素 → appendChildrenは何もしない", () => {
  const node = createHTMLNode("<div></div>");
  const result = mapHTMLNodeToFigma(node);

  const children = (result as unknown as { children?: unknown[] }).children;
  expect(children).toBeUndefined();
});

test("appendChildren - display: block でflex解除（ulのAutoLayoutが削除される）", () => {
  const node = createHTMLNode('<ul style="display: block"><li>item</li></ul>');
  const result = mapHTMLNodeToFigma(node);

  // ulはresolveByTagでVERTICALのAutoLayoutが付与されるが、
  // display: blockにより削除される
  expect(result.layoutMode).toBeUndefined();
  expect(result.primaryAxisAlignItems).toBeUndefined();
  expect(result.counterAxisAlignItems).toBeUndefined();
  expect(result.itemSpacing).toBeUndefined();
});

test("appendChildren - body要素 + containerSize → width/height設定", () => {
  const node = createHTMLNode("<body><div>child</div></body>");
  const result = mapHTMLNodeToFigma(node, {
    containerWidth: 1024,
    containerHeight: 768,
  });

  expect(result.width).toBe(1024);
  expect(result.height).toBe(768);
});

test("appendChildren - コメントのみ子要素ではdisplay補正・コンテナ補正が実行されない", () => {
  const node: HTMLNode = {
    type: "element",
    tagName: "body",
    children: [{ type: "comment" }],
  };
  const result = mapHTMLNodeToFigma(node, {
    containerWidth: 800,
    containerHeight: 600,
  });

  // コメントのみなのでchildrenがフィルタ後に空 → コンテナサイズ補正が実行されない
  expect(result.width).toBeUndefined();
  expect(result.height).toBeUndefined();
});
