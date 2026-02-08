# Task: スタイル最適化機能の実装

## Research & Planning

- [x] 既存のStyles型・Styles.parse()の実装を調査し、最適化が介入可能なポイントを確認
- [x] 既存のMCP統合パターン（MappingOptimizer、FallbackHandler）を調査し、AI最適化の実装方針を確定
- [x] 変換パイプライン（convertHTMLToFigma）のフローを確認し、最適化ステップの挿入箇所を特定
- [x] CSSデフォルト値の一覧を整理し、要素別デフォルト値マップを設計

## Implementation

### Phase 1: 型定義・定数

- [x] `src/converter/models/styles/redundancy-detector/types.ts` を作成（RedundancyType, RedundancySeverity, RedundancyIssue）
- [x] `src/converter/models/styles/style-optimizer/types.ts` を作成（OptimizationMode, OptimizationProposal, OptimizationResult, StyleComparison, OptimizationSummary）
- [x] `src/mcp/style-optimization/types.ts` を作成（AIOptimizationRequest, AIOptimizationResponse, AIOptimizationProposal）

### Phase 2: 冗長性検出

- [x] `src/converter/models/styles/redundancy-detector/default-values.ts` を作成（CSS仕様ベースのデフォルト値マップ + 要素別マップ）
- [x] `src/converter/models/styles/redundancy-detector/default-values.ts` のテストを作成
- [x] `src/converter/models/styles/redundancy-detector/shorthand-rules.ts` を作成（ショートハンドルール定義 + 混在検出ルール）
- [x] `src/converter/models/styles/redundancy-detector/shorthand-rules.ts` のテストを作成
- [x] `src/converter/models/styles/redundancy-detector/redundancy-detector.ts` を作成（detect, detectDuplicates, detectDefaults, detectShorthandOpportunities, detectShorthandLonghandConflicts）
- [x] `src/converter/models/styles/redundancy-detector/__tests__/redundancy-detector.test.ts` を作成（各検出パターンの網羅テスト + !important除外 + CSS変数除外 + 要素別デフォルト値）

### Phase 3: スタイル分析

- [x] `src/converter/models/styles/style-analyzer/style-analyzer.ts` を作成（HTMLNodeツリー走査 + スタイル収集）
- [x] `src/converter/models/styles/style-analyzer/__tests__/style-analyzer.test.ts` を作成

### Phase 4: 最適化提案・適用

- [x] `src/converter/models/styles/style-optimizer/style-optimizer.ts` を作成（optimize, generateProposals, mergeProposals, applyProposal, applyAll, applyApproved, compare）
- [x] `src/converter/models/styles/style-optimizer/__tests__/style-optimizer.test.ts` を作成（提案生成・適用・衝突解決・ビフォーアフター比較テスト）

### Phase 5: MCP/AI統合

- [x] `src/mcp/style-optimization/style-optimization-ai.ts` を作成（requestAIOptimization + FallbackHandler統合）
- [x] `src/mcp/style-optimization/__tests__/style-optimization-ai.test.ts` を作成（MCP接続成功/失敗/フォールバック テスト）
- [x] `src/mcp/style-optimization/index.ts` を作成（エクスポート）

### Phase 6: 変換パイプライン統合

- [x] `src/converter/types.ts` を修正（ConversionOptionsにoptimizeStyles, optimizationModeを追加）
- [x] `src/converter/index.ts` を修正（最適化ステップをパイプラインに挿入）
- [x] 変換パイプライン統合テストを作成（最適化有効/無効/自動/手動モードの組み合わせ）

### Phase 7: UI統合

- [x] `src/code.ts` を修正（optimize-styles, apply-optimizationメッセージハンドリング追加）
- [x] `src/ui.html` を修正（最適化パネル追加: チェックボックス、モード切替、結果表示、承認/却下ボタン、サマリー）

### Phase 8: エクスポート整備

- [x] スタイル関連モジュールのエクスポートを整備（index.tsの更新）

## Verification

- [x] 全ユニットテストが通ることを確認（`pnpm test`）
- [x] 型チェックが通ることを確認（`pnpm run type-check`）
- [x] リントが通ることを確認（`pnpm run lint`）
- [x] カバレッジ90%以上を確認（`pnpm run coverage`）
- [x] エッジケーステスト: 空スタイル、単一プロパティ、大量プロパティ（100以上）、!important付き、CSS変数含有
- [ ] 手動検証: プラグインUIで自動/手動モードの動作確認
- [ ] 手動検証: MCP未接続時のフォールバック動作確認
- [ ] 手動検証: ビフォー・アフター比較表示の確認
