import { test, expect } from "vitest";
import { toFigmaNode } from "../pre-converter";
import type { PreElement } from "../../pre-element";

test("toFigmaNode - シンプルなpre要素をFigmaノードに変換できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [],
  };

  const result = toFigmaNode(element);

  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("pre");
  expect(result.children).toEqual([]);
  expect(result.layoutMode).toBe("VERTICAL");
  expect(result.layoutSizingHorizontal).toBe("FILL");
});

test("toFigmaNode - 空のpre要素でも正しく処理される", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [],
  };

  const result = toFigmaNode(element);
  expect(result).toBeDefined();
  expect(result.type).toBe("FRAME");
});

test("toFigmaNode - テキストコンテンツを持つpre要素を変換できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [
      {
        type: "text" as const,
        textContent: "function hello() {\n  return 'world';\n}",
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "function hello() {\n  return 'world';\n}",
  });
});

test("toFigmaNode - 複数のテキストノードを処理できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [
      { type: "text" as const, textContent: "Line 1\n" },
      { type: "text" as const, textContent: "Line 2" },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(2);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "Line 1\n",
  });
  expect(result.children![1]).toMatchObject({
    type: "TEXT",
    content: "Line 2",
  });
});

test("toFigmaNode - code要素を含むpre要素を変換できる", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [
      {
        type: "element" as const,
        tagName: "code",
        attributes: {},
        children: [{ type: "text" as const, textContent: "const x = 10;" }],
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children!).toHaveLength(1);
  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "const x = 10;",
  });
});

test("toFigmaNode - 空白と改行を保持する", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [
      {
        type: "text" as const,
        textContent: "  indented text\n\n  another line",
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "  indented text\n\n  another line",
  });
});

test("toFigmaNode - タブ文字を保持する", () => {
  const element: PreElement = {
    type: "element",
    tagName: "pre",
    attributes: {},
    children: [
      {
        type: "text" as const,
        textContent: "\tif (true) {\n\t\treturn;\n\t}",
      },
    ],
  };

  const result = toFigmaNode(element);

  expect(result.children![0]).toMatchObject({
    type: "TEXT",
    content: "\tif (true) {\n\t\treturn;\n\t}",
  });
});
