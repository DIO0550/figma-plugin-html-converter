/**
 * @fileoverview option要素のコンバーターのテスト
 */

import { test, expect } from "vitest";
import { OptionElement } from "../../option-element";
import { toFigmaNode, mapToFigma } from "../option-converter";

test("toFigmaNode: 基本的なoption要素を変換できる", () => {
  const children = [{ type: "text" as const, textContent: "United States" }];
  const element = OptionElement.create({ value: "us" }, children);
  const config = toFigmaNode(element);

  expect(config.name).toBe("option");
  expect(config.layoutMode).toBe("HORIZONTAL");
});

test("toFigmaNode: option要素のテキストを表示する", () => {
  const children = [{ type: "text" as const, textContent: "Japan" }];
  const element = OptionElement.create({ value: "jp" }, children);
  const config = toFigmaNode(element);

  expect(config.children).toBeDefined();
  expect(config.children?.length).toBeGreaterThan(0);
  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Japan");
  }
});

test("toFigmaNode: label属性がある場合はlabel属性を優先する", () => {
  const children = [{ type: "text" as const, textContent: "United States" }];
  const element = OptionElement.create({ value: "us", label: "USA" }, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("USA");
  }
});

test("toFigmaNode: テキストコンテンツがない場合はvalue属性を表示する", () => {
  const element = OptionElement.create({ value: "us" });
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("us");
  }
});

test("toFigmaNode: labelもvalueもない場合はプレースホルダーを表示する", () => {
  const element = OptionElement.create();
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Option");
  }
});

test("toFigmaNode: selected状態のスタイルを適用する", () => {
  const children = [{ type: "text" as const, textContent: "Japan" }];
  const element = OptionElement.create(
    { value: "jp", selected: "selected" },
    children,
  );
  const config = toFigmaNode(element);

  expect(config.fills).toBeDefined();
  const fills = config.fills as Array<{
    type: string;
    color: { r: number; g: number; b: number };
  }>;
  expect(fills[0].color).toEqual({ r: 0.9, g: 0.95, b: 1 });
});

test("toFigmaNode: disabled状態のスタイルを適用する", () => {
  const children = [{ type: "text" as const, textContent: "Japan" }];
  const element = OptionElement.create(
    { value: "jp", disabled: "disabled" },
    children,
  );
  const config = toFigmaNode(element);

  expect(config.opacity).toBe(0.5);
});

test("toFigmaNode: ID属性からノード名を設定する", () => {
  const element = OptionElement.create({ id: "option-us" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("option#option-us");
});

test("toFigmaNode: class属性からノード名を設定する", () => {
  const element = OptionElement.create({ class: "option-item custom" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("option.option-item");
});

test("mapToFigma: OptionElement型のノードを変換できる", () => {
  const element = OptionElement.create({ value: "us" });
  const config = mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("option");
});

test("mapToFigma: HTMLNode型のoption要素を変換できる", () => {
  const htmlNode = {
    type: "element",
    tagName: "option",
    attributes: { value: "us" },
    children: [{ type: "text" as const, textContent: "United States" }],
  };
  const config = mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("option");
});

test("mapToFigma: option要素以外の場合nullを返す", () => {
  const notOption = {
    type: "element",
    tagName: "select",
    attributes: {},
  };
  const config = mapToFigma(notOption);

  expect(config).toBeNull();
});

test("mapToFigma: nullの場合nullを返す", () => {
  expect(mapToFigma(null)).toBeNull();
});

test("mapToFigma: undefinedの場合nullを返す", () => {
  expect(mapToFigma(undefined)).toBeNull();
});

test("mapToFigma: 文字列の場合nullを返す", () => {
  expect(mapToFigma("option")).toBeNull();
});

test("mapToFigma: 数値の場合nullを返す", () => {
  expect(mapToFigma(123)).toBeNull();
});
