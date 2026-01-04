import { it, expect } from "vitest";
import { AudioElement } from "../audio-element";

it("AudioElement.create: 引数なしで呼び出すと、空の属性と子要素を持つAudioElementを作成する", () => {
  const element = AudioElement.create();

  expect(element.type).toBe("element");
  expect(element.tagName).toBe("audio");
  expect(element.attributes).toEqual({});
  expect(element.children).toEqual([]);
});

it("AudioElement.create: 属性を指定すると、その属性を持つAudioElementを作成する", () => {
  const element = AudioElement.create({
    src: "https://example.com/audio.mp3",
    controls: true,
  });

  expect(element.attributes.src).toBe("https://example.com/audio.mp3");
  expect(element.attributes.controls).toBe(true);
});

it("AudioElement.create: 子要素を指定すると、その子要素を持つAudioElementを作成する", () => {
  const children = [
    {
      type: "element" as const,
      tagName: "source",
      attributes: { src: "audio.mp3", type: "audio/mpeg" },
    },
  ];
  const element = AudioElement.create({}, children);

  expect(element.children).toHaveLength(1);
  expect(element.children[0].tagName).toBe("source");
});
