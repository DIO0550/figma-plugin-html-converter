import { test, expect } from "vitest";
import { ColElement } from "../col-element";

// col要素はメタデータのみでFigmaノードを生成しない（nullを返す）

test("ColElement.toFigmaNode() - デフォルト属性でcol要素を変換するとnullが返される", () => {
  const element = ColElement.create();
  const config = ColElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColElement.toFigmaNode() - span属性を持つcol要素を変換するとnullが返される", () => {
  const element = ColElement.create({ span: 2 });
  const config = ColElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColElement.toFigmaNode() - width属性を持つcol要素を変換するとnullが返される", () => {
  const element = ColElement.create({ width: "100px" });
  const config = ColElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColElement.toFigmaNode() - 複数の属性を持つcol要素を変換するとnullが返される", () => {
  const element = ColElement.create({
    span: 3,
    width: "200px",
    id: "column-1",
    className: "highlight",
  });
  const config = ColElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColElement.toFigmaNode() - id属性を持つcol要素を変換するとnullが返される", () => {
  const element = ColElement.create({ id: "first-col" });
  const config = ColElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColElement.toFigmaNode() - style属性を持つcol要素を変換するとnullが返される", () => {
  const element = ColElement.create({ style: "background-color: #f0f0f0;" });
  const config = ColElement.toFigmaNode(element);

  expect(config).toBeNull();
});
