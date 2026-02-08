/**
 * object要素のFigma変換テスト
 */

import { test, expect } from "vitest";
import { ObjectElement } from "../object-element";

test(
  "ObjectElement.toFigmaNode - 基本生成時 - FRAMEノードとobject名を返す",
  () => {
    const element = ObjectElement.create({});
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.type).toBe("FRAME");
    expect(figmaNode.name).toBe("object");
  },
);

test(
  "ObjectElement.toFigmaNode - サイズ未指定の場合 - デフォルトサイズを設定する",
  () => {
    const element = ObjectElement.create({});
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(300);
    expect(figmaNode.height).toBe(150);
  },
);

test(
  "ObjectElement.toFigmaNode - width/height属性指定 - サイズを反映する",
  () => {
    const element = ObjectElement.create({
      width: "640",
      height: "360",
    });
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.width).toBe(640);
    expect(figmaNode.height).toBe(360);
  },
);

test(
  "ObjectElement.toFigmaNode - プレースホルダー背景 - fillsを設定する",
  () => {
    const element = ObjectElement.create({});
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.fills).toBeDefined();
    expect(Array.isArray(figmaNode.fills)).toBe(true);
    expect(figmaNode.fills?.length).toBeGreaterThan(0);
  },
);

test(
  "ObjectElement.toFigmaNode - プレースホルダーアイコン - 子要素に含める",
  () => {
    const element = ObjectElement.create({});
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.children).toBeDefined();
    expect(Array.isArray(figmaNode.children)).toBe(true);
    expect(figmaNode.children?.length).toBeGreaterThan(0);
  },
);

test("ObjectElement.toFigmaNode - dataあり - URLラベルを含む", () => {
  const element = ObjectElement.create({
    data: "https://example.com/content.swf",
  });
  const figmaNode = ObjectElement.toFigmaNode(element);

  expect(figmaNode.children).toBeDefined();
  expect(figmaNode.children?.length).toBe(2);

  const urlLabel = figmaNode.children?.[1];
  expect(urlLabel?.type).toBe("TEXT");
  expect(urlLabel?.characters).toContain("example.com");
});

test("ObjectElement.toFigmaNode - typeあり - タイプラベルを含む", () => {
  const element = ObjectElement.create({
    type: "application/pdf",
  });
  const figmaNode = ObjectElement.toFigmaNode(element);

  expect(figmaNode.children).toBeDefined();
  const typeLabel = figmaNode.children?.find(
    (child) => child.name === "type-label",
  );
  expect(typeLabel).toBeDefined();
  expect(typeLabel?.characters).toContain("application/pdf");
});

test(
  "ObjectElement.toFigmaNode - レイアウト設定 - 中央揃えの垂直レイアウト",
  () => {
    const element = ObjectElement.create({});
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.layoutMode).toBe("VERTICAL");
    expect(figmaNode.primaryAxisAlignItems).toBe("CENTER");
    expect(figmaNode.counterAxisAlignItems).toBe("CENTER");
  },
);

test("ObjectElement.toFigmaNode - name属性あり - ノード名に反映する", () => {
  const element = ObjectElement.create({ name: "myObject" });
  const figmaNode = ObjectElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("object: myObject");
});

test("ObjectElement.toFigmaNode - type属性あり - ノード名に反映する", () => {
  const element = ObjectElement.create({ type: "application/pdf" });
  const figmaNode = ObjectElement.toFigmaNode(element);

  expect(figmaNode.name).toBe("object: application/pdf");
});

test("ObjectElement.mapToFigma - ObjectElement入力 - FRAMEノードを返す", () => {
  const element = ObjectElement.create({
    data: "https://example.com/content.swf",
  });
  const figmaNode = ObjectElement.mapToFigma(element);

  expect(figmaNode).not.toBeNull();
  expect(figmaNode?.type).toBe("FRAME");
});

test(
  "ObjectElement.mapToFigma - object要素風オブジェクト - FRAMEノードを返す",
  () => {
    const rawNode = {
      type: "element",
      tagName: "object",
      attributes: { data: "https://example.com/content.swf" },
      children: [],
    };
    const figmaNode = ObjectElement.mapToFigma(rawNode);

    expect(figmaNode).not.toBeNull();
    expect(figmaNode?.type).toBe("FRAME");
  },
);

test(
  "ObjectElement.mapToFigma - object要素以外の場合 - nullを返す",
  () => {
    const element = {
      type: "element",
      tagName: "iframe",
      attributes: {},
      children: [],
    };
    const figmaNode = ObjectElement.mapToFigma(element);

    expect(figmaNode).toBeNull();
  },
);

test("ObjectElement.mapToFigma - null入力 - nullを返す", () => {
  const figmaNode = ObjectElement.mapToFigma(null);
  expect(figmaNode).toBeNull();
});

test(
  "ObjectElement.createPlaceholder - 呼び出し - アイコンFRAMEを生成する",
  () => {
    const placeholder = ObjectElement.createPlaceholder();

    expect(placeholder.type).toBe("FRAME");
    expect(placeholder.name).toBe("object-icon");
    expect(placeholder.width).toBe(48);
    expect(placeholder.height).toBe(48);
  },
);

test(
  "ObjectElement.createPlaceholder - 背景設定 - fillsを持つ",
  () => {
    const placeholder = ObjectElement.createPlaceholder();

    expect(placeholder.fills).toBeDefined();
    expect(Array.isArray(placeholder.fills)).toBe(true);
  },
);

test("ObjectElement.createPlaceholder - 枠線設定 - strokeを持つ", () => {
  const placeholder = ObjectElement.createPlaceholder();

  expect(placeholder.strokes).toBeDefined();
  expect(placeholder.strokeWeight).toBe(2);
});

test("ObjectElement.createUrlLabel - URL入力 - テキストラベル生成", () => {
  const label = ObjectElement.createUrlLabel(
    "https://example.com/content.swf",
  );

  expect(label.type).toBe("TEXT");
  expect(label.name).toBe("url-label");
  expect(label.characters).toContain("example.com");
});

test("ObjectElement.createUrlLabel - 長いURL - 省略表示する", () => {
  const longUrl =
    "https://example.com/very/long/path/that/exceeds/the/maximum/length/allowed/for/display/in/the/label";
  const label = ObjectElement.createUrlLabel(longUrl);

  expect(label.characters?.length).toBeLessThanOrEqual(53); // 50 + "..."
  expect(label.characters).toContain("...");
});

test("ObjectElement.createTypeLabel - type入力 - テキストラベル生成", () => {
  const label = ObjectElement.createTypeLabel("application/pdf");

  expect(label.type).toBe("TEXT");
  expect(label.name).toBe("type-label");
  expect(label.characters).toBe("application/pdf");
});

test("ObjectElement.applyStyles - borderスタイル - strokeを設定する", () => {
  const element = ObjectElement.create({
    style: "border: 2px solid #333;",
  });
  const figmaNode = ObjectElement.toFigmaNode(element);

  expect(figmaNode.strokes).toBeDefined();
  expect(figmaNode.strokeWeight).toBe(2);
});

test(
  "ObjectElement.applyStyles - border-radiusスタイル - cornerRadiusを設定する",
  () => {
    const element = ObjectElement.create({
      style: "border-radius: 8px;",
    });
    const figmaNode = ObjectElement.toFigmaNode(element);

    expect(figmaNode.cornerRadius).toBe(8);
  },
);
