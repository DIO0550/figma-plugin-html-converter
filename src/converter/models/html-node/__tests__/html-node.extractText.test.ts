import { test, expect } from "vitest";
import { HTMLNode } from "../html-node";

// ========================================
// extractText のテスト
// ========================================

test("HTMLNode.extractText - テキストノードからテキストを抽出する", () => {
  const node = {
    type: "text" as const,
    textContent: "Hello World",
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("Hello World");
});

test("HTMLNode.extractText - 空のテキストノードから空文字列を返す", () => {
  const node = {
    type: "text" as const,
    textContent: "",
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("");
});

test("HTMLNode.extractText - textContentがundefinedのテキストノードから空文字列を返す", () => {
  const node = {
    type: "text" as const,
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("");
});

test("HTMLNode.extractText - 子要素を持つ要素からテキストを抽出する", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
    children: [
      { type: "text" as const, textContent: "Hello " },
      { type: "text" as const, textContent: "World" },
    ],
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("Hello World");
});

test("HTMLNode.extractText - ネストした要素からテキストを再帰的に抽出する", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
    children: [
      { type: "text" as const, textContent: "This is " },
      {
        type: "element" as const,
        tagName: "span",
        children: [{ type: "text" as const, textContent: "nested" }],
      },
      { type: "text" as const, textContent: " text" },
    ],
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("This is nested text");
});

test("HTMLNode.extractText - 深くネストした構造からテキストを抽出する", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
    children: [
      {
        type: "element" as const,
        tagName: "p",
        children: [
          { type: "text" as const, textContent: "First " },
          {
            type: "element" as const,
            tagName: "strong",
            children: [
              { type: "text" as const, textContent: "bold" },
              {
                type: "element" as const,
                tagName: "em",
                children: [{ type: "text" as const, textContent: " italic" }],
              },
            ],
          },
          { type: "text" as const, textContent: " text" },
        ],
      },
    ],
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("First bold italic text");
});

test("HTMLNode.extractText - 子要素がない要素から空文字列を返す", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
    children: [],
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("");
});

test("HTMLNode.extractText - childrenがundefinedの要素から空文字列を返す", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("");
});

test("HTMLNode.extractText - nullを渡すと空文字列を返す", () => {
  const result = HTMLNode.extractText(null);

  expect(result).toBe("");
});

test("HTMLNode.extractText - undefinedを渡すと空文字列を返す", () => {
  const result = HTMLNode.extractText(undefined);

  expect(result).toBe("");
});

// ========================================
// 循環参照の処理
// ========================================

test("HTMLNode.extractText - 循環参照を持つ構造を処理できる", () => {
  const child: HTMLNode = {
    type: "element",
    tagName: "span",
    children: [],
  };

  const parent: HTMLNode = {
    type: "element",
    tagName: "div",
    children: [
      { type: "text", textContent: "Start " },
      child,
      { type: "text", textContent: " End" },
    ],
  };

  // 循環参照を作成
  child.children!.push(parent);

  const result = HTMLNode.extractText(parent);

  expect(result).toBe("Start  End");
});

test("HTMLNode.extractText - 自己参照を持つ構造を処理できる", () => {
  const node: HTMLNode = {
    type: "element",
    tagName: "div",
    children: [{ type: "text", textContent: "Text" }],
  };

  // 自己参照を追加
  node.children!.push(node);

  const result = HTMLNode.extractText(node);

  expect(result).toBe("Text");
});

// ========================================
// extractTextFromNodes のテスト
// ========================================

test("HTMLNode.extractTextFromNodes - 複数のノードからテキストを抽出する", () => {
  const nodes = [
    { type: "text" as const, textContent: "Hello" },
    { type: "text" as const, textContent: " " },
    { type: "text" as const, textContent: "World" },
  ];

  const result = HTMLNode.extractTextFromNodes(nodes);

  expect(result).toBe("Hello World");
});

test("HTMLNode.extractTextFromNodes - 混在するノード型からテキストを抽出する", () => {
  const nodes = [
    { type: "text" as const, textContent: "Start " },
    {
      type: "element" as const,
      tagName: "span",
      children: [{ type: "text" as const, textContent: "middle" }],
    },
    { type: "text" as const, textContent: " end" },
  ];

  const result = HTMLNode.extractTextFromNodes(nodes);

  expect(result).toBe("Start middle end");
});

test("HTMLNode.extractTextFromNodes - nullやundefinedを含む配列を処理する", () => {
  const nodes = [
    { type: "text" as const, textContent: "Hello" },
    null,
    { type: "text" as const, textContent: " " },
    undefined,
    { type: "text" as const, textContent: "World" },
  ];

  const result = HTMLNode.extractTextFromNodes(nodes);

  expect(result).toBe("Hello World");
});

test("HTMLNode.extractTextFromNodes - 空の配列から空文字列を返す", () => {
  const result = HTMLNode.extractTextFromNodes([]);

  expect(result).toBe("");
});

test("HTMLNode.extractTextFromNodes - 全てnullの配列から空文字列を返す", () => {
  const nodes = [null, undefined, null];

  const result = HTMLNode.extractTextFromNodes(nodes);

  expect(result).toBe("");
});

// ========================================
// 複雑な実使用例
// ========================================

test("HTMLNode.extractText - HTMLのような構造からテキストを抽出する", () => {
  const node = {
    type: "element" as const,
    tagName: "article",
    children: [
      {
        type: "element" as const,
        tagName: "h1",
        children: [{ type: "text" as const, textContent: "Title" }],
      },
      {
        type: "element" as const,
        tagName: "p",
        children: [
          { type: "text" as const, textContent: "This is a " },
          {
            type: "element" as const,
            tagName: "a",
            children: [{ type: "text" as const, textContent: "link" }],
          },
          { type: "text" as const, textContent: " in a paragraph." },
        ],
      },
      {
        type: "element" as const,
        tagName: "ul",
        children: [
          {
            type: "element" as const,
            tagName: "li",
            children: [{ type: "text" as const, textContent: "Item 1" }],
          },
          {
            type: "element" as const,
            tagName: "li",
            children: [{ type: "text" as const, textContent: "Item 2" }],
          },
        ],
      },
    ],
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("TitleThis is a link in a paragraph.Item 1Item 2");
});

// ========================================
// コメントノードの処理
// ========================================

test("HTMLNode.extractText - コメントノードを無視する", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
    children: [
      { type: "text" as const, textContent: "Before " },
      { type: "comment" as const, textContent: "This is a comment" },
      { type: "text" as const, textContent: "After" },
    ],
  };

  const result = HTMLNode.extractText(node);

  expect(result).toBe("Before After");
});

// ========================================
// 後方互換性のテスト
// ========================================

test("HTMLNode.extractText - APIを用いたテキスト抽出が行える", () => {
  const node = {
    type: "element" as const,
    tagName: "div",
    children: [
      { type: "text" as const, textContent: "Hello " },
      {
        type: "element" as const,
        tagName: "span",
        children: [{ type: "text" as const, textContent: "World" }],
      },
    ],
  };

  const extractTextResult = HTMLNode.extractText(node);
  expect(extractTextResult).toBe("Hello World");
});
