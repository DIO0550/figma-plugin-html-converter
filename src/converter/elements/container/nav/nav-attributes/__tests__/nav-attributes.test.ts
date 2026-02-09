import { expect, test } from "vitest";
import type { NavAttributes } from "../nav-attributes";

test(
  "NavAttributes.type - GlobalAttributes継承 - id/className/styleを保持する",
  () => {
    const attributes: NavAttributes = {
      id: "main-nav",
      className: "navigation",
      style: "display: flex;",
    };

    expect(attributes.id).toBe("main-nav");
    expect(attributes.className).toBe("navigation");
    expect(attributes.style).toBe("display: flex;");
  }
);

test(
  "NavAttributes.type - aria-label属性あり - aria-labelを保持する",
  () => {
    const attributes: NavAttributes = {
      "aria-label": "メインナビゲーション",
    };

    expect(attributes["aria-label"]).toBe("メインナビゲーション");
  }
);

test("NavAttributes.type - role属性あり - roleを保持する", () => {
  const attributes: NavAttributes = {
    role: "navigation",
  };

  expect(attributes.role).toBe("navigation");
});

test("NavAttributes.type - 空のオブジェクト - 空オブジェクトを許容する", () => {
  const attributes: NavAttributes = {};

  expect(attributes).toEqual({});
});

test(
  "NavAttributes.type - 複数属性あり - 各属性を保持する",
  () => {
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
  }
);
