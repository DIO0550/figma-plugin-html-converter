import { test, expect } from "vitest";
import { DelConverter } from "../del-converter";
import { DelElement } from "../../del-element";
import {
  createDelElement,
  createTextNode,
  createElementNode,
} from "./test-helpers";

test("DelConverter.toFigmaNode() - デフォルトで取り消し線装飾を適用する", () => {
  const element = DelElement.create({});
  const config = DelConverter.toFigmaNode(element);
  expect(config.style.textDecoration).toBe("STRIKETHROUGH");
});

test("DelConverter.toFigmaNode() - cite属性を処理する", () => {
  const element = DelElement.create({
    cite: "https://example.com/source",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("DelConverter.toFigmaNode() - datetime属性を処理する", () => {
  const element = DelElement.create({
    datetime: "2025-11-09T10:00:00",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("DelConverter.toFigmaNode() - citeとdatetime属性の両方を処理する", () => {
  const element = DelElement.create({
    cite: "https://example.com/source",
    datetime: "2025-11-09",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("DelConverter.toFigmaNode() - 子要素を処理する", () => {
  const element = createDelElement({}, [createTextNode("deleted text")]);
  const config = DelConverter.toFigmaNode(element);
  expect(config.content).toBe("deleted text");
});

test("DelConverter.toFigmaNode() - ネストされた要素を処理する", () => {
  const element = createDelElement({}, [
    createElementNode("strong", [createTextNode("bold deleted text")]),
  ]);
  const config = DelConverter.toFigmaNode(element);
  expect(config.content).toBe("bold deleted text");
});

test("DelConverter.toFigmaNode() - 空の要素を処理する", () => {
  const element = DelElement.create({}, []);
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("");
});

test("DelConverter.toFigmaNode() - id属性を適用する", () => {
  const element = DelElement.create({ id: "test-del" });
  const config = DelConverter.toFigmaNode(element);
  expect(config.name).toContain("test-del");
});

test("DelConverter.toFigmaNode() - class属性を適用する", () => {
  const element = DelElement.create({ class: "highlight" });
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("DelConverter.toFigmaNode() - 複雑なテキストコンテンツを処理する", () => {
  const element = createDelElement({}, [
    createTextNode("This is "),
    createElementNode("em", [createTextNode("emphasized")]),
    createTextNode(" deleted text"),
  ]);
  const config = DelConverter.toFigmaNode(element);
  expect(config.content).toBe("This is emphasized deleted text");
});

test("DelConverter.toFigmaNode() - 特殊文字を処理する", () => {
  const element = createDelElement({}, [createTextNode("<>&\"'")]);
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("<>&\"'");
});

test("DelConverter.toFigmaNode() - 非常に長いテキストを処理する", () => {
  const LONG_TEXT_LENGTH = 10000;
  const longText = "a".repeat(LONG_TEXT_LENGTH);
  const element = createDelElement({}, [createTextNode(longText)]);
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe(longText);
});

test("DelConverter.toFigmaNode() - 深くネストされた要素を処理する", () => {
  const element = createDelElement({}, [
    createElementNode("span", [
      createElementNode("strong", [createTextNode("deeply nested")]),
    ]),
  ]);
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("deeply nested");
});

test("DelConverter.toFigmaNode() - undefined属性を処理する", () => {
  const element = createDelElement(undefined, []);
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("DelConverter.toFigmaNode() - null childrenを処理する", () => {
  const element = DelElement.create({});
  element.children = undefined;
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("");
});

test("DelConverter.toFigmaNode() - 有効なFigmaノード設定を作成する", () => {
  const element = DelElement.create({
    style: "color: blue; font-size: 14px;",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config.type).toBe("TEXT");
  expect(config.name).toBeDefined();
});
