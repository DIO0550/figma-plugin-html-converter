import { test, expect } from "vitest";
import { TfootElement } from "../tfoot-element";

test("TfootElement.isTfootElement() - 正常なTfootElementを判定する", () => {
  const element = TfootElement.create();

  expect(TfootElement.isTfootElement(element)).toBe(true);
});

test("TfootElement.isTfootElement() - 属性を持つTfootElementを判定する", () => {
  const element = TfootElement.create({
    id: "table-footer",
    className: "footer-section",
  });

  expect(TfootElement.isTfootElement(element)).toBe(true);
});

test("TfootElement.isTfootElement() - 完全なTfootElementオブジェクトを判定する", () => {
  const element = {
    type: "element" as const,
    tagName: "tfoot" as const,
    attributes: { id: "footer" },
    children: [],
  };

  expect(TfootElement.isTfootElement(element)).toBe(true);
});

test("TfootElement.isTfootElement() - nullを不正と判定する", () => {
  expect(TfootElement.isTfootElement(null)).toBe(false);
});

test("TfootElement.isTfootElement() - undefinedを不正と判定する", () => {
  expect(TfootElement.isTfootElement(undefined)).toBe(false);
});

test("TfootElement.isTfootElement() - 文字列を不正と判定する", () => {
  expect(TfootElement.isTfootElement("tfoot")).toBe(false);
});

test("TfootElement.isTfootElement() - 数値を不正と判定する", () => {
  expect(TfootElement.isTfootElement(123)).toBe(false);
});

test("TfootElement.isTfootElement() - 配列を不正と判定する", () => {
  expect(TfootElement.isTfootElement([])).toBe(false);
});

test("TfootElement.isTfootElement() - type属性がないオブジェクトを不正と判定する", () => {
  const element = {
    tagName: "tfoot",
    attributes: {},
    children: [],
  };

  expect(TfootElement.isTfootElement(element)).toBe(false);
});

test("TfootElement.isTfootElement() - tagName属性がないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(TfootElement.isTfootElement(element)).toBe(false);
});

test("TfootElement.isTfootElement() - typeがelementでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "text",
    tagName: "tfoot",
    attributes: {},
    children: [],
  };

  expect(TfootElement.isTfootElement(element)).toBe(false);
});

test("TfootElement.isTfootElement() - tagNameがtfootでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  expect(TfootElement.isTfootElement(element)).toBe(false);
});

test("TfootElement.isTfootElement() - 空のオブジェクトを不正と判定する", () => {
  expect(TfootElement.isTfootElement({})).toBe(false);
});
