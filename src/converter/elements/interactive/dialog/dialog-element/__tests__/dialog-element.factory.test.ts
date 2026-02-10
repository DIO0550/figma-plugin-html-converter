import { test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

test("DialogElement.create - 空の属性 - dialog要素を作成できる", () => {
  const element = DialogElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("dialog");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("DialogElement.create - id属性指定 - dialog要素を作成できる", () => {
  const element = DialogElement.create({ id: "modal-1" });

  expect(element.attributes.id).toBe("modal-1");
});

test("DialogElement.create - open属性true - dialog要素を作成できる", () => {
  const element = DialogElement.create({ open: true });

  expect(element.attributes.open).toBe(true);
});

test("DialogElement.create - open属性false - dialog要素を作成できる", () => {
  const element = DialogElement.create({ open: false });

  expect(element.attributes.open).toBe(false);
});

test("DialogElement.create - open属性空文字列 - dialog要素を作成できる", () => {
  const element = DialogElement.create({ open: "" });

  expect(element.attributes.open).toBe("");
});

test("DialogElement.create - 複数の属性指定 - dialog要素を作成できる", () => {
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
