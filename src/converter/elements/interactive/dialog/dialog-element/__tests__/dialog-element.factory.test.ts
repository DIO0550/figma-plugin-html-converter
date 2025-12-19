import { describe, test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

describe("DialogElement.create", () => {
  test("空の属性でdialog要素を作成できる", () => {
    const element = DialogElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("dialog");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("id属性を指定してdialog要素を作成できる", () => {
    const element = DialogElement.create({ id: "modal-1" });

    expect(element.attributes.id).toBe("modal-1");
  });

  test("open属性をtrueで作成できる", () => {
    const element = DialogElement.create({ open: true });

    expect(element.attributes.open).toBe(true);
  });

  test("open属性をfalseで作成できる", () => {
    const element = DialogElement.create({ open: false });

    expect(element.attributes.open).toBe(false);
  });

  test("open属性を空文字列で作成できる", () => {
    const element = DialogElement.create({ open: "" });

    expect(element.attributes.open).toBe("");
  });

  test("複数の属性を指定してdialog要素を作成できる", () => {
    const element = DialogElement.create({
      id: "confirm-dialog",
      class: "modal overlay",
      open: true,
      style: "max-width: 500px;",
    });

    expect(element.attributes.id).toBe("confirm-dialog");
    expect(element.attributes.class).toBe("modal overlay");
    expect(element.attributes.open).toBe(true);
    expect(element.attributes.style).toBe("max-width: 500px;");
  });
});
