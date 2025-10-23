/**
 * @fileoverview legend要素の型ガードのテスト
 */

import { test, expect } from "vitest";
import { LegendElement } from "../legend-element";

test("LegendElement.isLegendElement: 正しいlegend要素の場合trueを返す", () => {
  const element = LegendElement.create();

  expect(LegendElement.isLegendElement(element)).toBe(true);
});

test("LegendElement.isLegendElement: legend要素以外の場合falseを返す", () => {
  const notLegend = {
    type: "element",
    tagName: "input",
    attributes: {},
  };

  expect(LegendElement.isLegendElement(notLegend)).toBe(false);
});

test("LegendElement.isLegendElement: nullの場合falseを返す", () => {
  expect(LegendElement.isLegendElement(null)).toBe(false);
});

test("LegendElement.isLegendElement: undefinedの場合falseを返す", () => {
  expect(LegendElement.isLegendElement(undefined)).toBe(false);
});

test("LegendElement.isLegendElement: オブジェクトでない場合falseを返す", () => {
  expect(LegendElement.isLegendElement("legend")).toBe(false);
  expect(LegendElement.isLegendElement(123)).toBe(false);
  expect(LegendElement.isLegendElement(true)).toBe(false);
});

test("LegendElement.isLegendElement: typeプロパティがない場合falseを返す", () => {
  const noType = {
    tagName: "legend",
    attributes: {},
  };

  expect(LegendElement.isLegendElement(noType)).toBe(false);
});

test("LegendElement.isLegendElement: tagNameプロパティがない場合falseを返す", () => {
  const noTagName = {
    type: "element",
    attributes: {},
  };

  expect(LegendElement.isLegendElement(noTagName)).toBe(false);
});

test("LegendElement.isLegendElement: typeが'element'でない場合falseを返す", () => {
  const wrongType = {
    type: "text",
    tagName: "legend",
    attributes: {},
  };

  expect(LegendElement.isLegendElement(wrongType)).toBe(false);
});

test("LegendElement.isLegendElement: tagNameが'legend'でない場合falseを返す", () => {
  const wrongTagName = {
    type: "element",
    tagName: "fieldset",
    attributes: {},
  };

  expect(LegendElement.isLegendElement(wrongTagName)).toBe(false);
});
