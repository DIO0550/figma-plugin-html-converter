import { test, expect } from "vitest";
import { CodeChildNode } from "../code-child-node";
import type { ChildNodeContext } from "../../base";

test("CodeChildNode.toFigmaNode - デフォルトスタイルの場合 - Figmaノードに変換できる", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.type).toBe("TEXT");
  expect(result.node.content).toBe("const x = 10;");
  expect(result.node.style.fontFamily).toBe("Courier New");
  expect(result.node.style.fontSize).toBe(14);
  expect(result.metadata.isText).toBe(true);
  expect(result.metadata.tagName).toBe("code");
});

test("CodeChildNode.toFigmaNode - 親スタイルがある場合 - 親スタイルを継承してFigmaノードに変換できる", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
    parentStyle: "color: blue; font-size: 16px;",
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.type).toBe("TEXT");
  // codeのデフォルトスタイル（font-family, font-size）が優先される
  expect(result.node.style.fontFamily).toBe("Courier New");
  expect(result.node.style.fontSize).toBe(14);
});

test("CodeChildNode.toFigmaNode - カスタムスタイルがある場合 - カスタムスタイルを適用してFigmaノードに変換できる", () => {
  const styles = { color: "red", "font-size": "12px" };
  const node = CodeChildNode.create("const x = 10;", styles);
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.node.type).toBe("TEXT");
  // カスタムfont-sizeが適用される
  expect(result.node.style.fontSize).toBe(12);
});

test("CodeChildNode.toFigmaNode - 見出し内の場合 - tagNameを付与しない", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "h1",
    isHeading: true,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.metadata.tagName).toBeUndefined();
});

test("CodeChildNode.toFigmaNode - 段落内の場合 - tagNameを付与する", () => {
  const node = CodeChildNode.create("const x = 10;");
  const context: ChildNodeContext = {
    elementType: "p",
    isHeading: false,
  };

  const result = CodeChildNode.toFigmaNode(node, context);

  expect(result.metadata.tagName).toBe("code");
});
