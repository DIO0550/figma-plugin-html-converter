import { test, expect } from "vitest";
import { SubConverter } from "../sub-converter";
import { SubElement } from "../../sub-element";

test("SubConverter.toFigmaNode() - スタイル属性でカラーを適用する", () => {
  const element = SubElement.create({
    style: "color: rgb(255, 0, 0);",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fills).toBeDefined();
  expect(config.style.fills).toHaveLength(1);
});

test("SubConverter.toFigmaNode() - スタイル属性でフォントサイズを上書きする", () => {
  const element = SubElement.create({
    style: "font-size: 10px;",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(10);
});

test("SubConverter.toFigmaNode() - スタイル属性でフォントファミリーを適用する", () => {
  const element = SubElement.create({
    style: "font-family: Arial;",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fontFamily).toBe("Arial");
});

test("SubConverter.toFigmaNode() - スタイル属性でフォントウェイトを適用する", () => {
  const element = SubElement.create({
    style: "font-weight: 700;",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fontWeight).toBe(700);
});

test("SubConverter.toFigmaNode() - 複数のスタイル属性を適用する", () => {
  const element = SubElement.create({
    style: "color: blue; font-size: 14px; font-weight: bold;",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(14);
  expect(config.style.fontWeight).toBeGreaterThanOrEqual(700);
});

test("SubConverter.toFigmaNode() - 不正なスタイル属性を処理する", () => {
  const element = SubElement.create({
    style: "invalid-property: value;",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("SubConverter.toFigmaNode() - 空のスタイル属性を処理する", () => {
  const element = SubElement.create({
    style: "",
  });
  const config = SubConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(12);
});
