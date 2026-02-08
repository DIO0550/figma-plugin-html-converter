import { test, expect } from "vitest";
import { KbdElement } from "../kbd-element";

test("KbdElement.isKbdElement - kbd要素の場合 - trueを返す", () => {
  const element = {
    type: "element",
    tagName: "kbd",
    attributes: {},
    children: [],
  };

  expect(KbdElement.isKbdElement(element)).toBe(true);
});

test("KbdElement.isKbdElement - 異なるタグ名の場合 - falseを返す", () => {
  const element = {
    type: "element",
    tagName: "span",
    attributes: {},
  };

  expect(KbdElement.isKbdElement(element)).toBe(false);
});

test("KbdElement.isKbdElement - nullの場合 - falseを返す", () => {
  expect(KbdElement.isKbdElement(null)).toBe(false);
});

test("KbdElement.create - デフォルト値の場合 - kbd要素を作成する", () => {
  const element = KbdElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("kbd");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

test("KbdElement.create - 属性付きの場合 - 属性を持つkbd要素を作成する", () => {
  const element = KbdElement.create({
    id: "shortcut-key",
    class: "keyboard",
  });

  expect(element.attributes?.id).toBe("shortcut-key");
  expect(element.attributes?.class).toBe("keyboard");
});

test("KbdElement.getId - id属性がある場合 - id属性を取得する", () => {
  const element = KbdElement.create({ id: "shortcut-key" });
  expect(KbdElement.getId(element)).toBe("shortcut-key");
});

test("KbdElement.getClass - class属性がある場合 - class属性を取得する", () => {
  const element = KbdElement.create({ class: "keyboard" });
  expect(KbdElement.getClass(element)).toBe("keyboard");
});

test("KbdElement.getStyle - style属性がある場合 - style属性を取得する", () => {
  const element = KbdElement.create({ style: "font-family: monospace" });
  expect(KbdElement.getStyle(element)).toBe("font-family: monospace");
});
