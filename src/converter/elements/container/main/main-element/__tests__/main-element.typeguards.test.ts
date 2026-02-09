import { it, expect } from "vitest";
import { MainElement } from "../main-element";

it("MainElement.isMainElement - main要素 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "main",
    attributes: {},
  };

  expect(MainElement.isMainElement(element)).toBe(true);
});

it("MainElement.isMainElement - typeがelement以外 - falseを返す", () => {
  const element = {
    type: "text",
    tagName: "main",
    attributes: {},
  };

  expect(MainElement.isMainElement(element)).toBe(false);
});

it("MainElement.isMainElement - tagNameがmain以外 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "div",
    attributes: {},
  };

  expect(MainElement.isMainElement(element)).toBe(false);
});

it("MainElement.isMainElement - null入力 - falseを返す", () => {
  expect(MainElement.isMainElement(null)).toBe(false);
});

it("MainElement.isMainElement - undefined入力 - falseを返す", () => {
  expect(MainElement.isMainElement(undefined)).toBe(false);
});

it("MainElement.isMainElement - 非オブジェクト入力 - falseを返す", () => {
  expect(MainElement.isMainElement("main")).toBe(false);
  expect(MainElement.isMainElement(123)).toBe(false);
  expect(MainElement.isMainElement(true)).toBe(false);
});

it(
  "MainElement.isMainElement - 必要なプロパティ不足 - falseを返す",
  () => {
    expect(MainElement.isMainElement({ type: "element" })).toBe(false);
    expect(MainElement.isMainElement({ tagName: "main" })).toBe(false);
    expect(MainElement.isMainElement({})).toBe(false);
  }
);
