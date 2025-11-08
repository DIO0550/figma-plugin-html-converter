import { test, expect } from "vitest";
import { initializeSemanticFramePadding } from "../semantic-frame-helpers";
import type { FigmaNodeConfig } from "../../../models/figma-node";

test("initializeSemanticFramePadding - すべてのpadding値とitemSpacingを0で初期化する", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
    layoutMode: "VERTICAL",
  };

  // Act
  const result = initializeSemanticFramePadding(config);

  // Assert
  expect(result.paddingLeft).toBe(0);
  expect(result.paddingRight).toBe(0);
  expect(result.paddingTop).toBe(0);
  expect(result.paddingBottom).toBe(0);
  expect(result.itemSpacing).toBe(0);
});

test("initializeSemanticFramePadding - 既存のconfigプロパティを保持する", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 200,
  };

  // Act
  const result = initializeSemanticFramePadding(config);

  // Assert
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("test");
  expect(result.layoutMode).toBe("HORIZONTAL");
  expect(result.width).toBe(100);
  expect(result.height).toBe(200);
});

test("initializeSemanticFramePadding - 既存のpadding値を上書きする", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 40,
    itemSpacing: 5,
  };

  // Act
  const result = initializeSemanticFramePadding(config);

  // Assert
  expect(result.paddingLeft).toBe(0);
  expect(result.paddingRight).toBe(0);
  expect(result.paddingTop).toBe(0);
  expect(result.paddingBottom).toBe(0);
  expect(result.itemSpacing).toBe(0);
});
