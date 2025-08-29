import { test, expect } from "vitest";
import type { AsideAttributes } from "../aside-attributes";

test("AsideAttributes: グローバル属性を含むこと", () => {
  const attributes: AsideAttributes = {
    id: "sidebar",
    className: "sidebar-content",
    style: "width: 300px;",
  };

  expect(attributes.id).toBe("sidebar");
  expect(attributes.className).toBe("sidebar-content");
  expect(attributes.style).toBe("width: 300px;");
});

test("AsideAttributes: role属性を設定できること", () => {
  const attributes: AsideAttributes = {
    role: "complementary",
  };

  expect(attributes.role).toBe("complementary");
});

test("AsideAttributes: aria-label属性を設定できること", () => {
  const attributes: AsideAttributes = {
    "aria-label": "サイドバー",
  };

  expect(attributes["aria-label"]).toBe("サイドバー");
});

test("AsideAttributes: 空の属性オブジェクトを作成できること", () => {
  const attributes: AsideAttributes = {};

  expect(attributes).toEqual({});
});

test("AsideAttributes: 複数の属性を組み合わせて使用できること", () => {
  const attributes: AsideAttributes = {
    id: "sidebar",
    className: "sidebar navigation",
    style: "background-color: #f0f0f0;",
    role: "complementary",
    "aria-label": "メインサイドバー",
  };

  expect(attributes.id).toBe("sidebar");
  expect(attributes.className).toBe("sidebar navigation");
  expect(attributes.style).toBe("background-color: #f0f0f0;");
  expect(attributes.role).toBe("complementary");
  expect(attributes["aria-label"]).toBe("メインサイドバー");
});
