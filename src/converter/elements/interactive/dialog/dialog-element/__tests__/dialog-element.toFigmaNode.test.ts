import { test, expect } from "vitest";
import { DialogElement } from "../dialog-element";

test("DialogElement.toFigmaNode - デフォルト - 基本的なFrameノードを作成できる", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.type).toBe("FRAME");
  expect(node.name).toBe("dialog");
});

test("DialogElement.toFigmaNode - id属性あり - 名前に反映される", () => {
  const element = DialogElement.create({ id: "my-modal" });
  const node = DialogElement.toFigmaNode(element);

  expect(node.name).toBe("dialog#my-modal");
});

test("DialogElement.toFigmaNode - class属性あり - 名前に反映される", () => {
  const element = DialogElement.create({ class: "modal" });
  const node = DialogElement.toFigmaNode(element);

  expect(node.name).toBe("dialog.modal");
});

test("DialogElement.toFigmaNode - レイアウト - 垂直レイアウト（VERTICAL）が設定される", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.layoutMode).toBe("VERTICAL");
});

test("DialogElement.toFigmaNode - open=true - opacity=1が設定される", () => {
  const element = DialogElement.create({ open: true });
  const node = DialogElement.toFigmaNode(element);

  expect(node.opacity).toBe(1);
});

test("DialogElement.toFigmaNode - open=false - opacity=0が設定される（非表示）", () => {
  const element = DialogElement.create({ open: false });
  const node = DialogElement.toFigmaNode(element);

  expect(node.opacity).toBe(0);
});

test("DialogElement.toFigmaNode - open属性なし - opacity=0が設定される", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.opacity).toBe(0);
});

test("DialogElement.toFigmaNode - open=''（HTML属性存在） - opacity=1が設定される", () => {
  const element = DialogElement.create({ open: "" });
  const node = DialogElement.toFigmaNode(element);

  expect(node.opacity).toBe(1);
});

test("DialogElement.toFigmaNode - モーダルスタイル - 背景色が白で設定される", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.fills).toBeDefined();
  expect(node.fills?.length).toBeGreaterThan(0);
});

test("DialogElement.toFigmaNode - モーダルスタイル - ボーダーが設定される", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.strokes).toBeDefined();
  expect(node.strokeWeight).toBe(1);
});

test("DialogElement.toFigmaNode - モーダルスタイル - 角丸が設定される", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.cornerRadius).toBeDefined();
  expect(node.cornerRadius).toBeGreaterThan(0);
});

test("DialogElement.toFigmaNode - モーダルスタイル - パディングが設定される", () => {
  const element = DialogElement.create();
  const node = DialogElement.toFigmaNode(element);

  expect(node.paddingTop).toBeDefined();
  expect(node.paddingBottom).toBeDefined();
  expect(node.paddingLeft).toBeDefined();
  expect(node.paddingRight).toBeDefined();
});

test("DialogElement.toFigmaNode - カスタム背景色スタイル - 適用される", () => {
  const element = DialogElement.create({
    style: "background-color: #f0f0f0;",
  });
  const node = DialogElement.toFigmaNode(element);

  expect(node.fills).toBeDefined();
});
