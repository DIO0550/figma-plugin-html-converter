import { describe, it, expect } from "vitest";
import { MainElement } from "../main-element";

describe("MainElement.toFigmaNode", () => {
  it("基本的なmain要素をFigmaノードに変換できること", () => {
    const element = MainElement.create();
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode).toEqual({
      type: "FRAME",
      name: "main",
      layoutMode: "VERTICAL",
      layoutSizingVertical: "HUG",
      layoutSizingHorizontal: "FIXED",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      itemSpacing: 0,
    });
  });

  it("id属性を持つmain要素の名前が正しく生成されること", () => {
    const element = MainElement.create({ id: "main-content" });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("main#main-content");
  });

  it("className属性を持つmain要素の名前が正しく生成されること", () => {
    const element = MainElement.create({ className: "main container" });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("main.main.container");
  });

  it("idとclassNameを両方持つmain要素の名前が正しく生成されること", () => {
    const element = MainElement.create({
      id: "content",
      className: "main-area responsive",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("main#content.main-area.responsive");
  });

  it("display:flexスタイルが適用されること", () => {
    const element = MainElement.create({
      style:
        "display: flex; flex-direction: row; justify-content: center; align-items: center;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("HORIZONTAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  });

  it("パディングスタイルが適用されること", () => {
    const element = MainElement.create({
      style: "padding: 20px;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.paddingTop).toBe(20);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(20);
    expect(figmaNode.paddingLeft).toBe(20);
  });

  it("個別のパディングスタイルが適用されること", () => {
    const element = MainElement.create({
      style:
        "padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.paddingTop).toBe(10);
    expect(figmaNode.paddingRight).toBe(20);
    expect(figmaNode.paddingBottom).toBe(30);
    expect(figmaNode.paddingLeft).toBe(40);
  });

  it("gapスタイルが適用されること", () => {
    const element = MainElement.create({
      style: "display: flex; gap: 16px;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.itemSpacing).toBe(16);
  });

  it("背景色が適用されること", () => {
    const element = MainElement.create({
      style: "background-color: #f0f0f0;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.fills).toEqual([
      {
        type: "SOLID",
        color: {
          r: 0.9411764705882353,
          g: 0.9411764705882353,
          b: 0.9411764705882353,
        },
        opacity: 1,
      },
    ]);
  });

  it("サイズスタイルが適用されること", () => {
    const element = MainElement.create({
      style: "width: 1200px; height: 800px;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(1200);
    expect(figmaNode.layoutSizingHorizontal).toBe("FIXED");
    expect(figmaNode.height).toBe(800);
    expect(figmaNode.layoutSizingVertical).toBe("FIXED");
  });

  it("最小・最大サイズスタイルが適用されること", () => {
    const element = MainElement.create({
      style:
        "min-width: 320px; max-width: 1920px; min-height: 480px; max-height: 1080px;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect((figmaNode as Record<string, unknown>).minWidth).toBe(320);
    expect((figmaNode as Record<string, unknown>).maxWidth).toBe(1920);
    expect((figmaNode as Record<string, unknown>).minHeight).toBe(480);
    expect((figmaNode as Record<string, unknown>).maxHeight).toBe(1080);
  });

  it("Flexbox justify-contentの全バリエーションが正しくマッピングされること", () => {
    const justifyContentMap = {
      "flex-start": "MIN",
      "flex-end": "MAX",
      center: "CENTER",
      "space-between": "SPACE_BETWEEN",
      "space-around": "SPACE_AROUND",
      "space-evenly": "SPACE_EVENLY",
    };

    Object.entries(justifyContentMap).forEach(([cssValue, figmaValue]) => {
      const element = MainElement.create({
        style: `display: flex; justify-content: ${cssValue};`,
      });
      const figmaNode = MainElement.toFigmaNode(element);
      expect(figmaNode.primaryAxisAlignItems).toBe(figmaValue);
    });
  });

  it("Flexbox align-itemsの全バリエーションが正しくマッピングされること", () => {
    const alignItemsMap = {
      "flex-start": "MIN",
      "flex-end": "MAX",
      center: "CENTER",
      stretch: "STRETCH",
      baseline: "BASELINE",
    };

    Object.entries(alignItemsMap).forEach(([cssValue, figmaValue]) => {
      const element = MainElement.create({
        style: `display: flex; align-items: ${cssValue};`,
      });
      const figmaNode = MainElement.toFigmaNode(element);
      expect(figmaNode.counterAxisAlignItems).toBe(figmaValue);
    });
  });

  it("複数のスタイルが同時に適用されること", () => {
    const element = MainElement.create({
      id: "main",
      className: "content-area",
      style:
        "display: flex; flex-direction: column; justify-content: space-between; align-items: stretch; padding: 24px; gap: 16px; background-color: white; width: 100%; min-height: 600px;",
    });
    const figmaNode = MainElement.toFigmaNode(element);

    expect(figmaNode).toMatchObject({
      type: "FRAME",
      name: "main#main.content-area",
      layoutMode: "VERTICAL",
      primaryAxisAlignItems: "SPACE_BETWEEN",
      counterAxisAlignItems: "STRETCH",
      paddingTop: 24,
      paddingRight: 24,
      paddingBottom: 24,
      paddingLeft: 24,
      itemSpacing: 16,
      width: 100,
      layoutSizingHorizontal: "FIXED",
      fills: [
        {
          type: "SOLID",
          color: { r: 1, g: 1, b: 1 },
          opacity: 1,
        },
      ],
    });
    expect((figmaNode as Record<string, unknown>).minHeight).toBe(600);
  });
});
