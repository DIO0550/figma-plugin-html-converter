import { test, expect } from "vitest";
import { Styles } from "../styles";

test("Styles.getWidth: getWidthが動作する", () => {
  const styles = Styles.from({ width: "100px" });
  expect(Styles.getWidth(styles)).toBe(100);
});

test("Styles.getHeight: getHeightが動作する", () => {
  const styles = Styles.from({ height: "200px" });
  expect(Styles.getHeight(styles)).toBe(200);
});

test("Styles.getBackgroundColor: getBackgroundColorが動作する", () => {
  const styles = Styles.from({ "background-color": "#ff0000" });
  expect(Styles.getBackgroundColor(styles)).toEqual({ r: 1, g: 0, b: 0 });
});

test("Styles.getBackgroundColor: キャメルケースも処理する", () => {
  const styles = Styles.from({ backgroundColor: "#00ff00" });
  expect(Styles.getBackgroundColor(styles)).toEqual({ r: 0, g: 1, b: 0 });
});

test("Styles.getColor: getColorが動作する", () => {
  const styles = Styles.from({ color: "blue" });
  expect(Styles.getColor(styles)).toEqual({ r: 0, g: 0, b: 1 });
});

test("Styles.getBorder: getBorderが動作する", () => {
  const styles = Styles.from({ border: "2px solid red" });
  const border = Styles.getBorder(styles);
  expect(border).toEqual({
    width: 2,
    style: "solid",
    color: { r: 1, g: 0, b: 0 },
  });
});

test("Styles.getBorderRadius: getBorderRadiusが動作する", () => {
  const styles = Styles.from({ "border-radius": "10px" });
  expect(Styles.getBorderRadius(styles)).toBe(10);
});

test("Styles.getBorderRadius: キャメルケースも処理する", () => {
  const styles = Styles.from({ borderRadius: "20px" });
  expect(Styles.getBorderRadius(styles)).toBe(20);
});

test("Styles.getDisplay: getDisplayが動作する", () => {
  const styles = Styles.from({ display: "flex" });
  expect(Styles.getDisplay(styles)).toBe("flex");
});

test("Styles.getOpacity: getOpacityが動作する", () => {
  const styles = Styles.from({ opacity: "0.5" });
  expect(Styles.getOpacity(styles)).toBe(0.5);
});

test("Styles.getOpacity: 範囲を制限する", () => {
  expect(Styles.getOpacity(Styles.from({ opacity: "1.5" }))).toBe(1);
  expect(Styles.getOpacity(Styles.from({ opacity: "-0.5" }))).toBe(0);
});

test("Styles.getWidth: 存在しないwidthをnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getWidth(styles)).toBeNull();
});

test("Styles.getHeight: 存在しないheightをnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getHeight(styles)).toBeNull();
});

test("Styles.getColor: 存在しないcolorをnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getColor(styles)).toBeNull();
});

test("Styles.getBackgroundColor: 存在しない色をnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getBackgroundColor(styles)).toBeNull();
});

test("Styles.getBorder: 存在しないborderをnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getBorder(styles)).toBeNull();
});

test("Styles.getBorderRadius: 存在しないborder-radiusをnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getBorderRadius(styles)).toBeNull();
});

test("Styles.getDisplay: 存在しないdisplayをundefinedとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getDisplay(styles)).toBeUndefined();
});

test("Styles.getOpacity: 存在しないopacityをnullとして処理する", () => {
  const styles = Styles.empty();
  expect(Styles.getOpacity(styles)).toBeNull();
});

test("Styles.extractFlexboxOptions: px値のgapが数値として返されること", () => {
  const styles = Styles.from({
    display: "flex",
    "flex-direction": "column",
    gap: "16px",
    "align-items": "center",
    "justify-content": "space-between",
  });

  const result = Styles.extractFlexboxOptions(styles);

  expect(result.display).toBe("flex");
  expect(result.flexDirection).toBe("column");
  expect(result.gap).toBe(16);
  expect(result.alignItems).toBe("center");
  expect(result.justifyContent).toBe("space-between");
});

test("Styles.extractFlexboxOptions: rem値のgapはundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
    gap: "1rem",
  });

  const result = Styles.extractFlexboxOptions(styles);

  expect(result.display).toBe("flex");
  expect(result.gap).toBeUndefined();
});

test("Styles.extractFlexboxOptions: パーセント値のgapはundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
    gap: "10%",
  });

  const result = Styles.extractFlexboxOptions(styles);

  expect(result.display).toBe("flex");
  expect(result.gap).toBeUndefined();
});

test("Styles.extractFlexboxOptions: calc()のgapはundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
    gap: "calc(100% - 20px)",
  });

  const result = Styles.extractFlexboxOptions(styles);

  expect(result.display).toBe("flex");
  expect(result.gap).toBeUndefined();
});

test("Styles.extractFlexboxOptions: gapがない場合はundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
  });

  const result = Styles.extractFlexboxOptions(styles);

  expect(result.display).toBe("flex");
  expect(result.gap).toBeUndefined();
});

test("Styles.extractSizeOptions: px値のwidth/heightが数値として返されること", () => {
  const styles = Styles.from({
    width: "300px",
    height: "200px",
  });

  const result = Styles.extractSizeOptions(styles);

  expect(result.width).toBe(300);
  expect(result.height).toBe(200);
});

test("Styles.extractSizeOptions: autoのheightはundefinedになること", () => {
  const styles = Styles.from({
    width: "300px",
    height: "auto",
  });

  const result = Styles.extractSizeOptions(styles);

  expect(result.width).toBe(300);
  expect(result.height).toBeUndefined();
});

test("Styles.extractSizeOptions: パーセント値のheightはundefinedになること", () => {
  const styles = Styles.from({
    width: "300px",
    height: "50%",
  });

  const result = Styles.extractSizeOptions(styles);

  expect(result.width).toBe(300);
  expect(result.height).toBeUndefined();
});

test("Styles.extractSizeOptions: rem値のheightはundefinedになること", () => {
  const styles = Styles.from({
    width: "300px",
    height: "5rem",
  });

  const result = Styles.extractSizeOptions(styles);

  expect(result.width).toBe(300);
  expect(result.height).toBeUndefined();
});

// getMinWidth/getMaxWidth/getMinHeight/getMaxHeight のpx値制限テスト (Issue #88)
test("Styles.getMinWidth: px値が正しく返されること", () => {
  const styles = Styles.from({ "min-width": "100px" });
  expect(Styles.getMinWidth(styles)).toBe(100);
});

test("Styles.getMinWidth: 単位なしの数値が正しく返されること", () => {
  const styles = Styles.from({ "min-width": "100" });
  expect(Styles.getMinWidth(styles)).toBe(100);
});

test("Styles.getMinWidth: rem値はnullになること", () => {
  const styles = Styles.from({ "min-width": "10rem" });
  expect(Styles.getMinWidth(styles)).toBeNull();
});

test("Styles.getMinWidth: パーセント値はnullになること", () => {
  const styles = Styles.from({ "min-width": "50%" });
  expect(Styles.getMinWidth(styles)).toBeNull();
});

test("Styles.getMinWidth: calc()はnullになること", () => {
  const styles = Styles.from({ "min-width": "calc(100% - 20px)" });
  expect(Styles.getMinWidth(styles)).toBeNull();
});

test("Styles.getMaxWidth: px値が正しく返されること", () => {
  const styles = Styles.from({ "max-width": "500px" });
  expect(Styles.getMaxWidth(styles)).toBe(500);
});

test("Styles.getMaxWidth: rem値はnullになること", () => {
  const styles = Styles.from({ "max-width": "30rem" });
  expect(Styles.getMaxWidth(styles)).toBeNull();
});

test("Styles.getMaxWidth: パーセント値はnullになること", () => {
  const styles = Styles.from({ "max-width": "100%" });
  expect(Styles.getMaxWidth(styles)).toBeNull();
});

test("Styles.getMinHeight: px値が正しく返されること", () => {
  const styles = Styles.from({ "min-height": "200px" });
  expect(Styles.getMinHeight(styles)).toBe(200);
});

test("Styles.getMinHeight: rem値はnullになること", () => {
  const styles = Styles.from({ "min-height": "15rem" });
  expect(Styles.getMinHeight(styles)).toBeNull();
});

test("Styles.getMaxHeight: px値が正しく返されること", () => {
  const styles = Styles.from({ "max-height": "600px" });
  expect(Styles.getMaxHeight(styles)).toBe(600);
});

test("Styles.getMaxHeight: パーセント値はnullになること", () => {
  const styles = Styles.from({ "max-height": "80%" });
  expect(Styles.getMaxHeight(styles)).toBeNull();
});

// parseSizeIfValid ヘルパー関数のテスト (Issue #88)
test("parseSizeIfValid: px値が正しく返されること", () => {
  // parseSizeIfValidはprivate関数だが、extractFlexboxOptionsとextractSizeOptionsを通じてテスト可能
  const styles = Styles.from({
    display: "flex",
    gap: "100px",
  });
  const result = Styles.extractFlexboxOptions(styles);
  expect(result.gap).toBe(100);
});

test("parseSizeIfValid: 単位なしの数値が正しく返されること", () => {
  const styles = Styles.from({
    width: "100",
  });
  const result = Styles.extractSizeOptions(styles);
  expect(result.width).toBe(100);
});

test("parseSizeIfValid: rem値はundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
    gap: "10rem",
  });
  const result = Styles.extractFlexboxOptions(styles);
  expect(result.gap).toBeUndefined();
});

test("parseSizeIfValid: パーセント値はundefinedになること", () => {
  const styles = Styles.from({
    width: "50%",
  });
  const result = Styles.extractSizeOptions(styles);
  expect(result.width).toBeUndefined();
});

test("parseSizeIfValid: calc()はundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
    gap: "calc(100% - 20px)",
  });
  const result = Styles.extractFlexboxOptions(styles);
  expect(result.gap).toBeUndefined();
});

test("parseSizeIfValid: undefinedはundefinedになること", () => {
  const styles = Styles.from({
    display: "flex",
  });
  const result = Styles.extractFlexboxOptions(styles);
  expect(result.gap).toBeUndefined();
});

test("parseSizeIfValid: 空文字列はundefinedになること", () => {
  const styles = Styles.from({
    width: "",
  });
  const result = Styles.extractSizeOptions(styles);
  expect(result.width).toBeUndefined();
});

// getSizeWithPxRestriction ヘルパー関数のテスト (Issue #88)
test("getSizeWithPxRestriction: px値が正しく返されること", () => {
  // getSizeWithPxRestrictionはprivate関数だが、getMinWidth等を通じてテスト可能
  const styles = Styles.from({ "min-width": "150px" });
  expect(Styles.getMinWidth(styles)).toBe(150);
});

test("getSizeWithPxRestriction: 単位なしの数値が正しく返されること", () => {
  const styles = Styles.from({ "max-width": "200" });
  expect(Styles.getMaxWidth(styles)).toBe(200);
});

test("getSizeWithPxRestriction: rem値はnullになること", () => {
  const styles = Styles.from({ "min-height": "20rem" });
  expect(Styles.getMinHeight(styles)).toBeNull();
});

test("getSizeWithPxRestriction: パーセント値はnullになること", () => {
  const styles = Styles.from({ "max-height": "75%" });
  expect(Styles.getMaxHeight(styles)).toBeNull();
});

test("getSizeWithPxRestriction: calc()はnullになること", () => {
  const styles = Styles.from({ "min-width": "calc(50% + 10px)" });
  expect(Styles.getMinWidth(styles)).toBeNull();
});

test("getSizeWithPxRestriction: プロパティが存在しない場合はnullになること", () => {
  const styles = Styles.empty();
  expect(Styles.getMaxWidth(styles)).toBeNull();
});

test("getSizeWithPxRestriction: 空文字列はnullになること", () => {
  const styles = Styles.from({ "min-height": "" });
  expect(Styles.getMinHeight(styles)).toBeNull();
});
