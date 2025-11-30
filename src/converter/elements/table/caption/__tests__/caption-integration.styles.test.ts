import { test, expect } from "vitest";
import { CaptionElement } from "../caption-element";

test("caption要素にstyle属性がある場合、Figmaに変換される", () => {
  const caption = CaptionElement.create({
    style: "text-align: center;",
  });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption");
});

test("caption要素に複数のスタイルがある場合、正しく変換される", () => {
  const caption = CaptionElement.create({
    style: "text-align: center; font-weight: bold; color: #333;",
  });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
  expect(config.name).toBe("caption");
});

test("caption要素にbackground-colorスタイルがある場合", () => {
  const caption = CaptionElement.create({
    style: "background-color: #f0f0f0;",
  });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
});

test("caption要素にpaddingスタイルがある場合", () => {
  const caption = CaptionElement.create({
    style: "padding: 10px;",
  });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
});

test("caption要素にborderスタイルがある場合", () => {
  const caption = CaptionElement.create({
    style: "border-bottom: 1px solid #ccc;",
  });

  const config = CaptionElement.toFigmaNode(caption);

  expect(config.type).toBe("FRAME");
});
