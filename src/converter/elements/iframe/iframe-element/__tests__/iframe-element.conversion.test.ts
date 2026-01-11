import { test, expect } from "vitest";
import { IframeElement, URL_LABEL_CONFIG } from "../iframe-element";

const ELLIPSIS_LENGTH = 3;

test("toFigmaNode: FRAME型のノードを作成する", () => {
  const element = IframeElement.create({ src: "https://example.com" });
  const config = IframeElement.toFigmaNode(element);
  expect(config.type).toBe("FRAME");
});

test("toFigmaNode: デフォルトサイズは300x150", () => {
  const element = IframeElement.create({});
  const config = IframeElement.toFigmaNode(element);
  expect(config.width).toBe(300);
  expect(config.height).toBe(150);
});

test("toFigmaNode: width/height属性を反映する", () => {
  const element = IframeElement.create({ width: "640", height: "480" });
  const config = IframeElement.toFigmaNode(element);
  expect(config.width).toBe(640);
  expect(config.height).toBe(480);
});

test("toFigmaNode: title属性からノード名を生成する", () => {
  const element = IframeElement.create({
    title: "Embedded Map",
    src: "https://maps.google.com/embed",
  });
  const config = IframeElement.toFigmaNode(element);
  expect(config.name).toBe("iframe: Embedded Map");
});

test("toFigmaNode: プレースホルダー背景色を設定する", () => {
  const element = IframeElement.create({});
  const config = IframeElement.toFigmaNode(element);
  expect(config.fills).toBeDefined();
  expect(Array.isArray(config.fills)).toBe(true);
  expect(config.fills!.length).toBeGreaterThan(0);
});

test("toFigmaNode: 子要素にプレースホルダーコンテンツを含む", () => {
  const element = IframeElement.create({ src: "https://example.com" });
  const config = IframeElement.toFigmaNode(element);
  expect(config.children).toBeDefined();
  expect(Array.isArray(config.children)).toBe(true);
});

test("toFigmaNode: プレースホルダーにiframeアイコンを含む", () => {
  const element = IframeElement.create({});
  const config = IframeElement.toFigmaNode(element);
  const iconFrame = config.children?.find(
    (child) => child.name === "iframe-icon",
  );
  expect(iconFrame).toBeDefined();
});

test("toFigmaNode: src属性がある場合はURLラベルを表示する", () => {
  const element = IframeElement.create({ src: "https://example.com/embed" });
  const config = IframeElement.toFigmaNode(element);
  const urlLabel = config.children?.find((child) => child.name === "url-label");
  expect(urlLabel).toBeDefined();
});

test("toFigmaNode: スタイル属性からボーダーを適用する", () => {
  const element = IframeElement.create({
    style: "border: 2px solid black;",
  });
  const config = IframeElement.toFigmaNode(element);
  expect(config.strokes).toBeDefined();
  expect(config.strokeWeight).toBe(2);
});

test("toFigmaNode: スタイル属性から角丸を適用する", () => {
  const element = IframeElement.create({
    style: "border-radius: 8px;",
  });
  const config = IframeElement.toFigmaNode(element);
  expect(config.cornerRadius).toBe(8);
});

test("mapToFigma: 有効なIframeElementに対してFigmaNodeConfigを返す", () => {
  const element = IframeElement.create({ src: "https://example.com" });
  const config = IframeElement.mapToFigma(element);
  expect(config).not.toBeNull();
  expect(config!.type).toBe("FRAME");
});

test("mapToFigma: iframe以外の要素に対してnullを返す", () => {
  const element = { type: "element", tagName: "div", attributes: {} };
  const config = IframeElement.mapToFigma(element);
  expect(config).toBeNull();
});

test("mapToFigma: nullに対してnullを返す", () => {
  const config = IframeElement.mapToFigma(null);
  expect(config).toBeNull();
});

test("mapToFigma: HTMLNodeライクなオブジェクトを変換できる", () => {
  const node = {
    type: "element",
    tagName: "iframe",
    attributes: { src: "https://example.com", width: "640", height: "480" },
  };
  const config = IframeElement.mapToFigma(node);
  expect(config).not.toBeNull();
  expect(config!.width).toBe(640);
  expect(config!.height).toBe(480);
});

test("createPlaceholder: プレースホルダーフレームを作成する", () => {
  const placeholder = IframeElement.createPlaceholder();
  expect(placeholder.type).toBe("FRAME");
  expect(placeholder.name).toBe("iframe-icon");
});

test("createPlaceholder: 中央配置用のレイアウト設定を持つ", () => {
  const placeholder = IframeElement.createPlaceholder();
  expect(placeholder.layoutMode).toBe("VERTICAL");
  expect(placeholder.primaryAxisAlignItems).toBe("CENTER");
  expect(placeholder.counterAxisAlignItems).toBe("CENTER");
});

test("createUrlLabel: URLラベルテキストノードを作成する", () => {
  const label = IframeElement.createUrlLabel("https://example.com");
  expect(label.type).toBe("TEXT");
  expect(label.name).toBe("url-label");
  expect(label.characters).toBe("https://example.com");
});

test("createUrlLabel: 長いURLは省略される", () => {
  const longUrl =
    "https://example.com/very/long/path/to/resource/that/is/too/long";
  const label = IframeElement.createUrlLabel(longUrl);
  expect(label.characters!.length).toBe(
    URL_LABEL_CONFIG.MAX_LENGTH + ELLIPSIS_LENGTH,
  );
  expect(label.characters!.endsWith("...")).toBe(true);
});
