import { test, expect } from "vitest";
import { applyTextStyles } from "./text-style-applier";
import type { TextStyle } from "../../../models/figma-node";

const createBaseStyle = (): TextStyle => ({
  fontFamily: "Inter",
  fontSize: 16,
  fontWeight: 400,
  lineHeight: {
    unit: "PIXELS",
    value: 24,
  },
  letterSpacing: 0,
  textAlign: "LEFT",
  verticalAlign: "TOP",
});

test("applyTextStyles() - font-sizeをスタイルから適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "font-size": "18px" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontSize).toBe(18);
});

test("applyTextStyles() - font-sizeが指定されていない場合は元のfontSizeを保持する", () => {
  const baseStyle = createBaseStyle();
  const styles = {};

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontSize).toBe(16);
});

test("applyTextStyles() - font-weightをスタイルから適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "font-weight": "700" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontWeight).toBe(700);
});

test("applyTextStyles() - font-weightが指定されていない場合は元のfontWeightを保持する", () => {
  const baseStyle = createBaseStyle();
  const styles = {};

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontWeight).toBe(400);
});

test("applyTextStyles() - font-style italicをスタイルから適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "font-style": "italic" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontStyle).toBe("italic");
});

test("applyTextStyles() - font-styleが指定されていない場合はfontStyleを変更しない", () => {
  const baseStyle = createBaseStyle();
  const styles = {};

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontStyle).toBeUndefined();
});

test("applyTextStyles() - font-familyをスタイルから適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "font-family": "Arial" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontFamily).toBe("Arial");
});

test("applyTextStyles() - font-familyが指定されていない場合は元のfontFamilyを保持する", () => {
  const baseStyle = createBaseStyle();
  const styles = {};

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontFamily).toBe("Inter");
});

test("applyTextStyles() - RGBスタイルからcolorを適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { color: "rgb(255, 0, 0)" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fills).toBeDefined();
  expect(result.fills?.[0].color.r).toBe(1);
  expect(result.fills?.[0].color.g).toBe(0);
  expect(result.fills?.[0].color.b).toBe(0);
});

test("applyTextStyles() - HEXスタイルからcolorを適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { color: "#0000FF" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fills).toBeDefined();
  expect(result.fills?.[0].color.r).toBe(0);
  expect(result.fills?.[0].color.g).toBe(0);
  expect(result.fills?.[0].color.b).toBe(1);
});

test("applyTextStyles() - colorが指定されていない場合はfillsを変更しない", () => {
  const baseStyle = createBaseStyle();
  const styles = {};

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fills).toBeUndefined();
});

test("applyTextStyles() - underline text-decorationを適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "text-decoration": "underline" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.textDecoration).toBe("UNDERLINE");
});

test("applyTextStyles() - line-through text-decorationを適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "text-decoration": "line-through" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.textDecoration).toBe("STRIKETHROUGH");
});

test("applyTextStyles() - noneに設定するとtext-decorationを削除する", () => {
  const baseStyle: TextStyle = {
    ...createBaseStyle(),
    textDecoration: "UNDERLINE",
  };
  const styles = { "text-decoration": "none" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.textDecoration).toBeUndefined();
});

test("applyTextStyles() - text-decorationが指定されていない場合はtextDecorationを変更しない", () => {
  const baseStyle = createBaseStyle();
  const styles = {};

  const result = applyTextStyles(baseStyle, styles);

  expect(result.textDecoration).toBeUndefined();
});

test("applyTextStyles() - 複数のスタイルプロパティを適用する", () => {
  const baseStyle = createBaseStyle();
  const styles = {
    "font-size": "20px",
    "font-weight": "600",
    color: "rgb(0, 255, 0)",
    "text-decoration": "underline",
  };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontSize).toBe(20);
  expect(result.fontWeight).toBe(600);
  expect(result.fills?.[0].color.g).toBe(1);
  expect(result.textDecoration).toBe("UNDERLINE");
});

test("applyTextStyles() - スタイルにない基本スタイルプロパティを保持する", () => {
  const baseStyle = createBaseStyle();
  const styles = { "font-size": "18px" };

  const result = applyTextStyles(baseStyle, styles);

  expect(result.fontFamily).toBe("Inter");
  expect(result.fontWeight).toBe(400);
  expect(result.lineHeight).toEqual({
    unit: "PIXELS",
    value: 24,
  });
});
