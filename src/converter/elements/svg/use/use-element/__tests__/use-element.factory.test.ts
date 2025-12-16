import { describe, test, expect } from "vitest";
import { UseElement } from "../use-element";

describe("UseElement.create", () => {
  test("デフォルト属性でuse要素を作成できる", () => {
    // Act
    const element = UseElement.create();

    // Assert
    expect(element.type).toBe("element");
    expect(element.tagName).toBe("use");
    expect(element.attributes).toEqual({});
  });

  test("href属性を指定してuse要素を作成できる", () => {
    // Arrange
    const attributes = { href: "#myRect" };

    // Act
    const element = UseElement.create(attributes);

    // Assert
    expect(element.attributes.href).toBe("#myRect");
  });

  test("xlink:href属性を指定してuse要素を作成できる", () => {
    // Arrange
    const attributes = { "xlink:href": "#myCircle" };

    // Act
    const element = UseElement.create(attributes);

    // Assert
    expect(element.attributes["xlink:href"]).toBe("#myCircle");
  });

  test("位置属性（x, y）を指定してuse要素を作成できる", () => {
    // Arrange
    const attributes = { href: "#shape", x: 100, y: 50 };

    // Act
    const element = UseElement.create(attributes);

    // Assert
    expect(element.attributes.x).toBe(100);
    expect(element.attributes.y).toBe(50);
  });

  test("サイズ属性（width, height）を指定してuse要素を作成できる", () => {
    // Arrange
    const attributes = { href: "#symbol", width: 200, height: 150 };

    // Act
    const element = UseElement.create(attributes);

    // Assert
    expect(element.attributes.width).toBe(200);
    expect(element.attributes.height).toBe(150);
  });

  test("全ての属性を指定してuse要素を作成できる", () => {
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
});
