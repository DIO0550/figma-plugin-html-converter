import { test, expect } from "vitest";
import { SupConverter } from "../sup-converter";
import { SupElement } from "../../sup-element";

test("SupConverter - 複数のスタイルプロパティを処理する", () => {
  const element = SupElement.create({
    style: "color: red; font-size: 16px;",
  });
  const config = SupConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("SupConverter - colorスタイルを処理する", () => {
  const element = SupElement.create({
    style: "color: rgb(255, 0, 0);",
  });
  const config = SupConverter.toFigmaNode(element);
  expect(config.style.fills).toBeDefined();
  expect(config.style.fills?.[0].color.r).toBe(1);
  expect(config.style.fills?.[0].color.g).toBe(0);
  expect(config.style.fills?.[0].color.b).toBe(0);
});

test("SupConverter - font-sizeスタイルでデフォルトを上書きする", () => {
  const element = SupElement.create({
    style: "font-size: 18px;",
  });
  const config = SupConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(18);
});

test("SupConverter - デフォルトフォントサイズとカスタムスタイルを組み合わせる", () => {
  const element = SupElement.create({
    style: "color: blue; font-weight: 700;",
  });
  const config = SupConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(12); // デフォルト75%縮小
  expect(config.style.fontWeight).toBe(700);
});

test("SupConverter - font-weightスタイルを処理する", () => {
  const element = SupElement.create({
    style: "font-weight: 600;",
  });
  const config = SupConverter.toFigmaNode(element);
  expect(config.style.fontWeight).toBe(600);
  expect(config.style.fontSize).toBe(12); // デフォルトは保持
});
