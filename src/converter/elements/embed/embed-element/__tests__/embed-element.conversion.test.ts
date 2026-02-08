/**
 * embed要素のFigma変換テスト
 */

import { test, expect } from "vitest";
import { EmbedElement } from "../embed-element";

test(
  "EmbedElement.toFigmaNode - 基本生成時 - FRAMEノードとembed名を返す",
  () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("embed");
  },
);

test(
  "EmbedElement.toFigmaNode - サイズ未指定の場合 - デフォルトサイズを設定する",
  () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(300);
    expect(figmaNode.height).toBe(150);
  },
);

test(
  "EmbedElement.toFigmaNode - width/height属性指定 - サイズを反映する",
  () => {
    const element = EmbedElement.create({
      width: "640",
      height: "360",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(640);
    expect(figmaNode.height).toBe(360);
  },
);

test(
  "EmbedElement.toFigmaNode - プレースホルダー背景 - fillsを設定する",
  () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.fills).toBeDefined();
    expect(Array.isArray(figmaNode.fills)).toBe(true);
    expect(figmaNode.fills?.length).toBeGreaterThan(0);
  },
);

test(
  "EmbedElement.toFigmaNode - プレースホルダーアイコン - 子要素に含める",
  () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.children).toBeDefined();
    expect(Array.isArray(figmaNode.children)).toBe(true);
    expect(figmaNode.children?.length).toBeGreaterThan(0);
  },
);

test("EmbedElement.toFigmaNode - srcあり - URLラベルを含む", () => {
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

test("EmbedElement.toFigmaNode - typeあり - タイプラベルを含む", () => {
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

test(
  "EmbedElement.toFigmaNode - レイアウト設定 - 中央揃えの垂直レイアウト",
  () => {
    const element = EmbedElement.create({});
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  },
);

test("EmbedElement.toFigmaNode - type属性あり - ノード名に反映する", () => {
  const element = EmbedElement.create({ type: "video/mp4" });
  const figmaNode = EmbedElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("embed: video/mp4");
});

test("EmbedElement.mapToFigma - EmbedElement入力 - FRAMEノードを返す", () => {
  const element = EmbedElement.create({
    src: "https://example.com/video.mp4",
  });
  const figmaNode = EmbedElement.mapToFigma(element);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
});

test(
  "EmbedElement.mapToFigma - embed要素風オブジェクト - FRAMEノードを返す",
  () => {
    const rawNode = {
      type: "element",
      tagName: "embed",
      attributes: { src: "https://example.com/video.mp4" },
      children: [],
    };
    const figmaNode = EmbedElement.mapToFigma(rawNode);

    expect(figmaNode).not.toBeNull();
    expect(figmaNode?.type).toBe("FRAME");
  },
);

test("EmbedElement.mapToFigma - embed要素以外の場合 - nullを返す", () => {
  const element = {
    type: "element",
    tagName: "iframe",
    attributes: {},
    children: [],
  };
  const figmaNode = EmbedElement.mapToFigma(element);

  expect(figmaNode).toBeNull();
});

test("EmbedElement.mapToFigma - null入力 - nullを返す", () => {
  const figmaNode = EmbedElement.mapToFigma(null);
  expect(figmaNode).toBeNull();
});

test(
  "EmbedElement.createPlaceholder - 呼び出し - アイコンFRAMEを生成する",
  () => {
    const placeholder = EmbedElement.createPlaceholder();

    expect(placeholder.type).toBe("FRAME");
    expect(placeholder.name).toBe("embed-icon");
    expect(placeholder.width).toBe(48);
    expect(placeholder.height).toBe(48);
  },
);

test("EmbedElement.createPlaceholder - 背景設定 - fillsを持つ", () => {
  const placeholder = EmbedElement.createPlaceholder();

  expect(placeholder.fills).toBeDefined();
  expect(Array.isArray(placeholder.fills)).toBe(true);
});

test("EmbedElement.createPlaceholder - 枠線設定 - strokeを持つ", () => {
  const placeholder = EmbedElement.createPlaceholder();

  expect(placeholder.strokes).toBeDefined();
  expect(placeholder.strokeWeight).toBe(2);
});

test("EmbedElement.createUrlLabel - URL入力 - テキストラベル生成", () => {
  const label = EmbedElement.createUrlLabel("https://example.com/video.mp4");

  expect(label.type).toBe("TEXT");
  expect(label.name).toBe("url-label");
  expect(label.characters).toContain("example.com");
});

test("EmbedElement.createUrlLabel - 長いURL - 省略表示する", () => {
  const longUrl =
    "https://example.com/very/long/path/that/exceeds/the/maximum/length/allowed/for/display/in/the/label";
  const label = EmbedElement.createUrlLabel(longUrl);

  expect(label.characters?.length).toBeLessThanOrEqual(53); // 50 + "..."
  expect(label.characters).toContain("...");
});

test("EmbedElement.createTypeLabel - type入力 - テキストラベル生成", () => {
  const label = EmbedElement.createTypeLabel("application/pdf");

  expect(label.type).toBe("TEXT");
  expect(label.name).toBe("type-label");
  expect(label.characters).toBe("application/pdf");
});

test("EmbedElement.applyStyles - borderスタイル - strokeを設定する", () => {
  const element = EmbedElement.create({
    style: "border: 2px solid #333;",
  });
  const figmaNode = EmbedElement.toFigmaNode(element);

  expect(figmaNode.strokes).toBeDefined();
  expect(figmaNode.strokeWeight).toBe(2);
});

test(
  "EmbedElement.applyStyles - border-radiusスタイル - cornerRadiusを設定する",
  () => {
    const element = EmbedElement.create({
      style: "border-radius: 8px;",
    });
    const figmaNode = EmbedElement.toFigmaNode(element);

    expect(figmaNode.cornerRadius).toBe(8);
  },
);
