import { describe, test, expect } from "vitest";
import { DetailsElement } from "../details-element";

describe("DetailsElement.toFigmaNode", () => {
  describe("基本変換", () => {
    test("基本的なFrameノードを作成できる", () => {
      const element = DetailsElement.create();
      const node = DetailsElement.toFigmaNode(element);

      expect(node.type).toBe("FRAME");
      expect(node.name).toBe("details");
    });

    test("id属性がある場合、名前に反映される", () => {
      const element = DetailsElement.create({ id: "my-details" });
      const node = DetailsElement.toFigmaNode(element);

      expect(node.name).toBe("details#my-details");
    });

    test("class属性がある場合、名前に反映される", () => {
      const element = DetailsElement.create({ class: "collapsible" });
      const node = DetailsElement.toFigmaNode(element);

      expect(node.name).toBe("details.collapsible");
    });
  });

  describe("レイアウト", () => {
    test("垂直レイアウト（VERTICAL）が設定される", () => {
      const element = DetailsElement.create();
      const node = DetailsElement.toFigmaNode(element);

      expect(node.layoutMode).toBe("VERTICAL");
    });

    test("幅がFILLに設定される", () => {
      const element = DetailsElement.create();
      const node = DetailsElement.toFigmaNode(element);

      expect(node.layoutSizingHorizontal).toBe("FILL");
    });
  });

  describe("open属性の視覚的表現", () => {
    test("open=trueの場合、opacity=1が設定される", () => {
      const element = DetailsElement.create({ open: true });
      const node = DetailsElement.toFigmaNode(element);

      expect(node.opacity).toBe(1);
    });

    test("open=falseの場合、opacity=1が設定される（折りたたみ時も表示）", () => {
      const element = DetailsElement.create({ open: false });
      const node = DetailsElement.toFigmaNode(element);

      expect(node.opacity).toBe(1);
    });

    test("open属性がない場合、opacity=1が設定される", () => {
      const element = DetailsElement.create();
      const node = DetailsElement.toFigmaNode(element);

      expect(node.opacity).toBe(1);
    });

    test("open=''（HTML属性存在）の場合、opacity=1が設定される", () => {
      const element = DetailsElement.create({ open: "" });
      const node = DetailsElement.toFigmaNode(element);

      expect(node.opacity).toBe(1);
    });
  });

  describe("デフォルトスタイル", () => {
    test("ボーダーがデフォルトで設定される", () => {
      const element = DetailsElement.create();
      const node = DetailsElement.toFigmaNode(element);

      expect(node.strokes).toBeDefined();
      expect(node.strokeWeight).toBe(1);
    });

    test("パディングがデフォルトで設定される", () => {
      const element = DetailsElement.create();
      const node = DetailsElement.toFigmaNode(element);

      expect(node.paddingTop).toBeDefined();
      expect(node.paddingBottom).toBeDefined();
      expect(node.paddingLeft).toBeDefined();
      expect(node.paddingRight).toBeDefined();
    });
  });

  describe("スタイル適用", () => {
    test("背景色が適用される", () => {
      const element = DetailsElement.create({
        style: "background-color: #f5f5f5;",
      });
      const node = DetailsElement.toFigmaNode(element);

      expect(node.fills).toBeDefined();
    });
  });
});
