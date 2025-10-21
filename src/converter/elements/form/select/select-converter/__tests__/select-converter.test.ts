/**
 * @fileoverview select要素のコンバーターのテスト
 */

import { test, expect } from "vitest";
import { SelectElement } from "../../select-element";
import { toFigmaNode, mapToFigma } from "../select-converter";

test("toFigmaNode: 基本的なselect要素を変換できる", () => {
  const element = SelectElement.create({ name: "country" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("select");
  expect(config.layoutMode).toBe("HORIZONTAL");
  expect(config.fills).toBeDefined();
  expect(config.strokes).toBeDefined();
});

test("toFigmaNode: プレースホルダーテキストを表示する", () => {
  const element = SelectElement.create({ name: "country" });
  const config = toFigmaNode(element);

  expect(config.children).toBeDefined();
  expect(config.children?.length).toBeGreaterThan(0);
});

test("toFigmaNode: ドロップダウン矢印を含む", () => {
  const element = SelectElement.create({ name: "country" });
  const config = toFigmaNode(element);

  expect(config.children?.length).toBe(2); // テキスト + 矢印
});

test("toFigmaNode: disabled状態のスタイルを適用する", () => {
  const element = SelectElement.create({ disabled: "disabled" });
  const config = toFigmaNode(element);

  expect(config.opacity).toBe(0.5);
});

test("toFigmaNode: ID属性からノード名を設定する", () => {
  const element = SelectElement.create({ id: "country-select" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("select#country-select");
});

test("toFigmaNode: class属性からノード名を設定する", () => {
  const element = SelectElement.create({ class: "form-select custom" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("select.form-select");
});

test("toFigmaNode: 選択されたoption要素のテキストを表示する", () => {
  const children = [
    {
      type: "element" as const,
      tagName: "option" as const,
      attributes: { value: "us", selected: "selected" },
      children: [{ type: "text" as const, textContent: "United States" }],
    },
  ];
  const element = SelectElement.create({ name: "country" }, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  expect(textNode).toBeDefined();
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("United States");
  }
});

test("toFigmaNode: 最初のoption要素のテキストをデフォルト表示する", () => {
  const children = [
    {
      type: "element" as const,
      tagName: "option" as const,
      attributes: { value: "us" },
      children: [{ type: "text" as const, textContent: "United States" }],
    },
  ];
  const element = SelectElement.create({ name: "country" }, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  expect(textNode).toBeDefined();
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("United States");
  }
});

test("toFigmaNode: option要素がない場合はプレースホルダーを表示する", () => {
  const element = SelectElement.create({ name: "country" });
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  expect(textNode).toBeDefined();
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Select an option");
  }
});

test("mapToFigma: SelectElement型のノードを変換できる", () => {
  const element = SelectElement.create({ name: "country" });
  const config = mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("select");
});

test("mapToFigma: HTMLNode型のselect要素を変換できる", () => {
  const htmlNode = {
    type: "element",
    tagName: "select",
    attributes: { name: "country" },
    children: [],
  };
  const config = mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("select");
});

test("mapToFigma: select要素以外の場合nullを返す", () => {
  const notSelect = {
    type: "element",
    tagName: "button",
    attributes: {},
  };
  const config = mapToFigma(notSelect);

  expect(config).toBeNull();
});

test("mapToFigma: 不正な値の場合nullを返す", () => {
  expect(mapToFigma(null)).toBeNull();
  expect(mapToFigma(undefined)).toBeNull();
  expect(mapToFigma("select")).toBeNull();
  expect(mapToFigma(123)).toBeNull();
});
