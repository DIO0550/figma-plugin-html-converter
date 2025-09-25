import { test, expect } from "vitest";
import { ParagraphChildResult } from "../paragraph-child-converter";

// =============================================================================
// ParagraphChildResult.create のテスト
// =============================================================================

test("ParagraphChildResult.create() - 結果オブジェクトを作成できる", () => {
  // Arrange
  const node = {
    type: "TEXT" as const,
    name: "test-node",
    content: "test content",
    style: {},
  };
  const metadata = { isText: true, isBold: false, isItalic: false };

  // Act
  const result = ParagraphChildResult.create(node, metadata);

  // Assert
  expect(result.node).toBe(node);
  expect(result.isText).toBe(true);
  expect(result.isBold).toBe(false);
  expect(result.isItalic).toBe(false);
});
