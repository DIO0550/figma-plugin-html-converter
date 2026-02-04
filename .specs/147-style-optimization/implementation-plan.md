# スタイル最適化機能の実装

冗長なスタイルを検出し、最適化提案を行う機能を実装します。HTML→Figma変換の前処理としても、独立した分析ツールとしても利用可能にします。MCP経由でAIによる高度な最適化提案も提供します。

## ユーザーレビューが必要な点

> **NOTE**
> - 破壊的変更はありません。新規機能の追加です。
> - 既存のStyles型を利用し、新しい最適化モジュールとして実装します。
> - MCP依存: #143（MCP統合基盤）が実装済みであることが前提です。
> - 自動適用/手動適用は切り替え可能な設計にします。
> - 検出パターン: 重複プロパティ、デフォルト値の明示、ショートハンド統合の3種すべてを実装します。
>
> **IMPORTANT - 設計判断**
> - デフォルト値の基準: **CSS仕様の初期値**を基準とします（Figma既定値ではない）。ただし`display`は要素種別（ブロック/インライン）で初期値が異なるため、要素別マップを用意します。
> - `!important`付きプロパティ: 最適化対象外とし、そのまま保持します（Figma変換時にimportantは無視されるため影響なし）。
> - CSS変数（`var(--xxx)`）: 解決不能なため最適化対象外とします。
> - 単位差（`0px` vs `0` vs `0em`）: 値が0の場合は同値として扱い、それ以外は異なる値として保持します。
> - shorthandとlonghand混在: shorthandが既にある場合、同じ軸のlonghandは重複として検出します。longhandのみの場合にショートハンド統合を提案します。
> - border系複合要素: `border-width/style/color`の3プロパティが揃った場合のみ`border`への統合を提案します。部分的な場合は提案しません。
> - 最適化の適用箇所: **Styles型のインスタンスを差し替え**ます（HTMLノードは変更しない）。変換パイプライン内でStyles.parse()後、toFigmaNode()前に最適化済みStylesを注入します。
> - 手動モード時の適用タイミング: UI上で承認された提案のみを収集し、一括でStylesを再構築してから変換を続行します。
> - MCP提案とローカル提案の衝突解決: 同一プロパティに対する提案が重複した場合、**confidence値が高い方を優先**します。同値の場合はローカル提案を優先します（確定的ルールのため）。

## システム図

### 状態マシン / フロー図

```
                      HTML入力
                         │
                         ▼
                 ┌───────────────┐
                 │    IDLE       │
                 │ (待機状態)    │
                 └───────────────┘
                         │
              ユーザーがHTML入力
              or 変換パイプライン開始
                         │
                         ▼
                 ┌───────────────┐
                 │   PARSING     │
                 │ (スタイル解析)│
                 └───────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  ANALYZING    │
                 │ (冗長性検出)  │
                 └───────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ┌──────────────┐     ┌──────────────┐
      │ LOCAL_DETECT │     │  AI_DETECT   │
      │ (ローカル    │     │ (MCP経由     │
      │  ルール検出) │     │  高度な提案) │
      └──────────────┘     └──────────────┘
              │                     │
              │              ┌──────┴──────┐
              │              │             │
              │              ▼             ▼
              │       MCP接続成功    MCP接続失敗
              │              │        (フォールバック
              │              │         →ローカルのみ)
              │              │             │
              └──────┬───────┘─────────────┘
                     │
                     ▼
             ┌───────────────┐
             │   PROPOSING   │
             │ (提案生成)    │
             └───────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   自動適用モード          手動適用モード
          │                     │
          ▼                     ▼
  ┌──────────────┐     ┌──────────────┐
  │ AUTO_APPLY   │     │  REVIEWING   │
  │ (自動最適化) │     │ (ユーザー    │
  └──────────────┘     │  レビュー)   │
          │            └──────────────┘
          │                     │
          │           ユーザーが承認/却下
          │              ┌──────┴──────┐
          │              ▼             ▼
          │         承認 → 適用    却下 → スキップ
          │              │             │
          └──────┬───────┘─────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  OPTIMIZED    │
         │ (最適化完了)  │
         └───────────────┘
                 │
          ┌──────┴──────┐
          │             │
          ▼             ▼
    前処理として     独立分析として
    変換続行         レポート表示
```

### データフロー

```
HTML入力（ユーザー or 変換パイプライン）
    │
    ▼
StyleAnalyzer（スタイル解析）
    │
    ├─ Styles.parse() で各要素のスタイルを抽出
    │
    ▼
RedundancyDetector（冗長性検出）
    │
    ├─ DuplicatePropertyDetector（重複プロパティ検出）
    │   └─ 例: "color: red; color: blue;" → "color: blue;"
    │
    ├─ DefaultValueDetector（デフォルト値検出）
    │   └─ 例: "position: static;" → 削除提案
    │
    ├─ ShorthandDetector（ショートハンド統合検出）
    │   └─ 例: "margin-top:10px; margin-right:10px;..." → "margin: 10px;"
    │
    ▼
OptimizationProposal（最適化提案生成）
    │
    ├─ ローカル提案（確定的ルール）
    │
    ├─ AI提案（MCP経由）
    │   ├─ MCPClient.requestWithRetry()
    │   ├─ FallbackHandler.executeWithFallback()
    │   └─ セマンティックな冗長性分析
    │
    ▼
StyleOptimizer（最適化適用）
    │
    ├─ 自動適用モード → 即時適用
    ├─ 手動適用モード → UI表示 → ユーザー承認
    │
    ▼
OptimizedStyles（最適化済みスタイル）
    │
    ├─ 前処理モード → convertHTMLToFigma() に渡す
    └─ 独立分析モード → UIにレポート表示
         │
         ├─ ビフォー・アフター比較
         └─ 最適化サマリー
```

## 変更案

### 1. スタイル分析・冗長性検出

#### [NEW] `src/converter/models/styles/style-analyzer/style-analyzer.ts`

HTMLノードツリーからスタイル情報を収集・分析するモジュール。

- **ロジック**: HTMLNodeを走査し、各要素のStylesを抽出・集約
- **型定義**: `StyleAnalysisResult`（要素パス、スタイル、検出結果を含む）
- **パターン**: コンパニオンオブジェクトパターン（既存のStyles等と統一）

#### [NEW] `src/converter/models/styles/style-analyzer/__tests__/style-analyzer.test.ts`

StyleAnalyzerのユニットテスト。

#### [NEW] `src/converter/models/styles/redundancy-detector/redundancy-detector.ts`

冗長なスタイルを検出するモジュール。3つの検出パターンを統合管理。

- **ロジック**:
  - `detect(styles: Styles, tagName?: string): RedundancyIssue[]` - 全パターンで検出（tagNameはデフォルト値判定に使用）
  - `detectDuplicates(styles: Styles): RedundancyIssue[]` - 重複プロパティ検出
  - `detectDefaults(styles: Styles, tagName?: string): RedundancyIssue[]` - デフォルト値検出（要素種別考慮）
  - `detectShorthandOpportunities(styles: Styles): RedundancyIssue[]` - ショートハンド統合検出
  - `detectShorthandLonghandConflicts(styles: Styles): RedundancyIssue[]` - shorthand/longhand混在検出
- **フィルタリング**: `!important`付き・CSS変数含有プロパティは全検出パターンで除外

#### [NEW] `src/converter/models/styles/redundancy-detector/__tests__/redundancy-detector.test.ts`

RedundancyDetectorのユニットテスト。各検出パターンの網羅的テスト。

#### [NEW] `src/converter/models/styles/redundancy-detector/types.ts`

冗長性検出の型定義。

```typescript
type RedundancyType = "duplicate-property" | "default-value" | "shorthand-opportunity";
type RedundancySeverity = "low" | "medium" | "high";

interface RedundancyIssue {
  type: RedundancyType;
  severity: RedundancySeverity;
  property: string;
  currentValue: string;
  suggestedValue?: string;
  description: string;
}
```

#### [NEW] `src/converter/models/styles/redundancy-detector/default-values.ts`

CSS仕様に基づくプロパティのデフォルト値マップ。

- **汎用デフォルト値マップ**: `position: "static"`, `opacity: "1"`, `visibility: "visible"`, `overflow: "visible"`, `float: "none"`, `clear: "none"`, `vertical-align: "baseline"`, `text-decoration: "none"`, `font-style: "normal"`, `font-weight: "normal"` 等
- **要素別デフォルト値マップ**: `display`は要素種別で異なるため要素別に管理
  - ブロック要素（div, section, p, h1-h6等）: `display: "block"`
  - インライン要素（span, a, strong, em等）: `display: "inline"`
  - テーブル要素（table, tr, td等）: `display: "table"`, `display: "table-row"` 等
  - リスト要素（li）: `display: "list-item"`
- **除外条件**: `!important`付き、CSS変数`var()`を含む値は検出対象外
- **ロジック**: 要素のタグ名を考慮してデフォルト値との一致を判定

#### [NEW] `src/converter/models/styles/redundancy-detector/shorthand-rules.ts`

ショートハンド統合のルール定義。

- **ルール定義**:
  - `margin-top/right/bottom/left → margin`（4つ全て揃った場合のみ）
  - `padding-top/right/bottom/left → padding`（4つ全て揃った場合のみ）
  - `border-width + border-style + border-color → border`（3つ全て揃った場合のみ）
- **混在検出**: shorthandが既に存在する場合に同軸のlonghandがあれば重複として検出（例: `margin: 10px; margin-top: 20px;`）
- **除外条件**:
  - `!important`付きプロパティは統合対象外
  - CSS変数`var()`を含む値は統合対象外
  - 単位が混在する場合（`px`と`%`等）は統合対象外
- **値の正規化**: `0px`, `0em`, `0rem`, `0`はすべて`0`として同値判定

### 2. 最適化提案・適用

#### [NEW] `src/converter/models/styles/style-optimizer/style-optimizer.ts`

スタイル最適化の提案生成と適用を行うモジュール。

- **ロジック**:
  - `optimize(styles: Styles, issues: RedundancyIssue[]): OptimizationResult` - 最適化実行
  - `generateProposals(issues: RedundancyIssue[]): OptimizationProposal[]` - 提案生成
  - `mergeProposals(local: OptimizationProposal[], ai: OptimizationProposal[]): OptimizationProposal[]` - ローカル/AI提案の統合（同一プロパティはconfidence高い方優先、同値ならローカル優先）
  - `applyProposal(styles: Styles, proposal: OptimizationProposal): Styles` - 個別提案適用
  - `applyAll(styles: Styles, proposals: OptimizationProposal[]): Styles` - 全提案適用
  - `applyApproved(styles: Styles, proposals: OptimizationProposal[], approvedIds: string[]): Styles` - 承認済み提案のみ適用（手動モード用）
  - `compare(before: Styles, after: Styles): StyleComparison` - ビフォー・アフター比較

#### [NEW] `src/converter/models/styles/style-optimizer/__tests__/style-optimizer.test.ts`

StyleOptimizerのユニットテスト。

#### [NEW] `src/converter/models/styles/style-optimizer/types.ts`

最適化の型定義。

```typescript
type OptimizationMode = "auto" | "manual";

interface OptimizationProposal {
  id: string;
  issue: RedundancyIssue;
  action: "remove" | "replace" | "merge";
  beforeValue: string;
  afterValue: string;
  confidence: number;  // 0-1
  source: "local" | "ai";
}

interface OptimizationResult {
  originalStyles: Styles;
  optimizedStyles: Styles;
  proposals: OptimizationProposal[];
  appliedCount: number;
  skippedCount: number;
  summary: OptimizationSummary;
}

interface StyleComparison {
  added: Record<string, string>;
  removed: Record<string, string>;
  changed: Array<{ property: string; before: string; after: string }>;
  unchanged: Record<string, string>;
  reductionPercentage: number;
}

interface OptimizationSummary {
  totalIssues: number;
  applied: number;
  skipped: number;
  reductionPercentage: number;
  byType: Record<RedundancyType, number>;
}
```

### 3. MCP/AI統合

#### [NEW] `src/mcp/style-optimization/style-optimization-ai.ts`

MCP経由でAIにスタイル最適化の高度な提案をリクエストするモジュール。

- **ロジック**:
  - `requestAIOptimization(client: MCPClientState, styles: Styles, context?: string): Promise<AIOptimizationProposal[]>` - AI提案リクエスト
  - MappingOptimizerと同様のパターンで実装
  - FallbackHandler.executeWithFallbackで接続失敗時のフォールバック

#### [NEW] `src/mcp/style-optimization/__tests__/style-optimization-ai.test.ts`

StyleOptimizationAIのユニットテスト。

#### [NEW] `src/mcp/style-optimization/types.ts`

AI最適化の型定義。

```typescript
interface AIOptimizationRequest {
  styles: Record<string, string>;
  html?: string;
  context?: string;
}

interface AIOptimizationResponse {
  proposals: AIOptimizationProposal[];
  processingTimeMs: number;
}

interface AIOptimizationProposal {
  property: string;
  suggestion: string;
  reason: string;
  confidence: number;
}
```

### 4. 変換パイプライン統合

#### [MODIFY] `src/converter/index.ts`

変換パイプラインにスタイル最適化の前処理ステップを追加。

- ConversionOptionsに`optimizeStyles?: boolean`と`optimizationMode?: OptimizationMode`を追加
- `convertHTMLToFigma()`内の処理フロー:
  1. HTMLパース → HTMLNodeツリー取得
  2. **（新規）** `optimizeStyles === true`の場合: 各ノードのstyle属性からStyles.parse()で取得したStylesに対してRedundancyDetector.detect()を実行
  3. **（新規）** 自動モード: StyleOptimizer.applyAll()で最適化済みStylesに差し替え
  4. **（新規）** 手動モード: 提案をOptimizationResultとして返却（変換は一時停止、UIで承認後に続行）
  5. 最適化済みStyles（または元のStyles）を使ってtoFigmaNode()を実行
- **適用方式**: Styles型のインスタンスを差し替え。HTMLノードのDOM構造は変更しない。

#### [MODIFY] `src/converter/types.ts`

ConversionOptionsにスタイル最適化オプションを追加。

- `optimizeStyles?: boolean` - 最適化を有効にするか
- `optimizationMode?: "auto" | "manual"` - 自動/手動モード

### 5. UI統合

#### [MODIFY] `src/ui.html`

最適化パネルをUIに追加。

- 「スタイル最適化」チェックボックス（有効/無効切り替え）
- 自動/手動モード切り替えトグル
- 最適化結果表示エリア（ビフォー・アフター比較テーブル）
- 個別提案の承認/却下ボタン（手動モード時）
- 最適化サマリー表示

#### [MODIFY] `src/code.ts`

プラグインコードにスタイル最適化メッセージハンドリングを追加。

- `optimize-styles`メッセージの処理
- `apply-optimization`メッセージの処理
- `optimization-result`/`optimization-error`の返送
- PluginMessageインターフェースに新しいメッセージタイプを追加

### 6. エクスポート

#### [MODIFY] `src/converter/models/styles/index.ts`（存在する場合）

新しいモジュールのエクスポートを追加。

#### [NEW] `src/mcp/style-optimization/index.ts`

MCP style-optimizationモジュールのエクスポート。

## 検証計画

### 自動テスト

```bash
pnpm test
```

- RedundancyDetectorの各検出パターン（重複、デフォルト値、ショートハンド）のユニットテスト
- StyleAnalyzerの解析ロジックテスト
- StyleOptimizerの提案生成・適用テスト
- ビフォー・アフター比較ロジックのテスト
- MCP AI統合のテスト（モック使用）
- フォールバック処理のテスト
- 変換パイプライン統合テスト（最適化有効/無効）
- エッジケース: 空スタイル、単一プロパティ、100個以上のプロパティ
- カバレッジ90%以上を目標

### 手動検証

1. プラグインUIで「スタイル最適化」を有効にし、冗長なスタイルを含むHTMLを入力
2. 自動モード: 冗長スタイルが自動的に最適化されて変換されることを確認
3. 手動モード: 提案一覧が表示され、個別に承認/却下できることを確認
4. ビフォー・アフター比較が正しく表示されることを確認
5. MCP未接続時にフォールバックでローカル最適化のみ実行されることを確認
6. 最適化なし時と比較して変換結果が改善されていることを確認
