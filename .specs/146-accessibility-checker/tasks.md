# Tasks: アクセシビリティチェック機能 (#146)

## Task 1: 型定義と定数の実装

□ Research & Planning
  □ 既存の型定義パターン（src/mcp/types.ts）を確認

□ Implementation
  □ src/accessibility/types.ts - 全型定義の実装
  □ src/accessibility/constants/a11y-constants.ts - WCAG基準値、デフォルト設定
  □ src/accessibility/index.ts - エクスポート定義（型のみ先行）

□ Verification
  □ 型チェック（pnpm type-check）パス
  □ リント（pnpm lint）パス

---

## Task 2: コントラスト計算の実装

□ Research & Planning
  □ 既存カラーモデル（src/converter/models/colors/）の再利用方法確認

□ Implementation
  □ src/accessibility/contrast/luminance.ts - 相対輝度計算（sRGBリニア化 + 加重平均）
  □ src/accessibility/contrast/__tests__/luminance.test.ts - テスト
  □ src/accessibility/contrast/contrast-calculator.ts - コントラスト比計算・AA判定
  □ src/accessibility/contrast/__tests__/contrast-calculator.test.ts - テスト

□ Verification
  □ 既知の色ペアでコントラスト比が正確（白/黒=21:1等）
  □ テストグリーン・カバレッジ90%以上

---

## Task 3: HTMLチェックルールの実装

□ Research & Planning
  □ 既存HTMLパーサーの使用方法確認

□ Implementation
  □ src/accessibility/checker/html-checker/alt-text-rule.ts - alt属性チェック
  □ src/accessibility/checker/html-checker/__tests__/alt-text-rule.test.ts
  □ src/accessibility/checker/html-checker/aria-rule.ts - ARIA属性チェック
  □ src/accessibility/checker/html-checker/__tests__/aria-rule.test.ts
  □ src/accessibility/checker/html-checker/semantic-rule.ts - セマンティクスチェック
  □ src/accessibility/checker/html-checker/__tests__/semantic-rule.test.ts
  □ src/accessibility/checker/html-checker/text-size-rule.ts - テキストサイズチェック
  □ src/accessibility/checker/html-checker/__tests__/text-size-rule.test.ts
  □ src/accessibility/checker/html-checker/html-a11y-checker.ts - HTML統合チェッカー

□ Verification
  □ 各ルールが正しい問題を検出
  □ 偽陽性が発生しない
  □ テストグリーン・カバレッジ90%以上

---

## Task 4: Figmaチェックルールの実装

□ Implementation
  □ src/accessibility/checker/figma-checker/contrast-rule.ts - コントラスト比チェック
  □ src/accessibility/checker/figma-checker/__tests__/contrast-rule.test.ts
  □ src/accessibility/checker/figma-checker/figma-text-size-rule.ts - テキストサイズチェック
  □ src/accessibility/checker/figma-checker/__tests__/figma-text-size-rule.test.ts
  □ src/accessibility/checker/figma-checker/figma-a11y-checker.ts - Figma統合チェッカー

□ Verification
  □ Figmaノード情報からコントラスト問題を正しく検出
  □ テストグリーン・カバレッジ90%以上

---

## Task 5: チェッカーオーケストレーターの実装

□ Implementation
  □ src/accessibility/checker/a11y-checker.ts - メインチェッカー（HTML+Figma統合）
  □ src/accessibility/checker/__tests__/a11y-checker.test.ts

□ Verification
  □ HTMLチェックとFigmaチェックが正しく統合される
  □ 設定による有効/無効の切り替えが動作
  □ テストグリーン

---

## Task 6: MCP AI分析の実装

□ Research & Planning
  □ 既存AI最適化パターン（mapping-optimizer.ts）確認

□ Implementation
  □ src/accessibility/ai-analysis/a11y-ai-analyzer.ts - AI分析
  □ src/accessibility/ai-analysis/__tests__/a11y-ai-analyzer.test.ts

□ Verification
  □ MCPクライアント接続時にAI分析が実行される
  □ MCPクライアント未接続時にフォールバックが動作
  □ テストグリーン

---

## Task 7: レポート・改善提案生成の実装

□ Implementation
  □ src/accessibility/report/suggestion-generator.ts - 改善提案（修正コード付き）生成
  □ src/accessibility/report/__tests__/suggestion-generator.test.ts
  □ src/accessibility/report/report-generator.ts - レポート集約・サマリー生成
  □ src/accessibility/report/__tests__/report-generator.test.ts

□ Verification
  □ 各問題タイプに対応する改善提案が生成される
  □ 修正コード（before/after）が正しい
  □ WCAG準拠状態が正確に計算される
  □ テストグリーン

---

## Task 8: 統合テストとエクスポート整備

□ Implementation
  □ src/accessibility/__tests__/integration/a11y-integration.test.ts - E2E統合テスト
  □ src/accessibility/index.ts - 全エクスポートの整備
  □ src/code.ts の修正 - アクセシビリティチェック呼び出し追加

□ Verification
  □ 実際のHTML入力→レポート出力の一連フロー動作
  □ 全テストグリーン
  □ pnpm type-check パス
  □ pnpm lint パス
  □ カバレッジ90%以上
