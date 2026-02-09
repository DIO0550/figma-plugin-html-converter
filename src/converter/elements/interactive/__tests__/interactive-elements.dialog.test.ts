import { test, expect } from "vitest";
import { DialogElement, DialogAttributes } from "../dialog";

test("dialog表示制御 - open=trueのdialog要素は表示される", () => {
  const dialog = DialogElement.create({ open: true });
  const node = DialogElement.toFigmaNode(dialog);

  expect(node.opacity).toBe(1);
  expect(DialogAttributes.isOpen(dialog.attributes)).toBe(true);
});

test("dialog表示制御 - open=falseのdialog要素は非表示になる", () => {
  const dialog = DialogElement.create({ open: false });
  const node = DialogElement.toFigmaNode(dialog);

  expect(node.opacity).toBe(0);
  expect(DialogAttributes.isOpen(dialog.attributes)).toBe(false);
});

test("dialog表示制御 - open属性なしのdialog要素は非表示になる", () => {
  const dialog = DialogElement.create();
  const node = DialogElement.toFigmaNode(dialog);

  expect(node.opacity).toBe(0);
  expect(DialogAttributes.isOpen(dialog.attributes)).toBe(false);
});

test("dialog表示制御 - dialog要素はモーダルスタイルを持つ", () => {
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
