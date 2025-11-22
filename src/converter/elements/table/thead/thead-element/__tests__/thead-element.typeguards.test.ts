import { test, expect } from "vitest";
import { TheadElement } from "../thead-element";

test("TheadElement.isTheadElement() - 正常なTheadElementを判定する", () => {
  const element = TheadElement.create();

  expect(TheadElement.isTheadElement(element)).toBe(true);
});

test("TheadElement.isTheadElement() - 属性を持つTheadElementを判定する", () => {
  const element = TheadElement.create({
    id: "table-header",
    className: "header-section",
  });

  expect(TheadElement.isTheadElement(element)).toBe(true);
});

test("TheadElement.isTheadElement() - 完全なTheadElementオブジェクトを判定する", () => {
  const element = {
    type: "element" as const,
    tagName: "thead" as const,
    attributes: { id: "header" },
    children: [],
  };

  expect(TheadElement.isTheadElement(element)).toBe(true);
});

test("TheadElement.isTheadElement() - nullを不正と判定する", () => {
  expect(TheadElement.isTheadElement(null)).toBe(false);
});

test("TheadElement.isTheadElement() - undefinedを不正と判定する", () => {
  expect(TheadElement.isTheadElement(undefined)).toBe(false);
});

test("TheadElement.isTheadElement() - 文字列を不正と判定する", () => {
  expect(TheadElement.isTheadElement("thead")).toBe(false);
});

test("TheadElement.isTheadElement() - 数値を不正と判定する", () => {
  expect(TheadElement.isTheadElement(123)).toBe(false);
});

test("TheadElement.isTheadElement() - 配列を不正と判定する", () => {
  expect(TheadElement.isTheadElement([])).toBe(false);
});

test("TheadElement.isTheadElement() - type属性がないオブジェクトを不正と判定する", () => {
  const element = {
    tagName: "thead",
    attributes: {},
    children: [],
  };

  expect(TheadElement.isTheadElement(element)).toBe(false);
});

test("TheadElement.isTheadElement() - tagName属性がないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    attributes: {},
    children: [],
  };

  expect(TheadElement.isTheadElement(element)).toBe(false);
});

test("TheadElement.isTheadElement() - typeがelementでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "text",
    tagName: "thead",
    attributes: {},
    children: [],
  };

  expect(TheadElement.isTheadElement(element)).toBe(false);
});

test("TheadElement.isTheadElement() - tagNameがtheadでないオブジェクトを不正と判定する", () => {
  const element = {
    type: "element",
    tagName: "tr",
    attributes: {},
    children: [],
  };

  expect(TheadElement.isTheadElement(element)).toBe(false);
});

test("TheadElement.isTheadElement() - 空のオブジェクトを不正と判定する", () => {
  expect(TheadElement.isTheadElement({})).toBe(false);
});
