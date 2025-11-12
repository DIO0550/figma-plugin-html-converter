import { test, expect } from "vitest";
import { SupConverter } from "../sup-converter";
import { SupElement } from "../../sup-element";
import {
  createSupElement,
  createTextNode,
  createElementNode,
} from "./test-helpers";

test("SupConverter.toFigmaNode() - デフォルトでフォントサイズを75%に縮小する", () => {
  const element = SupElement.create({});
  const config = SupConverter.toFigmaNode(element);
  // デフォルトフォントサイズ16pxの75% = 12px
  expect(config.style.fontSize).toBe(12);
});

test("SupConverter.toFigmaNode() - 子要素を処理する", () => {
  const element = createSupElement({}, [createTextNode("superscript text")]);
  const config = SupConverter.toFigmaNode(element);
  expect(config.content).toBe("superscript text");
});

test("SupConverter.toFigmaNode() - ネストされた要素を処理する", () => {
  const element = createSupElement({}, [
    createElementNode("strong", [createTextNode("bold superscript")]),
  ]);
  const config = SupConverter.toFigmaNode(element);
  expect(config.content).toBe("bold superscript");
});

test("SupConverter.toFigmaNode() - 空の要素を処理する", () => {
  const element = SupElement.create({}, []);
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
  expect(config.content).toBe("");
});

test("SupConverter.toFigmaNode() - id属性を適用する", () => {
  const element = SupElement.create({ id: "test-sup" });
  const config = SupConverter.toFigmaNode(element);
  expect(config.name).toContain("test-sup");
});

test("SupConverter.toFigmaNode() - class属性を適用する", () => {
  const element = SupElement.create({ class: "exponent" });
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("SupConverter.toFigmaNode() - 複雑なテキストコンテンツを処理する", () => {
  const element = createSupElement({}, [
    createTextNode("x"),
    createElementNode("em", [createTextNode("2")]),
  ]);
  const config = SupConverter.toFigmaNode(element);
  expect(config.content).toBe("x2");
});

test("SupConverter.toFigmaNode() - 特殊文字を処理する", () => {
  const element = createSupElement({}, [createTextNode("<>&\"'")]);
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("<>&\"'");
});

test("SupConverter.toFigmaNode() - 非常に長いテキストを処理する", () => {
  const LONG_TEXT_LENGTH = 10000;
  const longText = "a".repeat(LONG_TEXT_LENGTH);
  const element = createSupElement({}, [createTextNode(longText)]);
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe(longText);
});

test("SupConverter.toFigmaNode() - 深くネストされた要素を処理する", () => {
  const element = createSupElement({}, [
    createElementNode("span", [
      createElementNode("strong", [createTextNode("deeply nested")]),
    ]),
  ]);
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("deeply nested");
});

test("SupConverter.toFigmaNode() - undefined属性を処理する", () => {
  const element = createSupElement(undefined, []);
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("SupConverter.toFigmaNode() - null childrenを処理する", () => {
  const element = SupElement.create({});
  element.children = undefined;
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.content).toBe("");
});

test("SupConverter.toFigmaNode() - 有効なFigmaノード設定を作成する", () => {
  const element = SupElement.create({
    style: "color: blue; font-size: 14px;",
  });
  const config = SupConverter.toFigmaNode(element);
  expect(config.type).toBe("TEXT");
  expect(config.name).toBeDefined();
});

test("SupConverter.toFigmaNode() - 指数表記のテストケース", () => {
  const element = createSupElement({}, [createTextNode("2")]);
  const config = SupConverter.toFigmaNode(element);
  expect(config.content).toBe("2");
  expect(config.style.fontSize).toBe(12); // 75%縮小
});

test("SupConverter.toFigmaNode() - 脚注番号のテストケース", () => {
  const element = createSupElement({}, [createTextNode("1")]);
  const config = SupConverter.toFigmaNode(element);
  expect(config.content).toBe("1");
  expect(config.type).toBe("TEXT");
});
