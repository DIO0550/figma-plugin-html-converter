# タスク一覧: mapHTMLNodeToFigma フェーズ分割リファクタリング

**Issue**: #230

## Research & Planning

- [x] 既存 mapper.ts の構造分析
- [x] 既存テストの確認と分類
- [x] implementation-plan.md の作成
- [x] Codex レビューループ（5回完了）

## Implementation

### Phase 1: resolveByTag の抽出
- [x] `ResolveResult` 型を定義
- [x] `resolveByTag` 関数を抽出（L67〜L209の処理を移動）
- [x] `mapHTMLNodeToFigma` から resolveByTag を呼び出すように変更
- [x] 既存テスト実行で回帰確認

### Phase 2: スタイルパース共通化
- [x] styles 変数を mapHTMLNodeToFigma のスコープに引き上げ（1回のみパース）
- [x] 既存テスト実行で回帰確認

### Phase 3: applyAutoLayout の抽出
- [x] `applyAutoLayout` 関数を抽出（L218〜L233の処理を移動）
- [x] 既存テスト実行で回帰確認

### Phase 4: applyPadding の抽出
- [x] `applyPadding` 関数を抽出（L235〜L263の処理を移動）
- [x] 適用条件 `!nodeConfig.layoutMode || nodeConfig.layoutMode === "NONE"` を維持
- [x] 既存テスト実行で回帰確認

### Phase 5: applyPositioning の抽出
- [x] `applyPositioning` 関数を抽出（L265〜L320の処理を移動）
- [x] z-index は position non-static 時のみ適用を維持
- [x] 既存テスト実行で回帰確認

### Phase 6: applySizing の抽出
- [x] `applySizing` 関数を抽出（L322〜L414の処理を移動）
- [x] 既存テスト実行で回帰確認

### Phase 7: applyVisualStyles の抽出
- [x] `applyVisualStyles` 関数を抽出（L416〜L433の処理を移動）
- [x] 既存テスト実行で回帰確認

### Phase 8: appendChildren の抽出
- [x] `appendChildren` 関数を抽出（L437〜L490の処理を移動）
- [x] styles 引数を追加（display補正用）
- [x] コメント除外後の children.length === 0 での早期return を維持
- [x] 既存テスト実行で回帰確認

### Phase 9: mapHTMLNodeToFigma の最終整理
- [x] mapHTMLNodeToFigma をフェーズ呼び出し構造に整理
- [x] 全既存テスト実行で回帰確認

## Verification

### 新規テスト作成
- [x] mapper-phases.test.ts 作成
  - [x] 入口（text/comment）回帰テスト
  - [x] resolveByTag 統合テスト（各タグ種別）
  - [x] applyAutoLayout 統合テスト
  - [x] applyPadding 統合テスト
  - [x] applyPositioning 統合テスト（z-index条件含む）
  - [x] applySizing 統合テスト
  - [x] applyVisualStyles 統合テスト
  - [x] appendChildren 統合テスト（コメントのみ子要素含む）
  - [x] nullフォールバック回帰テスト（vi.mock使用）
  - [x] Styles.parse パース回数テスト

### 最終検証
- [x] `pnpm run test src/converter/mapper.test.ts` 全パス
- [x] `pnpm run test src/converter/__tests__/style-optimization-integration.test.ts` 全パス
- [x] `pnpm run test src/converter/elements/embed/__tests__/embed-integration.test.ts` 全パス
- [x] `pnpm run test src/converter/elements/object/__tests__/object-integration.test.ts` 全パス
- [x] `pnpm run test src/converter/mapper-phases-*.test.ts` 全パス
- [x] `pnpm test` 全パス
- [x] `pnpm run type-check` エラーなし
- [x] `pnpm run build` 成功
