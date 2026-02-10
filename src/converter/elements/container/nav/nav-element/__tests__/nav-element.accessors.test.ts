import { expect, test } from "vitest";
import { NavElement } from "../nav-element";

test("NavElement.getId - ID属性あり - IDを返す", () => {
  const element = NavElement.create({
    id: "main-nav",
    className: "navbar",
  });

  expect(NavElement.getId(element)).toBe("main-nav");
});

test("NavElement.getId - ID属性なし - undefinedを返す", () => {
  const element = NavElement.create({
    className: "navbar",
  });

  expect(NavElement.getId(element)).toBeUndefined();
});

test("NavElement.getId - ID属性が空文字 - 空文字を返す", () => {
  const element = NavElement.create({
    id: "",
  });

  expect(NavElement.getId(element)).toBe("");
});

test(
  "NavElement.getClassName - className属性あり - classNameを返す",
  () => {
    const element = NavElement.create({
      className: "nav-menu primary-nav",
    });

    expect(NavElement.getClassName(element)).toBe("nav-menu primary-nav");
  }
);

test(
  "NavElement.getClassName - className属性なし - undefinedを返す",
  () => {
    const element = NavElement.create({
      id: "nav",
    });

    expect(NavElement.getClassName(element)).toBeUndefined();
  }
);

test(
  "NavElement.getClassName - classNameが空文字 - 空文字を返す",
  () => {
    const element = NavElement.create({
      className: "",
    });

    expect(NavElement.getClassName(element)).toBe("");
  }
);

test("NavElement.getStyle - style属性あり - styleを返す", () => {
  const element = NavElement.create({
    style: "display: flex; gap: 20px;",
  });

  expect(NavElement.getStyle(element)).toBe("display: flex; gap: 20px;");
});

test("NavElement.getStyle - style属性なし - undefinedを返す", () => {
  const element = NavElement.create({
    className: "nav",
  });

  expect(NavElement.getStyle(element)).toBeUndefined();
});

test(
  "NavElement.getAriaLabel - aria-label属性あり - aria-labelを返す",
  () => {
    const element = NavElement.create({
      "aria-label": "メインナビゲーション",
    });

    expect(NavElement.getAriaLabel(element)).toBe("メインナビゲーション");
  }
);

test(
  "NavElement.getAriaLabel - aria-label属性なし - undefinedを返す",
  () => {
    const element = NavElement.create({
      role: "navigation",
    });

    expect(NavElement.getAriaLabel(element)).toBeUndefined();
  }
);

test(
  "NavElement.getAriaLabel - aria-labelが空文字 - 空文字を返す",
  () => {
    const element = NavElement.create({
      "aria-label": "",
    });

    expect(NavElement.getAriaLabel(element)).toBe("");
  }
);

test("NavElement.getRole - role属性あり - roleを返す", () => {
  const element = NavElement.create({
    role: "navigation",
  });

  expect(NavElement.getRole(element)).toBe("navigation");
});

test("NavElement.getRole - role属性なし - undefinedを返す", () => {
  const element = NavElement.create({
    "aria-label": "ナビゲーション",
  });

  expect(NavElement.getRole(element)).toBeUndefined();
});

test("NavElement.getRole - roleが空文字 - 空文字を返す", () => {
  const element = NavElement.create({
    role: "",
  });

  expect(NavElement.getRole(element)).toBe("");
});

test(
  "NavElement.accessors - 複数属性あり - 各アクセサで取得できる",
  () => {
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
  }
);
