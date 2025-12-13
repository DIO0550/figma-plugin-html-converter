import { test, expect } from "vitest";
import { GroupElement, DefsElement } from "../index";

// グループとdefs要素の組み合わせ
test("統合: GroupElement + DefsElement - defs要素を子に持つg要素 - グループは変換されdefs要素は子として保持される", () => {
  // Arrange
  const group = GroupElement.create(
    {
      id: "group-with-defs",
    },
    [
      { type: "element", tagName: "defs", attributes: {} },
      {
        type: "element",
        tagName: "rect",
        attributes: { x: 0, y: 0, width: 100, height: 50 },
      },
    ],
  );

  // Act
  const config = GroupElement.toFigmaNode(group);

  // Assert
  expect(group.children).toHaveLength(2);
  expect(group.children?.[0].tagName).toBe("defs");
  expect(group.children?.[1].tagName).toBe("rect");
  expect(config.type).toBe("GROUP");
});

// 型ガードの統合テスト
test("統合: 型ガード - GroupElementとDefsElement - 相互に区別できる", () => {
  // Arrange
  const group = GroupElement.create();
  const defs = DefsElement.create();

  // Act & Assert
  expect(GroupElement.isGroupElement(group)).toBe(true);
  expect(GroupElement.isGroupElement(defs)).toBe(false);
  expect(DefsElement.isDefsElement(defs)).toBe(true);
  expect(DefsElement.isDefsElement(group)).toBe(false);
});
