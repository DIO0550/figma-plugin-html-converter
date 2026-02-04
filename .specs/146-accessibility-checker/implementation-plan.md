# Implementation Plan: アクセシビリティチェック機能

## 概要

HTML → Figma変換プロセスにおいて、変換前のHTMLと変換後のFigmaノードの両方でアクセシビリティ問題を自動検出し、WCAG 2.1 Level AA準拠チェックと改善提案（修正コード付き）を行う機能を実装する。

## スコープ

### 対応するWCAG 2.1 Level AA基準

| 基準 | 内容 | チェック対象 |
|------|------|------------|
| 1.1.1 | 非テキストコンテンツ（alt属性） | HTML |
| 1.4.3 | コントラスト（最低限） | HTML + Figma |
| 1.4.4 | テキストのサイズ変更 | HTML |
| 4.1.2 | 名前・役割・値（ARIA） | HTML |

### 機能一覧

1. **チェックルールエンジン** - ルールベースのアクセシビリティ検出
2. **カラーコントラスト計算** - WCAG準拠のコントラスト比計算
3. **セマンティクスチェック** - HTML構造の妥当性検証
4. **MCP AI分析** - 複雑なケースのAI支援分析
5. **問題レポート生成** - 検出結果の構造化レポート
6. **改善提案生成** - 具体的な修正コード付き提案

## システム図

### 状態マシン図

```
                        HTMLパース完了
                            │
                            ▼
                  ┌──────────────────┐
                  │   IDLE (待機)     │
                  └──────────────────┘
                            │
                     チェック開始
                            │
                            ▼
                  ┌──────────────────┐
                  │ HTML_CHECKING    │──── エラー ───▶ ERROR
                  │ (HTML解析中)      │
                  └──────────────────┘
                            │
                     HTML解析完了
                            │
                            ▼
                  ┌──────────────────┐
                  │ FIGMA_CHECKING   │──── エラー ───▶ ERROR
                  │ (Figmaノード解析) │
                  └──────────────────┘
                            │
                     Figma解析完了
                            │
                            ▼
                  ┌──────────────────┐
               ┌──│ AI_ANALYSIS      │──── タイムアウト/エラー ──┐
               │  │ (MCP AI分析)     │                          │
               │  └──────────────────┘                          │
               │           │                                     │
            MCP未接続    AI分析完了                          フォールバック
               │           │                                     │
               │           ▼                                     │
               │  ┌──────────────────┐                          │
               └─▶│ REPORT_GENERATING│◀─────────────────────────┘
                  │ (レポート生成)     │
                  └──────────────────┘
                            │
                     レポート完了
                            │
                            ▼
                  ┌──────────────────┐
                  │ COMPLETED        │
                  │ (チェック完了)     │
                  └──────────────────┘

          ERROR ──── リセット ──▶ IDLE
```

### データフロー図

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  HTML入力     │────▶│ HTMLチェッカー     │────▶│ HTMLチェック結果      │
│ (string)     │     │                  │     │ (A11yIssue[])       │
└─────────────┘     │ ・alt属性チェック   │     └─────────────────────┘
                    │ ・ARIA属性チェック  │                │
                    │ ・セマンティクス    │                │
                    │ ・テキストサイズ    │                │
                    └──────────────────┘                │
                                                        │
┌─────────────┐     ┌──────────────────┐     ┌─────────┴───────────┐
│ Figmaノード  │────▶│ Figmaチェッカー    │────▶│ Figmaチェック結果     │
│ (FigmaNode) │     │                  │     │ (A11yIssue[])       │
└─────────────┘     │ ・コントラスト比   │     └─────────────────────┘
                    │ ・テキストサイズ    │                │
                    └──────────────────┘                │
                                                        │
                    ┌──────────────────┐     ┌─────────▼───────────┐
                    │ MCP AIアナライザー │◀────│ 統合結果              │
                    │                  │     │ (A11yIssue[])       │
                    │ ・複雑ケース分析   │     └─────────────────────┘
                    │ ・パターン認識     │                │
                    │ ・フォールバック   │                │
                    └──────────────────┘                │
                            │                           │
                            ▼                           ▼
                    ┌──────────────────┐     ┌─────────────────────┐
                    │ AI分析結果       │────▶│ レポートジェネレーター   │
                    │ (AIAnalysis)    │     │                     │
                    └──────────────────┘     │ ・問題分類・集約      │
                                            │ ・改善提案生成        │
                                            │ ・修正コード生成      │
                                            └─────────────────────┘
                                                        │
                                                        ▼
                                            ┌─────────────────────┐
                                            │ A11yReport           │
                                            │ ・issues[]           │
                                            │ ・suggestions[]      │
                                            │ ・summary            │
                                            └─────────────────────┘
```

## ディレクトリ構成

```
src/
└── accessibility/                          [NEW]
    ├── index.ts                            [NEW] エントリーポイント
    ├── types.ts                            [NEW] 型定義
    ├── constants/                          [NEW]
    │   └── a11y-constants.ts               [NEW] 定数（WCAG基準値等）
    ├── checker/                            [NEW]
    │   ├── a11y-checker.ts                 [NEW] チェッカーメイン（オーケストレーター）
    │   ├── html-checker/                   [NEW]
    │   │   ├── html-a11y-checker.ts        [NEW] HTMLチェッカー統合
    │   │   ├── alt-text-rule.ts            [NEW] 1.1.1 alt属性チェック
    │   │   ├── aria-rule.ts                [NEW] 4.1.2 ARIA属性チェック
    │   │   ├── semantic-rule.ts            [NEW] セマンティクスチェック
    │   │   ├── text-size-rule.ts           [NEW] 1.4.4 テキストサイズチェック
    │   │   └── __tests__/                  [NEW]
    │   │       ├── alt-text-rule.test.ts
    │   │       ├── aria-rule.test.ts
    │   │       ├── semantic-rule.test.ts
    │   │       └── text-size-rule.test.ts
    │   ├── figma-checker/                  [NEW]
    │   │   ├── figma-a11y-checker.ts       [NEW] Figmaチェッカー統合
    │   │   ├── contrast-rule.ts            [NEW] 1.4.3 コントラスト比チェック
    │   │   ├── figma-text-size-rule.ts     [NEW] Figmaテキストサイズチェック
    │   │   └── __tests__/                  [NEW]
    │   │       ├── contrast-rule.test.ts
    │   │       └── figma-text-size-rule.test.ts
    │   └── __tests__/                      [NEW]
    │       └── a11y-checker.test.ts
    ├── contrast/                           [NEW]
    │   ├── contrast-calculator.ts          [NEW] コントラスト比計算
    │   ├── luminance.ts                    [NEW] 相対輝度計算
    │   └── __tests__/                      [NEW]
    │       ├── contrast-calculator.test.ts
    │       └── luminance.test.ts
    ├── ai-analysis/                        [NEW]
    │   ├── a11y-ai-analyzer.ts             [NEW] MCP AI分析
    │   └── __tests__/                      [NEW]
    │       └── a11y-ai-analyzer.test.ts
    ├── report/                             [NEW]
    │   ├── report-generator.ts             [NEW] レポート生成
    │   ├── suggestion-generator.ts         [NEW] 改善提案生成
    │   └── __tests__/                      [NEW]
    │       ├── report-generator.test.ts
    │       └── suggestion-generator.test.ts
    └── __tests__/                          [NEW]
        └── integration/                    [NEW]
            └── a11y-integration.test.ts
```

## データモデル設計

### 型定義 (`types.ts`)

```typescript
// --- 重要度 ---
type A11ySeverity = "error" | "warning" | "info";

// --- WCAG基準 ---
type WcagCriterion = "1.1.1" | "1.4.3" | "1.4.4" | "4.1.2";

// --- チェック対象 ---
type A11yCheckTarget = "html" | "figma" | "both";

// --- 問題の種類 ---
type A11yIssueType =
  | "missing-alt-text"
  | "empty-alt-text"
  | "missing-aria-label"
  | "invalid-aria-role"
  | "duplicate-aria-id"
  | "low-contrast"
  | "insufficient-text-size"
  | "missing-heading-hierarchy"
  | "missing-landmark"
  | "missing-lang-attribute";

// --- 検出された問題 ---
interface A11yIssue {
  readonly id: string;
  readonly type: A11yIssueType;
  readonly severity: A11ySeverity;
  readonly wcagCriterion: WcagCriterion;
  readonly target: A11yCheckTarget;
  readonly element: A11yElementInfo;
  readonly message: string;
  readonly details?: string;
}

// --- 要素情報 ---
interface A11yElementInfo {
  readonly tagName: string;
  readonly xpath?: string;
  readonly attributes?: Record<string, string>;
  readonly textContent?: string;
  readonly figmaNodeId?: string;
}

// --- 改善提案 ---
interface A11ySuggestion {
  readonly issueId: string;
  readonly description: string;
  readonly fixCode?: A11yFixCode;
  readonly wcagReference: string;
}

// --- 修正コード ---
interface A11yFixCode {
  readonly before: string;
  readonly after: string;
  readonly language: "html" | "css";
}

// --- コントラスト結果 ---
interface ContrastResult {
  readonly ratio: number;
  readonly meetsAA: boolean;
  readonly meetsAALarge: boolean;
  readonly foreground: RGB;
  readonly background: RGB;
}

// --- AI分析結果 ---
interface A11yAIAnalysis {
  readonly additionalIssues: A11yIssue[];
  readonly enhancedSuggestions: A11ySuggestion[];
  readonly confidence: number;
}

// --- レポート ---
interface A11yReport {
  readonly issues: readonly A11yIssue[];
  readonly suggestions: readonly A11ySuggestion[];
  readonly summary: A11ySummary;
  readonly timestamp: string;
  readonly aiAnalysis?: A11yAIAnalysis;
}

// --- サマリー ---
interface A11ySummary {
  readonly totalIssues: number;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly infoCount: number;
  readonly wcagCompliance: WcagComplianceStatus;
}

// --- WCAG準拠状態 ---
interface WcagComplianceStatus {
  readonly "1.1.1": boolean;
  readonly "1.4.3": boolean;
  readonly "1.4.4": boolean;
  readonly "4.1.2": boolean;
  readonly overallAA: boolean;
}

// --- チェッカー設定 ---
interface A11yCheckerConfig {
  readonly enabledRules: readonly A11yIssueType[];
  readonly checkTarget: A11yCheckTarget;
  readonly useAIAnalysis: boolean;
  readonly contrastThreshold?: number;
  readonly minTextSize?: number;
}

// --- ルールインターフェース ---
interface A11yRule {
  readonly id: A11yIssueType;
  readonly wcagCriterion: WcagCriterion;
  readonly severity: A11ySeverity;
  check(context: A11yCheckContext): readonly A11yIssue[];
}

// --- チェックコンテキスト ---
interface A11yCheckContext {
  readonly html?: string;
  readonly parsedNodes?: readonly ParsedHtmlNode[];
  readonly figmaNodes?: readonly FigmaNodeInfo[];
  readonly config: A11yCheckerConfig;
}

// --- パース済みHTMLノード ---
interface ParsedHtmlNode {
  readonly tagName: string;
  readonly attributes: Record<string, string>;
  readonly textContent: string;
  readonly children: readonly ParsedHtmlNode[];
  readonly xpath: string;
}

// --- Figmaノード情報 ---
interface FigmaNodeInfo {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly fills?: readonly FigmaPaint[];
  readonly fontSize?: number;
  readonly parentFills?: readonly FigmaPaint[];
}
```

## 実装詳細

### 1. コントラスト計算 (`contrast/`)

WCAG 2.1のコントラスト比算出アルゴリズムを実装。

**相対輝度計算（luminance.ts）:**
```
L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear

R_linear = (R_sRGB <= 0.04045) ? R_sRGB / 12.92 : ((R_sRGB + 0.055) / 1.055) ^ 2.4
```

**コントラスト比計算（contrast-calculator.ts）:**
```
contrast_ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

**WCAG AA基準値:**
- 通常テキスト: 4.5:1以上
- 大きいテキスト（18pt以上 or 14pt太字以上）: 3:1以上

既存の `src/converter/models/colors/` のRGBモデルを再利用する。

### 2. HTMLチェッカー (`checker/html-checker/`)

各ルールは `A11yRule` インターフェースを実装：

| ルール | チェック内容 |
|--------|------------|
| `alt-text-rule` | img要素のalt属性の有無・空文字チェック |
| `aria-rule` | role属性の妥当性、aria-label/aria-labelledbyの存在、IDの重複 |
| `semantic-rule` | 見出し階層（h1→h2→h3）、ランドマーク要素、lang属性 |
| `text-size-rule` | font-sizeが最小サイズ（12px）以上か |

### 3. Figmaチェッカー (`checker/figma-checker/`)

| ルール | チェック内容 |
|--------|------------|
| `contrast-rule` | テキストノードの前景色/背景色のコントラスト比 |
| `figma-text-size-rule` | Figmaテキストノードのフォントサイズ |

### 4. MCP AI分析 (`ai-analysis/`)

既存の `MCPClient` と `FallbackHandler` パターンを踏襲：

- MCPクライアント接続時: `tools/call` メソッドで分析リクエスト送信
- MCPクライアント未接続時: ルールベースの結果のみで完了（フォールバック）
- タイムアウト: デフォルト30秒

### 5. レポート生成 (`report/`)

- 全チェック結果を統合・重複排除
- WCAG基準ごとの準拠状態を集計
- 各問題に対する改善提案（HTML/CSS修正コード付き）を生成

## 既存ファイルへの変更

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `src/code.ts` | [MODIFY] | アクセシビリティチェックの呼び出しを追加 |
| `src/accessibility/index.ts` | [NEW] | エクスポート定義 |

## 検証計画

### 単体テスト

- 各ルール（alt-text, aria, semantic, text-size, contrast）のテスト
- コントラスト計算の精度テスト（既知の色ペアで検証）
- 相対輝度計算のテスト
- レポート生成のテスト
- 改善提案生成のテスト
- AI分析のテスト（モック使用）

### 統合テスト

- 実際のHTML文字列を入力→レポート出力の一連フロー
- MCPクライアント接続/未接続の両ケース
- エラーケース（不正なHTML、空入力等）

### カバレッジ目標

- 90%以上

## 完了チェックリスト

- [x] 状態マシン図が含まれているか
- [x] データフロー図が含まれているか
- [x] 図にすべての状態・遷移条件・エッジケースが含まれているか
- [x] 図と各セクションの内容が整合しているか
