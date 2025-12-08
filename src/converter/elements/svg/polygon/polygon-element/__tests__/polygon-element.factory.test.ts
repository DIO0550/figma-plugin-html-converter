import { test, expect } from "vitest";
import { PolygonElement } from "../polygon-element";

// PolygonElement.create
test("PolygonElement.create - 引数なし - デフォルト属性でpolygon要素を作成する", () => {
  // Arrange & Act
  const element = PolygonElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("polygon");
  expect(element.attributes).toBeDefined();
});

test("PolygonElement.create - points属性を指定 - pointsが設定されたpolygon要素を作成する", () => {
  // Arrange & Act
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
  });

  // Assert
  expect(element.attributes.points).toBe("100,10 40,198 190,78");
});

test("PolygonElement.create - fill属性を指定 - fillが設定されたpolygon要素を作成する", () => {
  // Arrange & Act
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
    fill: "#ff0000",
  });

  // Assert
  expect(element.attributes.fill).toBe("#ff0000");
});

test("PolygonElement.create - stroke属性を指定 - strokeが設定されたpolygon要素を作成する", () => {
  // Arrange & Act
  const element = PolygonElement.create({
    points: "100,10 40,198 190,78",
    stroke: "#0000ff",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#0000ff");
  expect(element.attributes["stroke-width"]).toBe(2);
});
