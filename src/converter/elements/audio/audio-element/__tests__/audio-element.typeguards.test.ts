import { describe, it, expect } from "vitest";
import { AudioElement } from "../audio-element";

describe("AudioElement.isAudioElement", () => {
  it("有効なAudioElementを判定する", () => {
    const element = AudioElement.create({ src: "audio.mp3" });
    expect(AudioElement.isAudioElement(element)).toBe(true);
  });

  it("tagNameがaudioでない場合はfalse", () => {
    const element = {
      type: "element",
      tagName: "video",
      attributes: {},
      children: [],
    };
    expect(AudioElement.isAudioElement(element)).toBe(false);
  });

  it("typeがelementでない場合はfalse", () => {
    const element = {
      type: "text",
      tagName: "audio",
      attributes: {},
      children: [],
    };
    expect(AudioElement.isAudioElement(element)).toBe(false);
  });

  it("nullの場合はfalse", () => {
    expect(AudioElement.isAudioElement(null)).toBe(false);
  });

  it("undefinedの場合はfalse", () => {
    expect(AudioElement.isAudioElement(undefined)).toBe(false);
  });

  it("オブジェクトでない場合はfalse", () => {
    expect(AudioElement.isAudioElement("string")).toBe(false);
    expect(AudioElement.isAudioElement(123)).toBe(false);
  });
});
