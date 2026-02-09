import { test, expect } from "vitest";
import { DetailsElement } from "../details-element";

test("DetailsElement.toFigmaNode - デフォルト - 基本的なFrameノードを作成できる", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("details");
});

test("DetailsElement.toFigmaNode - id属性あり - 名前に反映される", () => {
  const element = DetailsElement.create({ id: "my-details" });
  const node = DetailsElement.toFigmaNode(element);

  expect(node.name).toBe("details#my-details");
});

test("DetailsElement.toFigmaNode - class属性あり - 名前に反映される", () => {
  const element = DetailsElement.create({ class: "collapsible" });
  const node = DetailsElement.toFigmaNode(element);

  expect(node.name).toBe("details.collapsible");
});

test("DetailsElement.toFigmaNode - レイアウト - 垂直レイアウト（VERTICAL）が設定される", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.toFigmaNode(element);

  expect(node.layoutMode).toBe("VERTICAL");
});

test("DetailsElement.toFigmaNode - レイアウト - 幅がFILLに設定される", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.toFigmaNode(element);

  expect(node.layoutSizingHorizontal).toBe("FILL");
});

test("DetailsElement.toFigmaNode - open=true - opacity=1が設定される", () => {
  const element = DetailsElement.create({ open: true });
  const node = DetailsElement.toFigmaNode(element);

  expect(node.opacity).toBe(1);
});

test("DetailsElement.toFigmaNode - open=false - opacity=1が設定される（折りたたみ時も表示）", () => {
  const element = DetailsElement.create({ open: false });
  const node = DetailsElement.toFigmaNode(element);

  expect(node.opacity).toBe(1);
});

test("DetailsElement.toFigmaNode - open属性なし - opacity=1が設定される", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.toFigmaNode(element);

  expect(node.opacity).toBe(1);
});

test("DetailsElement.toFigmaNode - open=''（HTML属性存在） - opacity=1が設定される", () => {
  const element = DetailsElement.create({ open: "" });
  const node = DetailsElement.toFigmaNode(element);

  expect(node.opacity).toBe(1);
});

test("DetailsElement.toFigmaNode - デフォルトスタイル - ボーダーが設定される", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.toFigmaNode(element);

  expect(node.strokes).toBeDefined();
  expect(node.strokeWeight).toBe(1);
});

test("DetailsElement.toFigmaNode - デフォルトスタイル - パディングが設定される", () => {
  const element = DetailsElement.create();
  const node = DetailsElement.toFigmaNode(element);

  expect(node.paddingTop).toBeDefined();
  expect(node.paddingBottom).toBeDefined();
  expect(node.paddingLeft).toBeDefined();
  expect(node.paddingRight).toBeDefined();
});

test("DetailsElement.toFigmaNode - カスタム背景色スタイル - 適用される", () => {
  const element = DetailsElement.create({
    style: "background-color: #f5f5f5;",
  });
  const node = DetailsElement.toFigmaNode(element);

  expect(node.fills).toBeDefined();
});
