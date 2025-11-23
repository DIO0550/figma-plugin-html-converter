import { test, expect } from "vitest";
import { TbodyElement } from "../tbody-element";

test("TbodyElement.isTbodyElement() - 正常なTbodyElementを判定する", () => {
  const element = TbodyElement.create();

  expect(TbodyElement.isTbodyElement(element)).toBe(true);
});

test("TbodyElement.isTbodyElement() - 属性を持つTbodyElementを判定する", () => {
  const element = TbodyElement.create({
    id: "table-body",
    className: "body-section",
  });

  expect(TbodyElement.isTbodyElement(element)).toBe(true);
});

test("TbodyElement.isTbodyElement() - 完全なTbodyElementオブジェクトを判定する", () => {
  const element = {
    type: "element" as const,
    tagName: "tbody" as const,
    attributes: { id: "body" },
    children: [],
  };

  expect(TbodyElement.isTbodyElement(element)).toBe(true);
});

test("TbodyElement.isTbodyElement() - nullを不正と判定する", () => {
  expect(TbodyElement.isTbodyElement(null)).toBe(false);
});

test("TbodyElement.isTbodyElement() - undefinedを不正と判定する", () => {
  expect(TbodyElement.isTbodyElement(undefined)).toBe(false);
});

test("TbodyElement.isTbodyElement() - 文字列を不正と判定する", () => {
  expect(TbodyElement.isTbodyElement("tbody")).toBe(false);
});

test("TbodyElement.isTbodyElement() - 数値を不正と判定する", () => {
  expect(TbodyElement.isTbodyElement(123)).toBe(false);
});

test("TbodyElement.isTbodyElement() - 配列を不正と判定する", () => {
  expect(TbodyElement.isTbodyElement([])).toBe(false);
});

test("TbodyElement.isTbodyElement() - type属性がないオブジェクトを不正と判定する", () => {
  const element = {
    tagName: "tbody",
    attributes: {},
    children: [],
  };

  expect(TbodyElement.isTbodyElement(element)).toBe(false);
});

test("TbodyElement.isTbodyElement() - tagName属性がないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(TbodyElement.isTbodyElement(element)).toBe(false);
});

test("TbodyElement.isTbodyElement() - typeがelementでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "text",
    tagName: "tbody",
    attributes: {},
    children: [],
  };

  expect(TbodyElement.isTbodyElement(element)).toBe(false);
});

test("TbodyElement.isTbodyElement() - tagNameがtbodyでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  expect(TbodyElement.isTbodyElement(element)).toBe(false);
});

test("TbodyElement.isTbodyElement() - 空のオブジェクトを不正と判定する", () => {
  expect(TbodyElement.isTbodyElement({})).toBe(false);
});
