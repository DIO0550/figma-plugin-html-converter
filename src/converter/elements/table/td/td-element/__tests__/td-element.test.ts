import { test, expect } from "vitest";
import { TdElement } from "../td-element";
import type { TdAttributes } from "../../td-attributes";

// ========================================
// TdElement.create() のテスト
// ========================================

test("TdElement.create() - デフォルト属性で基本的なtd要素を作成する", () => {
  // Act
  const element = TdElement.create();

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("td");
  expect(element.attributes).toBeDefined();
  expect(element.children).toEqual([]);
});

test("TdElement.create() - 指定された属性でtd要素を作成する", () => {
  // Arrange
  const attributes: TdAttributes = {
    id: "cell-1",
    className: "table-cell",
    width: "100px",
    height: "50px",
  };

  // Act
  const element = TdElement.create(attributes);

  // Assert
  expect(element.type).toBe("element");
  expect(element.tagName).toBe("td");
  expect(element.attributes).toEqual(attributes);
  expect(element.children).toEqual([]);
});

test("TdElement.create() - width 属性のみでtd要素を作成する", () => {
  // Act
  const element = TdElement.create({ width: "150px" });

  // Assert
  expect(element.attributes?.width).toBe("150px");
  expect(element.attributes?.height).toBeUndefined();
});

test("TdElement.create() - height 属性のみでtd要素を作成する", () => {
  // Act
  const element = TdElement.create({ height: "75px" });

  // Assert
  expect(element.attributes?.height).toBe("75px");
  expect(element.attributes?.width).toBeUndefined();
});

test("TdElement.create() - style 属性でtd要素を作成する", () => {
  // Act
  const element = TdElement.create({
    style: "border: 1px solid black; padding: 10px;",
  });

  // Assert
  expect(element.attributes?.style).toBe(
    "border: 1px solid black; padding: 10px;",
  );
});

// ========================================
// TdElement.isTdElement() のテスト
// ========================================

test("TdElement.isTdElement() - 有効なTdElementに対してtrueを返す", () => {
  // Arrange
  const element = TdElement.create();

  // Act & Assert
  expect(TdElement.isTdElement(element)).toBe(true);
});

test("TdElement.isTdElement() - 属性を持つtd要素に対してtrueを返す", () => {
  // Arrange
  const element = TdElement.create({
    id: "test-cell",
    width: "100px",
  });

  // Act & Assert
  expect(TdElement.isTdElement(element)).toBe(true);
});

test("TdElement.isTdElement() - nullに対してfalseを返す", () => {
  // Act & Assert
  expect(TdElement.isTdElement(null)).toBe(false);
});

test("TdElement.isTdElement() - undefinedに対してfalseを返す", () => {
  // Act & Assert
  expect(TdElement.isTdElement(undefined)).toBe(false);
});

test("TdElement.isTdElement() - 非要素オブジェクトに対してfalseを返す", () => {
  // Act & Assert
  expect(TdElement.isTdElement({})).toBe(false);
});

test("TdElement.isTdElement() - 異なる要素タイプに対してfalseを返す", () => {
  // Arrange
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  // Act & Assert
  expect(TdElement.isTdElement(divElement)).toBe(false);
});

test("TdElement.isTdElement() - typeプロパティが欠けているオブジェクトに対してfalseを返す", () => {
  // Arrange
  const invalidElement = {
    tagName: "td",
    attributes: {},
    children: [],
  };

  // Act & Assert
  expect(TdElement.isTdElement(invalidElement)).toBe(false);
});

test("TdElement.isTdElement() - tagNameプロパティが欠けているオブジェクトに対してfalseを返す", () => {
  // Arrange
  const invalidElement = {
    type: "element",
    attributes: {},
    children: [],
  };

  // Act & Assert
  expect(TdElement.isTdElement(invalidElement)).toBe(false);
});

// ========================================
// TdElement.toFigmaNode() のテスト
// ========================================

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

// ========================================
// TdElement.mapToFigma() のテスト
// ========================================

test("TdElement.mapToFigma() - 有効なTdElementをFigmaNodeConfigに変換する", () => {
  // Arrange
  const element = TdElement.create();

  // Act
  const config = TdElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.type).toBe("FRAME");
});

test("TdElement.mapToFigma() - 属性を持つtd要素を変換する", () => {
  // Arrange
  const element = TdElement.create({
    id: "cell-1",
    style: "background-color: blue;",
  });

  // Act
  const config = TdElement.mapToFigma(element);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.fills).toBeDefined();
});

test("TdElement.mapToFigma() - td以外の要素に対してnullを返す", () => {
  // Arrange
  const divElement = {
    type: "element",
    tagName: "div",
    attributes: {},
    children: [],
  };

  // Act
  const config = TdElement.mapToFigma(divElement);

  // Assert
  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - nullに対してnullを返す", () => {
  // Act
  const config = TdElement.mapToFigma(null);

  // Assert
  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - undefinedに対してnullを返す", () => {
  // Act
  const config = TdElement.mapToFigma(undefined);

  // Assert
  expect(config).toBeNull();
});

test("TdElement.mapToFigma() - 互換性のあるHTMLNodeをTdElementに変換してからFigmaNodeConfigに変換する", () => {
  // Arrange
  const htmlNode = {
    type: "element",
    tagName: "td",
    attributes: {
      style: "padding: 5px;",
    },
  };

  // Act
  const config = TdElement.mapToFigma(htmlNode);

  // Assert
  expect(config).not.toBeNull();
  expect(config!.name).toBe("td");
  expect(config!.paddingTop).toBe(5);
});
