/**
 * @fileoverview legend要素のコンバーターのテスト
 */

import { test, expect } from "vitest";
import { LegendElement } from "../../legend-element";
import { toFigmaNode, mapToFigma } from "../legend-converter";

test("toFigmaNode: 基本的なlegend要素を変換できる", () => {
  const children = [{ type: "text" as const, textContent: "Personal Info" }];
  const element = LegendElement.create({}, children);
  const config = toFigmaNode(element);

  expect(config.name).toBe("legend");
  expect(config.layoutMode).toBe("HORIZONTAL");
});

test("toFigmaNode: legend要素のテキストを表示する", () => {
  const children = [{ type: "text" as const, textContent: "Contact Info" }];
  const element = LegendElement.create({}, children);
  const config = toFigmaNode(element);

  expect(config.children).toBeDefined();
  expect(config.children?.length).toBeGreaterThan(0);
  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Contact Info");
  }
});

test("toFigmaNode: 子要素がない場合はデフォルトテキストを表示する", () => {
  const element = LegendElement.create();
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Legend");
  }
});

test("toFigmaNode: 複数の子要素のテキストを結合する", () => {
  const children = [
    { type: "text" as const, textContent: "Personal " },
    { type: "text" as const, textContent: "Information" },
  ];
  const element = LegendElement.create({}, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "characters" in textNode) {
    expect(textNode.characters).toBe("Personal Information");
  }
});

test("toFigmaNode: 適切なフォントサイズを設定する", () => {
  const children = [{ type: "text" as const, textContent: "Legend" }];
  const element = LegendElement.create({}, children);
  const config = toFigmaNode(element);

  const textNode = config.children?.[0];
  if (textNode && "fontSize" in textNode) {
    expect(textNode.fontSize).toBe(16);
  }
});

test("toFigmaNode: ID属性からノード名を設定する", () => {
  const element = LegendElement.create({ id: "personal-legend" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("legend#personal-legend");
});

test("toFigmaNode: class属性からノード名を設定する", () => {
  const element = LegendElement.create({ class: "legend-header custom" });
  const config = toFigmaNode(element);

  expect(config.name).toBe("legend.legend-header");
});

test("toFigmaNode: 適切なパディングを設定する", () => {
  const element = LegendElement.create();
  const config = toFigmaNode(element);

  expect(config.paddingLeft).toBe(0);
  expect(config.paddingRight).toBe(0);
  expect(config.paddingTop).toBe(0);
  expect(config.paddingBottom).toBe(8);
});

test("mapToFigma: LegendElement型のノードを変換できる", () => {
  const element = LegendElement.create();
  const config = mapToFigma(element);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("legend");
});

test("mapToFigma: HTMLNode型のlegend要素を変換できる", () => {
  const htmlNode = {
    type: "element",
    tagName: "legend",
    attributes: {},
    children: [{ type: "text" as const, textContent: "Info" }],
  };
  const config = mapToFigma(htmlNode);

  expect(config).not.toBeNull();
  expect(config?.name).toBe("legend");
});

test("mapToFigma: legend要素以外の場合nullを返す", () => {
  const notLegend = {
    type: "element",
    tagName: "input",
    attributes: {},
  };
  const config = mapToFigma(notLegend);

  expect(config).toBeNull();
});

test("mapToFigma: nullの場合nullを返す", () => {
  expect(mapToFigma(null)).toBeNull();
});

test("mapToFigma: undefinedの場合nullを返す", () => {
  expect(mapToFigma(undefined)).toBeNull();
});

test("mapToFigma: 文字列の場合nullを返す", () => {
  expect(mapToFigma("legend")).toBeNull();
});

test("mapToFigma: 数値の場合nullを返す", () => {
  expect(mapToFigma(123)).toBeNull();
});
