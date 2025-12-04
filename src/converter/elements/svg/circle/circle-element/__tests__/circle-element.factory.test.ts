import { test, expect } from "vitest";
import { CircleElement } from "../circle-element";

// CircleElement.create
test("CircleElement.create - 引数なし - デフォルト属性でcircle要素を作成する", () => {
  // Arrange & Act
  const element = CircleElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("circle");
  expect(element.attributes).toBeDefined();
});

test("CircleElement.create - cx, cy, r属性を指定 - 座標と半径が設定されたcircle要素を作成する", () => {
  // Arrange & Act
  const element = CircleElement.create({
    cx: 50,
    cy: 50,
    r: 25,
  });

  // Assert
  expect(element.attributes.cx).toBe(50);
  expect(element.attributes.cy).toBe(50);
  expect(element.attributes.r).toBe(25);
});

test("CircleElement.create - fill属性を指定 - fillが設定されたcircle要素を作成する", () => {
  // Arrange & Act
  const element = CircleElement.create({
    cx: 100,
    cy: 100,
    r: 50,
    fill: "#ff0000",
  });

  // Assert
  expect(element.attributes.fill).toBe("#ff0000");
});

test("CircleElement.create - stroke属性を指定 - strokeが設定されたcircle要素を作成する", () => {
  // Arrange & Act
  const element = CircleElement.create({
    cx: 100,
    cy: 100,
    r: 50,
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#00ff00");
  expect(element.attributes["stroke-width"]).toBe(2);
});

test("CircleElement.create - 文字列の座標値を指定 - 文字列のままcircle要素を作成する", () => {
  // Arrange & Act
  const element = CircleElement.create({
    cx: "100",
    cy: "100",
    r: "50",
  });

  // Assert
  expect(element.attributes.cx).toBe("100");
  expect(element.attributes.cy).toBe("100");
  expect(element.attributes.r).toBe("50");
});
