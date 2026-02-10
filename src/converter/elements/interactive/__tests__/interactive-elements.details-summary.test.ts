import { test, expect } from "vitest";
import { SummaryElement } from "../summary";
import { DetailsElement, DetailsAttributes } from "../details";

test("details+summary連携 - details要素内にsummary要素を配置できる", () => {
  const summary = SummaryElement.create({ id: "toggle" });
  const details = DetailsElement.create({ id: "accordion" });

  const summaryNode = SummaryElement.toFigmaNode(summary);
  const detailsNode = DetailsElement.toFigmaNode(details);

  expect(summaryNode.type).toBe("FRAME");
  expect(detailsNode.type).toBe("FRAME");
  expect(summaryNode.layoutMode).toBe("HORIZONTAL");
  expect(detailsNode.layoutMode).toBe("VERTICAL");
});

test("details+summary連携 - open=trueのdetails要素は展開状態を表現", () => {
  const details = DetailsElement.create({ open: true });
  const node = DetailsElement.toFigmaNode(details);

  expect(node.opacity).toBe(1);
  expect(DetailsAttributes.isOpen(details.attributes)).toBe(true);
});

test("details+summary連携 - open=falseのdetails要素は折りたたみ状態を表現", () => {
  const details = DetailsElement.create({ open: false });
  const node = DetailsElement.toFigmaNode(details);

  expect(node.opacity).toBe(1);
  expect(DetailsAttributes.isOpen(details.attributes)).toBe(false);
});

test("details+summary連携 - summaryのマーカーが正しく表示される", () => {
  const summary = SummaryElement.create();
  const node = SummaryElement.toFigmaNode(summary);

  expect(node.children).toBeDefined();
  expect(node.children?.length).toBeGreaterThanOrEqual(1);

  const marker = node.children?.[0];
  expect(marker?.type).toBe("TEXT");
  expect(marker?.name).toBe("▶");
});
