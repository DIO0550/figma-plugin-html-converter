import { test, expect } from "vitest";
import { TrElement } from "../tr-element";

test("TrElement.isTrElement() - 正常なTrElementを判定する", () => {
  const element = TrElement.create();

  expect(TrElement.isTrElement(element)).toBe(true);
});

test("TrElement.isTrElement() - 属性を持つTrElementを判定する", () => {
  const element = TrElement.create({
    width: "100%",
    height: "50px",
    className: "row",
  });

  expect(TrElement.isTrElement(element)).toBe(true);
});

test("TrElement.isTrElement() - 完全なTrElementオブジェクトを判定する", () => {
  const element = {
    type: "element" as const,
    tagName: "tr" as const,
    attributes: { width: "100%" },
    children: [],
  };

  expect(TrElement.isTrElement(element)).toBe(true);
});

test("TrElement.isTrElement() - nullを不正と判定する", () => {
  expect(TrElement.isTrElement(null)).toBe(false);
});

test("TrElement.isTrElement() - undefinedを不正と判定する", () => {
  expect(TrElement.isTrElement(undefined)).toBe(false);
});

test("TrElement.isTrElement() - 文字列を不正と判定する", () => {
  expect(TrElement.isTrElement("tr")).toBe(false);
});

test("TrElement.isTrElement() - 数値を不正と判定する", () => {
  expect(TrElement.isTrElement(123)).toBe(false);
});

test("TrElement.isTrElement() - 配列を不正と判定する", () => {
  expect(TrElement.isTrElement([])).toBe(false);
});

test("TrElement.isTrElement() - type属性がないオブジェクトを不正と判定する", () => {
  const element = {
    tagName: "tr",
    attributes: {},
    children: [],
  };

  expect(TrElement.isTrElement(element)).toBe(false);
});

test("TrElement.isTrElement() - tagName属性がないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(TrElement.isTrElement(element)).toBe(false);
});

test("TrElement.isTrElement() - typeがelementでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "text",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  expect(TrElement.isTrElement(element)).toBe(false);
});

test("TrElement.isTrElement() - tagNameがtrでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    tagName: "td",
    attributes: {},
    children: [],
  };

  expect(TrElement.isTrElement(element)).toBe(false);
});

test("TrElement.isTrElement() - 空のオブジェクトを不正と判定する", () => {
  expect(TrElement.isTrElement({})).toBe(false);
});
