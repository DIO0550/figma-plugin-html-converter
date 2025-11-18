import { test, expect } from "vitest";
import { TdElement } from "../td-element";

test("TdElement.toFigmaNode() - 基本的なtd要素をFigmaNodeConfigに変換する", () => {
  // Arrange
  const element = TdElement.create();

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config).toBeDefined();
  expect(config.name).toBe("td");
  expect(config.type).toBe("FRAME");
});

test("TdElement.toFigmaNode() - スタイルから背景色を適用する", () => {
  // Arrange
  const element = TdElement.create({
    style: "background-color: rgb(255, 0, 0);",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.fills).toHaveLength(1);
  expect(config.fills![0].type).toBe("SOLID");
});

test("TdElement.toFigmaNode() - スタイルからpaddingを適用する", () => {
  // Arrange
  const element = TdElement.create({
    style: "padding: 10px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.paddingTop).toBe(10);
  expect(config.paddingRight).toBe(10);
  expect(config.paddingBottom).toBe(10);
  expect(config.paddingLeft).toBe(10);
});

test("TdElement.toFigmaNode() - スタイルからborderを適用する", () => {
  // Arrange
  const element = TdElement.create({
    style: "border: 1px solid black;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(1);
});

test("TdElement.toFigmaNode() - スタイルからwidthとheightを適用する", () => {
  // Arrange
  const element = TdElement.create({
    style: "width: 100px; height: 50px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.width).toBe(100);
  expect(config.height).toBe(50);
});

test("TdElement.toFigmaNode() - 複雑なスタイルを持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({
    style:
      "background-color: #f0f0f0; border: 2px solid #333; padding: 15px; width: 200px; height: 100px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.fills).toBeDefined();
  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(2);
  expect(config.paddingTop).toBe(15);
  expect(config.width).toBe(200);
  expect(config.height).toBe(100);
});

test("TdElement.toFigmaNode() - スタイルなしのtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create();

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td");
  expect(config.type).toBe("FRAME");
  expect(config.children).toBeUndefined();
});
