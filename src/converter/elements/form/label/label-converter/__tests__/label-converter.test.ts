/**
 * @fileoverview label要素のコンバーターのテスト
 */

import { test, expect } from "vitest";
import { LabelElement } from "../../label-element";
import { toFigmaNode, mapToFigma } from "../label-converter";

test("toFigmaNode: 基本的なlabel要素を変換できる", () => {
  const children = [{ type: "text" as const, textContent: "Email Address" }];
  const element = LabelElement.create({ for: "email" }, children);
  const config = toFigmaNode(element);

  expect(config.name).toBe("label");
  expect(config.layoutMode).toBe("HORIZONTAL");
});

test("toFigmaNode: label要素のテキストを表示する", () => {
  const children = [{ type: "text" as const, textContent: "Username" }];
  const element = LabelElement.create({ for: "username" }, children);
  const config = toFigmaNode(element);

  expect(config.children).toBeDefined();
  expect(config.children?.length).toBeGreaterThan(0);
  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Username");
  }
});

test("toFigmaNode: 子要素がない場合はデフォルトテキストを表示する", () => {
  const element = LabelElement.create({ for: "input" });
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Label");
  }
});

test("toFigmaNode: 複数の子要素のテキストを結合する", () => {
  const children = [
    { type: "text" as const, textContent: "Email " },
    { type: "text" as const, textContent: "Address" },
  ];
  const element = LabelElement.create({ for: "email" }, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Email Address");
  }
});

test("toFigmaNode: 適切なフォントサイズを設定する", () => {
  const children = [{ type: "text" as const, textContent: "Label" }];
  const element = LabelElement.create({}, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "fontSize" in textNode) {
    expect(textNode.fontSize).toBe(14);
  }
});

test("toFigmaNode: ID属性からノード名を設定する", () => {
  const element = LabelElement.create({ id: "email-label" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("label#email-label");
});

test("toFigmaNode: class属性からノード名を設定する", () => {
  const element = LabelElement.create({ class: "form-label custom" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("label.form-label");
});

test("toFigmaNode: for属性がある場合にインジケーターを追加する", () => {
  const children = [{ type: "text" as const, textContent: "Email" }];
  const element = LabelElement.create({ for: "email-input" }, children);
  const config = toFigmaNode(element);

  expect(config.children?.length).toBe(1);
});

test("mapToFigma: LabelElement型のノードを変換できる", () => {
  const element = LabelElement.create({ for: "email" });
  const config = mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("label");
});

test("mapToFigma: HTMLNode型のlabel要素を変換できる", () => {
  const htmlNode = {
    type: "element",
    tagName: "label",
    attributes: { for: "email" },
    children: [{ type: "text" as const, textContent: "Email" }],
  };
  const config = mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("label");
});

test("mapToFigma: label要素以外の場合nullを返す", () => {
  const notLabel = {
    type: "element",
    tagName: "input",
    attributes: {},
  };
  const config = mapToFigma(notLabel);

  expect(config).toBeNull();
});

test("mapToFigma: nullの場合nullを返す", () => {
  expect(mapToFigma(null)).toBeNull();
});

test("mapToFigma: undefinedの場合nullを返す", () => {
  expect(mapToFigma(undefined)).toBeNull();
});

test("mapToFigma: 文字列の場合nullを返す", () => {
  expect(mapToFigma("label")).toBeNull();
});

test("mapToFigma: 数値の場合nullを返す", () => {
  expect(mapToFigma(123)).toBeNull();
});
