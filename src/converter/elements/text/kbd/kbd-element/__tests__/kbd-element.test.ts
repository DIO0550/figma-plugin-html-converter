import { describe, test, expect } from "vitest";
import { KbdElement } from "../kbd-element";

describe("KbdElement.isKbdElement", () => {
  test("kbd要素の場合trueを返す", () => {
    const element = {
      type: "element",
      tagName: "kbd",
      attributes: {},
      children: [],
    };

    expect(KbdElement.isKbdElement(element)).toBe(true);
  });

  test("異なるタグ名の場合falseを返す", () => {
    const element = {
      type: "element",
      tagName: "span",
      attributes: {},
    };

    expect(KbdElement.isKbdElement(element)).toBe(false);
  });

  test("nullの場合falseを返す", () => {
    expect(KbdElement.isKbdElement(null)).toBe(false);
  });
});

describe("KbdElement.create", () => {
  test("デフォルト値でkbd要素を作成する", () => {
    const element = KbdElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("kbd");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("属性付きでkbd要素を作成する", () => {
    const element = KbdElement.create({
      id: "shortcut-key",
      class: "keyboard",
    });

    expect(element.attributes?.id).toBe("shortcut-key");
    expect(element.attributes?.class).toBe("keyboard");
  });
});

describe("KbdElement accessors", () => {
  test("getIdはid属性を取得する", () => {
    const element = KbdElement.create({ id: "shortcut-key" });
    expect(KbdElement.getId(element)).toBe("shortcut-key");
  });

  test("getClassはclass属性を取得する", () => {
    const element = KbdElement.create({ class: "keyboard" });
    expect(KbdElement.getClass(element)).toBe("keyboard");
  });

  test("getStyleはstyle属性を取得する", () => {
    const element = KbdElement.create({ style: "font-family: monospace" });
    expect(KbdElement.getStyle(element)).toBe("font-family: monospace");
  });
});
