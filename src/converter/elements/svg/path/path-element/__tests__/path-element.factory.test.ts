import { test, expect } from "vitest";
import { PathElement } from "../path-element";

test("PathElement.create - 引数なし - type='element'、tagName='path'、attributes={}のPathElementを返す", () => {
  // Act
  const element = PathElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("path");
  expect(element.attributes).toEqual({});
});

test("PathElement.create - d属性を指定 - パスデータが設定されたPathElementを返す", () => {
  // Arrange
  const pathData = "M0 0 L100 100";

  // Act
  const element = PathElement.create({ d: pathData });

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("path");
  expect(element.attributes.d).toBe("M0 0 L100 100");
});

test("PathElement.create - fill属性を指定 - fillが設定されたPathElementを返す", () => {
  // Arrange
  const attributes = {
    d: "M0 0 L100 100",
    fill: "#ff0000",
  };

  // Act
  const element = PathElement.create(attributes);

  // Assert
  expect(element.attributes.fill).toBe("#ff0000");
});

test("PathElement.create - stroke属性を指定 - strokeとstroke-widthが設定されたPathElementを返す", () => {
  // Arrange
  const attributes = {
    d: "M0 0 L100 100",
    stroke: "#00ff00",
    "stroke-width": 2,
  };

  // Act
  const element = PathElement.create(attributes);

  // Assert
  expect(element.attributes.stroke).toBe("#00ff00");
  expect(element.attributes["stroke-width"]).toBe(2);
});

test("PathElement.create - 複雑なパスデータと全スタイル属性を指定 - 全ての属性が保持されたPathElementを返す", () => {
  // Arrange
  const pathData = "M10 10 C20 20 40 20 50 10 S80 0 90 10";
  const attributes = {
    d: pathData,
    fill: "none",
    stroke: "#000000",
  };

  // Act
  const element = PathElement.create(attributes);

  // Assert
  expect(element.attributes.d).toBe(pathData);
  expect(element.attributes.fill).toBe("none");
  expect(element.attributes.stroke).toBe("#000000");
});
