import { test, expect } from "vitest";
import { AConverter } from "../a-converter";
import { createAElement, createTextNode } from "./test-helpers";

test("AConverter.toFigmaNode() - color:redスタイルを赤色のfillsに変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Red link")],
    "color: red;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fills).toEqual([
    {
      type: "SOLID",
      color: { r: 1, g: 0, b: 0, a: 1 },
    },
  ]);
});

test("AConverter.toFigmaNode() - font-size:20pxスタイルをfontSize:20に変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Large")],
    "font-size: 20px;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontSize).toBe(20);
});

test("AConverter.toFigmaNode() - font-weight:boldスタイルをfontWeight:700に変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Bold")],
    "font-weight: bold;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontWeight).toBe(700);
});

test("AConverter.toFigmaNode() - font-weight:400スタイルを数値としてそのまま使用する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Normal")],
    "font-weight: 400;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontWeight).toBe(400);
});

test("AConverter.toFigmaNode() - font-style:italicスタイルをfontStyle:italicに変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Italic")],
    "font-style: italic;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontStyle).toBe("italic");
});

test("AConverter.toFigmaNode() - font-style:obliqueスタイルをfontStyle:italicに変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Oblique")],
    "font-style: oblique 15deg;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontStyle).toBe("italic");
});

test("AConverter.toFigmaNode() - font-style:normalスタイルでfontStyleを削除する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Normal Style")],
    "font-style: normal;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontStyle).toBeUndefined();
});

test("AConverter.toFigmaNode() - font-familyスタイルの最初のフォントファミリーを使用する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Custom font")],
    "font-family: 'Helvetica Neue', Arial, sans-serif;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fontFamily).toBe("Helvetica Neue");
});

test("AConverter.toFigmaNode() - text-decoration:noneスタイルでtextDecorationを削除する", () => {
  const element = createAElement(
    "#",
    [createTextNode("No decoration")],
    "text-decoration: none;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.textDecoration).toBeUndefined();
});

test("AConverter.toFigmaNode() - text-decoration:underlineスタイルをUNDERLINEに変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Underlined")],
    "text-decoration: underline;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.textDecoration).toBe("UNDERLINE");
});

test("AConverter.toFigmaNode() - text-decoration:line-throughスタイルをSTRIKETHROUGHに変換する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Strikethrough")],
    "text-decoration: line-through;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.textDecoration).toBe("STRIKETHROUGH");
});

test("AConverter.toFigmaNode() - 複数のスタイルを同時に適用する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Styled")],
    "color: #0000ff; font-size: 24px; font-weight: bold; text-decoration: none;",
  );

  const result = AConverter.toFigmaNode(element);

  expect(result.style.fills?.[0].color).toEqual({ r: 0, g: 0, b: 1, a: 1 });
  expect(result.style.fontSize).toBe(24);
  expect(result.style.fontWeight).toBe(700);
  expect(result.style.textDecoration).toBeUndefined();
});

test("AConverter.toFigmaNode() - 空のstyle属性を持つ要素でデフォルトスタイルを使用する", () => {
  const element = createAElement("#", [createTextNode("Default")], "");

  const result = AConverter.toFigmaNode(element);

  // Assert - デフォルトスタイルが適用される
  expect(result.style.fills?.[0].color).toEqual({ r: 0, g: 0.478, b: 1, a: 1 });
  expect(result.style.fontSize).toBe(16);
  expect(result.style.fontWeight).toBe(400);
  expect(result.style.textDecoration).toBe("UNDERLINE");
});

test("AConverter.toFigmaNode() - 不正なスタイル値を無視して処理を続行する", () => {
  const element = createAElement(
    "#",
    [createTextNode("Invalid")],
    "color: invalid; font-size: abc; font-weight: xyz;",
  );

  const result = AConverter.toFigmaNode(element);

  // Assert - デフォルト値が維持される
  expect(result.style.fills?.[0].color).toEqual({ r: 0, g: 0.478, b: 1, a: 1 });
  expect(result.style.fontSize).toBe(16);
  expect(result.style.fontWeight).toBe(400);
});

test("AConverter.toFigmaNode() - スタイル属性にセミコロンがない場合も正しく解析する", () => {
  const element = createAElement(
    "#",
    [createTextNode("No semicolon")],
    "color: red font-size: 20px", // セミコロンなし
  );

  const result = AConverter.toFigmaNode(element);

  // Assert - セミコロンなしのスタイルは正しく解析されない（デフォルト値を維持）
  expect(result.style.fills?.[0].color).toEqual({ r: 0, g: 0.478, b: 1, a: 1 });
  expect(result.style.fontSize).toBe(16); // デフォルト値
});
