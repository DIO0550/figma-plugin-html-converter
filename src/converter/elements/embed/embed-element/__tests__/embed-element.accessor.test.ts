/**
 * embed要素のアクセサテスト
 */

import { test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

test("EmbedElement.getSrc - src属性あり - srcを返す", () => {
  const element = EmbedElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(EmbedElement.getSrc(element)).toBe("https://example.com/video.mp4");
});

test("EmbedElement.getSrc - src未設定の場合 - undefinedを返す", () => {
  const element = EmbedElement.create({});
  expect(EmbedElement.getSrc(element)).toBeUndefined();
});

test("EmbedElement.getWidth - width属性あり - widthを返す", () => {
  const element = EmbedElement.create({ width: "640" });
  expect(EmbedElement.getWidth(element)).toBe("640");
});

test("EmbedElement.getWidth - width未設定の場合 - undefinedを返す", () => {
  const element = EmbedElement.create({});
  expect(EmbedElement.getWidth(element)).toBeUndefined();
});

test("EmbedElement.getHeight - height属性あり - heightを返す", () => {
  const element = EmbedElement.create({ height: "360" });
  expect(EmbedElement.getHeight(element)).toBe("360");
});

test("EmbedElement.getHeight - height未設定の場合 - undefinedを返す", () => {
  const element = EmbedElement.create({});
  expect(EmbedElement.getHeight(element)).toBeUndefined();
});

test("EmbedElement.getType - type属性あり - typeを返す", () => {
  const element = EmbedElement.create({ type: "video/mp4" });
  expect(EmbedElement.getType(element)).toBe("video/mp4");
});

test("EmbedElement.getType - type未設定の場合 - undefinedを返す", () => {
  const element = EmbedElement.create({});
  expect(EmbedElement.getType(element)).toBeUndefined();
});

test("EmbedElement.getStyle - style属性あり - styleを返す", () => {
  const element = EmbedElement.create({ style: "width: 100%;" });
  expect(EmbedElement.getStyle(element)).toBe("width: 100%;");
});

test("EmbedElement.getStyle - style未設定の場合 - undefinedを返す", () => {
  const element = EmbedElement.create({});
  expect(EmbedElement.getStyle(element)).toBeUndefined();
});

test(
  "EmbedElement.getNodeName - type属性がある場合 - embed: type形式で返す",
  () => {
    const element = EmbedElement.create({ type: "video/mp4" });
    expect(EmbedElement.getNodeName(element)).toBe("embed: video/mp4");
  },
);

test("EmbedElement.getNodeName - srcのみの場合 - ホスト名を返す", () => {
  const element = EmbedElement.create({
    src: "https://example.com/video.mp4",
  });
  expect(EmbedElement.getNodeName(element)).toBe("embed: example.com");
});

test(
  "EmbedElement.getNodeName - typeとsrcがある場合 - typeを優先して返す",
  () => {
    const element = EmbedElement.create({
      src: "https://example.com/video.mp4",
      type: "application/pdf",
    });
    expect(EmbedElement.getNodeName(element)).toBe("embed: application/pdf");
  },
);

test("EmbedElement.getNodeName - typeもsrcもない場合 - embedを返す", () => {
  const element = EmbedElement.create({});
  expect(EmbedElement.getNodeName(element)).toBe("embed");
});

test("EmbedElement.getNodeName - 不正なsrcの場合 - embedを返す", () => {
  const element = EmbedElement.create({ src: "invalid-url" });
  expect(EmbedElement.getNodeName(element)).toBe("embed");
});
