import { test, expect } from "vitest";
import { AudioAttributes } from "../audio-attributes";

// parseSize
test("AudioAttributes.parseSize: 属性が空の場合、デフォルトサイズ300x54pxを返す", () => {
  const attributes: AudioAttributes = {};
  const result = AudioAttributes.parseSize(attributes);

  expect(result.width).toBe(300);
  expect(result.height).toBe(54);
});

test("AudioAttributes.parseSize: width属性が指定された場合、その値を適用しheightはデフォルトを使用する", () => {
  const attributes: AudioAttributes = { width: "400" };
  const result = AudioAttributes.parseSize(attributes);

  expect(result.width).toBe(400);
  expect(result.height).toBe(54);
});

test("AudioAttributes.parseSize: height属性が指定された場合、その値を適用しwidthはデフォルトを使用する", () => {
  const attributes: AudioAttributes = { height: "80" };
  const result = AudioAttributes.parseSize(attributes);

  expect(result.width).toBe(300);
  expect(result.height).toBe(80);
});

test("AudioAttributes.parseSize: widthとheight両方が指定された場合、両方の値を適用する", () => {
  const attributes: AudioAttributes = { width: "500", height: "60" };
  const result = AudioAttributes.parseSize(attributes);

  expect(result.width).toBe(500);
  expect(result.height).toBe(60);
});

test("AudioAttributes.parseSize: 不正な値が指定された場合、デフォルトサイズを使用する", () => {
  const attributes: AudioAttributes = { width: "invalid", height: "abc" };
  const result = AudioAttributes.parseSize(attributes);

  expect(result.width).toBe(300);
  expect(result.height).toBe(54);
});

test("AudioAttributes.parseSize: CSSスタイルがHTML属性より優先される", () => {
  const attributes: AudioAttributes = {
    width: "200",
    height: "40",
    style: "width: 400px; height: 80px;",
  };
  const result = AudioAttributes.parseSize(attributes);

  expect(result.width).toBe(400);
  expect(result.height).toBe(80);
});

// isValidUrl
test("AudioAttributes.isValidUrl: https URLの場合、trueを返す", () => {
  expect(AudioAttributes.isValidUrl("https://example.com/audio.mp3")).toBe(
    true,
  );
});

test("AudioAttributes.isValidUrl: http URLの場合、trueを返す", () => {
  expect(AudioAttributes.isValidUrl("http://example.com/audio.mp3")).toBe(true);
});

test("AudioAttributes.isValidUrl: 相対URLの場合、trueを返す", () => {
  expect(AudioAttributes.isValidUrl("/audio/track.mp3")).toBe(true);
  expect(AudioAttributes.isValidUrl("./audio.mp3")).toBe(true);
  expect(AudioAttributes.isValidUrl("../audio.mp3")).toBe(true);
});

test("AudioAttributes.isValidUrl: data:audio URLの場合、trueを返す", () => {
  expect(AudioAttributes.isValidUrl("data:audio/mp3;base64,ABC")).toBe(true);
});

test("AudioAttributes.isValidUrl: data:image URLの場合、falseを返す（audio要素では音声のみ許可）", () => {
  expect(AudioAttributes.isValidUrl("data:image/png;base64,ABC")).toBe(false);
});

test("AudioAttributes.isValidUrl: javascript: URLの場合、falseを返す", () => {
  expect(AudioAttributes.isValidUrl("javascript:alert(1)")).toBe(false);
});

test("AudioAttributes.isValidUrl: 空文字の場合、falseを返す", () => {
  expect(AudioAttributes.isValidUrl("")).toBe(false);
});

test("AudioAttributes.isValidUrl: undefinedの場合、falseを返す", () => {
  expect(AudioAttributes.isValidUrl(undefined)).toBe(false);
});

test("AudioAttributes.isValidUrl: XSS攻撃パターンの場合、falseを返す", () => {
  expect(AudioAttributes.isValidUrl("<script>")).toBe(false);
  expect(AudioAttributes.isValidUrl("test<img>")).toBe(false);
});

// hasControls
test("AudioAttributes.hasControls: controls属性がtrueの場合、trueを返す", () => {
  const attributes: AudioAttributes = { controls: true };
  expect(AudioAttributes.hasControls(attributes)).toBe(true);
});

test("AudioAttributes.hasControls: controls属性がfalseの場合、falseを返す", () => {
  const attributes: AudioAttributes = { controls: false };
  expect(AudioAttributes.hasControls(attributes)).toBe(false);
});

test("AudioAttributes.hasControls: controls属性がundefinedの場合、falseを返す", () => {
  const attributes: AudioAttributes = {};
  expect(AudioAttributes.hasControls(attributes)).toBe(false);
});

// getAudioSrc
test("AudioAttributes.getAudioSrc: 有効なsrc属性がある場合、その値を返す", () => {
  const attributes: AudioAttributes = {
    src: "https://example.com/audio.mp3",
  };
  expect(AudioAttributes.getAudioSrc(attributes)).toBe(
    "https://example.com/audio.mp3",
  );
});

test("AudioAttributes.getAudioSrc: 無効なsrc属性の場合、nullを返す", () => {
  const attributes: AudioAttributes = { src: "javascript:alert(1)" };
  expect(AudioAttributes.getAudioSrc(attributes)).toBeNull();
});

test("AudioAttributes.getAudioSrc: src属性がない場合、nullを返す", () => {
  const attributes: AudioAttributes = {};
  expect(AudioAttributes.getAudioSrc(attributes)).toBeNull();
});

// getPreload
test("AudioAttributes.getPreload: preload属性が指定された場合、その値を返す", () => {
  const attributes: AudioAttributes = { preload: "none" };
  expect(AudioAttributes.getPreload(attributes)).toBe("none");
});

test("AudioAttributes.getPreload: preload属性がない場合、デフォルトのautoを返す", () => {
  const attributes: AudioAttributes = {};
  expect(AudioAttributes.getPreload(attributes)).toBe("auto");
});

// getBorder
test("AudioAttributes.getBorder: ボーダースタイルがある場合、ボーダー情報を返す", () => {
  const attributes: AudioAttributes = {
    style: "border: 2px solid #000000;",
  };
  const border = AudioAttributes.getBorder(attributes);

  expect(border).not.toBeNull();
  expect(border?.width).toBe(2);
});

test("AudioAttributes.getBorder: スタイルがない場合、nullを返す", () => {
  const attributes: AudioAttributes = {};
  expect(AudioAttributes.getBorder(attributes)).toBeNull();
});

// getBorderRadius
test("AudioAttributes.getBorderRadius: border-radiusスタイルがある場合、角丸の値を返す", () => {
  const attributes: AudioAttributes = { style: "border-radius: 8px;" };
  expect(AudioAttributes.getBorderRadius(attributes)).toBe(8);
});

test("AudioAttributes.getBorderRadius: スタイルがない場合、nullを返す", () => {
  const attributes: AudioAttributes = {};
  expect(AudioAttributes.getBorderRadius(attributes)).toBeNull();
});
