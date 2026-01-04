import { describe, it, expect } from "vitest";
import { AudioElement } from "../audio-element";

describe("AudioElement.create", () => {
  it("空の属性でAudioElementを作成する", () => {
    const element = AudioElement.create();

    expect(element.type).toBe("element");
    expect(element.tagName).toBe("audio");
    expect(element.attributes).toEqual({});
    expect(element.children).toEqual([]);
  });

  it("属性付きでAudioElementを作成する", () => {
    const element = AudioElement.create({
      src: "https://example.com/audio.mp3",
      controls: true,
    });

    expect(element.attributes.src).toBe("https://example.com/audio.mp3");
    expect(element.attributes.controls).toBe(true);
  });

  it("子要素付きでAudioElementを作成する", () => {
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
});
