import { test, expect } from "vitest";
import { DelConverter } from "../del-converter";
import { DelElement } from "../../del-element";

test("DelConverter - 複数のスタイルプロパティを処理する", () => {
  const element = DelElement.create({
    style: "color: red; font-size: 16px;",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config).toBeDefined();
  expect(config.type).toBe("TEXT");
});

test("DelConverter - colorスタイルを処理する", () => {
  const element = DelElement.create({
    style: "color: rgb(255, 0, 0);",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config.style.fills).toBeDefined();
  expect(config.style.fills?.[0].color.r).toBe(1);
  expect(config.style.fills?.[0].color.g).toBe(0);
  expect(config.style.fills?.[0].color.b).toBe(0);
});

test("DelConverter - font-sizeスタイルを処理する", () => {
  const element = DelElement.create({
    style: "font-size: 18px;",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config.style.fontSize).toBe(18);
});

test("DelConverter - カスタムtext-decorationで上書きを許可する", () => {
  const element = DelElement.create({
    style: "text-decoration: none;",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config.style.textDecoration).toBeUndefined();
});

test("DelConverter - デフォルトの取り消し線とカスタムスタイルを組み合わせる", () => {
  const element = DelElement.create({
    style: "color: blue; font-weight: 700;",
  });
  const config = DelConverter.toFigmaNode(element);
  expect(config.style.textDecoration).toBe("STRIKETHROUGH");
  expect(config.style.fontWeight).toBe(700);
});
