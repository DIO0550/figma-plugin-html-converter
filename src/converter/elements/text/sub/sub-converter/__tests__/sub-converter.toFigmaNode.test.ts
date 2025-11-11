import { test, expect } from "vitest";
import { SubConverter } from "../sub-converter";
import { SubElement } from "../../sub-element";
import {
  createSubElement,
  createTextNode,
  createElementNode,
} from "./test-helpers";

test("SubConverter.toFigmaNode() - デフォルトでフォントサイズを12pxに設定する", () => {
  const element = SubElement.create({});
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(12);
});

test("SubConverter.toFigmaNode() - デフォルトで下付き文字の縦位置を設定する", () => {
  const element = SubElement.create({});
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.verticalAlign).toBe("SUBSCRIPT");
});

test("SubConverter.toFigmaNode() - 化学式（H2O）を処理する", () => {
  const element = createSubElement({}, [createTextNode("2")]);
  const config = SubConverter.toFigmaNode(element);
  expect(config.content).toBe("2");
  expect(config.style.fontSize).toBe(12);
});

test("SubConverter.toFigmaNode() - 数式を処理する", () => {
  const element = createSubElement({}, [createTextNode("n+1")]);
  const config = SubConverter.toFigmaNode(element);
  expect(config.content).toBe("n+1");
  expect(config.style.fontSize).toBe(12);
});

test("SubConverter.toFigmaNode() - 子要素を処理する", () => {
  const element = createSubElement({}, [createTextNode("subscript text")]);
  const config = SubConverter.toFigmaNode(element);
  expect(config.content).toBe("subscript text");
});

test("SubConverter.toFigmaNode() - ネストされた要素を処理する", () => {
  const element = createSubElement({}, [
    createElementNode("em", [createTextNode("emphasized subscript")]),
  ]);
  const config = SubConverter.toFigmaNode(element);
  expect(config.content).toBe("emphasized subscript");
});

test("SubConverter.toFigmaNode() - 空の要素を処理する", () => {
  const element = SubElement.create({}, []);
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("");
});

test("SubConverter.toFigmaNode() - id属性を適用する", () => {
  const element = SubElement.create({ id: "test-sub" });
  const config = SubConverter.toFigmaNode(element);
  expect(config.name).toContain("test-sub");
});

test("SubConverter.toFigmaNode() - class属性を適用する", () => {
  const element = SubElement.create({ class: "formula" });
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("SubConverter.toFigmaNode() - 複雑なテキストコンテンツを処理する", () => {
  const element = createSubElement({}, [
    createTextNode("This is "),
    createElementNode("strong", [createTextNode("important")]),
    createTextNode(" subscript"),
  ]);
  const config = SubConverter.toFigmaNode(element);
  expect(config.content).toBe("This is important subscript");
});

test("SubConverter.toFigmaNode() - 特殊文字を処理する", () => {
  const element = createSubElement({}, [createTextNode("<>&\"'")]);
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("<>&\"'");
});

test("SubConverter.toFigmaNode() - 非常に長いテキストを処理する", () => {
  const LONG_TEXT_LENGTH = 10000;
  const longText = "a".repeat(LONG_TEXT_LENGTH);
  const element = createSubElement({}, [createTextNode(longText)]);
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe(longText);
});

test("SubConverter.toFigmaNode() - 深くネストされた要素を処理する", () => {
  const element = createSubElement({}, [
    createElementNode("span", [
      createElementNode("strong", [createTextNode("deeply nested")]),
    ]),
  ]);
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("deeply nested");
});

test("SubConverter.toFigmaNode() - undefined属性を処理する", () => {
  const element = createSubElement(undefined, []);
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("SubConverter.toFigmaNode() - null childrenを処理する", () => {
  const element = SubElement.create({});
  element.children = undefined;
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("");
});

test("SubConverter.toFigmaNode() - 有効なFigmaノード設定を作成する", () => {
  const element = SubElement.create({
    style: "color: blue;",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.type).toBe("TEXT");
  expect(config.name).toBeDefined();
});

test("SubConverter.toFigmaNode() - 行の高さをフォントサイズに合わせて調整する", () => {
  const element = SubElement.create({});
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.lineHeight).toEqual({
    unit: "PIXELS",
    value: 18,
  });
});
