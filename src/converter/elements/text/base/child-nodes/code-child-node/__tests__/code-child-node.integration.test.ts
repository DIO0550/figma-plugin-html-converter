import { test, expect } from "vitest";
import { CodeChildNode } from "../code-child-node";
import type { ChildNodeContext } from "../../base";

test("CodeChildNode.toFigmaNode - 空のcontentでも安全に処理できる", () => {
  const node = CodeChildNode.create("");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.content).toBe("");
  expect(result.node.type).toBe("TEXT");
  expect(result.metadata.isText).toBe(true);
});

test("CodeChildNode.toFigmaNode - 非常に長いコード文字列を処理できる", () => {
  const longCode = "x".repeat(10000);
  const node = CodeChildNode.create(longCode);
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.content).toBe(longCode);
  expect(result.node.content.length).toBe(10000);
});

test("CodeChildNode.toFigmaNode - 親スタイルとcodeデフォルトスタイルが正しくマージされる", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
    parentStyle: "color: blue; line-height: 1.5;",
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  // codeのデフォルトスタイル（font-family, font-size）が優先される
  expect(result.node.style.fontFamily).toBe("Courier New");
  expect(result.node.style.fontSize).toBe(14);
});

test("CodeChildNode.toFigmaNode - カスタムスタイルが親スタイルより優先される", () => {
  const styles = { color: "red", "font-size": "12px" };
  const node = CodeChildNode.create("const x = 10;", styles);
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
    parentStyle: "color: blue; font-size: 16px;",
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  // カスタムスタイルが最優先
  expect(result.node.style.fontSize).toBe(12);
});

test("CodeChildNode.toFigmaNode - 複数のスタイルプロパティを正しく統合できる", () => {
  const styles = {
    color: "red",
    "font-size": "16px",
    "font-weight": "700",
  };
  const node = CodeChildNode.create("const x = 10;", styles);
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
    parentStyle: "color: blue; line-height: 1.5; letter-spacing: 0.5px;",
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  // カスタムスタイル
  expect(result.node.style.fontSize).toBe(16);
  expect(result.node.style.fontWeight).toBe(700);
  // codeデフォルトスタイル
  expect(result.node.style.fontFamily).toBe("Courier New");
});

test("CodeChildNode.toFigmaNode - h1内のcode要素はtagNameを持たない", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "h1",
    isHeading: true,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.metadata.tagName).toBeUndefined();
  expect(result.metadata.isText).toBe(true);
  expect(result.metadata.isBold).toBe(false);
  expect(result.metadata.isItalic).toBe(false);
});

test("CodeChildNode.toFigmaNode - div内のcode要素はtagNameを持つ", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "div",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.metadata.tagName).toBe("code");
});

test("CodeChildNode.toFigmaNode - 特殊文字を含むコードを処理できる", () => {
  const specialCode = "<script>alert('test');</script>\n\t日本語 🚀";
  const node = CodeChildNode.create(specialCode);
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.content).toBe(specialCode);
  expect(result.node.type).toBe("TEXT");
});

test("CodeChildNode.toFigmaNode - 空のparentStyleを処理できる", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
    parentStyle: "",
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.type).toBe("TEXT");
  expect(result.node.style.fontFamily).toBe("Courier New");
});

test("CodeChildNode.toFigmaNode - 無効なparentStyleを安全に処理できる", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
    parentStyle: "invalid;;;style;;;",
  };

  // エラーをスローせずに処理できることを確認
  expect(() => {
    const result = CodeChildNode.toFigmaNode(node, context);
    expect(result.node.type).toBe("TEXT");
  }).not.toThrow();
});
