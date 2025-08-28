import { describe, expect, test } from "vitest";
import { NavElement } from "../nav-element";

describe("NavElement.accessors", () => {
  describe("getId", () => {
    test("ID属性が存在する場合、その値を返す", () => {
      const element = NavElement.create({
        id: "main-nav",
        className: "navbar",
      });

      expect(NavElement.getId(element)).toBe("main-nav");
    });

    test("ID属性が存在しない場合、undefinedを返す", () => {
      const element = NavElement.create({
        className: "navbar",
      });

      expect(NavElement.getId(element)).toBeUndefined();
    });

    test("空のID属性の場合、空文字を返す", () => {
      const element = NavElement.create({
        id: "",
      });

      expect(NavElement.getId(element)).toBe("");
    });
  });

  describe("getClassName", () => {
    test("className属性が存在する場合、その値を返す", () => {
      const element = NavElement.create({
        className: "nav-menu primary-nav",
      });

      expect(NavElement.getClassName(element)).toBe("nav-menu primary-nav");
    });

    test("className属性が存在しない場合、undefinedを返す", () => {
      const element = NavElement.create({
        id: "nav",
      });

      expect(NavElement.getClassName(element)).toBeUndefined();
    });

    test("空のclassName属性の場合、空文字を返す", () => {
      const element = NavElement.create({
        className: "",
      });

      expect(NavElement.getClassName(element)).toBe("");
    });
  });

  describe("getStyle", () => {
    test("style属性が存在する場合、その値を返す", () => {
      const element = NavElement.create({
        style: "display: flex; gap: 20px;",
      });

      expect(NavElement.getStyle(element)).toBe("display: flex; gap: 20px;");
    });

    test("style属性が存在しない場合、undefinedを返す", () => {
      const element = NavElement.create({
        className: "nav",
      });

      expect(NavElement.getStyle(element)).toBeUndefined();
    });
  });

  describe("getAriaLabel", () => {
    test("aria-label属性が存在する場合、その値を返す", () => {
      const element = NavElement.create({
        "aria-label": "メインナビゲーション",
      });

      expect(NavElement.getAriaLabel(element)).toBe("メインナビゲーション");
    });

    test("aria-label属性が存在しない場合、undefinedを返す", () => {
      const element = NavElement.create({
        role: "navigation",
      });

      expect(NavElement.getAriaLabel(element)).toBeUndefined();
    });

    test("空のaria-label属性の場合、空文字を返す", () => {
      const element = NavElement.create({
        "aria-label": "",
      });

      expect(NavElement.getAriaLabel(element)).toBe("");
    });
  });

  describe("getRole", () => {
    test("role属性が存在する場合、その値を返す", () => {
      const element = NavElement.create({
        role: "navigation",
      });

      expect(NavElement.getRole(element)).toBe("navigation");
    });

    test("role属性が存在しない場合、undefinedを返す", () => {
      const element = NavElement.create({
        "aria-label": "ナビゲーション",
      });

      expect(NavElement.getRole(element)).toBeUndefined();
    });

    test("空のrole属性の場合、空文字を返す", () => {
      const element = NavElement.create({
        role: "",
      });

      expect(NavElement.getRole(element)).toBe("");
    });
  });

  describe("複数属性の同時取得", () => {
    test("複数の属性を同時に取得できる", () => {
      const element = NavElement.create({
        id: "global-nav",
        className: "nav-wrapper",
        style: "width: 100%;",
        "aria-label": "グローバルナビゲーション",
        role: "navigation",
      });

      expect(NavElement.getId(element)).toBe("global-nav");
      expect(NavElement.getClassName(element)).toBe("nav-wrapper");
      expect(NavElement.getStyle(element)).toBe("width: 100%;");
      expect(NavElement.getAriaLabel(element)).toBe("グローバルナビゲーション");
      expect(NavElement.getRole(element)).toBe("navigation");
    });
  });
});
