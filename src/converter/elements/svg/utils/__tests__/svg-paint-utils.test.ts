import { test, expect } from "vitest";
import { SvgPaintUtils } from "../svg-paint-utils";
import type { SvgBaseAttributes } from "../../svg-attributes";

// SvgPaintUtils.parseFillToPaint
test("SvgPaintUtils.parseFillToPaint - 16進数カラー - SolidPaintを生成する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "#ff0000" };

  // Act
  const paint = SvgPaintUtils.parseFillToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.type).toBe("SOLID");
  if (paint?.type === "SOLID") {
    expect(paint.color.r).toBe(1);
    expect(paint.color.g).toBe(0);
    expect(paint.color.b).toBe(0);
  }
});

test("SvgPaintUtils.parseFillToPaint - 名前付きカラー - SolidPaintを生成する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "blue" };

  // Act
  const paint = SvgPaintUtils.parseFillToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.type).toBe("SOLID");
  if (paint?.type === "SOLID") {
    expect(paint.color.r).toBe(0);
    expect(paint.color.g).toBe(0);
    expect(paint.color.b).toBe(1);
  }
});

test("SvgPaintUtils.parseFillToPaint - fill属性が'none' - nullを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "none" };

  // Act
  const paint = SvgPaintUtils.parseFillToPaint(attributes);

  // Assert
  expect(paint).toBeNull();
});

test("SvgPaintUtils.parseFillToPaint - fill属性がない - デフォルトで黒のPaintを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const paint = SvgPaintUtils.parseFillToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.type).toBe("SOLID");
  if (paint?.type === "SOLID") {
    expect(paint.color.r).toBe(0);
    expect(paint.color.g).toBe(0);
    expect(paint.color.b).toBe(0);
  }
});

test("SvgPaintUtils.parseFillToPaint - fill-opacityが設定されている - opacityを適用する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {
    fill: "#ff0000",
    "fill-opacity": "0.5",
  };

  // Act
  const paint = SvgPaintUtils.parseFillToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.opacity).toBe(0.5);
});

test("SvgPaintUtils.parseFillToPaint - rgb()形式のカラー - パースしてSolidPaintを生成する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "rgb(255, 128, 0)" };

  // Act
  const paint = SvgPaintUtils.parseFillToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.type).toBe("SOLID");
  if (paint?.type === "SOLID") {
    expect(paint.color.r).toBeCloseTo(1, 2);
    expect(paint.color.g).toBeCloseTo(0.502, 2);
    expect(paint.color.b).toBe(0);
  }
});

// SvgPaintUtils.parseStrokeToPaint
test("SvgPaintUtils.parseStrokeToPaint - 16進数カラー - SolidPaintを生成する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { stroke: "#00ff00" };

  // Act
  const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.type).toBe("SOLID");
  if (paint?.type === "SOLID") {
    expect(paint.color.r).toBe(0);
    expect(paint.color.g).toBe(1);
    expect(paint.color.b).toBe(0);
  }
});

test("SvgPaintUtils.parseStrokeToPaint - stroke属性が'none' - nullを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { stroke: "none" };

  // Act
  const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

  // Assert
  expect(paint).toBeNull();
});

test("SvgPaintUtils.parseStrokeToPaint - stroke属性がない - nullを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

  // Assert
  expect(paint).toBeNull();
});

test("SvgPaintUtils.parseStrokeToPaint - stroke-opacityが設定されている - opacityを適用する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {
    stroke: "#0000ff",
    "stroke-opacity": "0.7",
  };

  // Act
  const paint = SvgPaintUtils.parseStrokeToPaint(attributes);

  // Assert
  expect(paint).not.toBeNull();
  expect(paint?.opacity).toBe(0.7);
});

// SvgPaintUtils.getStrokeWeight
test("SvgPaintUtils.getStrokeWeight - stroke-widthが設定されている - 値を取得する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-width": "2" };

  // Act
  const weight = SvgPaintUtils.getStrokeWeight(attributes);

  // Assert
  expect(weight).toBe(2);
});

test("SvgPaintUtils.getStrokeWeight - stroke-widthがない - デフォルト値1を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const weight = SvgPaintUtils.getStrokeWeight(attributes);

  // Assert
  expect(weight).toBe(1);
});

test("SvgPaintUtils.getStrokeWeight - stroke-widthが0 - 0を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-width": "0" };

  // Act
  const weight = SvgPaintUtils.getStrokeWeight(attributes);

  // Assert
  expect(weight).toBe(0);
});

// SvgPaintUtils.createFills
test("SvgPaintUtils.createFills - fill属性が設定されている - Paint配列を生成する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "#ff0000" };

  // Act
  const fills = SvgPaintUtils.createFills(attributes);

  // Assert
  expect(fills.length).toBe(1);
  expect(fills[0].type).toBe("SOLID");
});

test("SvgPaintUtils.createFills - fill属性が'none' - 空配列を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "none" };

  // Act
  const fills = SvgPaintUtils.createFills(attributes);

  // Assert
  expect(fills.length).toBe(0);
});

// SvgPaintUtils.createStrokes
test("SvgPaintUtils.createStrokes - stroke属性が設定されている - Paint配列を生成する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { stroke: "#00ff00" };

  // Act
  const strokes = SvgPaintUtils.createStrokes(attributes);

  // Assert
  expect(strokes.length).toBe(1);
  expect(strokes[0].type).toBe("SOLID");
});

test("SvgPaintUtils.createStrokes - stroke属性がない - 空配列を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const strokes = SvgPaintUtils.createStrokes(attributes);

  // Assert
  expect(strokes.length).toBe(0);
});
