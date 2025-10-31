import { describe, expect, test } from "vitest";
import { NavElement } from "../nav-element";

describe("NavElement.mapToFigma", () => {
  test("有効なnav要素をFigmaノード設定にマッピングする", () => {
    const node = {
      type: "element" as const,
      tagName: "nav",
      attributes: {
        id: "main-nav",
        className: "navbar",
      },
      children: [],
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeTruthy();
    expect(figmaNode!.type).toBe("FRAME");
    expect(figmaNode!.name).toBe("nav#main-nav.navbar");
    expect(figmaNode!.layoutMode).toBe("VERTICAL");
    expect(figmaNode!.layoutSizingHorizontal).toBe("FILL");
    expect(figmaNode!.children).toEqual([]);
  });

  test("スタイル付きnav要素をFigmaノード設定にマッピングする", () => {
    const node = {
      type: "element" as const,
      tagName: "nav",
      attributes: {
        style: "display: flex; gap: 20px;",
      },
      children: [],
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeTruthy();
    expect(figmaNode!.type).toBe("FRAME");
    expect(figmaNode!.name).toBe("nav");
    expect(figmaNode!.layoutMode).toBe("HORIZONTAL");
    expect(figmaNode!.itemSpacing).toBe(20);
    expect(figmaNode!.children).toEqual([]);
  });

  test("aria属性付きnav要素をFigmaノード設定にマッピングする", () => {
    const node = {
      type: "element" as const,
      tagName: "nav",
      attributes: {
        "aria-label": "ナビゲーション",
        role: "navigation",
      },
      children: [],
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeTruthy();
    expect(figmaNode!.type).toBe("FRAME");
    expect(figmaNode!.name).toBe("nav");
    expect(figmaNode!.layoutMode).toBe("VERTICAL");
    expect(figmaNode!.layoutSizingHorizontal).toBe("FILL");
    expect(figmaNode!.children).toEqual([]);
  });

  test("nav要素でない場合nullを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "div",
      attributes: {},
      children: [],
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeNull();
  });

  test("typeがelementでない場合nullを返す", () => {
    const node = {
      type: "text" as const,
      tagName: "nav",
      content: "text",
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeNull();
  });

  test("nullを渡した場合nullを返す", () => {
    const figmaNode = NavElement.mapToFigma(null);

    expect(figmaNode).toBeNull();
  });

  test("undefinedを渡した場合nullを返す", () => {
    const figmaNode = NavElement.mapToFigma(undefined);

    expect(figmaNode).toBeNull();
  });

  test("不正なオブジェクトを渡した場合nullを返す", () => {
    const node = {
      invalidProp: "invalid",
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeNull();
  });

  test("複雑なスタイルを持つnav要素をマッピングする", () => {
    const node = {
      type: "element" as const,
      tagName: "nav",
      attributes: {
        id: "sidebar",
        className: "vertical-nav",
        style:
          "display: flex; flex-direction: column; padding: 24px; background-color: #f5f5f5;",
        "aria-label": "サイドバー",
      },
      children: [],
    };

    const figmaNode = NavElement.mapToFigma(node);

    expect(figmaNode).toBeTruthy();
    expect(figmaNode!.type).toBe("FRAME");
    expect(figmaNode!.name).toBe("nav#sidebar.vertical-nav");
    expect(figmaNode!.layoutMode).toBe("VERTICAL");
    expect(figmaNode!.paddingTop).toBe(24);
    expect(figmaNode!.paddingRight).toBe(24);
    expect(figmaNode!.paddingBottom).toBe(24);
    expect(figmaNode!.paddingLeft).toBe(24);
    expect(figmaNode!.fills).toBeDefined();
    expect(figmaNode!.fills[0].type).toBe("SOLID");
    expect(figmaNode!.fills[0].color.r).toBeCloseTo(0.9607843137254902);
    expect(figmaNode!.fills[0].color.g).toBeCloseTo(0.9607843137254902);
    expect(figmaNode!.fills[0].color.b).toBeCloseTo(0.9607843137254902);
    expect(figmaNode!.children).toEqual([]);
  });
});
