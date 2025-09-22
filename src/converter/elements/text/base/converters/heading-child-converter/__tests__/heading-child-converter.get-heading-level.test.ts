import { test, expect } from "vitest";
import { HeadingChildConverter } from "../heading-child-converter";

// =============================================================================
// HeadingChildConverter.getHeadingLevel のテスト
// =============================================================================

test("HeadingChildConverter.getHeadingLevel() - h1のレベルを取得できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("h1");

  // Assert
  expect(level).toBe(1);
});

test("HeadingChildConverter.getHeadingLevel() - h2のレベルを取得できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("h2");

  // Assert
  expect(level).toBe(2);
});

test("HeadingChildConverter.getHeadingLevel() - h3のレベルを取得できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("h3");

  // Assert
  expect(level).toBe(3);
});

test("HeadingChildConverter.getHeadingLevel() - h4のレベルを取得できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("h4");

  // Assert
  expect(level).toBe(4);
});

test("HeadingChildConverter.getHeadingLevel() - h5のレベルを取得できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("h5");

  // Assert
  expect(level).toBe(5);
});

test("HeadingChildConverter.getHeadingLevel() - h6のレベルを取得できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("h6");

  // Assert
  expect(level).toBe(6);
});

test("HeadingChildConverter.getHeadingLevel() - 不正な要素タイプでデフォルト値を返す", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("div");

  // Assert
  expect(level).toBe(1);
});

test("HeadingChildConverter.getHeadingLevel() - 大文字の要素タイプを処理できる", () => {
  // Arrange & Act
  const level = HeadingChildConverter.getHeadingLevel("H3");

  // Assert
  expect(level).toBe(3);
});
