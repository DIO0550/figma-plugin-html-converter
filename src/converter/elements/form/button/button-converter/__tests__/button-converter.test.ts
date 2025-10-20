/**
 * @fileoverview button要素のFigma変換ロジックの簡易テスト
 */

import { test, expect } from "vitest";
import { toFigmaNode, mapToFigma } from "../button-converter";
import { ButtonElement } from "../../button-element";

test("ButtonConverter: 基本的なbutton要素を変換できる", () => {
  const element = ButtonElement.create();
  const config = toFigmaNode(element);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("button");
  expect(config.layoutMode).toBe("HORIZONTAL");
});

test("ButtonConverter: 子要素のテキストが表示される", () => {
  const element = ButtonElement.create({}, [
    { type: "text" as const, textContent: "クリック" },
  ]);
  const config = toFigmaNode(element);

  expect(config.children).toHaveLength(1);
  expect(config.children?.[0].name).toBe("クリック");
});

test("ButtonConverter: submit型のボタンを変換できる", () => {
  const element = ButtonElement.create({ type: "submit" });
  const config = toFigmaNode(element);

  expect(config.children?.[0].name).toBe("Submit");
});

test("ButtonConverter: disabled状態を反映できる", () => {
  const element = ButtonElement.create({ disabled: "disabled" });
  const config = toFigmaNode(element);

  expect(config.fills).toBeDefined();
});

test("ButtonConverter: HTMLNodeから変換できる", () => {
  const node = {
    type: "element",
    tagName: "button",
    attributes: {},
    children: [],
  };
  const config = mapToFigma(node);

  expect(config).not.toBeNull();
  expect(config?.type).toBe("FRAME");
});
