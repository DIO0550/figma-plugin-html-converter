import { test, expect } from "vitest";
import { PolylineElement } from "../polyline-element";

// PolylineElement.create
test("PolylineElement.create - 引数なし - デフォルト属性でpolyline要素を作成する", () => {
  // Arrange & Act
  const element = PolylineElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("polyline");
  expect(element.attributes).toBeDefined();
});

test("PolylineElement.create - points属性を指定 - pointsが設定されたpolyline要素を作成する", () => {
  // Arrange & Act
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
  });

  // Assert
  expect(element.attributes.points).toBe("0,40 40,40 40,80 80,80");
});

test("PolylineElement.create - fill属性を指定 - fillが設定されたpolyline要素を作成する", () => {
  // Arrange & Act
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
    fill: "none",
  });

  // Assert
  expect(element.attributes.fill).toBe("none");
});

test("PolylineElement.create - stroke属性を指定 - strokeが設定されたpolyline要素を作成する", () => {
  // Arrange & Act
  const element = PolylineElement.create({
    points: "0,40 40,40 40,80 80,80",
    stroke: "#0000ff",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#0000ff");
  expect(element.attributes["stroke-width"]).toBe(2);
});
