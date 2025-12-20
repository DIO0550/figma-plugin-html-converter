import { describe, test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

describe("DialogElement.isDialogElement", () => {
  test("DialogElementオブジェクトを正しく判定する", () => {
    const element = DialogElement.create();

    expect(DialogElement.isDialogElement(element)).toBe(true);
  });

  test("open属性付きDialogElementオブジェクトを正しく判定する", () => {
    const element = DialogElement.create({ open: true });

    expect(DialogElement.isDialogElement(element)).toBe(true);
  });

  test("nullをfalseと判定する", () => {
    expect(DialogElement.isDialogElement(null)).toBe(false);
  });

  test("undefinedをfalseと判定する", () => {
    expect(DialogElement.isDialogElement(undefined)).toBe(false);
  });

  test("文字列をfalseと判定する", () => {
    expect(DialogElement.isDialogElement("dialog")).toBe(false);
  });

  test("数値をfalseと判定する", () => {
    expect(DialogElement.isDialogElement(123)).toBe(false);
  });

  test("異なるtagNameの要素をfalseと判定する", () => {
    const divElement = {
      type: "element",
      tagName: "div",
      attributes: {},
      children: [],
    };

    expect(DialogElement.isDialogElement(divElement)).toBe(false);
  });

  test("detailsタグをfalseと判定する", () => {
    const detailsElement = {
      type: "element",
      tagName: "details",
      attributes: {},
      children: [],
    };

    expect(DialogElement.isDialogElement(detailsElement)).toBe(false);
  });

  test("異なるtypeの要素をfalseと判定する", () => {
    const textNode = {
      type: "text",
      tagName: "dialog",
      attributes: {},
    };

    expect(DialogElement.isDialogElement(textNode)).toBe(false);
  });
});
