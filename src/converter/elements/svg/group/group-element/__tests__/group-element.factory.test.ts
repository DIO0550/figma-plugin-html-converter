import { test, expect } from "vitest";
import { GroupElement } from "../group-element";

test("GroupElement.create - 引数なし - type=element, tagName=gの要素を作成する", () => {
  // Arrange & Act
  const element = GroupElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("g");
  expect(element.attributes).toBeDefined();
});

test("GroupElement.create - id, transform属性を指定 - 属性が設定された要素を作成する", () => {
  // Arrange & Act
  const element = GroupElement.create({
    id: "group1",
    transform: "translate(10, 20)",
  });

  // Assert
  expect(element.attributes.id).toBe("group1");
  expect(element.attributes.transform).toBe("translate(10, 20)");
});

test("GroupElement.create - fill属性を指定 - fill属性が設定された要素を作成する", () => {
  // Arrange & Act
  const element = GroupElement.create({
    fill: "#ff0000",
  });

  // Assert
  expect(element.attributes.fill).toBe("#ff0000");
});

test("GroupElement.create - stroke, stroke-width属性を指定 - stroke属性が設定された要素を作成する", () => {
  // Arrange & Act
  const element = GroupElement.create({
    stroke: "#00ff00",
    "stroke-width": 2,
  });

  // Assert
  expect(element.attributes.stroke).toBe("#00ff00");
  expect(element.attributes["stroke-width"]).toBe(2);
});

test("GroupElement.create - 単一の子要素を指定 - 子要素を持つ要素を作成する", () => {
  // Arrange & Act
  const element = GroupElement.create({}, [
    { type: "element", tagName: "rect", attributes: {} },
  ]);

  // Assert
  expect(element.children).toHaveLength(1);
  expect(element.children?.[0].tagName).toBe("rect");
});

test("GroupElement.create - 複数の子要素を指定 - 複数の子要素を持つ要素を作成する", () => {
  // Arrange & Act
  const element = GroupElement.create({}, [
    { type: "element", tagName: "rect", attributes: {} },
    { type: "element", tagName: "circle", attributes: {} },
  ]);

  // Assert
  expect(element.children).toHaveLength(2);
});
