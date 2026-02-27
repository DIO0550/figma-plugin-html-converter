import { test, expect } from "vitest";
import { mapHTMLNodeToFigma } from "./mapper";
import { HTMLNode } from "./models/html-node";
import { HTML } from "./models/html";

/**
 * HTMLNodeを作成するヘルパー関数
 */
function createHTMLNode(html: string): HTMLNode {
  const parsed = HTML.from(html);
  return HTML.toHTMLNode(parsed);
}

// --- spacing: 0 上書き防止テスト ---

test("mapHTMLNodeToFigma - ul要素で spacing: 0 指定 - デフォルト値(8)で上書きされない", () => {
  const htmlNode = createHTMLNode("<ul><li>item</li></ul>");
  const options = { spacing: 0 };

  const result = mapHTMLNodeToFigma(htmlNode, options);

  // ul の子要素内で spacing が設定される箇所を確認
  // ul要素は VERTICAL auto layout が設定される
  expect(result.itemSpacing).toBe(0);
});

// --- paddingTop: 0 上書き防止テスト ---

test("mapHTMLNodeToFigma - 非Auto Layout要素で paddingTop: 0 が個別設定済み - ショートハンドで上書きされない", () => {
  // padding: 20px がショートハンド、padding-top: 0px が個別指定
  // 個別指定(0)が先に処理されるため、ショートハンドで上書きされてはいけない
  const htmlNode = createHTMLNode(
    '<div style="display: block; padding: 20px; padding-top: 0px">Test</div>',
  );

  const result = mapHTMLNodeToFigma(htmlNode, {});

  expect(result.paddingTop).toBe(0);
});

// --- width: 0 + aspectRatio 計算テスト ---

test("mapHTMLNodeToFigma - width: 0px + aspect-ratio: 16/9 - height: 0 が計算される", () => {
  const htmlNode = createHTMLNode(
    '<div style="width: 0px; aspect-ratio: 16/9">Test</div>',
  );

  const result = mapHTMLNodeToFigma(htmlNode, {});

  expect(result.width).toBe(0);
  expect(result.height).toBe(0);
});

// --- aspectRatio 不正値ガードテスト ---

test("mapHTMLNodeToFigma - aspect-ratio: 0 の場合 - height が設定されない", () => {
  const htmlNode = createHTMLNode(
    '<div style="width: 100px; aspect-ratio: 0">Test</div>',
  );

  const result = mapHTMLNodeToFigma(htmlNode, {});

  expect(result.width).toBe(100);
  expect(result.height).toBeUndefined();
  expect(result.aspectRatio).toBeUndefined();
});

test("mapHTMLNodeToFigma - aspect-ratio: 16/0 (Infinity) の場合 - height が設定されない", () => {
  const htmlNode = createHTMLNode(
    '<div style="width: 100px; aspect-ratio: 16/0">Test</div>',
  );

  const result = mapHTMLNodeToFigma(htmlNode, {});

  expect(result.width).toBe(100);
  expect(result.height).toBeUndefined();
  expect(result.aspectRatio).toBeUndefined();
});

// --- body要素で width: 0 / height: 0 上書き防止テスト ---

test("mapHTMLNodeToFigma - body要素で width: 0 設定済み - コンテナデフォルト値で上書きされない", () => {
  const htmlNode = createHTMLNode(
    '<body style="width: 0px"><div>child</div></body>',
  );
  const options = { containerWidth: 800, containerHeight: 600 };

  const result = mapHTMLNodeToFigma(htmlNode, options);

  expect(result.width).toBe(0);
});

test("mapHTMLNodeToFigma - body要素で height: 0 設定済み - コンテナデフォルト値で上書きされない", () => {
  const htmlNode = createHTMLNode(
    '<body style="height: 0px"><div>child</div></body>',
  );
  const options = { containerWidth: 800, containerHeight: 600 };

  const result = mapHTMLNodeToFigma(htmlNode, options);

  expect(result.height).toBe(0);
});
