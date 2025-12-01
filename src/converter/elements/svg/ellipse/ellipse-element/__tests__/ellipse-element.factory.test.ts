import { test, expect } from "vitest";
import { EllipseElement } from "../ellipse-element";

// EllipseElement.create
test("EllipseElement.create - 引数なし - デフォルト属性でellipse要素を作成する", () => {
  // Arrange & Act
  const element = EllipseElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("ellipse");
  expect(element.attributes).toBeDefined();
});

test("EllipseElement.create - cx, cy, rx, ry属性を指定 - 座標と半径が設定されたellipse要素を作成する", () => {
  // Arrange & Act
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
  });

  // Assert
  expect(element.attributes.cx).toBe(100);
  expect(element.attributes.cy).toBe(50);
  expect(element.attributes.rx).toBe(80);
  expect(element.attributes.ry).toBe(40);
});

test("EllipseElement.create - fill属性を指定 - fillが設定されたellipse要素を作成する", () => {
  // Arrange & Act
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
    fill: "#ff0000",
  });

  // Assert
  expect(element.attributes.fill).toBe("#ff0000");
});

test("EllipseElement.create - stroke属性を指定 - strokeが設定されたellipse要素を作成する", () => {
  // Arrange & Act
  const element = EllipseElement.create({
    cx: 100,
    cy: 50,
    rx: 80,
    ry: 40,
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#00ff00");
  expect(element.attributes["stroke-width"]).toBe(2);
});

test("EllipseElement.create - 文字列の座標値を指定 - 文字列のままellipse要素を作成する", () => {
  // Arrange & Act
  const element = EllipseElement.create({
    cx: "100",
    cy: "50",
    rx: "80",
    ry: "40",
  });

  // Assert
  expect(element.attributes.cx).toBe("100");
  expect(element.attributes.cy).toBe("50");
  expect(element.attributes.rx).toBe("80");
  expect(element.attributes.ry).toBe("40");
});
