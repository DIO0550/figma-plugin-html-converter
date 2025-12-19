import { describe, test, expect } from "vitest";
import { DetailsElement } from "../details-element";

describe("DetailsElement.create", () => {
  test("空の属性でdetails要素を作成できる", () => {
    const element = DetailsElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("details");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  test("id属性を指定してdetails要素を作成できる", () => {
    const element = DetailsElement.create({ id: "details-1" });

    expect(element.attributes.id).toBe("details-1");
  });

  test("open属性をtrueで作成できる", () => {
    const element = DetailsElement.create({ open: true });

    expect(element.attributes.open).toBe(true);
  });

  test("open属性をfalseで作成できる", () => {
    const element = DetailsElement.create({ open: false });

    expect(element.attributes.open).toBe(false);
  });

  test("open属性を空文字列で作成できる", () => {
    const element = DetailsElement.create({ open: "" });

    expect(element.attributes.open).toBe("");
  });

  test("複数の属性を指定してdetails要素を作成できる", () => {
    const element = DetailsElement.create({
      id: "my-details",
      class: "collapsible",
      open: true,
      style: "border: 1px solid #ccc;",
    });

    expect(element.attributes.id).toBe("my-details");
    expect(element.attributes.class).toBe("collapsible");
    expect(element.attributes.open).toBe(true);
    expect(element.attributes.style).toBe("border: 1px solid #ccc;");
  });
});
