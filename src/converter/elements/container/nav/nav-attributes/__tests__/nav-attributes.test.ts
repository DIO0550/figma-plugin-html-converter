import { describe, expect, test } from "vitest";
import type { NavAttributes } from "../nav-attributes";

describe("NavAttributes", () => {
  test("NavAttributesはGlobalAttributesを継承する", () => {
    const attributes: NavAttributes = {
      id: "main-nav",
      className: "navigation",
      style: "display: flex;",
    };

    expect(attributes.id).toBe("main-nav");
    expect(attributes.className).toBe("navigation");
    expect(attributes.style).toBe("display: flex;");
  });

  test("NavAttributesはaria-label属性を含む", () => {
    const attributes: NavAttributes = {
      "aria-label": "メインナビゲーション",
    };

    expect(attributes["aria-label"]).toBe("メインナビゲーション");
  });

  test("NavAttributesはrole属性を含む", () => {
    const attributes: NavAttributes = {
      role: "navigation",
    };

    expect(attributes.role).toBe("navigation");
  });

  test("NavAttributesは空のオブジェクトでも有効", () => {
    const attributes: NavAttributes = {};

    expect(attributes).toEqual({});
  });

  test("NavAttributesは複数の属性を同時に設定できる", () => {
    const attributes: NavAttributes = {
      id: "sidebar-nav",
      className: "nav-list",
      "aria-label": "サイドバーナビゲーション",
      role: "navigation",
      style: "width: 250px;",
    };

    expect(attributes.id).toBe("sidebar-nav");
    expect(attributes.className).toBe("nav-list");
    expect(attributes["aria-label"]).toBe("サイドバーナビゲーション");
    expect(attributes.role).toBe("navigation");
    expect(attributes.style).toBe("width: 250px;");
  });
});
