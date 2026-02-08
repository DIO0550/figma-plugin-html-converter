/**
 * embed要素の属性定義テスト
 */

import { test, expect } from "vitest";
import { EmbedAttributes } from "../embed-attributes";

test(
  "EmbedAttributes.parseSize - width/height未指定 - デフォルトサイズを返す",
  () => {
    const attributes: EmbedAttributes = {};
    const { width, height } = EmbedAttributes.parseSize(attributes);
    expect(width).toBe(300);
    expect(height).toBe(150);
  },
);

test("EmbedAttributes.parseSize - width属性指定 - widthを解析する", () => {
  const attributes: EmbedAttributes = { width: "640" };
  const { width, height } = EmbedAttributes.parseSize(attributes);
  expect(width).toBe(640);
  expect(height).toBe(150);
});

test(
  "EmbedAttributes.parseSize - height属性指定 - heightを解析する",
  () => {
    const attributes: EmbedAttributes = { height: "360" };
    const { width, height } = EmbedAttributes.parseSize(attributes);
    expect(width).toBe(300);
    expect(height).toBe(360);
  },
);

test(
  "EmbedAttributes.parseSize - width/height属性指定 - 両方を解析する",
  () => {
    const attributes: EmbedAttributes = { width: "800", height: "600" };
    const { width, height } = EmbedAttributes.parseSize(attributes);
    expect(width).toBe(800);
    expect(height).toBe(600);
  },
);

test(
  "EmbedAttributes.parseSize - 無効なwidth値 - デフォルトwidthを使用する",
  () => {
    const attributes: EmbedAttributes = { width: "invalid" };
    const { width } = EmbedAttributes.parseSize(attributes);
    expect(width).toBe(300);
  },
);

test(
  "EmbedAttributes.parseSize - 無効なheight値 - デフォルトheightを使用する",
  () => {
    const attributes: EmbedAttributes = { height: "invalid" };
    const { height } = EmbedAttributes.parseSize(attributes);
    expect(height).toBe(150);
  },
);

test("EmbedAttributes.parseSize - 負の値 - デフォルトサイズを使用する", () => {
  const attributes: EmbedAttributes = { width: "-100", height: "-50" };
  const { width, height } = EmbedAttributes.parseSize(attributes);
  expect(width).toBe(300);
  expect(height).toBe(150);
});

test("EmbedAttributes.parseSize - 0指定 - デフォルトサイズを使用する", () => {
  const attributes: EmbedAttributes = { width: "0", height: "0" };
  const { width, height } = EmbedAttributes.parseSize(attributes);
  expect(width).toBe(300);
  expect(height).toBe(150);
});

test(
  "EmbedAttributes.parseSize - styleのwidth指定 - styleを優先する",
  () => {
    const attributes: EmbedAttributes = {
      width: "640",
      style: "width: 800px;",
    };
    const { width } = EmbedAttributes.parseSize(attributes);
    expect(width).toBe(800);
  },
);

test(
  "EmbedAttributes.parseSize - styleのheight指定 - styleを優先する",
  () => {
    const attributes: EmbedAttributes = {
      height: "360",
      style: "height: 480px;",
    };
    const { height } = EmbedAttributes.parseSize(attributes);
    expect(height).toBe(480);
  },
);

test("EmbedAttributes.getSrc - src属性あり - srcを返す", () => {
  const attributes: EmbedAttributes = {
    src: "https://example.com/video.mp4",
  };
  expect(EmbedAttributes.getSrc(attributes)).toBe(
    "https://example.com/video.mp4",
  );
});

test("EmbedAttributes.getSrc - src未設定 - nullを返す", () => {
  const attributes: EmbedAttributes = {};
  expect(EmbedAttributes.getSrc(attributes)).toBeNull();
});

test("EmbedAttributes.getSrc - javascript:URL - nullを返す", () => {
  const attributes: EmbedAttributes = { src: "javascript:alert(1)" };
  expect(EmbedAttributes.getSrc(attributes)).toBeNull();
});

test("EmbedAttributes.getSrc - data:URL - nullを返す", () => {
  const attributes: EmbedAttributes = {
    src: "data:text/html,<h1>Hello</h1>",
  };
  expect(EmbedAttributes.getSrc(attributes)).toBeNull();
});

test("EmbedAttributes.getSrc - 相対パス - そのまま返す", () => {
  const attributes: EmbedAttributes = { src: "/videos/sample.mp4" };
  expect(EmbedAttributes.getSrc(attributes)).toBe("/videos/sample.mp4");
});

test("EmbedAttributes.getType - type属性あり - typeを返す", () => {
  const attributes: EmbedAttributes = { type: "video/mp4" };
  expect(EmbedAttributes.getType(attributes)).toBe("video/mp4");
});

test("EmbedAttributes.getType - type未設定 - nullを返す", () => {
  const attributes: EmbedAttributes = {};
  expect(EmbedAttributes.getType(attributes)).toBeNull();
});

test("EmbedAttributes.getType - application/pdf - typeを返す", () => {
  const attributes: EmbedAttributes = { type: "application/pdf" };
  expect(EmbedAttributes.getType(attributes)).toBe("application/pdf");
});

test("EmbedAttributes.getBorder - style属性あり - border情報を返す", () => {
  const attributes: EmbedAttributes = { style: "border: 1px solid #000" };
  const border = EmbedAttributes.getBorder(attributes);
  expect(border).not.toBeNull();
  expect(border?.width).toBe(1);
});

test("EmbedAttributes.getBorder - style未設定 - nullを返す", () => {
  const attributes: EmbedAttributes = {};
  expect(EmbedAttributes.getBorder(attributes)).toBeNull();
});

test(
  "EmbedAttributes.getBorderRadius - style属性あり - 角丸を返す",
  () => {
    const attributes: EmbedAttributes = { style: "border-radius: 8px" };
    const borderRadius = EmbedAttributes.getBorderRadius(attributes);
    expect(borderRadius).toBe(8);
  },
);

test("EmbedAttributes.getBorderRadius - style未設定 - nullを返す", () => {
  const attributes: EmbedAttributes = {};
  expect(EmbedAttributes.getBorderRadius(attributes)).toBeNull();
});
