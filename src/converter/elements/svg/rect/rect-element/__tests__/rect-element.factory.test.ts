import { test, expect } from "vitest";
import { RectElement } from "../rect-element";

// RectElement.create
test("RectElement.create - 引数なし - デフォルト属性でrect要素を作成する", () => {
  // Arrange & Act
  const element = RectElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("rect");
  expect(element.attributes).toBeDefined();
});

test("RectElement.create - x, y, width, height属性を指定 - 座標とサイズが設定されたrect要素を作成する", () => {
  // Arrange & Act
  const element = RectElement.create({
    x: 10,
    y: 20,
    width: 100,
    height: 50,
  });

  // Assert
  expect(element.attributes.x).toBe(10);
  expect(element.attributes.y).toBe(20);
  expect(element.attributes.width).toBe(100);
  expect(element.attributes.height).toBe(50);
});

test("RectElement.create - rx, ry属性を指定 - 角丸が設定されたrect要素を作成する", () => {
  // Arrange & Act
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    rx: 10,
    ry: 10,
  });

  // Assert
  expect(element.attributes.rx).toBe(10);
  expect(element.attributes.ry).toBe(10);
});

test("RectElement.create - fill属性を指定 - fillが設定されたrect要素を作成する", () => {
  // Arrange & Act
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    fill: "#ff0000",
  });

  // Assert
  expect(element.attributes.fill).toBe("#ff0000");
});

test("RectElement.create - stroke属性を指定 - strokeが設定されたrect要素を作成する", () => {
  // Arrange & Act
  const element = RectElement.create({
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#00ff00");
  expect(element.attributes["stroke-width"]).toBe(2);
});
