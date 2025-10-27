import { test, expect, vi } from "vitest";
import { mapToFigmaWith } from "./element-utils";
import type { FigmaNodeConfig } from "../models/figma-node";

// ========================================
// テスト用の型定義
// ========================================

interface TestAttributes {
  style?: string;
  id?: string;
}

interface TestElement {
  type: "element";
  tagName: "test";
  attributes: TestAttributes;
  _brand?: "TestElement"; // 型ガードで区別するためのマーカー
}

// ========================================
// テスト用のヘルパー関数
// ========================================

const createTestElement = (attributes: TestAttributes = {}): TestElement => ({
  type: "element",
  tagName: "test",
  attributes,
  _brand: "TestElement", // マーカーを付与
});

const isTestElement = (node: unknown): node is TestElement => {
  // _brandマーカーを使って厳密に区別
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    "tagName" in node &&
    node.type === "element" &&
    node.tagName === "test" &&
    "_brand" in node &&
    node._brand === "TestElement"
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFromAttributes = (attrs: any): TestElement => ({
  type: "element",
  tagName: "test",
  attributes: attrs as TestAttributes,
  _brand: "TestElement", // マーカーを付与
});

const toFigmaNodeMock = (_element: TestElement): FigmaNodeConfig => ({
  type: "FRAME",
  name: "test",
  children: [],
});

// ========================================
// 型ガードが成功するケース
// ========================================

test("mapToFigmaWith - 型ガードが成功する場合、直接toFigmaNodeを呼び出す", () => {
  // Arrange
  const element = createTestElement({ id: "test-1" });
  const typeGuardSpy = vi.fn(isTestElement);
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    element,
    "test",
    typeGuardSpy as unknown as (n: unknown) => n is TestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(typeGuardSpy).toHaveBeenCalledWith(element);
  expect(typeGuardSpy).toHaveBeenCalledTimes(1);
  expect(createSpy).not.toHaveBeenCalled(); // 型ガード成功時はcreateは呼ばれない
  expect(toFigmaNodeSpy).toHaveBeenCalledWith(element);
  expect(toFigmaNodeSpy).toHaveBeenCalledTimes(1);
  expect(result).toEqual({
    type: "FRAME",
    name: "test",
    children: [],
  });
});

// ========================================
// HTMLNodeからの変換ケース
// ========================================

test("mapToFigmaWith - 型ガードが失敗し、HTMLNode形式の場合、createとtoFigmaNodeを呼び出す", () => {
  // Arrange
  const htmlNode = {
    type: "element",
    tagName: "test",
    attributes: { style: "color: red;" },
  };
  const typeGuardSpy = vi.fn(isTestElement);
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    htmlNode,
    "test",
    typeGuardSpy as unknown as (n: unknown) => n is TestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(typeGuardSpy).toHaveBeenCalledWith(htmlNode);
  expect(createSpy).toHaveBeenCalledWith({ style: "color: red;" });
  expect(toFigmaNodeSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "element",
      tagName: "test",
      attributes: { style: "color: red;" },
    }),
  );
  expect(result).toEqual({
    type: "FRAME",
    name: "test",
    children: [],
  });
});

test("mapToFigmaWith - HTMLNode形式でattributesがない場合、空オブジェクトでcreateを呼び出す", () => {
  // Arrange
  const htmlNode = {
    type: "element",
    tagName: "test",
  };
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    htmlNode,
    "test",
    isTestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(createSpy).toHaveBeenCalledWith({});
  expect(result).not.toBeNull();
});

test("mapToFigmaWith - HTMLNode形式でattributesがオブジェクトでない場合、空オブジェクトでcreateを呼び出す", () => {
  // Arrange
  const htmlNode = {
    type: "element",
    tagName: "test",
    attributes: "invalid",
  };
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    htmlNode,
    "test",
    isTestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(createSpy).toHaveBeenCalledWith({});
  expect(result).not.toBeNull();
});

// ========================================
// 変換失敗ケース
// ========================================

test("mapToFigmaWith - 型ガードもHTMLNode変換も失敗する場合、nullを返す", () => {
  // Arrange
  const invalidNode = { type: "text", value: "test" };
  const typeGuardSpy = vi.fn(isTestElement);
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    invalidNode,
    "test",
    typeGuardSpy as unknown as (n: unknown) => n is TestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(typeGuardSpy).toHaveBeenCalledWith(invalidNode);
  expect(createSpy).not.toHaveBeenCalled();
  expect(toFigmaNodeSpy).not.toHaveBeenCalled();
  expect(result).toBeNull();
});

test("mapToFigmaWith - tagNameが一致しない場合、nullを返す", () => {
  // Arrange
  const wrongTagNode = {
    type: "element",
    tagName: "div", // "test"ではない
    attributes: {},
  };
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    wrongTagNode,
    "test",
    isTestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(createSpy).not.toHaveBeenCalled();
  expect(toFigmaNodeSpy).not.toHaveBeenCalled();
  expect(result).toBeNull();
});

// ========================================
// エッジケース
// ========================================

test("mapToFigmaWith - nodeがnullの場合、nullを返す", () => {
  // Arrange
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    null,
    "test",
    isTestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(createSpy).not.toHaveBeenCalled();
  expect(toFigmaNodeSpy).not.toHaveBeenCalled();
  expect(result).toBeNull();
});

test("mapToFigmaWith - nodeがundefinedの場合、nullを返す", () => {
  // Arrange
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    undefined,
    "test",
    isTestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(createSpy).not.toHaveBeenCalled();
  expect(toFigmaNodeSpy).not.toHaveBeenCalled();
  expect(result).toBeNull();
});

test("mapToFigmaWith - nodeがプリミティブ型の場合、nullを返す", () => {
  // Arrange
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act & Assert
  expect(
    mapToFigmaWith("string", "test", isTestElement, createSpy, toFigmaNodeSpy),
  ).toBeNull();
  expect(
    mapToFigmaWith(123, "test", isTestElement, createSpy, toFigmaNodeSpy),
  ).toBeNull();
  expect(
    mapToFigmaWith(true, "test", isTestElement, createSpy, toFigmaNodeSpy),
  ).toBeNull();
  expect(createSpy).not.toHaveBeenCalled();
  expect(toFigmaNodeSpy).not.toHaveBeenCalled();
});

test("mapToFigmaWith - typeがelementでない場合、nullを返す", () => {
  // Arrange
  const wrongTypeNode = {
    type: "text",
    tagName: "test",
    attributes: {},
  };
  const createSpy = vi.fn(createFromAttributes);
  const toFigmaNodeSpy = vi.fn(toFigmaNodeMock);

  // Act
  const result = mapToFigmaWith(
    wrongTypeNode,
    "test",
    isTestElement,
    createSpy,
    toFigmaNodeSpy,
  );

  // Assert
  expect(result).toBeNull();
});
