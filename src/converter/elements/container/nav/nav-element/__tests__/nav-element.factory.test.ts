import { describe, expect, test } from "vitest";
import { NavElement } from "../nav-element";
import type { NavElement as INavElement } from "../nav-element";

describe("NavElement.create", () => {
  test("属性なしでnav要素を作成できる", () => {
    const element = NavElement.create();

    expect(element).toEqual({
      type: "element",
      tagName: "nav",
      attributes: {},
      children: [],
    });
  });

  test("属性を指定してnav要素を作成できる", () => {
    const element = NavElement.create({
      id: "main-navigation",
      className: "navbar",
    });

    expect(element).toEqual({
      type: "element",
      tagName: "nav",
      attributes: {
        id: "main-navigation",
        className: "navbar",
      },
      children: [],
    });
  });

  test("aria-label属性を指定してnav要素を作成できる", () => {
    const element = NavElement.create({
      "aria-label": "メインナビゲーション",
    });

    expect(element).toEqual({
      type: "element",
      tagName: "nav",
      attributes: {
        "aria-label": "メインナビゲーション",
      },
      children: [],
    });
  });

  test("role属性を指定してnav要素を作成できる", () => {
    const element = NavElement.create({
      role: "navigation",
    });

    expect(element).toEqual({
      type: "element",
      tagName: "nav",
      attributes: {
        role: "navigation",
      },
      children: [],
    });
  });

  test("スタイル属性を指定してnav要素を作成できる", () => {
    const element = NavElement.create({
      style: "display: flex; justify-content: space-between;",
    });

    expect(element).toEqual({
      type: "element",
      tagName: "nav",
      attributes: {
        style: "display: flex; justify-content: space-between;",
      },
      children: [],
    });
  });

  test("複数の属性を指定してnav要素を作成できる", () => {
    const element = NavElement.create({
      id: "sidebar-nav",
      className: "nav-menu",
      "aria-label": "サイドバーナビゲーション",
      role: "navigation",
      style: "width: 250px;",
    });

    expect(element).toEqual({
      type: "element",
      tagName: "nav",
      attributes: {
        id: "sidebar-nav",
        className: "nav-menu",
        "aria-label": "サイドバーナビゲーション",
        role: "navigation",
        style: "width: 250px;",
      },
      children: [],
    });
  });

  test("作成された要素はNavElement型である", () => {
    const element = NavElement.create({
      className: "test-nav",
    });

    const isValidType: INavElement = element;
    expect(isValidType).toBeDefined();
    expect(NavElement.isNavElement(element)).toBe(true);
  });
});
