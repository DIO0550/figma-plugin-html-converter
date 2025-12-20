import { describe, test, expect } from "vitest";
import { SummaryElement } from "../summary";
import { DetailsElement, DetailsAttributes } from "../details";
import { DialogElement, DialogAttributes } from "../dialog";

describe("Interactive Elements 統合テスト", () => {
  describe("details + summary 連携", () => {
    test("details要素内にsummary要素を配置できる", () => {
      const summary = SummaryElement.create({ id: "toggle" });
      const details = DetailsElement.create({ id: "accordion" });

      const summaryNode = SummaryElement.toFigmaNode(summary);
      const detailsNode = DetailsElement.toFigmaNode(details);

      expect(summaryNode.type).toBe("FRAME");
      expect(detailsNode.type).toBe("FRAME");
      expect(summaryNode.layoutMode).toBe("HORIZONTAL");
      expect(detailsNode.layoutMode).toBe("VERTICAL");
    });

    test("open=true のdetails要素は展開状態を表現", () => {
      const details = DetailsElement.create({ open: true });
      const node = DetailsElement.toFigmaNode(details);

      expect(node.opacity).toBe(1);
      expect(DetailsAttributes.isOpen(details.attributes)).toBe(true);
    });

    test("open=false のdetails要素は折りたたみ状態を表現", () => {
      const details = DetailsElement.create({ open: false });
      const node = DetailsElement.toFigmaNode(details);

      expect(node.opacity).toBe(1);
      expect(DetailsAttributes.isOpen(details.attributes)).toBe(false);
    });

    test("summaryのマーカーが正しく表示される", () => {
      const summary = SummaryElement.create();
      const node = SummaryElement.toFigmaNode(summary);

      expect(node.children).toBeDefined();
      expect(node.children?.length).toBeGreaterThanOrEqual(1);

      const marker = node.children?.[0];
      expect(marker?.type).toBe("TEXT");
      expect(marker?.name).toBe("▶");
    });
  });

  describe("dialog要素の表示制御", () => {
    test("open=true のdialog要素は表示される", () => {
      const dialog = DialogElement.create({ open: true });
      const node = DialogElement.toFigmaNode(dialog);

      expect(node.opacity).toBe(1);
      expect(DialogAttributes.isOpen(dialog.attributes)).toBe(true);
    });

    test("open=false のdialog要素は非表示になる", () => {
      const dialog = DialogElement.create({ open: false });
      const node = DialogElement.toFigmaNode(dialog);

      expect(node.opacity).toBe(0);
      expect(DialogAttributes.isOpen(dialog.attributes)).toBe(false);
    });

    test("open属性なしのdialog要素は非表示になる", () => {
      const dialog = DialogElement.create();
      const node = DialogElement.toFigmaNode(dialog);

      expect(node.opacity).toBe(0);
      expect(DialogAttributes.isOpen(dialog.attributes)).toBe(false);
    });

    test("dialog要素はモーダルスタイルを持つ", () => {
      const dialog = DialogElement.create({ open: true });
      const node = DialogElement.toFigmaNode(dialog);

      // 白背景
      expect(node.fills).toBeDefined();
      // 角丸
      expect(node.cornerRadius).toBe(8);
      // パディング
      expect(node.paddingTop).toBe(16);
      expect(node.paddingBottom).toBe(16);
    });
  });

  describe("各要素の型ガード連携", () => {
    test("異なる要素を正しく区別できる", () => {
      const summary = SummaryElement.create();
      const details = DetailsElement.create();
      const dialog = DialogElement.create();

      expect(SummaryElement.isSummaryElement(summary)).toBe(true);
      expect(SummaryElement.isSummaryElement(details)).toBe(false);
      expect(SummaryElement.isSummaryElement(dialog)).toBe(false);

      expect(DetailsElement.isDetailsElement(summary)).toBe(false);
      expect(DetailsElement.isDetailsElement(details)).toBe(true);
      expect(DetailsElement.isDetailsElement(dialog)).toBe(false);

      expect(DialogElement.isDialogElement(summary)).toBe(false);
      expect(DialogElement.isDialogElement(details)).toBe(false);
      expect(DialogElement.isDialogElement(dialog)).toBe(true);
    });
  });

  describe("各要素のmapToFigma連携", () => {
    test("HTMLノード形式から各要素を正しくマッピングできる", () => {
      const summaryHtml = {
        type: "element",
        tagName: "summary",
        attributes: { id: "summary-1" },
        children: [],
      };

      const detailsHtml = {
        type: "element",
        tagName: "details",
        attributes: { open: true },
        children: [],
      };

      const dialogHtml = {
        type: "element",
        tagName: "dialog",
        attributes: { open: true },
        children: [],
      };

      const summaryNode = SummaryElement.mapToFigma(summaryHtml);
      const detailsNode = DetailsElement.mapToFigma(detailsHtml);
      const dialogNode = DialogElement.mapToFigma(dialogHtml);

      expect(summaryNode).not.toBeNull();
      expect(detailsNode).not.toBeNull();
      expect(dialogNode).not.toBeNull();

      expect(summaryNode?.name).toBe("summary#summary-1");
      expect(detailsNode?.opacity).toBe(1);
      expect(dialogNode?.opacity).toBe(1);
    });

    test("異なるタグ名の要素はnullを返す", () => {
      const divHtml = {
        type: "element",
        tagName: "div",
        attributes: {},
        children: [],
      };

      expect(SummaryElement.mapToFigma(divHtml)).toBeNull();
      expect(DetailsElement.mapToFigma(divHtml)).toBeNull();
      expect(DialogElement.mapToFigma(divHtml)).toBeNull();
    });
  });

  describe("open属性の異なる形式", () => {
    test("open属性が空文字列の場合、開いていると判定される", () => {
      const detailsAttrs = { open: "" as const };
      const dialogAttrs = { open: "" as const };

      expect(DetailsAttributes.isOpen(detailsAttrs)).toBe(true);
      expect(DialogAttributes.isOpen(dialogAttrs)).toBe(true);
    });

    test("open属性がundefinedの場合、閉じていると判定される", () => {
      const detailsAttrs = { open: undefined };
      const dialogAttrs = { open: undefined };

      expect(DetailsAttributes.isOpen(detailsAttrs)).toBe(false);
      expect(DialogAttributes.isOpen(dialogAttrs)).toBe(false);
    });
  });
});
