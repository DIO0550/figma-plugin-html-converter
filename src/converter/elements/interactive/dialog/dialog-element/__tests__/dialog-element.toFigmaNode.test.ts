import { describe, test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

describe("DialogElement.toFigmaNode", () => {
  describe("基本変換", () => {
    test("基本的なFrameノードを作成できる", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.type).toBe("FRAME");
      expect(node.name).toBe("dialog");
    });

    test("id属性がある場合、名前に反映される", () => {
      const element = DialogElement.create({ id: "my-modal" });
      const node = DialogElement.toFigmaNode(element);

      expect(node.name).toBe("dialog#my-modal");
    });

    test("class属性がある場合、名前に反映される", () => {
      const element = DialogElement.create({ class: "modal" });
      const node = DialogElement.toFigmaNode(element);

      expect(node.name).toBe("dialog.modal");
    });
  });

  describe("レイアウト", () => {
    test("垂直レイアウト（VERTICAL）が設定される", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.layoutMode).toBe("VERTICAL");
    });
  });

  describe("open属性の視覚的表現", () => {
    test("open=trueの場合、opacity=1が設定される", () => {
      const element = DialogElement.create({ open: true });
      const node = DialogElement.toFigmaNode(element);

      expect(node.opacity).toBe(1);
    });

    test("open=falseの場合、opacity=0が設定される（非表示）", () => {
      const element = DialogElement.create({ open: false });
      const node = DialogElement.toFigmaNode(element);

      expect(node.opacity).toBe(0);
    });

    test("open属性がない場合、opacity=0が設定される", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.opacity).toBe(0);
    });

    test("open=''（HTML属性存在）の場合、opacity=1が設定される", () => {
      const element = DialogElement.create({ open: "" });
      const node = DialogElement.toFigmaNode(element);

      expect(node.opacity).toBe(1);
    });
  });

  describe("モーダルスタイル", () => {
    test("背景色が白で設定される", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.fills).toBeDefined();
      expect(node.fills?.length).toBeGreaterThan(0);
    });

    test("ボーダーが設定される", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.strokes).toBeDefined();
      expect(node.strokeWeight).toBe(1);
    });

    test("角丸が設定される", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.cornerRadius).toBeDefined();
      expect(node.cornerRadius).toBeGreaterThan(0);
    });

    test("パディングが設定される", () => {
      const element = DialogElement.create();
      const node = DialogElement.toFigmaNode(element);

      expect(node.paddingTop).toBeDefined();
      expect(node.paddingBottom).toBeDefined();
      expect(node.paddingLeft).toBeDefined();
      expect(node.paddingRight).toBeDefined();
    });
  });

  describe("スタイル適用", () => {
    test("カスタム背景色が適用される", () => {
      const element = DialogElement.create({
        style: "background-color: #f0f0f0;",
      });
      const node = DialogElement.toFigmaNode(element);

      expect(node.fills).toBeDefined();
    });
  });
});
