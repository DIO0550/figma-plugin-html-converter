import { expect, test } from "vitest";
import { NavElement } from "../nav-element";

test(
  "NavElement.toFigmaNode - 基本的なnav要素 - Figmaノード設定を生成する",
  () => {
    const element = NavElement.create();
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  }
);

test(
  "NavElement.toFigmaNode - ID属性あり - nameにIDを含める",
  () => {
    const element = NavElement.create({
      id: "main-navigation",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav#main-navigation");
  }
);

test(
  "NavElement.toFigmaNode - className属性あり - nameにclassNameを含める",
  () => {
    const element = NavElement.create({
      className: "navbar primary-nav",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav.navbar.primary-nav");
  }
);

test(
  "NavElement.toFigmaNode - IDとclassName属性あり - nameに両方を含める",
  () => {
    const element = NavElement.create({
      id: "global-nav",
      className: "nav-menu",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav#global-nav.nav-menu");
  }
);

test(
  "NavElement.toFigmaNode - Flexboxスタイルあり - レイアウト情報を反映する",
  () => {
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
  }
);

test(
  "NavElement.toFigmaNode - aria-label属性あり - 基本レイアウトを保持する",
  () => {
    const element = NavElement.create({
      "aria-label": "メインナビゲーション",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  }
);

test(
  "NavElement.toFigmaNode - role属性あり - 基本レイアウトを保持する",
  () => {
    const element = NavElement.create({
      role: "navigation",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
  }
);

test(
  "NavElement.toFigmaNode - 複数属性とスタイルあり - 名前とスタイルを反映する",
  () => {
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
  }
);

test(
  "NavElement.toFigmaNode - widthとheightスタイルあり - サイズ設定を反映する",
  () => {
    const element = NavElement.create({
      style: "width: 100%; height: 60px;",
    });
    const figmaNode = NavElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("nav");
    // widthとheightはapplySizeStylesで処理されるため、期待値を調整
    expect(figmaNode.layoutSizingHorizontal).toBe("FILL");
    expect(figmaNode.height).toBe(60);
  }
);

test(
  "NavElement.toFigmaNode - 背景色スタイルあり - fillsに反映する",
  () => {
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
  }
);
