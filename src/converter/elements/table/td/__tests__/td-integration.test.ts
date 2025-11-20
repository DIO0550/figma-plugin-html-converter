import { test, expect } from "vitest";
import { TdElement } from "../td-element";

test("TdElement 統合 - テキストコンテンツを持つシンプルなtd要素を変換する", () => {
  // Arrange
  const element = TdElement.create({
    style: "padding: 10px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td");
  expect(config.type).toBe("FRAME");
  expect(config.paddingTop).toBe(10);
  expect(config.paddingRight).toBe(10);
  expect(config.paddingBottom).toBe(10);
  expect(config.paddingLeft).toBe(10);
});

test("TdElement 統合 - borderと背景色を持つtd要素を変換する", () => {
  // Arrange
  const element = TdElement.create({
    style: "border: 1px solid #000; background-color: #f5f5f5;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td");
  expect(config.type).toBe("FRAME");
  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(1);
  expect(config.fills).toBeDefined();
  expect(config.fills).toHaveLength(1);
});

test("TdElement 統合 - 特定のwidthとheightを持つtd要素を変換する", () => {
  // Arrange
  const element = TdElement.create({
    style: "width: 200px; height: 100px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.width).toBe(200);
  expect(config.height).toBe(100);
});

test("TdElement 統合 - 複雑なスタイルを持つtd要素を変換する", () => {
  // Arrange
  const element = TdElement.create({
    id: "data-cell",
    className: "table-data-cell",
    style:
      "width: 150px; height: 80px; padding: 12px; border: 2px solid #333; background-color: #ffffff;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td#data-cell");
  expect(config.type).toBe("FRAME");
  expect(config.width).toBe(150);
  expect(config.height).toBe(80);
  expect(config.paddingTop).toBe(12);
  expect(config.paddingRight).toBe(12);
  expect(config.paddingBottom).toBe(12);
  expect(config.paddingLeft).toBe(12);
  expect(config.strokeWeight).toBe(2);
  expect(config.fills).toBeDefined();
  expect(config.strokes).toBeDefined();
});

test("TdElement 統合 - 個別のpadding値を持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({
    style:
      "padding-top: 5px; padding-right: 10px; padding-bottom: 15px; padding-left: 20px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.paddingTop).toBe(5);
  expect(config.paddingRight).toBe(10);
  expect(config.paddingBottom).toBe(15);
  expect(config.paddingLeft).toBe(20);
});

test("TdElement 統合 - 最小・最大サイズを持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({
    style:
      "min-width: 100px; max-width: 500px; min-height: 50px; max-height: 200px;",
  });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.minWidth).toBe(100);
  expect(config.maxWidth).toBe(500);
  expect(config.minHeight).toBe(50);
  expect(config.maxHeight).toBe(200);
});

test("TdElement 統合 - 有効なTdElementを正しく識別する", () => {
  // Arrange
  const element = TdElement.create({
    id: "test-cell",
    style: "padding: 5px;",
  });

  // Act & Assert
  expect(TdElement.isTdElement(element)).toBe(true);
});

test("TdElement 統合 - 無効な要素タイプを拒否する", () => {
  // Arrange
  const invalidElements = [
    null,
    undefined,
    {},
    { type: "element" },
    { tagName: "td" },
    { type: "element", tagName: "div" },
    "td",
    123,
    true,
  ];

  // Act & Assert
  invalidElements.forEach((invalidElement) => {
    expect(TdElement.isTdElement(invalidElement)).toBe(false);
  });
});

test("TdElement 統合 - HTMLNodeライクなオブジェクトをFigmaNodeConfigに変換する", () => {
  // Arrange
  const htmlNode = {
    type: "element",
    tagName: "td",
    attributes: {
      style: "padding: 8px; border: 1px solid #ddd;",
    },
  };

  // Act
  const config = TdElement.mapToFigma(htmlNode);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.paddingTop).toBe(8);
  expect(config!.strokeWeight).toBe(1);
});

test("TdElement 統合 - 無効なノードに対してnullを返す", () => {
  // Arrange
  const invalidNodes = [
    null,
    undefined,
    { type: "element", tagName: "div" },
    { type: "text", content: "Hello" },
  ];

  // Act & Assert
  invalidNodes.forEach((node) => {
    expect(TdElement.mapToFigma(node)).toBeNull();
  });
});

test("TdElement 統合 - 空の属性を持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({});

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td");
  expect(config.type).toBe("FRAME");
});

test("TdElement 統合 - id属性のみを持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({ id: "cell-1" });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td#cell-1");
  expect(config.type).toBe("FRAME");
});

test("TdElement 統合 - className属性のみを持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({ className: "data-cell" });

  // Act
  const config = TdElement.toFigmaNode(element);

  // Assert
  expect(config.name).toBe("td");
  expect(config.type).toBe("FRAME");
});

test("TdElement 統合 - widthとheight属性を持つtd要素を処理する", () => {
  // Arrange
  const element = TdElement.create({
    width: "100px",
    height: "50px",
  });

  // Act & Assert
  expect(element.attributes?.width).toBe("100px");
  expect(element.attributes?.height).toBe("50px");
});

test("TdElement 統合 - 作成された要素内の全ての属性を保持する", () => {
  // Arrange
  const attributes = {
    id: "test",
    className: "cell",
    style: "color: red;",
    width: "200px",
    height: "100px",
    title: "Test Cell",
  };

  // Act
  const element = TdElement.create(attributes);

  // Assert
  expect(element.attributes).toEqual(attributes);
});
