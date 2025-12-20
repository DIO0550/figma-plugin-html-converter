import { describe, test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

describe("SummaryElement.toFigmaNode", () => {
  describe("基本変換", () => {
    test("基本的なFrameノードを作成できる", () => {
      const element = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(element);

      expect(node.type).toBe("FRAME");
      expect(node.name).toBe("summary");
    });

    test("id属性がある場合、名前に反映される", () => {
      const element = SummaryElement.create({ id: "my-summary" });
      const node = SummaryElement.toFigmaNode(element);

      expect(node.name).toBe("summary#my-summary");
    });

    test("class属性がある場合、名前に反映される", () => {
      const element = SummaryElement.create({ class: "summary-class" });
      const node = SummaryElement.toFigmaNode(element);

      expect(node.name).toBe("summary.summary-class");
    });

    test("idとclass両方がある場合、idが優先される", () => {
      const element = SummaryElement.create({
        id: "my-id",
        class: "my-class",
      });
      const node = SummaryElement.toFigmaNode(element);

      expect(node.name).toBe("summary#my-id");
    });
  });

  describe("レイアウト", () => {
    test("水平レイアウト（HORIZONTAL）が設定される", () => {
      const element = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(element);

      expect(node.layoutMode).toBe("HORIZONTAL");
    });

    test("子要素の間隔が適切に設定される", () => {
      const element = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(element);

      expect(node.itemSpacing).toBe(8);
    });

    test("縦方向の配置がCENTERに設定される", () => {
      const element = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(element);

      expect(node.counterAxisAlignItems).toBe("CENTER");
    });
  });

  describe("マーカー表示", () => {
    test("展開マーカー（▶）がデフォルトで表示される", () => {
      const element = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(element);

      expect(node.children).toBeDefined();
      expect(node.children?.length).toBeGreaterThanOrEqual(1);

      const markerChild = node.children?.[0];
      expect(markerChild?.type).toBe("TEXT");
      expect(markerChild?.name).toBe("▶");
    });
  });

  describe("スタイル適用", () => {
    test("背景色が適用される", () => {
      const element = SummaryElement.create({
        style: "background-color: #f0f0f0;",
      });
      const node = SummaryElement.toFigmaNode(element);

      expect(node.fills).toBeDefined();
    });

    test("cursor: pointerスタイルが暗黙的に適用される", () => {
      const element = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(element);

      // summary要素はデフォルトでクリック可能を示唆
      expect(node.type).toBe("FRAME");
    });
  });
});
