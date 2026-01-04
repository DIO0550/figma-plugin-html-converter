import { it, expect } from "vitest";
import { AudioElement } from "../audio-element";

// getSourceFromChildren
it("AudioElement.getSourceFromChildren: source子要素からsrcを取得する", () => {
  const element = AudioElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: {
        src: "https://example.com/audio.mp3",
        type: "audio/mpeg",
      },
    },
  ]);

  expect(AudioElement.getSourceFromChildren(element)).toBe(
    "https://example.com/audio.mp3",
  );
});

it("AudioElement.getSourceFromChildren: 複数のsource子要素がある場合、最初の有効なsrcを返す", () => {
  const element = AudioElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "audio.mp3", type: "audio/mpeg" },
    },
    {
      type: "element",
      tagName: "source",
      attributes: { src: "audio.ogg", type: "audio/ogg" },
    },
  ]);

  expect(AudioElement.getSourceFromChildren(element)).toBe("audio.mp3");
});

it("AudioElement.getSourceFromChildren: source子要素がない場合、nullを返す", () => {
  const element = AudioElement.create({}, []);
  expect(AudioElement.getSourceFromChildren(element)).toBeNull();
});

it("AudioElement.getSourceFromChildren: source以外の子要素は無視する", () => {
  const element = AudioElement.create({}, [
    {
      type: "element",
      tagName: "track",
      attributes: { src: "subtitles.vtt" },
    },
  ]);

  expect(AudioElement.getSourceFromChildren(element)).toBeNull();
});

it("AudioElement.getSourceFromChildren: 無効なURLのsourceは無視して次の有効なsourceを返す", () => {
  const element = AudioElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "javascript:alert(1)" },
    },
    {
      type: "element",
      tagName: "source",
      attributes: { src: "valid-audio.mp3" },
    },
  ]);

  expect(AudioElement.getSourceFromChildren(element)).toBe("valid-audio.mp3");
});

// getAudioSource
it("AudioElement.getAudioSource: src属性とsource子要素の両方がある場合、src属性を優先して返す", () => {
  const element = AudioElement.create({ src: "main-audio.mp3" }, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "fallback-audio.mp3" },
    },
  ]);

  expect(AudioElement.getAudioSource(element)).toBe("main-audio.mp3");
});

it("AudioElement.getAudioSource: src属性がない場合、source子要素から取得する", () => {
  const element = AudioElement.create({}, [
    {
      type: "element",
      tagName: "source",
      attributes: { src: "fallback-audio.mp3" },
    },
  ]);

  expect(AudioElement.getAudioSource(element)).toBe("fallback-audio.mp3");
});

it("AudioElement.getAudioSource: src属性もsource子要素もない場合、nullを返す", () => {
  const element = AudioElement.create({}, []);
  expect(AudioElement.getAudioSource(element)).toBeNull();
});
