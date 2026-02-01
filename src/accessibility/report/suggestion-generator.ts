/**
 * 改善提案生成
 */
import type { A11yIssue, A11ySuggestion } from "../types";
import { WCAG_REFERENCE_URLS } from "../constants";

/**
 * 問題リストから改善提案を生成する
 */
export function generateSuggestions(
  issues: readonly A11yIssue[],
): readonly A11ySuggestion[] {
  return issues.map((issue) => createSuggestion(issue));
}

function createSuggestion(issue: A11yIssue): A11ySuggestion {
  const generator = SUGGESTION_MAP[issue.type] ?? createDefaultSuggestion;
  return generator(issue);
}

type SuggestionGenerator = (issue: A11yIssue) => A11ySuggestion;

const SUGGESTION_MAP: Record<string, SuggestionGenerator> = {
  "missing-alt-text": (issue) => ({
    issueId: issue.id,
    description:
      "img要素にalt属性を追加してください。画像の内容を説明するテキストを指定します",
    fixCode: {
      before: `<img src="${issue.element.attributes?.["src"] ?? "image.png"}">`,
      after: `<img src="${issue.element.attributes?.["src"] ?? "image.png"}" alt="画像の説明">`,
      language: "html",
    },
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "empty-alt-text": (issue) => ({
    issueId: issue.id,
    description:
      'alt属性が空です。装飾画像の場合はrole="presentation"を追加し、そうでなければ説明テキストを追加してください',
    fixCode: {
      before: `<img src="${issue.element.attributes?.["src"] ?? "image.png"}" alt="">`,
      after: `<img src="${issue.element.attributes?.["src"] ?? "image.png"}" alt="画像の説明">`,
      language: "html",
    },
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "low-contrast": (issue) => ({
    issueId: issue.id,
    description:
      "テキストと背景色のコントラスト比を4.5:1以上に調整してください。テキスト色を暗くするか、背景色を明るくします",
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "insufficient-text-size": (issue) => ({
    issueId: issue.id,
    description:
      "フォントサイズを12px以上に変更してください。小さすぎるテキストは読みにくくなります",
    fixCode: {
      before: "font-size: (現在の値)",
      after: "font-size: 12px",
      language: "css",
    },
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "invalid-aria-role": (issue) => ({
    issueId: issue.id,
    description:
      "有効なARIAロールを指定してください。WAI-ARIAの仕様で定義されたロールのみが有効です",
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "duplicate-aria-id": (issue) => ({
    issueId: issue.id,
    description:
      "id属性は文書内で一意である必要があります。重複するidを修正してください",
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "missing-aria-label": (issue) => ({
    issueId: issue.id,
    description:
      "インタラクティブ要素にアクセシブルな名前を追加してください（aria-label、aria-labelledby、またはテキストコンテンツ）",
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "missing-heading-hierarchy": (issue) => ({
    issueId: issue.id,
    description: "見出し階層をスキップせずに使用してください（h1→h2→h3の順序）",
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "missing-landmark": (issue) => ({
    issueId: issue.id,
    description:
      "ページにランドマーク要素（header, nav, main, aside, footer）を追加してください",
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),

  "missing-lang-attribute": (issue) => ({
    issueId: issue.id,
    description: 'html要素にlang属性を追加してください（例: lang="ja"）',
    fixCode: {
      before: "<html>",
      after: '<html lang="ja">',
      language: "html",
    },
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  }),
};

function createDefaultSuggestion(issue: A11yIssue): A11ySuggestion {
  return {
    issueId: issue.id,
    description: `${issue.message}を修正してください`,
    wcagReference: WCAG_REFERENCE_URLS[issue.wcagCriterion],
  };
}
