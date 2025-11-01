import { describe, expect, test } from "vitest";
import { NavElement } from "../nav-element";

describe("NavElement.toFigmaNode", () => {
  test("基本的なnav要素からFigmaノード設定を生成する", () => {
    const element = NavElement.create();
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  });

  test("ID属性を持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      id: "main-navigation",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav#main-navigation");
  });

  test("className属性を持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      className: "navbar primary-nav",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav.navbar.primary-nav");
  });

  test("IDとclassNameを持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      id: "global-nav",
      className: "nav-menu",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav#global-nav.nav-menu");
  });

  test("Flexboxスタイルを持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      style:
        "display: flex; justify-content: space-between; align-items: center;",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("SPACE_BETWEEN");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  });

  test("aria-label属性を持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      "aria-label": "メインナビゲーション",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  });

  test("role属性を持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      role: "navigation",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  });

  test("複数の属性とスタイルを持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      id: "sidebar-nav",
      className: "nav-vertical",
      style: "display: flex; flex-direction: column; gap: 10px; padding: 20px;",
      "aria-label": "サイドバーナビゲーション",
      role: "navigation",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav#sidebar-nav.nav-vertical");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.itemSpacing).toBe(10);
    expect(figmaNode.paddingTop).toBe(20);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(20);
    expect(figmaNode.paddingLeft).toBe(20);
  });

  test("幅と高さのスタイルを持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      style: "width: 100%; height: 60px;",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    // widthとheightはapplySizeStylesで処理されるため、期待値を調整
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
    expect(figmaNode.height).toBe(60);
  });

  test("背景色のスタイルを持つnav要素からFigmaノードを生成する", () => {
    const element = NavElement.create({
      style: "background-color: #333333;",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.fills).toBeDefined();
    expect(figmaNode.fills[0].type).toBe("SOLID");
    expect(figmaNode.fills[0].color.r).toBeCloseTo(0.2);
    expect(figmaNode.fills[0].color.g).toBeCloseTo(0.2);
    expect(figmaNode.fills[0].color.b).toBeCloseTo(0.2);
  });
});
