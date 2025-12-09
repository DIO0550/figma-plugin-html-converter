import { describe, test, expect } from "vitest";
import { GroupElement } from "../group-element";

describe("GroupElement.mapToFigma", () => {
  test("GroupElementをFigmaNodeConfigに変換する", () => {
    const element = GroupElement.create({
      id: "test-group",
    });

    const config = GroupElement.mapToFigma(element);

    expect(config).not.toBeNull();
    expect(config?.type).toBe("GROUP");
    expect(config?.name).toBe("test-group");
  });

  test("HTMLNodeからFigmaNodeConfigに変換する", () => {
    const node = {
      type: "element" as const,
      tagName: "g",
      attributes: {
        transform: "translate(50, 100)",
      },
    };

    const config = GroupElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.type).toBe("GROUP");
    expect(config?.x).toBe(50);
    expect(config?.y).toBe(100);
  });

  test("g要素以外の場合、nullを返す", () => {
    const node = {
      type: "element" as const,
      tagName: "rect",
      attributes: {},
    };

    const config = GroupElement.mapToFigma(node);

    expect(config).toBeNull();
  });

  test("nullの場合、nullを返す", () => {
    const config = GroupElement.mapToFigma(null);

    expect(config).toBeNull();
  });

  test("属性がない場合でも正しく変換する", () => {
    const node = {
      type: "element" as const,
      tagName: "g",
      attributes: {},
    };

    const config = GroupElement.mapToFigma(node);

    expect(config).not.toBeNull();
    expect(config?.type).toBe("GROUP");
  });
});
