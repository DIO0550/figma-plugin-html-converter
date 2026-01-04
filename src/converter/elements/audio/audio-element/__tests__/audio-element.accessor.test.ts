import { it, expect } from "vitest";
import { AudioElement } from "../audio-element";

// getSrc
it("AudioElement.getSrc: src属性がある場合、その値を返す", () => {
  const element = AudioElement.create({
    src: "https://example.com/audio.mp3",
  });
  expect(AudioElement.getSrc(element)).toBe("https://example.com/audio.mp3");
});

it("AudioElement.getSrc: src属性がない場合、undefinedを返す", () => {
  const element = AudioElement.create();
  expect(AudioElement.getSrc(element)).toBeUndefined();
});

// getWidth
it("AudioElement.getWidth: width属性がある場合、その値を返す", () => {
  const element = AudioElement.create({ width: "400" });
  expect(AudioElement.getWidth(element)).toBe("400");
});

// getHeight
it("AudioElement.getHeight: height属性がある場合、その値を返す", () => {
  const element = AudioElement.create({ height: "60" });
  expect(AudioElement.getHeight(element)).toBe("60");
});

// hasControls
it("AudioElement.hasControls: controls属性がtrueの場合、trueを返す", () => {
  const element = AudioElement.create({ controls: true });
  expect(AudioElement.hasControls(element)).toBe(true);
});

it("AudioElement.hasControls: controls属性がない場合、falseを返す", () => {
  const element = AudioElement.create();
  expect(AudioElement.hasControls(element)).toBe(false);
});

// getStyle
it("AudioElement.getStyle: style属性がある場合、その値を返す", () => {
  const element = AudioElement.create({ style: "width: 400px;" });
  expect(AudioElement.getStyle(element)).toBe("width: 400px;");
});

// getNodeName
it("AudioElement.getNodeName: title属性がある場合、'audio: {title}'形式の名前を返す", () => {
  const element = AudioElement.create({ title: "背景音楽" });
  expect(AudioElement.getNodeName(element)).toBe("audio: 背景音楽");
});

it("AudioElement.getNodeName: titleはないがsrcがある場合、ファイル名を含む'audio: {filename}'を返す", () => {
  const element = AudioElement.create({
    src: "https://example.com/music.mp3",
  });
  expect(AudioElement.getNodeName(element)).toBe("audio: music.mp3");
});

it("AudioElement.getNodeName: titleもsrcもない場合、'audio'のみを返す", () => {
  const element = AudioElement.create();
  expect(AudioElement.getNodeName(element)).toBe("audio");
});
