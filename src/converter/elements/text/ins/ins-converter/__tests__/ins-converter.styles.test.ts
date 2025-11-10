import { test, expect } from "vitest";
import { InsConverter } from "../ins-converter";
import { InsElement } from "../../ins-element";

test("InsConverter - 複数のスタイルプロパティを処理する", () => {
  const element = InsElement.create({
    style: "color: red; font-size: 16px;",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("InsConverter - colorスタイルを処理する", () => {
  const element = InsElement.create({
    style: "color: rgb(255, 0, 0);",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config.style.fills).toBeDefined();
  expect(config.style.fills?.[0].color.r).toBe(1);
  expect(config.style.fills?.[0].color.g).toBe(0);
  expect(config.style.fills?.[0].color.b).toBe(0);
});

test("InsConverter - font-sizeスタイルを処理する", () => {
  const element = InsElement.create({
    style: "font-size: 18px;",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(18);
});

test("InsConverter - カスタムtext-decorationで上書きを許可する", () => {
  const element = InsElement.create({
    style: "text-decoration: none;",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config.style.textDecoration).toBeUndefined();
});

test("InsConverter - デフォルトの下線とカスタムスタイルを組み合わせる", () => {
  const element = InsElement.create({
    style: "color: blue; font-weight: 700;",
  });
  const config = InsConverter.toFigmaNode(element);
  expect(config.style.textDecoration).toBe("UNDERLINE");
  expect(config.style.fontWeight).toBe(700);
});
