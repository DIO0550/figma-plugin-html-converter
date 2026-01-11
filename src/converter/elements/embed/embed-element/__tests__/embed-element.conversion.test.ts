/**
 * embed要素のFigma変換テスト
 */

import { describe, test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

describe("EmbedElement.toFigmaNode", () => {
  test("基本的なFRAMEノードを生成する", () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("embed");
  });

  test("デフォルトサイズ（300x150）を設定する", () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(300);
    expect(figmaNode.height).toBe(150);
  });

  test("width/height属性を反映する", () => {
    const element = EmbedElement.create({
      width: "640",
      height: "360",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(640);
    expect(figmaNode.height).toBe(360);
  });

  test("プレースホルダーの背景色を設定する", () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.fills).toBeDefined();
    expect(Array.isArray(figmaNode.fills)).toBe(true);
    expect(figmaNode.fills?.length).toBeGreaterThan(0);
  });

  test("プレースホルダーアイコンを子要素として含む", () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.children).toBeDefined();
    expect(Array.isArray(figmaNode.children)).toBe(true);
    expect(figmaNode.children?.length).toBeGreaterThan(0);
  });

  test("srcがある場合はURLラベルを含む", () => {
    const element = EmbedElement.create({
      src: "https://example.com/video.mp4",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.children).toBeDefined();
    expect(figmaNode.children?.length).toBe(2);

    const urlLabel = figmaNode.children?.[1];
    expect(urlLabel?.type).toBe("TEXT");
    expect(urlLabel?.characters).toContain("example.com");
  });

  test("typeがある場合はタイプラベルを含む", () => {
    const element = EmbedElement.create({
      type: "application/pdf",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.children).toBeDefined();
    const typeLabel = figmaNode.children?.find(
      (child) => child.name === "type-label",
    );
    expect(typeLabel).toBeDefined();
    expect(typeLabel?.characters).toContain("application/pdf");
  });

  test("垂直レイアウトで中央揃えに設定する", () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  });

  test("ノード名にtype属性を反映する", () => {
    const element = EmbedElement.create({ type: "video/mp4" });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.name).toBe("embed: video/mp4");
  });
});

describe("EmbedElement.mapToFigma", () => {
  test("EmbedElementを正しく変換する", () => {
    const element = EmbedElement.create({
      src: "https://example.com/video.mp4",
    });
    const figmaNode = EmbedElement.mapToFigma(element);

    expect(figmaNode).not.toBeNull();
    expect(figmaNode?.type).toBe("FRAME");
  });

  test("embed要素風のオブジェクトを変換できる", () => {
    const rawNode = {
      type: "element",
      tagName: "embed",
      attributes: { src: "https://example.com/video.mp4" },
      children: [],
    };
    const figmaNode = EmbedElement.mapToFigma(rawNode);

    expect(figmaNode).not.toBeNull();
    expect(figmaNode?.type).toBe("FRAME");
  });

  test("embed要素でない場合はnullを返す", () => {
    const element = {
      type: "element",
      tagName: "iframe",
      attributes: {},
      children: [],
    };
    const figmaNode = EmbedElement.mapToFigma(element);

    expect(figmaNode).toBeNull();
  });

  test("nullの場合はnullを返す", () => {
    const figmaNode = EmbedElement.mapToFigma(null);
    expect(figmaNode).toBeNull();
  });
});

describe("EmbedElement.createPlaceholder", () => {
  test("プレースホルダーアイコンを生成する", () => {
    const placeholder = EmbedElement.createPlaceholder();

    expect(placeholder.type).toBe("FRAME");
    expect(placeholder.name).toBe("embed-icon");
    expect(placeholder.width).toBe(48);
    expect(placeholder.height).toBe(48);
  });

  test("プレースホルダーに背景色を設定する", () => {
    const placeholder = EmbedElement.createPlaceholder();

    expect(placeholder.fills).toBeDefined();
    expect(Array.isArray(placeholder.fills)).toBe(true);
  });

  test("プレースホルダーに枠線を設定する", () => {
    const placeholder = EmbedElement.createPlaceholder();

    expect(placeholder.strokes).toBeDefined();
    expect(placeholder.strokeWeight).toBe(2);
  });
});

describe("EmbedElement.createUrlLabel", () => {
  test("URLラベルを生成する", () => {
    const label = EmbedElement.createUrlLabel("https://example.com/video.mp4");

    expect(label.type).toBe("TEXT");
    expect(label.name).toBe("url-label");
    expect(label.characters).toContain("example.com");
  });

  test("長いURLは切り捨てる", () => {
    const longUrl =
      "https://example.com/very/long/path/that/exceeds/the/maximum/length/allowed/for/display/in/the/label";
    const label = EmbedElement.createUrlLabel(longUrl);

    expect(label.characters?.length).toBeLessThanOrEqual(53); // 50 + "..."
    expect(label.characters).toContain("...");
  });
});

describe("EmbedElement.createTypeLabel", () => {
  test("タイプラベルを生成する", () => {
    const label = EmbedElement.createTypeLabel("application/pdf");

    expect(label.type).toBe("TEXT");
    expect(label.name).toBe("type-label");
    expect(label.characters).toBe("application/pdf");
  });
});

describe("EmbedElement.applyStyles", () => {
  test("ボーダースタイルを適用する", () => {
    const element = EmbedElement.create({
      style: "border: 2px solid #333;",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.strokes).toBeDefined();
    expect(figmaNode.strokeWeight).toBe(2);
  });

  test("角丸スタイルを適用する", () => {
    const element = EmbedElement.create({
      style: "border-radius: 8px;",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.cornerRadius).toBe(8);
  });
});
