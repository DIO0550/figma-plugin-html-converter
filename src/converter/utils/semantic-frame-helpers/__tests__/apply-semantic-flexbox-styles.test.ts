import { test, expect } from "vitest";
import { applySemanticFlexboxStyles } from "../semantic-frame-helpers";
import type { FigmaNodeConfig } from "../../../models/figma-node";
import { Styles } from "../../../models/styles";

test("applySemanticFlexboxStyles - flex-direction: rowを指定すると、layoutModeがHORIZONTALに設定される", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
  };
  const styles = Styles.parse("display: flex; flex-direction: row");

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.layoutMode).toBe("HORIZONTAL");
});

test("applySemanticFlexboxStyles - gapを指定すると、itemSpacingにマッピングされる", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
  };
  const styles = Styles.parse("display: flex; gap: 16px");

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.itemSpacing).toBe(16);
});

test("applySemanticFlexboxStyles - gapが未指定の場合、itemSpacingは設定されない", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
  };
  const styles = Styles.parse("display: flex");

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.itemSpacing).toBeUndefined();
});

test("applySemanticFlexboxStyles - heightが指定されている場合、layoutSizingVerticalはFIXEDになる", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
  };
  const styles = Styles.parse("height: 100px");

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.layoutSizingVertical).toBe("FIXED");
});

test("applySemanticFlexboxStyles - heightが未指定の場合、layoutSizingVerticalは設定されない", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
  };
  const styles = Styles.parse("width: 200px");

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.layoutSizingVertical).toBeUndefined();
});

test("applySemanticFlexboxStyles - 既存のconfigプロパティを保持する", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "existing-name",
    width: 300,
    paddingLeft: 10,
  };
  const styles = Styles.parse("display: flex; gap: 8px; height: 50px");

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.type).toBe("FRAME");
  expect(result.name).toBe("existing-name");
  expect(result.width).toBe(300);
  expect(result.paddingLeft).toBe(10);
  expect(result.itemSpacing).toBe(8);
  expect(result.layoutSizingVertical).toBe("FIXED");
});

test("applySemanticFlexboxStyles - 複合的なFlexboxスタイルとgapとheightを同時に適用すると、すべて正しく反映される", () => {
  // Arrange
  const config: FigmaNodeConfig = {
    type: "FRAME",
    name: "test",
  };
  const styles = Styles.parse(
    "display: flex; flex-direction: column; gap: 12px; height: 400px",
  );

  // Act
  const result = applySemanticFlexboxStyles(config, styles);

  // Assert
  expect(result.layoutMode).toBe("VERTICAL");
  expect(result.itemSpacing).toBe(12);
  expect(result.layoutSizingVertical).toBe("FIXED");
});
