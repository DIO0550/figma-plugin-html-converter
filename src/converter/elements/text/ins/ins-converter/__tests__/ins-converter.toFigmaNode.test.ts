import { test, expect } from "vitest";
import { InsConverter } from "../ins-converter";
import { InsElement } from "../../ins-element";
import {
  createInsElement,
  createTextNode,
  createElementNode,
} from "./test-helpers";

test("InsConverter.toFigmaNode() - デフォルトで下線装飾を適用する", () => {
  const element = InsElement.create({});
  const config = InsConverter.toFigmaNode(element);
  expect(config.style.textDecoration).toBe("UNDERLINE");
});

test("InsConverter.toFigmaNode() - cite属性を処理する", () => {
  const element = InsElement.create({
    cite: "https://example.com/source",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("InsConverter.toFigmaNode() - datetime属性を処理する", () => {
  const element = InsElement.create({
    datetime: "2025-11-09T10:00:00",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("InsConverter.toFigmaNode() - citeとdatetime属性の両方を処理する", () => {
  const element = InsElement.create({
    cite: "https://example.com/source",
    datetime: "2025-11-09",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("InsConverter.toFigmaNode() - 子要素を処理する", () => {
  const element = createInsElement({}, [createTextNode("inserted text")]);
  const config = InsConverter.toFigmaNode(element);
  expect(config.content).toBe("inserted text");
});

test("InsConverter.toFigmaNode() - ネストされた要素を処理する", () => {
  const element = createInsElement({}, [
    createElementNode("strong", [createTextNode("bold inserted text")]),
  ]);
  const config = InsConverter.toFigmaNode(element);
  expect(config.content).toBe("bold inserted text");
});

test("InsConverter.toFigmaNode() - 空の要素を処理する", () => {
  const element = InsElement.create({}, []);
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("");
});

test("InsConverter.toFigmaNode() - id属性を適用する", () => {
  const element = InsElement.create({ id: "test-ins" });
  const config = InsConverter.toFigmaNode(element);
  expect(config.name).toContain("test-ins");
});

test("InsConverter.toFigmaNode() - class属性を適用する", () => {
  const element = InsElement.create({ class: "highlight" });
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("InsConverter.toFigmaNode() - 複雑なテキストコンテンツを処理する", () => {
  const element = createInsElement({}, [
    createTextNode("This is "),
    createElementNode("em", [createTextNode("emphasized")]),
    createTextNode(" inserted text"),
  ]);
  const config = InsConverter.toFigmaNode(element);
  expect(config.content).toBe("This is emphasized inserted text");
});

test("InsConverter.toFigmaNode() - 特殊文字を処理する", () => {
  const element = createInsElement({}, [createTextNode("<>&\"'")]);
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("<>&\"'");
});

test("InsConverter.toFigmaNode() - 非常に長いテキストを処理する", () => {
  const LONG_TEXT_LENGTH = 10000;
  const longText = "a".repeat(LONG_TEXT_LENGTH);
  const element = createInsElement({}, [createTextNode(longText)]);
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe(longText);
});

test("InsConverter.toFigmaNode() - 深くネストされた要素を処理する", () => {
  const element = createInsElement({}, [
    createElementNode("span", [
      createElementNode("strong", [createTextNode("deeply nested")]),
    ]),
  ]);
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("deeply nested");
});

test("InsConverter.toFigmaNode() - undefined属性を処理する", () => {
  const element = createInsElement(undefined, []);
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("InsConverter.toFigmaNode() - null childrenを処理する", () => {
  const element = InsElement.create({});
  element.children = undefined;
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("");
});

test("InsConverter.toFigmaNode() - 有効なFigmaノード設定を作成する", () => {
  const element = InsElement.create({
    style: "color: blue; font-size: 14px;",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config.type).toBe("TEXT");
  expect(config.name).toBeDefined();
});
