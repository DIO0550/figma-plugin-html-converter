import { test, expect } from "vitest";
import { AudioElement } from "../audio-element";

test("AudioElement.isAudioElement: 有効なAudioElementの場合、trueを返す", () => {
  const element = AudioElement.create({ src: "audio.mp3" });
  expect(AudioElement.isAudioElement(element)).toBe(true);
});

test("AudioElement.isAudioElement: tagNameがaudioでない場合、falseを返す", () => {
  const element = {
    type: "element",
    tagName: "video",
    attributes: {},
    children: [],
  };
  expect(AudioElement.isAudioElement(element)).toBe(false);
});

test("AudioElement.isAudioElement: typeがelementでない場合、falseを返す", () => {
  const element = {
    type: "text",
    tagName: "audio",
    attributes: {},
    children: [],
  };
  expect(AudioElement.isAudioElement(element)).toBe(false);
});

test("AudioElement.isAudioElement: nullの場合、falseを返す", () => {
  expect(AudioElement.isAudioElement(null)).toBe(false);
});

test("AudioElement.isAudioElement: undefinedの場合、falseを返す", () => {
  expect(AudioElement.isAudioElement(undefined)).toBe(false);
});

test("AudioElement.isAudioElement: オブジェクトでない場合、falseを返す", () => {
  expect(AudioElement.isAudioElement("string")).toBe(false);
  expect(AudioElement.isAudioElement(123)).toBe(false);
});
