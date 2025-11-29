import { test, expect } from "vitest";
import { CaptionElement } from "../caption-element";

test("CaptionElement.isCaptionElement() - 正常なCaptionElementを判定する", () => {
  const element = CaptionElement.create();

  expect(CaptionElement.isCaptionElement(element)).toBe(true);
});

test("CaptionElement.isCaptionElement() - 属性を持つCaptionElementを判定する", () => {
  const element = CaptionElement.create({
    id: "table-caption",
    className: "caption-section",
  });

  expect(CaptionElement.isCaptionElement(element)).toBe(true);
});

test("CaptionElement.isCaptionElement() - 完全なCaptionElementオブジェクトを判定する", () => {
  const element = {
    type: "element" as const,
    tagName: "caption" as const,
    attributes: { id: "caption" },
    children: [],
  };

  expect(CaptionElement.isCaptionElement(element)).toBe(true);
});

test("CaptionElement.isCaptionElement() - nullを不正と判定する", () => {
  expect(CaptionElement.isCaptionElement(null)).toBe(false);
});

test("CaptionElement.isCaptionElement() - undefinedを不正と判定する", () => {
  expect(CaptionElement.isCaptionElement(undefined)).toBe(false);
});

test("CaptionElement.isCaptionElement() - 文字列を不正と判定する", () => {
  expect(CaptionElement.isCaptionElement("caption")).toBe(false);
});

test("CaptionElement.isCaptionElement() - 数値を不正と判定する", () => {
  expect(CaptionElement.isCaptionElement(123)).toBe(false);
});

test("CaptionElement.isCaptionElement() - 配列を不正と判定する", () => {
  expect(CaptionElement.isCaptionElement([])).toBe(false);
});

test("CaptionElement.isCaptionElement() - type属性がないオブジェクトを不正と判定する", () => {
  const element = {
    tagName: "caption",
    attributes: {},
    children: [],
  };

  expect(CaptionElement.isCaptionElement(element)).toBe(false);
});

test("CaptionElement.isCaptionElement() - tagName属性がないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(CaptionElement.isCaptionElement(element)).toBe(false);
});

test("CaptionElement.isCaptionElement() - typeがelementでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "text",
    tagName: "caption",
    attributes: {},
    children: [],
  };

  expect(CaptionElement.isCaptionElement(element)).toBe(false);
});

test("CaptionElement.isCaptionElement() - tagNameがcaptionでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  expect(CaptionElement.isCaptionElement(element)).toBe(false);
});

test("CaptionElement.isCaptionElement() - 空のオブジェクトを不正と判定する", () => {
  expect(CaptionElement.isCaptionElement({})).toBe(false);
});
