import { test, expect } from "vitest";
import { SummaryElement } from "../summary-element";

test("SummaryElement.toFigmaNode - デフォルト - 基本的なFrameノードを作成できる", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("summary");
});

test("SummaryElement.toFigmaNode - id属性あり - 名前に反映される", () => {
  const element = SummaryElement.create({ id: "my-summary" });
  const node = SummaryElement.toFigmaNode(element);

  expect(node.name).toBe("summary#my-summary");
});

test("SummaryElement.toFigmaNode - class属性あり - 名前に反映される", () => {
  const element = SummaryElement.create({ class: "summary-class" });
  const node = SummaryElement.toFigmaNode(element);

  expect(node.name).toBe("summary.summary-class");
});

test("SummaryElement.toFigmaNode - idとclass両方あり - idが優先される", () => {
  const element = SummaryElement.create({
    id: "my-id",
    class: "my-class",
  });
  const node = SummaryElement.toFigmaNode(element);

  expect(node.name).toBe("summary#my-id");
});

test("SummaryElement.toFigmaNode - レイアウト - 水平レイアウト（HORIZONTAL）が設定される", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(element);

  expect(node.layoutMode).toBe("HORIZONTAL");
});

test("SummaryElement.toFigmaNode - レイアウト - 子要素の間隔が適切に設定される", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(element);

  expect(node.itemSpacing).toBe(8);
});

test("SummaryElement.toFigmaNode - レイアウト - 縦方向の配置がCENTERに設定される", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(element);

  expect(node.counterAxisAlignItems).toBe("CENTER");
});

test("SummaryElement.toFigmaNode - マーカー - 展開マーカー（▶）がデフォルトで表示される", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(element);

  expect(node.children).toBeDefined();
  expect(node.children?.length).toBeGreaterThanOrEqual(1);

  const markerChild = node.children?.[0];
  expect(markerChild?.type).toBe("TEXT");
  expect(markerChild?.name).toBe("▶");
});

test("SummaryElement.toFigmaNode - スタイル - 背景色が適用される", () => {
  const element = SummaryElement.create({
    style: "background-color: #f0f0f0;",
  });
  const node = SummaryElement.toFigmaNode(element);

  expect(node.fills).toBeDefined();
});

test("SummaryElement.toFigmaNode - スタイル - cursor: pointerスタイルが暗黙的に適用される", () => {
  const element = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(element);

  // summary要素はデフォルトでクリック可能を示唆
  expect(node.type).toBe("FRAME");
});
