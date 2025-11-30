import { test, expect } from "vitest";
import { ColgroupElement } from "../colgroup-element";
import { ColElement } from "../../../col";

// colgroup要素はメタデータのみでFigmaノードを生成しない（nullを返す）

test("ColgroupElement.toFigmaNode() - デフォルト属性でcolgroup要素を変換するとnullが返される", () => {
  const element = ColgroupElement.create();
  const config = ColgroupElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColgroupElement.toFigmaNode() - span属性を持つcolgroup要素を変換するとnullが返される", () => {
  const element = ColgroupElement.create({ span: 3 });
  const config = ColgroupElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColgroupElement.toFigmaNode() - 複数の属性を持つcolgroup要素を変換するとnullが返される", () => {
  const element = ColgroupElement.create({
    span: 2,
    id: "colgroup-1",
    className: "highlight",
  });
  const config = ColgroupElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColgroupElement.toFigmaNode() - id属性を持つcolgroup要素を変換するとnullが返される", () => {
  const element = ColgroupElement.create({ id: "header-group" });
  const config = ColgroupElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColgroupElement.toFigmaNode() - style属性を持つcolgroup要素を変換するとnullが返される", () => {
  const element = ColgroupElement.create({
    style: "background-color: #f0f0f0;",
  });
  const config = ColgroupElement.toFigmaNode(element);

  expect(config).toBeNull();
});

test("ColgroupElement.toFigmaNode() - 子要素を持つcolgroup要素を変換するとnullが返される", () => {
  const col = ColElement.create({ span: 2 });
  const element = ColgroupElement.createWithChildren({}, [col]);
  const config = ColgroupElement.toFigmaNode(element);

  expect(config).toBeNull();
});
