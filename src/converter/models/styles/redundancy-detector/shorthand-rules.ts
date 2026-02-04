/**
 * CSSショートハンド統合ルール
 * longhandプロパティからshorthandへの統合ルールを定義
 */

export interface ShorthandRule {
  shorthand: string;
  longhands: readonly string[];
  /** すべてのlonghandが揃っている場合のみ統合可能 */
  requireAll: boolean;
}

/** ショートハンド統合ルール定義 */
export const SHORTHAND_RULES: readonly ShorthandRule[] = [
  {
    shorthand: "margin",
    longhands: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
    requireAll: true,
  },
  {
    shorthand: "padding",
    longhands: [
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
    ],
    requireAll: true,
  },
  {
    shorthand: "border",
    longhands: ["border-width", "border-style", "border-color"],
    requireAll: true,
  },
];

/** shorthandからlonghandへのマッピング（混在検出用） */
export const SHORTHAND_TO_LONGHANDS: Readonly<
  Record<string, readonly string[]>
> = {
  margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"],
  padding: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  border: ["border-width", "border-style", "border-color"],
};

/**
 * ショートハンドとlonghandの混在を検出
 * shorthandが存在する場合に同軸のlonghandがあれば重複として報告
 */
export function detectShorthandLonghandConflicts(
  properties: Record<string, string>,
): Array<{ shorthand: string; longhand: string; longhandValue: string }> {
  const conflicts: Array<{
    shorthand: string;
    longhand: string;
    longhandValue: string;
  }> = [];

  for (const [shorthand, longhands] of Object.entries(SHORTHAND_TO_LONGHANDS)) {
    if (!(shorthand in properties)) continue;
    const shorthandValue = properties[shorthand];
    if (
      shorthandValue.includes("!important") ||
      shorthandValue.includes("var(")
    )
      continue;

    for (const longhand of longhands) {
      if (longhand in properties) {
        const longhandValue = properties[longhand];
        if (
          longhandValue.includes("!important") ||
          longhandValue.includes("var(")
        )
          continue;

        conflicts.push({
          shorthand,
          longhand,
          longhandValue,
        });
      }
    }
  }

  return conflicts;
}

/**
 * longhandプロパティ群からショートハンドに統合可能かチェック
 * すべてのlonghandが揃っており、!importantやCSS変数を含まない場合にtrue
 */
export function canMergeToShorthand(
  rule: ShorthandRule,
  properties: Record<string, string>,
): boolean {
  if (rule.shorthand in properties) {
    return false;
  }

  return rule.longhands.every((longhand) => {
    const value = properties[longhand];
    if (value === undefined) return false;
    if (value.includes("!important") || value.includes("var(")) return false;
    return true;
  });
}

/**
 * longhandの値からshorthand値を生成
 * 同値の場合は短縮形を使用（例: margin: 10px 10px 10px 10px → margin: 10px）
 */
export function buildShorthandValue(
  rule: ShorthandRule,
  properties: Record<string, string>,
): string {
  const values = rule.longhands.map((l) => normalizeZero(properties[l].trim()));

  if (rule.shorthand === "border") {
    return values.join(" ");
  }

  // margin/padding: top right bottom left の短縮形
  const [top, right, bottom, left] = values;

  if (top === right && right === bottom && bottom === left) {
    return top;
  }
  if (top === bottom && right === left) {
    return `${top} ${right}`;
  }
  if (right === left) {
    return `${top} ${right} ${bottom}`;
  }
  return `${top} ${right} ${bottom} ${left}`;
}

/**
 * 0値の正規化: 0px, 0em, 0rem → 0
 */
function normalizeZero(value: string): string {
  return value.replace(/^0(px|em|rem|%|vh|vw|vmin|vmax)$/, "0");
}
