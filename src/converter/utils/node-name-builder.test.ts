import { test, expect } from "vitest";
import { buildNodeName } from "./node-name-builder";
import type { HTMLNode } from "../models/html-node/html-node";

// ========================================
// テストヘルパー関数
// ========================================

function createElementNode(
  tagName: string,
  attributes?: Record<string, string>,
): HTMLNode {
  return {
    type: "element",
    tagName,
    attributes,
  };
}

// ========================================
// 基本的なタグ名のみのケース
// ========================================

test('buildNodeName - div要素（属性なし）を渡すと、"div"を返す', () => {
  // Arrange
  const node = createElementNode("div");

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div");
});

test('buildNodeName - span要素（属性なし）を渡すと、"span"を返す', () => {
  // Arrange
  const node = createElementNode("span");

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("span");
});

// ========================================
// パラメータ化テスト: 複数のタグ名
// ========================================

test.each([
  { tagName: "p", expected: "p" },
  { tagName: "section", expected: "section" },
  { tagName: "article", expected: "article" },
  { tagName: "header", expected: "header" },
  { tagName: "footer", expected: "footer" },
  { tagName: "nav", expected: "nav" },
  { tagName: "main", expected: "main" },
  { tagName: "aside", expected: "aside" },
  { tagName: "h1", expected: "h1" },
  { tagName: "h2", expected: "h2" },
  { tagName: "h3", expected: "h3" },
  { tagName: "h4", expected: "h4" },
  { tagName: "h5", expected: "h5" },
  { tagName: "h6", expected: "h6" },
])(
  'buildNodeName - $tagName要素（属性なし）を渡すと、"$expected"を返す',
  ({ tagName, expected }) => {
    // Arrange
    const node = createElementNode(tagName);

    // Act
    const result = buildNodeName(node);

    // Assert
    expect(result).toBe(expected);
  },
);

// ========================================
// ID属性のケース
// ========================================

test('buildNodeName - ID属性"main-container"を持つdiv要素を渡すと、"div#main-container"を返す', () => {
  // Arrange
  const node = createElementNode("div", { id: "main-container" });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div#main-container");
});

test('buildNodeName - ID属性"highlight"を持つspan要素を渡すと、"span#highlight"を返す', () => {
  // Arrange
  const node = createElementNode("span", { id: "highlight" });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("span#highlight");
});

// ========================================
// 特殊文字を含むID
// ========================================

test.each([
  { id: "test-123", expected: "div#test-123" },
  { id: "user_profile", expected: "div#user_profile" },
  { id: "item-001-description", expected: "div#item-001-description" },
  { id: "123", expected: "div#123" },
  { id: "_underscore", expected: "div#_underscore" },
])(
  'buildNodeName - 特殊文字を含むID"$id"を正しく処理する',
  ({ id, expected }) => {
    // Arrange
    const node = createElementNode("div", { id });

    // Act
    const result = buildNodeName(node);

    // Assert
    expect(result).toBe(expected);
  },
);

// ========================================
// クラス属性のケース
// ========================================

test('buildNodeName - 単一クラス"container"を持つdiv要素を渡すと、"div.container"を返す', () => {
  // Arrange
  const node = createElementNode("div", { class: "container" });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div.container");
});

test('buildNodeName - 複数クラス"text-bold text-primary highlight"を持つspan要素を渡すと、"span.text-bold.text-primary.highlight"を返す', () => {
  // Arrange
  const node = createElementNode("span", {
    class: "text-bold text-primary highlight",
  });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("span.text-bold.text-primary.highlight");
});

test("buildNodeName - クラス文字列に余分な空白がある場合、適切にトリミングして処理する", () => {
  // Arrange
  const node = createElementNode("p", {
    class: "  paragraph   main   ",
  });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("p.paragraph.main");
});

// ========================================
// 特殊文字を含むクラス名
// ========================================

test.each([
  {
    className: "btn--primary",
    expected: "button.btn--primary",
  },
  {
    className: "text-lg-center",
    expected: "button.text-lg-center",
  },
  {
    className: "is-active has-dropdown",
    expected: "button.is-active.has-dropdown",
  },
  {
    className: "col-md-6 col-lg-4",
    expected: "button.col-md-6.col-lg-4",
  },
])(
  'buildNodeName - 特殊文字を含むクラス"$className"を正しく処理する',
  ({ className, expected }) => {
    // Arrange
    const node = createElementNode("button", { class: className });

    // Act
    const result = buildNodeName(node);

    // Assert
    expect(result).toBe(expected);
  },
);

// ========================================
// ID+クラスの複合ケース
// ========================================

test('buildNodeName - ID"header"とクラス"navbar"を持つdiv要素を渡すと、"div#header.navbar"を返す', () => {
  // Arrange
  const node = createElementNode("div", {
    id: "header",
    class: "navbar",
  });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div#header.navbar");
});

test('buildNodeName - ID"content"と複数クラス"main-section active visible"を持つsection要素を渡すと、"section#content.main-section.active.visible"を返す', () => {
  // Arrange
  const node = createElementNode("section", {
    id: "content",
    class: "main-section active visible",
  });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("section#content.main-section.active.visible");
});

// ========================================
// エッジケース: 属性の状態
// ========================================

test("buildNodeName - attributesがundefinedの要素を渡すと、タグ名のみを返す", () => {
  // Arrange
  const node: HTMLNode = {
    type: "element",
    tagName: "article",
    attributes: undefined,
  };

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("article");
});

test("buildNodeName - 空のattributesオブジェクトを持つ要素を渡すと、タグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("h1", {});

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("h1");
});

test("buildNodeName - 空文字のclass属性を持つ要素を渡すと、タグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("p", { class: "" });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("p");
});

test("buildNodeName - 空白のみのclass属性を持つ要素を渡すと、タグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("span", { class: "   " });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("span");
});

// ========================================
// エッジケース: null/undefined の属性値
// ========================================

test("buildNodeName - IDがnullの場合、IDを無視してタグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("div", { id: null as any });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div");
});

test("buildNodeName - IDがundefinedの場合、IDを無視してタグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("div", { id: undefined as any });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div");
});

test("buildNodeName - クラスがnullの場合、クラスを無視してタグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("span", { class: null as any });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("span");
});

test("buildNodeName - クラスがundefinedの場合、クラスを無視してタグ名のみを返す", () => {
  // Arrange
  const node = createElementNode("span", { class: undefined as any });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("span");
});

// ========================================
// Unicode文字を含むID/クラス
// ========================================

test("buildNodeName - 日本語を含むIDを正しく処理する", () => {
  // Arrange
  const node = createElementNode("div", { id: "ヘッダー" });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div#ヘッダー");
});

test("buildNodeName - 日本語を含むクラス名を正しく処理する", () => {
  // Arrange
  const node = createElementNode("div", { class: "メイン コンテンツ" });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div.メイン.コンテンツ");
});

test("buildNodeName - 絵文字を含むID/クラスを正しく処理する", () => {
  // Arrange
  const node = createElementNode("div", {
    id: "emoji-🎉",
    class: "icon-💡 highlight-✨",
  });

  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe("div#emoji-🎉.icon-💡.highlight-✨");
});

// ========================================
// パフォーマンステスト: 極端に長いクラスリスト
// ========================================

test("buildNodeName - 100個のクラスを持つ要素でも正しく処理する", () => {
  // Arrange
  const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`);
  const node = createElementNode("div", {
    class: classes.join(" "),
  });

  // Act
  const startTime = performance.now();
  const result = buildNodeName(node);
  const endTime = performance.now();

  // Assert
  expect(result).toBe(`div.${classes.join(".")}`);
  expect(endTime - startTime).toBeLessThan(10); // 10ms以内に処理完了
});

// ========================================
// 実際の使用ケースのシミュレーション
// ========================================

test.each([
  {
    description: "Bootstrap のカード要素",
    node: createElementNode("div", {
      id: "product-card",
      class: "card card-body shadow-sm",
    }),
    expected: "div#product-card.card.card-body.shadow-sm",
  },
  {
    description: "React コンポーネントのルート要素",
    node: createElementNode("div", {
      id: "root",
      class: "App",
    }),
    expected: "div#root.App",
  },
  {
    description: "BEM 記法のブロック要素",
    node: createElementNode("nav", {
      class: "navigation navigation--main",
    }),
    expected: "nav.navigation.navigation--main",
  },
  {
    description: "Tailwind CSS のユーティリティクラス",
    node: createElementNode("button", {
      class: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
    }),
    expected:
      "button.px-4.py-2.bg-blue-500.text-white.rounded.hover:bg-blue-600",
  },
])("buildNodeName - 実使用例: $description", ({ node, expected }) => {
  // Act
  const result = buildNodeName(node);

  // Assert
  expect(result).toBe(expected);
});
