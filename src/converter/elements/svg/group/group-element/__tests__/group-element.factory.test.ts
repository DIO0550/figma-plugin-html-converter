import { describe, test, expect } from "vitest";
import { GroupElement } from "../group-element";

describe("GroupElement.create", () => {
  test("引数なしでg要素を作成する", () => {
    const element = GroupElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("g");
    expect(element.attributes).toBeDefined();
  });

  test("属性を指定してg要素を作成する", () => {
    const element = GroupElement.create({
      id: "group1",
      transform: "translate(10, 20)",
    });

    expect(element.attributes.id).toBe("group1");
    expect(element.attributes.transform).toBe("translate(10, 20)");
  });

  test("fill属性を指定してg要素を作成する", () => {
    const element = GroupElement.create({
      fill: "#ff0000",
    });

    expect(element.attributes.fill).toBe("#ff0000");
  });

  test("stroke属性を指定してg要素を作成する", () => {
    const element = GroupElement.create({
      stroke: "#00ff00",
      "stroke-width": 2,
    });

    expect(element.attributes.stroke).toBe("#00ff00");
    expect(element.attributes["stroke-width"]).toBe(2);
  });

  test("子要素を指定してg要素を作成する", () => {
    const element = GroupElement.create({}, [
      { type: "element", tagName: "rect", attributes: {} },
    ]);

    expect(element.children).toHaveLength(1);
    expect(element.children?.[0].tagName).toBe("rect");
  });

  test("複数の子要素を指定してg要素を作成する", () => {
    const element = GroupElement.create({}, [
      { type: "element", tagName: "rect", attributes: {} },
      { type: "element", tagName: "circle", attributes: {} },
    ]);

    expect(element.children).toHaveLength(2);
  });
});
