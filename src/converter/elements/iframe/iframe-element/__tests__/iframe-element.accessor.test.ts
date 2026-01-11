import { test, expect } from "vitest";
import { IframeElement } from "../iframe-element";

// getSrc テスト
test("getSrc: src属性がある場合はその値を返す", () => {
  const element = IframeElement.create({ src: "https://example.com" });
  expect(IframeElement.getSrc(element)).toBe("https://example.com");
});

test("getSrc: src属性がない場合はundefinedを返す", () => {
  const element = IframeElement.create({});
  expect(IframeElement.getSrc(element)).toBeUndefined();
});

// getWidth テスト
test("getWidth: width属性がある場合はその値を返す", () => {
  const element = IframeElement.create({ width: "640" });
  expect(IframeElement.getWidth(element)).toBe("640");
});

test("getWidth: width属性がない場合はundefinedを返す", () => {
  const element = IframeElement.create({});
  expect(IframeElement.getWidth(element)).toBeUndefined();
});

// getHeight テスト
test("getHeight: height属性がある場合はその値を返す", () => {
  const element = IframeElement.create({ height: "480" });
  expect(IframeElement.getHeight(element)).toBe("480");
});

test("getHeight: height属性がない場合はundefinedを返す", () => {
  const element = IframeElement.create({});
  expect(IframeElement.getHeight(element)).toBeUndefined();
});

// getTitle テスト
test("getTitle: title属性がある場合はその値を返す", () => {
  const element = IframeElement.create({ title: "Embedded Content" });
  expect(IframeElement.getTitle(element)).toBe("Embedded Content");
});

test("getTitle: title属性がない場合はundefinedを返す", () => {
  const element = IframeElement.create({});
  expect(IframeElement.getTitle(element)).toBeUndefined();
});

// getStyle テスト
test("getStyle: style属性がある場合はその値を返す", () => {
  const element = IframeElement.create({ style: "border: none;" });
  expect(IframeElement.getStyle(element)).toBe("border: none;");
});

test("getStyle: style属性がない場合はundefinedを返す", () => {
  const element = IframeElement.create({});
  expect(IframeElement.getStyle(element)).toBeUndefined();
});

// getNodeName テスト
test("getNodeName: title属性がある場合はそれを使用する", () => {
  const element = IframeElement.create({
    title: "YouTube Video",
    src: "https://www.youtube.com/embed/xyz",
  });
  expect(IframeElement.getNodeName(element)).toBe("iframe: YouTube Video");
});

test("getNodeName: title属性がなくsrc属性がある場合はドメイン名を使用する", () => {
  const element = IframeElement.create({
    src: "https://www.youtube.com/embed/xyz",
  });
  expect(IframeElement.getNodeName(element)).toBe("iframe: www.youtube.com");
});

test("getNodeName: title/src両方ない場合はデフォルト名を返す", () => {
  const element = IframeElement.create({});
  expect(IframeElement.getNodeName(element)).toBe("iframe");
});

test("getNodeName: 無効なURLの場合はデフォルト名を返す", () => {
  const element = IframeElement.create({
    src: "javascript:alert(1)",
  });
  expect(IframeElement.getNodeName(element)).toBe("iframe");
});

test("getNodeName: 相対URLの場合はデフォルト名を返す", () => {
  const element = IframeElement.create({ src: "/embed/video" });
  expect(IframeElement.getNodeName(element)).toBe("iframe");
});

test("getNodeName: ./で始まる相対URLの場合はデフォルト名を返す", () => {
  const element = IframeElement.create({ src: "./embed/video" });
  expect(IframeElement.getNodeName(element)).toBe("iframe");
});

test("getNodeName: ../で始まる相対URLの場合はデフォルト名を返す", () => {
  const element = IframeElement.create({ src: "../embed/video" });
  expect(IframeElement.getNodeName(element)).toBe("iframe");
});
