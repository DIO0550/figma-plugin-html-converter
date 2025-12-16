import { test, expect } from "vitest";
import { UseElement } from "../use-element";

// UseElement.toFigmaNode - Figmaノード変換のテスト

test("UseElement.toFigmaNode - 基本的なuse要素 - type='GROUP', name='use', 空の子要素配列が設定される", () => {
  // Arrange
  const element = UseElement.create({ href: "#rect1" });

  // Act
  const config = UseElement.toFigmaNode(element);

  // Assert
  expect(config.type).toBe("GROUP");
  expect(config.name).toBe("use");
  expect(config.children).toEqual([]);
});

test("UseElement.toFigmaNode - id属性あり - ノード名としてid値が使用される", () => {
  // Arrange
  const element = UseElement.create({ id: "myUse", href: "#rect1" });

  // Act
  const config = UseElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("myUse");
});

test("UseElement.toFigmaNode - x, y属性あり - 位置として適用される", () => {
  // Arrange
  const element = UseElement.create({ href: "#shape", x: 100, y: 50 });

  // Act
  const config = UseElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(100);
  expect(config.y).toBe(50);
});

test("UseElement.toFigmaNode - x, yが文字列 - 数値に変換される", () => {
  // Arrange
  const element = UseElement.create({ href: "#shape", x: "200", y: "150" });

  // Act
  const config = UseElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBe(200);
  expect(config.y).toBe(150);
});

test("UseElement.toFigmaNode - x, yが0 - 位置は設定されない", () => {
  // Arrange
  const element = UseElement.create({ href: "#shape", x: 0, y: 0 });

  // Act
  const config = UseElement.toFigmaNode(element);

  // Assert
  expect(config.x).toBeUndefined();
  expect(config.y).toBeUndefined();
});

test("UseElement.toFigmaNode - opacity属性あり - 不透明度として適用される", () => {
  // Arrange
  const element = UseElement.create({ href: "#shape", opacity: 0.5 });

  // Act
  const config = UseElement.toFigmaNode(element);

  // Assert
  expect(config.opacity).toBe(0.5);
});

test("UseElement.toFigmaNode - transform属性あり - 位置に適用される", () => {
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

test("UseElement.toFigmaNode - x, yとtransform両方あり - 両方の値が加算される", () => {
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

// UseElement.getHref - href属性取得のテスト

test("UseElement.getHref - href属性あり - href値を返す", () => {
  // Arrange
  const element = UseElement.create({ href: "#myRect" });

  // Act & Assert
  expect(UseElement.getHref(element)).toBe("#myRect");
});

test("UseElement.getHref - xlink:href属性のみ - xlink:href値を返す", () => {
  // Arrange
  const element = UseElement.create({ "xlink:href": "#myCircle" });

  // Act & Assert
  expect(UseElement.getHref(element)).toBe("#myCircle");
});

test("UseElement.getHref - hrefとxlink:href両方あり - hrefを優先して返す", () => {
  // Arrange
  const element = UseElement.create({
    href: "#primary",
    "xlink:href": "#secondary",
  });

  // Act & Assert
  expect(UseElement.getHref(element)).toBe("#primary");
});

test("UseElement.getHref - href属性なし - undefinedを返す", () => {
  // Arrange
  const element = UseElement.create({});

  // Act & Assert
  expect(UseElement.getHref(element)).toBeUndefined();
});

// UseElement.getX / getY - 位置属性取得のテスト

test("UseElement.getX - x属性あり（数値） - 数値をそのまま返す", () => {
  // Arrange
  const element = UseElement.create({ x: 100 });

  // Act & Assert
  expect(UseElement.getX(element)).toBe(100);
});

test("UseElement.getY - y属性あり（数値） - 数値をそのまま返す", () => {
  // Arrange
  const element = UseElement.create({ y: 50 });

  // Act & Assert
  expect(UseElement.getY(element)).toBe(50);
});

test("UseElement.getX - x属性あり（文字列） - 数値にパースして返す", () => {
  // Arrange
  const element = UseElement.create({ x: "200" });

  // Act & Assert
  expect(UseElement.getX(element)).toBe(200);
});

test("UseElement.getY - y属性あり（文字列） - 数値にパースして返す", () => {
  // Arrange
  const element = UseElement.create({ y: "150" });

  // Act & Assert
  expect(UseElement.getY(element)).toBe(150);
});

test("UseElement.getX - x属性なし - 0を返す", () => {
  // Arrange
  const element = UseElement.create({});

  // Act & Assert
  expect(UseElement.getX(element)).toBe(0);
});

test("UseElement.getY - y属性なし - 0を返す", () => {
  // Arrange
  const element = UseElement.create({});

  // Act & Assert
  expect(UseElement.getY(element)).toBe(0);
});

// UseElement.getWidth / getHeight - サイズ属性取得のテスト

test("UseElement.getWidth - width属性あり（数値） - 数値をそのまま返す", () => {
  // Arrange
  const element = UseElement.create({ width: 200 });

  // Act & Assert
  expect(UseElement.getWidth(element)).toBe(200);
});

test("UseElement.getHeight - height属性あり（数値） - 数値をそのまま返す", () => {
  // Arrange
  const element = UseElement.create({ height: 150 });

  // Act & Assert
  expect(UseElement.getHeight(element)).toBe(150);
});

test("UseElement.getWidth - width属性あり（文字列） - 数値にパースして返す", () => {
  // Arrange
  const element = UseElement.create({ width: "300" });

  // Act & Assert
  expect(UseElement.getWidth(element)).toBe(300);
});

test("UseElement.getHeight - height属性あり（文字列） - 数値にパースして返す", () => {
  // Arrange
  const element = UseElement.create({ height: "250" });

  // Act & Assert
  expect(UseElement.getHeight(element)).toBe(250);
});

test("UseElement.getWidth - width属性なし - undefinedを返す", () => {
  // Arrange
  const element = UseElement.create({});

  // Act & Assert
  expect(UseElement.getWidth(element)).toBeUndefined();
});

test("UseElement.getHeight - height属性なし - undefinedを返す", () => {
  // Arrange
  const element = UseElement.create({});

  // Act & Assert
  expect(UseElement.getHeight(element)).toBeUndefined();
});

// UseElement.getId - id属性取得のテスト

test("UseElement.getId - id属性あり - id値を返す", () => {
  // Arrange
  const element = UseElement.create({ id: "use1" });

  // Act & Assert
  expect(UseElement.getId(element)).toBe("use1");
});

test("UseElement.getId - id属性なし - undefinedを返す", () => {
  // Arrange
  const element = UseElement.create({});

  // Act & Assert
  expect(UseElement.getId(element)).toBeUndefined();
});
