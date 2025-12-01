import { test, expect } from "vitest";
import { SvgAttributes, type SvgBaseAttributes } from "../svg-attributes";

// SvgAttributes.getFill
test("SvgAttributes.getFill - fill属性が設定されている - 属性値を取得する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "#ff0000" };

  // Act
  const result = SvgAttributes.getFill(attributes);

  // Assert
  expect(result).toBe("#ff0000");
});

test("SvgAttributes.getFill - fill属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getFill(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.getStroke
test("SvgAttributes.getStroke - stroke属性が設定されている - 属性値を取得する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { stroke: "blue" };

  // Act
  const result = SvgAttributes.getStroke(attributes);

  // Assert
  expect(result).toBe("blue");
});

test("SvgAttributes.getStroke - stroke属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getStroke(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.getStrokeWidth
test("SvgAttributes.getStrokeWidth - stroke-width属性が文字列 - 数値に変換して返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-width": "2" };

  // Act
  const result = SvgAttributes.getStrokeWidth(attributes);

  // Assert
  expect(result).toBe(2);
});

test("SvgAttributes.getStrokeWidth - stroke-width属性が数値 - そのまま返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-width": 3 };

  // Act
  const result = SvgAttributes.getStrokeWidth(attributes);

  // Assert
  expect(result).toBe(3);
});

test("SvgAttributes.getStrokeWidth - stroke-width属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getStrokeWidth(attributes);

  // Assert
  expect(result).toBeUndefined();
});

test("SvgAttributes.getStrokeWidth - stroke-width属性が無効な値 - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-width": "invalid" };

  // Act
  const result = SvgAttributes.getStrokeWidth(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.getOpacity
test("SvgAttributes.getOpacity - opacity属性が文字列 - 0-1の数値に変換して返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { opacity: "0.5" };

  // Act
  const result = SvgAttributes.getOpacity(attributes);

  // Assert
  expect(result).toBe(0.5);
});

test("SvgAttributes.getOpacity - opacity属性が数値 - そのまま返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { opacity: 0.7 };

  // Act
  const result = SvgAttributes.getOpacity(attributes);

  // Assert
  expect(result).toBe(0.7);
});

test("SvgAttributes.getOpacity - opacity属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getOpacity(attributes);

  // Assert
  expect(result).toBeUndefined();
});

test("SvgAttributes.getOpacity - opacity属性が1より大きい - 1に制限する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { opacity: 1.5 };

  // Act
  const result = SvgAttributes.getOpacity(attributes);

  // Assert
  expect(result).toBe(1);
});

test("SvgAttributes.getOpacity - opacity属性が0より小さい - 0に制限する", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { opacity: -0.5 };

  // Act
  const result = SvgAttributes.getOpacity(attributes);

  // Assert
  expect(result).toBe(0);
});

// SvgAttributes.getFillOpacity
test("SvgAttributes.getFillOpacity - fill-opacity属性が設定されている - 0-1の数値を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "fill-opacity": "0.8" };

  // Act
  const result = SvgAttributes.getFillOpacity(attributes);

  // Assert
  expect(result).toBe(0.8);
});

test("SvgAttributes.getFillOpacity - fill-opacity属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getFillOpacity(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.getStrokeOpacity
test("SvgAttributes.getStrokeOpacity - stroke-opacity属性が設定されている - 0-1の数値を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-opacity": "0.6" };

  // Act
  const result = SvgAttributes.getStrokeOpacity(attributes);

  // Assert
  expect(result).toBe(0.6);
});

test("SvgAttributes.getStrokeOpacity - stroke-opacity属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getStrokeOpacity(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.isFillNone
test("SvgAttributes.isFillNone - fill属性が'none' - trueを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "none" };

  // Act
  const result = SvgAttributes.isFillNone(attributes);

  // Assert
  expect(result).toBe(true);
});

test("SvgAttributes.isFillNone - fill属性が他の値 - falseを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { fill: "red" };

  // Act
  const result = SvgAttributes.isFillNone(attributes);

  // Assert
  expect(result).toBe(false);
});

test("SvgAttributes.isFillNone - fill属性がundefined - falseを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.isFillNone(attributes);

  // Assert
  expect(result).toBe(false);
});

// SvgAttributes.isStrokeNone
test("SvgAttributes.isStrokeNone - stroke属性が'none' - trueを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { stroke: "none" };

  // Act
  const result = SvgAttributes.isStrokeNone(attributes);

  // Assert
  expect(result).toBe(true);
});

test("SvgAttributes.isStrokeNone - stroke属性が他の値 - falseを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { stroke: "blue" };

  // Act
  const result = SvgAttributes.isStrokeNone(attributes);

  // Assert
  expect(result).toBe(false);
});

// SvgAttributes.getStrokeLinecap
test("SvgAttributes.getStrokeLinecap - stroke-linecap属性が設定されている - 属性値を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-linecap": "round" };

  // Act
  const result = SvgAttributes.getStrokeLinecap(attributes);

  // Assert
  expect(result).toBe("round");
});

test("SvgAttributes.getStrokeLinecap - stroke-linecap属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getStrokeLinecap(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.getStrokeLinejoin
test("SvgAttributes.getStrokeLinejoin - stroke-linejoin属性が設定されている - 属性値を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = { "stroke-linejoin": "bevel" };

  // Act
  const result = SvgAttributes.getStrokeLinejoin(attributes);

  // Assert
  expect(result).toBe("bevel");
});

test("SvgAttributes.getStrokeLinejoin - stroke-linejoin属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getStrokeLinejoin(attributes);

  // Assert
  expect(result).toBeUndefined();
});

// SvgAttributes.getTransform
test("SvgAttributes.getTransform - transform属性が設定されている - 属性値を返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {
    transform: "translate(10, 20)",
  };

  // Act
  const result = SvgAttributes.getTransform(attributes);

  // Assert
  expect(result).toBe("translate(10, 20)");
});

test("SvgAttributes.getTransform - transform属性がない - undefinedを返す", () => {
  // Arrange
  const attributes: SvgBaseAttributes = {};

  // Act
  const result = SvgAttributes.getTransform(attributes);

  // Assert
  expect(result).toBeUndefined();
});
