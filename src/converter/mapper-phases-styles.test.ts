import { afterEach, test, expect, vi } from "vitest";
import { mapHTMLNodeToFigma } from "./mapper";
import { HTML } from "./models/html";
import type { HTMLNode } from "./models/html-node";
import { Styles } from "./models/styles";
import { ConversionOptions } from "./models/conversion-options";

const defaults = ConversionOptions.getDefault();

// 型ガードでcontainerWidth/containerHeightがnumberであることを保証（non-null assertion不要にする）
if (!ConversionOptions.hasContainerSize(defaults)) {
  throw new Error("getDefault() must return valid container size");
}

afterEach(() => {
  vi.restoreAllMocks();
});

function createHTMLNode(html: string): HTMLNode {
  const parsed = HTML.from(html);
  return HTML.toHTMLNode(parsed);
}

// --- applyAutoLayout 統合テスト ---

test("applyAutoLayout - display: flex → layoutMode 設定", () => {
  const node = createHTMLNode('<div style="display: flex">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutMode).toBeDefined();
  expect(["HORIZONTAL", "VERTICAL"]).toContain(result.layoutMode);
});

test("applyAutoLayout - flex-wrap: wrap → layoutWrap WRAP", () => {
  const node = createHTMLNode(
    '<div style="display: flex; flex-wrap: wrap">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutWrap).toBe("WRAP");
});

test("applyAutoLayout - display: flex + gap → itemSpacing 設定", () => {
  const node = createHTMLNode(
    '<div style="display: flex; gap: 16px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.itemSpacing).toBe(16);
});

// --- applyPadding 統合テスト ---

test("applyPadding - padding 個別指定", () => {
  const node = createHTMLNode(
    '<div style="display: block; padding-top: 10px; padding-right: 20px; padding-bottom: 30px; padding-left: 40px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.paddingTop).toBe(10);
  expect(result.paddingRight).toBe(20);
  expect(result.paddingBottom).toBe(30);
  expect(result.paddingLeft).toBe(40);
});

test("applyPadding - padding ショートハンド", () => {
  const node = createHTMLNode(
    '<div style="display: block; padding: 15px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.paddingTop).toBe(15);
  expect(result.paddingRight).toBe(15);
  expect(result.paddingBottom).toBe(15);
  expect(result.paddingLeft).toBe(15);
});

test("applyPadding - flex要素ではapplyPaddingが適用されない（autoLayoutのpaddingが優先）", () => {
  const node = createHTMLNode(
    '<div style="display: flex; padding: 20px 10px 30px 5px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  // flex要素ではautoLayoutのpaddingが設定される
  expect(result.layoutMode).toBeDefined();
  // autoLayout由来のpaddingが設定されている（applyPaddingではなくapplyAutoLayout経由）
  expect(result.paddingTop).toBe(20);
  expect(result.paddingRight).toBe(10);
  expect(result.paddingBottom).toBe(30);
  expect(result.paddingLeft).toBe(5);
});

// --- applyPositioning 統合テスト ---

test("applyPositioning - position: absolute + top/left → x/y設定", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; top: 10px; left: 20px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.x).toBe(20);
  expect(result.y).toBe(10);
});

test("applyPositioning - position: absolute + left/right → STRETCH constraint", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; left: 0px; right: 0px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("STRETCH");
});

test("applyPositioning - position: absolute + right のみ → MAX constraint", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; right: 10px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MAX");
});

test("applyPositioning - position: fixed + left:0 right:0 → STRETCH", () => {
  const node = createHTMLNode(
    '<div style="position: fixed; left: 0px; right: 0px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("STRETCH");
});

test("applyPositioning - position: relative + left/top → x/y設定", () => {
  const node = createHTMLNode(
    '<div style="position: relative; top: 5px; left: 15px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.x).toBe(15);
  expect(result.y).toBe(5);
});

test("applyPositioning - z-index は position non-static 時のみ適用", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; z-index: 10">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.zIndex).toBe(10);
});

test("applyPositioning - z-index は position 未指定時に適用されない", () => {
  const node = createHTMLNode('<div style="z-index: 10">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.zIndex).toBeUndefined();
});

// --- applyPositioning - vertical constraints テスト ---

test("applyPositioning - absolute + top のみ → vertical: MIN", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; top: 10px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("MIN");
});

test("applyPositioning - absolute + bottom のみ → vertical: MAX", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; bottom: 20px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("MAX");
});

test("applyPositioning - absolute + top + bottom → vertical: STRETCH", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; top: 0px; bottom: 0px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("STRETCH");
});

test("applyPositioning - absolute + left のみ → vertical: MIN（デフォルト）", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; left: 10px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("MIN");
});

test("applyPositioning - fixed + top + bottom → vertical: STRETCH", () => {
  const node = createHTMLNode(
    '<div style="position: fixed; top: 0px; bottom: 0px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("STRETCH");
});

// --- applyPositioning - horizontal デフォルト テスト ---

test("applyPositioning - absolute + left のみ → horizontal: MIN", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; left: 10px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
});

// --- applySizing 統合テスト ---

test("applySizing - width/height px 設定", () => {
  const node = createHTMLNode(
    '<div style="width: 200px; height: 100px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.width).toBe(200);
  expect(result.height).toBe(100);
});

test("applySizing - width: 100% → FILL", () => {
  const node = createHTMLNode('<div style="width: 100%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FILL");
});

test("applySizing - width: 75% → デフォルトcontainerWidthで計算", () => {
  const node = createHTMLNode('<div style="width: 75%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.width).toBe(defaults.containerWidth * (75 / 100));
});

test("applySizing - width: 75% + カスタムcontainerWidth(1200) → 900", () => {
  const node = createHTMLNode('<div style="width: 75%">test</div>');
  const result = mapHTMLNodeToFigma(node, { containerWidth: 1200 });

  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.width).toBe(1200 * (75 / 100));
});

test("applySizing - height: 30% → デフォルトcontainerHeightで計算", () => {
  const node = createHTMLNode('<div style="height: 30%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingVertical).toBe("FIXED");
  expect(result.height).toBeCloseTo(defaults.containerHeight * (30 / 100));
});

test("applySizing - height: 30% + カスタムcontainerHeight(1000) → 300", () => {
  const node = createHTMLNode('<div style="height: 30%">test</div>');
  const result = mapHTMLNodeToFigma(node, { containerHeight: 1000 });

  expect(result.layoutSizingVertical).toBe("FIXED");
  expect(result.height).toBeCloseTo(1000 * (30 / 100));
});

test("applySizing - height: auto → HUG", () => {
  const node = createHTMLNode('<div style="height: auto">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingVertical).toBe("HUG");
});

test("applySizing - min-width/max-width 設定", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; max-width: 500px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.minWidth).toBe(100);
  expect(result.maxWidth).toBe(500);
});

test("applySizing - aspect-ratio 正常値 → aspectRatio 設定", () => {
  const node = createHTMLNode(
    '<div style="width: 160px; aspect-ratio: 16/9">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.aspectRatio).toBeCloseTo(16 / 9);
  expect(result.height).toBeCloseTo(90);
});

test("applySizing - flex-grow: 1 → layoutGrow + FILL", () => {
  const node = createHTMLNode('<div style="flex-grow: 1">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutGrow).toBe(1);
  expect(result.layoutSizingHorizontal).toBe("FILL");
});

test("applySizing - flex-shrink: 0 → layoutGrow: 0", () => {
  const node = createHTMLNode('<div style="flex-shrink: 0">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutGrow).toBe(0);
});

// --- applySizing - constraints テスト ---

test("applySizing - min-width のみ → constraints horizontal: SCALE, vertical: MIN", () => {
  const node = createHTMLNode('<div style="min-width: 100px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("MIN");
});

test("applySizing - max-width のみ → constraints horizontal: SCALE, vertical: MIN", () => {
  const node = createHTMLNode('<div style="max-width: 500px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("MIN");
});

test("applySizing - min-height のみ → constraints horizontal: MIN, vertical: SCALE", () => {
  const node = createHTMLNode('<div style="min-height: 50px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-width + min-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; min-height: 50px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

// --- applySizing - constraints 優先度テスト ---

test("applySizing - position: absolute + min-width → applyPositioning の constraints が優先", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; left: 0px; right: 0px; min-width: 100px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  // applyPositioning で設定された constraints が優先される（applySizing で上書きされない）
  expect(result.constraints?.horizontal).toBe("STRETCH");
  expect(result.constraints?.vertical).toBe("MIN");
});

// --- applySizing - % 対照テスト ---

test("applySizing - width: 100% → FILL", () => {
  const node = createHTMLNode('<div style="width: 100%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FILL");
});

test("applySizing - width: 50% → FIXED + ピクセル換算", () => {
  const node = createHTMLNode('<div style="width: 50%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.width).toBe(defaults.containerWidth * (50 / 100));
});

test("applySizing - width: 25% → FIXED + ピクセル換算", () => {
  const node = createHTMLNode('<div style="width: 25%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.width).toBe(defaults.containerWidth * (25 / 100));
});

test("applySizing - height: 100% → FILL", () => {
  const node = createHTMLNode('<div style="height: 100%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingVertical).toBe("FILL");
});

test("applySizing - height: 50% → FIXED + ピクセル換算", () => {
  const node = createHTMLNode('<div style="height: 50%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingVertical).toBe("FIXED");
  expect(result.height).toBe(defaults.containerHeight * (50 / 100));
});

test("applySizing - height: 25% → FIXED + ピクセル換算", () => {
  const node = createHTMLNode('<div style="height: 25%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingVertical).toBe("FIXED");
  expect(result.height).toBe(defaults.containerHeight * (25 / 100));
});

// --- applySizing - 境界値テスト ---

test("applySizing - width: 0% → FIXED + 0px", () => {
  const node = createHTMLNode('<div style="width: 0%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.width).toBe(0);
});

test("applySizing - width: 33.33% → FIXED + 小数ピクセル換算", () => {
  const node = createHTMLNode('<div style="width: 33.33%">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutSizingHorizontal).toBe("FIXED");
  expect(result.width).toBeCloseTo(defaults.containerWidth * (33.33 / 100));
});

// --- applySizing - 回帰テスト（flex-grow との併用） ---

test("applySizing - width: 50% + flex-grow: 1 → FILL上書き、width計算値は残る", () => {
  const node = createHTMLNode(
    '<div style="width: 50%; flex-grow: 1">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.layoutGrow).toBe(1);
  expect(result.layoutSizingHorizontal).toBe("FILL");
  expect(result.width).toBe(defaults.containerWidth * (50 / 100));
});

// --- applyVisualStyles 統合テスト ---

test("applyVisualStyles - background-color 設定 → fills", () => {
  const node = createHTMLNode(
    '<div style="background-color: rgb(255, 0, 0)">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.fills).toBeDefined();
  expect(result.fills).toHaveLength(1);
});

test("applyVisualStyles - border 設定 → strokes", () => {
  const node = createHTMLNode(
    '<div style="border: 1px solid rgb(0, 0, 0)">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.strokes).toBeDefined();
  expect(result.strokeWeight).toBe(1);
});

test("applyVisualStyles - border-radius 設定 → cornerRadius", () => {
  const node = createHTMLNode('<div style="border-radius: 8px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.cornerRadius).toBe(8);
});

// --- z-index適用条件テスト ---

test("z-index - position未指定 + z-index指定 → zIndexが設定されない", () => {
  const node = createHTMLNode('<div style="z-index: 5">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.zIndex).toBeUndefined();
});

test("z-index - position: static + z-index指定 → zIndexが設定されない", () => {
  const node = createHTMLNode(
    '<div style="position: static; z-index: 5">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.zIndex).toBeUndefined();
});

test("z-index - position: absolute + z-index指定 → zIndexが設定される", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; z-index: 5">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.zIndex).toBe(5);
});

// --- Styles.parse パース回数テスト ---

test("Styles.parse - style属性あり + childrenありのケースでStyles.parseが1回のみ呼ばれる", () => {
  const parseSpy = vi.spyOn(Styles, "parse");

  const node = createHTMLNode(
    '<div style="width: 100px"><span>child</span></div>',
  );
  mapHTMLNodeToFigma(node);

  const divParseCalls = parseSpy.mock.calls.filter(
    (call) => call[0] === "width: 100px",
  );
  expect(divParseCalls).toHaveLength(1);
});

// --- applySizing - constraints マトリクステスト ---

test("applySizing - min/max 未設定 → constraints undefined", () => {
  const node = createHTMLNode('<div style="width: 200px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints).toBeUndefined();
});

test("applySizing - min-width + max-width → constraints horizontal: SCALE, vertical: MIN", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; max-width: 500px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("MIN");
});

test("applySizing - max-height のみ → constraints horizontal: MIN, vertical: SCALE", () => {
  const node = createHTMLNode('<div style="max-height: 300px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-height + max-height → constraints horizontal: MIN, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-height: 50px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - max-width + min-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="max-width: 500px; min-height: 50px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-width + max-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - max-width + max-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="max-width: 500px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - 4つ全て設定 → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; max-width: 500px; min-height: 50px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-width + max-width + min-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; max-width: 500px; min-height: 50px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-width + max-width + max-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; max-width: 500px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-width + min-height + max-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="min-width: 100px; min-height: 50px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - max-width + min-height + max-height → constraints horizontal: SCALE, vertical: SCALE", () => {
  const node = createHTMLNode(
    '<div style="max-width: 500px; min-height: 50px; max-height: 300px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("SCALE");
  expect(result.constraints?.vertical).toBe("SCALE");
});

// --- applySizing - constraints 優先度・交差ケーステスト ---

test("applySizing - position: absolute + top/bottom + min-height → positioning の STRETCH が優先", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; top: 0px; bottom: 0px; min-height: 50px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
  expect(result.constraints?.vertical).toBe("STRETCH");
});

test("applySizing - position: absolute + left + min-height → positioning 全体優先（交差ケース）", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; left: 0px; min-height: 50px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
  expect(result.constraints?.vertical).toBe("MIN");
});

test("applySizing - position: absolute + top + max-width → positioning 全体優先（交差ケース）", () => {
  const node = createHTMLNode(
    '<div style="position: absolute; top: 0px; max-width: 200px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("MIN");
  expect(result.constraints?.vertical).toBe("MIN");
});

test("applySizing - position: fixed + left/right + min-height → positioning 全体優先", () => {
  const node = createHTMLNode(
    '<div style="position: fixed; left: 0px; right: 0px; min-height: 100px">test</div>',
  );
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.horizontal).toBe("STRETCH");
  expect(result.constraints?.vertical).toBe("MIN");
});

// --- applySizing - constraints 境界値テスト ---

test("applySizing - min-height: 0px → constraints vertical: SCALE", () => {
  const node = createHTMLNode('<div style="min-height: 0px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - max-height: 0px → constraints vertical: SCALE", () => {
  const node = createHTMLNode('<div style="max-height: 0px">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("SCALE");
});

test("applySizing - min-height: 0（単位なし）→ constraints vertical: SCALE", () => {
  const node = createHTMLNode('<div style="min-height: 0">test</div>');
  const result = mapHTMLNodeToFigma(node);

  expect(result.constraints?.vertical).toBe("SCALE");
});

// NOTE: 早期 return テスト（R1-R4）は ConversionOptions.from() が不正値（0, NaN, Infinity）を
// デフォルト値に正規化するため、mapHTMLNodeToFigma の公開 API 経由では到達不可能。
// ConversionOptions.normalize のテストで網羅済みのため、ここでは省略。
