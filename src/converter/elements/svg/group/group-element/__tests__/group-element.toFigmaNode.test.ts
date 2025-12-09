import { describe, test, expect } from "vitest";
import { GroupElement } from "../group-element";

describe("GroupElement.toFigmaNode", () => {
  test("基本的なg要素をGROUPノードに変換する", () => {
    const element = GroupElement.create();

    const config = GroupElement.toFigmaNode(element);

    expect(config.type).toBe("GROUP");
    expect(config.name).toBe("g");
  });

  test("id属性がある場合、nameに反映する", () => {
    const element = GroupElement.create({
      id: "my-group",
    });

    const config = GroupElement.toFigmaNode(element);

    expect(config.name).toBe("my-group");
  });

  test("transform属性のtranslateを適用する", () => {
    const element = GroupElement.create({
      transform: "translate(10, 20)",
    });

    const config = GroupElement.toFigmaNode(element);

    expect(config.x).toBe(10);
    expect(config.y).toBe(20);
  });

  test("transform属性の複数translateを累積する", () => {
    const element = GroupElement.create({
      transform: "translate(10, 20) translate(5, 10)",
    });

    const config = GroupElement.toFigmaNode(element);

    expect(config.x).toBe(15);
    expect(config.y).toBe(30);
  });

  test("opacity属性を適用する", () => {
    const element = GroupElement.create({
      opacity: "0.5",
    });

    const config = GroupElement.toFigmaNode(element);

    expect(config.opacity).toBe(0.5);
  });

  test("子要素がない場合、childrenは空配列", () => {
    const element = GroupElement.create();

    const config = GroupElement.toFigmaNode(element);

    expect(config.children).toEqual([]);
  });

  test("子要素は処理されずそのまま返す（子要素の変換は呼び出し側の責任）", () => {
    const element = GroupElement.create({}, [
      {
        type: "element",
        tagName: "rect",
        attributes: { x: 0, y: 0, width: 100, height: 50 },
      },
    ]);

    const config = GroupElement.toFigmaNode(element);

    // 子要素の変換は行わず、空配列を返す（マッパー側で処理）
    expect(config.children).toEqual([]);
  });
});
