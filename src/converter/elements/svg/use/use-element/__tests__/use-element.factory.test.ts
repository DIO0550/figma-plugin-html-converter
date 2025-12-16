import { test, expect } from "vitest";
import { UseElement } from "../use-element";

// UseElement.create - ファクトリーメソッドのテスト

test("UseElement.create - デフォルト属性 - type='element', tagName='use', 空属性が設定される", () => {
  // Act
  const element = UseElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("use");
  expect(element.attributes).toEqual({});
});

test("UseElement.create - href属性を指定 - 指定したhref値が設定される", () => {
  // Arrange
  const attributes = { href: "#myRect" };

  // Act
  const element = UseElement.create(attributes);

  // Assert
  expect(element.attributes.href).toBe("#myRect");
});

test("UseElement.create - xlink:href属性を指定 - 指定したxlink:href値が設定される", () => {
  // Arrange
  const attributes = { "xlink:href": "#myCircle" };

  // Act
  const element = UseElement.create(attributes);

  // Assert
  expect(element.attributes["xlink:href"]).toBe("#myCircle");
});

test("UseElement.create - 位置属性（x, y）を指定 - 指定したx, y値が設定される", () => {
  // Arrange
  const attributes = { href: "#shape", x: 100, y: 50 };

  // Act
  const element = UseElement.create(attributes);

  // Assert
  expect(element.attributes.x).toBe(100);
  expect(element.attributes.y).toBe(50);
});

test("UseElement.create - サイズ属性（width, height）を指定 - 指定したwidth, height値が設定される", () => {
  // Arrange
  const attributes = { href: "#symbol", width: 200, height: 150 };

  // Act
  const element = UseElement.create(attributes);

  // Assert
  expect(element.attributes.width).toBe(200);
  expect(element.attributes.height).toBe(150);
});

test("UseElement.create - 全属性を指定 - 全ての属性値が正しく設定される", () => {
  // Arrange
  const attributes = {
    id: "use1",
    href: "#mySymbol",
    x: 10,
    y: 20,
    width: 100,
    height: 80,
    fill: "red",
    opacity: 0.5,
  };

  // Act
  const element = UseElement.create(attributes);

  // Assert
  expect(element.attributes).toEqual(attributes);
});
