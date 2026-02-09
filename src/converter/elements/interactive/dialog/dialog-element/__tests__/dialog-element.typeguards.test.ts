import { test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

test("DialogElement.isDialogElement - DialogElementオブジェクト - trueを返す", () => {
  const element = DialogElement.create();

  expect(DialogElement.isDialogElement(element)).toBe(true);
});

test("DialogElement.isDialogElement - open属性付きDialogElement - trueを返す", () => {
  const element = DialogElement.create({ open: true });

  expect(DialogElement.isDialogElement(element)).toBe(true);
});

test("DialogElement.isDialogElement - null - falseを返す", () => {
  expect(DialogElement.isDialogElement(null)).toBe(false);
});

test("DialogElement.isDialogElement - undefined - falseを返す", () => {
  expect(DialogElement.isDialogElement(undefined)).toBe(false);
});

test("DialogElement.isDialogElement - 文字列 - falseを返す", () => {
  expect(DialogElement.isDialogElement("dialog")).toBe(false);
});

test("DialogElement.isDialogElement - 数値 - falseを返す", () => {
  expect(DialogElement.isDialogElement(123)).toBe(false);
});

test("DialogElement.isDialogElement - 異なるtagNameの要素 - falseを返す", () => {
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  expect(DialogElement.isDialogElement(divElement)).toBe(false);
});

test("DialogElement.isDialogElement - detailsタグ - falseを返す", () => {
  const detailsElement = {
    type: "element",
    tagName: "details",
    attributes: {},
    children: [],
  };

  expect(DialogElement.isDialogElement(detailsElement)).toBe(false);
});

test("DialogElement.isDialogElement - 異なるtypeの要素 - falseを返す", () => {
  const textNode = {
    type: "text",
    tagName: "dialog",
    attributes: {},
  };

  expect(DialogElement.isDialogElement(textNode)).toBe(false);
});
