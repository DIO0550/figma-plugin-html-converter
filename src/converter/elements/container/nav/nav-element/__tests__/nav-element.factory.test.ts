import { expect, test } from "vitest";
import { NavElement } from "../nav-element";
import type { NavElement as INavElement } from "../nav-element";

test("NavElement.create - 属性なし - nav要素を作成する", () => {
  const element = NavElement.create();

  expect(element).toEqual({
    type: "element",
    tagName: "nav",
    attributes: {},
    children: [],
  });
});

test("NavElement.create - 属性指定あり - nav要素を作成する", () => {
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

test("NavElement.create - aria-label属性あり - nav要素を作成する", () => {
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

test("NavElement.create - role属性あり - nav要素を作成する", () => {
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

test("NavElement.create - style属性あり - nav要素を作成する", () => {
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

test(
  "NavElement.create - 複数属性指定あり - nav要素を作成する",
  () => {
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
  }
);

test("NavElement.create - 作成した要素 - NavElement型である", () => {
  const element = NavElement.create({
    className: "test-nav",
  });

  const isValidType: INavElement = element;
  expect(isValidType).toBeDefined();
  expect(NavElement.isNavElement(element)).toBe(true);
});
