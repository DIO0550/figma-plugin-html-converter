import { test, expect } from "vitest";
import { AElement } from "../a-element";
import { createAElement } from "./test-helpers";

// ===============================
// 外部リンク判定テスト
// ===============================

test("AElement.isExternalLink() - http://で始まるURLの場合trueを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "http://example.com" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(true);
});

test("AElement.isExternalLink() - https://で始まるURLの場合trueを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "https://secure.example.com" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(true);
});

test("AElement.isExternalLink() - プロトコル相対URL（//）の場合trueを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "//cdn.example.com/resource" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(true);
});

test("AElement.isExternalLink() - 相対パス（/）で始まる場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "/path/to/page" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isExternalLink() - ハッシュ（#）で始まる場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "#section" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isExternalLink() - 相対パス（./）で始まる場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "./file.html" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isExternalLink() - href属性が空文字列の場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "" },
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isExternalLink() - href属性が存在しない場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: {},
  });

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isExternalLink() - attributes自体が存在しない場合falseを返す", () => {
  // Arrange
  const element = createAElement();

  // Act
  const result = AElement.isExternalLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isExternalLink() - 大文字小文字混在のプロトコルを正しく判定する", () => {
  // Arrange
  const testCases = [
    { href: "HTTP://example.com", expected: false }, // 大文字は判定されない
    { href: "HtTpS://example.com", expected: false },
    { href: "http://EXAMPLE.COM", expected: true }, // ドメイン部分の大文字は問題ない
  ];

  // Act & Assert
  testCases.forEach(({ href, expected }) => {
    const element = createAElement({ attributes: { href } });
    expect(AElement.isExternalLink(element)).toBe(expected);
  });
});

// ===============================
// アンカーリンク判定テスト
// ===============================

test("AElement.isAnchorLink() - #で始まる単純なアンカーリンクの場合trueを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "#section1" },
  });

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(true);
});

test("AElement.isAnchorLink() - #のみの場合trueを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "#" },
  });

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(true);
});

test("AElement.isAnchorLink() - URLの後に#が付いている場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "https://example.com#section" },
  });

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isAnchorLink() - 相対パスの場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "/path/to/page" },
  });

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isAnchorLink() - href属性が空文字列の場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { href: "" },
  });

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isAnchorLink() - href属性が存在しない場合falseを返す", () => {
  // Arrange
  const element = createAElement({
    attributes: { target: "_blank" },
  });

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(false);
});

test("AElement.isAnchorLink() - attributes自体が存在しない場合falseを返す", () => {
  // Arrange
  const element = createAElement();

  // Act
  const result = AElement.isAnchorLink(element);

  // Assert
  expect(result).toBe(false);
});
