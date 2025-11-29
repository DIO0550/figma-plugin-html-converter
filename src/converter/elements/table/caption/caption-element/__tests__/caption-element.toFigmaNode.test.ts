import { test, expect } from "vitest";
import { CaptionElement } from "../caption-element";

test("CaptionElement.toFigmaNode() - デフォルト属性でcaption要素を変換すると基本的なFrameNodeが生成される", () => {
  const element = CaptionElement.create();
  const config = CaptionElement.toFigmaNode(element);

  expect(config.name).toBe("caption");
  expect(config.type).toBe("FRAME");
});

test("CaptionElement.toFigmaNode() - style属性を持つcaption要素を変換すると正しくFrameNodeに変換される", () => {
  const element = CaptionElement.create({
    style: "text-align: center;",
  });
  const config = CaptionElement.toFigmaNode(element);

  expect(config.name).toBe("caption");
  expect(config.type).toBe("FRAME");
});

test("CaptionElement.toFigmaNode() - 複数の属性を持つcaption要素を変換すると正しくFrameNodeに変換される", () => {
  const element = CaptionElement.create({
    className: "caption-section",
    style: "font-weight: bold; text-align: center;",
  });
  const config = CaptionElement.toFigmaNode(element);

  expect(config.name).toBe("caption");
  expect(config.type).toBe("FRAME");
});

test("CaptionElement.toFigmaNode() - id属性を持つcaption要素を変換するとノード名にIDが含まれる", () => {
  const element = CaptionElement.create({ id: "table-caption" });
  const config = CaptionElement.toFigmaNode(element);

  expect(config.name).toBe("caption#table-caption");
});

test("CaptionElement.toFigmaNode() - className属性を持つcaption要素を変換すると正しくFrameNodeに変換される", () => {
  const element = CaptionElement.create({ className: "bold-caption" });
  const config = CaptionElement.toFigmaNode(element);

  expect(config.name).toBe("caption");
});
