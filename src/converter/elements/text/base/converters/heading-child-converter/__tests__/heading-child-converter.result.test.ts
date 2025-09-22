import { test, expect } from "vitest";
import { HeadingChildResult } from "../heading-child-converter";

// =============================================================================
// HeadingChildResult.create のテスト
// =============================================================================

test("HeadingChildResult.create() - 結果オブジェクトを作成できる", () => {
  // Arrange
  const node = {
    type: "TEXT" as const,
    name: "test-heading-node",
    content: "test content",
    style: {},
  };
  const metadata = { isText: true, isBold: false, isItalic: false };

  // Act
  const result = HeadingChildResult.create(node, metadata);

  // Assert
  expect(result.node).toBe(node);
  expect(result.isText).toBe(true);
  expect(result.isBold).toBe(false);
  expect(result.isItalic).toBe(false);
});
