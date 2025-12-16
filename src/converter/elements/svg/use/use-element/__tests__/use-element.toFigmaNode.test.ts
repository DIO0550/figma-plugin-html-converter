import { describe, test, expect } from "vitest";
import { UseElement } from "../use-element";

describe("UseElement.toFigmaNode", () => {
  test("基本的なuse要素をGROUPノードに変換", () => {
    // Arrange
    const element = UseElement.create({ href: "#rect1" });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.type).toBe("GROUP");
    expect(config.name).toBe("use");
    expect(config.children).toEqual([]);
  });

  test("id属性がある場合、ノード名として使用", () => {
    // Arrange
    const element = UseElement.create({ id: "myUse", href: "#rect1" });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.name).toBe("myUse");
  });

  test("x, y属性がある場合、位置として適用", () => {
    // Arrange
    const element = UseElement.create({ href: "#shape", x: 100, y: 50 });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.x).toBe(100);
    expect(config.y).toBe(50);
  });

  test("x, yが文字列の場合、数値に変換", () => {
    // Arrange
    const element = UseElement.create({ href: "#shape", x: "200", y: "150" });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.x).toBe(200);
    expect(config.y).toBe(150);
  });

  test("x, yが0の場合、位置は設定されない", () => {
    // Arrange
    const element = UseElement.create({ href: "#shape", x: 0, y: 0 });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.x).toBeUndefined();
    expect(config.y).toBeUndefined();
  });

  test("opacity属性がある場合、不透明度として適用", () => {
    // Arrange
    const element = UseElement.create({ href: "#shape", opacity: 0.5 });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.opacity).toBe(0.5);
  });

  test("transform属性がある場合、位置に適用", () => {
    // Arrange
    const element = UseElement.create({
      href: "#shape",
      transform: "translate(30, 40)",
    });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.x).toBe(30);
    expect(config.y).toBe(40);
  });

  test("x, yとtransformが両方ある場合、両方を加算", () => {
    // Arrange
    const element = UseElement.create({
      href: "#shape",
      x: 10,
      y: 20,
      transform: "translate(30, 40)",
    });

    // Act
    const config = UseElement.toFigmaNode(element);

    // Assert
    expect(config.x).toBe(40); // 10 + 30
    expect(config.y).toBe(60); // 20 + 40
  });
});

describe("UseElement.getHref", () => {
  test("href属性を取得できる", () => {
    // Arrange
    const element = UseElement.create({ href: "#myRect" });

    // Act & Assert
    expect(UseElement.getHref(element)).toBe("#myRect");
  });

  test("xlink:href属性を取得できる（hrefがない場合）", () => {
    // Arrange
    const element = UseElement.create({ "xlink:href": "#myCircle" });

    // Act & Assert
    expect(UseElement.getHref(element)).toBe("#myCircle");
  });

  test("hrefとxlink:href両方ある場合、hrefを優先", () => {
    // Arrange
    const element = UseElement.create({
      href: "#primary",
      "xlink:href": "#secondary",
    });

    // Act & Assert
    expect(UseElement.getHref(element)).toBe("#primary");
  });

  test("どちらもない場合、undefinedを返す", () => {
    // Arrange
    const element = UseElement.create({});

    // Act & Assert
    expect(UseElement.getHref(element)).toBeUndefined();
  });
});

describe("UseElement.getX / getY", () => {
  test("x属性を取得できる（数値）", () => {
    // Arrange
    const element = UseElement.create({ x: 100 });

    // Act & Assert
    expect(UseElement.getX(element)).toBe(100);
  });

  test("y属性を取得できる（数値）", () => {
    // Arrange
    const element = UseElement.create({ y: 50 });

    // Act & Assert
    expect(UseElement.getY(element)).toBe(50);
  });

  test("x属性を取得できる（文字列）", () => {
    // Arrange
    const element = UseElement.create({ x: "200" });

    // Act & Assert
    expect(UseElement.getX(element)).toBe(200);
  });

  test("y属性を取得できる（文字列）", () => {
    // Arrange
    const element = UseElement.create({ y: "150" });

    // Act & Assert
    expect(UseElement.getY(element)).toBe(150);
  });

  test("x属性がない場合、0を返す", () => {
    // Arrange
    const element = UseElement.create({});

    // Act & Assert
    expect(UseElement.getX(element)).toBe(0);
  });

  test("y属性がない場合、0を返す", () => {
    // Arrange
    const element = UseElement.create({});

    // Act & Assert
    expect(UseElement.getY(element)).toBe(0);
  });
});

describe("UseElement.getWidth / getHeight", () => {
  test("width属性を取得できる（数値）", () => {
    // Arrange
    const element = UseElement.create({ width: 200 });

    // Act & Assert
    expect(UseElement.getWidth(element)).toBe(200);
  });

  test("height属性を取得できる（数値）", () => {
    // Arrange
    const element = UseElement.create({ height: 150 });

    // Act & Assert
    expect(UseElement.getHeight(element)).toBe(150);
  });

  test("width属性を取得できる（文字列）", () => {
    // Arrange
    const element = UseElement.create({ width: "300" });

    // Act & Assert
    expect(UseElement.getWidth(element)).toBe(300);
  });

  test("height属性を取得できる（文字列）", () => {
    // Arrange
    const element = UseElement.create({ height: "250" });

    // Act & Assert
    expect(UseElement.getHeight(element)).toBe(250);
  });

  test("width属性がない場合、undefinedを返す", () => {
    // Arrange
    const element = UseElement.create({});

    // Act & Assert
    expect(UseElement.getWidth(element)).toBeUndefined();
  });

  test("height属性がない場合、undefinedを返す", () => {
    // Arrange
    const element = UseElement.create({});

    // Act & Assert
    expect(UseElement.getHeight(element)).toBeUndefined();
  });
});

describe("UseElement.getId", () => {
  test("id属性を取得できる", () => {
    // Arrange
    const element = UseElement.create({ id: "use1" });

    // Act & Assert
    expect(UseElement.getId(element)).toBe("use1");
  });

  test("id属性がない場合、undefinedを返す", () => {
    // Arrange
    const element = UseElement.create({});

    // Act & Assert
    expect(UseElement.getId(element)).toBeUndefined();
  });
});
