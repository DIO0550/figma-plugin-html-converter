import { test, expect } from "vitest";
import { LineElement } from "../line-element";

// LineElement.create
test("LineElement.create - 引数なし - デフォルト属性でline要素を作成する", () => {
  // Arrange & Act
  const element = LineElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("line");
  expect(element.attributes).toBeDefined();
});

test("LineElement.create - x1, y1, x2, y2属性を指定 - 座標が設定されたline要素を作成する", () => {
  // Arrange & Act
  const element = LineElement.create({
    x1: 10,
    y1: 20,
    x2: 100,
    y2: 80,
  });

  // Assert
  expect(element.attributes.x1).toBe(10);
  expect(element.attributes.y1).toBe(20);
  expect(element.attributes.x2).toBe(100);
  expect(element.attributes.y2).toBe(80);
});

test("LineElement.create - stroke属性を指定 - strokeが設定されたline要素を作成する", () => {
  // Arrange & Act
  const element = LineElement.create({
    x1: 0,
    y1: 0,
    x2: 100,
    y2: 100,
    stroke: "#ff0000",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#ff0000");
  expect(element.attributes["stroke-width"]).toBe(2);
});

test("LineElement.create - 文字列の座標値を指定 - 文字列のままline要素を作成する", () => {
  // Arrange & Act
  const element = LineElement.create({
    x1: "10",
    y1: "20",
    x2: "100",
    y2: "80",
  });

  // Assert
  expect(element.attributes.x1).toBe("10");
  expect(element.attributes.y1).toBe("20");
  expect(element.attributes.x2).toBe("100");
  expect(element.attributes.y2).toBe("80");
});
