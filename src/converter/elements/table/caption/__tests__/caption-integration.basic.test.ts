import { test, expect } from "vitest";
import { CaptionElement } from "../caption-element";

test("空のcaption要素が作成されてFigmaに変換される", () => {
  const caption = CaptionElement.create();

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption");
  expect(config.children?.length ?? 0).toBe(0);
});

test("caption要素がid属性を持つ場合、Figmaノード名に反映される", () => {
  const caption = CaptionElement.create({ id: "table-caption" });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.name).toBe("caption#table-caption");
});

test("caption要素がclassName属性を持つ場合、正しく変換される", () => {
  const caption = CaptionElement.create({ className: "bold-caption" });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption");
});

test("caption要素に子要素を持つ場合も正しく変換される", () => {
  const caption: CaptionElement = {
    type: "element",
    tagName: "caption",
    attributes: {},
    children: [{ type: "text", content: "テーブルの説明" }],
  };

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption");
});

test("caption要素が複数の属性を持つ場合も正しく変換される", () => {
  const caption = CaptionElement.create({
    id: "main-caption",
    className: "styled-caption",
    style: "text-align: center; font-weight: bold;",
  });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption#main-caption");
});
